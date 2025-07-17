// Send testing request email to Amy Tipton
import { EmailService } from './src/lib/email.js';

async function sendAmyTestingEmail() {
  console.log('📧 Sending testing request email to Amy Tipton...\n');

  // Initialize email service with your API key
  const emailService = new EmailService('your-resend-api-key-here');

  try {
    const result = await emailService.sendTestingRequestEmail(
      'amy@company.com', // Replace with Amy's actual email
      'Amy Tipton'
    );

    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log(`Email ID: ${result.id}`);
      console.log('\n📋 Email Summary:');
      console.log('• Subject: Exclusive Preview: Test Our Revolutionary SEO Platform + 6 Months Free');
      console.log('• Recipient: Amy Tipton (Business Advisor)');
      console.log('• Offer: 6 months free Enterprise Plus access ($2,500/month value)');
      console.log('• Testing Focus: PayPal integration, security, user experience');
      console.log('• AI Assistant: Trained for setup support');
      console.log('• Access Link: https://cozyartzmedia.com/client-portal/signup?advisor=amy');
      console.log('• Coupon Code: AMYFREE (auto-applied)');
    } else {
      console.error('❌ Failed to send email:');
      console.error(result.error);
    }
  } catch (error) {
    console.error('❌ Email service error:', error.message);
  }

  console.log('\n🎯 Next Steps:');
  console.log('1. Replace "your-resend-api-key-here" with actual Resend API key');
  console.log('2. Update Amy\'s email address');
  console.log('3. Run: node send_amy_email.js');
  console.log('4. Monitor for Amy\'s response and testing feedback');
  console.log('5. Provide AI assistant support during her testing');
}

// Run the email sender
sendAmyTestingEmail().catch(console.error);