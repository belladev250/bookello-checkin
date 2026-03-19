<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="max-w-md w-full text-center">
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h3>
        <p class="text-gray-600 mb-6">Your payment was cancelled. You can try again anytime.</p>
        <div class="flex space-x-3">
          <button 
            @click="retryPayment"
            class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button 
            @click="goToDashboard"
            class="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const retryPayment = () => {
  router.push('/payment')
}

const goToDashboard = () => {
  router.push('/owner/dashboard')
}
</script>