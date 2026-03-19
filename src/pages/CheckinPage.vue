<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-300">
    <!-- Hotel Header -->
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ currentHotel.name || 'Digital Check-In' }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ currentHotel.name ? 'Welcome! Please complete your check-in' : 'Self Check-In System' }}
      </p>
      
      <!-- Hotel Info Badge -->
      <div v-if="currentHotel.name" class="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        {{ currentHotel.name }}
      </div>
    </div>

    <!-- SUSPENDED HOTEL MESSAGE -->
    <div v-if="!hotelValid" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
      <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-red-800 mb-2">Check-in Unavailable</h3>
      <p class="text-red-700 mb-3">
        This property is currently suspended and cannot accept check-ins.
      </p>
      <p class="text-red-600 text-sm">
        Please contact the property directly for assistance with your booking.
      </p>
    </div>

    <!-- Guest Information -->
   <div class="mb-6" :class="{ 'opacity-50 pointer-events-none': formDisabled }">
      <h2 class="font-semibold mb-3 text-gray-800">Guest Information</h2>
      <div class="space-y-3">
        <div>
          <label class="block font-semibold mb-1 text-gray-800">Full Name *</label>
          <input 
            v-model="guestName" 
            type="text" 
            required
            :disabled="formDisabled"
            class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            placeholder="John Doe"
          >
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold mb-1 text-gray-800">Email *</label>
            <input 
              v-model="email" 
              type="email" 
              required
              :disabled="formDisabled"
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
              placeholder="john@example.com"
            >
          </div>
          <div>
            <label class="block font-semibold mb-1 text-gray-800">Phone *</label>
            <input 
              v-model="phone" 
              type="tel" 
              required
              :disabled="formDisabled"
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
              placeholder="+250 123 456 789"
            >
          </div>
        </div>
        
        <div>
          <label class="block font-semibold mb-1 text-gray-800">Nationality/Country *</label>
          <input 
            v-model="nationality" 
            type="text" 
            required
            :disabled="formDisabled"
            class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
            placeholder="e.g., Rwandan, American, British"
          >
        </div>
      </div>
    </div>

    <!-- Booking Source Selection -->
    <div class="mb-6" :class="{ 'opacity-50 pointer-events-none': formDisabled }">
      <h2 class="font-semibold mb-3 text-gray-800">Where did you book from?</h2>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="source in bookingSources"
          :key="source"
          @click="selectSource(source)"
          :disabled="formDisabled"
          :class="[
            'p-3 border rounded-lg text-center transition-colors',
            selectedSource === source 
              ? 'bg-blue-100 border-blue-500 text-blue-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50',
            formDisabled ? 'cursor-not-allowed opacity-50' : ''
          ]"
        >
          {{ source }}
        </button>
      </div>
    </div>

    <!-- Document Upload Sections -->
   <div class="space-y-6" :class="{ 'opacity-50 pointer-events-none': formDisabled }">
      <!-- Reservation Upload - NOW OPTIONAL -->
      <div>
        <h2 class="font-semibold mb-3 text-gray-800">Upload Reservation Confirmation <span class="text-gray-500 text-sm">(Optional)</span></h2>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
          <input 
            type="file" 
            @change="handleFileUpload($event, 'reservation')" 
            class="hidden" 
            id="reservationFile"
            ref="reservationFileInput"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            :disabled="formDisabled"
          >
          <label for="reservationFile" :class="['cursor-pointer', formDisabled ? 'cursor-not-allowed' : '']">
            <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p class="text-gray-500 mt-2">Choose file or drag it here</p>
            <span :class="['block mt-2 px-4 py-2 rounded-md text-gray-700', formDisabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200']">
              Select File
            </span>
          </label>
          <p v-if="reservationFile" class="text-sm mt-2 text-green-600 font-medium">
            ✓ {{ reservationFile.name }}
          </p>
        </div>
      </div>

      <!-- Passport/ID Upload - REQUIRED -->
      <div>
        <h2 class="font-semibold mb-3 text-gray-800">Upload Your Passport or ID *</h2>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
          <input 
            type="file" 
            @change="handleFileUpload($event, 'passport')" 
            class="hidden" 
            id="passportFile"
            ref="passportFileInput"
            accept=".pdf,.jpg,.jpeg,.png"
            :disabled="formDisabled"
          >
          <label for="passportFile" :class="['cursor-pointer', formDisabled ? 'cursor-not-allowed' : '']">
            <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <p class="text-gray-500 mt-2">Upload your identification document</p>
            <span :class="['block mt-2 px-4 py-2 rounded-md text-gray-700', formDisabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200']">
              Select File
            </span>
          </label>
          <p v-if="passportFile" class="text-sm mt-2 text-green-600 font-medium">
            ✓ {{ passportFile.name }}
          </p>
        </div>
      </div>
    </div>

    <!-- Booking Details -->
    <div class="mt-6 space-y-4" :class="{ 'opacity-50 pointer-events-none': formDisabled }">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-semibold mb-1 text-gray-800">Check-in Date *</label>
          <input 
            v-model="checkIn" 
            type="date" 
            required
            :disabled="formDisabled"
            class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
        </div>
        <div>
          <label class="block font-semibold mb-1 text-gray-800">Check-out Date *</label>
          <input 
            v-model="checkOut" 
            type="date" 
            required
            :disabled="formDisabled"
            class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-semibold mb-1 text-gray-800">Amount *</label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500">rwf</span>
            <input 
              v-model="amount" 
              type="text" 
              required
              :disabled="formDisabled"
              class="w-full border border-gray-300 rounded-md p-2 pl-7 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
              placeholder="200"
            >
          </div>
        </div>
      </div>
    </div>
  
    <!-- Payment Method -->
   <div class="mt-6" :class="{ 'opacity-50 pointer-events-none': formDisabled }">
      <h2 class="font-semibold mb-3 text-gray-800">Payment Method</h2>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="method in paymentMethods"
          :key="method.value"
          @click="paymentMethod = method.value"
          :disabled="formDisabled"
          :class="[
            'p-3 border rounded-lg text-center transition-colors',
            paymentMethod === method.value 
              ? 'bg-blue-100 border-blue-500 text-blue-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50',
            formDisabled ? 'cursor-not-allowed opacity-50' : ''
          ]"
        >
          {{ method.label }}
        </button>
      </div>
    </div>

    <!-- Status Messages -->
    <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
      {{ successMessage }}
    </div>

    <!-- EMAIL STATUS SECTION -->
    <div v-if="emailStatus.visible" class="mt-6 space-y-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-semibold text-blue-800 mb-3 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Email Status
        </h3>
        
        <div class="space-y-3">
          <!-- Guest Confirmation -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="[
                'w-3 h-3 rounded-full mr-2',
                emailStatus.confirmation.sent ? 'bg-green-500' : 
                emailStatus.confirmation.processing ? 'bg-yellow-500' : 'bg-gray-300'
              ]"></div>
              <span class="text-sm font-medium text-gray-700">Guest Confirmation</span>
            </div>
            <span :class="[
              'text-xs px-2 py-1 rounded-full',
              emailStatus.confirmation.sent ? 'bg-green-100 text-green-800' :
              emailStatus.confirmation.processing ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            ]">
              {{ emailStatus.confirmation.sent ? '✓ Sent' : 
                 emailStatus.confirmation.processing ? '⏳ Sending...' : 'Pending' }}
            </span>
          </div>
          
          <!-- Provider Notification -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="[
                'w-3 h-3 rounded-full mr-2',
                emailStatus.provider.sent ? 'bg-green-500' : 
                emailStatus.provider.processing ? 'bg-yellow-500' : 'bg-gray-300'
              ]"></div>
              <span class="text-sm font-medium text-gray-700">Property Notification</span>
            </div>
            <span :class="[
              'text-xs px-2 py-1 rounded-full',
              emailStatus.provider.sent ? 'bg-green-100 text-green-800' :
              emailStatus.provider.processing ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            ]">
              {{ emailStatus.provider.sent ? '✓ Sent' : 
                 emailStatus.provider.processing ? '⏳ Sending...' : 'Pending' }}
            </span>
          </div>
          
          <!-- Marketplace Services -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="[
                'w-3 h-3 rounded-full mr-2',
                emailStatus.services.sent ? 'bg-green-500' : 
                emailStatus.services.scheduled ? 'bg-blue-300' : 'bg-gray-300'
              ]"></div>
              <span class="text-sm font-medium text-gray-700">Services Guide</span>
            </div>
            <span :class="[
              'text-xs px-2 py-1 rounded-full',
              emailStatus.services.sent ? 'bg-green-100 text-green-800' :
              emailStatus.services.scheduled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            ]">
              {{ emailStatus.services.sent ? '✓ Sent' : 
                 emailStatus.services.scheduled ? '📅 In 5 min' : 'Pending' }}
            </span>
          </div>
        </div>
        
        <div class="mt-3 pt-3 border-t border-blue-200">
          <p class="text-xs text-blue-700">
            ✅ Check-in complete! 
          </p>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
   <button 
      @click="submit" 
      :disabled="isLoading || formDisabled"
      :class="[
        'w-full mt-6 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center',
        formDisabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : isLoading 
            ? 'bg-blue-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
      ]"
    >
      <div v-if="isLoading" class="flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </div>
      <span v-else>
        {{ formDisabled ? 'Check-in Unavailable' : 'Complete Check-in' }}
      </span>
    </button>

    <!-- Hotel Info Footer -->
    <div v-if="currentHotel.name" class="mt-4 text-center text-sm text-gray-500">
      Checking in at: <strong>{{ currentHotel.name }}</strong>
      <span v-if="!hotelValid" class="block text-red-500 font-semibold mt-1">
        ⚠️ Currently Suspended
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase' 
import { collection, addDoc, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import { syncGuestToSheets } from '@/utils/sheetsSync'

const route = useRoute()

// Reactive data
const currentHotel = ref({})
const hotelId = ref('')
const selectedSource = ref('')
const guestName = ref('')
const email = ref('')
const phone = ref('')
const nationality = ref('')
const checkIn = ref('')
const checkOut = ref('')
const amount = ref('')
const paymentMethod = ref('cash')
const reservationFile = ref(null)
const passportFile = ref(null)
const reservationFileInput = ref(null)
const passportFileInput = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const hotelValid = ref(true) 
const formDisabled = ref(false)

// Email status tracking
const emailStatus = ref({
  visible: false,
  confirmation: { sent: false, processing: false },
  provider: { sent: false, processing: false },
  services: { sent: false, processing: false, scheduled: false },
  unsubscribe: null
})

// Constants
const bookingSources = ref([
  'Bookello',
  'Booking.com', 
  'Agora',
  'Expedia',
  'Hotel.com',
  'Walk-in',
  'Other'
])

const paymentMethods = ref([
  { value: 'cash', label: '💵 Cash' },
  { value: 'card', label: '💳 Card' }
])

onMounted(async () => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  checkIn.value = today.toISOString().split('T')[0]
  checkOut.value = tomorrow.toISOString().split('T')[0]
  
  // Load hotel from QR code
  if (route.params.hotelId) {
    hotelId.value = route.params.hotelId
    await loadHotelFromQR()
  } else {
    errorMessage.value = 'No hotel specified. Please scan the QR code provided by the hotel.'
    formDisabled.value = true
  }
})

