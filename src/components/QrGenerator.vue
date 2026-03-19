<template>
  <div class="qr-page">
    <!-- Header with Your Hotel Logo -->
    <header class="text-center mb-8">
      <h1 class="text-2xl font-bold text-navy"> Check-In</h1>
      <p class="text-gray-600">Scan this code with your phone's camera</p>
    </header>

    <!-- QR Code Display -->
    <div class="qr-container mx-auto bg-white p-4 rounded-lg shadow-lg" style="width: fit-content;">
      <qrcode-vue 
        :value="checkInUrl" 
        :size="280"
        level="H"
      />
    </div>

  
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  components: { QrcodeVue },
  data() {
    return {
      hotelName: "Your Hotel Name", // Dynamic if needed
      checkInUrl: window.location.origin + '/checkin'
    }
  }
}
</script>

<style scoped>
.qr-page {
  @apply min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6;
  max-width: 100%;
}
</style>