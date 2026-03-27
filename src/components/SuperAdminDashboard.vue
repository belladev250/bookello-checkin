<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile Sidebar Toggle -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-blue-800 text-white p-4 flex justify-between items-center z-50">
      <h1 class="text-xl font-bold">Admin Panel</h1>
      <button @click="mobileSidebarOpen = !mobileSidebarOpen" class="text-white focus:outline-none">
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
        <h1 class="text-xl font-bold">Admin Panel</h1>
      </div>
      <nav class="p-4 space-y-2">
        <a 
          href="#dashboard"
          class="block px-4 py-2 rounded hover:bg-blue-700 transition"
          :class="{ 'bg-blue-700': $route.hash === '#dashboard' }"
          @click="mobileSidebarOpen = false"
        >
          Dashboard
        </a>
        <a 
          href="#staff-management"
          class="block px-4 py-2 rounded hover:bg-blue-700 transition"
          :class="{ 'bg-blue-700': $route.hash === '#staff-management' }"
          @click="mobileSidebarOpen = false"
        >
          Manage Staff
        </a>

        <a 
       href="#email-management"
       class="block px-4 py-2 rounded hover:bg-blue-700 transition"
       :class="{ 'bg-blue-700': $route.hash === '#email-management' }"
        @click="mobileSidebarOpen = false">
        Email Management
         </a>

        <button 
          @click="logout"
          class="block px-4 py-2 rounded hover:bg-blue-700 transition flex items-center w-full"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Logout
        </button>
      </nav>
    </div>
 
    <!-- Overlay for mobile sidebar -->
    <div 
      v-if="mobileSidebarOpen"
      @click="mobileSidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    ></div>

    <!-- Main Content -->
    <div class="lg:ml-64 p-4 md:p-8">
      <!-- Dashboard View -->
      <div v-if="!$route.hash || $route.hash === '#dashboard'">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <h2 class="text-2xl font-bold">Guest Check-Ins</h2>
          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              @click="showUserModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded whitespace-nowrap"
            >
              + Create Staff
            </button>
            <button 
              @click="downloadReport"
              class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download Report
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow mb-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Booking Source</label>
              <select v-model="bookingSource" class="border rounded px-3 py-2 w-full">
                <option value="all">All</option>
                <option value="Bookello">Bookello.life</option>
                <option value="Booking.com">Booking.com</option>
                <option value="Agora">Agora</option>
                <option value="Expedia">Expedia</option>
                <option value="Hotel">Hotel.com</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="statusFilter" class="border rounded px-3 py-2 w-full">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
              <input 
                type="date" 
                v-model="checkoutDateFilter" 
                class="border rounded px-3 py-2 w-full"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search guest name..."
                class="border rounded px-3 py-2 w-full"
              >
            </div>
            <div>
              <button 
                @click="clearFilters"
                class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Guest Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