// Methods
const loadHotelFromQR = async () => {
  try {
    if (!hotelId.value) {
      errorMessage.value = 'Invalid QR code. Please contact the hotel staff.'
      formDisabled.value = true
      return
    }

    const hotelDoc = await getDoc(doc(db, 'Hotels', hotelId.value))
    if (hotelDoc.exists()) {
      const hotelData = hotelDoc.data()
      currentHotel.value = {
        id: hotelDoc.id,
        ...hotelData
      }
      
      // Check if hotel is active and not suspended
      const isHotelActive = hotelData.isActive && hotelData.subscription?.status === 'active'
      
      if (!isHotelActive) {
        hotelValid.value = false
        formDisabled.value = true
        errorMessage.value = 'This property is currently suspended and cannot accept check-ins. Please contact the hotel directly for assistance.'
      } else {
        hotelValid.value = true
        formDisabled.value = false
      }
    } else {
      errorMessage.value = 'Hotel not found. Please check your QR code or contact the hotel.'
      formDisabled.value = true
    }
  } catch (error) {
    console.error('Error loading hotel:', error)
    errorMessage.value = 'Failed to load hotel information. Please try again.'
    formDisabled.value = true
  }
}

const selectSource = (source) => {
  selectedSource.value = source
  errorMessage.value = ''
}

