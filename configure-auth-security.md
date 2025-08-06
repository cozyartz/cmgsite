# Supabase Auth Security Configuration

These settings must be configured manually in the Supabase Dashboard to complete the security fixes.

## Required Auth Configuration Changes

### 1. Fix OTP Expiry (WARN → FIXED)

**Current Issue**: OTP expiry exceeds 1 hour recommendation

**Steps to Fix**:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `cmgsite` 
3. Navigate to **Authentication** → **Settings**
4. Find **"Email OTP expiry"** setting
5. Change from current value to **3600 seconds (1 hour)** or less
6. Recommended value: **1800 seconds (30 minutes)**
7. Click **Save**

### 2. Enable Leaked Password Protection (WARN → FIXED)

**Current Issue**: Protection against compromised passwords is disabled

**Steps to Fix**:
1. In the same **Authentication** → **Settings** page
2. Find **"Password Protection"** section
3. Enable **"Leaked Password Protection"**
4. This feature checks passwords against HaveIBeenPwned.org database
5. Click **Save**

## Additional Recommended Auth Security Settings

### 3. Session Settings (Best Practice)

**JWT Expiry**:
- Set to **3600 seconds (1 hour)** for better security
- Located in **Authentication** → **Settings** → **JWT expiry**

**Refresh Token Expiry**:
- Keep default **30 days** or reduce for higher security environments
- Located in **Authentication** → **Settings** → **Refresh token expiry**

### 4. Rate Limiting (Best Practice)

**Email Rate Limiting**:
- Enable if not already active
- Prevents spam and abuse
- Located in **Authentication** → **Rate Limits**

### 5. Password Policy (Best Practice)

**Minimum Password Length**:
- Set to **8 characters minimum**
- Located in **Authentication** → **Settings** → **Password Policy**

**Password Requirements**:
- Enable **"Require uppercase letters"**
- Enable **"Require lowercase letters"** 
- Enable **"Require numbers"**
- Enable **"Require special characters"**

## Configuration Verification

After making these changes:

### Test OTP Functionality
1. Trigger a magic link email
2. Verify the link expires within the configured timeframe
3. Test with both valid and expired links

### Test Password Protection
1. Try creating an account with a known compromised password (e.g., "password123")
2. Verify it's rejected with appropriate error message
3. Test with a secure password to ensure it's accepted

### Test Rate Limiting
1. Send multiple magic link requests rapidly
2. Verify rate limiting kicks in after threshold
3. Test normal usage still works

## Security Compliance Checklist

After applying all fixes:

- ✅ **Database Security Issues**: Fixed via migration `007_fix_security_issues.sql`
- ✅ **OTP Expiry**: Configured to 30 minutes
- ✅ **Leaked Password Protection**: Enabled
- ✅ **Rate Limiting**: Configured
- ✅ **Strong Password Policy**: Enabled

## Environment Variables

No additional environment variables are needed for these auth settings. All configuration is done through the Supabase Dashboard.

## Monitoring

After implementing these changes, monitor:

1. **Authentication Error Logs**: Check for any new authentication failures
2. **User Feedback**: Ensure users can still sign in/up normally  
3. **Security Alerts**: Watch for any unusual authentication patterns
4. **Performance**: Verify auth flows still perform well

## Rollback Plan

If issues arise:

1. **OTP Expiry**: Increase back to previous value temporarily
2. **Password Protection**: Can be disabled temporarily if blocking legitimate users
3. **Rate Limits**: Can be adjusted or temporarily disabled
4. **Password Policy**: Can be relaxed temporarily

## Support

For issues with these configurations:
- Check Supabase Dashboard logs under **Logs** → **Auth**
- Review Supabase documentation: https://supabase.com/docs/guides/auth
- Contact support if auth completely breaks

This completes the security configuration requirements for the Supabase auth system.