<tr>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport/ID</th>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservation</th>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
</tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="guest in paginatedGuests" :key="guest.id">
              <td class="px-4 py-4 whitespace-nowrap">
         <div class="font-medium text-gray-900">{{ guest.guestName }}</div>
      </td>
        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
       {{ guest.email }}
       </td>
      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
       {{ guest.phone  }}
     </td>
      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ guest.nationality  }}
     </td>
     <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ formatDate(guest.checkInDate) }}
    </td>
     <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
    {{ formatDate(guest.checkOutDate) }}
    </td>
    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ guest.source }}
    </td>
     <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
      <span>{{ guest.amount }}</span> <span>RWF</span>
    </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      @click="viewDocument(guest.passportURL, 'passport', guest.id)" 
                      class="text-blue-600 hover:text-blue-900 mr-2"
                      :disabled="!guest.passportURL"
                      :class="{'opacity-50 cursor-not-allowed': !guest.passportURL}"
                    >
                      <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      <span class="hidden sm:inline">View Passport</span>
                    </button>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      @click="viewDocument(guest.reservationURL, 'reservation', guest.id)" 
                      class="text-blue-600 hover:text-blue-900"
                      :disabled="!guest.reservationURL"
                      :class="{'opacity-50 cursor-not-allowed': !guest.reservationURL}"
                    >
                      <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span class="hidden sm:inline">View Reservation</span>
                    </button>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ guest.hotel }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                      :class="statusClass(guest.status)">
                      {{ guest.status }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="approveGuest(guest.id)"
                      class="text-green-600 hover:text-green-900 mr-3"
                      v-if="guest.status === 'pending'"
                    >
                      Approve
                    </button>
                    <button 
                      @click="rejectGuest(guest.id)"
                      class="text-red-600 hover:text-red-900"
                      v-if="guest.status === 'pending'"
                    >
                      Reject
                    </button>
                    <span v-if="guest.status !== 'pending'" class="text-gray-500">
                      Processed
                    </span>

                    <button  @click="deleteCheckin(guest.id)" class="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded ml-2"
                     >
                      Delete
                     </button>

                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between items-center">
              <div class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> to 
                <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredAndSortedGuests.length) }}</span> of 
                <span class="font-medium">{{ filteredAndSortedGuests.length }}</span> results
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-700 mr-4">Rows per page:</span>
                <select 
                  v-model="pageSize" 
                  class="border rounded px-2 py-1 text-sm"
                  @change="currentPage = 1"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button 
                    @click="currentPage--" 
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    v-for="page in visiblePages" 
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
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
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">Next</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredAndSortedGuests.length === 0" class="bg-white shadow rounded-lg p-8 text-center mt-6">
          <p class="text-gray-500">No guests found matching your filters</p>
        </div>
      </div>

      <!-- Staff Management View -->
      <div v-if="$route.hash === '#staff-management'">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <h2 class="text-2xl font-bold">Staff Management</h2>
        </div>

        <!-- Staff Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="staff in staffList" :key="staff.id">
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="font-medium text-gray-900">{{ staff.email }}</div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                      :class="{
                        'bg-purple-100 text-purple-800': staff.role === 'super_admin',
                        'bg-blue-100 text-blue-800': staff.role === 'hotel_admin',
                        'bg-green-100 text-green-800': staff.role === 'reception'
                      }">
                      {{ staff.role }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div v-if="staff.hotelIds && staff.hotelIds.length > 0">
                      <span class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ getHotelName(staff.hotelIds || staff.hotelId) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="confirmDeleteStaff(staff.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="staffList.length === 0" class="bg-white shadow rounded-lg p-8 text-center mt-6">
          <p class="text-gray-500">No staff members found</p>
        </div>
      </div>

      <!-- Modals -->
      <!-- Create Staff Modal -->
      <div v-if="showUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Create Staff Member</h3>
            <button @click="showUserModal = false" class="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <form @submit.prevent="createStaff">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="staffForm.email" type="email" class="border rounded w-full px-3 py-2" required>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input v-model="staffForm.password" type="password" class="border rounded w-full px-3 py-2" required>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select v-model="staffForm.role" class="border rounded w-full px-3 py-2" required>
                <option value="reception">Receptionist</option>
              </select>
            </div>
         
            <div class="flex justify-end space-x-3">
              <button type="button" @click="showUserModal = false" class="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
                Create Staff
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Staff Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Confirm Deletion</h3>
            <button @click="showDeleteModal = false" class="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <p class="mb-6">Are you sure you want to delete this staff member? This action cannot be undone.</p>
          <div class="flex justify-end space-x-3">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              @click="deleteStaff" 
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              :disabled="deleteLoading"
            >
              <span v-if="!deleteLoading">Delete</span>
              <span v-else>Deleting...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Document Viewer Modal -->
      <div v-if="activeDocument.url" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[90vh] flex flex-col">
          <div class="p-4 border-b flex justify-between items-center">
            <h3 class="text-lg font-medium">{{ activeDocument.title }}</h3>
            <button 
              @click="activeDocument.url = null" 
              class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="flex-1 overflow-hidden">
            <!-- Image Viewer -->
            <div v-if="activeDocument.fileType === 'image'" class="w-full h-full flex items-center justify-center bg-gray-100">
              <div class="max-w-full max-h-full overflow-auto p-4">
                <img 
                  :src="activeDocument.url" 
                  :alt="activeDocument.title"
                  class="max-w-full max-h-full object-contain shadow-lg rounded"
                  style="min-height: 200px;"
                  @error="$event.target.src = activeDocument.originalUrl"
                />
              </div>
            </div>
            
            <!-- PDF Viewer -->
            <div v-else-if="activeDocument.fileType === 'pdf'" class="w-full h-full">
              <iframe 
                :src="activeDocument.url" 
                class="w-full h-full border-0"
                frameborder="0"
              ></iframe>
            </div>
            
            <!-- Fallback for unknown file types -->
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
              <div class="text-center p-8">
                <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Document Preview</h3>
                <p class="text-gray-500 mb-4">Cannot preview this file type in browser</p>
                <button 
                  @click="downloadDocument"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download to View
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-4 border-t flex justify-between items-center">
            <div class="text-sm text-gray-500">
              Document Type: {{ activeDocument.type === 'passport' ? 'Passport/ID' : 'Reservation Confirmation' }}
              <span class="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                {{ activeDocument.fileType?.toUpperCase() }}
              </span>
            </div>
            <div class="flex space-x-3">
              <button 
                @click="confirmDeleteDocument"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded inline-flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete Document
              </button>
              <button 
                @click="window.open(activeDocument.originalUrl || activeDocument.url, '_blank')"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded inline-flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Open in New Tab
              </button>
              <button 
                @click="downloadDocument"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Document Confirmation Modal -->
      <div v-if="showDeleteDocumentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Confirm Document Deletion</h3>
            <button @click="showDeleteDocumentModal = false" class="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <p class="mb-6">Are you sure you want to delete this {{ activeDocument.type === 'passport' ? 'passport/ID' : 'reservation' }} document? This action cannot be undone.</p>
          <div class="flex justify-end space-x-3">
            <button 
              @click="showDeleteDocumentModal = false" 
              class="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              @click="deleteDocument" 
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              :disabled="deleteDocumentLoading"
            >
              <span v-if="!deleteDocumentLoading">Delete Document</span>
              <span v-else>Deleting...</span>
            </button>
          </div>
        </div>
      </div>

  <!-- New Email Modal -->
<div v-if="showNewEmailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
    <div class="p-6 border-b">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium">Send Custom Email</h3>
        <button @click="showNewEmailModal = false" class="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
    </div>
    
    <div class="p-6">
      <!-- Recipient Selection -->
      <div class="mb-6">
        <h4 class="font-medium mb-3">1. Select Recipients</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
            <input 
              type="radio" 
              v-model="emailForm.recipientType" 
              value="checkedin"
              class="mr-2"
            >
            <span>All checked-in guests</span>
          </label>
          <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
            <input 
              type="radio" 
              v-model="emailForm.recipientType" 
              value="daterange"
              class="mr-2"
            >
            <span>Guests from date range</span>
          </label>
          <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
            <input 
              type="radio" 
              v-model="emailForm.recipientType" 
              value="current"
              class="mr-2"
            >
            <span>Currently staying guests</span>
          </label>
          <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
            <input 
              type="radio" 
              v-model="emailForm.recipientType" 
              value="past"
              class="mr-2"
            >
            <span>Past guests (follow-up)</span>
          </label>

            <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <input 
                type="radio" 
                v-model="emailForm.recipientType" 
                value="manual"
                class="mr-2"
              >
              <span>Manual selection</span>
            </label>

            <label class="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <input 
                type="radio" 
                v-model="emailForm.recipientType" 
                value="custom"
                class="mr-2"
              >
              <span>Custom email addresses</span>
            </label>
        </div>

        <!-- Date Range Selector -->
        <div v-if="emailForm.recipientType === 'daterange'" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input 
              type="date" 
              v-model="emailForm.dateRange.start"
              class="border rounded px-3 py-2 w-full"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input 
              type="date" 
              v-model="emailForm.dateRange.end"
              class="border rounded px-3 py-2 w-full"
            >
          </div>
        </div>

        <!-- Manual Selection -->
        <div v-if="emailForm.recipientType === 'manual'" class="mt-4">
          <div class="border rounded-lg max-h-60 overflow-y-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input 
                      type="checkbox" 
                      @change="toggleAllGuests"
                      :checked="allGuestsSelected"
                      class="rounded"
                    >
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Date</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="guest in availableGuests" :key="guest.id">
                  <td class="px-4 py-3">
                    <input 
                      type="checkbox" 
                      v-model="emailForm.manualRecipients"
                      :value="guest.id"
                      class="rounded"
                    >
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ guest.guestName }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ guest.email }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(guest.checkInDate) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-sm text-gray-500 mt-2">
            Selected: {{ emailForm.manualRecipients.length }} guests
          </p>
        </div>
       

        <!-- Add this section after the "Manual Selection" section -->
<div v-if="emailForm.recipientType === 'custom'" class="mt-4">
  <label class="block text-sm font-medium text-gray-700 mb-2">Custom Email Addresses</label>
  <p class="text-sm text-gray-500 mb-3">Enter email addresses (one per line or separated by commas)</p>
  
  <textarea
    v-model="emailForm.customEmails"
    rows="4"
    class="w-full border rounded px-3 py-2"
    placeholder="Enter email addresses, e.g.:
customer1@example.com
customer2@example.com
Or: customer1@example.com, customer2@example.com"
  ></textarea>
  
  <div class="mt-2">
    <p class="text-sm text-gray-500">
      Email addresses parsed: {{ parsedCustomEmails.length }}
      <span v-if="parsedCustomEmails.length > 0" class="text-blue-600">
        • {{ parsedCustomEmails.slice(0, 3).join(', ') }}{{ parsedCustomEmails.length > 3 ? '...' : '' }}
      </span>
    </p>
  </div>