const handleFileUpload = (event, type) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = 'File size must be less than 10MB'
    return
  }
  
  // Validate file type
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
  if (!validImageTypes.includes(file.type)) {
    errorMessage.value = 'Please upload PDF, JPG, or PNG files only'
    return
  }
  
  if (type === 'reservation') {
    reservationFile.value = file
  } else {
    passportFile.value = file
  }
  
  errorMessage.value = ''
}

const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'bookello_pics')
  
  const response = await fetch('https://api.cloudinary.com/v1_1/dpfkxvnln/image/upload', {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error('Failed to upload file')
  }
  
  const data = await response.json()
  return data.secure_url
}

const validateForm = () => {
  errorMessage.value = ''
  
  // Check if hotel is valid before any other validation
  if (!hotelValid.value) {
    errorMessage.value = 'This hotel is currently suspended and cannot accept check-ins.'
    return false
  }
  
  if (!currentHotel.value.id) {
    errorMessage.value = 'Hotel information not loaded. Please scan the QR code again.'
    return false
  }
  
  if (!selectedSource.value) {
    errorMessage.value = 'Please select where you booked from.'
    return false
  }
  
  if (!guestName.value.trim()) {
    errorMessage.value = 'Please enter your full name.'
    return false
  }
  
  if (!email.value.trim()) {
    errorMessage.value = 'Please enter your email address.'
    return false
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Please enter a valid email address.'
    return false
  }
  
  if (!phone.value.trim()) {
    errorMessage.value = 'Please enter your phone number.'
    return false
  }
  
  if (!nationality.value.trim()) {
    errorMessage.value = 'Please enter your nationality or country.'
    return false
  }
  
  if (!checkIn.value) {
    errorMessage.value = 'Please select check-in date.'
    return false
  }
  
  if (!checkOut.value) {
    errorMessage.value = 'Please select check-out date.'
    return false
  }
  
  if (!amount.value.trim()) {
    errorMessage.value = 'Please enter the amount.'
    return false
  }
  
  if (!paymentMethod.value) {
    errorMessage.value = 'Please select a payment method.'
    return false
  }
  
  // PASSPORT IS STILL REQUIRED - RESERVATION IS NOW OPTIONAL
  if (!passportFile.value) {
    errorMessage.value = 'Please upload your passport or ID.'
    return false
  }
  
  const checkInDate = new Date(checkIn.value)
  const checkOutDate = new Date(checkOut.value)
  
  if (checkOutDate <= checkInDate) {
    errorMessage.value = 'Check-out date must be after check-in date.'
    return false
  }
  
  if (checkInDate < new Date().setHours(0,0,0,0)) {
    errorMessage.value = 'Check-in date cannot be in the past.'
    return false
  }
  
  return true
}

