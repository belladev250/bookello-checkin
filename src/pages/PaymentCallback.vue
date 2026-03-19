<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="max-w-md w-full">
      <!-- Payment Status Display -->
      <div class="bg-white rounded-2xl shadow-lg p-6 text-center">
        <div v-if="loading" class="py-8">
          <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 class="text-xl font-semibold text-gray-900">Verifying Payment...</h3>
          <p class="text-gray-600 mt-2">Please wait while we confirm your payment</p>
        </div>

        <div v-else-if="paymentStatus === 'success'" class="py-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
          <p class="text-gray-600 mb-6">Your payment has been processed successfully</p>
          <button 
            @click="goToDashboard"
            class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>

        <div v-else class="py-6">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h3>
          <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
          <div class="flex space-x-3">
            <button 
              @click="retryPayment"
              class="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              @click="contactSupport"
              class="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { doc, updateDoc, getDocs, query, where, collection } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { pesapalService } from '@/utils/pesapal'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const paymentStatus = ref('')
const errorMessage = ref('')

onMounted(async () => {
  await handlePaymentCallback()
})

const handlePaymentCallback = async () => {
  try {
    // Get parameters from URL
    const orderTrackingId = route.query.OrderTrackingId
    const orderMerchantReference = route.query.OrderMerchantReference
    
    console.log('🔄 Payment callback received:', { 
      orderTrackingId, 
      orderMerchantReference,
      fullQuery: route.query 
    })

    if (!orderTrackingId) {
      throw new Error('No payment reference found in URL parameters')
    }

    // Check payment status with PesaPal
    console.log('🔍 Checking payment status with PesaPal...')
    const statusResponse = await pesapalService.getOrderStatus(orderTrackingId)
    
    // Debug: Log the entire response to see its structure
    console.log('📊 FULL STATUS RESPONSE:', statusResponse)
    console.log('🔑 Response keys:', Object.keys(statusResponse))
    
    // Extract the actual payment status from the response
    const paymentStatusValue = statusResponse.payment_status_description || 
                              statusResponse.status_code ||
                              statusResponse.payment_status_code ||
                              statusResponse.status
    
    console.log('🎯 Payment status values found:', {
      payment_status_description: statusResponse.payment_status_description,
      status_code: statusResponse.status_code,
      payment_status_code: statusResponse.payment_status_code,
      status: statusResponse.status,
      extractedStatus: paymentStatusValue
    })

    // Check if payment was successful
    // PesaPal typically uses status codes like 1 for success, or descriptions like "Completed"
    if (paymentStatusValue === 1 || 
        paymentStatusValue === '1' ||
        paymentStatusValue === 'COMPLETED' || 
        paymentStatusValue === 'Completed' ||
        paymentStatusValue === 'completed' ||
        paymentStatusValue === 'SUCCESS' ||
        paymentStatusValue === 'Success') {
      
      console.log('✅ Payment successful, processing...')
      await handleSuccessfulPayment(orderTrackingId)
      
    } else if (paymentStatusValue === 0 || 
               paymentStatusValue === '0' ||
               paymentStatusValue === 'PENDING' || 
               paymentStatusValue === 'Pending' ||
               paymentStatusValue === 'pending') {
      
      paymentStatus.value = 'failed'
      errorMessage.value = 'Payment is still pending. Please wait for confirmation or try again.'
      await updatePaymentRecord(orderTrackingId, 'pending')
      
    } else if (paymentStatusValue === 2 || 
               paymentStatusValue === '2' ||
               paymentStatusValue === 'FAILED' || 
               paymentStatusValue === 'Failed' ||
               paymentStatusValue === 'failed') {
      
      paymentStatus.value = 'failed'
      errorMessage.value = 'Payment failed. Please try again or use a different payment method.'
      await updatePaymentRecord(orderTrackingId, 'failed')
      
    } else {
      // Unknown status
      paymentStatus.value = 'failed'
      errorMessage.value = `Unexpected payment status: ${paymentStatusValue}. Please contact support.`
      console.warn('⚠️ Unknown payment status:', paymentStatusValue)
      await updatePaymentRecord(orderTrackingId, 'unknown')
    }

  } catch (error) {
    console.error('❌ Payment callback error:', error)
    paymentStatus.value = 'failed'
    errorMessage.value = error.message || 'Failed to verify payment. Please contact support.'
  } finally {
    loading.value = false
  }
}

const handleSuccessfulPayment = async (orderTrackingId) => {
  paymentStatus.value = 'success'
  
  // Update payment record in Firestore
  await updatePaymentRecord(orderTrackingId, 'completed')
  
  // Update hotel subscription
  await activateHotelSubscription(orderTrackingId)
  
  console.log('✅ Payment processed successfully')
}

const updatePaymentRecord = async (orderTrackingId, status) => {
  try {
    // Find the payment record by orderTrackingId
    const paymentsQuery = await getDocs(
      query(
        collection(db, 'payments'),
        where('pesapalTrackingId', '==', orderTrackingId)
      )
    )
    
    if (!paymentsQuery.empty) {
      const paymentDoc = paymentsQuery.docs[0]
      await updateDoc(doc(db, 'payments', paymentDoc.id), {
        status: status,
        updatedAt: new Date(),
        ...(status === 'completed' && { completedAt: new Date() })
      })
      console.log('💾 Payment record updated to:', status)
    } else {
      console.warn('⚠️ No payment record found for tracking ID:', orderTrackingId)
    }
  } catch (error) {
    console.error('Error updating payment record:', error)
  }
}

const activateHotelSubscription = async (orderTrackingId) => {
  try {
    const user = auth.currentUser
    if (!user) {
      console.error('❌ No authenticated user found')
      return
    }

    // Find the hotel for this user
    const hotelsQuery = await getDocs(
      query(collection(db, 'Hotels'), where('ownerId', '==', user.uid))
    )
    
    if (!hotelsQuery.empty) {
      const hotelDoc = hotelsQuery.docs[0]
      console.log('🏨 Found hotel:', hotelDoc.id)

      // Find the payment to get plan details using orderTrackingId
      const paymentsQuery = await getDocs(
        query(
          collection(db, 'payments'),
          where('pesapalTrackingId', '==', orderTrackingId)
        )
      )
       
      if (!paymentsQuery.empty) {
        const paymentData = paymentsQuery.docs[0].data()
        console.log('💰 Payment data for activation:', paymentData)
        
        // Update hotel with active subscription
        await updateDoc(doc(db, 'Hotels', hotelDoc.id), {
          isActive: true,
          status: 'active',
          subscription: {
            status: 'active',
            plan: paymentData.plan,
            billingPeriod: paymentData.billingPeriod,
            startDate: new Date(),
            expiryDate: calculateExpiryDate(paymentData.billingPeriod)
          },
          activatedAt: new Date()
        })
        
        console.log('✅ Hotel subscription activated successfully')
      } else {
        console.error('❌ No payment data found for activation')
      }
    } else {
      console.error('❌ No hotel found for user')
    }
  } catch (error) {
    console.error('Error activating hotel subscription:', error)
  }
}

const calculateExpiryDate = (billingPeriod) => {
  const expiryDate = new Date()
  if (billingPeriod === 'monthly') {
    expiryDate.setMonth(expiryDate.getMonth() + 1)
  } else {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1)
  }
  return expiryDate
}

const goToDashboard = () => {
  router.push('/owner/dashboard')
}

const retryPayment = () => {
  router.push('/payment')
}

const contactSupport = () => {
  window.open('mailto:support@bookello.com', '_blank')
}
</script>