</div>

      

      </div>

      <!-- Email Content -->
      <div class="mb-6">
        <h4 class="font-medium mb-3">2. Email Content</h4>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input 
              type="text" 
              v-model="emailForm.subject"
              class="border rounded px-3 py-2 w-full"
              placeholder="Email subject..."
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <select 
              v-model="emailForm.template"
              @change="applyTemplate"
              class="border rounded px-3 py-2 w-full"
            >
              <option value="custom">Custom Email</option>
              <option value="new_tenant_welcome">1 New Tenant Welcome</option>
              <option value="maintenance">Maintenance / Access Notice</option>
              <option value="lostfound">Lost & Found</option>
              <option value="latecheckout">Late Checkout / Stay Extension</option>
              <option value="houserules">House Rules</option>
              <option value="wemissyou">We Miss You</option>
              <option value="review">Review Request</option>
              <option value="referral">Referral Program</option>
              <option value="rebook">Rebooking Invitation</option>
              <option value="house_compound">2 House & Compound Instructions</option>
              <option value="utilities_hygiene">3 Utilities & Hygiene</option>
              <option value="rent_reminder">4 Rent Payment Reminder</option>
              <option value="tenant_referral">5 Tenant Referral Program</option>
              <option value="delegates_invite">6 Invite for Delegates & Speakers</option>
              <option value="team_recommendations">8 Recommendations for Teams</option>
              <option value="fan_club_recommendations">7 Recommendations for Fan Clubs</option>
              <option value="formal_cooperation">9 Formal International Cooperation Proposal</option>
              <option value="move_out_instructions">10 Move Out Instructions</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Body Content</label>
            <div class="border rounded overflow-hidden">
              <div class="bg-gray-50 px-3 py-2 border-b flex space-x-2">
                <button 
                  type="button"
                  @click="insertVariable('{{GuestName}}')"
                  class="text-xs bg-white border rounded px-2 py-1 hover:bg-gray-100"
                >
                  Guest Name
                </button>
                <button 
                  type="button"
                  @click="insertVariable('{{PropertyName}}')"
                  class="text-xs bg-white border rounded px-2 py-1 hover:bg-gray-100"
                >
                  Property Name
                </button>
                <button 
                  type="button"
                  @click="insertVariable('{{PropertyWhatsApp}}')"
                  class="text-xs bg-white border rounded px-2 py-1 hover:bg-gray-100"
                >
                  WhatsApp Link
                </button>
              </div>
              <textarea 
                v-model="emailForm.body"
                rows="12"
                class="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                placeholder="Write your email content here..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="mb-6" v-if="emailForm.body">
        <h4 class="font-medium mb-3">Preview</h4>
        <div class="bg-gray-50 border rounded p-4 max-h-60 overflow-y-auto">
          <div class="text-sm text-gray-500 mb-2">Subject: {{ emailForm.subject }}</div>
          <div class="prose prose-sm max-w-none" v-html="formatPreview(emailForm.body)"></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 pt-4 border-t">
        <button 
          type="button" 
          @click="showNewEmailModal = false"
          class="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          type="button" 
          @click="testEmail"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          :disabled="sendingEmail"
        >
          Send Test
        </button>
        <button 
          type="button" 
          @click="sendBulkEmail"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          :disabled="sendingEmail"
        >
          <span v-if="!sendingEmail">Send Email</span>
          <span v-else>Sending...</span>
        </button>
      </div>
    </div>
  </div>
</div>


      <!-- Email Management View -->
<div v-if="$route.hash === '#email-management'">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
    <h2 class="text-2xl font-bold">Email Management</h2>
    <button 
      @click="showNewEmailModal = true"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded whitespace-nowrap"
    >
      + New Custom Email
    </button>
  </div>

  <!-- Email Templates -->
  <div class="mb-8">
    <h3 class="text-lg font-semibold mb-4">Quick Templates</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Template 1: Maintenance/Access -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">Maintenance / Access Notice</h4>
        <p class="text-sm text-gray-600 mb-3">Inform guests about scheduled maintenance or access updates.</p>
        <button 
          @click="useTemplate('maintenance')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 2: Lost & Found -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">Lost & Found</h4>
        <p class="text-sm text-gray-600 mb-3">Notify guests about found items after their stay.</p>
        <button 
          @click="useTemplate('lostfound')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 3: Late Checkout -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">Late Checkout / Stay Extension</h4>
        <p class="text-sm text-gray-600 mb-3">Offer late checkout or stay extension options.</p>
        <button 
          @click="useTemplate('latecheckout')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 4: House Rules -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">House Rules</h4>
        <p class="text-sm text-gray-600 mb-3">Send house rules and policies to guests.</p>
        <button 
          @click="useTemplate('houserules')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 5: We Miss You -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">We Miss You</h4>
        <p class="text-sm text-gray-600 mb-3">Re-engage past guests with a friendly message.</p>
        <button 
          @click="useTemplate('wemissyou')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 6: Review Request -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">Review Request</h4>
        <p class="text-sm text-gray-600 mb-3">Ask guests to share their experience on social platforms.</p>
        <button 
          @click="useTemplate('review')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 7: Referral Program -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">Referral Program</h4>
        <p class="text-sm text-gray-600 mb-3">Invite guests to earn discount points by referring others.</p>
        <button 
          @click="useTemplate('referral')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 8: Rebooking Invitation -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">Rebooking Invitation</h4>
        <p class="text-sm text-gray-600 mb-3">Invite guests to book again with special offers.</p>
        <button 
          @click="useTemplate('rebook')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 1: New Tenant Welcome -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">👋 1 New Tenant Welcome</h4>
        <p class="text-sm text-gray-600 mb-3">Send a welcome message to new tenants.</p>
        <button 
          @click="useTemplate('new_tenant_welcome')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 2: House & Compound Instructions -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">🏠 2 House & Compound Instructions</h4>
        <p class="text-sm text-gray-600 mb-3">Send house and compound guidelines to tenants.</p>
        <button 
          @click="useTemplate('house_compound')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 3: Utilities & Hygiene -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">✨ 3 Utilities & Hygiene</h4>
        <p class="text-sm text-gray-600 mb-3">Instruct tenants regarding utilities and hygiene guidelines.</p>
        <button 
          @click="useTemplate('utilities_hygiene')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 4: Rent Payment Reminder -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">💰 4 Rent Payment Reminder</h4>
        <p class="text-sm text-gray-600 mb-3">Remind tenants about upcoming rent due dates.</p>
        <button 
          @click="useTemplate('rent_reminder')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 5: Tenant Referral Program -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">🎁 5 Tenant Referral Program</h4>
        <p class="text-sm text-gray-600 mb-3">Invite tenants to refer others and earn rewards.</p>
        <button 
          @click="useTemplate('tenant_referral')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 6: Invite for Delegates & Speakers -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">🌍 6 Invite for Delegates & Speakers</h4>
        <p class="text-sm text-gray-600 mb-3">Accommodation invitation for event delegates and speakers.</p>
        <button 
          @click="useTemplate('delegates_invite')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 9: Recommendations for Teams -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">🏆 8 Recommendations for Teams</h4>
        <p class="text-sm text-gray-600 mb-3">Accommodation and logistics support for sports teams.</p>
        <button 
          @click="useTemplate('team_recommendations')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 10: Recommendations for Fan Clubs -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">⚽️ 7 Recommendations for Fan Clubs</h4>
        <p class="text-sm text-gray-600 mb-3">Travel and stay solutions for fan clubs and supporters.</p>
        <button 
          @click="useTemplate('fan_club_recommendations')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 11: Formal Cooperation Proposal -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">🌐 9 Formal International Cooperation Proposal</h4>
        <p class="text-sm text-gray-600 mb-3">Partnership proposal for delegate accommodation.</p>
        <button 
          @click="useTemplate('formal_cooperation')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>

      <!-- Template 12: Move Out Instructions -->
      <div class="bg-white rounded-lg shadow p-4">
        <h4 class="font-medium mb-2">📦 10 Move Out Instructions</h4>
        <p class="text-sm text-gray-600 mb-3">Provide instructions to the tenant on how to move out properly.</p>
        <button 
          @click="useTemplate('move_out_instructions')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Use Template
        </button>
      </div>
    </div>
  </div>

  <!-- Email History -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="p-4 border-b">
      <h3 class="font-medium">Email History</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="email in emailHistory" :key="email.id">
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(email.sentAt) }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">{{ email.subject }}</div>
              <div class="text-sm text-gray-500">{{ email.templateName }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ email.recipientCount }} guests
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="{
                  'bg-green-100 text-green-800': email.status === 'sent',
                  'bg-yellow-100 text-yellow-800': email.status === 'pending',
                  'bg-red-100 text-red-800': email.status === 'failed'
                }">
                {{ email.status }}
              </span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                @click="viewEmailDetails(email)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                View
              </button>
              <button 
                @click="resendEmail(email.id)"
                class="text-green-600 hover:text-green-900"
                v-if="email.status === 'failed'"
              >
                Resend
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Empty State -->
  <div v-if="emailHistory.length === 0" class="bg-white shadow rounded-lg p-8 text-center mt-6">
    <p class="text-gray-500">No email history found</p>
  </div>
 </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted,nextTick } from 'vue'
