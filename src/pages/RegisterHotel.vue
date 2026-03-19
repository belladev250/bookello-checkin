<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
    <!-- Main Card -->
    <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-8 text-center text-white">
        <div class="flex items-center justify-center space-x-3 mb-4">
          <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3H6C4.89543 3 4 3.89543 4 5V21C4 22.1046 4.89543 23 6 23H18C19.1046 23 20 22.1046 20 21V5C20 3.89543 19.1046 3 18 3H16" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M8 7H16V17C16 18.1046 15.1046 19 14 19H10C8.89543 19 8 18.1046 8 17V7Z" fill="white" fill-opacity="0.2" stroke="white" stroke-width="1.5"/>
              <path d="M14 3H10C9.44772 3 9 3.44772 9 4V6C9 6.55228 9.44772 7 10 7H14C14.5523 7 15 6.55228 15 6V4C15 3.44772 14.5523 3 14 3Z" fill="white" fill-opacity="0.3" stroke="white" stroke-width="1.5"/>
              <line x1="10" y1="11" x2="14" y2="11" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="10" y1="14" x2="14" y2="14" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold">Bookello</h1>
        </div>
        <p class="text-blue-100 text-lg">Property Registration Portal</p>
      </div>

      <!-- Progress Steps -->
      <div class="px-8 pt-6">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center space-x-2">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500']">1</div>
            <span :class="['text-sm font-medium', step >= 1 ? 'text-blue-600' : 'text-gray-500']">Owner Details</span>
          </div>
          <div class="h-1 flex-1 mx-2 bg-gray-200">
            <div class="h-1 bg-blue-600 transition-all duration-300" :style="{ width: step >= 2 ? '100%' : '0%' }"></div>
          </div>
          <div class="flex items-center space-x-2">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500']">2</div>
            <span :class="['text-sm font-medium', step >= 2 ? 'text-blue-600' : 'text-gray-500']">Property Info</span>
          </div>
          <div class="h-1 flex-1 mx-2 bg-gray-200">
            <div class="h-1 bg-blue-600 transition-all duration-300" :style="{ width: step >= 3 ? '100%' : '0%' }"></div>
          </div>
          <div class="flex items-center space-x-2">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500']">3</div>
            <span :class="['text-sm font-medium', step >= 3 ? 'text-blue-600' : 'text-gray-500']">Documents</span>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="px-8 pb-8">
        <!-- Step 1: Owner Details -->
        <div v-if="step === 1" class="space-y-6 animate-fade-in">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Owner Information</h2>
            <p class="text-gray-600 mt-2">Tell us about yourself</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Full Name *</label>
              <input 
                v-model="form.ownerName" 
                type="text" 
                class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your full name"
              >
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Phone Number *</label>
              <input 
                v-model="form.ownerPhone" 
                type="tel" 
                class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="+1 (555) 000-0000"
              >
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Email Address *</label>
            <input 
              v-model="form.email" 
              type="email" 
              class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="your@email.com"
            >
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Password *</label>
            <input 
              v-model="form.password" 
              type="password" 
              class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Create a secure password"
            >
            <p class="text-xs text-gray-500 mt-1">Minimum 6 characters with letters and numbers</p>
          </div>
          
          <button 
            @click="validateStep1" 
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Continue to Property Details
            <svg class="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Step 2: Property Details -->
        <div v-if="step === 2" class="space-y-6 animate-fade-in">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Property Information</h2>
            <p class="text-gray-600 mt-2">Tell us about your property</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Property Name *</label>
            <input 
              v-model="form.hotelName" 
              class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your property name"
            >
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Google Maps Link *</label>
            <input 
              v-model="form.location" 
              class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Full address of your property"
            >
          </div>

          
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Number of Rooms *</label>
            <input 
              v-model="form.roomCount" 
              type="number" 
              min="1" 
              class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter total number of rooms"
            >
          </div>
          
          <div class="flex space-x-4 pt-4">
            <button 
              @click="step = 1" 
              class="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-300"
            >
              <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <button 
              @click="validateStep2" 
              class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              Continue to Documents
              <svg class="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Step 3: Documents -->
        <div v-if="step === 3" class="space-y-6 animate-fade-in">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Required Documents</h2>
            <p class="text-gray-600 mt-2">Upload your property documentation</p>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div class="flex items-start space-x-3">
              <div class="bg-blue-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-blue-700 font-medium">Required Documents</p>
                <p class="text-sm text-blue-600 mt-1">Please upload clear photos or scans of all documents for verification.</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
       
            
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700">TIN Certificate *</label>
              <div class="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
                <FileUpload :input-id="'tinUpload'" @file-uploaded="(url) => { form.documents.tin = url; checkDocuments() }" />
                <p class="text-xs text-gray-500 mt-2">Upload TIN certificate</p>
              </div>
              <p v-if="form.documents.tin" class="text-sm text-green-600 font-medium flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                TIN Certificate uploaded
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-700">Owner ID *</label>
            <div class="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
              <FileUpload :input-id="'idUpload'" @file-uploaded="(url) => { form.documents.id = url; checkDocuments() }" />
              <p class="text-xs text-gray-500 mt-2">Upload government-issued ID</p>
            </div>
            <p v-if="form.documents.id" class="text-sm text-green-600 font-medium flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Owner ID uploaded
            </p>
          </div>

          <!-- Status Messages -->
          <div v-if="!allDocumentsUploaded" class="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div class="flex items-center space-x-3">
              <div class="bg-yellow-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-yellow-700 font-medium">Pending Documents</p>
                <p class="text-sm text-yellow-600 mt-1">Please upload all required documents to continue.</p>
              </div>
            </div>
          </div>

          <div v-else class="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div class="flex items-center space-x-3">
              <div class="bg-green-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-green-700 font-medium">Ready to Submit</p>
                <p class="text-sm text-green-600 mt-1">All documents have been uploaded successfully.</p>
              </div>
            </div>
          </div>

          <div class="flex space-x-4 pt-4">
            <button 
              @click="step = 2" 
              class="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-300"
            >
              <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <button 
              @click="submitRegistration" 
              :disabled="loading || !allDocumentsUploaded"
              class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else class="flex items-center justify-center">
                Submit Application
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </span>
            </button>
          </div>

          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div class="flex items-center space-x-3">
              <div class="bg-red-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-red-700 font-medium">Submission Error</p>
                <p class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc,collection,addDoc,updateDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { useRouter } from 'vue-router'
