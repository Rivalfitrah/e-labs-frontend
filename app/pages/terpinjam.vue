<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getAllRuangan } from '@/lib/api/ruangan/ruanganApi'

definePageMeta({
  layout: "landing-page",
})

// State
const rooms = ref<any[]>([])
const loading = ref(true)

// Map status from API to display text (same as ruangan.vue)
const getStatusText = (status: string) => {
  if (status === 'PENDING') return 'Pending'
  if (status === 'DIAJUKAN') return 'Diajukan'
  if (status === 'DIPAKAI') return 'Dipakai'
  return 'Tersedia' // Default
}

// Fetch all rooms (not just available)
const fetchAvailableRooms = async () => {
  loading.value = true
  try {
    const allRooms = await getAllRuangan()
    // Show ALL rooms like ruangan.vue does
    if (allRooms && Array.isArray(allRooms)) {
      rooms.value = allRooms
    }
  } catch (error) {
    console.error('Error fetching available rooms:', error)
  } finally {
    loading.value = false
  }
}

// Refresh data
const refreshData = () => {
  fetchAvailableRooms()
}

onMounted(() => {
  fetchAvailableRooms()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-6">
      <div class="bg-white rounded-lg shadow p-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Ruangan Tersedia</h1>
          <p class="text-sm text-gray-500 mt-1">Daftar ruangan yang sedang kosong</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm text-gray-500">Total Ruangan</p>
            <p class="text-3xl font-bold text-green-600">{{ rooms.length }}</p>
          </div>
          <button 
            @click="refreshData"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="loading"
          >
            <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span v-else>...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                No
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Nama Ruangan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Gedung
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Kapasitas
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <!-- Loading State -->
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                Memuat data...
              </td>
            </tr>

            <!-- Data Rows -->
            <tr 
              v-else
              v-for="(room, index) in rooms" 
              :key="room.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ room.nama_ruangan }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ room.gedung || '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ room.kapasitas || '-' }}
              </td>
              <td class="px-6 py-4 text-center">
                <span 
                  class="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-full border"
                  :class="{
                    'bg-green-100 text-green-700 border-green-300': getStatusText(room.status) === 'Tersedia',
                    'bg-yellow-100 text-yellow-700 border-yellow-300': getStatusText(room.status) === 'Pending',
                    'bg-red-100 text-red-700 border-red-300': getStatusText(room.status) === 'Diajukan',
                    'bg-gray-100 text-gray-700 border-gray-300': getStatusText(room.status) === 'Dipakai'
                  }"
                >
                  {{ getStatusText(room.status) }}
                </span>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="!loading && rooms.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <p class="text-gray-500 font-medium">Tidak ada ruangan tersedia</p>
                <p class="text-gray-400 text-sm mt-1">Semua ruangan sedang digunakan</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>