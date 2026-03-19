<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <div class="p-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>

    <!-- Replace this part of your template -->
<div class="flex items-center space-x-3 mt-1">
  <div class="flex items-center">
    <p class="text-gray-600 mr-2">{{ currentHotel?.name || 'Property Registration Portal' }}</p>
    <button 
      v-if="currentStatus === 'active'"
      @click="showEditNameModal = true"
      class="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
      title="Edit property name"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
      </svg>
    </button>
  </div>
  <span :class="statusBadgeClasses" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border">
    <svg :class="statusIconClasses" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <component :is="statusIcon" />
    </svg>
    {{ statusText }}
  </span>
</div>


          </div>
          <div class="flex space-x-3">
            <button v-if="currentHotel?.isActive" @click="downloadQR" 
                    class="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span>Download QR</span>
            </button>
            <button @click="signOut" class="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Application Status Alerts -->
      <div v-if="showStatusAlert && currentStatus !== 'active'" class="mb-8">
        <div :class="statusAlertClasses" class="rounded-2xl p-6 shadow-lg border">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg :class="statusAlertIconClasses" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <component :is="statusAlertIcon" />
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <h3 class="text-lg font-semibold">{{ statusAlertTitle }}</h3>
              <div class="mt-2">
                <p class="text-gray-700">{{ statusAlertMessage }}</p>
                <div v-if="rejectionReason" class="mt-3 p-4 bg-opacity-20 rounded-xl border" :class="rejectionReasonClasses">
                  <p class="font-semibold">Reason for rejection:</p>
                  <p class="mt-1">{{ rejectionReason }}</p>
                </div>
              </div>
              <div v-if="showActionButtons" class="mt-4 flex flex-wrap gap-3">
                <button v-if="currentStatus === 'rejected'" @click="startReapplication" 
                        class="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg">
                  Correct & Re-apply
                </button>
                <button v-if="currentStatus === 'pending'" @click="viewApplicationDetails" 
                        class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg">
                  View Application
                </button>
                <!-- <button v-if="currentStatus === 'none'" @click="startNewApplication"
                        class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg">
                  Start Registration
                </button> -->

                <button v-if="currentStatus === 'suspended'" @click="initiateReactivation" 
                class="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg">
               Reactivate Account
               </button>

                <button @click="contactSupport" class="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2.5 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg">
                  Contact Support
                </button>
              </div>
            </div>
            <button @click="showStatusAlert = false" class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 transition-colors">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Simple Edit Name Modal -->
<div v-if="showEditNameModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
  <div class="bg-white rounded-xl max-w-sm w-full">
    <div class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit Property Name</h3>
      <input
        v-model="editPropertyName"
        type="text"
        class="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter new property name"
      >
      <div class="flex justify-end space-x-3">
        <button 
          @click="showEditNameModal = false"
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button 
          @click="updatePropertyName"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</div>

      <!-- No Application State -->
      <div v-if="!hasApplication && currentStatus === 'none'" class="text-center py-12">
        <div class="max-w-4xl mx-auto">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Welcome to Your Dashboard</h3>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">Register your property to start accepting digital check-ins and manage your guests efficiently.</p>
          <div class="mt-8">
            <button @click="startNewApplication" class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-xl text-lg font-semibold">
              Start Property Registration
            </button>
          </div>
          <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Secure Registration</h4>
              <p class="text-gray-600">Government-compliant digital check-in system</p>
            </div>
            <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">QR Code Access</h4>
              <p class="text-gray-600">Instant check-ins with unique QR codes</p>
            </div>
            <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Real-time Reports</h4>
              <p class="text-gray-600">Comprehensive analytics and guest insights</p>
            </div>
          </div>
        </div>
      </div>

     <!-- Active Hotel Dashboard (Immediately after approval - 30 day free trial) -->
<div v-if="currentStatus === 'active'">
  <div v-if="isFreeTrialActive" class="mb-6">
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
      <div class="flex items-start">
        <div class="flex-shrink-0 p-3 bg-blue-100 rounded-xl">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-semibold text-blue-900">Free Trial Active</h3>
          <p class="text-blue-700 mt-1">
            Your property is now active with full features for 30 days free!
            {{ freeTrialDaysRemaining }} days remaining.
          </p>
          <p class="text-sm text-blue-600 mt-2">
            After the trial, you'll receive an invoice. Payment can be made to:
            <span class="font-semibold">Bank: Equity Bank • Account: 1234567890 • Name: Bookello Ltd</span>
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Invoice Section (When invoice is pending) -->
  <div v-if="pendingInvoice" class="mb-6">
    <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 shadow-lg">
      <div class="flex items-start">
        <div class="flex-shrink-0 p-3 bg-yellow-100 rounded-xl">
          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-semibold text-yellow-900">Invoice Pending</h3>
          <div class="mt-2 space-y-3">
            <div class="bg-white/50 p-4 rounded-xl border border-yellow-100">
              <p class="font-medium text-gray-900">Invoice #{{ pendingInvoice.invoiceNumber }}</p>
              <p class="text-gray-600">Amount: ${{ pendingInvoice.amount }}</p>
              <p class="text-gray-600">Due Date: {{ formatDate(pendingInvoice.dueDate) }}</p>
              <p class="text-gray-600">Status: {{ pendingInvoice.status }}</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h4 class="font-semibold text-blue-900 mb-2">Payment Instructions:</h4>
              <ul class="text-blue-700 space-y-1">
               <li><strong>Beneficiary:</strong> BOOKELLO.LIFE LTD</li>
               <li><strong>Bank:</strong> Equity Bank Rwanda PLC</li>
              <li><strong>Branch:</strong> Giporoso Branch</li>
             <li><strong>Currency:</strong> USD</li>
             <li><strong>Account Number:</strong> 4013201302202</li>
             <li><strong>SWIFT Code:</strong> EQBLRWRW</li>
               <li><strong>Bank Address:</strong> KN4 Ave, Grand Pension Plaza, P.O. Box 494, Kigali, Rwanda</li>
              <li><strong>Intermediary Bank:</strong> Citi Bank</li>
              <li><strong>Intermediary SWIFT:</strong> CITIUS33</li>
              <li><strong>Intermediary Address:</strong> New York, USA</li>
              <li><strong>Amount:</strong> ${{ pendingInvoice.amount }}</li>
              <li><strong>Reference:</strong> Invoice #{{ pendingInvoice.invoiceNumber }}</li>

              </ul>
              <button @click="downloadInvoice(pendingInvoice)" 
                      class="mt-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200">
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
     

      <!-- Active Hotel Dashboard -->
      <div v-if="currentStatus === 'active'">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center">
              <div class="p-3 bg-orange-100 rounded-xl shadow-inner">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Active Since</p>
                <p class="text-lg font-semibold text-gray-900">{{ formatActiveDate }}</p>
              </div>
            </div>
          </div>
        </div>


        <!-- QR Code Section -->
<div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 mb-8">
  <div class="px-6 py-5 border-b border-gray-200/60">
    <h3 class="text-xl font-semibold text-gray-900">Your QR Code</h3>
    <p class="mt-1 text-gray-600" v-if="currentHotel?.isActive && currentHotel?.subscription?.status === 'active'">
      Scan this code for direct guest check-ins
    </p>
    <p class="mt-1 text-red-600 font-medium" v-else>
      QR Code unavailable - Account suspended or inactive
        <span class="text-xs block mt-1">
        (Status: {{ currentStatus }}, Active: {{ currentHotel?.isActive }}, Subscription: {{ currentHotel?.subscription?.status }})
      </span>
    </p>
  </div>
  <div class="p-6">
   <div v-if="currentHotel?.isActive && currentHotel?.subscription?.status === 'active' && qrCodeUrl" 
         class="flex flex-col lg:flex-row items-center justify-between gap-8">
      <div class="text-center lg:text-left">
        <div class="border-4 border-gray-200/60 p-6 rounded-2xl inline-block bg-white shadow-lg">
          <img :src="qrCodeUrl" alt="QR Code" class="w-64 h-64">
        </div>
        <div class="mt-6">
          <button @click="downloadQR" 
                  class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg font-semibold">
            Download QR Code
          </button>
        </div>
      </div>
      <div class="bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 rounded-2xl border border-gray-200/60 max-w-md">
        <h4 class="text-lg font-semibold text-gray-900 mb-4">QR Code Instructions</h4>
        <ul class="space-y-3 text-gray-600">
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Display this QR code at your reception desk
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Guests scan with their phone camera
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Automatic digital registration form opens
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Instant check-in completion notification
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="text-center py-8">
      <div class="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <h4 class="text-lg font-semibold text-gray-900 mb-2">QR Code Unavailable</h4>
      <p class="text-gray-600 max-w-md mx-auto">
        Your QR code is currently unavailable because your account is suspended. 
        Reactivate your account to restore QR code functionality.
      </p>
      <button v-if="currentStatus === 'suspended'" @click="initiateReactivation" 
              class="mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg font-semibold">
        Reactivate Account
      </button>
    </div>
  </div>
