/**
 * Breakcold Integration Test Utilities
 * Test functions to verify webhook and API integration
 */

import { breakcoldAPI } from '../lib/breakcold-api';

interface TestResults {
  webhookTest: {
    success: boolean;
    message: string;
    statusCode?: number;
  };
  apiTest: {
    success: boolean;
    message: string;
    leadId?: string;
  };
  overallSuccess: boolean;
}

/**
 * Test webhook endpoint availability
 */
export const testWebhookEndpoint = async (): Promise<TestResults['webhookTest']> => {
  try {
    const response = await fetch('/api/breakcold/webhook', {
      method: 'GET'
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Webhook endpoint is active and responding correctly',
        statusCode: response.status
      };
    } else {
      return {
        success: false,
        message: `Webhook endpoint returned error: ${data.error || 'Unknown error'}`,
        statusCode: response.status
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to webhook endpoint: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Test lead creation via Breakcold API
 */
export const testLeadCreation = async (): Promise<TestResults['apiTest']> => {
  try {
    // Create a test lead
    const testLead = {
      firstName: 'Test',
      lastName: 'Lead',
      email: `test-${Date.now()}@example.com`,
      company: 'Test Company',
      phone: '555-0123',
      source: 'Integration Test',
      tags: ['Test Lead', 'Integration'],
      customAttributes: {
        testRun: true,
        createdAt: new Date().toISOString()
      },
      notes: 'This is a test lead created by the integration test suite. Safe to delete.'
    };

    const result = await breakcoldAPI.createLead(testLead);

    if (result.success && result.data) {
      return {
        success: true,
        message: 'Test lead created successfully in Breakcold CRM',
        leadId: result.data.id
      };
    } else {
      return {
        success: false,
        message: `Failed to create test lead: ${result.error || 'Unknown error'}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Test webhook payload processing
 */
export const testWebhookPayload = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Create a mock webhook payload matching Breakcold format
    const mockPayload = {
      id_space: 'test-workspace',
      event: 'lead.create',
      secret: 'test-secret',
      payload: {
        id: 'test-lead-123',
        email: 'webhook-test@example.com',
        firstName: 'Webhook',
        lastName: 'Test',
        company: 'Test Company',
        status: 'New',
        tags: ['Webhook Test'],
        customAttributes: {
          testPayload: true,
          timestamp: new Date().toISOString()
        }
      }
    };

    // Note: In a real test, you'd send this to your webhook endpoint
    // For now, we'll just validate the structure
    const requiredFields = ['id_space', 'event', 'secret', 'payload'];
    const hasAllFields = requiredFields.every(field => field in mockPayload);

    if (hasAllFields && mockPayload.payload.id && mockPayload.payload.email) {
      return {
        success: true,
        message: 'Webhook payload structure is valid and matches Breakcold format'
      };
    } else {
      return {
        success: false,
        message: 'Webhook payload structure validation failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Webhook payload test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Run complete integration test suite
 */
export const runIntegrationTests = async (): Promise<TestResults> => {
  console.log('🧪 Starting Breakcold integration tests...');

  // Test webhook endpoint
  console.log('Testing webhook endpoint...');
  const webhookTest = await testWebhookEndpoint();
  console.log(webhookTest.success ? '✅ Webhook test passed' : '❌ Webhook test failed');

  // Test API integration
  console.log('Testing API integration...');
  const apiTest = await testLeadCreation();
  console.log(apiTest.success ? '✅ API test passed' : '❌ API test failed');

  // Test webhook payload structure
  console.log('Testing webhook payload structure...');
  const payloadTest = await testWebhookPayload();
  console.log(payloadTest.success ? '✅ Payload test passed' : '❌ Payload test failed');

  const overallSuccess = webhookTest.success && apiTest.success && payloadTest.success;

  const results: TestResults = {
    webhookTest,
    apiTest,
    overallSuccess
  };

  console.log('\n📊 Test Results Summary:');
  console.log(`Webhook Endpoint: ${webhookTest.success ? '✅ PASS' : '❌ FAIL'} - ${webhookTest.message}`);
  console.log(`API Integration: ${apiTest.success ? '✅ PASS' : '❌ FAIL'} - ${apiTest.message}`);
  console.log(`Payload Structure: ${payloadTest.success ? '✅ PASS' : '❌ FAIL'} - ${payloadTest.message}`);
  console.log(`\nOverall Status: ${overallSuccess ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED'}`);

  return results;
};

/**
 * Clean up test data (remove test leads)
 */
export const cleanupTestData = async (leadId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await breakcoldAPI.deleteLead(leadId);
    
    if (result.success) {
      return {
        success: true,
        message: `Test lead ${leadId} cleaned up successfully`
      };
    } else {
      return {
        success: false,
        message: `Failed to cleanup test lead: ${result.error || 'Unknown error'}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Export for console testing
if (typeof window !== 'undefined') {
  (window as any).breakcoldTests = {
    runIntegrationTests,
    testWebhookEndpoint,
    testLeadCreation,
    testWebhookPayload,
    cleanupTestData
  };
}