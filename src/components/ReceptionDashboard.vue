<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile Sidebar Toggle -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-blue-800 text-white p-2 sm:p-4 flex justify-between items-center z-50">
      <h1 class="text-lg sm:text-xl font-bold truncate mr-2">Reception Panel</h1>
      <button @click="mobileSidebarOpen = !mobileSidebarOpen" class="text-white focus:outline-none flex-shrink-0">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>

    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white transform lg:translate-x-0 transition-transform duration-300 ease-in-out z-40"
      :class="{'translate-x-0': mobileSidebarOpen, '-translate-x-full': !mobileSidebarOpen}"
    >
      <div class="p-4 border-b border-blue-700">
        <h1 class="text-xl font-bold">Reception Panel</h1>
        <div class="text-sm mt-1 truncate">{{ currentUser?.email }}</div>
      </div>
      <nav class="p-4 space-y-2">
        <div class="px-4 py-2 rounded bg-blue-700">Dashboard</div>
        <button 
          @click="logout" 
          class="px-4 py-2 rounded hover:bg-blue-700 transition flex items-center w-full"
        >
          <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Logout
        </button>
      </nav>
    </div>

    <!-- Overlay -->
    <div 
      v-if="mobileSidebarOpen"
      @click="mobileSidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    ></div>

    <!-- Main Content -->
    <div class="lg:ml-64 pt-16 lg:pt-0 p-2 sm:p-4 md:p-8">
      <!-- Header -->
      <div class="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:justify-between lg:items-start mb-4 sm:mb-6 md:mb-8 lg:space-y-0 gap-2 lg:gap-4">
        <!-- Title and Hotel Section -->
        <div class="flex flex-col space-y-2 min-w-0 flex-1">
          <h2 class="text-xl sm:text-2xl font-bold flex-shrink-0">Guest Check-Ins</h2>
          
          <!-- Hotel Selection/Display - Now always visible -->
          <div class="flex flex-col xs:flex-row xs:items-center gap-2 min-w-0">
            <span class="text-sm font-medium text-gray-600 flex-shrink-0 xs:text-base">Hotel:</span>
            
            <!-- Multiple hotels - show dropdown -->
            <div v-if="assignedHotels.length > 1" class="relative min-w-0 flex-1 max-w-md">
              <select 
                v-model="currentHotelId" 
                @change="fetchCheckins"
                class="border rounded px-3 py-2 text-sm w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option 
                  v-for="hotel in assignedHotels" 
                  :value="hotel.id" 
                  :key="hotel.id"
                >
                  {{ hotel.name }}
                </option>
              </select>
            </div>
            
            <!-- Single hotel - show name -->
            <span v-else-if="assignedHotels.length === 1" class="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-2 rounded border flex-1 xs:flex-initial min-w-0">
              {{ assignedHotels[0].name }}
            </span>
            
            <!-- No hotel assigned -->
            <span v-else class="text-red-600 text-sm bg-red-50 px-3 py-2 rounded border font-medium">
              No hotel assigned
            </span>
          </div>
        </div>
        
        <!-- Download Button -->
        <button 
          @click="downloadReport" 
          class="bg-gray-200 hover:bg-gray-300 px-3 sm:px-4 py-2 rounded flex items-center justify-center text-sm sm:text-base flex-shrink-0 transition-colors"
          :disabled="filteredAndSortedGuests.length === 0"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <span class="hidden sm:inline">Download Report</span>
          <span class="sm:hidden">Report</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-3 sm:p-4 rounded-lg shadow mb-4 sm:mb-6">
        <div class="flex flex-wrap gap-2 sm:gap-4 items-end">
          <div class="w-full sm:w-auto min-w-0">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="statusFilter" class="border rounded px-2 sm:px-3 py-1 sm:py-2 w-full sm:w-32 md:w-40 text-sm">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="checked-in">Checked-In</option>
            </select>
          </div>
          <div class="w-full sm:w-auto min-w-0 flex-1 sm:flex-initial">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Search by Name</label>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search guest name..."
              class="border rounded px-2 sm:px-3 py-1 sm:py-2 w-full sm:w-48 md:w-64 text-sm"
            >
          </div>
          <div class="w-full sm:w-auto">
            <button 
              @click="clearFilters"
              class="bg-gray-200 hover:bg-gray-300 px-3 sm:px-4 py-1 sm:py-2 rounded w-full text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center p-8">
        <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Guest Table -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                  <th class="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                 <th class="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                 <th class="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                 <th class="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
                 <th class="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In Date</th>
                <th class="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out Date</th>
                <th class="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th class="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport/ID</th>
                <th class="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservation</th>
                <th class="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Time</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="guest in paginatedGuests" :key="guest.id">
               <td class="px-2 sm:px-4 py-4 whitespace-nowrap">
               <div class="font-medium text-gray-900 text-sm">{{ guest.guestName }}</div>
               </td>
          <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
            {{ guest.email  }}
           </td>
        <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
              {{ guest.phone  }}
         </td>
            <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
             {{ guest.nationality }}
            </td>
           <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
            {{ formatDate(guest.checkInDate) }}
            </td>
                <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {{ formatDate(guest.checkOutDate) }}
                </td>
                <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {{ guest.source }}
                </td>
                <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {{ guest.amount }} USD
                </td>
                <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  <button 
                    @click="viewDocument(guest.passportURL, 'passport')" 
                    class="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                    :disabled="!guest.passportURL"
                    :class="{'opacity-50 cursor-not-allowed': !guest.passportURL}"
                  >
                    View
                  </button>
                </td>
                <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  <button 
                    @click="viewDocument(guest.reservationURL, 'reservation')" 
                    class="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                    :disabled="!guest.reservationURL"
                    :class="{'opacity-50 cursor-not-allowed': !guest.reservationURL}"
                  >
                    View
                  </button>
                </td>
                <td class="px-2 sm:px-4 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="statusClass(guest.status)">
                    {{ guest.status }}
                  </span>
                </td>
                <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                  <div class="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <button 
                      @click="markAsCheckedIn(guest.id)"
                      class="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
                      v-if="guest.status === 'pending'"
                    >
                      Check In
                    </button>
                    <span v-else class="text-gray-500 text-xs sm:text-sm">
                      {{ formatTime(guest.checkedInAt) }}
                    </span>

                    <button 
                      @click="deleteCheckin(guest.id)"
                      class="bg-red-100 hover:bg-red-200 text-red-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="bg-white px-2 sm:px-4 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-3 sm:gap-0">
          <div class="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
            Showing <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> to 
            <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredAndSortedGuests.length) }}</span> of 
            <span class="font-medium">{{ filteredAndSortedGuests.length }}</span> results
          </div>
          <div class="flex items-center space-x-2 order-1 sm:order-2">
            <span class="text-xs sm:text-sm text-gray-700">Rows:</span>
            <select 
              v-model="pageSize" 
              class="border rounded px-1 sm:px-2 py-1 text-xs sm:text-sm"
              @change="currentPage = 1"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div class="order-3">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-1 sm:px-2 py-1 sm:py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="currentPage = page"
                :class="[
                  'relative inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 border text-xs sm:text-sm font-medium',
                  currentPage === page 
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-1 sm:px-2 py-1 sm:py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Next</span>
                <svg class="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredAndSortedGuests.length === 0" class="bg-white shadow rounded-lg p-8 text-center mt-6">
        <p class="text-gray-500 text-sm sm:text-base">
          {{ assignedHotels.length === 0 ? 'No hotel assigned to your account' : 'No guests found matching your filters' }}
        </p>
      </div>

      <!-- Document Viewer Modal -->
      <div v-if="activeDocument.url" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div class="p-3 sm:p-4 border-b flex justify-between items-center">
            <h3 class="text-base sm:text-lg font-medium truncate mr-2">{{ activeDocument.title }}</h3>
            <button 
              @click="activeDocument.url = null" 
              class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
            >
              <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="flex-1 overflow-auto p-2 sm:p-4">
            <img 
              v-if="activeDocument.fileType === 'image'" 
              :src="activeDocument.url" 
              :alt="activeDocument.title"
              class="max-w-full max-h-full object-contain mx-auto"
            />
            <iframe 
              v-else-if="activeDocument.fileType === 'pdf'"
              :src="`https://docs.google.com/gview?url=${encodeURIComponent(activeDocument.url)}&embedded=true`" 
              class="w-full h-full min-h-[50vh] sm:min-h-[70vh] border-0"
              frameborder="0"
            ></iframe>
            <div v-else class="flex items-center justify-center h-full">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-gray-500 mb-4 text-sm sm:text-base">Cannot preview this file type in browser</p>
                <button 
                  @click="downloadDocument"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded inline-flex items-center text-sm sm:text-base"
                >
                  Download Document
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-3 sm:p-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div class="text-xs sm:text-sm text-gray-500">
              Document Type: {{ activeDocument.type === 'passport' ? 'Passport/ID' : 'Reservation' }}
            </div>
            <div class="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
              <button 
                @click="openInNewTab"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded text-sm flex-1 sm:flex-initial"
              >
                <span class="hidden sm:inline">Open in New Tab</span>
                <span class="sm:hidden">Open</span>
              </button>
              <button 
                @click="downloadDocument"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded text-sm flex-1 sm:flex-initial"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  collection, getDocs, getDoc, doc, updateDoc, 
  query, where,deleteDoc
} from 'firebase/firestore'
import { getAuth, signOut } from 'firebase/auth'
import { db, auth } from '@/firebase'
import { useRouter } from 'vue-router'