// Set up email status listener
const setupEmailStatusListener = (checkinId) => {
  const checkinRef = doc(db, 'Checkins', checkinId)
  
  // Clean up any existing listener
  if (emailStatus.value.unsubscribe) {
    emailStatus.value.unsubscribe()
  }
  
  // Set up new listener
  const unsubscribe = onSnapshot(checkinRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data()
      
      // Update guest confirmation email status
      if (data.confirmationEmailSent) {
        emailStatus.value.confirmation.sent = true
        emailStatus.value.confirmation.processing = false
      } else {
        emailStatus.value.confirmation.processing = true
      }
      
      // Update provider notification email status
      if (data.ownerNotificationSent) {
        emailStatus.value.provider.sent = true
        emailStatus.value.provider.processing = false
      } else {
        emailStatus.value.provider.processing = true
      }
      
      // Update marketplace services email status
      if (data.servicesEmailSent) {
        emailStatus.value.services.sent = true
        emailStatus.value.services.processing = false
        emailStatus.value.services.scheduled = false
      } else {
        // Mark as scheduled if not sent yet
        emailStatus.value.services.scheduled = true
      }
      
      // Clean up listener after guest and provider emails are sent
      // (services email is delayed, so we don't wait for it)
      if (data.confirmationEmailSent && data.ownerNotificationSent) {
        setTimeout(() => {
          if (emailStatus.value.unsubscribe) {
            emailStatus.value.unsubscribe()
            emailStatus.value.unsubscribe = null
          }
        }, 30000) // Clean up after 30 seconds
      }
    }
  })
  
  // Store unsubscribe function
  emailStatus.value.unsubscribe = unsubscribe
  
  // Auto-cleanup after 5 minutes max
  setTimeout(() => {
    if (emailStatus.value.unsubscribe) {
      emailStatus.value.unsubscribe()
      emailStatus.value.unsubscribe = null
    }
  }, 300000)
}

