<!-- /layouts/dashboard.vue -->
<script setup>
import Sidebar from '@/components/layouts/sidebar.vue'
import HeaderDashboard from '@/components/layouts/HeaderDashboard.vue'

</script>

<template>
  <div class="flex min-h-screen overflow-hidden">
    <Sidebar />
    <div class="flex-1 ml-64 flex flex-col min-w-0">
      <div class="sticky top-0 z-50">
        <HeaderDashboard />
      </div>
      <main class="flex-1 p-6 bg-gray-100 min-h-screen overflow-x-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>