import { createUserWithEmailAndPassword, deleteUser, getAuth, signOut} from 'firebase/auth'
import { db, auth,functions } from '@/firebase'
import { useRouter } from 'vue-router'
import { 
  collection, getDocs, getDoc, setDoc, doc, deleteDoc, 
  updateDoc, Timestamp, where, query, orderBy, limit, addDoc
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'

// State

const mobileSidebarOpen = ref(false)
const guests = ref([])
const hotels = ref([])
const staffList = ref([])
const loading = ref(false)
const bookingSource = ref('all')
const statusFilter = ref('all')
const checkoutDateFilter = ref('')
const searchQuery = ref('')
const showUserModal = ref(false)
const showDeleteModal = ref(false)
const showDeleteDocumentModal = ref(false)
const deleteLoading = ref(false)
const deleteDocumentLoading = ref(false)
const selectedStaffId = ref('')
const currentGuestId = ref('')
const showNewEmailModal = ref(false)
const selectedEmail = ref(null)
const emailHistory = ref([])
const availableGuests = ref([])
const allGuestsSelected = ref(false)
const sendingEmail = ref(false)


// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

// Document Viewer
const activeDocument = ref({
  type: null,
  url: null,
  title: '',
  fileType: null,
  originalUrl: null
})

// Staff Form
const staffForm = ref({
  email: '',
  password: '',
  role: 'reception'
})

const router = useRouter()

const filteredAndSortedGuests = computed(() => {
  const filtered = guests.value.filter(guest => {
    // Filter by booking source
    const sourceMatch = bookingSource.value === 'all' || 
                       guest.source === bookingSource.value
    
    // Filter by status
    const statusMatch = statusFilter.value === 'all' || 
                       guest.status === statusFilter.value
    
    // Filter by checkout date
    let checkoutMatch = true
    if (checkoutDateFilter.value) {
      const checkoutDate = new Date(guest.checkOutDate)
      const filterDate = new Date(checkoutDateFilter.value)
      checkoutMatch = checkoutDate.toDateString() === filterDate.toDateString()
    }
    
    // Filter by search query
    let searchMatch = true
    if (searchQuery.value) {
      searchMatch = guest.guestName.toLowerCase().includes(searchQuery.value.toLowerCase())
    }
    
    return sourceMatch && statusMatch && checkoutMatch && searchMatch
  })
  
  // Sort by check-in date (newest first)
  return filtered.sort((a, b) => {
    const dateA = getDateForSorting(a.checkInDate)
    const dateB = getDateForSorting(b.checkInDate)
    return dateB - dateA // Descending order (newest first)
  })
})




// Email form
const emailForm = ref({
  recipientType: 'checkedin',
  customEmails: '', 
  dateRange: {
    start: '',
    end: ''
  },
  manualRecipients: [],
  subject: '',
  template: 'custom',
  body: '',
  propertyName: '',
  propertyWhatsApp: ''
})

const parsedCustomEmails = computed(() => {
  if (!emailForm.value.customEmails) return []
  
  // Parse emails from textarea (split by new lines or commas)
  const emails = emailForm.value.customEmails
    .split(/[\n,]/) // Split by new lines or commas
    .map(email => email.trim())
    .filter(email => {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return email && emailRegex.test(email)
    })
  
  return emails
})

// Add these methods
const useTemplate = (templateType) => {
  emailForm.value.template = templateType
  applyTemplate()
  showNewEmailModal.value = true
}

const applyTemplate = () => {
  const templates = {
    new_tenant_welcome: {
      subject: 'Welcome to {{PropertyName}}!',
      body: `This is an automated welcome email. 
The actual email content requires no further input and will be generated beautifully by the system, welcoming the tenant.`
    },
    utilities_hygiene: {
      subject: 'Utilities & Hygiene at {{PropertyName}}',
      body: `This is an automated instructions email.
The actual email content will be generated by the system, instructing the tenant regarding utilities and hygiene.`
    },
    move_out_instructions: {
      subject: 'Move Out Instructions for {{PropertyName}}',
      body: `This is an automated move-out email.
The actual email content will provide instructions to the tenant on how to move out properly.`
    },
    maintenance: {
      subject: 'Temporary access notice – {{PropertyName}}',
      body: `Dear {{GuestName}},

We'd like to inform you of a scheduled maintenance or access update at {{PropertyName}}:
- Area affected: {{AffectedArea}}
- Date & time: {{DateTime}}

We apologize for any inconvenience and appreciate your cooperation.

---

### Questions? WhatsApp us:
📞 https://wa.me/{{PropertyWhatsApp}}

Thank you,
**{{PropertyName}} Management**`
    },
    lostfound: {
      subject: 'Lost & Found – {{PropertyName}}',
      body: `Hello {{GuestName}},

We hope you arrived safely after your stay at {{PropertyName}}.

Our team found an item that may belong to you:
- Item description: {{ItemDescription}}

Please contact us so we can arrange collection or delivery.

---

### Confirm via WhatsApp:
https://wa.me/{{PropertyWhatsApp}}

Kind regards,
**{{PropertyName}} Front Desk**`
    },
    latecheckout: {
      subject: 'Need a late checkout or stay extension?',
      body: `Hello {{GuestName}},

We hope you're enjoying your stay at {{PropertyName}}.

If you'd like:
- 🔴 Late checkout
- 🟢 Extend your stay
- 🟣 Upgrade your room

Please contact us in advance so we can assist you.

---

### Message us on WhatsApp:
https://wa.me/{{PropertyWhatsApp}}

We're happy to help.

Best regards,  
**{{PropertyName}} Front Desk**`
    },
    houserules: {
      subject: 'House rules & policies – {{PropertyName}}',
      body: `Dear {{GuestName}},

To ensure a safe and comfortable stay at {{PropertyName}}, please review our house rules:

- Check-out time: {{CheckOutTime}}
- Quiet hours: {{QuietHours}}
- Smoking policy: {{SmokingPolicy}}
- Visitor policy: {{VisitorPolicy}}

If you need clarification or assistance:

WhatsApp reception:
https://wa.me/{{PropertyWhatsApp}}

Thank you for your cooperation.

Sincerely,
**{{PropertyName}} Management**`
    },
    wemissyou: {
      subject: 'We miss you at {{PropertyName}} ❤️',
      body: `Hello {{GuestName}},  

It's been a while since your last stay at {{PropertyName}}, and we just wanted to say — we miss you 😊  

We're always improving to make your next stay even better.  
Whenever you're ready, we'd love to host you again.  

---

**Chat with us anytime:**  
https://wa.me/{{PropertyWhatsApp}}  

Warm wishes,  
**{{PropertyName}}**`
    },
    review: {
      subject: 'Share your experience at {{PropertyName}}',
      body: `Dear {{GuestName}},

We hope you enjoyed your stay at {{PropertyName}}.  
Your review helps other guests and supports our team.

Please share your experience on our social platforms:
- Google
- Instagram
- Facebook

---

**Need the review links? Message us:**  
https://wa.me/{{PropertyWhatsApp}}

Thank you for your support!

Kind regards,  
**{{PropertyName}} Management**`
    },
    referral: {
      subject: 'Earn discount points by recommending us!',
      body: `Hello {{GuestName}},

Thank you for staying with {{PropertyName}}!  

You can earn **discount points** by recommending friends or colleagues to us.

## How it works:
- Recommend a guest
- They mention your name when booking
- You earn points for your next stay

---

Recommend or ask details on WhatsApp:  
https://wa.me/{{PropertyWhatsApp}}

Best regards,  
**{{PropertyName}} Team**`
    },
    rebook: {
      subject: 'We\'d love to host you again at {{PropertyName}}',
      body: `Dear {{GuestName}},  

It was a pleasure hosting you at {{PropertyName}} 😊  
If you're planning another visit, we'd be happy to welcome you back.  

Booking directly with us gives you:  
- Better availability  
- Priority support  
- Returning-guest offers  

---

WhatsApp us to book or ask anything:  
https://wa.me/{{PropertyWhatsApp}}  

Warm regards,  
**{{PropertyName}} Management**`
    },
    team_recommendations: {
      subject: 'Accommodation & Logistics Support for {{TeamName}}',
      body: `Dear {{TeamManager}},

Bookello provides complete accommodation solutions for teams visiting {{City}}.

Options include:

- Private luxury residences
- Secure serviced apartments
- Team transport coordination
- Long-stay discounts

We ensure privacy, security, and comfort for athletes and staff.

We welcome partnership discussions.`
    },
    fan_club_recommendations: {
      subject: 'Travel & Stay Solutions for {{TeamOrEventName}} Fans',
      body: `Dear {{FanClubName}},

Are your members traveling for {{MatchOrEvent}}?

Bookello offers:

- Group apartments
- Budget rooms for supporters
- Shuttle transport
- City tour packages

We can organize complete fan travel coordination.

Contact us for group packages.`
    },
    formal_cooperation: {
      subject: 'Proposal for Delegate Accommodation Partnership',
      body: `Dear {{OrganizationName}},

We are pleased to propose a collaboration with your organization to support accommodation and logistics for your delegates, staff, and international visitors in {{CityOrCountry}}.

Bookello provides:

- Affordable housing solutions
- Executive apartments
- Long-stay corporate rentals
- Airport transfers
- Event travel coordination

We offer negotiated corporate rates and dedicated support teams.

We would be honored to discuss structured cooperation for upcoming programs and events.

Kind regards,
Bookello Management`
    },
    house_compound: {
      subject: 'Important House & Compound Guidelines – {{PropertyName}}',
      body: `Dear {{TenantName}},

To ensure a peaceful and well-maintained living environment, please take note of the following guidelines:

🏠 Inside the House:
- No structural modifications without approval
- Report maintenance issues immediately
- Avoid water leakage and electricity misuse

🌿 Compound Rules:
- Respect quiet hours (10PM – 6AM)
- Keep shared spaces clean
- No unauthorized subletting
- Parking only in designated areas

These guidelines help protect your comfort and the property's value.

Thank you for your cooperation.

Management Team
Check-In by Bookello`
    },
    tenant_referral: {
      subject: 'Earn Rewards – Refer a Tenant & Get Paid',
      body: `Dear {{TenantName}},

We value trusted tenants like you.

Refer a friend, colleague, or family member to rent with us and receive:

💵 {{ReferralRewardAmount}} once the lease is signed.

Conditions:
- Referral must sign minimum {{LeasePeriod}}
- Reward paid after first month rent

To refer someone, simply reply with their name and contact.

Thank you for being part of our community.`
    },
    delegates_invite: {
      subject: 'Attending {{EventName}} in {{City}}? Secure Your Stay',
      body: `Dear {{Name}},

If you are attending {{EventName}} in {{City}}, Bookello provides:

🏨 Verified hotels & serviced apartments
🚗 Airport transfers
🌍 Tours & local experiences

We support delegates, speakers, NGOs, and international organizations with affordable to executive accommodation options.

Explore available options:
👉 marketplace.bookello.life

Secure your stay early to avoid last-minute price increases.

Best regards,
Bookello Team`
    },
    rent_reminder: {
      subject: 'Friendly Reminder – Rent Due {{DueDate}}',
      body: `Dear {{TenantName}},

This is a reminder that your monthly rent for {{PropertyName}} is due on:

📅 {{DueDate}}
💰 {{Amount}}

Bank Details:
{{BankName}}
{{AccountNumber}}

Timely payment helps us maintain high service standards.

If already paid, kindly ignore this message.

Thank you.`
    }
  }

  if (templates[emailForm.value.template]) {
    emailForm.value.subject = templates[emailForm.value.template].subject
    emailForm.value.body = templates[emailForm.value.template].body
  }
}

const insertVariable = (variable) => {
  const textarea = document.querySelector('textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  emailForm.value.body = emailForm.value.body.substring(0, start) + variable + emailForm.value.body.substring(end)
  
  // Focus back on textarea
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + variable.length, start + variable.length)
  })
}

