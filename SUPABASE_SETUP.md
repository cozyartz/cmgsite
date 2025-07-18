# Supabase Setup Guide for cmgsite

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Sign in and create a new project
3. Choose a project name: `cmgsite` or `cozyartz-media-group`
4. Select your region (closest to your users)
5. Wait for the project to be created

## Step 2: Get Project Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values to your `.env` file:
   - **URL**: Copy to `VITE_SUPABASE_URL`
   - **anon public key**: Copy to `VITE_SUPABASE_ANON_KEY`
   - **service_role key**: Copy to `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Configure Authentication Settings

1. Go to **Authentication** → **Settings**
2. Set **Site URL** to: `https://cozyartzmedia.com`
3. Add **Redirect URLs**:
   - `https://cozyartzmedia.com/auth/callback`
   - `http://localhost:5173/auth/callback` (for development)

## Step 4: Enable OAuth Providers

### GitHub OAuth
1. Go to **Authentication** → **Providers** → **GitHub**
2. Enable GitHub provider
3. Enter your GitHub OAuth credentials:
   - **Client ID**: From your GitHub OAuth app
   - **Client Secret**: From your GitHub OAuth app
4. **Redirect URL for GitHub**: `https://uncynkmprbzgzvonafoe.supabase.co/auth/v1/callback`

### Google OAuth
1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Enter your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. **Redirect URL for Google**: `https://uncynkmprbzgzvonafoe.supabase.co/auth/v1/callback`

## Step 5: Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the SQL script from `supabase-schema.sql`
3. This will create:
   - `profiles` table with user data
   - Row Level Security policies
   - Automatic profile creation trigger
   - Superadmin role assignment

## Step 6: Configure OAuth Apps

### GitHub OAuth App Settings
- **Application name**: `Cozyartz Media Group - Client Portal`
- **Homepage URL**: `https://cozyartzmedia.com`
- **Authorization callback URL**: `https://uncynkmprbzgzvonafoe.supabase.co/auth/v1/callback`

### Google OAuth App Settings
- **Application name**: `Cozyartz Media Group`
- **Authorized JavaScript origins**: `https://cozyartzmedia.com`
- **Authorized redirect URIs**: `https://uncynkmprbzgzvonafoe.supabase.co/auth/v1/callback`

## Step 7: Test Authentication

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:5173/auth`
3. Test both GitHub and Google OAuth flows
4. Verify that superadmin users get admin role in the database

## Step 8: Production Deployment

1. Update environment variables in Cloudflare Workers
2. Deploy the application: `npm run deploy:production`
3. Test authentication on production domain

## Troubleshooting

### Common Issues:
- **Redirect URL mismatch**: Ensure URLs match exactly in OAuth apps and Supabase
- **CORS errors**: Check Site URL and Redirect URLs in Supabase settings
- **Profile not created**: Check the trigger function in SQL Editor

### Debugging:
- Check browser console for error messages
- Use Supabase dashboard **Logs** section to debug auth issues
- Verify user creation in **Authentication** → **Users**

## Security Notes

- **Never commit** your service role key to version control
- **Use environment variables** for all sensitive credentials
- **Row Level Security** policies protect user data
- **Admin detection** is automatic based on email/GitHub username

## Next Steps

Once authentication is working:
1. Consider migrating database tables from Cloudflare D1 to Supabase
2. Add real-time features for dashboard updates
3. Implement file storage with Supabase Storage
4. Add advanced analytics and reporting features