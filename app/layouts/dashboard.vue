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
      <!-- Fixed Header -->
      <div class="fixed top-0 right-0 left-0 md:left-64 z-30 bg-white">
        <!-- Header will emit toggle-sidebar event -->
        <HeaderDashboard :is-sidebar-open="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      </div>
      <!-- Main Content with proper padding-top to offset fixed header -->
      <main class="flex-1 p-6 bg-gray-100 min-h-screen overflow-x-hidden pt-[85px]">
        <slot />
      </main>
    </div>
  </div>
</template>