const toggleAllGuests = () => {
  allGuestsSelected.value = !allGuestsSelected.value
  if (allGuestsSelected.value) {
    emailForm.value.manualRecipients = availableGuests.value.map(g => g.id)
  } else {
    emailForm.value.manualRecipients = []
  }
}

const formatPreview = (text) => {
  return text
    .replace(/\n/g, '<br>')
    .replace(/{{GuestName}}/g, '<span class="bg-yellow-100 px-1 rounded">John Doe</span>')
    .replace(/{{PropertyName}}/g, '<span class="bg-blue-100 px-1 rounded">Example Hotel</span>')
    .replace(/{{PropertyWhatsApp}}/g, '<span class="bg-green-100 px-1 rounded">+1234567890</span>')
}

const getRecipients = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const currentHotelId = urlParams.get('hotelId')
  
  let guestsQuery = query(
    collection(db, 'Checkins'),
    where('hotelId', '==', currentHotelId)
  )

  const snapshot = await getDocs(guestsQuery)
  const allGuests = snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  }))

  // Fix: Wrap case blocks with curly braces to avoid lexical declarations
  let filteredGuests = []
  
  switch (emailForm.value.recipientType) {
    case 'checkedin': {
      filteredGuests = allGuests.filter(g => g.status === 'approved' || g.status === 'pending')
      break
    }
    case 'current': {
      const today = new Date()
      filteredGuests = allGuests.filter(g => {
        const checkOut = new Date(g.checkOutDate)
        return checkOut >= today
      })
      break
    }
    case 'past': {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      filteredGuests = allGuests.filter(g => {
        const checkOut = new Date(g.checkOutDate)
        return checkOut < thirtyDaysAgo
      })
      break
    }
    case 'daterange': {
      if (emailForm.value.dateRange.start && emailForm.value.dateRange.end) {
        const startDate = new Date(emailForm.value.dateRange.start)
        const endDate = new Date(emailForm.value.dateRange.end)
        filteredGuests = allGuests.filter(g => {
          const checkIn = new Date(g.checkInDate)
          return checkIn >= startDate && checkIn <= endDate
        })
      } else {
        filteredGuests = allGuests
      }
      break
    }
    case 'manual': {
      filteredGuests = allGuests.filter(g => emailForm.value.manualRecipients.includes(g.id))
      break
    } case 'custom': {
      return []
    }
    default: {
      filteredGuests = allGuests
    }
  }
  
  return filteredGuests
}

