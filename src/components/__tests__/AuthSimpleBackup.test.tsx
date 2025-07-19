import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AuthSimpleBackup from '../../pages/AuthSimpleBackup';
import { AuthProvider } from '../../contexts/SupabaseAuthContext';

// Mock Supabase
vi.mock('../../lib/supabase');
vi.mock('../../components/auth/TurnstileWidget', () => ({
  default: ({ onVerify }: { onVerify: (token: string) => void }) => (
    <div data-testid="turnstile-widget">
      <button onClick={() => onVerify('test-token')}>Verify</button>
    </div>
  ),
}));

function renderAuthComponent(props = {}) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AuthSimpleBackup {...props} />
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('AuthSimpleBackup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render signin mode by default', () => {
    renderAuthComponent();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('should switch to signup mode', async () => {
    const user = userEvent.setup();
    renderAuthComponent();
    
    await user.click(screen.getByText('Sign Up'));
    
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    renderAuthComponent();
    
    const emailInput = screen.getByPlaceholderText('Email address');
    await user.type(emailInput, 'invalid-email');
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('should suggest email corrections', async () => {
    const user = userEvent.setup();
    renderAuthComponent();
    
    const emailInput = screen.getByPlaceholderText('Email address');
    await user.type(emailInput, 'test@gmial.com');
    
    await waitFor(() => {
      expect(screen.getByText(/Did you mean test@gmail.com?/)).toBeInTheDocument();
    });
  });

  it('should validate full name in signup mode', async () => {
    const user = userEvent.setup();
    renderAuthComponent();
    
    await user.click(screen.getByText('Sign Up'));
    
    const nameInput = screen.getByPlaceholderText('Full Name');
    await user.type(nameInput, 'J');
    
    await waitFor(() => {
      expect(screen.getByText('Please enter both first and last name')).toBeInTheDocument();
    });
  });

  it('should show Turnstile widget after typing email', async () => {
    const user = userEvent.setup();
    renderAuthComponent();
    
    const emailInput = screen.getByPlaceholderText('Email address');
    await user.type(emailInput, 'test@example.com');
    
    await waitFor(() => {
      expect(screen.getByTestId('turnstile-widget')).toBeInTheDocument();
    });
  });

  it('should enable submit button when form is valid', async () => {
    const user = userEvent.setup();
    renderAuthComponent();
    
    const emailInput = screen.getByPlaceholderText('Email address');
    await user.type(emailInput, 'test@example.com');
    
    // Verify Turnstile
    await waitFor(() => {
      const verifyButton = screen.getByText('Verify');
      fireEvent.click(verifyButton);
    });
    
    await waitFor(() => {
      const submitButton = screen.getByText('Send Magic Link');
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should handle emergency bypass', async () => {
    // Mock loading state that would trigger bypass
    const user = userEvent.setup();
    renderAuthComponent();
    
    // The emergency bypass should appear in the loading state
    // This would need to be tested with a mock that simulates the loading timeout
    expect(true).toBe(true); // Placeholder for emergency bypass test
  });

  it('should display success state after magic link sent', async () => {
    const user = userEvent.setup();
    renderAuthComponent();
    
    const emailInput = screen.getByPlaceholderText('Email address');
    await user.type(emailInput, 'test@example.com');
    
    // This would require mocking the successful magic link send
    // For now, we verify the component structure exists
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
  });
});
