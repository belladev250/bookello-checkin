// src/composables/useAuth.js
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the import path as necessary
import { ref } from "vue";

export const useAuth = () => {
  const user = ref(null);
  const userRole = ref(null);

  const fetchUserRole = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      userRole.value = docSnap.data().role;
    }
  };

  const initAuth = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        user.value = u;
        await fetchUserRole(u.uid);
      }
    });
  };

  return { user, userRole, initAuth };
};