const sendBulkEmail = async () => {
  try {
    sendingEmail.value = true
    
    // Get current property details
    const urlParams = new URLSearchParams(window.location.search)
    const currentHotelId = urlParams.get('hotelId')
    const hotelDoc = await getDoc(doc(db, 'Hotels', currentHotelId))
    const hotelData = hotelDoc.data()
    
    let recipients = []
    let customEmailAddresses = []
    
    // Get recipients based on selection type
    if (emailForm.value.recipientType === 'custom') {
      // Use custom email addresses
      customEmailAddresses = parsedCustomEmails.value
      
      if (customEmailAddresses.length === 0) {
        alert('Please enter at least one valid email address')
        return
      }
      
      // Convert custom emails to recipient format
      recipients = customEmailAddresses.map(email => ({
        email: email,
        name: 'Recipient',
        checkinId: null
      }))
    } else {
      // Get guest recipients
      const guestRecipients = await getRecipients()
      
      if (guestRecipients.length === 0) {
        alert('No recipients found matching your criteria')
        return
      }
      
      recipients = guestRecipients.map(r => ({
        email: r.email,
        name: r.guestName,
        checkinId: r.id
      }))
    }
    
    // Determine which Firebase function to call
    let totalSent = 0;
    
    if (['new_tenant_welcome', 'utilities_hygiene', 'move_out_instructions'].includes(emailForm.value.template)) {
      if (customEmailAddresses.length > 0) {
        alert('Custom email addresses cannot be used with automated templates (needs valid checkin properties). Please select individual checked-in guests.');
        sendingEmail.value = false;
        return;
      }
      
      let functionName = '';
      if (emailForm.value.template === 'new_tenant_welcome') functionName = 'sendNewTenantWelcomeEmail';
      else if (emailForm.value.template === 'utilities_hygiene') functionName = 'sendUtilitiesAndHygieneInstructions';
      else if (emailForm.value.template === 'move_out_instructions') functionName = 'sendMoveOutInstructions';
      
      const specificEmailFunction = httpsCallable(functions, functionName);
      
      for (const r of recipients) {
        if (!r.checkinId) continue;
        await specificEmailFunction({
          checkinId: r.checkinId,
          guestEmail: r.email,
          guestName: r.name,
          hotelName: hotelData.name
        });
        totalSent++;
      }
      
      await saveEmailHistory({
        successCount: totalSent,
        failureCount: recipients.length - totalSent,
        total: recipients.length
      }, totalSent);
      
      alert(`Automated emails targeted to ${totalSent} recipients successfully`);
    } else {
      // Call Firebase Function for bulk email
      const sendEmailFunction = httpsCallable(functions, 'sendCustomBulkEmail')
      const result = await sendEmailFunction({
        hotelId: currentHotelId,
        propertyName: hotelData.name,
        propertyWhatsApp: hotelData.whatsappNumber || '',
        recipients: recipients,
        customEmailAddresses: customEmailAddresses, // Send custom emails separately
        subject: emailForm.value.subject,
        body: emailForm.value.body,
        template: emailForm.value.template
      })
      
      totalSent = result.data.total;
      // Save to email history
      await saveEmailHistory(result.data, recipients.length + customEmailAddresses.length)
      
      alert(`Emails sent successfully to ${totalSent} recipients`)
    }
    showNewEmailModal.value = false
    
    // Reset form
    emailForm.value = {
      recipientType: 'checkedin',
      dateRange: { start: '', end: '' },
      manualRecipients: [],
      customEmails: '', // Reset custom emails
      subject: '',
      template: 'custom',
      body: '',
      propertyName: hotelData.name,
      propertyWhatsApp: hotelData.whatsappNumber || ''
    }
    
    // Refresh email history
    await fetchEmailHistory()
    
  } catch (error) {
    console.error('Error sending emails:', error)
    alert('Failed to send emails: ' + error.message)
  } finally {
    sendingEmail.value = false
  }
}


