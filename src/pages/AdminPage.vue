<script setup>
import { useAuth } from "@/composables/useAuth";
import SuperAdminDashboard from "@/components/SuperAdminDashboard.vue";
import ReceptionDashboard from "@/components/ReceptionDashboard.vue";

const {  userRole, initAuth } = useAuth();
initAuth();
</script>

<template>
  <div v-if="userRole === 'superadmin'">
    <SuperAdminDashboard />
  </div>
  
  <div v-else-if="userRole === 'reception'">
    <ReceptionDashboard />
  </div>
  <div v-else>
    <p>Loading or unauthorized...</p>
  </div>
</template>