// State
const mobileSidebarOpen = ref(false)
const loading = ref(true)
const guests = ref([])
const assignedHotels = ref([])
const currentHotelId = ref('')
const statusFilter = ref('all')
const searchQuery = ref('')
const activeDocument = ref({
  type: null,
  url: null,
  title: '',
  fileType: null
})
const currentUser = ref(null)

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

const router = useRouter()

const filteredAndSortedGuests = computed(() => {
  const filtered = guests.value.filter(guest => {
    // Filter by status
    const statusMatch = statusFilter.value === 'all' || guest.status === statusFilter.value
    
    // Filter by search query
    let searchMatch = true
    if (searchQuery.value) {
      searchMatch = guest.guestName.toLowerCase().includes(searchQuery.value.toLowerCase())
    }
    
    return statusMatch && searchMatch
  })
  
  // Sort by check-in date (newest first)
  return filtered.sort((a, b) => {
    const dateA = getDateForSorting(a.checkInDate)
    const dateB = getDateForSorting(b.checkInDate)
    return dateB - dateA // Descending order (newest first)
  })
})

// Paginated guests
const paginatedGuests = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  return filteredAndSortedGuests.value.slice(startIndex, startIndex + pageSize.value)
})

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedGuests.value.length / pageSize.value)
})

// Visible pages for pagination
const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)
  
  // Adjust if we're near the beginning
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return pages
})

