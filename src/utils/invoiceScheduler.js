import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export class InvoiceScheduler {
  static async checkExpiringSubscriptions() {
    try {
      const hotelsSnap = await getDocs(collection(db, 'Hotels'))
      const now = new Date()
      
      for (const docSnap of hotelsSnap.docs) {
        const hotel = { id: docSnap.id, ...docSnap.data() }
        const subscription = hotel.subscription
        
        if (!subscription || !subscription.expiryDate) continue
        
        const expiryDate = subscription.expiryDate?.toDate?.() || new Date(subscription.expiryDate)
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))
        
        // Generate reminder invoice 7 days before expiry
        if (daysUntilExpiry === 7) {
          await this.createRenewalInvoice(hotel)
        }
        
        // Mark as expired if past due
        if (daysUntilExpiry < 0 && subscription.status === 'active') {
          await this.markAsExpired(hotel)
        }
      }
    } catch (error) {
      console.error('Error checking expiring subscriptions:', error)
    }
  }
  
  static async createRenewalInvoice(hotel) {
    try {
      // Check if invoice already exists
      const invoicesQuery = query(
        collection(db, 'invoices'),
        where('hotelId', '==', hotel.id),
        where('status', 'in', ['pending', 'overdue'])
      )
      
      const existingInvoices = await getDocs(invoicesQuery)
      
      if (!existingInvoices.empty) return // Invoice already exists
      
      const plan = hotel.subscription.plan || 'standard'
      const amount = plan === 'standard' ? 20 : 30
      
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14) // Due in 14 days
      
      const invoiceData = {
        hotelId: hotel.id,
        hotelName: hotel.name,
        ownerEmail: hotel.ownerEmail,
        ownerName: hotel.ownerName,
        invoiceNumber: `INV-RENEW-${Date.now()}`,
        amount: amount,
        dueDate: dueDate,
        status: 'pending',
        createdAt: new Date(),
        period: 'monthly',
        description: `Subscription renewal - ${plan.toUpperCase()} Plan`,
        plan: plan,
        isRenewal: true
      }
      
      await addDoc(collection(db, 'invoices'), invoiceData)
      console.log(`Created renewal invoice for ${hotel.name}`)
      
    } catch (error) {
      console.error('Error creating renewal invoice:', error)
    }
  }
  
  static async markAsExpired(hotel) {
    try {
      const hotelRef = doc(db, 'Hotels', hotel.id)
      await updateDoc(hotelRef, {
        'subscription.status': 'expired',
        isActive: false
      })
    } catch (error) {
      console.error('Error marking hotel as expired:', error)
    }
  }
  
  static async checkTrialEndings() {
    try {
      const hotelsSnap = await getDocs(collection(db, 'Hotels'))
      const now = new Date()
      
      for (const docSnap of hotelsSnap.docs) {
        const hotel = { id: docSnap.id, ...docSnap.data() }
        const subscription = hotel.subscription
        
        if (!subscription?.trialEndDate) continue
        
        const trialEndDate = subscription.trialEndDate?.toDate?.() || new Date(subscription.trialEndDate)
        const daysUntilTrialEnd = Math.ceil((trialEndDate - now) / (1000 * 60 * 60 * 24))
        
        // Create invoice 3 days before trial ends
        if (daysUntilTrialEnd === 3) {
          await this.createTrialEndInvoice(hotel)
        }
        
        // End trial if past due
        if (daysUntilTrialEnd < 0 && subscription.status === 'active') {
          await this.endTrial(hotel)
        }
      }
    } catch (error) {
      console.error('Error checking trial endings:', error)
    }
  }
  
  static async createTrialEndInvoice(hotel) {
    try {
      // Similar to createRenewalInvoice but for trial end
      const plan = hotel.subscription.plan || 'standard'
      const amount = plan === 'standard' ? 20 : 30
      
      const dueDate = new Date(hotel.subscription.trialEndDate)
      
      const invoiceData = {
        hotelId: hotel.id,
        hotelName: hotel.name,
        ownerEmail: hotel.ownerEmail,
        ownerName: hotel.ownerName,
        invoiceNumber: `INV-TRIAL-${Date.now()}`,
        amount: amount,
        dueDate: dueDate,
        status: 'pending',
        createdAt: new Date(),
        period: 'monthly',
        description: `First payment after free trial - ${plan.toUpperCase()} Plan`,
        plan: plan,
        isTrialEnd: true
      }
      
      await addDoc(collection(db, 'invoices'), invoiceData)
      console.log(`Created trial end invoice for ${hotel.name}`)
      
    } catch (error) {
      console.error('Error creating trial end invoice:', error)
    }
  }
  
  static async endTrial(hotel) {
    try {
      const hotelRef = doc(db, 'Hotels', hotel.id)
      await updateDoc(hotelRef, {
        'subscription.status': 'pending_payment',
        isActive: false
      })
    } catch (error) {
      console.error('Error ending trial:', error)
    }
  }
}