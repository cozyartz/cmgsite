# AWS SES Email Authentication Testing

This guide will help you test all AWS SES email configurations for AutiMind's domains by sending test emails to `cozycoding@proton.me`.

## Quick Setup & Run

### 1. Install AWS SDK
```bash
cd /Users/cozart-lundin/code/cmgsite
npm install @aws-sdk/client-ses
```

### 2. Configure AWS Credentials
Make sure your AWS credentials are configured. Choose one method:

**Option A: AWS CLI (if installed)**
```bash
aws configure
```

**Option B: Environment Variables**
```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1
```

**Option C: AWS Profile**
```bash
export AWS_PROFILE=your-profile-name
```

### 3. Run the Test
```bash
node test-email-setup.js
```

## What the Test Does

The script will test **4 domains** with **16 total email addresses**:

### 🏢 cozyartz.com (Main Business Domain)
- test@cozyartz.com
- hello@cozyartz.com  
- support@cozyartz.com
- notifications@cozyartz.com

### 💼 transaction.cozyartz.com (Business Transactions)
- test@transaction.cozyartz.com
- noreply@transaction.cozyartz.com
- notifications@transaction.cozyartz.com
- system@transaction.cozyartz.com

### ⚖️ transaction.zserved.com (Legal Platform)
- test@transaction.zserved.com
- system@transaction.zserved.com
- notifications@transaction.zserved.com
- documents@transaction.zserved.com

### 🎓 transactions.astrolms.com (Learning Platform)
- test@transactions.astrolms.com
- system@transactions.astrolms.com
- reports@transactions.astrolms.com
- alerts@transactions.astrolms.com

## Test Validation Checklist

### ✅ What to Check in Your Proton Mail Inbox

1. **Email Delivery** - All 16 emails arrive in inbox (not spam)
2. **From Address Display** - Each email shows the correct sender address
3. **Subject Lines** - Should be "AWS SES Test X/16 - [domain] Authentication Test"
4. **Content Rendering** - HTML content displays properly

### ✅ Email Header Authentication (Critical!)

For each email, check headers in Proton Mail:
1. Open email → Click three dots (⋯) → "View headers"
2. Look for **Authentication-Results** section
3. Verify these entries:

```
Authentication-Results: proton.me;
  spf=pass smtp.mailfrom=[domain];
  dkim=pass header.d=[domain];
  dmarc=pass (policy=none) header.from=[domain]
```

### ✅ Expected Results per Domain

**cozyartz.com:**
```
spf=pass smtp.mailfrom=cozyartz.com
dkim=pass header.d=cozyartz.com
dmarc=pass header.from=cozyartz.com
```

**transaction.cozyartz.com:**
```
spf=pass smtp.mailfrom=transaction.cozyartz.com
dkim=pass header.d=transaction.cozyartz.com
dmarc=pass header.from=transaction.cozyartz.com
```

**transaction.zserved.com:**
```
spf=pass smtp.mailfrom=transaction.zserved.com
dkim=pass header.d=transaction.zserved.com
dmarc=pass header.from=transaction.zserved.com
```

**transactions.astrolms.com:**
```
spf=pass smtp.mailfrom=transactions.astrolms.com
dkim=pass header.d=transactions.astrolms.com
dmarc=pass header.from=transactions.astrolms.com
```

## Troubleshooting

### If Tests Fail to Send
1. **Check AWS credentials** - Verify access key and region
2. **Verify domain status** - Check AWS SES console for "Verified" status
3. **Check SES limits** - Ensure you're not in sandbox mode or hit limits
4. **Review IAM permissions** - Ensure `ses:SendEmail` permission

### If Authentication Fails
1. **SPF Failure** - Check DNS SPF records in Cloudflare
2. **DKIM Failure** - Verify all 3 DKIM CNAME records exist
3. **DMARC Failure** - Check DMARC policy record

### If Emails Go to Spam
1. **Content issues** - Review email content for spam triggers
2. **Reputation** - New domains may initially go to spam
3. **Volume** - Too many emails too quickly can trigger filters

## Post-Test Actions

### ✅ If All Tests Pass
- **Document success** - Update EMAIL_CONFIGURATION.md with test date
- **Monitor metrics** - Watch bounce/complaint rates in AWS SES
- **Schedule regular tests** - Run monthly to ensure continued functionality

### ❌ If Tests Fail
1. **Review error messages** from the test script
2. **Check AWS SES console** for domain verification status
3. **Verify DNS records** in Cloudflare match documentation
4. **Test individual domains** using AWS SES console send test feature

## Email Header Examples

### Good Authentication Result
```
Authentication-Results: proton.me;
	arc=none;
	dkim=pass header.d=cozyartz.com header.s=nym22v7itttksmcyzdeuvrjedaz27pno header.b=abc123;
	dmarc=pass (policy=none) header.from=cozyartz.com;
	spf=pass (proton.me: domain of test@cozyartz.com designates 54.240.8.169 as permitted sender) smtp.mailfrom=test@cozyartz.com;
```

### Bad Authentication Result (Needs Fixing)
```
Authentication-Results: proton.me;
	dkim=fail (signature verification failed) header.d=cozyartz.com;
	dmarc=fail (SPF and DKIM both failed) header.from=cozyartz.com;
	spf=fail (proton.me: domain of test@cozyartz.com does not designate 54.240.8.169 as permitted sender);
```

## Support

If you encounter issues:
1. **Check EMAIL_CONFIGURATION.md** for DNS record details
2. **Review AWS SES console** for error messages  
3. **Contact AWS SES support** if domain verification fails

---

**Test created:** 2025-07-22  
**Domains tested:** cozyartz.com, transaction.cozyartz.com, transaction.zserved.com, transactions.astrolms.com  
**Total test emails:** 16