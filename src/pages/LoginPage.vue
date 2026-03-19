<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-blue-600">Hotel Management System</h1>
      <h2 class="text-xl font-semibold mb-4 text-center">Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            placeholder="admin@hotel.com" 
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="••••••••" 
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
            required
          />
        </div>
        <button 
          type="submit" 
          class="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-200 flex justify-center"
          :disabled="loading"
          :class="{'opacity-70 cursor-not-allowed': loading}"
        >
          <span v-if="!loading">Login</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </form>
      
      <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-700 rounded text-sm border border-red-200">
        {{ error }}
      </div>
      
      <div class="mt-4 text-center text-sm text-gray-600">
        <router-link to="/forgot-password" class="text-blue-600 hover:underline">
          Forgot password?
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form state
const form = ref({
  email: '',
  password: ''
});

// UI state
const loading = ref(false);
const error = ref('');

// Error messages mapping
const errorMessages = {
  'auth/invalid-credential': 'Invalid email or password',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/too-many-requests': 'Account temporarily locked due to too many failed attempts',
  'auth/user-disabled': 'This account has been disabled'
};

const handleLogin = async () => {
  // Reset error state
  error.value = '';
  loading.value = true;

  try {
    // 1. Authenticate with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      form.value.email, 
      form.value.password
    );
    
    const user = userCredential.user;
    console.log('User authenticated:', user.uid);

    // 2. Find staff record in Firestore (query by email)
    const staffQuery = query(
      collection(db, 'staff'),
      where('email', '==', user.email)
    );
    
    const querySnapshot = await getDocs(staffQuery);
    
    if (querySnapshot.empty) {
      throw new Error('Your account is not properly registered. Please contact administrator.');
    }

    // Get the first matching staff document (should only be one)
    const staffDoc = querySnapshot.docs[0];
    const staffData = staffDoc.data();
    
    console.log('Staff data:', staffData);

    // 3. Validate staff data
    if (!staffData.role) {
      throw new Error('Your account is missing role information. Please contact administrator.');
    }

    // 4. Redirect based on role
await redirectUser(staffData.role, staffData.hotelIds || staffData.hotelId);
    
  } catch (err) {
    console.error('Login error:', err);
    
    // Handle Firebase errors with user-friendly messages
    if (err.code && errorMessages[err.code]) {
      error.value = errorMessages[err.code];
    } else {
      error.value = err.message.replace('Firebase: ', '');
    }
    
    // Clear password field on error
    form.value.password = '';
    
  } finally {
    loading.value = false;
  }
};

const redirectUser = async (role, hotelIds) => {
  let validHotelIds = [];
  
  switch (role) {
    case 'super_admin':
      await router.push('/super-admin-dashboard');
      break;
      
    case 'reception':
      // Handle both array and single hotel ID
      validHotelIds = Array.isArray(hotelIds) 
        ? hotelIds 
        : hotelIds ? [hotelIds] : [];
      
      if (validHotelIds.length === 0) {
        throw new Error('No hotel assigned to your reception account');
      }
      
      await router.push(`/reception-dashboard?hotelId=${validHotelIds[0]}`);
      break;
      
    default:
      throw new Error('Unauthorized role: ' + role);
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>