// Watch for filter changes and reset to first page
watch([statusFilter, searchQuery], () => {
  currentPage.value = 1
})

// Helper function to normalize dates for sorting
const getDateForSorting = (date) => {
  if (!date) return new Date(0) // If no date, put at the end
  
  // Handle Firestore Timestamp objects
  if (date && typeof date.toDate === 'function') {
    return date.toDate()
  }
  
  // Handle Date objects
  if (date instanceof Date) {
    return date
  }
  
  // Handle string dates
  if (typeof date === 'string') {
    return new Date(date)
  }
  
  // Fallback
  return new Date(date || 0)
}

// Methods
const fetchUserData = async () => {
  try {
    const auth = getAuth()
    currentUser.value = auth.currentUser
    
   
    const userDoc = await getDoc(doc(db, 'staffs', currentUser.value.uid))
    if (!userDoc.exists()) return

    const userData = userDoc.data()
    const hotelIds = Array.isArray(userData.hotelIds) 
      ? userData.hotelIds 
      : userData.hotelId ? [userData.hotelId] : []

    // Fetch hotel details
    const hotelPromises = hotelIds.map(id => getDoc(doc(db, 'Hotels', id)))
    const hotelSnapshots = await Promise.all(hotelPromises)
    
    assignedHotels.value = hotelSnapshots
      .filter(snap => snap.exists())
      .map(snap => ({ id: snap.id, ...snap.data() }))
    
    currentHotelId.value = assignedHotels.value[0]?.id || ''
  } catch (error) {
    console.error("Error fetching user data:", error)
  }
}



