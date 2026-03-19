import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, db } from '@/firebase'
import { 
  signInWithEmailAndPassword, 
  signOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userRole = ref(null)
  const userData = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isOwner = computed(() => userRole.value === 'owner')
  const isReception = computed(() => userRole.value === 'reception')
  const isHotelAdmin = computed(() => userRole.value === 'hotel_admin')
  const isSuperAdmin = computed(() => userRole.value === 'super_admin')

  // Initialize auth state listener
  const init = () => {
 
  }

  // Fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      // Check users collection first
      const userDoc = await getDoc(doc(db, 'users', uid))
      
      if (userDoc.exists()) {
        userData.value = userDoc.data()
        userRole.value = userData.value.role
        return
      }

      // Check staffs collection
      const staffDoc = await getDoc(doc(db, 'staffs', uid))
      if (staffDoc.exists()) {
        userData.value = staffDoc.data()
        userRole.value = userData.value.role
        return
      }

      // If no user data found, sign out
      await signOut(auth)
      user.value = null
      userRole.value = null
      userData.value = null
      error.value = 'User account not found in system'
    } catch (err) {
      console.error('Error fetching user data:', err)
      error.value = 'Failed to load user data'
      throw err
    }
  }

  // Login function
  const login = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      await fetchUserData(user.value.uid)
      
      return { success: true }
    } catch (err) {
      error.value = getErrorMessage(err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      userRole.value = null
      userData.value = null
      error.value = null
    } catch (err) {
      error.value = getErrorMessage(err)
    }
  }

  // Get appropriate error message
  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address format'
      case 'auth/user-disabled':
        return 'This account has been disabled'
      case 'auth/user-not-found':
        return 'No account found with this email'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection'
      default:
        return 'Login failed. Please try again'
    }
  }

  return {
    // State
    user,
    userRole,
    userData,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isOwner,
    isReception,
    isHotelAdmin,
    isSuperAdmin,
    
    // Actions
    init,
    login,
    logout,
    fetchUserData
  }
})