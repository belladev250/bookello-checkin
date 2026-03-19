// src/utils/pesapal.js - UPDATED
import axios from 'axios';

// ⚠️ IMPORTANT: Use your actual Firebase project ID
const FIREBASE_FUNCTIONS_URL = 'https://us-central1-bookello-checkin.cloudfunctions.net';

class PesaPalService {
 
// In your pesapalService.js


async submitOrder(orderDetails) {
    try {

      const response = await axios.post(
        'https://us-central1-bookello-checkin.cloudfunctions.net/pesapalSubmitOrder',
        {
          id: orderDetails.orderId,
          amount: orderDetails.amount,
          description: orderDetails.description,
          callback_url: `${window.location.origin}/payment-callback`,
          cancellation_url: `${window.location.origin}/payment-cancelled`,
          billing_address: {
            email_address: orderDetails.email,
            phone_number: orderDetails.phone || '+250784343434',
            first_name: orderDetails.firstName,
            last_name: orderDetails.lastName,
            country_code: 'RW',
            city: 'Kigali'
          }
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📦 PesaPal API response:', response.data);

      // ✅ SIMPLE: Just check if we have a redirect URL
      const redirectUrl = response.data.redirect_url || response.data.redirectUrl;
      
      if (!redirectUrl) {
        throw new Error('Payment service did not return a payment page');
      }

      return response.data;

    } catch (error) {
      console.error('❌ PesaPal service error:', error);
      
      if (error.response?.data) {
        // ✅ If we have a redirect URL in the error response, use it
        const redirectUrl = error.response.data.redirect_url || error.response.data.redirectUrl;
        if (redirectUrl) {
          console.log('🔄 Using redirect URL from error response');
          return error.response.data;
        }
        
        throw new Error(error.response.data.error?.message || 'Payment failed');
      }
      
      throw new Error(error.message || 'Payment service temporarily unavailable');
    }
  }

 

 async getOrderStatus(orderTrackingId) {
  try {
    console.log('🔍 Checking payment status for:', orderTrackingId);
    
    const response = await axios.get(
      `${FIREBASE_FUNCTIONS_URL}/pesapalGetStatus?orderTrackingId=${orderTrackingId}`,
      {
        timeout: 15000
      }
    );
    
    console.log('✅ Status check HTTP response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    
    // Return the actual data from the response
    return response.data;
    
  } catch (error) {
    console.error('❌ Status check failed:', error);
    
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
      return error.response.data;
    }
    
    throw new Error('Unable to verify payment status. Please contact support.');
  }
}

  validateOrderDetails(orderDetails) {
    const { orderId, amount, email } = orderDetails;
    
    if (!orderId || !amount || !email) {
      throw new Error('Missing required order details');
    }
    
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      throw new Error('Invalid amount specified');
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address');
    }
  }

  getErrorMessage(error) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message;
      
      switch (status) {
        case 400:
          return message || 'Invalid payment details. Please check your information.';
        case 500:
          return 'Payment service temporarily unavailable. Please try again.';
        default:
          return message || 'Payment processing failed. Please try again.';
      }
    } else if (error.request) {
      // Request made but no response received
      return 'Unable to connect to payment service. Please check your internet connection.';
    } else {
      // Something else happened
      return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  generateOrderId(prefix = 'BOOK') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}-${timestamp}-${random}`.toUpperCase();
  }
}

export const pesapalService = new PesaPalService();