const saveEmailHistory = async (result, recipientCount) => {
  const urlParams = new URLSearchParams(window.location.search)
  const currentHotelId = urlParams.get('hotelId')
  
  await addDoc(collection(db, 'EmailHistory'), {
    hotelId: currentHotelId,
    subject: emailForm.value.subject,
    body: emailForm.value.body,
    template: emailForm.value.template,
    recipientCount,
    recipientType: emailForm.value.recipientType,
    customEmailsCount: parsedCustomEmails.value.length,
    sentAt: Timestamp.now(),
    sentBy: auth.currentUser.uid,
    sentByEmail: auth.currentUser.email,
    status: 'sent',
    messageId: result.messageId
  })
}

const fetchEmailHistory = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const currentHotelId = urlParams.get('hotelId')
  
  const historyQuery = query(
    collection(db, 'EmailHistory'),
    where('hotelId', '==', currentHotelId),
    orderBy('sentAt', 'desc'),
    limit(50)
  )
  
  const snapshot = await getDocs(historyQuery)
  emailHistory.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

const viewEmailDetails = (email) => {
  selectedEmail.value = email
}

const resendEmail = async (emailId) => {
  if (!confirm('Resend this email?')) return
  
  try {
    // Actually use the emailData variable
    const emailDoc = await getDoc(doc(db, 'EmailHistory', emailId))
    const emailData = emailDoc.data()
    
    // Get current property details for resending
    const urlParams = new URLSearchParams(window.location.search)
    const currentHotelId = urlParams.get('hotelId')
    const hotelDoc = await getDoc(doc(db, 'Hotels', currentHotelId))
    const hotelData = hotelDoc.data()
    
    // Get recipients from EmailLogs
    const logsQuery = query(
      collection(db, 'EmailLogs'),
      where('emailHistoryId', '==', emailId)
    )
    
    const logsSnapshot = await getDocs(logsQuery)
    const recipients = logsSnapshot.docs.map(doc => ({
      email: doc.data().recipientEmail,
      name: doc.data().recipientName || 'Guest',
      checkinId: doc.data().checkinId
    }))
    
    if (recipients.length === 0) {
      alert('No recipients found for this email')
      return
    }
    
    // Call Firebase Function to resend emails
    const resendFunction = httpsCallable(functions, 'resendEmail')
    const result = await resendFunction({ 
      emailId,
      hotelId: currentHotelId,
      propertyName: hotelData.name,
      propertyWhatsApp: hotelData.whatsappNumber || '',
      recipients,
      subject: emailData.subject,
      body: emailData.body,
      template: emailData.template || 'custom'
    })
    
    alert(`Email resent successfully to ${result.data.resentCount} recipients`)
    await fetchEmailHistory()
  } catch (error) {
    console.error('Error resending email:', error)
    alert('Failed to resend email: ' + error.message)
  }
}


const testEmail = async () => {
  // Send test email to admin
  try {
    sendingEmail.value = true
    const currentUser = auth.currentUser
    
    const sendTestFunction = httpsCallable(functions, 'sendTestEmail')
    await sendTestFunction({
      to: currentUser.email,
      subject: `[TEST] ${emailForm.value.subject}`,
      body: emailForm.value.body,
      template: emailForm.value.template
    })
    
    alert('Test email sent to ' + currentUser.email)
  } catch (error) {
    console.error('Error sending test email:', error)
    alert('Failed to send test email: ' + error.message)
  } finally {
    sendingEmail.value = false
  }
}

// Load available guests for manual selection
const loadAvailableGuests = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const currentHotelId = urlParams.get('hotelId')
  
  // Simple query without orderBy
  const guestsQuery = query(
    collection(db, 'Checkins'),
    where('hotelId', '==', currentHotelId)
  )
  
  const snapshot = await getDocs(guestsQuery)
  
  // Get all guests and sort in JavaScript
  const allGuests = snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  }))
  
  // Sort by checkInDate in JavaScript
  availableGuests.value = allGuests.sort((a, b) => {
    const dateA = new Date(a.checkInDate || 0)
    const dateB = new Date(b.checkInDate || 0)
    return dateB - dateA // Newest first
  })
}

// Update onMounted to load email history
onMounted(async () => {
  loading.value = true
  
  const urlParams = new URLSearchParams(window.location.search)
  const currentHotelId = urlParams.get('hotelId')
  
  try {
    const [guestsSnapshot, hotelsSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'Checkins'), where('hotelId', '==', currentHotelId))),
      getDocs(collection(db, 'Hotels')),
      fetchEmailHistory(),
      loadAvailableGuests(),
      fetchStaff()
    ])

    guests.value = guestsSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      checkInDate: doc.data().checkInDate?.toDate?.() || doc.data().checkInDate,
      checkOutDate: doc.data().checkOutDate?.toDate?.() || doc.data().checkOutDate
    }))

    hotels.value = hotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
  } catch (error) {
    console.error("Error loading data:", error)
  } finally {
    loading.value = false
  }
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
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const statusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getFileType = (url) => {
  if (!url) return null
  const lowercaseUrl = url.toLowerCase()
  if (lowercaseUrl.includes('.pdf') || lowercaseUrl.includes('pdf')) {
    return 'pdf'
  }
  if (lowercaseUrl.includes('.jpg') || lowercaseUrl.includes('.jpeg') || 
      lowercaseUrl.includes('.png') || lowercaseUrl.includes('.gif') || 
      lowercaseUrl.includes('.webp') || lowercaseUrl.includes('image')) {
    return 'image'
  }
  if (url.includes('cloudinary.com')) {
    if (url.includes('/image/') || url.includes('f_auto') || url.includes('q_auto')) {
      return 'image'
    }
    if (url.includes('/raw/') || url.includes('.pdf')) {
      return 'pdf'
    }
  }
  return 'image'
}

const formatDocumentUrl = (url, fileType) => {
  if (fileType === 'image') {
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto,w_1200/')
    }
    return url
  } else {
    if (url.includes('cloudinary.com')) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
    }
    return url
  }
}

const viewDocument = (url, type, guestId) => {
  if (!url) {
    alert('Document not available')
    return
  }
  
  currentGuestId.value = guestId
  const fileType = getFileType(url)
  
  activeDocument.value = {
    type,
    url: formatDocumentUrl(url, fileType),
    originalUrl: url,
    title: type === 'passport' ? 'Passport/ID Document' : 'Reservation Confirmation',
    fileType
  }
}

