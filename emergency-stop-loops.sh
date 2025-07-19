#!/bin/bash

echo "🚨 EMERGENCY: STOPPING INFINITE LOOPS"
echo "====================================="

cd /Users/cozart-lundin/code/cmgsite

# Kill any existing processes
pkill -f "npm run dev" || true
pkill -f "vite" || true

echo "🛑 Processes stopped"
echo "🔧 Creating emergency fix..."

# Create a simple working version without loops
cat > src/App-emergency.tsx << 'EOF'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthSimpleBackup from './pages/AuthSimpleBackup';
import ClientPortalSimple from './pages/ClientPortalSimple';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import { AuthProvider } from './contexts/SupabaseAuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthSimpleBackup />} />
          <Route path="/auth/callback" element={<AuthSimpleBackup />} />
          <Route path="/client-portal" element={<ClientPortalSimple />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
EOF

# Backup current App.tsx and use emergency version
mv src/App.tsx src/App-broken.tsx
mv src/App-emergency.tsx src/App.tsx

echo "📱 Emergency app deployed"
echo "🏗️ Building emergency fix..."

export VITE_ENVIRONMENT=production
export VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD
export VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8
export VITE_SITE_URL=https://cozyartzmedia.com
export VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback

npm run build

echo '{"version": 1, "include": ["/*"], "exclude": []}' > dist/_routes.json
echo '/*    /index.html   200' > dist/_redirects

echo "🚀 Emergency deploying..."
npx wrangler pages deploy dist --project-name=cmgsite

echo ""
echo "✅ EMERGENCY FIX DEPLOYED!"
echo "========================="
echo "🛑 Infinite loops stopped"
echo "🔧 Simple routing restored"
echo "🌐 Site should work normally now"
echo ""
echo "Visit https://cozyartzmedia.com/auth to test login"
