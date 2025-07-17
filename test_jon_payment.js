// Test Jon Werbeck's Payment Flow
// This tests the $1000/month with $250 discount coupon

async function testJonPayment() {
  console.log('💰 Testing Jon Werbeck Payment Flow...\n');
  
  // Jon's Configuration
  const jonConfig = {
    email: 'jon@jwpartnership.com',
    couponCode: 'JON250',
    tier: 'starter',
    monthlyPrice: 100000, // $1000 in cents
    discountAmount: 25000, // $250 discount
    finalPrice: 75000 // $750 after discount
  };
  
  console.log('📊 Jon Werbeck Client Configuration:');
  console.log(`   Email: ${jonConfig.email}`);
  console.log(`   Coupon: ${jonConfig.couponCode}`);
  console.log(`   Tier: ${jonConfig.tier.toUpperCase()}`);
  console.log(`   Base Price: $${(jonConfig.monthlyPrice / 100).toFixed(2)}/month`);
  console.log(`   Discount: -$${(jonConfig.discountAmount / 100).toFixed(2)}/month`);
  console.log(`   Final Price: $${(jonConfig.finalPrice / 100).toFixed(2)}/month`);
  
  // Test 3-Month Prepayment Calculation
  const prepaymentCalculation = {
    monthlyPrice: jonConfig.finalPrice,
    threeMonthTotal: jonConfig.finalPrice * 3,
    prepaymentDiscount: 0.10, // 10% prepayment discount
  };
  
  prepaymentCalculation.prepaymentTotal = Math.round(prepaymentCalculation.threeMonthTotal * (1 - prepaymentCalculation.prepaymentDiscount));
  prepaymentCalculation.totalSavings = prepaymentCalculation.threeMonthTotal - prepaymentCalculation.prepaymentTotal;
  
  console.log('\n💳 3-Month Prepayment Option:');
  console.log(`   Monthly Price (after coupon): $${(prepaymentCalculation.monthlyPrice / 100).toFixed(2)}`);
  console.log(`   3-Month Total: $${(prepaymentCalculation.threeMonthTotal / 100).toFixed(2)}`);
  console.log(`   Prepayment Discount: ${(prepaymentCalculation.prepaymentDiscount * 100)}%`);
  console.log(`   Prepayment Total: $${(prepaymentCalculation.prepaymentTotal / 100).toFixed(2)}`);
  console.log(`   Total Savings: $${(prepaymentCalculation.totalSavings / 100).toFixed(2)}`);
  
  console.log('\n🎯 Test Scenarios for Jon:');
  console.log('1. Monthly Subscription: $750/month');
  console.log('2. 3-Month Prepayment: $2,025 (save $225)');
  console.log('3. Consultation Booking: $150-500/hour');
  
  console.log('\n📋 Manual Testing Steps:');
  console.log('1. Visit http://localhost:5174/');
  console.log('2. Register as: jon@jwpartnership.com');
  console.log('3. Apply coupon: JON250');
  console.log('4. Select Starter tier');
  console.log('5. Choose payment option (monthly or prepayment)');
  console.log('6. Test with PayPal sandbox methods:');
  console.log('   • Use personal PayPal sandbox account');
  console.log('   • Test fraud detection (CCREJECT-SF)');
  console.log('   • Test card declined (CCREJECT-BANK_ERROR)');
  console.log('7. Complete PayPal checkout');
  console.log('8. Verify payment confirmation email');
  
  console.log('\n✅ Expected Results:');
  console.log('• PayPal payment order created');
  console.log('• Payment captured successfully');
  console.log('• Database record created with PayPal order ID');
  console.log('• Email confirmation sent');
  console.log('• Client subscription activated');
  
  console.log('\n🔧 Development Servers Running:');
  console.log('• Frontend: http://localhost:5174/');
  console.log('• Backend API: http://localhost:8789/');
  
  console.log('\n🚀 Ready to test Jon\'s payment flow!');
}

testJonPayment().catch(console.error);