const fetchCheckins = async () => {
  if (!currentHotelId.value) {
    guests.value = []
    loading.value = false
    return
  }

  loading.value = true
  try {
    // Use hotelId for filtering
    const checkinsQuery = query(
      collection(db, 'Checkins'),
      where('hotelId', '==', currentHotelId.value)
    )
    
    const checkinsSnapshot = await getDocs(checkinsQuery)
    guests.value = checkinsSnapshot.docs.map(doc => {
      const data = doc.data()
      return { 
        id: doc.id, 
        ...data,
        status: data.status === 'checked-in' ? 'checked-in' : 'pending',
        checkInDate: data.checkInDate?.toDate?.() || data.checkInDate,
        checkOutDate: data.checkOutDate?.toDate?.() || data.checkOutDate,
        checkedInAt: data.checkedInAt?.toDate?.() || data.checkedInAt
      }
    })
  } catch (error) {
    console.error("Error fetching check-ins:", error)
  } finally {
    loading.value = false
  }
}

const deleteCheckin = async (checkinId) => {
  if (!confirm('Are you sure you want to delete this check-in?')) return;
  
  try {
    await deleteDoc(doc(db, 'Checkins', checkinId));
    
    // Remove from local state
    guests.value = guests.value.filter(guest => guest.id !== checkinId);
    
    alert('Check-in deleted successfully');
  } catch (error) {
    console.error('Error deleting check-in:', error);
    alert('Failed to delete check-in: ' + error.message);
  }
}

const markAsCheckedIn = async (guestId) => {
  if (!confirm('Mark this guest as checked-in?')) return
  
  try {
    const now = new Date() // Just use a regular JavaScript Date object
    await updateDoc(doc(db, 'Checkins', guestId), {
      status: 'checked-in',
      checkedInAt: now, // Firestore will automatically convert this to a Timestamp
      checkedInBy: currentUser.value.uid
    })

    // Update local state with the same Date object
    guests.value = guests.value.map(guest => 
      guest.id === guestId 
        ? { ...guest, status: 'checked-in', checkedInAt: now }
        : guest
    )
  } catch (error) {
    console.error('Error checking in guest:', error)
    alert('Failed to check in guest: ' + error.message)
  }
}

const viewDocument = (url, type) => {
  if (!url) {
    alert('Document not available')
    return
  }
  
  const fileType = url.toLowerCase().includes('.pdf') ? 'pdf' : 'image'
  
  activeDocument.value = {
    type,
    url,
    title: type === 'passport' ? 'Passport/ID Document' : 'Reservation Confirmation',
    fileType
  }
}

const openInNewTab = () => {
  window.open(activeDocument.value.url, '_blank')
}

const downloadDocument = () => {
  const link = document.createElement('a')
  link.href = activeDocument.value.url
  link.download = activeDocument.value.title.replace(/\s+/g, '_').toLowerCase()
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const downloadReport = () => {
  const csvContent = "data:text/csv;charset=utf-8," +
    "Guest Name,Check-In Date,Check-Out Date,Status,Checked-In At\n" +
    filteredAndSortedGuests.value.map(guest => 
      `"${guest.guestName}","${formatDate(guest.checkInDate)}","${formatDate(guest.checkOutDate)}","${guest.status}","${guest.checkedInAt ? formatTime(guest.checkedInAt) : 'N/A'}"`
    ).join("\n")
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `guest_checkins_${currentHotelId.value}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const clearFilters = () => {
  statusFilter.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
}

const logout = async () => {
  try {
    await signOut(auth)
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Helpers
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const statusClass = (status) => {
  return {
    'pending': 'bg-yellow-100 text-yellow-800',
    'checked-in': 'bg-green-100 text-green-800'
  }[status] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(async () => {
  await fetchUserData()
  await fetchCheckins()
})
</script>

<style scoped>
.router-link-active {
  @apply bg-blue-700;
}

/* Add custom breakpoint for extra small screens */
@media (min-width: 375px) {
  .xs\:flex-row {
    flex-direction: row;
  }
  
  .xs\:items-center {
    align-items: center;
  }
  
  .xs\:flex-initial {
    flex: initial;
  }
  
  .xs\:text-base {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}
</style>