const downloadDocument = () => {
  const downloadUrl = activeDocument.value.originalUrl || activeDocument.value.url
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = `${activeDocument.value.type}_document`
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const confirmDeleteDocument = () => {
  showDeleteDocumentModal.value = true
}

const deleteDocument = async () => {
  try {
    deleteDocumentLoading.value = true
    
    const guestRef = doc(db, 'Checkins', currentGuestId.value)
    const updateData = {}
    
    if (activeDocument.value.type === 'passport') {
      updateData.passportURL = null
    } else {
      updateData.reservationURL = null
    }
    
    await updateDoc(guestRef, updateData)
    await refreshGuests()
    
    showDeleteDocumentModal.value = false
    activeDocument.value.url = null
    
    alert('Document deleted successfully')
  } catch (error) {
    console.error('Error deleting document:', error)
    alert('Error deleting document: ' + error.message)
  } finally {
    deleteDocumentLoading.value = false
  }
}

const approveGuest = async (guestId) => {
  try {
    await updateDoc(doc(db, 'Checkins', guestId), {
      status: 'approved',
      processedAt: Timestamp.now(),
      processedBy: auth.currentUser.uid
    })
    refreshGuests()
  } catch (error) {
    console.error("Error approving guest:", error)
  }
}

const rejectGuest = async (guestId) => {
  try {
    await updateDoc(doc(db, 'Checkins', guestId), {
      status: 'rejected',
      processedAt: Timestamp.now(),
      processedBy: auth.currentUser.uid
    })
    refreshGuests()
  } catch (error) {
    console.error("Error rejecting guest:", error)
  }
}

const refreshGuests = async () => {
  // Get hotelId from URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const currentHotelId = urlParams.get('hotelId')
  
  // Only load checkins for the specific hotel
  const checkinsQuery = query(
    collection(db, 'Checkins'), 
    where('hotelId', '==', currentHotelId)
  )
  
  const guestsSnapshot = await getDocs(checkinsQuery)
  
  guests.value = guestsSnapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data(),
    checkInDate: doc.data().checkInDate?.toDate?.() || doc.data().checkInDate,
    checkOutDate: doc.data().checkOutDate?.toDate?.() || doc.data().checkOutDate
  }))
}

const createStaff = async () => {
  const currentUser = auth.currentUser
  if (!currentUser) {
    alert('Please log in to create staff')
    return
  }

  try {
    loading.value = true
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      staffForm.value.email,
      staffForm.value.password
    )
    const user = userCredential.user
    
    // Get the current hotel ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const currentHotelId = urlParams.get('hotelId')
    
    await setDoc(doc(db, 'staffs', user.uid), {
      uid: user.uid,
      email: staffForm.value.email,
      role: staffForm.value.role,
      hotelIds: [currentHotelId],
      createdAt: Timestamp.now(),
      createdBy: currentUser.uid, 
      createdByEmail: currentUser.email
    })
    
    alert('Staff member created successfully!')
    showUserModal.value = false
    staffForm.value = {
      email: '',
      password: '',
      role: 'reception'
    }
    await fetchStaff()
  } catch (error) {
    console.error("Error creating staff:", error)
    alert('Error creating staff: ' + error.message)
  } finally {
    loading.value = false
  }
}


const fetchStaff = async () => {
  try {
    // Get hotelId from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const currentHotelId = urlParams.get('hotelId')
    
    if (!currentHotelId) {
      console.log('No hotelId found in URL')
      return
    }

    // Show ALL staff for the current hotel (remove createdBy filter)
    const staffQuery = query(
      collection(db, 'staffs'),
      where('hotelIds', 'array-contains', currentHotelId)
    )
    
    const snapshot = await getDocs(staffQuery)
    staffList.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
  } catch (error) {
    console.error("Error loading staff:", error)
  }
}

const getHotelName = (hotelIds) => {
  
  if (Array.isArray(hotelIds)) {
    return hotelIds.map(id => {
      const hotel = hotels.value.find(h => h.id === id)
      return hotel ? hotel.name : 'Unknown Hotel'
    }).join(', ')
  }
  
  const hotel = hotels.value.find(h => h.id === hotelIds)
  return hotel ? hotel.name : 'Unknown Hotel'
}

const confirmDeleteStaff = (staffId) => {
selectedStaffId.value = staffId
showDeleteModal.value = true
}

const deleteStaff = async () => {
try {
deleteLoading.value = true
const staffDoc = await getDoc(doc(db, 'staffs', selectedStaffId.value))

if (!staffDoc.exists()) {
  throw new Error('Staff record not found')
}

const staffData = staffDoc.data()

if (staffData.uid) {
  try {
    await deleteUser(await getAuth().getUser(staffData.uid))
  } catch (authError) {
    console.log("Auth user might be already deleted:", authError)
  }
}

await deleteDoc(doc(db, 'staffs', selectedStaffId.value))

showDeleteModal.value = false
await fetchStaff()
alert('Staff member deleted successfully')
} catch (error) {
console.error('Error deleting staff:', error)
alert('Error deleting staff: ' + error.message)
} finally {
deleteLoading.value = false
}
}


const downloadReport = () => {
  // Create CSV headers
  const headers = '"Guest Name","Check-In Date","Booking Source","Hotel","Status"';
  
  // Create CSV rows from filtered and sorted guests
  const rows = filteredAndSortedGuests.value.map((guest) => {
    return `"${guest.guestName}","${formatDate(guest.checkInDate)}","${guest.source}","${guest.hotel}","${guest.status}"`;
  }).join('\n');

  // Combine headers and rows
  const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;

  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'guest_checkins_report.csv');
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const logout = async () => {
try {
await signOut(auth)
router.push('/')
} catch (error) {
console.error('Logout error:', error)
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
};

const clearFilters = () => {
  bookingSource.value = 'all'
  statusFilter.value = 'all'
  checkoutDateFilter.value = ''
  searchQuery.value = ''
  currentPage.value = 1
}

onMounted(async () => {
  loading.value = true
  
  // Get hotelId from URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const currentHotelId = urlParams.get('hotelId')
  
  try {
    // Only load checkins for the specific hotel
    const checkinsQuery = query(
      collection(db, 'Checkins'), 
      where('hotelId', '==', currentHotelId) // This filters by hotelId
    )
    
    const [guestsSnapshot, hotelsSnapshot] = await Promise.all([
      getDocs(checkinsQuery), // Use the filtered query
      getDocs(collection(db, 'Hotels'))
    ]) 

    guests.value = guestsSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      checkInDate: doc.data().checkInDate?.toDate?.() || doc.data().checkInDate,
      checkOutDate: doc.data().checkOutDate?.toDate?.() || doc.data().checkOutDate
    }))

    hotels.value = hotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    await fetchStaff() 
  } catch (error) {
    console.error("Error loading data:", error)
  } finally {
    loading.value = false
  }
})


</script>

<style scoped>
 .router-link-active { @apply bg-blue-700; } /* Custom scrollbar for document viewer */ ::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: #555; } </style>