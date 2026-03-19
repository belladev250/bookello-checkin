<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Card Container -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <!-- Header Section -->
        <div class="relative px-6 py-10 text-center bg-white">
          <div class="absolute inset-0 opacity-5">
            <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23007bff%22 fill-opacity=%220.2%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
          </div>
          
          <!-- Logo -->
          <div class="relative mb-6">
            <div class="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 shadow-sm border border-blue-100">
              <svg class="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          
          <!-- Title & Subtitle -->
          <div class="relative space-y-2">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
              Bookello
            </h1>
            <p class="text-sm font-medium text-gray-600 tracking-wide">Reset Your Password</p>
          </div>
        </div>
        
        <!-- Form Section -->
        <div class="px-8 py-8 border-t border-gray-100">
          <div v-if="!emailSent">
            <h2 class="text-center text-lg font-semibold text-gray-800 mb-2">
              Forgot your password?
            </h2>
            <p class="text-center text-sm text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <form class="space-y-5" @submit.prevent="sendResetEmail">
              <!-- Email Input -->
              <div class="space-y-1">
                <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    v-model="form.email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your email"
                  >
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 border border-red-200 animate-fade-in">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="space-y-3">
                <button
                  type="submit"
                  :disabled="loading"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg class="h-5 w-5 text-blue-300 group-hover:text-blue-200 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                  {{ loading ? 'Sending...' : 'Send Reset Link' }}
                </button>
                
                <router-link 
                  to="/login" 
                  class="block text-center w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Back to Sign In
                </router-link>
              </div>
            </form>
          </div>
          
          <!-- Success Message -->
          <div v-else class="text-center space-y-4">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h3 class="text-lg font-medium text-gray-900">Check your email</h3>
            <p class="text-sm text-gray-600">
              We've sent a password reset link to <strong>{{ form.email }}</strong>
            </p>
            <p class="text-xs text-gray-500">
              If you don't see the email, check your spam folder or try again.
            </p>
            
            <div class="space-y-2 pt-4">
              <button
                @click="resetForm"
                class="w-full py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Send another reset link
              </button>
              <router-link 
                to="/login" 
                class="block w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Back to Sign In
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebase'

const loading = ref(false)
const errorMessage = ref('')
const emailSent = ref(false)

const form = ref({
  email: ''
})

const sendResetEmail = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await sendPasswordResetEmail(auth, form.value.email)
    emailSent.value = true
  } catch (error) {
    console.error('Password reset error:', error)
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage.value = 'No account found with this email address'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'Invalid email address'
        break
      case 'auth/too-many-requests':
        errorMessage.value = 'Too many attempts. Please try again later'
        break
      default:
        errorMessage.value = 'Failed to send reset email. Please try again'
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  emailSent.value = false
  errorMessage.value = ''
}
</script>

<style scoped>
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>