const submit = async () => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  emailStatus.value.visible = false
  
  try {
    // Upload passport (required)
    const passportURL = await uploadToCloudinary(passportFile.value)
    
    // Upload reservation only if provided (optional)
    let reservationURL = null
    if (reservationFile.value) {
      reservationURL = await uploadToCloudinary(reservationFile.value)
    }

    // Prepare check-in data
    const checkinData = {
      source: selectedSource.value,
      guestName: guestName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      nationality: nationality.value.trim(),
      hotel: currentHotel.value.name,
      hotelId: currentHotel.value.id,
      amount: amount.value.trim(),
      checkInDate: checkIn.value,
      checkOutDate: checkOut.value,
      paymentMethod: paymentMethod.value,
      reservationURL: reservationURL || null,
      passportURL: passportURL,
      reservationFileName: reservationFile.value?.name || null,
      passportFileName: passportFile.value.name,
      submittedAt: new Date().toISOString(),
      status: 'checked_in',
      // Email status flags (these will be updated by Firebase Functions)
      confirmationEmailSent: false,
      ownerNotificationSent: false,
      servicesEmailSent: false,
      checkOutThankYouSent: false
    }

    console.log('🔄 Saving check-in to Firestore...')
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'Checkins'), checkinData)

    console.log('✅ Check-in saved with ID:', docRef.id)
    
    // Set up email status tracking
    setupEmailStatusListener(docRef.id)
    
    // Show email status section
    emailStatus.value.visible = true

    // SYNC ONLY GUEST INFO TO CRM (async)
    setTimeout(async () => {
      try {
        await syncGuestToSheets(checkinData)
      } catch (sheetsError) {
        console.warn('⚠️ Failed to sync to CRM:', sheetsError)
      }
    }, 1000)
    
    successMessage.value = "✅ Check-in completed successfully! You'll receive a confirmation email shortly."
    
    // Handle payment redirect for card payments
    if (paymentMethod.value === 'card') {
      setTimeout(() => {
        window.location.href = 'https://shop.directpay.online/paymybills/KIGALIFANTASTICAPARTMENT'
      }, 1500)
    } else {
      // Auto-reset form after 15 seconds for next guest
      setTimeout(() => {
        resetForm()
      }, 15000)
    }

  } catch (error) {
    console.error('❌ Error submitting check-in:', error)
    errorMessage.value = 'Failed to submit check-in. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Reset form function
const resetForm = () => {
  selectedSource.value = ''
  guestName.value = ''
  email.value = ''
  phone.value = ''
  nationality.value = ''
  amount.value = ''
  paymentMethod.value = 'cash'
  reservationFile.value = null
  passportFile.value = null
  successMessage.value = ''
  emailStatus.value.visible = false
  emailStatus.value.confirmation = { sent: false, processing: false }
  emailStatus.value.provider = { sent: false, processing: false }
  emailStatus.value.services = { sent: false, processing: false, scheduled: false }
  
  // Clean up Firestore listener
  if (emailStatus.value.unsubscribe) {
    emailStatus.value.unsubscribe()
    emailStatus.value.unsubscribe = null
  }
  
  // Reset file inputs
  if (reservationFileInput.value) reservationFileInput.value.value = ''
  if (passportFileInput.value) passportFileInput.value.value = ''
  
  // Reset dates to today and tomorrow
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  checkIn.value = today.toISOString().split('T')[0]
  checkOut.value = tomorrow.toISOString().split('T')[0]
}
</script>