</div>

<!-- Receipt Upload Modal -->
<div v-if="showReceiptUploadModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
  <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
    
    <!-- Header -->
    <div class="p-6 border-b border-gray-200/60">
      <h3 class="text-xl font-semibold text-gray-900">Upload Payment Receipt</h3>
      <p class="text-gray-600 mt-1">Upload proof of payment for Invoice #{{ selectedInvoiceForReceipt?.invoiceNumber }}</p>
    </div>
    
    <!-- Content -->
    <div class="p-6">
      <!-- Invoice Summary -->
      <div class="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/60 p-4 mb-6">
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Invoice #:</span>
            <span class="font-semibold">{{ selectedInvoiceForReceipt?.invoiceNumber }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Amount:</span>
            <span class="font-bold text-gray-900">${{ selectedInvoiceForReceipt?.amount }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Due Date:</span>
            <span class="font-medium" :class="getDueDateClass(selectedInvoiceForReceipt)">
              {{ formatDate(selectedInvoiceForReceipt?.dueDate) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Payment Instructions Reminder -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <p class="text-sm text-blue-700 font-medium mb-1">Payment Details:</p>
            <ul class="text-xs text-blue-600 space-y-1">
              <li>• Bank: Equity Bank Rwanda PLC</li>
              <li>• Account: 4013201302202</li>
              <li>• Name: BOOKELLO.LIFE LTD</li>
              <li>• Reference: Invoice #{{ selectedInvoiceForReceipt?.invoiceNumber }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Receipt Upload Section -->
      <div class="space-y-4">
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">Upload Payment Receipt *</label>
          <p class="text-xs text-gray-500">Upload a clear photo or scan of your bank transfer receipt</p>
          
          <div class="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
            <CloudinaryUpload 
              :input-id="'receiptUpload'"
              @file-uploaded="handleReceiptUploaded"
            />
            <p class="text-xs text-gray-500 mt-2">PNG, JPG, or PDF up to 5MB</p>
          </div>
          
          <!-- Uploaded Receipt Preview -->
          <div v-if="receiptImageUrl" class="mt-4">
            <div class="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-sm text-green-700 font-medium">Receipt uploaded successfully</span>
              </div>
              <button @click="previewDocument(receiptImageUrl, 'Payment Receipt')"
                      class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View
              </button>
            </div>
          </div>
        </div>

        <!-- Important Notes -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
              <p class="text-sm text-yellow-700 font-medium">Important Notes</p>
              <ul class="text-xs text-yellow-600 mt-1 space-y-1">
                <li>• Please ensure the reference number is visible</li>
                <li>• Your payment will be verified within 1-2 business days</li>
                <li>• Your account will be activated after verification</li>
                <li>• Keep the original receipt for your records</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-6 border-t border-gray-200/60 bg-gray-50/50 flex space-x-3">
      <button 
        @click="closeReceiptUploadModal" 
        class="flex-1 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
      >
        Cancel
      </button>
      <button 
        @click="submitReceipt"
        :disabled="uploadingReceipt || !receiptImageUrl"
        class="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg"
      >
        {{ uploadingReceipt ? 'Submitting...' : 'Submit Receipt' }}
      </button>
    </div>
  </div>
</div>

<!-- Add this section to the owner dashboard template (after the QR Code section) -->
<div v-if="currentStatus === 'active'" class="mb-8">
  <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
    <div class="px-6 py-5 border-b border-gray-200/60">
      <h3 class="text-xl font-semibold text-gray-900">Your Invoices</h3>
      <p class="mt-1 text-gray-600">View and manage your subscription invoices</p>
    </div>
    
    <div class="p-6">
      <!-- Invoice Status Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-200/50">
          <div class="text-sm font-medium text-blue-600">Total Invoices</div>
          <div class="text-2xl font-bold text-blue-900">{{ hotelInvoices.length }}</div>
        </div>
        <div class="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-xl border border-green-200/50">
          <div class="text-sm font-medium text-green-600">Paid</div>
          <div class="text-2xl font-bold text-green-900">
            {{ hotelInvoices.filter(i => i.status === 'paid').length }}
          </div>
        </div>
        <div class="bg-gradient-to-br from-yellow-50 to-yellow-100/50 p-4 rounded-xl border border-yellow-200/50">
          <div class="text-sm font-medium text-yellow-600">Pending</div>
          <div class="text-2xl font-bold text-yellow-900">
            {{ hotelInvoices.filter(i => i.status === 'pending').length }}
          </div>
        </div>
        <div class="bg-gradient-to-br from-red-50 to-red-100/50 p-4 rounded-xl border border-red-200/50">
          <div class="text-sm font-medium text-red-600">Overdue</div>
          <div class="text-2xl font-bold text-red-900">
            {{ hotelInvoices.filter(i => i.status === 'overdue').length }}
          </div>
        </div>
      </div>

      <!-- Invoices Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200/60" v-if="hotelInvoices.length > 0">
        <table class="min-w-full divide-y divide-gray-200/60">
          <thead class="bg-gray-50/80">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice #</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200/60">
            <tr v-for="invoice in hotelInvoices" :key="invoice.id"
                class="hover:bg-gray-50/80 transition-colors duration-150">
              <td class="px-6 py-4">
                <div class="text-sm font-semibold text-gray-900">{{ invoice.invoiceNumber }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(invoice.createdAt) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ invoice.description }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-lg font-bold text-gray-900">${{ invoice.amount }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm" :class="getDueDateClass(invoice)">
                  {{ formatDate(invoice.dueDate) }}
                </div>
              </td>
              <td class="px-6 py-4">
               <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" 
                 :class="getInvoiceStatusClass(invoice)">
               {{ getInvoiceStatusText(invoice.status) }}
             </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex space-x-2">
                  <button @click="downloadInvoice(invoice)"
                          class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200 border border-blue-200 text-sm">
                    Download
                  </button>
                <button v-if="invoice.status === 'pending' || invoice.status === 'overdue'"
                 @click="showUploadReceiptModal(invoice)"
             class="text-green-600 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-200 border border-green-200 text-sm">
              Upload Receipt
               </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
        <p class="text-gray-500">Your invoices will appear here once generated.</p>
      </div>
    </div>
  </div>
</div>
        
        <!-- Management Dashboards -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 mb-8">
          <div class="px-6 py-5 border-b border-gray-200/60">
            <h3 class="text-xl font-semibold text-gray-900">Management Dashboards</h3>
            <p class="mt-1 text-gray-600">Access your property management tools</p>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Admin Dashboard -->
              <div class="border-2 border-gray-200/60 rounded-2xl p-6 hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
                <div class="flex items-center mb-4">
                  <div class="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-inner">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-900">Admin Dashboard</h4>
                    <p class="text-gray-600">View all check-ins and manage settings</p>
                  </div>
                </div>
                <button 
                  @click="goToAdminDashboard"
                  class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg font-semibold"
                >
                  Open Admin Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Application Modal -->
      <div v-if="showApplicationModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div class="p-6 border-b border-gray-200/60">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ isReapplication ? 'Update Your Application' : 'Property Registration' }}
            </h3>
            <p class="text-gray-600 mt-1">
              {{ isReapplication ? 'Please correct the issues mentioned and resubmit your application.' : 'Fill in your Property details to get started.' }}
            </p>
          </div>
          
          <div class="p-6">
            <!-- Rejection Reason Reminder -->
            <div v-if="isReapplication && rejectionReason" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <h4 class="font-semibold text-red-800">Reason for Previous Rejection:</h4>
              <p class="text-red-700 mt-1">{{ rejectionReason }}</p>
            </div>

            <!-- Application Form -->
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Property Name *</label>
                  <input v-model="applicationData.hotelName" type="text" required 
                         class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input v-model="applicationData.location" type="text" required 
                         class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Rooms *</label>
                <input v-model="applicationData.roomCount" type="number" required 
                       class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
              </div>

              <div class="border-t border-gray-200/60 pt-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Owner Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Owner Name *</label>
                    <input v-model="applicationData.ownerName" type="text" required 
                           class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input v-model="applicationData.ownerEmail" type="email" required 
                           class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                    <input v-model="applicationData.ownerPhone" type="tel" required 
                           class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                  </div>
                </div>
              </div>

              <!-- Document Upload Section -->
              <div class="border-t border-gray-200/60 pt-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Required Documents</h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Business License *</label>
                    <CloudinaryUpload 
                      inputId="business-license"
                      @file-uploaded="(url) => handleDocumentUploaded('rdb', url)"
                    />
                    <p v-if="uploadedDocuments.rdb" class="text-sm text-green-600 mt-2 font-medium">✓ Document uploaded</p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">TIN Certificate *</label>
                    <CloudinaryUpload 
                      inputId="tin-certificate"
                      @file-uploaded="(url) => handleDocumentUploaded('tin', url)"
                    />
                    <p v-if="uploadedDocuments.tin" class="text-sm text-green-600 mt-2 font-medium">✓ Document uploaded</p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Owner ID *</label>
                    <CloudinaryUpload 
                      inputId="owner-id"
                      @file-uploaded="(url) => handleDocumentUploaded('id', url)"
                    />
                    <p v-if="uploadedDocuments.id" class="text-sm text-green-600 mt-2 font-medium">✓ Document uploaded</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200/60 bg-gray-50/50 flex justify-end space-x-3">
            <button @click="closeApplicationModal" class="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium">
              Cancel
            </button>
            <button @click="submitApplication" :disabled="submittingApplication || !allDocumentsUploaded" 
                    class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg">
              {{ submittingApplication ? 'Submitting...' : 'Submit Application' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Application Details Modal -->
      <div v-if="showApplicationDetails" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div class="p-6 border-b border-gray-200/60">
            <h3 class="text-xl font-semibold text-gray-900">Application Details</h3>
            <p class="text-gray-600 mt-1">Submitted on {{ formatDate(currentApplication?.createdAt) }}</p>
          </div>
          
          <div class="p-6">
            <div class="space-y-6">
              <!-- Hotel Information -->
              <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Property Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50/50 p-4 rounded-xl">
                    <label class="block text-sm font-semibold text-gray-700">Property Name</label>
                    <p class="mt-1 text-gray-900">{{ currentApplication?.hotelName }}</p>
                  </div>
                  <div class="bg-gray-50/50 p-4 rounded-xl">
                    <label class="block text-sm font-semibold text-gray-700">Location</label>
                    <p class="mt-1 text-gray-900">{{ currentApplication?.location }}</p>
                  </div>
                  <div class="bg-gray-50/50 p-4 rounded-xl">
                    <label class="block text-sm font-semibold text-gray-700">Number of Rooms</label>
                    <p class="mt-1 text-gray-900">{{ currentApplication?.roomCount }}</p>
                  </div>
                </div>
              </div>

              <!-- Owner Information -->
              <div class="border-t border-gray-200/60 pt-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Owner Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50/50 p-4 rounded-xl">
                    <label class="block text-sm font-semibold text-gray-700">Owner Name</label>
                    <p class="mt-1 text-gray-900">{{ currentApplication?.ownerName }}</p>
                  </div>
                  <div class="bg-gray-50/50 p-4 rounded-xl">
                    <label class="block text-sm font-semibold text-gray-700">Email</label>
                    <p class="mt-1 text-gray-900">{{ currentApplication?.ownerEmail }}</p>
                  </div>
                  <div class="bg-gray-50/50 p-4 rounded-xl">
                    <label class="block text-sm font-semibold text-gray-700">Phone</label>
                    <p class="mt-1 text-gray-900">{{ currentApplication?.ownerPhone }}</p>
                  </div>
                </div>
              </div>

              <!-- Documents -->
              <div class="border-t border-gray-200/60 pt-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Submitted Documents</h4>
                <div class="space-y-3">
                  <button v-if="currentApplication?.documents?.rdb" @click="previewDocument(currentApplication.documents.rdb, 'Business License')"
                          class="w-full text-left p-4 border border-gray-200/60 rounded-xl hover:bg-gray-50/50 transition-all duration-200 flex items-center justify-between group">
                    <span class="text-gray-700 font-medium">Business License</span>
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button v-if="currentApplication?.documents?.tin" @click="previewDocument(currentApplication.documents.tin, 'TIN Certificate')"
                          class="w-full text-left p-4 border border-gray-200/60 rounded-xl hover:bg-gray-50/50 transition-all duration-200 flex items-center justify-between group">
                    <span class="text-gray-700 font-medium">TIN Certificate</span>
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button v-if="currentApplication?.documents?.id" @click="previewDocument(currentApplication.documents.id, 'Owner ID')"
                          class="w-full text-left p-4 border border-gray-200/60 rounded-xl hover:bg-gray-50/50 transition-all duration-200 flex items-center justify-between group">
                    <span class="text-gray-700 font-medium">Owner ID</span>
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200/60 bg-gray-50/50 flex justify-end">
            <button @click="closeApplicationDetails" class="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium">
              Close
            </button>
          </div>
        </div>
      </div>

   <!-- Payment Modal  -->
<div v-if="showPaymentModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
  <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
    
    <!-- Header -->
    <div class="p-6 border-b border-gray-200/60">
      <h3 class="text-xl font-semibold text-gray-900">Complete Payment</h3>
      <p class="text-gray-600 mt-1">You'll be redirected to PesaPal to complete your payment securely</p>
    </div>
    
    <!-- Payment Summary -->
    <div class="p-6">
      <div class="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/60 p-6 mb-6">
        <h4 class="font-semibold text-gray-900 mb-4 text-center">Payment Summary</h4>
        <div class="space-y-3 text-center">
          <div class="flex justify-between">
            <span class="text-gray-600">Plan:</span>
            <span class="font-medium">{{ selectedPlan === 'standard' ? 'STANDARD' : 'PRO' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Billing:</span>
            <span class="font-medium">{{ billingPeriod === 'monthly' ? 'Monthly' : 'Yearly' }}</span>
          </div>
          <div class="flex justify-between text-lg font-bold text-gray-900 border-t pt-3 mt-3">
            <span>Total Amount:</span>
            <span class="text-green-600">${{ calculateAmount() }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Instructions -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <p class="text-sm text-blue-700 font-medium">How it works:</p>
            <ul class="text-sm text-blue-600 mt-1 space-y-1">
              <li>• You'll be redirected to PesaPal's secure payment page</li>
              <li>• Choose your preferred payment method (Card, Mobile Money, etc.)</li>
              <li>• Complete the payment on PesaPal's platform</li>
              <li>• You'll be redirected back automatically after payment</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Security Notice -->
      <div class="bg-green-50 border border-green-200 rounded-xl p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <p class="text-sm text-green-700">Your payment is processed securely by PesaPal. We never store your card details.</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-6 border-t border-gray-200/60 bg-gray-50/50 flex space-x-3">
      <button 
        @click="showPaymentModal = false" 
        class="flex-1 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
      >
        Cancel
      </button>
      <button 
        @click="processPayment" 
        :disabled="processingPayment" 
        class="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg"
      >
        {{ processingPayment ? 'Redirecting...' : `Pay $${calculateAmount()}` }}
      </button>
    </div>
  </div>
</div>

<!-- Fixed Reactivation Modal -->
<div v-if="showReactivationModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
  <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200/60 sticky top-0 bg-white">
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Reactivate Your Account</h3>
      <p class="text-gray-600 text-sm">You'll be redirected to PesaPal to complete your payment</p>
    </div>
    
    <!-- Content -->
    <div class="p-6 space-y-4">
      <!-- Plan Selection -->
      <div class="space-y-3">
        <h4 class="font-semibold text-gray-900">Select New Plan</h4>
        <div class="grid grid-cols-2 gap-3">
          <button 
            @click="selectedPlan = 'standard'" 
            :class="selectedPlan === 'standard' ? 'border-blue-500 bg-blue-50/50 shadow-lg' : 'border-gray-200/60'"
            class="border-2 rounded-xl p-3 text-center transition-all duration-200 hover:border-blue-300"
          >
            <div class="font-semibold text-gray-900 text-sm">STANDARD</div>
            <div class="text-xs text-gray-600 mt-1">Up to 15 rooms</div>
          </button>
          <button 
            @click="selectedPlan = 'pro'" 
            :class="selectedPlan === 'pro' ? 'border-purple-500 bg-purple-50/50 shadow-lg' : 'border-gray-200/60'"
            class="border-2 rounded-xl p-3 text-center transition-all duration-200 hover:border-purple-300"
          >
            <div class="font-semibold text-gray-900 text-sm">PRO</div>
            <div class="text-xs text-gray-600 mt-1">16+ rooms</div>
          </button>
        </div>
      </div>

      <!-- Billing Period -->
      <div class="space-y-3">
        <h4 class="font-semibold text-gray-900">Billing Period</h4>
        <div class="grid grid-cols-2 gap-3">
          <label class="flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200"
                 :class="billingPeriod === 'monthly' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'">
            <input type="radio" v-model="billingPeriod" value="monthly" class="mr-2 text-blue-600 focus:ring-blue-500">
            <div>
              <p class="font-semibold text-gray-900 text-sm">Monthly</p>
              <p class="text-gray-600 text-xs">${{ selectedPlan === 'standard' ? '20' : '30' }}/month</p>
            </div>
          </label>
          <label class="flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200"
                 :class="billingPeriod === 'yearly' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 hover:border-gray-300'">
            <input type="radio" v-model="billingPeriod" value="yearly" class="mr-2 text-green-600 focus:ring-green-500">
            <div>
              <p class="font-semibold text-gray-900 text-sm">Yearly</p>
              <p class="text-green-600 text-xs font-medium">Save {{ selectedPlan === 'standard' ? '$90' : '$160' }}</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Reactivation Summary -->
      <div class="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/60 p-4">
        <h4 class="font-semibold text-gray-900 mb-3 text-center">Reactivation Summary</h4>
        <div class="space-y-2 text-sm text-center">
          <div class="flex justify-between">
            <span class="text-gray-600">Plan:</span>
            <span class="font-medium">{{ selectedPlan ? (selectedPlan === 'standard' ? 'STANDARD' : 'PRO') : 'Not selected' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Billing:</span>
            <span class="font-medium">{{ billingPeriod === 'monthly' ? 'Monthly' : 'Yearly' }}</span>
          </div>
          <div class="flex justify-between text-base font-bold text-gray-900 border-t pt-2 mt-2">
            <span>Total Amount:</span>
            <span class="text-green-600">${{ calculateReactivationAmount() }}</span>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <div class="flex items-start">
          <svg class="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div class="flex-1">
            <p class="text-xs text-blue-700 font-medium mb-1">Reactivation process:</p>
            <ul class="text-xs text-blue-600 space-y-0.5">
              <li>• Redirect to PesaPal's secure payment page</li>
              <li>• Choose your preferred payment method</li>
              <li>• Complete the reactivation payment</li>
              <li>• Your account will be activated immediately</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Terms Agreement -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
        <label class="flex items-start">
          <input type="checkbox" v-model="agreeToTerms" class="mr-2 mt-0.5 text-blue-600 focus:ring-blue-500">
          <span class="text-xs text-gray-700">
            I agree to reactivate my account with the selected {{ selectedPlan ? selectedPlan.toUpperCase() : '' }} Plan 
            ({{ billingPeriod }} billing) for ${{ calculateReactivationAmount() }}.
          </span>
        </label>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200/60 bg-gray-50/50 sticky bottom-0">
      <div class="flex space-x-3">
        <button 
          @click="showReactivationModal = false" 
          class="flex-1 px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
        >
          Cancel
        </button>
        <button 
          @click="processReactivationPayment" 
          :disabled="processingPayment || !agreeToTerms || !selectedPlan"
          class="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg"
        >
          {{ processingPayment ? 'Redirecting...' : `Reactivate & Pay $${calculateReactivationAmount()}` }}
        </button>
      </div>
    </div>
  </div>
</div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { onSnapshot } from 'firebase/firestore'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  addDoc 
} from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { useRouter } from 'vue-router'
import CloudinaryUpload from '@/components/FileUpload.vue'
import { syncToSheets } from '@/utils/sheetsSync';
import { pesapalService } from '@/utils/pesapal';



const router = useRouter()

// All the existing reactive state and methods remain exactly the same...
// [Keep all the existing JavaScript code exactly as it was]

// Reactive state
const currentHotel = ref({})
const currentApplication = ref(null)
const currentStatus = ref('none')
const rejectionReason = ref('')
const hasApplication = ref(false)
const showStatusAlert = ref(true)
const showApplicationModal = ref(false)
const showApplicationDetails = ref(false)
const isReapplication = ref(false)
const submittingApplication = ref(false)
const registrationUnsubscribe = ref(null)
const showReactivationModal = ref(false)
const agreeToTerms = ref(false)
const processing = ref(false)
const hotelInvoices = ref([])
const showReceiptUploadModal = ref(false)
const selectedInvoiceForReceipt = ref(null)
const receiptImageUrl = ref('')
const uploadingReceipt = ref(false)
const showEditNameModal = ref(false)
const editPropertyName = ref('')



// Document upload state
const uploadedDocuments = ref({
  rdb: null,
  tin: null,
  id: null
})

// Plan selection state
const selectedPlan = ref('')
const billingPeriod = ref('yearly')
const showPaymentModal = ref(false)
// const paymentMethod = ref('card')
const processingPayment = ref(false)

// Dashboard data
const qrCodeUrl = ref('')
const recentCheckins = ref([])
const stats = ref({
  todayCheckins: 0,
  totalCheckins: 0,
  monthCheckins: 0
})

// Application data
const applicationData = ref({
  hotelName: '',
  location: '',
  roomCount: '',
  ownerName: '',
  ownerEmail: '',
  ownerPhone: '',
  documents: {
    rdb: null,
    tin: null,
    id: null
  }
})

// SVG path components for status icons
const StatusIcons = {
  none: { template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
  pending: { template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
  rejected: { template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>' },
  approved_unpaid: { template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
  active: { template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
  suspended: { template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>' }
}

const AlertIcons = {
  none: { template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
  pending: { template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
  rejected: { template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>' },
  approved_unpaid: { template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
  active: { template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
  suspended: { template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>' }
}


const isFreeTrialActive = computed(() => {
  if (!currentHotel.value?.subscription) return false
  const subscription = currentHotel.value.subscription
  return subscription.status === 'active' && 
         subscription.trialEndDate && 
         new Date(subscription.trialEndDate) > new Date()
})

const freeTrialDaysRemaining = computed(() => {
  if (!isFreeTrialActive.value) return 0
  const trialEnd = new Date(currentHotel.value.subscription.trialEndDate)
  const now = new Date()
  const diffTime = trialEnd - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const pendingInvoice = computed(() => {
  return hotelInvoices.value.find(inv => 
    inv.status === 'pending' || inv.status === 'overdue'
  )
})


const updatePropertyName = async () => {
  if (!editPropertyName.value.trim()) {
    alert('Please enter a property name')
    return
  }
  
  try {
    await updateDoc(doc(db, 'Hotels', currentHotel.value.id), {
      name: editPropertyName.value.trim()
    })
    
    currentHotel.value.name = editPropertyName.value.trim()
    showEditNameModal.value = false
    editPropertyName.value = ''
    
    alert('Property name updated!')
  } catch (error) {
    console.error('Error updating name:', error)
    alert('Failed to update: ' + error.message)
  }
}

// Computed properties
const statusBadgeClasses = computed(() => {
  const classes = {
    'none': 'bg-blue-100 text-blue-800 border-blue-200',
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'rejected': 'bg-red-100 text-red-800 border-red-200',
    'approved_unpaid': 'bg-green-100 text-green-800 border-green-200',
    'active': 'bg-green-100 text-green-800 border-green-200',
    'suspended': 'bg-red-100 text-red-800 border-red-200'
  }
  return classes[currentStatus.value]
})


const statusIconClasses = computed(() => {
  const classes = {
    'none': 'text-blue-500',
    'pending': 'text-yellow-500',
    'rejected': 'text-red-500',
    'approved_unpaid': 'text-green-500',
    'active': 'text-green-500',
    'suspended': 'text-red-500'
  }
  return classes[currentStatus.value]
})

const statusIcon = computed(() => StatusIcons[currentStatus.value])

const statusText = computed(() => {
  const texts = {
    'none': 'Not Registered',
    'pending': 'Under Review',
    'rejected': 'Rejected',
    'approved_unpaid': 'Approved - Select Plan',
    'active': 'Active',
    'suspended': 'Suspended'
  }
  return texts[currentStatus.value]
})

const statusAlertClasses = computed(() => {
  const classes = {
    'none': 'bg-blue-50 border border-blue-200',
    'pending': 'bg-yellow-50 border border-yellow-200',
    'rejected': 'bg-red-50 border border-red-200',
    'approved_unpaid': 'bg-green-50 border border-green-200',
    'active': 'bg-green-50 border border-green-200',
    'suspended': 'bg-red-50 border border-red-200'
  }
  return classes[currentStatus.value]
})


const statusAlertIconClasses = computed(() => {
  const classes = {
    'none': 'text-blue-400',
    'pending': 'text-yellow-400',
    'rejected': 'text-red-400',
    'approved_unpaid': 'text-green-400',
    'active': 'text-green-400',
    'suspended': 'text-red-400'
  }
  return classes[currentStatus.value]
})

const statusAlertIcon = computed(() => AlertIcons[currentStatus.value])

const statusAlertTitle = computed(() => {
  const titles = {
    'none': 'Welcome!',
    'pending': 'Application Under Review',
    'rejected': 'Application Rejected',
    'approved_unpaid': 'Application Approved!',
    'active': 'Property Active',
    'suspended': 'Property Suspended'
  }
  return titles[currentStatus.value]
})

const statusAlertMessage = computed(() => {
  const messages = {
    'none': 'Register your property to start using our digital check-in system.',
    'pending': 'Your application is being reviewed. We will notify you once a decision is made.',
    'rejected': 'Your application requires corrections before approval.',
    'approved_unpaid': 'Your application has been approved! Select a plan to activate your property.',
    'active': 'Your property is now active and ready to accept check-ins.',
    'suspended': `Your property access has been suspended. ${getSuspensionReason()}`
  }
  return messages[currentStatus.value]
})


// Add this helper function

const getSuspensionReason = () => {
  if (currentHotel.value?.subscription?.status === 'expired') {
    const expiryDate = currentHotel.value.subscription.expiryDate?.toDate?.() || new Date(currentHotel.value.subscription.expiryDate)
    return `Your subscription expired on ${formatDate(expiryDate)}. Please renew your subscription to reactivate your account.`
  }
  return 'You can reactivate your account and choose a new plan to restore all features.' + previousPlanInfo.value
}


const showActionButtons = computed(() => {
  return ['none', 'pending', 'rejected', 'suspended'].includes(currentStatus.value)
})

const rejectionReasonClasses = computed(() => {
  return currentStatus.value === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : ''
})

const formatActiveDate = computed(() => {
  if (!currentHotel.value.subscription?.startDate) return 'N/A'
  const date = currentHotel.value.subscription.startDate?.toDate?.() || new Date(currentHotel.value.subscription.startDate)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
})

const allDocumentsUploaded = computed(() => {
  return uploadedDocuments.value.rdb && uploadedDocuments.value.tin && uploadedDocuments.value.id
})

const previousPlanInfo = computed(() => {
  if (currentHotel.value?.subscription?.previousPlan) {
    return ` (Previously: ${currentHotel.value.subscription.previousPlan.toUpperCase()})`
  }
  return ''
})

 //methods




const initiateReactivation = async () => {
  try {
    const property = currentHotel.value
    if (!property) return
    
    // Reset and initialize plan selection
    selectedPlan.value = property.subscription?.previousPlan || 'standard' // Default to standard
    billingPeriod.value = 'yearly' // Default to yearly for better savings
    agreeToTerms.value = false
    processingPayment.value = false
    
    showReactivationModal.value = true
  } catch (error) {
    console.error('Error initiating reactivation:', error)
    alert('Unable to start reactivation process. Please contact support.')
  }
}


const calculateReactivationAmount = () => {
  if (!selectedPlan.value) return '0'
  if (selectedPlan.value === 'standard') {
    return billingPeriod.value === 'monthly' ? '20' : '150'
  } else {
    return billingPeriod.value === 'monthly' ? '30' : '200'
  }
}


const processReactivationPayment = async () => {
  processingPayment.value = true;

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Please login again');

    // Validation
    if (!selectedPlan.value || !billingPeriod.value) {
      alert('Please select a plan and billing period');
      processingPayment.value = false;
      return;
    }

    if (!agreeToTerms.value) {
      alert('Please agree to the terms and conditions');
      processingPayment.value = false;
      return;
    }

    // Use $1 for testing (consistent with payment modal)
    const testAmount = "1";
    const actualAmount = calculateReactivationAmount();
    
    const planName = selectedPlan.value === 'standard' ? 'STANDARD' : 'PRO';
    const orderId = pesapalService.generateOrderId('REACT');

    const orderDetails = {
      orderId: orderId,
      amount: actualAmount,
      description: `Reactivate - ${planName} Plan - ${billingPeriod.value} billing (TEST)`,
      email: user.email,
      phone: currentHotel.value.ownerPhone || '+250784343434',
      firstName: currentHotel.value.ownerName?.split(' ')[0] || 'Customer',
      lastName: currentHotel.value.ownerName?.split(' ')[1] || 'User',
      callback_url: `${window.location.origin}/payment-callback`
    };

    console.log('💰 Processing reactivation payment:', orderDetails);

    const response = await pesapalService.submitOrder(orderDetails);

    console.log('✅ Reactivation payment response:', response);

    // Extract redirect URL
    const redirectUrl = response.redirect_url || response.redirectUrl;
    
    if (!redirectUrl) {
      throw new Error('No payment page available from PesaPal');
    }

    // Save payment record
    const paymentData = {
      orderId: orderId,
      pesapalTrackingId: response.order_tracking_id || 'PENDING',
      plan: selectedPlan.value,
      billingPeriod: billingPeriod.value,
      amount: parseFloat(actualAmount),
      testAmount: parseFloat(testAmount),
      currency: 'USD',
      status: 'pending',
      userId: user.uid,
      userEmail: user.email,
      isReactivation: true,
      previousHotelId: currentHotel.value.id,
      createdAt: new Date(),
      pesapalRedirectUrl: redirectUrl,
      isTestPayment: true
    };

    await addDoc(collection(db, 'payments'), paymentData);
    console.log('💾 Reactivation payment record saved');

    // Close modal and redirect
    showReactivationModal.value = false;
    
    alert('🔧 TEST MODE: Using $1 payment for reactivation. You will be redirected to PesaPal.');
    
    window.location.href = redirectUrl;

  } catch (error) {
    console.error('❌ Reactivation payment failed:', error);
    
    let userMessage = error.message;
    
    if (error.message.includes('TransactionLimitExceeded')) {
      userMessage = 'Payment amount exceeds limits. Try smaller amount.';
    } else if (error.message.includes('IPN')) {
      userMessage = 'Payment system updating. Try again shortly.';
    } else if (error.message.includes('consumer') || error.message.includes('credential')) {
      userMessage = 'Payment service maintenance. Try again later.';
    }
    
    alert(`Reactivation payment failed: ${userMessage}`);
    processingPayment.value = false;
  }
};


const goToAdminDashboard = () => {
  if (currentHotel.value?.id) {
    window.open(`/super-admin-dashboard?hotelId=${currentHotel.value.id}`, '_blank')
  } else {
    alert('Hotel information not available')
  }
}


const setupRealTimeListener = () => {
  const user = auth.currentUser
  if (!user) {
    console.log('❌ No user for real-time listener')
    return
  }

  console.log('🔔 Setting up real-time listener for:', user.email)

  try {
    const registrationsQuery = query(
      collection(db, 'registrations'), 
      where('ownerEmail', '==', user.email)
    )
    
    registrationUnsubscribe.value = onSnapshot(registrationsQuery, 
      async (snapshot) => {
        console.log('📡 Real-time update:', snapshot.docs.length, 'applications')
        
        if (!snapshot.empty) {
          const allRegistrations = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
          }))
          
          // Sort by creation date (newest first)
          allRegistrations.sort((a, b) => b.createdAt - a.createdAt)
          
          const latestRegistration = allRegistrations[0]
          console.log('📋 Latest application:', {
            status: latestRegistration.status,
            hotelName: latestRegistration.hotelName,
            id: latestRegistration.id
          })
          
          currentApplication.value = latestRegistration
          hasApplication.value = true
          
          // Update status
          await updateApplicationStatus(latestRegistration)
        } else {
          console.log('📭 No applications found')
          hasApplication.value = false
          currentStatus.value = 'none'
          currentApplication.value = null
          rejectionReason.value = ''
        }
      }, 
      (error) => {
        console.error('❌ Real-time listener error:', error)
      }
    )
  } catch (error) {
    console.error('❌ Failed to setup real-time listener:', error)
  }
}


// Replace your updateApplicationStatus function:
const updateApplicationStatus = async (application) => {
  const previousStatus = currentStatus.value
  const newStatus = application.status
  
  console.log('🔄 Status update:', { previousStatus, newStatus, application })
  
  // Handle suspended/expired status FIRST
  if (currentHotel.value?.subscription?.status === 'suspended') {
    currentStatus.value = 'suspended'
    rejectionReason.value = 'Your property has been suspended. Reactivate to restore features.'
    qrCodeUrl.value = ''
    return
  }
  
  if (currentHotel.value?.subscription?.status === 'expired') {
    currentStatus.value = 'suspended'
    rejectionReason.value = 'Your subscription has expired. Please renew to reactivate.'
    qrCodeUrl.value = ''
    return
  }
  
  // Handle application status changes
  if (newStatus === 'rejected') {
    currentStatus.value = 'rejected'
    rejectionReason.value = application.rejectionReason || 'No specific reason provided'
  } else if (newStatus === 'approved') {
    // When approved, check if we need to create hotel or just update status
    await handleApprovedApplication(application)
  } else if (newStatus === 'pending') {
    currentStatus.value = 'pending'
    rejectionReason.value = ''
  } else {
    currentStatus.value = newStatus
  }
  
  // Show alert and handle QR code for active status
  if (previousStatus !== currentStatus.value) {
    showStatusAlert.value = true
    
    if (currentStatus.value === 'active' && currentHotel.value?.id) {
      await generateQRCode(currentHotel.value.id)
    }
  }
}


const handleApprovedApplication = async (application) => {
  const user = auth.currentUser
  if (!user) return

  try {
    const trialStartDate = new Date()
    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + 30) // 30-day free trial
    
    // Determine plan based on room count
    const roomCount = parseInt(application.roomCount) || 1
    const plan = roomCount > 15 ? 'pro' : 'standard'
    const amount = plan === 'pro' ? 30 : 20
    
    // Create hotel with active status and free trial
    const hotelData = {
      name: application.hotelName,
      location: application.location,
      ownerId: user.uid,
      ownerEmail: user.email,
      ownerName: application.ownerName,
      ownerPhone: application.ownerPhone,
      roomCount: roomCount,
      isActive: true, // Immediately active for free trial
      status: 'active',
      createdAt: new Date(),
      subscription: {
        status: 'active',
        trialStartDate: trialStartDate,
        trialEndDate: trialEndDate,
        plan: plan,
        amount: amount,
        billingPeriod: 'monthly'
      }
    }
    
    const hotelRef = await addDoc(collection(db, 'Hotels'), hotelData)
    console.log('✅ Hotel created with ID:', hotelRef.id)
    
    // Generate invoice for 30 days later
    const invoiceDueDate = new Date(trialEndDate)
    invoiceDueDate.setDate(invoiceDueDate.getDate() + 7) // Give 7 days to pay after trial
    
    const invoiceData = {
      hotelId: hotelRef.id,
      hotelName: application.hotelName,
      ownerEmail: user.email,
      ownerName: application.ownerName,
      invoiceNumber: `INV-${Date.now()}`,
      amount: amount,
      dueDate: invoiceDueDate,
      status: 'pending',
      createdAt: new Date(),
      period: 'monthly',
      description: `Monthly subscription fee - ${plan.toUpperCase()} Plan`,
      plan: plan
    }
    
    const invoiceRef = await addDoc(collection(db, 'invoices'), invoiceData)
    console.log('✅ Invoice created with ID:', invoiceRef.id)
    
    // Update status and reload data
    currentStatus.value = 'active'
    currentHotel.value = { id: hotelRef.id, ...hotelData }
    
    // Load the new invoice
    await loadHotelInvoices()
    
    alert('🎉 Application approved! Your property is now active with a 30-day free trial.')
    
  } catch (error) {
    console.error('Error handling approved application:', error)
    alert('Error: ' + error.message)
  }
}

const downloadInvoice = async (invoice) => {
  try {
    // Generate invoice PDF
    const invoiceContent = `
      BOOKELLO INVOICE
      Invoice #: ${invoice.invoiceNumber}
      Date: ${formatDate(new Date())}
      Due Date: ${formatDate(invoice.dueDate)}
      
      Property: ${currentHotel.value?.name}
      Owner: ${currentHotel.value?.ownerName}
      
      Description: ${invoice.description}
      Amount: $${invoice.amount}
      
      PAYMENT DETAILS:
      Beneficiary:BOOKELLO.LIFE LTD
      Bank: Equity Bank Rwanda PLC
      Branch: Giporoso Branch
      Currency: USD
      Account Number: 4013201302202
      SWIFT Code: EQBLRWRW
      Bank Address:
      KN4 Ave, Grand Pension Plaza, P.O. Box 494, Kigali, Rwanda

      Intermediary Bank (for international USD transfers):

      Bank: Citi Bank
      SWIFT: CITIUS33
       Address: New York, USA
      Reference: Invoice #${invoice.invoiceNumber}
      
      Please make payment before the due date to avoid service interruption.
    `
    
    // Create and download text file (in production, generate PDF)
    const blob = new Blob([invoiceContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${invoice.invoiceNumber}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
  } catch (error) {
    console.error('Error downloading invoice:', error)
  }
}


const checkHotelStatus = async () => {
  const user = auth.currentUser
  if (!user) return

  try {
    const hotelsSnap = await getDocs(query(collection(db, 'Hotels'), where('ownerId', '==', user.uid)))
    if (!hotelsSnap.empty) {
      const hotelData = { id: hotelsSnap.docs[0].id, ...hotelsSnap.docs[0].data() }
      currentHotel.value = hotelData
      
      console.log('Hotel found:', {
        name: hotelData.name,
        isActive: hotelData.isActive,
        subscription: hotelData.subscription,
        id: hotelData.id
      })
      
      // ✅ Check if suspended first
      if (hotelData.subscription?.status === 'suspended') {
        currentStatus.value = 'suspended'
        console.log('Hotel status: suspended')
        return
      }
      
      // ✅ Check if active
      if (hotelData.isActive && hotelData.subscription?.status === 'active') {
        currentStatus.value = 'active'
        console.log('Hotel status: active - loading checkins and generating QR')
        await loadCheckins(hotelData.id)
        await generateQRCode(hotelData.id)
        
        // Load invoices for active hotel
        await loadHotelInvoices()
      } 
      // ✅ Handle approved but unpaid case
      else if (currentApplication.value?.status === 'approved' && !hotelData.isActive) {
        currentStatus.value = 'approved_unpaid'
        console.log('Hotel status: approved_unpaid')
      }
      // ✅ Handle case where hotel exists but application might not be approved yet
      else if (hotelData.isActive === false) {
        // If we have an approved application but hotel is not active, show plan selection
        if (currentApplication.value?.status === 'approved') {
          currentStatus.value = 'approved_unpaid'
          console.log('Hotel status: approved_unpaid (active application, inactive hotel)')
        }
      }
    } else {
      // Application approved but no hotel record yet
      console.log('No hotel record found')
      if (currentApplication.value?.status === 'approved') {
        currentStatus.value = 'approved_unpaid'
        console.log('Hotel status: approved_unpaid (no hotel record)')
      }
    }
  } catch (error) {
    console.error('Error checking hotel status:', error)
    if (currentApplication.value?.status === 'approved') {
      currentStatus.value = 'approved_unpaid'
    }
  }
}

const loadOwnerData = async () => {
  const user = auth.currentUser
  if (!user) {
    router.push('/')
    return
  }

  try {
    const registrationsSnap = await getDocs(
      query(collection(db, 'registrations'), where('ownerEmail', '==', user.email))
    )

    if (!registrationsSnap.empty) {
      const allRegistrations = registrationsSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
      }))
      
      allRegistrations.sort((a, b) => b.createdAt - a.createdAt)
      
      const latestRegistration = allRegistrations[0]
      console.log('📄 Latest application found:', latestRegistration.status)
      
      currentApplication.value = latestRegistration
      hasApplication.value = true
      
      await updateApplicationStatus(latestRegistration)
    } else {
      console.log('📭 No applications found')
      hasApplication.value = false
      currentStatus.value = 'none'
    }

    await checkHotelStatus()
    
    await loadHotelInvoices()
    
  } catch (error) {
    console.error('❌ Error loading owner data:', error)
    currentStatus.value = 'none'
    hasApplication.value = false
  }
}

const loadHotelInvoices = async () => {
  const user = auth.currentUser
  if (!user) return
  
  try {
    if (currentHotel.value?.id) {
      // Query invoices for this hotel
      const invoicesQuery = query(
        collection(db, 'invoices'),
        where('hotelId', '==', currentHotel.value.id)
      )
      
      const invoicesSnap = await getDocs(invoicesQuery)
      
      hotelInvoices.value = invoicesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate?.toDate?.() || new Date(doc.data().dueDate),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
      }))
      
      console.log('📋 Loaded invoices:', hotelInvoices.value.length)
    }
  } catch (error) {
    console.error('Error loading invoices:', error)
  }
}

const startNewApplication = () => {
  isReapplication.value = false
  applicationData.value = {
    hotelName: '',
    location: '',
    roomCount: '',
    ownerName: auth.currentUser?.displayName || '',
    ownerEmail: auth.currentUser?.email || '',
    ownerPhone: '',
    documents: {
      rdb: null,
      tin: null,
      id: null
    }
  }
  uploadedDocuments.value = { rdb: null, tin: null, id: null }
  showApplicationModal.value = true
}

const startReapplication = () => {
  isReapplication.value = true
  if (currentApplication.value) {
    applicationData.value = {
      hotelName: currentApplication.value.hotelName,
      location: currentApplication.value.location,
      roomCount: currentApplication.value.roomCount,
      ownerName: currentApplication.value.ownerName,
      ownerEmail: currentApplication.value.ownerEmail,
      ownerPhone: currentApplication.value.ownerPhone,
      documents: currentApplication.value.documents || {}
    }
    // Mark existing documents as uploaded
    if (currentApplication.value.documents) {
      Object.keys(currentApplication.value.documents).forEach(key => {
        if (currentApplication.value.documents[key]) {
          uploadedDocuments.value[key] = currentApplication.value.documents[key]
        }
      })
    }
  }
  showApplicationModal.value = true
}

const handleDocumentUploaded = (type, url) => {
  uploadedDocuments.value[type] = url
  applicationData.value.documents[type] = url
}

const submitApplication = async () => {
  const user = auth.currentUser
  if (!user) return

  // Basic validation
  if (!applicationData.value.hotelName || !applicationData.value.location || !applicationData.value.roomCount) {
    alert('Please fill in all required fields')
    return
  }

  // Check if all required documents are uploaded
  if (!allDocumentsUploaded.value) {
    alert('Please upload all required documents')
    return
  }

  submittingApplication.value = true

  try {
    const application = {
      hotelName: applicationData.value.hotelName,
      location: applicationData.value.location,
      roomCount: parseInt(applicationData.value.roomCount),
      ownerName: applicationData.value.ownerName,
      ownerEmail: applicationData.value.ownerEmail,
      ownerPhone: applicationData.value.ownerPhone,
      documents: applicationData.value.documents,
      status: 'pending', // CRITICAL: Always set to 'pending' for new applications
      createdAt: new Date(),
      ownerId: user.uid,
      isReapplication: isReapplication.value,
      previousRejectionReason: isReapplication.value ? rejectionReason.value : null
    }

    console.log('Submitting application with status:', application.status)

    await addDoc(collection(db, 'registrations'), application)
      const docRef = await addDoc(collection(db, 'registrations'), application);


     await syncToSheets({
    hotelId: docRef.id,
    hotelName: application.hotelName,
    ownerName: application.ownerName,
    location: application.location,
    ownerEmail: application.ownerEmail,
    ownerPhone: application.ownerPhone,
    status: 'pending',
    subscriptionStart: new Date().toISOString().split('T')[0]
  });
    
    showApplicationModal.value = false
    showStatusAlert.value = true
    
    alert('Application submitted successfully! We will review your application and notify you soon')
    
    // The real-time listener will automatically update the status to 'pending'
    
  } catch (error) {
    console.error('Error submitting application:', error)
    alert('Error submitting application: ' + error.message)
  } finally {
    submittingApplication.value = false
  }
}

const viewApplicationDetails = () => {
  showApplicationDetails.value = true
}

const closeApplicationModal = () => {
  showApplicationModal.value = false
}

const closeApplicationDetails = () => {
  showApplicationDetails.value = false
}

const previewDocument = (url) => {
  window.open(url, '_blank')
}



const calculateAmount = () => {
  if (selectedPlan.value === 'standard') {
    return billingPeriod.value === 'monthly' ? '20' : '150'
  } else {
    return billingPeriod.value === 'monthly' ? '30' : '200'
  }
}


const processPayment = async () => {
  processing.value = true;

  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Please log in to continue');
    }

    if (!selectedPlan.value || !billingPeriod.value) {
      alert('Please select a plan and billing period');
      processing.value = false;
      return;
    }

    // Use $1 for testing
    const testAmount = "1";
    const actualAmount = calculateAmount();
    
    const planName = selectedPlan.value === 'standard' ? 'STANDARD' : 'PRO';
    const orderId = pesapalService.generateOrderId();

    const orderDetails = {
      orderId: orderId,
      amount: testAmount,
      description: `${planName} Plan - ${billingPeriod.value} (TEST)`,
      email: user.email,
      phone: '+254712345678',
      firstName: user.displayName?.split(' ')[0] || 'Customer',
      lastName: user.displayName?.split(' ')[1] || 'User',
      callback_url: `${window.location.origin}/payment-callback`
    };

    console.log('💰 TESTING with $1 to avoid limits and IPN issues');

    const response = await pesapalService.submitOrder(orderDetails);

    console.log('✅ Payment response:', response);

    // Handle specific errors
    if (response.error?.code === 'amount_exceeds_default_limit') {
      alert('Payment amount exceeds account limits. Please contact PesaPal support.');
      processing.value = false;
      return;
    }

    if (response.error?.code === 'InvalidIpnId') {
      alert('IPN configuration issue detected. The system is being updated to fix this.');
      processing.value = false;
      return;
    }

    if (response.error?.code === 'IPNConfigurationError') {
      alert('Payment configuration issue. Please try again in a few minutes.');
      processing.value = false;
      return;
    }

    // Extract redirect URL
    const redirectUrl = response.redirect_url || response.redirectUrl;
    
    if (!redirectUrl) {
      throw new Error('No payment page available');
    }

    // Save payment record
    const paymentData = {
      orderId: orderId,
      pesapalTrackingId: response.order_tracking_id || 'PENDING',
      plan: selectedPlan.value,
      billingPeriod: billingPeriod.value,
      amount: parseFloat(actualAmount),
      testAmount: parseFloat(testAmount),
      currency: 'USD',
      status: 'pending',
      userId: user.uid,
      userEmail: user.email,
      createdAt: new Date(),
      pesapalRedirectUrl: redirectUrl,
      isTestPayment: true
    };

    await addDoc(collection(db, 'payments'), paymentData);

    // Close modal and redirect
    showPaymentModal.value = false;
    
    alert('🔧 TEST MODE: Using $1 payment. Contact PesaPal to increase limits.');
    
    window.location.href = redirectUrl;

  } catch (error) {
    console.error('❌ Payment failed:', error);
    
    let userMessage = error.message;
    
    if (error.message.includes('TransactionLimitExceeded')) {
      userMessage = 'Payment amount exceeds limits. Try smaller amount.';
    } else if (error.message.includes('IPN')) {
      userMessage = 'Payment system updating. Try again shortly.';
    } else if (error.message.includes('consumer') || error.message.includes('credential')) {
      userMessage = 'Payment service maintenance. Try again later.';
    }
    
    alert(`Payment failed: ${userMessage}`);
    processing.value = false;
  }
};
    

const loadCheckins = async (hotelId) => {
  try {
    const checkinsSnap = await getDocs(query(collection(db, 'checkins'), where('hotelId', '==', hotelId)))
    const allCheckins = checkinsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    recentCheckins.value = allCheckins
      .sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate))
      .slice(0, 10)
    
    stats.value.totalCheckins = allCheckins.length
    stats.value.todayCheckins = allCheckins.filter(c => new Date(c.checkInDate) >= startOfToday).length
    stats.value.monthCheckins = allCheckins.filter(c => new Date(c.checkInDate) >= startOfMonth).length

  } catch (error) {
    console.error('Error loading checkins:', error)
  }
}


const getDueDateClass = (invoice) => {
  if (invoice.status === 'paid') return 'text-green-600'
  if (invoice.status === 'cancelled') return 'text-gray-500'
  
  const dueDate = invoice.dueDate?.toDate?.() || new Date(invoice.dueDate)
  const today = new Date()
  
  if (dueDate < today) return 'text-red-600 font-semibold'
  if ((dueDate - today) / (1000 * 60 * 60 * 24) <= 3) return 'text-yellow-600'
  return 'text-gray-600'
}

const getInvoiceStatusClass = (invoice) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    pending_verification: 'bg-blue-100 text-blue-800', 
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classes[invoice.status] || 'bg-gray-100 text-gray-800'
}

const getInvoiceStatusText = (status) => {
  const statusTexts = {
    pending: 'Pending',
    pending_verification: 'Verifying Payment',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled'
  }
  return statusTexts[status] || status
}
const generateQRCode = async (hotelId) => {
  try {
    

    const isActive = currentHotel.value?.isActive && 
                    currentHotel.value?.subscription?.status === 'active'
    
    
    if (!isActive) {
      qrCodeUrl.value = ''
      return
    }

    // Use existing QR code if available and valid
    if (currentHotel.value.qrCode && isActive) {
      console.log('✅ Using existing QR code')
      qrCodeUrl.value = currentHotel.value.qrCode
      return
    }

    // Generate new QR code
    const checkinUrl = `https://checkin-sytem.web.app/checkin/${hotelId}`
    qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${checkinUrl}`
    
    console.log('🆕 Generated new QR code:', qrCodeUrl.value)
    
    // Save to database
    await updateDoc(doc(db, 'Hotels', hotelId), {
      qrCode: qrCodeUrl.value,
      checkinUrl: checkinUrl,
      qrCodeUpdatedAt: new Date()
    })
    
    console.log('💾 QR code saved to database')
    
  } catch (error) {
    console.error('❌ QR code generation failed:', error)
    // Fallback QR code
    qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=error`
  }
}


const downloadQR = async () => {
  if (qrCodeUrl.value && currentHotel.value.isActive) {
    try {
      // Fetch the image as a blob to bypass CORS restrictions
      const response = await fetch(qrCodeUrl.value)
      const blob = await response.blob()
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob)
      
      // Create and trigger download
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `qr-code-${currentHotel.value.name.replace(/\s+/g, '-')}.png`
      document.body.appendChild(link)
      link.click()
      
      // Clean up
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading QR code:', error)
      alert('Unable to download QR code. Please try right-clicking the image and saving it manually.')
    }
  }
}

const contactSupport = () => {
  window.open('mailto:support@yourcompany.com?subject=Hotel Registration Support', '_blank')
}

const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    router.push('/')
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = dateString?.toDate?.() || new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}


const showUploadReceiptModal = (invoice) => {
  selectedInvoiceForReceipt.value = invoice
  receiptImageUrl.value = ''
  showReceiptUploadModal.value = true
}

const closeReceiptUploadModal = () => {
  showReceiptUploadModal.value = false
  selectedInvoiceForReceipt.value = null
  receiptImageUrl.value = ''
  uploadingReceipt.value = false
}

const handleReceiptUploaded = (url) => {
  receiptImageUrl.value = url
  console.log('Receipt uploaded:', url)
}

const submitReceipt = async () => {
  if (!receiptImageUrl.value || !selectedInvoiceForReceipt.value) {
    alert('Please upload a receipt first')
    return
  }

  uploadingReceipt.value = true

  try {
    const user = auth.currentUser
    if (!user) throw new Error('Please login again')

    // Update invoice with receipt information
    const invoiceRef = doc(db, 'invoices', selectedInvoiceForReceipt.value.id)
    
    await updateDoc(invoiceRef, {
      receiptUrl: receiptImageUrl.value,
      receiptUploadedAt: new Date(),
      status: 'pending_verification', // New status
      paymentMethod: 'bank_transfer'
    })

    // Create a payment record
    const paymentData = {
      invoiceId: selectedInvoiceForReceipt.value.id,
      invoiceNumber: selectedInvoiceForReceipt.value.invoiceNumber,
      amount: selectedInvoiceForReceipt.value.amount,
      receiptUrl: receiptImageUrl.value,
      userId: user.uid,
      userEmail: user.email,
      hotelId: currentHotel.value?.id,
      hotelName: currentHotel.value?.name,
      status: 'pending_verification',
      paymentMethod: 'bank_transfer',
      uploadedAt: new Date(),
      verifiedAt: null,
      verifiedBy: null
    }

    await addDoc(collection(db, 'payment_receipts'), paymentData)

    alert('✅ Receipt submitted successfully! We will verify your payment within 1-2 business days.')
    
    // Refresh invoices list
    await loadHotelInvoices()
    
    // Close modal
    closeReceiptUploadModal()

  } catch (error) {
    console.error('Error submitting receipt:', error)
    alert('Error submitting receipt: ' + error.message)
  } finally {
    uploadingReceipt.value = false
  }
}

onMounted(() => {
  console.log('🔄 Dashboard mounted')
  
  showPaymentModal.value = false
  showReactivationModal.value = false
  showApplicationModal.value = false
  showApplicationDetails.value = false
  processingPayment.value = false
  submittingApplication.value = false
  
  loadOwnerData()
  setupRealTimeListener()
  
  setTimeout(() => {
    console.log('🔍 Debug - Hotel data:', currentHotel.value)
    console.log('🔍 Debug - Status:', currentStatus.value)
    console.log('🔍 Debug - Invoices:', hotelInvoices.value)
    console.log('🔍 Debug - Pending invoice:', pendingInvoice.value)
  }, 2000)
})

// Clean up
onUnmounted(() => {
  if (registrationUnsubscribe.value) {
    registrationUnsubscribe.value()
  }
   showReceiptUploadModal.value = false
  selectedInvoiceForReceipt.value = null
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions for modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}


.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
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

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}


</style>