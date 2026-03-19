<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Card Container -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <!-- Elegant Header Section -->
        <div class="relative px-6 py-10 text-center bg-white">
          <!-- Subtle background pattern -->
          <div class="absolute inset-0 opacity-5">
            <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23007bff%22 fill-opacity=%220.2%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
          </div>
          
          <!-- Logo Container -->
          <div class="relative mb-6">
            <div class="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 shadow-sm border border-blue-100">
              <div class="relative">
                <!-- Main icon -->
                <svg class="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3H6C4.89543 3 4 3.89543 4 5V21C4 22.1046 4.89543 23 6 23H18C19.1046 23 20 22.1046 20 21V5C20 3.89543 19.1046 3 18 3H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M8 7H16V17C16 18.1046 15.1046 19 14 19H10C8.89543 19 8 18.1046 8 17V7Z" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M14 3H10C9.44772 3 9 3.44772 9 4V6C9 6.55228 9.44772 7 10 7H14C14.5523 7 15 6.55228 15 6V4C15 3.44772 14.5523 3 14 3Z" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.5"/>
                  <line x1="10" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                
                <!-- Subtle decorative elements -->
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>
            </div>
          </div>
          
          <!-- Title & Subtitle -->
          <div class="relative space-y-2">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
              Bookello
            </h1>
            <div class="flex items-center justify-center space-x-2">
              <div class="h-px w-8 bg-gradient-to-r from-transparent to-blue-300"></div>
              <p class="text-sm font-medium text-gray-600 tracking-wide">CHECK-IN SYSTEM</p>
              <div class="h-px w-8 bg-gradient-to-l from-transparent to-blue-300"></div>
            </div>
          </div>
          
          <!-- Status indicator -->
          <div class="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-green-50 border border-green-200">
            <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span class="text-xs font-medium text-green-700">System Online</span>
          </div>
        </div>
        
        <!-- Form Section -->
        <div class="px-8 py-8 border-t border-gray-100">
          <h2 class="text-center text-lg font-semibold text-gray-800 mb-2">
            Sign in to your account
          </h2>
          <p class="text-center text-sm text-gray-600 mb-6">
            Or
            <router-link to="/hotel-register" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              register your property
            </router-link>
          </p>
          
          <form class="space-y-5" @submit.prevent="login">
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
            
            <!-- Password Input -->
            <div class="space-y-1">
              <div class="flex justify-between">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <a href="/forgot-password" class="text-xs text-blue-600 hover:text-blue-500 transition-colors">Forgot password?</a>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your password"
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
            <div>
              <button
                type="submit"
                :disabled="loading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="h-5 w-5 text-blue-300 group-hover:text-blue-200 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                {{ loading ? 'Signing in...' : 'Sign in' }}
              </button>
            </div>
          </form>
          
          <!-- Footer Note -->
          <div class="mt-6 text-center">
            <p class="text-xs text-gray-500">
              Secure access to the Bookello check-in system
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { useRouter } from 'vue-router'
import { collection, getDocs } from 'firebase/firestore'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  email: '',
  password: ''
})

const login = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const userCredential = await signInWithEmailAndPassword(auth, form.value.email, form.value.password)
    const user = userCredential.user

    // First check if user exists in 'users' collection (hotel owners/admins)
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      
      if (userData.role === 'admin') {
        router.push('/adminDashboard')
      } 
      else if (userData.role === 'owner') {
        router.push('/owner/dashboard')
      }else if (userData.role === 'sub_admin') {
        router.push('/adminDashboard')
      }
      else {
        errorMessage.value = 'Unauthorized access'
      }
    } else {
      // If not found in 'users', check 'staffs' collection (receptionists)
      const staffDoc = await getDoc(doc(db, 'staffs', user.uid))
      
      if (staffDoc.exists()) {
        const staffData = staffDoc.data()
        
        if (staffData.role === 'reception') {
          router.push('/reception-dashboard')
        } else if (staffData.role === 'super_admin' || staffData.role === 'hotel_admin') {
          router.push('/super-admin-dashboard')
        } else {
          errorMessage.value = 'Unauthorized access for staff role'
        }
      } else {
        errorMessage.value = 'User not found in database'
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Invalid email or password'
  } finally {
    loading.value = false
  }
}

// Check if admin exists
const checkAdminExists = async () => {
  try {
    const usersSnap = await getDocs(collection(db, 'users'))
    return usersSnap.docs.some(doc => {
      const userData = doc.data()
      return userData.role === 'admin' || userData.role === 'sub_admin'
    })
  } catch (error) {
    console.error('Error checking admin:', error)
    return false
  }
}

onMounted(async () => {
  // Check if admin setup is needed
  const hasAdmin = await checkAdminExists()
  if (!hasAdmin) {
    router.push('/')
  }
})
</script>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>