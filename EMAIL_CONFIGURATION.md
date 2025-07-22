# Cozyartz Media Group Email Configuration Documentation

## Overview

This document provides comprehensive setup and configuration details for all email services used by Cozyartz Media Group. Our email infrastructure uses AWS SES for transactional and marketing emails across multiple domains with proper authentication and deliverability optimization.

## Table of Contents

1. [Domain Email Strategy](#domain-email-strategy)
2. [AWS SES Configuration](#aws-ses-configuration)
3. [DNS Records](#dns-records)
4. [Email Authentication](#email-authentication)
5. [Subdomain Structure](#subdomain-structure)
6. [Troubleshooting](#troubleshooting)
7. [Email Usage Guidelines](#email-usage-guidelines)

## Domain Email Strategy

### Primary Domains

**cozyartz.com** - Main business domain
- Primary business communications
- Contact forms and customer support
- General company correspondence

**cozyartzmedia.com** - Business website domain  
- Marketing and promotional emails
- Newsletter and announcements
- Client portal notifications

**zserved.com** - Legal platform domain
- Legal document notifications
- Attorney-client communications
- System alerts for legal compliance

**astrolms.com** - Learning platform domain
- Educational system notifications
- Student/instructor communications
- AI learning disability detection alerts

## AWS SES Configuration

### Verified Domains

All domains are configured with AWS SES in the `us-east-1` region for optimal deliverability:

1. **cozyartz.com** - Root domain for business emails
2. **transaction.cozyartz.com** - Transactional subdomain
3. **transaction.zserved.com** - Legal platform transactions
4. **transactions.astrolms.com** - Learning platform transactions
5. **marketing.zserved.com** - Marketing communications (planned)

### Domain Verification Process

For each domain, AWS SES requires:
1. Domain identity verification via TXT record
2. DKIM authentication via 3 CNAME records
3. SPF record for sender authentication
4. DMARC policy for email security

## DNS Records

### cozyartz.com Configuration

#### Domain Verification
```dns
Type: TXT
Name: _amazonses.cozyartz.com
Value: [AWS SES Verification Token]
TTL: 300
```

#### DKIM Authentication (3 records)
```dns
Type: CNAME
Name: nym22v7itttksmcyzdeuvrjedaz27pno._domainkey.cozyartz.com
Value: nym22v7itttksmcyzdeuvrjedaz27pno.dkim.amazonses.com
TTL: 300

Type: CNAME
Name: aagtxuzjttigbmwddqdyjeeqtcb3ydnn._domainkey.cozyartz.com
Value: aagtxuzjttigbmwddqdyjeeqtcb3ydnn.dkim.amazonses.com
TTL: 300

Type: CNAME
Name: klqs3qd7znde4tqzhfwga3txz3jontpo._domainkey.cozyartz.com
Value: klqs3qd7znde4tqzhfwga3txz3jontpo.dkim.amazonses.com
TTL: 300
```

#### SPF Record
```dns
Type: TXT
Name: cozyartz.com
Value: v=spf1 include:amazonses.com ~all
TTL: 300
```

#### DMARC Policy
```dns
Type: TXT
Name: _dmarc.cozyartz.com
Value: v=DMARC1; p=none;
TTL: 300
```

### transaction.cozyartz.com Configuration

#### SPF Record
```dns
Type: TXT
Name: transaction.cozyartz.com
Value: v=spf1 include:amazonses.com ~all
TTL: 300
```

#### MX Record (for bounce handling)
```dns
Type: MX
Name: transaction.cozyartz.com
Value: feedback-smtp.us-east-2.amazonses.com
Priority: 10
TTL: 300
```

### zserved.com Configuration

#### Main Domain SPF (Microsoft 365 + AWS SES)
```dns
Type: TXT
Name: zserved.com
Value: v=spf1 include:spf.protection.outlook.com include:amazonses.com ~all
TTL: 300
```

#### Microsoft 365 Records
```dns
Type: MX
Name: zserved.com
Value: zserved-com.mail.protection.outlook.com
Priority: 0
TTL: 300

Type: TXT
Name: zserved.com
Value: MS=ms95850591
TTL: 300

Type: CNAME
Name: autodiscover.zserved.com
Value: autodiscover.outlook.com
TTL: 300
```

#### Transaction Subdomain SPF
```dns
Type: TXT
Name: transaction.zserved.com
Value: v=spf1 include:amazonses.com ~all
TTL: 300
```

#### Transaction DKIM Records
```dns
Type: CNAME
Name: ubxnguxzatwxtbtcw3arupyjifxsdwkk._domainkey.transaction.zserved.com
Value: ubxnguxzatwxtbtcw3arupyjifxsdwkk.dkim.amazonses.com
TTL: 300

Type: CNAME
Name: s7t5azpggc3x3ohi6gdoqf5jv2i7ebhb._domainkey.transaction.zserved.com
Value: s7t5azpggc3x3ohi6gdoqf5jv2i7ebhb.dkim.amazonses.com
TTL: 300

Type: CNAME
Name: bnpd4r7rlcjysc2zi2yf5an2j4et6aik._domainkey.transaction.zserved.com
Value: bnpd4r7rlcjysc2zi2yf5an2j4et6aik.dkim.amazonses.com
TTL: 300
```

### astrolms.com Configuration

#### Transaction Subdomain SPF
```dns
Type: TXT
Name: transactions.astrolms.com
Value: v=spf1 include:amazonses.com ~all
TTL: 300
```

#### Transaction DKIM Records
```dns
Type: CNAME
Name: hdkris6hnap2h6kngp7rql4j3ullmo5r._domainkey.transactions.astrolms.com
Value: hdkris6hnap2h6kngp7rql4j3ullmo5r.dkim.amazonses.com
TTL: 300

Type: CNAME
Name: tsbs2paapbrt2yt47r52wifr6gx6xdkq._domainkey.transactions.astrolms.com
Value: tsbs2paapbrt2yt47r52wifr6gx6xdkq.dkim.amazonses.com
TTL: 300

Type: CNAME
Name: donev2qyuwgpqzg5yuauqwcwzgzqbqtl._domainkey.transactions.astrolms.com
Value: donev2qyuwgpqzg5yuauqwcwzgzqbqtl.dkim.amazonses.com
TTL: 300
```

## Email Authentication

### SPF (Sender Policy Framework)

SPF records specify which IP addresses and domains are authorized to send email on behalf of a domain.

**Key Points:**
- Always include `include:amazonses.com` for AWS SES
- For Microsoft 365 domains, include `include:spf.protection.outlook.com`
- Use `~all` for soft fail (recommended for testing)
- Use `-all` for hard fail (production ready)

### DKIM (DomainKeys Identified Mail)

DKIM uses cryptographic signatures to verify email authenticity.

**Configuration:**
- AWS SES provides 3 DKIM CNAME records per domain
- Each record contains a unique selector and points to amazonses.com
- DKIM keys are automatically rotated by AWS

### DMARC (Domain-based Message Authentication)

DMARC builds on SPF and DKIM to prevent email spoofing.

**Policy Levels:**
- `p=none` - Monitor only (testing phase)
- `p=quarantine` - Suspicious emails go to spam
- `p=reject` - Failed emails are rejected completely

## Subdomain Structure

### Email Type Separation

**Business Communications:**
- `@cozyartz.com` - Main business emails
- `@zserved.com` - Legal platform (Microsoft 365)

**Transactional Emails:**
- `@transaction.cozyartz.com` - Business system emails
- `@transaction.zserved.com` - Legal platform notifications
- `@transactions.astrolms.com` - Learning platform alerts

**Marketing Emails:**
- `@marketing.zserved.com` - Newsletter and campaigns (planned)

### Benefits of Subdomain Strategy

1. **Reputation Isolation** - Transactional vs. marketing email reputation
2. **Deliverability Optimization** - Different sending patterns per subdomain
3. **Clear Organization** - Easy to identify email purpose
4. **Analytics Separation** - Track performance by email type

## Email Usage Guidelines

### Recommended From Addresses

**Business Communications (cozyartz.com):**
- `hello@cozyartz.com` - General inquiries
- `contact@cozyartz.com` - Contact form submissions
- `support@cozyartz.com` - Customer support
- `info@cozyartz.com` - Information requests

**Transactional (transaction.cozyartz.com):**
- `noreply@transaction.cozyartz.com` - System notifications
- `notifications@transaction.cozyartz.com` - Alert emails
- `receipts@transaction.cozyartz.com` - Payment confirmations

**Legal Platform (zserved.com - Microsoft 365):**
- `amy@zserved.com` - Amy's business email
- `andrea@zserved.com` - Andrea's business email
- `dao@zserved.com` - DAO-related communications
- `investors@zserved.com` - Investment inquiries

**Legal Transactions (transaction.zserved.com):**
- `system@transaction.zserved.com` - System alerts
- `documents@transaction.zserved.com` - Document processing
- `compliance@transaction.zserved.com` - Legal compliance alerts

**Learning Platform (transactions.astrolms.com):**
- `system@transactions.astrolms.com` - Platform notifications
- `alerts@transactions.astrolms.com` - AI detection alerts
- `reports@transactions.astrolms.com` - Learning reports

### Email Volume Recommendations

**AWS SES Limits:**
- Start with sandbox mode (200 emails/day, 1 email/second)
- Request production access for higher limits
- Monitor bounce and complaint rates (<5% bounce, <0.1% complaint)

**Best Practices:**
- Use appropriate subdomain for email type
- Include unsubscribe links in marketing emails
- Monitor email authentication (SPF, DKIM, DMARC) status
- Regularly review bounce and complaint reports

## Troubleshooting

### Common Issues

#### 1. SPF Authentication Failures
**Symptoms:** Emails marked as spam or rejected
**Solution:** Verify SPF record includes all sending sources
```bash
# Check SPF record
dig TXT cozyartz.com | grep spf1
```

#### 2. DKIM Signature Issues
**Symptoms:** DKIM verification fails in email headers
**Solution:** Verify all 3 DKIM CNAME records are correct
```bash
# Check DKIM records
dig CNAME nym22v7itttksmcyzdeuvrjedaz27pno._domainkey.cozyartz.com
```

#### 3. Domain Not Verified
**Symptoms:** AWS SES shows "Verification pending"
**Solution:** Check domain verification TXT record
```bash
# Check domain verification
dig TXT _amazonses.cozyartz.com
```

#### 4. High Bounce Rate
**Symptoms:** AWS SES warns about bounce rate
**Solution:** 
- Clean email lists regularly
- Use double opt-in for subscriptions
- Monitor bounce notifications

#### 5. Microsoft 365 + AWS SES Conflicts
**Symptoms:** Email authentication failures
**Solution:** Ensure SPF record includes both services:
```
v=spf1 include:spf.protection.outlook.com include:amazonses.com ~all
```

### DNS Propagation

DNS changes can take up to 48 hours to fully propagate. Use these tools to check:

**Online Tools:**
- whatsmydns.net
- dnschecker.org
- mxtoolbox.com

**Command Line:**
```bash
# Check from different DNS servers
dig @8.8.8.8 TXT cozyartz.com
dig @1.1.1.1 TXT cozyartz.com
```

### AWS SES Console Checks

1. **Identity Status** - Ensure all domains show "Verified"
2. **DKIM Status** - All DKIM records should be "Successful"
3. **Bounce Rate** - Keep under 5%
4. **Complaint Rate** - Keep under 0.1%
5. **Reputation** - Monitor sending reputation metrics

## Maintenance Tasks

### Monthly Reviews
- [ ] Check bounce and complaint rates
- [ ] Review email sending patterns
- [ ] Verify domain and DKIM status
- [ ] Monitor AWS SES reputation metrics

### Quarterly Tasks
- [ ] Review and clean email lists
- [ ] Audit DNS records for accuracy
- [ ] Test email deliverability to major providers
- [ ] Update DMARC policy if needed

### Annual Tasks
- [ ] Review email subdomain strategy
- [ ] Evaluate need for additional domains
- [ ] Audit email authentication setup
- [ ] Review AWS SES sending limits and costs

## Security Considerations

### Domain Protection
- Monitor for unauthorized use of domains
- Set up DMARC reporting to track authentication failures
- Regularly review DNS records for unauthorized changes

### Access Control
- Limit AWS SES access to necessary personnel
- Use IAM roles with minimal required permissions
- Enable AWS CloudTrail for API call logging

### Email Content Security
- Never include sensitive information in emails
- Use secure links for password resets
- Implement proper unsubscribe mechanisms

## Contact Information

For questions about this email configuration:

**Technical Issues:** andrea@zserved.com
**Business Questions:** amy@zserved.com
**General Support:** hello@cozyartz.com

---

**Last Updated:** 2025-07-22
**Document Version:** 1.0
**Maintained By:** Cozyartz Media Group Technical Team