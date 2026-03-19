<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Setup Admin Account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Create the first admin account for the system
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="setupAdmin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Admin Email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Admin email address"
            >
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password (min. 6 characters)"
            >
          </div>
        </div>

        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
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

        <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">{{ successMessage }}</h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            {{ loading ? 'Creating Admin...' : 'Create Admin Account' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="text-blue-600 hover:text-blue-500 text-sm">
            Back to Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDocs, collection } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const adminExists = ref(false)

const form = ref({
  email: '',
  password: ''
})

// Check if admin already exists
const checkAdminExists = async () => {
  try {
    const usersSnap = await getDocs(collection(db, 'users'))
    const adminUser = usersSnap.docs.find(doc => doc.data().role === 'admin')
    
    if (adminUser) {
      adminExists.value = true
      errorMessage.value = 'Admin account already exists. Please login instead.'
    }
  } catch (error) {
    console.error('Error checking admin:', error)
  }
}

const setupAdmin = async () => {
  if (form.value.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    
    // Create admin user in Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password)
    const user = userCredential.user
    
    // Set admin role in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: form.value.email,
      role: 'admin',
      createdAt: new Date(),
      isSuperAdmin: true
    })

    successMessage.value = 'Admin account created successfully! Redirecting to dashboard...'
    
    // Redirect to admin dashboard after 2 seconds
    setTimeout(() => {
      router.push('/adminDashboard')
    }, 2000)

  } catch (error) {
    console.error('Admin setup error:', error)
    if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = 'This email is already registered. Please use a different email.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage.value = 'Password is too weak. Please use a stronger password.'
    } else {
      errorMessage.value = 'Error creating admin account: ' + error.message
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkAdminExists()
})
</script>