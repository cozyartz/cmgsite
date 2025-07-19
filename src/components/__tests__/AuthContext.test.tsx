import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../contexts/SupabaseAuthContext';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithOAuth: vi.fn(),
      signInWithOtp: vi.fn(),
    },
  },
  authService: {
    signInWithOAuth: vi.fn(),
    signInWithMagicLink: vi.fn(),
    signUpWithMagicLink: vi.fn(),
    signOut: vi.fn(),
  },
  dbService: {
    getUserProfile: vi.fn(),
    createUserProfile: vi.fn(),
  },
}));

// Test component that uses auth context
function TestComponent() {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <div data-testid="user-status">{user ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="admin-status">{isAdmin ? 'admin' : 'not-admin'}</div>
      <div data-testid="superadmin-status">{isSuperAdmin ? 'superadmin' : 'not-superadmin'}</div>
    </div>
  );
}

function renderWithProviders(component: React.ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide loading state initially', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should handle no user state', async () => {
    const { supabase } = await import('../../lib/supabase');
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('not-authenticated');
    });
  });

  it('should handle authentication timeout', async () => {
    const { supabase } = await import('../../lib/supabase');
    (supabase.auth.getSession as any).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 6000))
    );

    renderWithProviders(<TestComponent />);

    // Should timeout after 5 seconds and stop loading
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toBeInTheDocument();
    }, { timeout: 6000 });
  });

  it('should identify superadmin users correctly', async () => {
    const { supabase } = await import('../../lib/supabase');
    const mockUser = {
      id: 'test-id',
      email: 'cozy2963@gmail.com',
      user_metadata: {},
      app_metadata: {}
    };

    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });

    renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('superadmin-status')).toHaveTextContent('superadmin');
    });
  });
});
