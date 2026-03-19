import { defineStore } from "pinia";
import {auth ,db} from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,} from 'firebase/auth';
import {doc,setDoc ,getDoc} from 'firebase/firestore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,
    username: null,
    services: [],
    country: null,
  }),

  actions: {
    async register(email, password, role, extraData) {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCred.user.uid

      await setDoc(doc(db, 'users', uid), {
        email,
        role,
        username: extraData.username,
        country: extraData.country,
        services: extraData.services,
      })

      this.user = userCred.user
      this.role = role
      this.username = extraData.username
      this.services = extraData.services || []
      this.country = extraData.country || null
    },

    async login(email, password) {
      const userCred = await signInWithEmailAndPassword(auth, email, password)
      const uid = userCred.user.uid
      const userDoc = await getDoc(doc(db, 'users', uid))
      const userData = userDoc.data()

      this.user = userCred.user
      this.role = userData.role
      this.username = userData.username
      this.services = userData.services || []
      this.country = userData.country || null
    },

    async logout() {
      await signOut(auth)
      this.user = null
      this.role = null
      this.username = null
      this.services = []
      this.country = null
    },
  },
})
