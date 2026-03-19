<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3H6C4.89543 3 4 3.89543 4 5V21C4 22.1046 4.89543 23 6 23H18C19.1046 23 20 22.1046 20 21V5C20 3.89543 19.1046 3 18 3H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M8 7H16V17C16 18.1046 15.1046 19 14 19H10C8.89543 19 8 18.1046 8 17V7Z" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.5"/>
                <path d="M14 3H10C9.44772 3 9 3.44772 9 4V6C9 6.55228 9.44772 7 10 7H14C14.5523 7 15 6.55228 15 6V4C15 3.44772 14.5523 3 14 3Z" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.5"/>
                <line x1="10" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p class="text-sm text-gray-500">Bookello Property Management</p>
             <p class="text-xs text-gray-400">Role: {{ currentAdmin.role || 'Loading...' }} | Permissions: {{ (currentAdmin.permissions || []).join(', ') }}</p>            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Create Admin Button (Only for Super Admin) -->
            <button 
              v-if="currentAdmin.role === 'admin'"
              @click="showCreateAdminModal = true" 
              class="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span>Create Admin</span>
            </button>
            
            <button 
              @click="signOut" 
              class="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
            >
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
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-xl shadow-inner">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Properties</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalProperties }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-xl shadow-inner">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.activeProperties }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-xl shadow-inner">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending Applications</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.pendingApplications }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div class="flex items-center">
            <div class="p-3 bg-red-100 rounded-xl shadow-inner">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Suspended/Expired</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.expiredProperties }}</p>
            </div>
          </div>
        </div>

        <!-- Revenue Card - Only show for admin -->
        <div 
          v-if="currentAdmin.role === 'admin'"
          class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
        >
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-xl shadow-inner">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900">${{ formatCurrency(stats.totalRevenue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Analytics Section - Only show for admin -->
      <div 
        v-if="currentAdmin.role === 'admin'"
        class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 mb-8"
      >
        <div class="px-6 py-5 border-b border-gray-200/60">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold text-gray-900">Revenue Analytics</h3>
            <div class="flex items-center space-x-4">
              <select 
                v-model="revenuePeriod" 
                @change="loadRevenueData"
                class="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <select 
                v-model="selectedYear" 
                @change="loadRevenueData"
                class="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <!-- Revenue Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border border-blue-200/50">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-blue-600">This {{ revenuePeriod === 'monthly' ? 'Month' : 'Year' }}</p>
                  <p class="text-2xl font-bold text-blue-900">${{ formatCurrency(revenueStats.currentPeriod) }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
              </div>
              <div class="mt-2 flex items-center text-sm" :class="revenueStats.growth >= 0 ? 'text-green-600' : 'text-red-600'">
                <svg class="w-4 h-4 mr-1" :class="revenueStats.growth >= 0 ? 'rotate-0' : 'rotate-180'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                </svg>
                <span>{{ Math.abs(revenueStats.growth) }}% vs last {{ revenuePeriod === 'monthly' ? 'month' : 'year' }}</span>
              </div>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-2xl border border-green-200/50">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-green-600">Total Payments</p>
                  <p class="text-2xl font-bold text-green-900">{{ revenueStats.totalPayments }}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <p class="text-sm text-green-700 mt-2">Successful transactions</p>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-2xl border border-purple-200/50">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-purple-600">Avg. Payment</p>
                  <p class="text-2xl font-bold text-purple-900">${{ formatCurrency(revenueStats.averagePayment) }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
              </div>
              <p class="text-sm text-purple-700 mt-2">Per subscription</p>
            </div>

            <div class="bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-2xl border border-orange-200/50">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-orange-600">Active Subscriptions</p>
                  <p class="text-2xl font-bold text-orange-900">{{ revenueStats.activeSubscriptions }}</p>
                </div>
                <div class="p-3 bg-orange-100 rounded-xl">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </div>
              </div>
              <p class="text-sm text-orange-700 mt-2">Generating revenue</p>
            </div>
          </div>

          <!-- Recent Payments Table -->
          <div class="mt-8">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h4>
            <div class="overflow-hidden rounded-xl border border-gray-200/60">
              <table class="min-w-full divide-y divide-gray-200/60">
                <thead class="bg-gray-50/80">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plan</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200/60">
                  <tr 
                    v-for="payment in recentPayments" 
                    :key="payment.id"
                    class="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">{{ payment.propertyName }}</div>
                      <div class="text-sm text-gray-500">{{ payment.ownerName }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" 
                            :class="getPlanClass(payment.plan)">
                        {{ payment.plan }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm font-semibold text-gray-900">${{ formatCurrency(payment.amount) }}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                      {{ formatDate(payment.paymentDate) }}
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Empty State -->
              <div v-if="recentPayments.length === 0" class="text-center py-8">
                <div class="max-w-md mx-auto">
                  <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                  <p class="text-gray-500">Payment records will appear here once properties start subscribing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div 
  v-if="currentAdmin.role === 'admin'"
  class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 mb-8"
>
  <div class="px-6 py-5 border-b border-gray-200/60">
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-semibold text-gray-900">Sub-Admins Management</h3>
    
    </div>
  </div>
  
  <div class="p-6">
    <!-- Sub-Admins Table -->
    <div class="overflow-hidden rounded-xl border border-gray-200/60">
      <table class="min-w-full divide-y divide-gray-200/60">
        <thead class="bg-gray-50/80">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admin Details</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role & Permissions</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200/60">
          <tr 
            v-for="admin in subAdmins" 
            :key="admin.id"
            class="hover:bg-gray-50/80 transition-colors duration-150"
          >
            <td class="px-6 py-4">
              <div class="text-sm font-semibold text-gray-900">{{ admin.name }}</div>
              <div class="text-sm text-gray-500">{{ admin.email }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="space-y-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ admin.role }}
                </span>
                <div class="text-xs text-gray-500">
                  Permissions: {{ (admin.permissions || []).join(', ') }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                    :class="admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ admin.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(admin.createdAt) }}
            </td>
            <td class="px-6 py-4">
              <div class="flex space-x-2">
                <button 
                  v-if="admin.isActive"
                  @click="deactivateSubAdmin(admin.id)"
                  class="flex items-center space-x-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-all duration-200 px-3 py-2 border border-yellow-200 text-sm"
                  title="Deactivate Sub-Admin"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span>Deactivate</span>
                </button>
                <button 
                  v-else
                  @click="activateSubAdmin(admin.id)"
                  class="flex items-center space-x-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 px-3 py-2 border border-green-200 text-sm"
                  title="Activate Sub-Admin"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Activate</span>
                </button>
                <button 
                  @click="deleteSubAdmin(admin)"
                  class="flex items-center space-x-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 px-3 py-2 border border-red-200 text-sm"
                  title="Delete Sub-Admin"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State for Sub-Admins -->
      <div v-if="subAdmins.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Sub-Admins</h3>
          <p class="text-gray-500">Create your first sub-admin to help manage properties.</p>
        </div>
      </div>
    </div>
  </div>
</div>

      <!-- Main Dashboard Card -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden mb-8">
        <!-- Tabs Navigation -->
        <div class="border-b border-gray-200/60">
          <nav class="flex overflow-x-auto">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex items-center space-x-2 py-4 px-6 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span>{{ tab.name }}</span>
              <span class="bg-gray-100 text-gray-900 py-1 px-2.5 rounded-full text-xs font-semibold min-w-[24px]">
                {{ getTabCount(tab.id) }}
              </span>
            </button>
          </nav>
        </div>
   
        <!-- Pending Applications Tab Content -->
        <div v-if="activeTab === 'pending'" class="p-6">
          <!-- Search and Filters -->
          <div class="mb-6 flex flex-wrap gap-4 items-center">
            <div class="flex-1 min-w-[300px]">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <input 
                  v-model="pendingSearchQuery"
                  type="text" 
                  placeholder="Search hotels, owners, locations..."
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
              </div>
            </div>
          </div>

          <!-- Pending Applications Table -->
          <div class="overflow-hidden rounded-xl border border-gray-200/60">
            <table class="min-w-full divide-y divide-gray-200/60">
              <thead class="bg-gray-50/80">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hotel & Owner</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Documents</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applied</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200/60">
                <tr 
                  v-for="app in filteredPendingApplications" 
                  :key="app.id"
                  class="hover:bg-gray-50/80 transition-colors duration-150"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                      </div>
                      <div>
                        <div class="text-sm font-semibold text-gray-900">{{ app.hotelName }}</div>
                        <div class="text-sm text-gray-500">{{ app.ownerName }}</div>
                        <div class="text-sm text-gray-500">{{ app.ownerEmail }}</div>
                        <div class="text-sm text-gray-500">{{ app.ownerPhone }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    <div class="space-y-1">
                      <div><strong class="text-gray-700">Location:</strong> {{ app.location }}</div>
                      <div><strong class="text-gray-700">Rooms:</strong> {{ app.roomCount }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="space-y-2">
                    
                      <button 
                        @click="previewDocument(app.documents?.tin, 'TIN Certificate')" 
                        class="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm transition-colors duration-200 p-2 hover:bg-blue-50 rounded-lg w-full"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        <span>TIN Certificate</span>
                      </button>
                      <button 
                        @click="previewDocument(app.documents?.id, 'Owner ID')" 
                        class="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm transition-colors duration-200 p-2 hover:bg-blue-50 rounded-lg w-full"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        <span>Owner ID</span>
                      </button>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ formatDate(app.createdAt) }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col space-y-3">
                      <button 
                        @click="approveApplication(app.id)" 
                        class="group flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                      >
                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span class="font-medium">Approve</span>
                      </button>
                      <button 
                        @click="rejectApplication(app.id)" 
                        class="group flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
                      >
                        <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                        <span class="font-medium">Reject</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State for Pending Applications -->
            <div v-if="filteredPendingApplications.length === 0" class="text-center py-12">
              <div class="max-w-md mx-auto">
                <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No pending applications</h3>
                <p class="text-gray-500">All registration requests have been processed.</p>
              </div>
            </div>
          </div>
        </div>
          

        <!-- Add Invoices Tab Content -->
<div v-if="activeTab === 'invoices'" class="p-6">
  <div class="mb-6 flex flex-wrap gap-4 items-center">
    <div class="flex-1 min-w-[300px]">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <input 
          v-model="invoiceSearchQuery"
          type="text" 
          placeholder="Search invoices, properties..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        >
      </div>
    </div>
    <select 
      v-model="invoiceStatusFilter"
      class="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
    >
      <option value="all">All Status</option>
      <option value="pending">Pending</option>
      <option value="paid">Paid</option>
      <option value="overdue">Overdue</option>
      <option value="cancelled">Cancelled</option>
    </select>
  </div>

  <!-- Invoices Table -->
    <div class="overflow-hidden rounded-xl border border-gray-200/60">
    <table class="min-w-full divide-y divide-gray-200/60">
      <thead class="bg-gray-50/80">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice Details</th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Receipt</th> <!-- NEW COLUMN -->
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200/60">
        <tr 
          v-for="invoice in filteredInvoices" 
          :key="invoice.id"
          class="hover:bg-gray-50/80 transition-colors duration-150"
        >
          <td class="px-6 py-4">
            <div class="text-sm font-semibold text-gray-900">{{ invoice.invoiceNumber }}</div>
            <div class="text-sm text-gray-500">{{ formatDate(invoice.createdAt) }}</div>
            <div v-if="invoice.isTrialEnd" class="text-xs text-blue-600 font-medium mt-1">
              Trial End Invoice
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-900">{{ getPropertyName(invoice.hotelId) }}</div>
            <div class="text-sm text-gray-500">{{ getPropertyOwner(invoice.hotelId) }}</div>
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
          <!-- RECEIPT COLUMN -->
          <td class="px-6 py-4">
            <div v-if="invoice.receiptUrl">
              <button @click="viewReceipt(invoice)" 
                      class="text-green-600 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-200 border border-green-200 text-sm flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span>View Receipt</span>
              </button>
              <div v-if="invoice.receiptUploadedAt" class="text-xs text-gray-500 mt-1">
                Uploaded: {{ formatDate(invoice.receiptUploadedAt) }}
              </div>
            </div>
            <div v-else-if="invoice.status === 'pending_verification'" class="text-yellow-600 text-sm">
              Waiting for receipt
            </div>
            <div v-else class="text-gray-400 text-sm">
              No receipt
            </div>
          </td>
          <!-- ACTIONS COLUMN -->
          <td class="px-6 py-4">
            <div class="flex flex-col space-y-2 min-w-[160px]">
              <!-- Mark as Paid Button -->
              <button @click="markAsPaid(invoice)" 
                      v-if="invoice.status === 'pending' || invoice.status === 'overdue' || invoice.status === 'pending_verification'"
                      class="text-green-600 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-200 border border-green-200 text-sm flex items-center space-x-2 justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Mark Paid</span>
              </button>
              
              <!-- Send Reminder -->
              <button @click="sendReminder(invoice)"
                      v-if="invoice.status === 'pending' || invoice.status === 'overdue'"
                      class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200 border border-blue-200 text-sm flex items-center space-x-2 justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <span>Send Reminder</span>
              </button>
              
              <!-- Download -->
              <button @click="downloadAdminInvoice(invoice)"
                      class="text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all duration-200 border border-gray-200 text-sm flex items-center space-x-2 justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span>Download</span>
              </button>
              
              <!-- Delete -->
              <button @click="deleteInvoice(invoice)"
                      class="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 border border-red-200 text-sm flex items-center space-x-2 justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</div>


<div v-if="showReceiptViewer" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
  <div class="bg-white rounded-2xl w-full max-w-5xl my-8 shadow-2xl">
    <!-- Header -->
    <div class="sticky top-0 bg-white z-10 p-6 border-b border-gray-200/60 rounded-t-2xl">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-semibold text-gray-900">Payment Receipt</h3>
          <p class="text-gray-600 mt-1">
            Invoice #{{ selectedInvoiceWithReceipt?.invoiceNumber }} - 
            {{ getPropertyName(selectedInvoiceWithReceipt?.hotelId) }}
          </p>
        </div>
        <button @click="closeReceiptViewer" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Content -->
    <div class="p-6" v-if="selectedInvoiceWithReceipt">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Receipt Preview Column -->
        <div class="lg:col-span-2">
          <div class="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4">
            <div class="aspect-[4/3] bg-white rounded-lg overflow-hidden shadow-sm flex items-center justify-center">
              
             <template v-if="selectedInvoiceWithReceipt.receiptUrl">
    <img 
      :src="selectedInvoiceWithReceipt.receiptUrl" 
      alt="Payment Receipt"
      class="max-w-full max-h-[500px] object-contain p-4"
      @load="handleReceiptImageLoad"
      @error="handleReceiptImageError"
      ref="receiptImage"
    />
  </template>
            
              <div v-else class="text-center p-8">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-gray-500">No receipt image available</p>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3 mt-4">
            <a v-if="selectedInvoiceWithReceipt.receiptUrl" 
               :href="selectedInvoiceWithReceipt.receiptUrl" 
               target="_blank"
               class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              <span>Open in New Tab</span>
            </a>
            <button @click="downloadReceipt(selectedInvoiceWithReceipt)"
                    class="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2.5 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span>Download Receipt</span>
            </button>
          </div>
        </div>

        <!-- Information & Actions Column -->
        <div class="space-y-6">
          <!-- Invoice Details Card -->
          <div class="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl border border-blue-200 p-5">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Invoice Details</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Invoice #:</span>
                <span class="font-semibold text-gray-900">{{ selectedInvoiceWithReceipt.invoiceNumber }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Property:</span>
                <span class="font-medium text-gray-900">{{ getPropertyName(selectedInvoiceWithReceipt.hotelId) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Owner:</span>
                <span class="font-medium text-gray-900">{{ getPropertyOwner(selectedInvoiceWithReceipt.hotelId) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Amount:</span>
                <span class="text-lg font-bold text-gray-900">${{ formatCurrency(selectedInvoiceWithReceipt.amount) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Status:</span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" 
                      :class="getInvoiceStatusClass(selectedInvoiceWithReceipt)">
                  {{ getInvoiceStatusText(selectedInvoiceWithReceipt.status) }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Due Date:</span>
                <span class="font-medium text-gray-900">{{ formatDate(selectedInvoiceWithReceipt.dueDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Verification Section (only if pending verification) -->
          <div v-if="selectedInvoiceWithReceipt.status === 'pending_verification'" 
               class="bg-gradient-to-br from-yellow-50 to-yellow-100/30 rounded-xl border border-yellow-200 p-5">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Verify Payment</h4>
            <p class="text-sm text-yellow-700 mb-4">Review the uploaded receipt and verify if payment is complete.</p>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Verification Notes</label>
                <textarea 
                  v-model="verificationNotes"
                  rows="2"
                  class="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Add any notes about this verification..."
                ></textarea>
              </div>
              
              <div class="flex flex-col space-y-2">
                <button @click="verifyReceipt(true)" 
                        class="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Approve & Mark Paid</span>
                </button>
                <button @click="verifyReceipt(false)" 
                        class="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span>Reject Receipt</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Receipt History -->
          <div v-if="selectedInvoiceWithReceipt.receiptHistory && selectedInvoiceWithReceipt.receiptHistory.length > 0" 
               class="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-xl border border-gray-200 p-5">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Receipt History</h4>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div v-for="(entry, index) in selectedInvoiceWithReceipt.receiptHistory" :key="index" 
                   class="p-3 bg-white/80 rounded-lg border border-gray-100">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-medium text-gray-700">{{ entry.action }}</span>
                  <span class="text-xs text-gray-500">{{ formatDate(entry.timestamp) }}</span>
                </div>
                <div v-if="entry.notes" class="text-xs text-gray-600 mt-1">
                  {{ entry.notes }}
                </div>
                <div v-if="entry.verifiedBy" class="text-xs text-gray-500 mt-1">
                  By: {{ entry.verifiedBy }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

         <!-- Properties Tab Content -->
<div v-else class="p-6">
  <!-- Filters with Selection Controls -->
  <div class="mb-6 flex flex-wrap gap-4 items-center justify-between">
    <div class="flex-1 min-w-[300px]">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search properties, owners, locations..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        >
      </div>
    </div>
    
    <div class="flex items-center gap-4">
      <!-- Status Filter -->
      <select 
        v-model="statusFilter"
        class="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="expired">Expired</option>
        <option value="pending_payment">Pending Payment</option>
      </select>

      <!-- Bulk Delete Button (Only for Admin) -->
      <button 
        v-if="currentAdmin.role === 'admin' && selectedProperties.size > 0"
        @click="confirmBulkDelete"
        class="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        <span>Delete Selected ({{ selectedProperties.size }})</span>
      </button>
    </div>
  </div>

  <!-- Selection Controls Bar -->
  <div v-if="filteredProperties.length > 0" class="mb-4 flex items-center justify-between bg-gray-50/80 p-3 rounded-xl border border-gray-200/60">
    <div class="flex items-center space-x-4">
      <label class="flex items-center space-x-2 cursor-pointer">
        <input 
          type="checkbox" 
          v-model="selectAll"
          @change="toggleSelectAll"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        >
        <span class="text-sm font-medium text-gray-700">Select All</span>
      </label>
      <span class="text-sm text-gray-500">
        {{ selectedProperties.size }} of {{ filteredProperties.length }} selected
      </span>
    </div>
    
    <div v-if="selectedProperties.size > 0" class="flex items-center space-x-2">
      <button 
        @click="clearSelection"
        class="text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Clear Selection
      </button>
    </div>
  </div>

  <!-- Properties Table -->
  <div class="overflow-hidden rounded-xl border border-gray-200/60">
    <table class="min-w-full divide-y divide-gray-200/60">
      <thead class="bg-gray-50/80">
        <tr>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-10">
            <span class="sr-only">Select</span>
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property Info</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner Details</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subscription</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200/60">
        <tr 
          v-for="property in filteredProperties" 
          :key="property.id"
          class="hover:bg-gray-50/80 transition-colors duration-150"
          :class="{ 'bg-blue-50/30': selectedProperties.has(property.id) }"
        >
          <!-- Checkbox Column -->
          <td class="px-6 py-4">
            <input 
              type="checkbox" 
              :checked="selectedProperties.has(property.id)"
              @change="togglePropertySelection(property.id)"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            >
          </td>
          
          <td class="px-6 py-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <div class="text-sm font-semibold text-gray-900">{{ property.name }}</div>
                <div class="text-sm text-gray-500">{{ property.location }}</div>
                <div class="text-xs text-gray-400 mt-1">
                  {{ property.roomCount }} rooms • Created: {{ formatDate(property.createdAt) }}
                </div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-900 font-medium">{{ property.ownerName }}</div>
            <div class="text-sm text-gray-500">{{ property.ownerEmail }}</div>
            <div class="text-sm text-gray-500">{{ property.ownerPhone }}</div>
          </td>
          <td class="px-6 py-4">
            <div v-if="property.subscription" class="space-y-1">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-700">Plan:</span>
                <span class="text-sm text-gray-900 capitalize">{{ property.subscription.plan }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-700">Status:</span>
                <span class="text-sm font-medium" :class="getSubscriptionStatusClass(property.subscription)">
                  {{ property.subscription.status }}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-700">Expires:</span>
                <span class="text-sm text-gray-900" :class="{'text-red-600 font-semibold': isSubscriptionExpired(property)}">
                  {{ property.subscription.expiryDate ? formatDate(property.subscription.expiryDate) : 'N/A' }}
                </span>
              </div>
              <div v-if="property.subscription.trialEndDate" class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-700">Trial ends:</span>
                <span class="text-sm text-gray-900">
                  {{ formatDate(property.subscription.trialEndDate) }}
                  <span v-if="isTrialActive(property)" class="text-green-600 ml-1">(Active)</span>
                </span>
              </div>
            </div>
            <div v-else class="text-yellow-600 text-sm font-medium bg-yellow-50 px-3 py-1 rounded-lg inline-block">
              No subscription
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" 
              :class="getStatusClass(property)">
              {{ getStatusText(property) }}
            </span>
          </td>
          <td class="px-6 py-4">
            <div class="flex flex-col space-y-2 min-w-[140px]">
              <!-- View Details -->
              <button @click="viewPropertyDetails(property)" 
                      class="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 px-3 py-2 border border-gray-200 hover:border-blue-200">
                <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span class="text-sm font-medium">View Details</span>
              </button>

              <!-- Action Buttons Container -->
              <div class="grid grid-cols-2 gap-2">
                <!-- Suspend/Activate -->
                <button v-if="property.isActive" 
                        @click="suspendProperty(property.id)"
                        class="group flex items-center space-x-1 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 px-2 py-2 border border-gray-200 hover:border-yellow-200 justify-center"
                        title="Suspend Property">
                  <svg class="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span class="text-xs font-medium">Suspend</span>
                </button>
                <button v-else-if="property.subscription?.status === 'suspended'"
                        @click="activateProperty(property.id)"
                        class="group flex items-center space-x-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 px-2 py-2 border border-gray-200 hover:border-green-200 justify-center"
                        title="Activate Property">
                  <svg class="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-xs font-medium">Activate</span>
                </button>

                <!-- Extend Subscription -->
                <button @click="extendSubscription(property)"
                        class="group flex items-center space-x-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 px-2 py-2 border border-gray-200 hover:border-purple-200 justify-center"
                        title="Extend Subscription">
                  <svg class="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-xs font-medium">Extend</span>
                </button>

                <!-- Delete Property - Only for admin -->
                <button 
                  v-if="currentAdmin.role === 'admin'"
                  @click="deleteProperty(property.id)"
                  class="group flex items-center space-x-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 px-2 py-2 border border-gray-200 hover:border-red-200 justify-center"
                  title="Delete Property"
                >
                  <svg class="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  <span class="text-xs font-medium">Delete</span>
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty State for Properties -->
    <div v-if="filteredProperties.length === 0" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
        <p class="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    </div>
  </div>
</div>
       
      </div>

      <!-- Create Admin Modal -->
      <div v-if="showCreateAdminModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl">
          <div class="p-6 border-b border-gray-200/60">
            <h3 class="text-lg font-semibold text-gray-900">Create New Admin</h3>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                v-model="newAdmin.name"
                type="text" 
                class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter admin full name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                v-model="newAdmin.email"
                type="email" 
                class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter admin email"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                v-model="newAdmin.password"
                type="password" 
                class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Set temporary password"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    v-model="newAdmin.permissions" 
                    type="checkbox" 
                    value="view_properties" 
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">View Properties</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="newAdmin.permissions" 
                    type="checkbox" 
                    value="manage_applications" 
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">Manage Applications</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="newAdmin.permissions" 
                    type="checkbox" 
                    value="suspend_properties" 
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">Suspend Properties</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="newAdmin.permissions" 
                    type="checkbox" 
                    value="extend_subscriptions" 
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">Extend Subscriptions</span>
                </label>
                <div class="text-xs text-gray-500 mt-2">
                  Note: Sub-admins cannot view revenue or delete properties
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200/60 bg-gray-50/50 flex justify-end space-x-3">
            <button @click="showCreateAdminModal = false" class="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              Cancel
            </button>
            <button @click="createAdmin" class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg">
              Create Admin
            </button>
          </div>
        </div>
      </div>

      <!-- Property Details Modal -->
      <div v-if="showPropertyModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
          <div class="p-6 border-b border-gray-200/60">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-900">Property Details</h3>
              <button @click="showPropertyModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="p-6" v-if="selectedProperty">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Property Information -->
              <div class="space-y-6">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900">Property Information</h4>
                </div>
                <div class="space-y-4">
                  <div class="bg-gray-50/50 p-4 rounded-xl">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                    <p class="text-sm text-gray-900 font-medium">{{ selectedProperty.name }}</p>
                  </div>
                  <div class="bg-gray-50/50 p-4 rounded-xl">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <p class="text-sm text-gray-900">{{ selectedProperty.location }}</p>
                  </div>
                  <div class="bg-gray-50/50 p-4 rounded-xl">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Room Count</label>
                    <p class="text-sm text-gray-900">{{ selectedProperty.roomCount }}</p>
                  </div>
                </div>
              </div>

              <!-- Owner Information -->
              <div class="space-y-6">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900">Owner Information</h4>
                </div>
                <div class="space-y-4">
                  <div class="bg-gray-50/50 p-4 rounded-xl">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                    <p class="text-sm text-gray-900 font-medium">{{ selectedProperty.ownerName }}</p>
                  </div>
                  <div class="bg-gray-50/50 p-4 rounded-xl">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p class="text-sm text-gray-900">{{ selectedProperty.ownerEmail }}</p>
                  </div>
                  <div class="bg-gray-50/50 p-4 rounded-xl">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p class="text-sm text-gray-900">{{ selectedProperty.ownerPhone }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200/60 bg-gray-50/50 flex justify-end space-x-3">
            <button @click="showPropertyModal = false" class="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Extend Subscription Modal -->
      <div v-if="showExtendModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl">
          <div class="p-6 border-b border-gray-200/60">
            <h3 class="text-lg font-semibold text-gray-900">Extend Subscription</h3>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Extension Period</label>
              <select v-model="extensionPeriod" class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">1 Year</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea v-model="extensionNotes" rows="3" class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" placeholder="Add any notes about this extension..."></textarea>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200/60 bg-gray-50/50 flex justify-end space-x-3">
            <button @click="showExtendModal = false" class="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              Cancel
            </button>
            <button @click="confirmExtension" class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg">
              Extend Subscription
            </button>
          </div>
        </div>
      </div>

      <!-- Bulk Delete Confirmation Modal -->
<div v-if="showBulkDeleteConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
  <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl">
    <div class="p-6 border-b border-gray-200/60">
      <h3 class="text-lg font-semibold text-gray-900">Delete Selected Properties</h3>
    </div>
    
    <div class="p-6">
      <div class="flex items-center justify-center mb-4">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
      </div>
      
      <h4 class="text-center text-xl font-bold text-gray-900 mb-2">Confirm Bulk Deletion</h4>
      <p class="text-center text-gray-600 mb-4">
        You are about to permanently delete <span class="font-bold text-red-600">{{ selectedProperties.size }}</span> properties.
      </p>
      
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
        <p class="text-sm text-yellow-800">
          <span class="font-bold">⚠️ Warning:</span> This action cannot be undone. All property data, including owner information, subscriptions, and invoices will be permanently deleted.
        </p>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-xl max-h-48 overflow-y-auto">
        <p class="text-sm font-medium text-gray-700 mb-2">Properties to delete:</p>
        <ul class="space-y-1">
          <li v-for="property in getSelectedPropertiesList()" :key="property.id" class="text-sm text-gray-600 flex items-center">
            <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            {{ property.name }} - {{ property.ownerName }}
          </li>
        </ul>
      </div>
      
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Type "DELETE" to confirm
        </label>
        <input 
          v-model="deleteConfirmationText"
          type="text" 
          class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
          placeholder="DELETE"
        >
      </div>
    </div>

    <div class="p-6 border-t border-gray-200/60 bg-gray-50/50 flex justify-end space-x-3">
      <button @click="cancelBulkDelete" class="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
        Cancel
      </button>
      <button 
        @click="executeBulkDelete" 
        :disabled="deleteConfirmationText !== 'DELETE'"
        class="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Permanently Delete ({{ selectedProperties.size }})
      </button>
    </div>
  </div>
</div>

      <!-- Document Preview Modal -->
      <div v-if="showDocumentModal" class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click.self="closeDocumentModal">
        <div class="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl">
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-6 border-b border-gray-200/60 bg-gray-50/80">
            <h3 class="text-lg font-semibold text-gray-900">{{ currentDocumentTitle }}</h3>
            <div class="flex items-center space-x-3">
              <a v-if="currentDocumentUrl" :href="currentDocumentUrl" target="_blank" rel="noopener noreferrer"
                 class="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                <span>Open New Tab</span>
              </a>
              <button @click="closeDocumentModal" class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Modal Body -->
          <div class="flex-1 overflow-hidden bg-gray-900 flex items-center justify-center" style="min-height: 600px;">
            <!-- PDF Preview -->
            <iframe 
              v-if="documentType === 'pdf'"
              :src="currentDocumentUrl + '#toolbar=1&navpanes=0&scrollbar=1'"
              class="w-full h-full"
              style="min-height: 600px; border: none;"
              frameborder="0"
            ></iframe>
            
            <!-- Image Preview -->
            <img 
              v-else
              :src="currentDocumentUrl" 
              :alt="currentDocumentTitle"
              class="max-w-full max-h-full object-contain"
              style="max-height: calc(95vh - 200px);"
            >
          </div>
          
          <!-- Modal Footer -->
          <div class="p-6 border-t border-gray-200/60 bg-gray-50/80">
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-600 truncate max-w-md font-mono">
                {{ currentDocumentUrl }}
              </div>
              <div class="flex space-x-3">
                <button @click="downloadDocument" 
                        class="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2.5 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  <span>Download</span>
                </button>
                <button @click="closeDocumentModal" class="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  signOut as firebaseSignOut, 
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { 
  collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, 
  query, where, addDoc  // Added addDoc here
} from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { useRouter } from 'vue-router'
import jsPDF from 'jspdf'




const router = useRouter()

// Admin management state
const currentAdmin = ref({
  role: '',
  permissions: [],
  name: '',
  email: ''
})

const showCreateAdminModal = ref(false)
const newAdmin = ref({
  name: '',
  email: '',
  password: '',
  permissions: ['view_properties', 'manage_applications']
})

// Add subAdmins state
const subAdmins = ref([])

// Reactive state
const stats = ref({
  totalProperties: 0,
  activeProperties: 0,
  pendingApplications: 0,
  expiredProperties: 0,
  totalRevenue: 0
})

const pendingApplications = ref([])
const allProperties = ref([])
const activeTab = ref('all')
const searchQuery = ref('')
const pendingSearchQuery = ref('')
const statusFilter = ref('all')
const showPropertyModal = ref(false)
const selectedProperty = ref(null)
const showExtendModal = ref(false)
const extensionPeriod = ref('1')
const extensionNotes = ref('')
const propertyToExtend = ref(null)
const invoiceSearchQuery = ref('')
const invoiceStatusFilter = ref('all')
const allInvoices = ref([])
const isLoading = ref(false)
const selectedProperties = ref(new Set()) 
const selectAll = ref(false)
const showBulkDeleteConfirm = ref(false) 
const deleteConfirmationText = ref('')



// Document preview state
const showDocumentModal = ref(false)
const currentDocumentUrl = ref('')
const currentDocumentTitle = ref('')
const documentType = ref('')
const revenuePeriod = ref('monthly')
const selectedYear = ref(new Date().getFullYear())
const availableYears = ref([])
const revenueData = ref([])
const revenueStats = ref({
  currentPeriod: 0,
  growth: 0,
  totalPayments: 0,
  averagePayment: 0,
  activeSubscriptions: 0
})
const recentPayments = ref([])
const showReceiptViewer = ref(false)
const selectedInvoiceWithReceipt = ref(null)
const verificationNotes = ref('')


// Tabs configuration
const tabs = [
  { id: 'all', name: 'All Properties' },
  { id: 'active', name: 'Active' },
  { id: 'suspended', name: 'Suspended' },
  { id: 'expired', name: 'Expired' },
  { id: 'pending', name: 'Pending Applications' },
  { id: 'invoices', name: 'Invoices' }

]

// Computed properties
const filteredProperties = computed(() => {
  let filtered = allProperties.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(property => 
      property.name?.toLowerCase().includes(query) ||
      property.location?.toLowerCase().includes(query) ||
      property.ownerName?.toLowerCase().includes(query) ||
      property.ownerEmail?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(property => getStatusText(property).toLowerCase() === statusFilter.value.toLowerCase())
  }

  if (activeTab.value !== 'all') {
    filtered = filtered.filter(property => {
      switch (activeTab.value) {
        case 'active':
          return property.isActive && getStatusText(property) === 'Active'
        case 'suspended':
          return getStatusText(property) === 'Suspended'
        case 'expired':
          return getStatusText(property) === 'Expired'
        default:
          return true
      }
    })
  }

  return filtered
})

const filteredPendingApplications = computed(() => {
  if (!pendingSearchQuery.value) {
    return pendingApplications.value
  }

  const query = pendingSearchQuery.value.toLowerCase()
  return pendingApplications.value.filter(app => 
    app.hotelName?.toLowerCase().includes(query) ||
    app.ownerName?.toLowerCase().includes(query) ||
    app.location?.toLowerCase().includes(query) ||
    app.ownerEmail?.toLowerCase().includes(query)
  )
})


const filteredInvoices = computed(() => {
  let filtered = allInvoices.value

  if (invoiceSearchQuery.value) {
    const query = invoiceSearchQuery.value.toLowerCase()
    filtered = filtered.filter(invoice => 
      invoice.invoiceNumber?.toLowerCase().includes(query) ||
      getPropertyName(invoice.hotelId)?.toLowerCase().includes(query) ||
      getPropertyOwner(invoice.hotelId)?.toLowerCase().includes(query)
    )
  }

  if (invoiceStatusFilter.value !== 'all') {
    filtered = filtered.filter(invoice => invoice.status === invoiceStatusFilter.value)
  }

  return filtered
})

// Add with your other methods

const viewReceipt = async (invoice) => {
  selectedInvoiceWithReceipt.value = invoice
  verificationNotes.value = ''
  showReceiptViewer.value = true
}

const closeReceiptViewer = () => {
  showReceiptViewer.value = false
  selectedInvoiceWithReceipt.value = null
  verificationNotes.value = ''
}

const handleReceiptImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x300?text=Receipt+Not+Available'
}

const downloadReceipt = async (invoice) => {
  if (!invoice.receiptUrl) {
    alert('No receipt available to download')
    return
  }
  
  try {
    const link = document.createElement('a')
    link.href = invoice.receiptUrl
    link.download = `receipt-${invoice.invoiceNumber}.jpg`
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading receipt:', error)
    window.open(invoice.receiptUrl, '_blank')
  }
}


const verifyReceipt = async (isApproved) => {
  if (!selectedInvoiceWithReceipt.value) return
  
  try {
    const action = isApproved ? 'approve' : 'reject'
    
    if (!confirm(`Are you sure you want to ${action} this payment receipt?`)) {
      return
    }
    
    // ✅ CHECK IF ALREADY PROCESSED
    const invoiceDoc = await getDoc(doc(db, 'invoices', selectedInvoiceWithReceipt.value.id))
    if (!invoiceDoc.exists() || invoiceDoc.data().receiptVerified === true) {
      alert('⚠️ This invoice has already been processed!')
      closeReceiptViewer()
      await loadInvoicesWithDeduplication()
      await loadData()
      return
    }
    
    const updateData = {
      status: isApproved ? 'paid' : 'pending',
      verifiedAt: new Date(),
      verifiedBy: auth.currentUser.uid,
      verificationNotes: verificationNotes.value,
      receiptVerified: true,
      processedAt: new Date(),
      paymentConfirmedEmailSent: false
    }
    const receiptHistory = selectedInvoiceWithReceipt.value.receiptHistory || []
    receiptHistory.push({
      action: isApproved ? 'Approved' : 'Rejected',
      timestamp: new Date(),
      verifiedBy: auth.currentUser.email,
      notes: verificationNotes.value
    })
    
    updateData.receiptHistory = receiptHistory
    
    await updateDoc(doc(db, 'invoices', selectedInvoiceWithReceipt.value.id), updateData)
    
    if (isApproved) {
      const property = allProperties.value.find(p => p.id === selectedInvoiceWithReceipt.value.hotelId)
      if (property) {
        // ✅ CHECK IF INVOICE ALREADY USED
        if (property.subscription?.lastPayment?.invoiceId === selectedInvoiceWithReceipt.value.id) {
          alert('⚠️ This invoice has already been processed for this property!')
          closeReceiptViewer()
          await loadInvoicesWithDeduplication()
          await loadData()
          return
        }
        
        let newExpiryDate = new Date()
        const period = selectedInvoiceWithReceipt.value.period || 'monthly'
        
        if (period.includes('month')) {
          const months = parseInt(period) || 1
          newExpiryDate.setMonth(newExpiryDate.getMonth() + months)
        } else if (period.includes('year')) {
          const years = parseInt(period) || 1
          newExpiryDate.setFullYear(newExpiryDate.getFullYear() + years)
        } else {
          newExpiryDate.setMonth(newExpiryDate.getMonth() + 1)
        }
        
        await updateDoc(doc(db, 'Hotels', property.id), {
          isActive: true,
          'subscription.status': 'active',
          'subscription.expiryDate': newExpiryDate,
          'subscription.lastPayment': {
            amount: selectedInvoiceWithReceipt.value.amount,
            date: new Date(),
            invoiceId: selectedInvoiceWithReceipt.value.id,
            verifiedBy: auth.currentUser.uid,
            processedAt: new Date()
          }
        })
      }
      
      alert('✅ Payment verified and property activated successfully!')
    } else {
      alert('❌ Receipt rejected. Invoice status set back to pending.')
    }
    
    closeReceiptViewer()
    await loadInvoicesWithDeduplication()
    await loadData()
    
  } catch (error) {
    console.error('Error verifying receipt:', error)
    alert('Error: ' + error.message)
  }
}

// Add this method for better status display
const getInvoiceStatusText = (status) => {
  const statusMap = {
    'pending': 'Pending',
    'pending_verification': 'Awaiting Verification',
    'paid': 'Paid',
    'overdue': 'Overdue',
    'cancelled': 'Cancelled'
  }
  return statusMap[status] || status
}

// Updated approveApplication method for your Vue admin dashboard

const approveApplication = async (registrationId) => {
  try {
    const regRef = doc(db, 'registrations', registrationId)
    const regDoc = await getDoc(regRef)
    
    if (!regDoc.exists()) {
      alert('Registration not found')
      return
    }

    const registration = regDoc.data()
    
    // Check if already approved
    if (registration.status === 'approved' || registration.processed === true) {
      alert('⚠️ This application was already approved!')
      await loadData()
      return
    }
    
    if (!confirm(`Approve ${registration.hotelName}? The property will get 30 days free trial.`)) {
      return
    }

    // Create property first
    const trialStartDate = new Date()
    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + 30)
    
    const plan = registration.roomCount > 15 ? 'pro' : 'standard'
    
    // Generate unique ID
    const timestamp = Date.now()
    const random1 = Math.random().toString(36).substring(2, 8)
    const random2 = Math.random().toString(36).substring(2, 8)
    const propertyId = `prop_${timestamp}_${random1}_${random2}`

    const hotelData = {
      name: registration.hotelName,
      location: registration.location,
      roomCount: registration.roomCount,
      ownerId: registration.ownerId || registrationId,
      ownerEmail: registration.ownerEmail,
      ownerName: registration.ownerName,
      ownerPhone: registration.ownerPhone,
      isActive: true,
      createdAt: new Date(),
      registrationId: registrationId,
      subscription: {
        status: 'active',
        trialStartDate: trialStartDate,
        trialEndDate: trialEndDate,
        plan: plan,
        amount: plan === 'pro' ? 30 : 20,
        expiryDate: trialEndDate,
        billingPeriod: 'monthly'
      }
    }

    // Create hotel
    await setDoc(doc(db, 'Hotels', propertyId), hotelData)
    console.log('✅ Property created:', propertyId)

    // ✅ FIX: Update registration with all correct fields in ONE operation
    await updateDoc(regRef, {
      status: 'approved',  // This will trigger the email function
      approvedPropertyId: propertyId,
      approvedAt: new Date(),
      reviewedAt: new Date(),
      reviewedBy: auth.currentUser.uid,
      processed: true,
      approvalEmailSent: false,  // Important: Set to false so email function can send it
      approvalEmailPending: true
    })
    
    console.log('✅ Registration updated - email function should trigger now')

    alert(`✅ Hotel approved! 30-day free trial started.

Property ID: ${propertyId}
Plan: ${plan}

The property owner will receive a confirmation email shortly.`)
    
    // Reload data
    await loadData()
    
  } catch (error) {
    console.error('Approval error:', error)
    alert('Error: ' + error.message)
  }
}


// const checkTrialEndingsAndCreateInvoices = async () => {
//   try {
//     console.log('🔍 Checking trial endings...')
    
//     if (window.trialCheckRunning) {
//       console.log('⏭️ Trial check already running, skipping')
//       return
//     }
//     window.trialCheckRunning = true
    
//     const hotelsSnap = await getDocs(collection(db, 'Hotels'))
//     const now = new Date()
//     const processedHotels = new Set() // Track processed hotels
    
//     for (const docSnap of hotelsSnap.docs) {
//       const hotel = { id: docSnap.id, ...docSnap.data() }
      
//       // Skip if already processed
//       if (processedHotels.has(hotel.id)) continue
//       processedHotels.add(hotel.id)
      
//       if (!hotel.subscription?.trialEndDate || hotel.subscription?.status !== 'active') {
//         continue
//       }
      
//       const trialEnd = hotel.subscription.trialEndDate.toDate()
//       const daysUntilTrialEnd = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))
      
//       if (daysUntilTrialEnd <= 3 && daysUntilTrialEnd > 0) {
//         // ✅ CHECK FOR ANY TRIAL INVOICE with comprehensive query
//         const existingTrialInvoicesQuery = query(
//           collection(db, 'invoices'),
//           where('hotelId', '==', hotel.id)
//         )
        
//         const existingInvoices = await getDocs(existingTrialInvoicesQuery)
        
//         // Check if ANY invoice exists for this hotel (trial or not)
//         const hasTrialInvoice = existingInvoices.docs.some(doc => {
//           const data = doc.data()
//           return data.isTrialEnd === true || 
//                  data.invoiceType === 'trial_end' ||
//                  data.description?.includes('trial')
//         })
        
//         if (hasTrialInvoice) {
//           console.log(`⏭️ Skipping ${hotel.name} - trial invoice already exists`)
//           continue
//         }
        
//         const plan = hotel.subscription.plan || 'standard'
//         const amount = plan === 'standard' ? 20 : 30
        
//         // ULTRA-UNIQUE invoice number
//         const timestamp = Date.now()
//         const random1 = Math.random().toString(36).substring(2, 6)
//         const random2 = Math.random().toString(36).substring(2, 6)
//         const invoiceNumber = `INV-TRIAL-${timestamp}-${hotel.id.slice(-4)}-${random1}-${random2}`
        
//         const invoiceData = {
//           hotelId: hotel.id,
//           hotelName: hotel.name,
//           ownerEmail: hotel.ownerEmail,
//           ownerName: hotel.ownerName,
//           invoiceNumber: invoiceNumber,
//           amount: amount,
//           dueDate: trialEnd,
//           status: 'pending',
//           createdAt: new Date(),
//           period: 'monthly',
//           description: `First payment after free trial - ${plan.toUpperCase()} Plan`,
//           plan: plan,
//           isTrialEnd: true,
//           invoiceType: 'trial_end',
//           uniqueIdentifier: `trial_${hotel.id}_${timestamp}_${random1}_${random2}`,
//           generatedBy: 'system_auto',
//           preventDuplication: true
//         }
        
//         await addDoc(collection(db, 'invoices'), invoiceData)
//         console.log(`✅ Created trial invoice for ${hotel.name}`)
//       }
//     }
    
//     console.log('✅ Trial check completed')
    
//   } catch (error) {
//     console.error('❌ Error checking trial endings:', error)
//   } finally {
//     window.trialCheckRunning = false
//   }
// }

const getPropertyName = (hotelId) => {
  if (!hotelId) return 'Unknown Property'
  const property = allProperties.value.find(p => p.id === hotelId)
  if (!property) {
    const invoice = allInvoices.value.find(inv => inv.id === hotelId)
    return invoice?.hotelName || 'Unknown Property'
  }
  return property.name || 'Unknown Property'
}

const getPropertyOwner = (hotelId) => {
  if (!hotelId) return 'Unknown Owner'
  const property = allProperties.value.find(p => p.id === hotelId)
  if (!property) {
    const invoice = allInvoices.value.find(inv => inv.id === hotelId)
    return invoice?.ownerName || 'Unknown Owner'
  }
  return property.ownerName || 'Unknown Owner'
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
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classes[invoice.status] || 'bg-gray-100 text-gray-800'
}

const markAsPaid = async (invoice) => {
  if (!confirm(`Mark invoice ${invoice.invoiceNumber} as paid and activate subscription?`)) return
  
  try {
    // ✅ CHECK IF ALREADY PAID
    const invoiceDoc = await getDoc(doc(db, 'invoices', invoice.id))
    if (!invoiceDoc.exists() || invoiceDoc.data().status === 'paid') {
      alert('⚠️ This invoice has already been marked as paid!')
      await loadInvoicesWithDeduplication()
      await loadData()
      return
    }

    if (!invoice.receiptUrl) {
      const confirmNoReceipt = confirm('No receipt uploaded. Continue marking as paid?')
      if (!confirmNoReceipt) return
    }
    
    const updateData = {
      status: 'paid',
      paidAt: new Date(),
      paidBy: auth.currentUser.uid,
      verifiedAt: new Date(),
      verifiedBy: auth.currentUser.uid,
      receiptVerified: true,
      paymentConfirmedEmailSent: false,
      processedAt: new Date()
    }
    
    await updateDoc(doc(db, 'invoices', invoice.id), updateData)
    
    const property = allProperties.value.find(p => p.id === invoice.hotelId)
    if (!property) {
      alert('Property not found')
      return
    }
    
    // ✅ CHECK IF INVOICE ALREADY USED
    if (property.subscription?.lastPayment?.invoiceId === invoice.id) {
      alert('⚠️ This invoice has already been processed for this property!')
      await loadInvoicesWithDeduplication()
      await loadData()
      return
    }
    
    let newExpiryDate = new Date()
    const period = invoice.period || 'monthly'
    
    if (period.includes('month')) {
      const months = parseInt(period) || 1
      newExpiryDate.setMonth(newExpiryDate.getMonth() + months)
    } else if (period.includes('year')) {
      const years = parseInt(period) || 1
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + years)
    } else {
      newExpiryDate.setMonth(newExpiryDate.getMonth() + 1)
    }
    
    await updateDoc(doc(db, 'Hotels', property.id), {
      isActive: true,
      'subscription.status': 'active',
      'subscription.expiryDate': newExpiryDate,
      'subscription.lastPayment': {
        amount: invoice.amount,
        date: new Date(),
        invoiceId: invoice.id,
        verifiedBy: auth.currentUser.uid,
        processedAt: new Date()
      },
      'subscription.plan': invoice.plan || property.subscription?.plan || 'standard'
    })
    
    alert('✅ Invoice marked as paid and subscription activated!')
    
    await loadData()
    await loadInvoicesWithDeduplication()
    
  } catch (error) {
    console.error('Error marking invoice as paid:', error)
    alert('Error: ' + error.message)
  }
}



const loadInvoicesWithDeduplication = async () => {
  try {
    const invoicesSnap = await getDocs(collection(db, 'invoices'))
    
    // Advanced deduplication using multiple criteria
    const invoiceMap = new Map()
    const toDelete = []
    
    invoicesSnap.docs.forEach(doc => {
      const data = doc.data()
      const invNum = data.invoiceNumber
      const uniqueKey = `${data.hotelId}_${invNum}_${data.amount}_${data.invoiceType || 'standard'}`
      
      if (invoiceMap.has(uniqueKey)) {
        // Keep the oldest one (first created)
        const existing = invoiceMap.get(uniqueKey)
        const existingDate = existing.data.createdAt?.toDate?.() || new Date(existing.data.createdAt)
        const currentDate = data.createdAt?.toDate?.() || new Date(data.createdAt)
        
        if (currentDate > existingDate) {
          // Current is newer, delete it
          toDelete.push(doc.id)
        } else {
          // Current is older, keep it and delete the existing
          toDelete.push(existing.id)
          invoiceMap.set(uniqueKey, { id: doc.id, data })
        }
      } else {
        invoiceMap.set(uniqueKey, { id: doc.id, data })
      }
    })
    
    // Delete duplicates in batches
    if (toDelete.length > 0) {
      console.log(`🗑️ Deleting ${toDelete.length} duplicate invoices...`)
      for (const id of toDelete) {
        try {
          await deleteDoc(doc(db, 'invoices', id))
        } catch (error) {
          console.error(`Error deleting invoice ${id}:`, error)
        }
      }
    }
    
    // Load clean data
    allInvoices.value = Array.from(invoiceMap.values())
      .map(item => ({
        id: item.id,
        ...item.data,
        createdAt: item.data.createdAt?.toDate?.() || new Date(),
        dueDate: item.data.dueDate?.toDate?.() || new Date()
      }))
      .sort((a, b) => b.createdAt - a.createdAt)
    
    console.log(`✅ Loaded ${allInvoices.value.length} unique invoices, deleted ${toDelete.length} duplicates`)
    
  } catch (error) {
    console.error('Error loading invoices:', error)
    allInvoices.value = []
  }
}


const getPropertyDetails = (hotelId) => {
  return allProperties.value.find(p => p.id === hotelId) || {}
}

const sendReminder = async (invoice) => {
  try {
    const property = allProperties.value.find(p => p.id === invoice.hotelId)
    if (!property) {
      alert('Property not found')
      return
    }
    
    // In production, send email here
    const reminderData = {
      invoiceId: invoice.id,
      sentTo: property.ownerEmail,
      sentAt: new Date(),
      sentBy: auth.currentUser.uid,
      type: 'payment_reminder'
    }
    
    await addDoc(collection(db, 'email_logs'), reminderData)
    
    alert(`Reminder sent to ${property.ownerEmail}`)
  } catch (error) {
    console.error('Error sending reminder:', error)
    alert('Error: ' + error.message)
  }
}


const downloadAdminInvoice = async (invoice) => {
  try {
    const property = getPropertyDetails(invoice.hotelId)
    
    if (!property) {
      alert('Property not found')
      return
    }
    
    const doc = new jsPDF()
    
    // Add header
    doc.setFontSize(20)
    doc.text('BOOKELLO', 20, 20)
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text('Digital Check-in System', 20, 28)
    
    // Add invoice title
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('INVOICE', 150, 20)
    doc.setFontSize(10)
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 150, 28)
    doc.text(`Date: ${formatDate(invoice.createdAt)}`, 150, 33)
    doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 150, 38)
    doc.text(`Status: ${invoice.status}`, 150, 43)
    
    // Add bill to section
    doc.setFontSize(12)
    doc.text('Bill To:', 20, 50)
    doc.setFontSize(10)
    doc.text(property.ownerName, 20, 57)
    doc.text(property.name, 20, 62)
    doc.text(property.location, 20, 67)
    doc.text(property.ownerEmail, 20, 72)
    doc.text(property.ownerPhone, 20, 77)
    
    // Add line
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 85, 190, 85)
    
    // Add invoice items
    doc.setFontSize(12)
    doc.text('Description', 20, 95)
    doc.text('Amount', 150, 95)
    
    doc.setFontSize(10)
    doc.text(invoice.description || 'Monthly subscription fee', 20, 105)
    doc.text(`$${invoice.amount}`, 150, 105)
    
    // Add total
    doc.setFontSize(12)
    doc.text('Total Due:', 130, 125)
    doc.setFontSize(14)
    doc.text(`$${invoice.amount}`, 150, 125)
    
    // Add payment instructions
    doc.setFontSize(12)
    doc.text('Payment Instructions:', 20, 140)
    doc.setFontSize(10)
    doc.text('Bank: Equity Bank Rwanda PLC', 20, 147)
    doc.text('Branch: Giporoso Branch', 20, 152)
    doc.text('Currency: USD', 20, 157)
    doc.text('Account Number: 4013201302202', 20, 162)
    doc.text('SWIFT Code: EQBLRWRW', 20, 167)
    doc.text('Bank Address:', 20, 172)
    doc.text('KN4 Ave, Grand Pension Plaza, P.O. Box 494, Kigali, Rwanda', 20, 177)
    doc.text('Intermediary Bank (for international USD transfers):', 20, 182)
    doc.text('Bank: Citi Bank', 20, 187)
    doc.text('SWIFT: CITIUS33', 20, 192)
    doc.text('Address: New York, USA', 20, 197)

    // Add footer
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('Please include the invoice number as payment reference.', 20, 180)
    doc.text('Service will be suspended if payment is not received by due date.', 20, 185)
    doc.text('For payment confirmation, forward bank slip to payment@bookello.life', 20, 190)
    
    // Save the PDF
    doc.save(`invoice-${invoice.invoiceNumber}.pdf`)
    
  } catch (error) {
    console.error('Error generating PDF invoice:', error)
    // Fallback to text version
    downloadAdminInvoice(invoice)
  }
}

// Selection Management Methods
const togglePropertySelection = (propertyId) => {
  const newSelected = new Set(selectedProperties.value)
  if (newSelected.has(propertyId)) {
    newSelected.delete(propertyId)
  } else {
    newSelected.add(propertyId)
  }
  selectedProperties.value = newSelected
  updateSelectAllState()
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    // Select all filtered properties
    const newSelected = new Set()
    filteredProperties.value.forEach(property => {
      newSelected.add(property.id)
    })
    selectedProperties.value = newSelected
  } else {
    // Deselect all
    selectedProperties.value.clear()
  }
  updateSelectAllState()
}

const updateSelectAllState = () => {
  if (filteredProperties.value.length === 0) {
    selectAll.value = false
    return
  }
  
  const allFilteredSelected = filteredProperties.value.every(property => 
    selectedProperties.value.has(property.id)
  )
  selectAll.value = allFilteredSelected
}

const clearSelection = () => {
  selectedProperties.value.clear()
  selectAll.value = false
}

const getSelectedPropertiesList = () => {
  return allProperties.value.filter(property => 
    selectedProperties.value.has(property.id)
  )
}

// Bulk Delete Methods
const confirmBulkDelete = () => {
  if (selectedProperties.value.size === 0) {
    alert('No properties selected')
    return
  }
  
  deleteConfirmationText.value = ''
  showBulkDeleteConfirm.value = true
}

const cancelBulkDelete = () => {
  showBulkDeleteConfirm.value = false
  deleteConfirmationText.value = ''
}



const executeBulkDelete = async () => {
  if (deleteConfirmationText.value !== 'DELETE') {
    alert('Please type DELETE to confirm')
    return
  }
  
  try {
    const propertiesToDelete = getSelectedPropertiesList()
    const deletePromises = []
    const deletionLog = []
    
    for (const property of propertiesToDelete) {
      // Add property deletion promise
      deletePromises.push(deleteDoc(doc(db, 'Hotels', property.id)))
      
      // Find and delete registrations for this property
      const registrationsQuery = query(
        collection(db, 'registrations'), 
        where('ownerEmail', '==', property.ownerEmail)
      )
      const registrationsSnap = await getDocs(registrationsQuery)
      
      registrationsSnap.docs.forEach(doc => {
        deletePromises.push(deleteDoc(doc.ref))
      })
      
      // Create deletion record
      deletePromises.push(
        setDoc(doc(db, 'deleted_properties', property.id), {
          name: property.name,
          ownerEmail: property.ownerEmail,
          deletedAt: new Date(),
          deletedBy: auth.currentUser.uid,
          bulkDelete: true,
          batchId: `bulk_${Date.now()}`
        })
      )
      
      deletionLog.push({
        propertyId: property.id,
        propertyName: property.name,
        ownerEmail: property.ownerEmail
      })
    }
    
    // Execute all deletions
    await Promise.all(deletePromises)
    
    // Log the bulk deletion
    await addDoc(collection(db, 'audit_log'), {
      action: 'bulk_property_deletion',
      count: propertiesToDelete.length,
      properties: deletionLog,
      performedBy: auth.currentUser.uid,
      performedAt: new Date()
    })
    
    alert(`✅ Successfully deleted ${propertiesToDelete.length} properties`)
    
    // Reset states
    showBulkDeleteConfirm.value = false
    deleteConfirmationText.value = ''
    clearSelection()
    
    // Reload data
    await loadData()
    
  } catch (error) {
    console.error('Error during bulk delete:', error)
    alert('Error deleting properties: ' + error.message)
  }
}


// Sub-Admin Management Methods
const loadSubAdmins = async () => {
  try {
    const usersSnap = await getDocs(collection(db, 'users'))
    const admins = []
    
    for (const doc of usersSnap.docs) {
      const userData = doc.data()
      if (userData.role === 'sub_admin') {
        admins.push({
          id: doc.id,
          ...userData,
          createdAt: userData.createdAt?.toDate?.() || userData.createdAt
        })
      }
    }
    
    subAdmins.value = admins
  } catch (error) {
    console.error('Error loading sub-admins:', error)
  }
}

const deactivateSubAdmin = async (adminId) => {
  if (!confirm('Are you sure you want to deactivate this sub-admin?')) return
  
  try {
    await updateDoc(doc(db, 'users', adminId), {
      isActive: false,
      deactivatedAt: new Date()
    })
    alert('Sub-admin deactivated successfully')
    await loadSubAdmins()
  } catch (error) {
    console.error('Error deactivating sub-admin:', error)
    alert('Error deactivating sub-admin: ' + error.message)
  }
}

const activateSubAdmin = async (adminId) => {
  try {
    await updateDoc(doc(db, 'users', adminId), {
      isActive: true
    })
    alert('Sub-admin activated successfully')
    await loadSubAdmins()
  } catch (error) {
    console.error('Error activating sub-admin:', error)
    alert('Error activating sub-admin: ' + error.message)
  }
}

// PERMANENT DELETE METHOD - ENHANCED
const deleteSubAdmin = async (admin) => {
  if (!confirm(`🚨 PERMANENT DELETION: This will completely remove ${admin.name} from the system. They will NOT be able to login anymore. This cannot be undone!`)) return

  try {
    // Get the property first to find the owner
    const adminDoc = await getDoc(doc(db, 'users', admin.id))
    if (!adminDoc.exists()) {
      alert('Sub-admin not found')
      return
    }
    
    const adminData = adminDoc.data()
    
    // 1. Delete their user document from Firestore
    await deleteDoc(doc(db, 'users', admin.id))
    
    // 2. Create deletion record for audit
    await setDoc(doc(db, 'deleted_users', admin.id), {
      email: adminData.email,
      name: adminData.name,
      deletedAt: new Date(),
      deletedBy: auth.currentUser.uid,
      originalRole: adminData.role,
      canRestore: false
    })
    
    // 3. Ban their email from future registration
    await setDoc(doc(db, 'banned_emails', adminData.email.replace(/[^a-zA-Z0-9]/g, '_')), {
      email: adminData.email,
      bannedAt: new Date(),
      bannedBy: auth.currentUser.uid,
      reason: 'Admin account deletion',
      permanent: true
    })
    
    // 4. Log the action
    await addDoc(collection(db, 'audit_log'), {
      action: 'permanent_admin_deletion',
      targetUserId: admin.id,
      targetEmail: adminData.email,
      performedBy: auth.currentUser.uid,
      performedAt: new Date(),
      ipAddress: 'admin_dashboard'
    })
    
    alert(`✅ ${admin.name} PERMANENTLY DELETED!\n\nThey cannot login anymore.`)
    
    await loadSubAdmins()
    
  } catch (error) {
    console.error('Error deleting sub-admin:', error)
    alert('Error deleting sub-admin: ' + error.message)
  }
}

// Admin Management Methods
const createAdmin = async () => {
  try {
    if (!newAdmin.value.name || !newAdmin.value.email || !newAdmin.value.password) {
      alert('Please fill in all required fields')
      return
    }

    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      newAdmin.value.email, 
      newAdmin.value.password
    )
    
    const user = userCredential.user

    // Create sub_admin with LIMITED permissions
    const adminData = {
      name: newAdmin.value.name,
      email: newAdmin.value.email,
      role: 'sub_admin',
      permissions: newAdmin.value.permissions,
      createdBy: auth.currentUser.uid,
      createdAt: new Date(),
      isActive: true
    }

    await setDoc(doc(db, 'users', user.uid), adminData)

    alert('Sub-admin created successfully! They will have limited access.')
    
    // Reset form
    newAdmin.value = {
      name: '',
      email: '',
      password: '',
      permissions: ['view_properties', 'manage_applications']
    }
    showCreateAdminModal.value = false
    await loadSubAdmins()

  } catch (error) {
    console.error('Error creating admin:', error)
    alert('Error creating admin: ' + error.message)
  }
}

const isSubscriptionExpired = (property) => {
  if (!property.subscription?.expiryDate) return false
  const expiryDate = property.subscription.expiryDate?.toDate?.() || new Date(property.subscription.expiryDate)
  return expiryDate < new Date()
}

const loadCurrentAdmin = async () => {
  const user = auth.currentUser
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (userDoc.exists()) {
      currentAdmin.value = userDoc.data()
    }
  }
}

// Methods

const handleReceiptImageLoad = () => {
  console.log('✅ Receipt image loaded successfully')
  const errorDiv = document.querySelector('.receipt-error')
  if (errorDiv) errorDiv.remove()
}


const getTabCount = (tabId) => {
  switch (tabId) {
    case 'all': return allProperties.value.length
    case 'active': return allProperties.value.filter(p => p.isActive && getStatusText(p) === 'Active').length
    case 'suspended': return allProperties.value.filter(p => getStatusText(p) === 'Suspended').length
    case 'expired': return allProperties.value.filter(p => getStatusText(p) === 'Expired').length
    case 'pending': return pendingApplications.value.length
    case 'invoices': return allInvoices.value.length 
    default: return 0
  }
}

const getStatusClass = (property) => {
  if (!property.isActive) return 'bg-red-100 text-red-800'
  if (property.subscription?.status === 'expired') return 'bg-red-100 text-red-800'
  if (property.subscription?.status === 'suspended') return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}


const getStatusText = (property) => {
  if (!property.isActive) return 'Inactive';
  
  if (property.subscription?.expiryDate) {
    const expiryDate = property.subscription.expiryDate?.toDate?.() || new Date(property.subscription.expiryDate);
    const now = new Date();
    
    // If expired more than 1 day ago
    if (expiryDate < now) {
      return 'Expired';
    }
    
    // If expiring within 7 days
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      return `Expires in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}`;
    }
  }
  
  if (property.subscription?.status === 'suspended') return 'Suspended';
  if (property.subscription?.status === 'pending_payment') return 'Pending Payment';
  if (property.subscription?.status === 'expired') return 'Expired';
  
  return 'Active';
}


onMounted(async () => {
  console.log('📱 Admin dashboard loading...')
  
  try {
    await loadCurrentAdmin()
    await loadData()
    
    // Check trial endings ONCE
   // await checkTrialEndingsAndCreateInvoices()
    
    console.log('✅ Dashboard ready!')
    
  } catch (error) {
    console.error('Error loading dashboard:', error)
  }
})


// Pending Applications Methods
const previewDocument = (documentUrl, title) => {
  if (!documentUrl) {
    alert('Document not available')
    return
  }

  currentDocumentTitle.value = title
  currentDocumentUrl.value = documentUrl
  documentType.value = getDocumentType(documentUrl)
  showDocumentModal.value = true
}

const getDocumentType = (url) => {
  if (!url) return 'unknown'
  const lowerUrl = url.toLowerCase()
  if (lowerUrl.includes('.pdf') || lowerUrl.includes('pdf')) {
    return 'pdf'
  }
  return 'image'
}

const downloadDocument = () => {
  if (!currentDocumentUrl.value) return
  
  try {
    const link = document.createElement('a')
    link.href = currentDocumentUrl.value
    link.download = `${currentDocumentTitle.value}.${getFileExtension(currentDocumentUrl.value)}`
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Download error:', error)
    window.open(currentDocumentUrl.value, '_blank')
  }
}

const getFileExtension = (url) => {
  const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
  return match ? match[1] : (documentType.value === 'pdf' ? 'pdf' : 'jpg')
}

const closeDocumentModal = () => {
  showDocumentModal.value = false
  currentDocumentUrl.value = ''
  currentDocumentTitle.value = ''
  documentType.value = ''
}


// CORRECT FIX: Properly handle loadData and approveApplication

const loadData = async () => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    pendingApplications.value = []
    allProperties.value = []
    
    // Load registrations and hotels
    const [registrationsSnap, hotelsSnap] = await Promise.all([
      getDocs(collection(db, 'registrations')),
      getDocs(collection(db, 'Hotels'))
    ])
    
    // Get PENDING applications only
    pendingApplications.value = registrationsSnap.docs
      .filter(doc => doc.data().status === 'pending')
      .map(doc => ({ id: doc.id, ...doc.data() }))
    
    // ✅ Load ALL properties (no deduplication needed - each doc ID is unique)
    allProperties.value = hotelsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }))
    
    // Update stats
    stats.value.pendingApplications = pendingApplications.value.length
    stats.value.totalProperties = allProperties.value.length
    stats.value.activeProperties = allProperties.value.filter(p => 
      p.isActive && p.subscription?.status === 'active'
    ).length
    stats.value.expiredProperties = allProperties.value.filter(p => 
      !p.isActive || p.subscription?.status === 'expired'
    ).length
    
    console.log('✅ Properties loaded:', {
      total: allProperties.value.length,
      active: stats.value.activeProperties,
      expired: stats.value.expiredProperties
    })
    
    // Load invoices
    await loadInvoicesWithDeduplication()
    
    // Load admin features
    if (currentAdmin.value.role === 'admin') {
      await loadRevenueData()
      await loadSubAdmins()
    }
    
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    isLoading.value = false
  }
}




const rejectApplication = async (registrationId) => {
  try {
    const registrationDoc = await getDoc(doc(db, 'registrations', registrationId))
    if (!registrationDoc.exists()) {
      alert('Registration not found')
      return
    }
    
    const registration = registrationDoc.data()
    
    const reason = prompt(`Please provide a reason for rejecting ${registration.hotelName}:`)
    if (!reason || reason.trim() === '') {
      alert('Rejection reason is required')
      return
    }

    await updateDoc(doc(db, 'registrations', registrationId), {
      status: 'rejected',
      reviewedAt: new Date(),
      reviewedBy: auth.currentUser.uid,
      rejectionReason: reason.trim(),
      rejectedAt: new Date(),
      canReapply: true
    })

    alert(`Application rejected successfully.\nReason: ${reason}`)
    await loadData()
  } catch (error) {
    console.error('Rejection error:', error)
    alert('Error rejecting application: ' + error.message)
  }
}

// Property Management Actions
const viewPropertyDetails = (property) => {
  selectedProperty.value = property
  showPropertyModal.value = true
}

const suspendProperty = async (propertyId) => {
  if (!confirm('Are you sure you want to suspend this property? The owner will not be able to use the system until reactivated.')) return

  try {
    await updateDoc(doc(db, 'Hotels', propertyId), {
      isActive: false,
      'subscription.status': 'suspended',
      suspendedAt: new Date()
    })
    alert('Property suspended successfully')
    await loadData()
  } catch (error) {
    console.error('Error suspending property:', error)
    alert('Error suspending property: ' + error.message)
  }
}

const activateProperty = async (propertyId) => {
  try {
    await updateDoc(doc(db, 'Hotels', propertyId), {
      isActive: true,
      'subscription.status': 'active'
    })
    alert('Property activated successfully')
    await loadData()
  } catch (error) {
    console.error('Error activating property:', error)
    alert('Error activating property: ' + error.message)
  }
}


const extendSubscription = async (property) => {
  propertyToExtend.value = property
  
  // Set default period based on current plan
  if (property.subscription?.plan === 'standard') {
    extensionPeriod.value = '1' // Default 1 month for standard
  } else if (property.subscription?.plan === 'pro') {
    extensionPeriod.value = '1' // Default 1 month for pro
  } else {
    extensionPeriod.value = '1'
  }
  
  showExtendModal.value = true
}

const confirmExtension = async () => {
  if (!propertyToExtend.value) return

  try {
    const property = propertyToExtend.value
    const extensionMonths = parseInt(extensionPeriod.value)
    
    // ✅ CHECK FOR EXISTING PENDING INVOICES FOR THIS PROPERTY
    const existingInvoicesQuery = query(
      collection(db, 'invoices'),
      where('hotelId', '==', property.id),
      where('status', '==', 'pending')
    )
    
    const existingInvoices = await getDocs(existingInvoicesQuery)
    
    if (!existingInvoices.empty) {
      const pendingInvoice = existingInvoices.docs[0].data()
      const confirmOverride = confirm(
        `⚠️ This property already has a pending invoice (#${pendingInvoice.invoiceNumber}).\n\n` +
        `Do you want to create another invoice? This will result in 2 pending invoices.`
      )
      if (!confirmOverride) {
        showExtendModal.value = false
        return
      }
    }
    
    const currentExpiry = property.subscription?.expiryDate?.toDate?.() || new Date()
    
    // Calculate new expiry date
    let newExpiryDate
    if (currentExpiry < new Date()) {
      newExpiryDate = new Date()
      newExpiryDate.setMonth(newExpiryDate.getMonth() + extensionMonths)
    } else {
      newExpiryDate = new Date(currentExpiry)
      newExpiryDate.setMonth(newExpiryDate.getMonth() + extensionMonths)
    }
    
    const plan = property.subscription?.plan || 'standard'
    const monthlyRate = plan === 'standard' ? 20 : 30
    const amount = monthlyRate * extensionMonths
    
    // Generate ULTRA-UNIQUE invoice number
    const timestamp = Date.now()
    const random1 = Math.random().toString(36).substring(2, 6)
    const random2 = Math.random().toString(36).substring(2, 6)
    const invoiceNumber = `INV-EXT-${timestamp}-${property.id.substring(0, 4)}-${random1}-${random2}`
    
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)
    
    const invoiceData = {
      hotelId: property.id,
      hotelName: property.name,
      ownerEmail: property.ownerEmail,
      ownerName: property.ownerName,
      invoiceNumber: invoiceNumber,
      amount: amount,
      dueDate: dueDate,
      status: 'pending',
      createdAt: new Date(),
      period: `${extensionMonths} month${extensionMonths > 1 ? 's' : ''}`,
      description: `Subscription extension for ${extensionMonths} month${extensionMonths > 1 ? 's' : ''}`,
      plan: plan,
      extensionMonths: extensionMonths,
      invoiceType: 'extension',
      uniqueIdentifier: `extension_${property.id}_${timestamp}_${random1}_${random2}`,
      generatedBy: auth.currentUser.uid, 
      notes: extensionNotes.value,
      invoiceCreatedEmailSent: false
    }
    
    const invoiceRef = await addDoc(collection(db, 'invoices'), invoiceData)
    
    const updateData = {
      'subscription.status': 'pending_payment',
      'subscription.lastExtension': {
        months: extensionMonths,
        amount: amount,
        invoiceId: invoiceRef.id,
        dueDate: dueDate,
        createdAt: new Date()
      }
    }
    
    await updateDoc(doc(db, 'Hotels', property.id), updateData)
    
  alert(`✅ Invoice created for subscription extension!\n\nInvoice #: ${invoiceNumber}\nAmount: $${amount}\nDue Date: ${dueDate.toLocaleDateString()}\n\nThe property will be activated once payment is received.\n\nProperty owner will receive invoice email.`)    
    showExtendModal.value = false
    propertyToExtend.value = null
    extensionPeriod.value = '1'
    extensionNotes.value = ''
    
    await loadData()
    await loadInvoicesWithDeduplication()
    
  } catch (error) {
    console.error('Error extending subscription:', error)
    alert('Error extending subscription: ' + error.message)
  }
}

 // ENHANCED PROPERTY DELETION
const deleteProperty = async (propertyId) => {
  if (!confirm('WARNING: This will permanently delete this property and all its data. This action cannot be undone. Are you sure?')) return

  try {
    // Get the property first to find the owner
    const propertyDoc = await getDoc(doc(db, 'Hotels', propertyId))
    if (!propertyDoc.exists()) {
      alert('Property not found')
      return
    }
    
    const property = propertyDoc.data()
    
    // 1. Delete the property from Firestore
    await deleteDoc(doc(db, 'Hotels', propertyId))
    
    // 2. Also delete any pending applications for this property
    const registrationsQuery = query(
      collection(db, 'registrations'), 
      where('ownerEmail', '==', property.ownerEmail)
    )
    const registrationsSnap = await getDocs(registrationsQuery)
    
    const deletePromises = registrationsSnap.docs.map(doc => 
      deleteDoc(doc.ref)
    )
    await Promise.all(deletePromises)
    
    // 3. Create deletion record
    await setDoc(doc(db, 'deleted_properties', propertyId), {
      name: property.name,
      ownerEmail: property.ownerEmail,
      deletedAt: new Date(),
      deletedBy: auth.currentUser.uid
    })
    
    alert('Property and all associated data permanently deleted!')
    await loadData()
  } catch (error) {
    console.error('Error deleting property:', error)
    alert('Error deleting property: ' + error.message)
  }
}


const deleteInvoice = async (invoice) => {
  if (!confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?\n\nThis will permanently remove this invoice record.`)) return
  
  try {
    await deleteDoc(doc(db, 'invoices', invoice.id))
    
    // Also delete from recent payments if it exists there
    recentPayments.value = recentPayments.value.filter(p => p.id !== invoice.id)
    
    alert('Invoice deleted successfully')
    await loadInvoicesWithDeduplication()
    await loadRevenueData() // Refresh revenue data
  } catch (error) {
    console.error('Error deleting invoice:', error)
    alert('Error deleting invoice: ' + error.message)
  }
}




// Revenue Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0) 
}

const getPlanClass = (plan) => {
  const classes = {
    standard: 'bg-blue-100 text-blue-800',
    pro: 'bg-purple-100 text-purple-800',
    basic: 'bg-gray-100 text-gray-800'
  }
  return classes[plan] || 'bg-gray-100 text-gray-800'
}


const loadRevenueData = async () => {
  try {
    // Get all properties and invoices in parallel
    const [propertiesSnap, invoicesSnap] = await Promise.all([
      getDocs(collection(db, 'Hotels')),
      getDocs(collection(db, 'invoices'))
    ])
    
    const properties = propertiesSnap.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }))

    const allInvoicesData = invoicesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
      dueDate: doc.data().dueDate?.toDate?.() || new Date(doc.data().dueDate),
      paidAt: doc.data().paidAt?.toDate?.() || (doc.data().status === 'paid' ? new Date() : null)
    }))

    // FILTER 1: Get only PAID invoices
    const paidInvoices = allInvoicesData.filter(invoice => 
      invoice.status === 'paid' && invoice.amount > 0
    )

    // FILTER 2: Get active properties with valid subscriptions
    const activeProperties = properties.filter(p => 
      p.isActive && p.subscription?.status === 'active'
    )

    console.log('📊 Data Summary:', {
      totalProperties: properties.length,
      activeProperties: activeProperties.length,
      totalInvoices: allInvoicesData.length,
      paidInvoices: paidInvoices.length
    })

    // METHOD 1: Calculate from PAID INVOICES (Most Accurate)
    const paymentsFromInvoices = paidInvoices.map(invoice => {
      const property = properties.find(p => p.id === invoice.hotelId)
      return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        propertyName: invoice.hotelName || property?.name || 'Unknown Property',
        ownerName: invoice.ownerName || property?.ownerName || 'Unknown Owner',
        plan: invoice.plan || property?.subscription?.plan || 'standard',
        amount: parseFloat(invoice.amount) || 0,
        paymentDate: invoice.paidAt || invoice.createdAt,
        status: 'completed',
        source: 'invoice'
      }
    })

    // METHOD 2: Calculate from subscription start dates (for historical data)
    const paymentsFromSubscriptions = properties
      .filter(p => p.subscription?.startDate && p.subscription?.amount)
      .map(p => ({
        id: p.id,
        invoiceNumber: `SUB-${p.id.substring(0, 8)}`,
        propertyName: p.name,
        ownerName: p.ownerName,
        plan: p.subscription.plan || 'standard',
        amount: parseFloat(p.subscription.amount) || 0,
        paymentDate: p.subscription.startDate?.toDate?.() || p.subscription.paidAt?.toDate?.() || p.createdAt,
        status: 'completed',
        source: 'subscription'
      }))

    // COMBINE both sources, removing duplicates
    const allPayments = [...paymentsFromInvoices]
    
    // Add subscription payments only if no invoice exists for that property
    paymentsFromSubscriptions.forEach(subPayment => {
      const exists = paymentsFromInvoices.some(invPayment => 
        invPayment.propertyName === subPayment.propertyName &&
        Math.abs(new Date(invPayment.paymentDate) - new Date(subPayment.paymentDate)) < (1000 * 60 * 60 * 24 * 30) // Within 30 days
      )
      if (!exists) {
        allPayments.push(subPayment)
      }
    })

    console.log('💰 Payment Sources:', {
      fromInvoices: paymentsFromInvoices.length,
      fromSubscriptions: paymentsFromSubscriptions.length,
      totalCombined: allPayments.length
    })

    // Update recent payments (last 10, most recent first)
    recentPayments.value = allPayments
      .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
      .slice(0, 10)
    
    console.log('📋 Recent Payments (10):', recentPayments.value.map(p => ({
      property: p.propertyName,
      amount: p.amount,
      date: formatDate(p.paymentDate),
      source: p.source
    })))

    // Calculate revenue stats
    const totalRevenue = allPayments.reduce((sum, payment) => sum + payment.amount, 0)
    const totalPayments = allPayments.length
    const averagePayment = totalPayments > 0 ? totalRevenue / totalPayments : 0
    const activeSubscriptions = activeProperties.length
    
    console.log('📈 Revenue Stats:', {
      totalRevenue,
      totalPayments,
      averagePayment,
      activeSubscriptions
    })

    // Calculate current period revenue
    const currentDate = new Date()
    const currentPeriodPayments = allPayments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate)
      if (revenuePeriod.value === 'monthly') {
        return paymentDate.getMonth() === currentDate.getMonth() && 
               paymentDate.getFullYear() === currentDate.getFullYear()
      } else {
        return paymentDate.getFullYear() === currentDate.getFullYear()
      }
    })
    
    const currentPeriodRevenue = currentPeriodPayments.reduce((sum, payment) => sum + payment.amount, 0)

    // Calculate growth (compare with previous period)
    const previousPeriodPayments = allPayments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate)
      if (revenuePeriod.value === 'monthly') {
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        return paymentDate.getMonth() === prevMonth.getMonth() && 
               paymentDate.getFullYear() === prevMonth.getFullYear()
      } else {
        return paymentDate.getFullYear() === currentDate.getFullYear() - 1
      }
    })
    
    const previousPeriodRevenue = previousPeriodPayments.reduce((sum, payment) => sum + payment.amount, 0)
    
    let growth = 0
    if (previousPeriodRevenue > 0) {
      growth = ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
    } else if (currentPeriodRevenue > 0) {
      growth = 100 // First time revenue
    }

    console.log('📊 Period Comparison:', {
      currentPeriod: {
        revenue: currentPeriodRevenue,
        payments: currentPeriodPayments.length
      },
      previousPeriod: {
        revenue: previousPeriodRevenue,
        payments: previousPeriodPayments.length
      },
      growth: growth
    })

    // Update revenue stats
    revenueStats.value = { 
      currentPeriod: currentPeriodRevenue,
      growth: Math.round(growth * 100) / 100, // Round to 2 decimal places
      totalPayments: totalPayments,
      averagePayment: Math.round(averagePayment * 100) / 100,
      activeSubscriptions: activeSubscriptions
    }

    // Update main stats
    stats.value.totalRevenue = totalRevenue

    // Generate revenue chart data
    generateRevenueChartData(allPayments)

    // Generate available years
    generateAvailableYears(allPayments)

  } catch (error) {
    console.error('❌ Error loading revenue data:', error)
    // Set default values on error
    revenueStats.value = { 
      currentPeriod: 0,
      growth: 0,
      totalPayments: 0,
      averagePayment: 0,
      activeSubscriptions: 0
    }
    stats.value.totalRevenue = 0
    recentPayments.value = []
  }
}

// Update generateRevenueChartData to work with payment objects
const generateRevenueChartData = (payments) => {
  if (!payments || payments.length === 0) {
    revenueData.value = []
    return
  }

  if (revenuePeriod.value === 'monthly') {
    // Monthly data for selected year
    const monthlyData = Array(12).fill(0).map((_, index) => ({
      label: new Date(selectedYear.value, index).toLocaleDateString('en-US', { month: 'short' }),
      amount: 0
    }))

    payments.forEach(payment => {
      const paymentDate = new Date(payment.paymentDate)
      if (paymentDate.getFullYear() === selectedYear.value) {
        monthlyData[paymentDate.getMonth()].amount += payment.amount
      }
    })

    revenueData.value = monthlyData
  } else {
    // Yearly data - last 5 years
    const currentYear = new Date().getFullYear()
    const yearlyData = Array(5).fill(0).map((_, index) => {
      const year = currentYear - 4 + index
      return {
        label: year.toString(),
        amount: 0
      }
    })

    payments.forEach(payment => {
      const paymentDate = new Date(payment.paymentDate)
      const paymentYear = paymentDate.getFullYear()
      const dataIndex = yearlyData.findIndex(item => parseInt(item.label) === paymentYear)
      if (dataIndex !== -1) {
        yearlyData[dataIndex].amount += payment.amount
      }
    })

    revenueData.value = yearlyData
  }
}


const generateAvailableYears = (payments) => {
  const years = new Set()
  const currentYear = new Date().getFullYear()
  
  // Add current and previous 4 years
  for (let i = currentYear - 4; i <= currentYear; i++) {
    years.add(i)
  }

  // Add years from payments
  payments.forEach(payment => {
    const paymentDate = new Date(payment.paymentDate)
    years.add(paymentDate.getFullYear())
  })

  availableYears.value = Array.from(years).sort((a, b) => b - a)
  
  // Set default selected year to current year if available
  if (!availableYears.value.includes(selectedYear.value)) {
    selectedYear.value = availableYears.value[0] || currentYear
  }
}




const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    const dateObj = date?.toDate ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid Date'
  }
}

const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    router.push('/')
  } catch (error) {
    console.error('Sign out error:', error)
    alert('Error signing out: ' + error.message)
  }
}




// Add these methods to your admin dashboard script

const getSubscriptionStatusClass = (subscription) => {
  if (!subscription) return 'text-gray-600'
  
  const status = subscription.status
  const classes = {
    'active': 'text-green-600',
    'expired': 'text-red-600',
    'suspended': 'text-yellow-600',
    'pending_payment': 'text-orange-600',
    'trial': 'text-blue-600'
  }
  return classes[status] || 'text-gray-600'
}

const isTrialActive = (property) => {
  if (!property.subscription?.trialEndDate) return false
  const trialEnd = new Date(property.subscription.trialEndDate)
  const now = new Date()
  return trialEnd > now && property.subscription.status === 'active'
}



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

/* Improved modal styles */
.modal-content {
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

/* Smooth scroll for modal content */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

/* Fix for receipt image container */
.receipt-image-container {
  min-height: 300px;
  max-height: 500px;
}

/* Responsive improvements */
@media (max-width: 1024px) {
  .receipt-modal-grid {
    grid-template-columns: 1fr;
  }
}
</style>