import FileUpload from '@/components/FileUpload.vue'
import { syncToSheets } from '@/utils/sheetsSync';
import { postmarkService } from '@/utils/postmarkService'


const router = useRouter()
const step = ref(1)
const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  ownerName: '',
  ownerPhone: '',
  email: '',
  password: '',
  hotelName: '',
  location: '',
  roomCount: null,
  documents: { rdb: '', tin: '', id: '' }
})

const allDocumentsUploaded = computed(() => {
  return form.value.documents.tin && form.value.documents.id
})

const validateStep1 = () => {
  if (!form.value.ownerName.trim()) {
    errorMessage.value = 'Please enter owner name'
    return
  }
  if (!form.value.ownerPhone.trim()) {
    errorMessage.value = 'Please enter owner phone number'
    return
  }
  if (!form.value.email.trim()) {
    errorMessage.value = 'Please enter email address'
    return
  }
  if (!form.value.password || form.value.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }
  errorMessage.value = ''
  step.value = 2
}

const validateStep2 = () => {
  if (!form.value.hotelName.trim()) {
    errorMessage.value = 'Please enter hotel name'
    return
  }
  if (!form.value.location.trim()) {
    errorMessage.value = 'Please enter hotel location'
    return
  }
  if (!form.value.roomCount || form.value.roomCount < 1) {
    errorMessage.value = 'Please enter a valid number of rooms'
    return
  }
  errorMessage.value = ''
  step.value = 3
}

const checkDocuments = () => {
  console.log('Current documents:', form.value.documents)
}

const submitRegistration = async () => {
  if (!allDocumentsUploaded.value) {
    errorMessage.value = 'Please upload all required documents before submitting.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // 1. Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password)
    const userId = userCredential.user.uid
    
    // 2. Create hotel record immediately
    const hotelRef = await addDoc(collection(db, 'Hotels'), {
      name: form.value.hotelName.trim(),
      location: form.value.location.trim(),
      roomCount: Number(form.value.roomCount),
      ownerId: userId,
      ownerEmail: form.value.email.trim(),
      ownerName: form.value.ownerName.trim(),
      isActive: false,
      createdAt: new Date(),
      documents: form.value.documents,
      status: 'pending'
    });
    
    const hotelId = hotelRef.id;

    const registrationData = {
      hotelId: hotelId,
      hotelName: form.value.hotelName.trim(),
      location: form.value.location.trim(),
      roomCount: Number(form.value.roomCount),
      ownerName: form.value.ownerName.trim(),
      ownerEmail: form.value.email.trim(),
      ownerPhone: form.value.ownerPhone.trim(),
      documents: form.value.documents,
      status: 'pending',
      createdAt: new Date(),
      ownerId: userId
    }

    // 3. Save to registrations collection
    await setDoc(doc(db, 'registrations', hotelId), {
      ...registrationData,
      registrationEmailSent: false 
    });

    // 4. Save user document
    await setDoc(doc(db, 'users', userId), {
      email: form.value.email,
      role: 'owner',
      createdAt: new Date(),
      hotelId: hotelId
    })

    // 5. Send registration confirmation email
    const emailResult = await postmarkService.sendEmail('property_registration_pending', {
      providerName: form.value.ownerName.trim(),
      propertyName: form.value.hotelName.trim(),
      email: form.value.email.trim()
    })

    // Update registration with email status
    if (emailResult.success) {
      await updateDoc(doc(db, 'registrations', hotelId), {
        registrationEmailSent: true,
        registrationEmailSentAt: new Date(),
        registrationEmailMessageId: emailResult.messageId
      })
    }

    try {
      await syncToSheets({
        hotelId: hotelId,
        hotelName: registrationData.hotelName,
        ownerName: registrationData.ownerName,
        location: registrationData.location,
        ownerEmail: registrationData.ownerEmail,
        ownerPhone: registrationData.ownerPhone,
        roomCount: registrationData.roomCount,
        status: 'pending',
      });
      console.log('✅ Successfully synced to Sheets');
    } catch (sheetsError) {
      console.warn('⚠️ Sheets sync failed, but Firebase saved:', sheetsError);
    }

    alert('Application submitted successfully! Check your email for confirmation. Waiting for admin approval.')
    router.push('/')
    
  } catch (error) {
    console.error('Registration error:', error)
    if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = 'This email is already registered. Please use a different email or login.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage.value = 'Password is too weak. Please use a stronger password.'
    } else {
      errorMessage.value = 'Error submitting application: ' + error.message
    }
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>