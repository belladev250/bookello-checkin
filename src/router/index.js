import { createRouter, createWebHistory } from 'vue-router'  
import Login from '../pages/LoginPage.vue'
import ReceptionDashboard from '@/components/ReceptionDashboard.vue'
import SuperAdminDashboard from '@/components/SuperAdminDashboard.vue'
import QrGenerator from '@/components/QrGenerator.vue'
import CheckinPage from '../pages/CheckinPage.vue'
import landingPage from '@/pages/landingPage.vue'
import RegisterHotel from '@/pages/RegisterHotel.vue'
import AdminDashboard from '@/pages/AdminDashboard.vue'
import HotelLogin from '@/pages/HotelLogin.vue'
import OwnerDashboard from '@/pages/OwnerDashboard.vue'
import AdminPage from '../pages/AdminPage.vue'
import AdminSetup from '@/pages/AdminSetup.vue'
import PaymentCallback from '@/pages/PaymentCallback.vue'
import PaymentCancelled from '@/pages/PaymentCancelled.vue'
import ForgotPassword from '@/pages/ForgotPassword.vue'
import ResetPassword from '@/pages/ResetPassword.vue'
import { auth, db } from '@/firebase'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const routes = [
  { 
    path: '/checkin/:hotelId?',  
    name: 'Checkin',
    component: CheckinPage 
  },  
  { 
    path: '/',  
    name: 'RegisterHotel',
    component: HotelLogin,
    meta: { requiresGuest: true }
  },  
  { 
    path: '/adminDashboard',  
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },  
  { 
    path: '/admin',
    name: 'Admin', 
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { 
    path: '/owner/dashboard', 
    name: 'OwnerDashboard',
    component: OwnerDashboard,
    meta: { requiresAuth: true }
  },  
  { 
    path: '/admin-setup',
    name: 'AdminSetup',
    component: AdminSetup
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login 
  },
  { 
    path: '/hotel-register', 
    name: 'HotelRegister', 
    component: RegisterHotel
  },
  { 
    path: '/reception-dashboard', 
    name: 'receptiondashboard', 
    component: ReceptionDashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/super-admin-dashboard', 
    name: 'admindashboard', 
    component: SuperAdminDashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/qr-generator', 
    name: "QrGenerator",
    component: QrGenerator,
    meta: { requiresAuth: true }
  },
  { 
    path: '/landing', 
    name: 'landingPage', 
    component: landingPage 
  },
  {
  path: '/payment-callback',
  name: 'PaymentCallback',
  component: PaymentCallback
},
  {
  path: '/payment-cancelled',
  name: 'PaymentCancelled',
  component: PaymentCancelled
},
 {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  }


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Wait for Firebase to initialize auth state
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}

// Get user role from database
const getUserRole = async (user) => {
  if (!user) return null

  try {
    // Check users collection
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (userDoc.exists()) {
      return userDoc.data().role
    }

    // Check staffs collection
    const staffDoc = await getDoc(doc(db, 'staffs', user.uid))
    if (staffDoc.exists()) {
      return staffDoc.data().role
    }

    return null
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

// Check if admin exists
const checkAdminExists = async () => {
  try {
    const usersSnap = await getDocs(collection(db, 'users'))
    return usersSnap.docs.some(doc => doc.data().role === 'admin')
  } catch (error) {
    console.error('Error checking admin:', error)
    return false
  }
}

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // Wait for Firebase to initialize
  const currentUser = await getCurrentUser()
  const userRole = currentUser ? await getUserRole(currentUser) : null

  // Admin setup route handling
  if (to.path === '/admin-setup') {
    const hasAdmin = await checkAdminExists()
    if (hasAdmin) {
      next('/')
    } else {
      next()
    }
    return
  }

  // Check if admin routes require setup
  if (requiresAdmin && !currentUser) {
    const hasAdmin = await checkAdminExists()
    if (!hasAdmin) {
      next('/admin-setup')
    } else {
      next('/')
    }
    return
  }

  // Verify admin role for admin routes
  if (requiresAdmin && currentUser) {
    if (userRole === 'admin' || userRole === 'sub_admin'){
      next()
    } else {
      next('/')
    }
    return
  }

  // Protect authenticated routes
  if (requiresAuth && !currentUser) {
    next('/')
    return
  }

  // Redirect logged-in users away from guest pages (login)
  if (requiresGuest && currentUser) {
    switch (userRole) {
      case 'admin':
        next('/adminDashboard')
        break

     case 'sub_admin': 
      next('/adminDashboard')
      break
      case 'owner':
        next('/owner/dashboard')
        break
      case 'reception':
        next('/reception-dashboard')
        break
      case 'super_admin':
      case 'hotel_admin':
        next('/super-admin-dashboard')
        break
      default:
        next()
    }
    return
  }

  next()
})

export default router