import { Resend } from 'resend';

// Resend email service integration with official SDK
export class EmailService {
  constructor(apiKey, fromEmail = 'hello@cozyartzmedia.com') {
    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async sendEmail({ to, subject, html, text, replyTo = null, scheduledAt = null }) {
    try {
      const emailData = {
        from: this.fromEmail,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        reply_to: replyTo
      };

      // Add scheduling if specified
      if (scheduledAt) {
        emailData.scheduledAt = scheduledAt;
      }

      const data = await this.resend.emails.send(emailData);

      return {
        success: true,
        id: data.id,
        data
      };
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Batch send multiple emails
  async sendBatchEmails(emails) {
    try {
      const emailsWithFrom = emails.map(email => ({
        ...email,
        from: email.from || this.fromEmail,
        to: Array.isArray(email.to) ? email.to : [email.to]
      }));

      const data = await this.resend.batch.send(emailsWithFrom);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Batch email sending error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get email status
  async getEmailStatus(emailId) {
    try {
      const data = await this.resend.emails.get(emailId);
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Get email status error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update scheduled email
  async updateScheduledEmail(emailId, scheduledAt) {
    try {
      const data = await this.resend.emails.update({
        id: emailId,
        scheduledAt
      });
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Update scheduled email error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Cancel scheduled email
  async cancelScheduledEmail(emailId) {
    try {
      const data = await this.resend.emails.cancel(emailId);
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Cancel scheduled email error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Welcome email for new users
  async sendWelcomeEmail(userEmail, userName, clientName) {
    const html = this.getWelcomeEmailTemplate(userName, clientName);
    const text = this.getWelcomeEmailText(userName, clientName);

    return await this.sendEmail({
      to: userEmail,
      subject: `Welcome to Cozyartz SEO Platform, ${userName}!`,
      html,
      text
    });
  }

  // Coupon redemption confirmation
  async sendCouponRedemptionEmail(userEmail, userName, couponCode, discountAmount, duration) {
    const html = this.getCouponRedemptionTemplate(userName, couponCode, discountAmount, duration);
    const text = this.getCouponRedemptionText(userName, couponCode, discountAmount, duration);

    return await this.sendEmail({
      to: userEmail,
      subject: `Coupon ${couponCode} Successfully Applied!`,
      html,
      text
    });
  }

  // Payment confirmation email
  async sendPaymentConfirmationEmail(userEmail, userName, amount, description, paymentId) {
    const html = this.getPaymentConfirmationTemplate(userName, amount, description, paymentId);
    const text = this.getPaymentConfirmationText(userName, amount, description, paymentId);

    return await this.sendEmail({
      to: userEmail,
      subject: `Payment Confirmation - ${description}`,
      html,
      text
    });
  }

  // Prepayment confirmation email
  async sendPrepaymentConfirmationEmail(userEmail, userName, tier, months, amountPaid, savings, endDate) {
    const html = this.getPrepaymentConfirmationTemplate(userName, tier, months, amountPaid, savings, endDate);
    const text = this.getPrepaymentConfirmationText(userName, tier, months, amountPaid, savings, endDate);

    return await this.sendEmail({
      to: userEmail,
      subject: `Prepayment Confirmation - ${months} Months of ${tier} Plan`,
      html,
      text
    });
  }

  // Billing reminder email
  async sendBillingReminderEmail(userEmail, userName, amount, dueDate, invoiceId) {
    const html = this.getBillingReminderTemplate(userName, amount, dueDate, invoiceId);
    const text = this.getBillingReminderText(userName, amount, dueDate, invoiceId);

    return await this.sendEmail({
      to: userEmail,
      subject: `Billing Reminder - Invoice Due ${dueDate}`,
      html,
      text
    });
  }

  // Usage limit warning email
  async sendUsageLimitWarningEmail(userEmail, userName, currentUsage, limit, tier) {
    const html = this.getUsageLimitWarningTemplate(userName, currentUsage, limit, tier);
    const text = this.getUsageLimitWarningText(userName, currentUsage, limit, tier);

    return await this.sendEmail({
      to: userEmail,
      subject: `AI Usage Warning - ${Math.round((currentUsage/limit)*100)}% of Monthly Limit Used`,
      html,
      text
    });
  }

  // Domain limit warning email
  async sendDomainLimitWarningEmail(userEmail, userName, currentDomains, limit, tier) {
    const html = this.getDomainLimitWarningTemplate(userName, currentDomains, limit, tier);
    const text = this.getDomainLimitWarningText(userName, currentDomains, limit, tier);

    return await this.sendEmail({
      to: userEmail,
      subject: `Domain Limit Reached - Consider Upgrading Your Plan`,
      html,
      text
    });
  }

  // Special advisor email for Amy Tipton
  async sendAdvisorWelcomeEmail(userEmail, userName, couponCode, description) {
    const html = this.getAdvisorWelcomeTemplate(userName, couponCode, description);
    const text = this.getAdvisorWelcomeText(userName, couponCode, description);

    return await this.sendEmail({
      to: userEmail,
      subject: `Welcome to Your Exclusive SEO Platform Access`,
      html,
      text,
      replyTo: 'hello@cozyartzmedia.com'
    });
  }

  // Special client welcome email for Jon Werbeck
  async sendClientWelcomeEmail(userEmail, userName, couponCode, description) {
    const html = this.getClientWelcomeTemplate(userName, couponCode, description);
    const text = this.getClientWelcomeText(userName, couponCode, description);

    return await this.sendEmail({
      to: userEmail,
      subject: `Welcome to Your Premium SEO Platform`,
      html,
      text,
      replyTo: 'hello@cozyartzmedia.com'
    });
  }

  // Testing request email for Amy Tipton
  async sendTestingRequestEmail(advisorEmail, advisorName) {
    const html = this.getTestingRequestTemplate(advisorName);
    const text = this.getTestingRequestText(advisorName);

    return await this.sendEmail({
      to: advisorEmail,
      subject: `Exclusive Preview: Test Our Revolutionary SEO Platform + 6 Months Free`,
      html,
      text,
      replyTo: 'hello@cozyartzmedia.com'
    });
  }

  // Email templates
  getWelcomeEmailTemplate(userName, clientName) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Cozyartz SEO Platform</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #14b8a6, #0f766e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .button { display: inline-block; background: #14b8a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .feature { margin: 15px 0; padding: 15px; background: #f0fdfa; border-left: 4px solid #14b8a6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Cozyartz SEO Platform!</h1>
      <p>Your AI-powered SEO success journey starts now</p>
    </div>
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>Welcome to the Cozyartz SEO Platform! We're excited to help you transform your digital presence with our AI-powered tools and expert insights.</p>
      
      <p>Your account for <strong>${clientName}</strong> is now active and ready to use.</p>

      <div class="feature">
        <h3>🚀 What's Next?</h3>
        <ul>
          <li>Set up your first SEO project</li>
          <li>Add your domains for tracking</li>
          <li>Explore our AI content generation tools</li>
          <li>Review your analytics dashboard</li>
        </ul>
      </div>

      <div class="feature">
        <h3>💡 Pro Tips to Get Started</h3>
        <ul>
          <li>Connect your Google Search Console for enhanced data</li>
          <li>Use our AI keyword research tools for content planning</li>
          <li>Set up automated reporting for your team</li>
          <li>Book a consultation call if you need strategy guidance</li>
        </ul>
      </div>

      <a href="https://cozyartzmedia.com/client-portal" class="button">Access Your Dashboard</a>

      <p>If you have any questions, our team is here to help. Simply reply to this email or contact us at hello@cozyartzmedia.com.</p>
      
      <p>Ready to dominate search results?</p>
      <p>The Cozyartz Team</p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
      <p>This email was sent to ${userName} regarding their Cozyartz SEO Platform account.</p>
    </div>
  </div>
</body>
</html>`;
  }

  getWelcomeEmailText(userName, clientName) {
    return `Welcome to Cozyartz SEO Platform!

Hi ${userName},

Welcome to the Cozyartz SEO Platform! We're excited to help you transform your digital presence with our AI-powered tools and expert insights.

Your account for ${clientName} is now active and ready to use.

What's Next:
- Set up your first SEO project
- Add your domains for tracking  
- Explore our AI content generation tools
- Review your analytics dashboard

Pro Tips to Get Started:
- Connect your Google Search Console for enhanced data
- Use our AI keyword research tools for content planning
- Set up automated reporting for your team
- Book a consultation call if you need strategy guidance

Access your dashboard: https://cozyartzmedia.com/client-portal

If you have any questions, our team is here to help. Simply reply to this email or contact us at hello@cozyartzmedia.com.

Ready to dominate search results?
The Cozyartz Team

Cozyartz Media Group | Battle Creek, MI | (269) 261-0069`;
  }

  getCouponRedemptionTemplate(userName, couponCode, discountAmount, duration) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Coupon Applied Successfully</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .coupon-box { background: #ecfdf5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .savings { font-size: 24px; font-weight: bold; color: #059669; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Coupon Applied Successfully!</h1>
    </div>
    <div class="content">
      <h2>Great news, ${userName}!</h2>
      <p>Your coupon code <strong>${couponCode}</strong> has been successfully applied to your account.</p>
      
      <div class="coupon-box">
        <div class="savings">$${(discountAmount/100).toFixed(2)} OFF</div>
        <p>per month for ${duration} months</p>
        <p><strong>Total Savings: $${((discountAmount * duration)/100).toFixed(2)}</strong></p>
      </div>

      <p>This discount will be automatically applied to your next ${duration} billing cycles. You don't need to do anything else - just enjoy the savings!</p>
      
      <p>Your reduced pricing will be reflected in your next invoice and dashboard.</p>

      <p>Questions about your discount? We're here to help at hello@cozyartzmedia.com.</p>
      
      <p>Thanks for being a valued client!</p>
      <p>The Cozyartz Team</p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
    </div>
  </div>
</body>
</html>`;
  }

  getCouponRedemptionText(userName, couponCode, discountAmount, duration) {
    return `Coupon Applied Successfully!

Great news, ${userName}!

Your coupon code ${couponCode} has been successfully applied to your account.

Savings Details:
- $${(discountAmount/100).toFixed(2)} OFF per month
- Valid for ${duration} months  
- Total Savings: $${((discountAmount * duration)/100).toFixed(2)}

This discount will be automatically applied to your next ${duration} billing cycles. You don't need to do anything else - just enjoy the savings!

Your reduced pricing will be reflected in your next invoice and dashboard.

Questions about your discount? We're here to help at hello@cozyartzmedia.com.

Thanks for being a valued client!
The Cozyartz Team

Cozyartz Media Group | Battle Creek, MI | (269) 261-0069`;
  }

  getPaymentConfirmationTemplate(userName, amount, description, paymentId) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .payment-details { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .amount { font-size: 24px; font-weight: bold; color: #1d4ed8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Payment Confirmed</h1>
    </div>
    <div class="content">
      <h2>Thank you, ${userName}!</h2>
      <p>Your payment has been successfully processed.</p>
      
      <div class="payment-details">
        <h3>Payment Details</h3>
        <p><strong>Amount:</strong> <span class="amount">$${(amount/100).toFixed(2)}</span></p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Payment ID:</strong> ${paymentId}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <p>This payment receipt serves as confirmation of your transaction. Please keep this email for your records.</p>
      
      <p>Your services will be activated/renewed automatically. You can view your billing history and current subscription status in your dashboard.</p>

      <p>Questions about your payment? Contact us at hello@cozyartzmedia.com.</p>
      
      <p>Thank you for your business!</p>
      <p>The Cozyartz Team</p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
    </div>
  </div>
</body>
</html>`;
  }

  getPaymentConfirmationText(userName, amount, description, paymentId) {
    return `Payment Confirmed

Thank you, ${userName}!

Your payment has been successfully processed.

Payment Details:
- Amount: $${(amount/100).toFixed(2)}
- Description: ${description}
- Payment ID: ${paymentId}
- Date: ${new Date().toLocaleDateString()}

This payment receipt serves as confirmation of your transaction. Please keep this email for your records.

Your services will be activated/renewed automatically. You can view your billing history and current subscription status in your dashboard.

Questions about your payment? Contact us at hello@cozyartzmedia.com.

Thank you for your business!
The Cozyartz Team

Cozyartz Media Group | Battle Creek, MI | (269) 261-0069`;
  }

  getPrepaymentConfirmationTemplate(userName, tier, months, amountPaid, savings, endDate) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prepayment Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .savings-highlight { background: #f3e8ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .savings-amount { font-size: 28px; font-weight: bold; color: #7c3aed; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎊 Prepayment Confirmed!</h1>
      <p>Smart savings choice!</p>
    </div>
    <div class="content">
      <h2>Excellent choice, ${userName}!</h2>
      <p>Your ${months}-month prepayment for the <strong>${tier}</strong> plan has been confirmed.</p>
      
      <div class="savings-highlight">
        <div class="savings-amount">$${(savings/100).toFixed(2)} SAVED</div>
        <p>by paying in advance!</p>
      </div>

      <h3>Prepayment Summary:</h3>
      <ul>
        <li><strong>Plan:</strong> ${tier}</li>
        <li><strong>Duration:</strong> ${months} months</li>
        <li><strong>Amount Paid:</strong> $${(amountPaid/100).toFixed(2)}</li>
        <li><strong>Total Savings:</strong> $${(savings/100).toFixed(2)}</li>
        <li><strong>Service Period:</strong> Now through ${endDate}</li>
      </ul>

      <p>Your account is now active for the full ${months}-month period. All features and services are immediately available.</p>
      
      <p>We'll send you a reminder email 30 days before your prepaid period expires, so you can decide whether to renew.</p>

      <p>Thank you for choosing our prepayment option and trusting us with your SEO success!</p>
      
      <p>Best regards,</p>
      <p>The Cozyartz Team</p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
    </div>
  </div>
</body>
</html>`;
  }

  getPrepaymentConfirmationText(userName, tier, months, amountPaid, savings, endDate) {
    return `Prepayment Confirmed!

Excellent choice, ${userName}!

Your ${months}-month prepayment for the ${tier} plan has been confirmed.

YOU SAVED $${(savings/100).toFixed(2)} by paying in advance!

Prepayment Summary:
- Plan: ${tier}
- Duration: ${months} months
- Amount Paid: $${(amountPaid/100).toFixed(2)}
- Total Savings: $${(savings/100).toFixed(2)}
- Service Period: Now through ${endDate}

Your account is now active for the full ${months}-month period. All features and services are immediately available.

We'll send you a reminder email 30 days before your prepaid period expires, so you can decide whether to renew.

Thank you for choosing our prepayment option and trusting us with your SEO success!

Best regards,
The Cozyartz Team

Cozyartz Media Group | Battle Creek, MI | (269) 261-0069`;
  }

  getBillingReminderTemplate(userName, amount, dueDate, invoiceId) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Billing Reminder</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .invoice-details { background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💳 Payment Reminder</h1>
    </div>
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>This is a friendly reminder that your payment is due soon.</p>
      
      <div class="invoice-details">
        <h3>Invoice Details</h3>
        <p><strong>Amount Due:</strong> $${(amount/100).toFixed(2)}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
        <p><strong>Invoice ID:</strong> ${invoiceId}</p>
      </div>

      <p>To ensure uninterrupted service, please make your payment by the due date.</p>

      <a href="https://cozyartzmedia.com/client-portal/billing" class="button">View Invoice & Pay</a>

      <p>If you've already made this payment, please disregard this email. Payments can take 1-2 business days to process.</p>
      
      <p>Questions about your bill? We're here to help at hello@cozyartzmedia.com or (269) 261-0069.</p>
      
      <p>Thank you!</p>
      <p>The Cozyartz Team</p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
    </div>
  </div>
</body>
</html>`;
  }

  getBillingReminderText(userName, amount, dueDate, invoiceId) {
    return `Payment Reminder

Hi ${userName},

This is a friendly reminder that your payment is due soon.

Invoice Details:
- Amount Due: $${(amount/100).toFixed(2)}
- Due Date: ${dueDate}
- Invoice ID: ${invoiceId}

To ensure uninterrupted service, please make your payment by the due date.

View and pay your invoice: https://cozyartzmedia.com/client-portal/billing

If you've already made this payment, please disregard this email. Payments can take 1-2 business days to process.

Questions about your bill? We're here to help at hello@cozyartzmedia.com or (269) 261-0069.

Thank you!
The Cozyartz Team

Cozyartz Media Group | Battle Creek, MI | (269) 261-0069`;
  }

  getUsageLimitWarningTemplate(userName, currentUsage, limit, tier) {
    const percentage = Math.round((currentUsage / limit) * 100);
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Usage Limit Warning</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .usage-bar { background: #fee2e2; height: 20px; border-radius: 10px; overflow: hidden; margin: 20px 0; }
    .usage-fill { background: #ef4444; height: 100%; width: ${percentage}%; }
    .button { display: inline-block; background: #14b8a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ AI Usage Warning</h1>
      <p>${percentage}% of monthly limit used</p>
    </div>
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>You've used <strong>${currentUsage} out of ${limit}</strong> AI calls this month on your <strong>${tier}</strong> plan.</p>
      
      <div class="usage-bar">
        <div class="usage-fill"></div>
      </div>
      <p style="text-align: center;">${percentage}% used</p>

      <p>When you reach 100% of your limit, additional AI calls will be charged at $0.50 per call.</p>
      
      <h3>Consider upgrading your plan:</h3>
      <ul>
        <li><strong>Growth:</strong> 250 AI calls/month + 10% off consultations</li>
        <li><strong>Growth Plus:</strong> 400 AI calls/month + 15% off consultations</li>
        <li><strong>Enterprise:</strong> 500 AI calls/month + 20% off consultations</li>
        <li><strong>Enterprise Plus:</strong> 1000 AI calls/month + 25% off consultations</li>
      </ul>

      <a href="https://cozyartzmedia.com/client-portal/billing" class="button">Upgrade Plan</a>

      <p>Questions about your usage or upgrading? We're here to help at hello@cozyartzmedia.com.</p>
      
      <p>Best regards,</p>
      <p>The Cozyartz Team</p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
    </div>
  </div>
</body>
</html>`;
  }

  getUsageLimitWarningText(userName, currentUsage, limit, tier) {
    const percentage = Math.round((currentUsage / limit) * 100);
    return `AI Usage Warning - ${percentage}% Used

Hi ${userName},

You've used ${currentUsage} out of ${limit} AI calls this month on your ${tier} plan (${percentage}% used).

When you reach 100% of your limit, additional AI calls will be charged at $0.50 per call.

Consider upgrading your plan:
- Growth: 250 AI calls/month + 10% off consultations
- Growth Plus: 400 AI calls/month + 15% off consultations  
- Enterprise: 500 AI calls/month + 20% off consultations
- Enterprise Plus: 1000 AI calls/month + 25% off consultations

Upgrade your plan: https://cozyartzmedia.com/client-portal/billing

Questions about your usage or upgrading? We're here to help at hello@cozyartzmedia.com.

Best regards,
The Cozyartz Team

Cozyartz Media Group | Battle Creek, MI | (269) 261-0069`;
  }

  getDomainLimitWarningTemplate(userName, currentDomains, limit, tier) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Domain Limit Reached</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .button { display: inline-block; background: #14b8a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .limit-box { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚫 Domain Limit Reached</h1>
    </div>
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>You've reached your domain limit on the <strong>${tier}</strong> plan.</p>
      
      <div class="limit-box">
        <h3>${currentDomains} of ${limit} domains used</h3>
        <p>To add more domains, consider upgrading your plan</p>
      </div>

      <h3>More domains available with upgrade:</h3>
      <ul>
        <li><strong>Starter Plus:</strong> 2 domains</li>
        <li><strong>Growth:</strong> 5 domains</li>
        <li><strong>Growth Plus:</strong> 10 domains</li>
        <li><strong>Enterprise:</strong> 25 domains</li>
        <li><strong>Enterprise Plus:</strong> 50 domains</li>
      </ul>

      <a href="https://cozyartzmedia.com/client-portal/billing" class="button">Upgrade Plan</a>

      <p>Need help deciding which plan is right for you? Contact us at hello@cozyartzmedia.com and we'll help you choose the perfect plan for your needs.</p>
      
      <p>Best regards,</p>
      <p>The Cozyartz Team</p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
    </div>
  </div>
</body>
</html>`;
  }

  getDomainLimitWarningText(userName, currentDomains, limit, tier) {
    return `Domain Limit Reached

Hi ${userName},

You've reached your domain limit on the ${tier} plan.

Current Usage: ${currentDomains} of ${limit} domains used

To add more domains, consider upgrading your plan:
- Starter Plus: 2 domains
- Growth: 5 domains
- Growth Plus: 10 domains
- Enterprise: 25 domains  
- Enterprise Plus: 50 domains

Upgrade your plan: https://cozyartzmedia.com/client-portal/billing

Need help deciding which plan is right for you? Contact us at hello@cozyartzmedia.com and we'll help you choose the perfect plan for your needs.

Best regards,
The Cozyartz Team

Cozyartz Media Group | Battle Creek, MI | (269) 261-0069`;
  }

  getAdvisorWelcomeTemplate(userName, couponCode, description) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exclusive SEO Platform Access</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .coupon-highlight { background: #f3e8ff; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px solid #8b5cf6; }
    .coupon-code { font-size: 32px; font-weight: bold; color: #7c3aed; letter-spacing: 2px; }
    .button { display: inline-block; background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Exclusive Access Granted</h1>
      <p>Your VIP SEO Platform Experience</p>
    </div>
    <div class="content">
      <h2>Welcome, ${userName}!</h2>
      <p>We're thrilled to provide you with exclusive access to the Cozyartz SEO Platform as part of our business advisor program.</p>
      
      <div class="coupon-highlight">
        <h3>Your Exclusive Access Code</h3>
        <div class="coupon-code">${couponCode}</div>
        <p>${description}</p>
      </div>

      <h3>🚀 What's Included:</h3>
      <ul>
        <li>Complete SEO project management suite</li>
        <li>AI-powered content generation tools</li>
        <li>Comprehensive keyword research and tracking</li>
        <li>Advanced analytics and reporting</li>
        <li>Competitor analysis and insights</li>
        <li>Domain management and monitoring</li>
        <li>Priority support from our expert team</li>
      </ul>

      <h3>💡 Getting Started:</h3>
      <ol>
        <li>Create your account at the link below</li>
        <li>Enter your exclusive coupon code during signup</li>
        <li>Complete your profile and add your first domain</li>
        <li>Explore the AI tools and dashboard features</li>
        <li>Schedule a consultation if you need guidance</li>
      </ol>

      <a href="https://cozyartzmedia.com/client-portal/signup" class="button">Start Your Journey</a>

      <p>This exclusive access is our way of saying thank you for your partnership and trust in our platform. We're confident you'll see the value in our AI-powered approach to SEO success.</p>
      
      <p>Have questions or need assistance? I'm personally available to help:</p>
      <ul>
        <li>📧 Email: hello@cozyartzmedia.com</li>
        <li>📞 Phone: (269) 261-0069</li>
        <li>💬 Direct reply to this email</li>
      </ul>

      <p>Looking forward to your feedback and helping you achieve amazing results!</p>
      
      <p>Best regards,</p>
      <p><strong>Amy Cozart-Lundin, M.Ed</strong><br>
      CEO & Founder, Cozyartz Media Group</p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
      <p>This exclusive access was specifically created for ${userName}</p>
    </div>
  </div>
</body>
</html>`;
  }

  getAdvisorWelcomeText(userName, couponCode, description) {
    return `Exclusive SEO Platform Access

Welcome, ${userName}!

We're thrilled to provide you with exclusive access to the Cozyartz SEO Platform as part of our business advisor program.

Your Exclusive Access Code: ${couponCode}
${description}

What's Included:
- Complete SEO project management suite
- AI-powered content generation tools  
- Comprehensive keyword research and tracking
- Advanced analytics and reporting
- Competitor analysis and insights
- Domain management and monitoring
- Priority support from our expert team

Getting Started:
1. Create your account: https://cozyartzmedia.com/client-portal/signup
2. Enter your exclusive coupon code during signup
3. Complete your profile and add your first domain
4. Explore the AI tools and dashboard features
5. Schedule a consultation if you need guidance

This exclusive access is our way of saying thank you for your partnership and trust in our platform. We're confident you'll see the value in our AI-powered approach to SEO success.

Have questions or need assistance? I'm personally available to help:
- Email: hello@cozyartzmedia.com
- Phone: (269) 261-0069  
- Direct reply to this email

Looking forward to your feedback and helping you achieve amazing results!

Best regards,
Amy Cozart-Lundin, M.Ed
CEO & Founder, Cozyartz Media Group

Cozyartz Media Group | Battle Creek, MI | (269) 261-0069
This exclusive access was specifically created for ${userName}`;
  }

  getClientWelcomeTemplate(userName, couponCode, description) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Your Premium SEO Platform</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #14b8a6, #0f766e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .coupon-highlight { background: #f0fdfa; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px solid #14b8a6; }
    .coupon-code { font-size: 28px; font-weight: bold; color: #0f766e; letter-spacing: 2px; }
    .button { display: inline-block; background: #14b8a6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
    .feature { margin: 15px 0; padding: 15px; background: #f0fdfa; border-left: 4px solid #14b8a6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Welcome to Your Premium SEO Platform</h1>
      <p>Professional-grade SEO tools at your fingertips</p>
    </div>
    <div class="content">
      <h2>Welcome, ${userName}!</h2>
      <p>Thank you for choosing Cozyartz SEO Platform for your digital marketing needs. We're excited to help you dominate search results with our AI-powered tools and expert guidance.</p>
      
      <div class="coupon-highlight">
        <h3>Your Client Discount Code</h3>
        <div class="coupon-code">${couponCode}</div>
        <p>${description}</p>
      </div>

      <div class="feature">
        <h3>🎯 What You Get:</h3>
        <ul>
          <li>Complete SEO project management suite</li>
          <li>AI-powered content generation tools</li>
          <li>Advanced keyword research and tracking</li>
          <li>Comprehensive analytics and reporting</li>
          <li>Competitor analysis and insights</li>
          <li>Domain management and monitoring</li>
          <li>Professional consultation support</li>
          <li>Monthly performance reports</li>
        </ul>
      </div>

      <div class="feature">
        <h3>💡 Getting Started:</h3>
        <ol>
          <li>Create your account using the link below</li>
          <li>Enter your discount code during signup</li>
          <li>Add your domain(s) for tracking</li>
          <li>Set up your first SEO project</li>
          <li>Schedule a strategy consultation call</li>
        </ol>
      </div>

      <a href="https://cozyartzmedia.com/client-portal/signup" class="button">Access Your Platform</a>

      <p>As a valued client, you'll receive dedicated support throughout your SEO journey. Our team is committed to delivering measurable results that drive your business growth.</p>
      
      <p>Ready to get started? Your success is our priority:</p>
      <ul>
        <li>📧 Email: hello@cozyartzmedia.com</li>
        <li>📞 Phone: (269) 261-0069</li>
        <li>💬 Direct reply to this email</li>
      </ul>

      <p>Let's achieve exceptional search results together!</p>
      
      <p>Best regards,</p>
      <p><strong>Amy Cozart-Lundin, M.Ed</strong><br>
      CEO & Founder, Cozyartz Media Group</p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
      <p>This premium access was created for ${userName}</p>
    </div>
  </div>
</body>
</html>`;
  }

  getClientWelcomeText(userName, couponCode, description) {
    return `Welcome to Your Premium SEO Platform

Welcome, ${userName}!

Thank you for choosing Cozyartz SEO Platform for your digital marketing needs. We're excited to help you dominate search results with our AI-powered tools and expert guidance.

Your Client Discount Code: ${couponCode}
${description}

What You Get:
- Complete SEO project management suite
- AI-powered content generation tools
- Advanced keyword research and tracking
- Comprehensive analytics and reporting
- Competitor analysis and insights
- Domain management and monitoring
- Professional consultation support
- Monthly performance reports

Getting Started:
1. Create your account: https://cozyartzmedia.com/client-portal/signup
2. Enter your discount code during signup
3. Add your domain(s) for tracking
4. Set up your first SEO project
5. Schedule a strategy consultation call

As a valued client, you'll receive dedicated support throughout your SEO journey. Our team is committed to delivering measurable results that drive your business growth.

Ready to get started? Your success is our priority:
- Email: hello@cozyartzmedia.com
- Phone: (269) 261-0069
- Direct reply to this email

Let's achieve exceptional search results together!

Best regards,
Amy Cozart-Lundin, M.Ed
CEO & Founder, Cozyartz Media Group

Cozyartz Media Group | Battle Creek, MI | (269) 261-0069
This premium access was created for ${userName}`;
  }
}

// Helper function to format currency
export function formatCurrency(amountInCents) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amountInCents / 100);
}

export function getTestingRequestTemplate(advisorName) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exclusive Platform Testing Invitation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #14b8a6, #0f766e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #14b8a6, #0f766e); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .feature-list { background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 20px; margin: 20px 0; }
    .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Exclusive Testing Invitation</h1>
      <p>Your insights will shape the future of our platform</p>
    </div>
    <div class="content">
      <p>Hi ${advisorName},</p>
      
      <p>As our trusted business advisor, you've been with us from the beginning, and now we need your expert eye on something revolutionary we've been building.</p>
      
      <div class="highlight">
        <h3>🎁 What We're Offering You:</h3>
        <ul>
          <li><strong>6 months of completely free access</strong> to our premium SEO platform</li>
          <li><strong>First look</strong> at the technology that could transform how businesses approach SEO</li>
          <li><strong>Direct input</strong> on features and functionality before public launch</li>
          <li><strong>VIP advisor status</strong> with priority support and exclusive updates</li>
        </ul>
      </div>
      
      <p>This is the platform you decided to be part of - the one we've been developing with AI-powered tools, comprehensive analytics, and enterprise-grade security. We've reached a critical testing phase and need someone with your business acumen to put it through its paces.</p>
      
      <div class="feature-list">
        <h3>🔧 What We Need You to Test:</h3>
        <ul>
          <li><strong>Payment Processing:</strong> New PayPal integration with security features</li>
          <li><strong>User Experience:</strong> Signup flow, dashboard navigation, tool accessibility</li>
          <li><strong>AI Features:</strong> Content generation, keyword research, competitor analysis</li>
          <li><strong>Security & Encryption:</strong> Data protection, user authentication, GDPR compliance</li>
          <li><strong>Performance:</strong> Speed, reliability, mobile responsiveness</li>
        </ul>
      </div>
      
      <p><strong>Your Testing Access Includes:</strong></p>
      <ul>
        <li>Full Starter tier (normally $1,000/month) - completely free for 6 months</li>
        <li>AI assistant trained specifically to help with any setup issues</li>
        <li>Standard support with testing feedback channel</li>
        <li>100 AI calls per month, 1 domain limit</li>
        <li>Basic SEO analytics and reporting tools</li>
        <li>PayPal payment system testing access</li>
      </ul>
      
      <div class="highlight">
        <h3>🤖 AI Assistant Support</h3>
        <p>We've created a specialized AI assistant that knows every aspect of our platform. If you encounter any issues during setup or testing, just ask and it will walk you through step-by-step solutions with the same expertise as our development team.</p>
      </div>
      
      <p><strong>Why Your Testing Matters:</strong></p>
      <p>Your business expertise and advisory role gives you a unique perspective on what works in the real world. We need someone who understands both the technical side and the business impact to ensure we're building something truly valuable.</p>
      
      <a href="https://cozyartzmedia.com/client-portal/signup?advisor=amy" class="cta-button">Start Testing Now - Free Access</a>
      
      <p>Use coupon code: <strong>AMYFREE</strong> (automatically applied via your advisor link)</p>
      
      <p>This exclusive testing period runs for 6 months, giving you plenty of time to explore every feature and provide the insights that will help us perfect the platform before wider release.</p>
      
      <p>Ready to see what we've been building together?</p>
      
      <p>Best regards,</p>
      <p>The Cozyartz Development Team</p>
      <p><em>P.S. Your feedback during this testing phase will directly influence our final feature set and user experience design.</em></p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
      <p>This is an exclusive invitation for business advisors and partners</p>
    </div>
  </div>
</body>
</html>`;
  }

export function getTestingRequestText(advisorName) {
    return `Exclusive Platform Testing Invitation

Hi ${advisorName},

As our trusted business advisor, you've been with us from the beginning, and now we need your expert eye on something revolutionary we've been building.

🎁 WHAT WE'RE OFFERING YOU:
- 6 months of completely free access to our premium SEO platform
- First look at the technology that could transform how businesses approach SEO  
- Direct input on features and functionality before public launch
- VIP advisor status with priority support and exclusive updates

This is the platform you decided to be part of - the one we've been developing with AI-powered tools, comprehensive analytics, and enterprise-grade security. We've reached a critical testing phase and need someone with your business acumen to put it through its paces.

🔧 WHAT WE NEED YOU TO TEST:
- Payment Processing: New PayPal integration with security features
- User Experience: Signup flow, dashboard navigation, tool accessibility  
- AI Features: Content generation, keyword research, competitor analysis
- Security & Encryption: Data protection, user authentication, GDPR compliance
- Performance: Speed, reliability, mobile responsiveness

YOUR TESTING ACCESS INCLUDES:
- Full Starter tier (normally $1,000/month) - completely free for 6 months
- AI assistant trained specifically to help with any setup issues
- Standard support with testing feedback channel
- 100 AI calls per month, 1 domain limit
- Basic SEO analytics and reporting tools
- PayPal payment system testing access

🤖 AI ASSISTANT SUPPORT
We've created a specialized AI assistant that knows every aspect of our platform. If you encounter any issues during setup or testing, just ask and it will walk you through step-by-step solutions with the same expertise as our development team.

WHY YOUR TESTING MATTERS:
Your business expertise and advisory role gives you a unique perspective on what works in the real world. We need someone who understands both the technical side and the business impact to ensure we're building something truly valuable.

GETTING STARTED:
Visit: https://cozyartzmedia.com/client-portal/signup?advisor=amy
Coupon Code: AMYFREE (automatically applied via your advisor link)

This exclusive testing period runs for 6 months, giving you plenty of time to explore every feature and provide the insights that will help us perfect the platform before wider release.

Ready to see what we've been building together?

Best regards,
The Cozyartz Development Team

P.S. Your feedback during this testing phase will directly influence our final feature set and user experience design.

Cozyartz Media Group | Battle Creek, MI | (269) 261-0069
This is an exclusive invitation for business advisors and partners`;
  }

  // Domain Setup Email Templates
export function getDomainSetupTemplate(domainData) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Domain Setup Complete - ${domainData.domain}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #14b8a6, #0f766e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .domain-highlight { background: #f0fdfa; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px solid #14b8a6; }
    .domain-name { font-size: 24px; font-weight: bold; color: #0f766e; margin: 10px 0; }
    .status-success { color: #059669; font-weight: bold; }
    .next-steps { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    .nameserver { background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌐 Domain Setup Complete!</h1>
      <p>Your domain is now optimized for SEO success</p>
    </div>
    <div class="content">
      <div class="domain-highlight">
        <h2>Domain Successfully Configured</h2>
        <div class="domain-name">${domainData.domain}</div>
        <p class="status-success">✅ Status: ${domainData.setupComplete ? 'Setup Complete' : 'In Progress'}</p>
      </div>

      <h3>🎯 Package Details:</h3>
      <ul>
        <li><strong>Package:</strong> ${domainData.package.name}</li>
        <li><strong>Setup Fee:</strong> $${domainData.package.price}</li>
        <li><strong>Monthly Management:</strong> $${domainData.package.monthlyFee || 25}/month</li>
        <li><strong>Zone ID:</strong> ${domainData.zoneId || 'Pending'}</li>
      </ul>

      <h3>📋 What We've Set Up:</h3>
      <ul>
        <li>✅ Cloudflare DNS configuration</li>
        <li>✅ SEO-optimized DNS records</li>
        <li>✅ SSL certificate provisioning</li>
        <li>✅ CDN and DDoS protection</li>
        <li>✅ Email forwarding setup</li>
      </ul>

      ${domainData.nameservers && domainData.nameservers.length > 0 ? `
      <h3>🔧 Your Nameservers:</h3>
      ${domainData.nameservers.map(ns => `<div class="nameserver">${ns}</div>`).join('')}
      ` : ''}

      <div class="next-steps">
        <h3>📝 Next Steps:</h3>
        <ol>
          ${domainData.nextSteps.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>

      <p>Your domain is now equipped with enterprise-grade infrastructure and SEO optimization. Our team will monitor the setup process and notify you once DNS propagation is complete (typically 24-48 hours).</p>
      
      <p><strong>Need help?</strong> Reply to this email or contact our domain specialists at domains@cozyartzmedia.com</p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
      <p>Domain Management Services | domains@cozyartzmedia.com</p>
    </div>
  </div>
</body>
</html>`;
  }

export function getDomainSetupText(domainData) {
    return `Domain Setup Complete - ${domainData.domain}

Congratulations! Your domain has been successfully configured with SEO optimization.

DOMAIN: ${domainData.domain}
STATUS: ${domainData.setupComplete ? 'Setup Complete' : 'In Progress'}

PACKAGE DETAILS:
- Package: ${domainData.package.name}
- Setup Fee: $${domainData.package.price}
- Monthly Management: $${domainData.package.monthlyFee || 25}/month
- Zone ID: ${domainData.zoneId || 'Pending'}

WHAT WE'VE SET UP:
✅ Cloudflare DNS configuration
✅ SEO-optimized DNS records  
✅ SSL certificate provisioning
✅ CDN and DDoS protection
✅ Email forwarding setup

${domainData.nameservers && domainData.nameservers.length > 0 ? `
YOUR NAMESERVERS:
${domainData.nameservers.map(ns => `- ${ns}`).join('\n')}
` : ''}

NEXT STEPS:
${domainData.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

Your domain is now equipped with enterprise-grade infrastructure and SEO optimization. Our team will monitor the setup process and notify you once DNS propagation is complete (typically 24-48 hours).

Need help? Reply to this email or contact our domain specialists at domains@cozyartzmedia.com

Best regards,
Cozyartz Media Group | Battle Creek, MI | (269) 261-0069
Domain Management Services`;
  }

export function getDomainRenewalTemplate(clientName, domainData) {
    const daysUntilExpiry = Math.ceil((new Date(domainData.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Domain Renewal Required - ${domainData.domain}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .warning-box { background: #fef3c7; padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid #f59e0b; }
    .domain-name { font-size: 20px; font-weight: bold; color: #92400e; margin: 10px 0; }
    .urgent { color: #dc2626; font-weight: bold; }
    .button { display: inline-block; background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
    .pricing { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Domain Renewal Required</h1>
      <p>Action needed to keep your domain active</p>
    </div>
    <div class="content">
      <h2>Hello ${clientName},</h2>
      
      <div class="warning-box">
        <h3>${daysUntilExpiry <= 7 ? '🚨 URGENT:' : '📅 Reminder:'} Domain Expiring Soon</h3>
        <div class="domain-name">${domainData.domain}</div>
        <p class="${daysUntilExpiry <= 7 ? 'urgent' : ''}">
          Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} on ${new Date(domainData.expiresAt).toLocaleDateString()}
        </p>
      </div>

      ${daysUntilExpiry <= 7 ? `
      <p class="urgent">⚠️ Your domain will stop working if not renewed within ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}!</p>
      ` : `
      <p>We're reaching out to remind you that your domain registration is approaching its expiration date.</p>
      `}

      <div class="pricing">
        <h3>💰 Renewal Pricing:</h3>
        <ul>
          <li><strong>Domain Renewal:</strong> $${domainData.renewalCost || 11.86}</li>
          <li><strong>Management Service:</strong> $${domainData.managementFee || 25}/month</li>
          <li><strong>Auto-Renewal:</strong> ${domainData.autoRenew ? 'Enabled ✅' : 'Disabled ❌'}</li>
        </ul>
      </div>

      <h3>🔧 What Happens if You Renew:</h3>
      <ul>
        <li>✅ Your website stays online</li>
        <li>✅ Email addresses continue working</li>
        <li>✅ SEO rankings preserved</li>
        <li>✅ Continued management and support</li>
        <li>✅ SSL certificate automatically renewed</li>
      </ul>

      <h3>❌ What Happens if You Don't Renew:</h3>
      <ul>
        <li>❌ Website becomes inaccessible</li>
        <li>❌ Email stops working</li>
        <li>❌ Loss of SEO rankings</li>
        <li>❌ Domain becomes available to others</li>
        <li>❌ Potential loss of brand identity</li>
      </ul>

      <a href="https://cozyartzmedia.com/client-portal/domains/renew?domain=${domainData.domain}" class="button">
        Renew Domain Now
      </a>

      <p>Questions about renewal? Contact our domain team at domains@cozyartzmedia.com or reply to this email.</p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
      <p>Domain Management Services | domains@cozyartzmedia.com</p>
    </div>
  </div>
</body>
</html>`;
  }

export function getDomainRenewalText(clientName, domainData) {
    const daysUntilExpiry = Math.ceil((new Date(domainData.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
    
    return `Domain Renewal Required - ${domainData.domain}

Hello ${clientName},

${daysUntilExpiry <= 7 ? 'URGENT: ' : ''}Your domain registration is expiring soon and requires renewal.

DOMAIN: ${domainData.domain}
EXPIRES: ${new Date(domainData.expiresAt).toLocaleDateString()} (${daysUntilExpiry} days)
AUTO-RENEWAL: ${domainData.autoRenew ? 'Enabled' : 'Disabled'}

RENEWAL PRICING:
- Domain Renewal: $${domainData.renewalCost || 11.86}
- Management Service: $${domainData.managementFee || 25}/month

WHAT HAPPENS IF YOU RENEW:
✅ Your website stays online
✅ Email addresses continue working  
✅ SEO rankings preserved
✅ Continued management and support
✅ SSL certificate automatically renewed

WHAT HAPPENS IF YOU DON'T RENEW:
❌ Website becomes inaccessible
❌ Email stops working
❌ Loss of SEO rankings
❌ Domain becomes available to others
❌ Potential loss of brand identity

TO RENEW: Visit https://cozyartzmedia.com/client-portal/domains/renew?domain=${domainData.domain}

Questions? Contact domains@cozyartzmedia.com

Best regards,
Cozyartz Media Group | Battle Creek, MI | (269) 261-0069`;
  }

export function getDomainTransferTemplate(clientName, transferData) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Domain Transfer ${transferData.status} - ${transferData.domain}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    .status-box { padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; }
    .status-pending { background: #fef3c7; border: 2px solid #f59e0b; }
    .status-approved { background: #d1fae5; border: 2px solid #10b981; }
    .status-completed { background: #dbeafe; border: 2px solid #3b82f6; }
    .status-rejected { background: #fee2e2; border: 2px solid #ef4444; }
    .domain-name { font-size: 20px; font-weight: bold; margin: 10px 0; }
    .timeline { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔄 Domain Transfer Update</h1>
      <p>Status update for your domain transfer</p>
    </div>
    <div class="content">
      <h2>Hello ${clientName},</h2>
      
      <div class="status-box status-${transferData.status}">
        <h3>Transfer Status: ${transferData.status.toUpperCase()}</h3>
        <div class="domain-name">${transferData.domain}</div>
        <p>${transferData.transferType === 'in' ? 'Transfer TO Cloudflare' : 'Transfer FROM Cloudflare'}</p>
      </div>

      ${transferData.status === 'pending' ? `
      <p>Your domain transfer request is being processed. This typically takes 5-7 business days to complete.</p>
      ` : transferData.status === 'approved' ? `
      <p>Great news! Your domain transfer has been approved and is now in progress.</p>
      ` : transferData.status === 'completed' ? `
      <p>Excellent! Your domain transfer has been completed successfully.</p>
      ` : `
      <p>Unfortunately, your domain transfer request has been rejected. Please see details below.</p>
      `}

      <div class="timeline">
        <h3>📋 Transfer Details:</h3>
        <ul>
          <li><strong>Domain:</strong> ${transferData.domain}</li>
          <li><strong>Transfer Type:</strong> ${transferData.transferType === 'in' ? 'Incoming (TO Cloudflare)' : 'Outgoing (FROM Cloudflare)'}</li>
          <li><strong>Status:</strong> ${transferData.status}</li>
          <li><strong>Requested:</strong> ${transferData.requestedAt ? new Date(transferData.requestedAt).toLocaleDateString() : 'N/A'}</li>
          ${transferData.completedAt ? `<li><strong>Completed:</strong> ${new Date(transferData.completedAt).toLocaleDateString()}</li>` : ''}
          <li><strong>Transfer Fee:</strong> $${transferData.transferFee || 35}</li>
        </ul>
      </div>

      ${transferData.status === 'completed' && transferData.transferType === 'in' ? `
      <h3>🎉 What's Next:</h3>
      <ul>
        <li>✅ Domain is now managed by Cloudflare</li>
        <li>✅ DNS settings have been preserved</li>
        <li>✅ SSL certificate automatically renewed</li>
        <li>✅ Enhanced DDoS protection active</li>
        <li>✅ Our management services are now active</li>
      </ul>
      ` : transferData.status === 'rejected' ? `
      <h3>❌ Rejection Reason:</h3>
      <p>${transferData.notes || 'Please contact our support team for more details about the rejection.'}</p>
      
      <h3>🔧 Next Steps:</h3>
      <ul>
        <li>Contact our domain team for assistance</li>
        <li>Verify authorization code accuracy</li>
        <li>Ensure domain is unlocked at current registrar</li>
        <li>Submit a new transfer request if needed</li>
      </ul>
      ` : ''}

      <p>Questions about your domain transfer? Contact our domain specialists at domains@cozyartzmedia.com or reply to this email.</p>
    </div>
    <div class="footer">
      <p>Cozyartz Media Group | Battle Creek, MI | (269) 261-0069</p>
      <p>Domain Management Services | domains@cozyartzmedia.com</p>
    </div>
  </div>
</body>
</html>`;
  }

export function getDomainTransferText(clientName, transferData) {
    return `Domain Transfer ${transferData.status} - ${transferData.domain}

Hello ${clientName},

Your domain transfer request has been updated.

TRANSFER DETAILS:
- Domain: ${transferData.domain}
- Transfer Type: ${transferData.transferType === 'in' ? 'Incoming (TO Cloudflare)' : 'Outgoing (FROM Cloudflare)'}
- Status: ${transferData.status.toUpperCase()}
- Requested: ${transferData.requestedAt ? new Date(transferData.requestedAt).toLocaleDateString() : 'N/A'}
${transferData.completedAt ? `- Completed: ${new Date(transferData.completedAt).toLocaleDateString()}` : ''}
- Transfer Fee: $${transferData.transferFee || 35}

${transferData.status === 'pending' ? 'Your domain transfer request is being processed. This typically takes 5-7 business days to complete.' :
  transferData.status === 'approved' ? 'Great news! Your domain transfer has been approved and is now in progress.' :
  transferData.status === 'completed' ? 'Excellent! Your domain transfer has been completed successfully.' :
  'Unfortunately, your domain transfer request has been rejected. Please see details below.'}

${transferData.status === 'completed' && transferData.transferType === 'in' ? `
WHAT'S NEXT:
✅ Domain is now managed by Cloudflare
✅ DNS settings have been preserved
✅ SSL certificate automatically renewed
✅ Enhanced DDoS protection active
✅ Our management services are now active
` : transferData.status === 'rejected' ? `
REJECTION REASON:
${transferData.notes || 'Please contact our support team for more details about the rejection.'}

NEXT STEPS:
- Contact our domain team for assistance
- Verify authorization code accuracy  
- Ensure domain is unlocked at current registrar
- Submit a new transfer request if needed
` : ''}

Questions? Contact domains@cozyartzmedia.com

Best regards,
Cozyartz Media Group | Battle Creek, MI | (269) 261-0069`;
  }