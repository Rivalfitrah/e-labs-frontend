<!-- /layouts/dashboard.vue -->
<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/layouts/sidebar.vue'
import HeaderDashboard from '@/components/layouts/HeaderDashboard.vue'

// sidebar open state is managed here so Header and Sidebar can communicate
const sidebarOpen = ref(false)

</script>

<template>
  <div class="flex min-h-screen overflow-hidden">
    <!-- Sidebar: controlled via prop for responsive toggle -->
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 md:ml-64 flex flex-col min-w-0">
      <div class="sticky top-0 z-30">
        <!-- Header will emit toggle-sidebar event -->
        <HeaderDashboard :is-sidebar-open="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      </div>
      <main class="flex-1 p-6 bg-gray-100 min-h-screen overflow-x-hidden pt-20">
        <slot />
      </main>
    </div>
  </div>
</template>
