<script setup>
import UiInfoBox from '~/components/ui/infoBox.vue'
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-vue-next'
import { logger } from '~/lib/base'
import { onMounted, ref, computed } from 'vue'
import Swal from 'sweetalert2'

definePageMeta({
  layout: 'dashboard'
})

// --- State for Data (Log) ---
const logList = ref([])
const isLoading = ref(true)
const notification = ref({ show: false, message: '', type: 'success' })

function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value = { show: false, message: '', type: 'success' }
  }, 3000)
}

// --- Pagination State ---
const currentPage = ref(1)
const itemsPerPage = ref(10)
const search = ref('')
// PAGINATION SMART (Dinamis dengan elipsis)
const paginationPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= maxPagesToShow) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');
    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);

    if (current <= 3) end = 4;
    if (current >= total - 2) start = total - 3;

    start = Math.max(start, 2);
    end = Math.min(end, total - 1);

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < total) pages.push(i);
    }

    if (current < total - 2) pages.push('...');
    pages.push(total);
  }
  return pages.filter((page, idx, arr) => page !== '...' || arr[idx - 1] !== '...');
});
// --- API Fetch & Data Initialization ---
onMounted(async () => {
  await fetchLogList()
})

async function fetchLogList() {
  isLoading.value = true
  try {
    const apiResponse = await logger()
    const actualData = apiResponse?.data || []
    logList.value = actualData
  } catch (error) {
    showNotification('Gagal memuat data log.', 'error')
    logList.value = []
  } finally {
    isLoading.value = false
  }
}

// --- Computed Properties for Pagination & Filtering ---
const filteredLog = computed(() => {
  const query = search.value.toLowerCase().trim()
  const dataArray = Array.isArray(logList.value) ? logList.value : []
  if (!query) return dataArray
  return dataArray.filter(item =>
    item.pesan?.toLowerCase().includes(query) ||
    item.aksi?.toLowerCase().includes(query) ||
    item.tabel_terkait?.toLowerCase().includes(query) ||
    item.user?.nama?.toLowerCase().includes(query)
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredLog.value.length / itemsPerPage.value)
})

const paginatedLog = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLog.value.slice(start, end)
})

// --- Pagination Methods ---
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// --- Data Formatting Helpers ---
function formatDate(dateTimeString) {
  if (!dateTimeString) return 'N/A'
  try {
    const date = new Date(dateTimeString)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' +
      date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return 'Tanggal Invalid'
  }
}

function handleViewDetail(item) {
  Swal.fire({
    title: `Detail Log #${item.id}`,
    html: `
      <div class="text-left space-y-2">
        <p><strong>Pesan:</strong> ${item.pesan}</p>
        <p><strong>Aksi:</strong> ${item.aksi}</p>
        <p><strong>Tabel Terkait:</strong> ${item.tabel_terkait}</p>
        <p><strong>User:</strong> ${item.user?.nama || 'N/A'} (${item.user?.email || '-'})</p>
        <p><strong>Waktu:</strong> ${formatDate(item.createdAt)}</p>
      </div>
    `,
    icon: 'info',
    confirmButtonText: 'Tutup'
  })
}
</script>

<template>
  <transition enter-active-class="transition ease-out duration-300 transform"
    enter-from-class="opacity-0 translate-y-full" enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-300 transform" leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-full">
    <div v-if="notification.show" :class="{
      'bg-primary': notification.type === 'success',
      'bg-red-500': notification.type === 'error'
    }" class="fixed bottom-4 right-4 text-white p-4 rounded-lg shadow-xl z-50 transition-all duration-300">
      {{ notification.message }}
    </div>
  </transition>

  <div class="flex flex-col md:flex-row md:items-center gap-2 mb-4">
    <div class="flex relative w-full">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input type="text" v-model="search"
        class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
        placeholder="Cari Pesan, Aksi, Tabel, atau User..." />
    </div>
  </div>

  <div v-if="isLoading" class="text-center py-8 text-lg text-gray-500">
    Memuat data log aktivitas...
  </div>

  <div v-else-if="logList.length === 0"
    class="text-center py-8 text-lg text-gray-500 border border-dashed rounded-lg p-10 bg-white">
    Tidak ada data log aktivitas yang ditemukan.
  </div>

  <div v-else class="shadow-xl rounded-xl overflow-hidden bg-white">
    <div class="overflow-x-auto">
      <table class="min-w-full border-separate border-spacing-0 rounded-xl shadow-sm">
        <thead>
          <tr class="bg-primary text-white text-center text-sm uppercase tracking-wider">
            <th class="px-5 py-3 w-12 rounded-tl-xl">No</th>
            <th class="px-5 py-3 w-40">Pesan</th>
            <th class="px-5 py-3 w-32">Aksi</th>
            <!-- <th class="px-5 py-3 w-32">Tabel Terkait</th> -->
            <th class="px-5 py-3 w-40">User</th>
            <th class="px-5 py-3 w-40">Waktu</th>
            <th class="px-5 py-3 w-32 rounded-tr-xl">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm text-center bg-white">
          <tr v-for="(data, index) in paginatedLog" :key="data.id"
            class="hover:bg-blue-50 transition border-t border-gray-100 group text-center">
            <td class="px-5 py-3 font-mono align-middle">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            <td class="px-5 py-3 align-middle text-justify">
              <span class="font-semibold break-words">{{ data.pesan }}</span>
            </td>
            <td class="px-5 py-3 align-middle">
              <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                {{ data.aksi }}
              </span>
            </td>
            <!-- <td class="px-5 py-3 align-middle">
              <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                {{ data.tabel_terkait }}
              </span>
            </td> -->
            <td class="px-5 py-3 align-middle">
              <span class="font-semibold">{{ data.user?.nama || 'N/A' }}</span>
              <div class="text-xs text-gray-400">{{ data.user?.email || '-' }}</div>
            </td>
            <td class="px-5 py-3 align-middle font-mono">
              {{ formatDate(data.createdAt) }}
            </td>
            <td class="px-5 py-3 align-middle">
              <div class="flex items-center justify-center">
                <button @click="handleViewDetail(data)"
                  class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-110 flex items-center justify-center"
                  title="Lihat Detail">
                  <Eye class="inline w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedLog.length === 0 && filteredLog.length > 0">
            <td colspan="7" class="text-center py-4 text-gray-500">Tidak ada log di halaman ini.</td>
          </tr>
          <tr v-else-if="filteredLog.length === 0">
            <td colspan="7" class="text-center py-4 text-gray-500">Tidak ada hasil yang cocok dengan pencarian Anda.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination Dinamis -->
    <div v-if="totalPages > 1" class="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
      <span class="text-sm text-gray-700">
        Menampilkan
        <span class="font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
        sampai
        <span class="font-semibold">{{ Math.min(currentPage * itemsPerPage, filteredBarang.length) }}</span>
        dari
        <span class="font-semibold">{{ filteredBarang.length }}</span>
        barang
      </span>
      <nav class="flex items-center space-x-1" aria-label="Pagination">
        <button @click="goToPage(1)" :disabled="currentPage === 1"
          class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition">
          &laquo;
        </button>
        <button @click="prevPage" :disabled="currentPage === 1"
          class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <div class="flex space-x-1">
          <template v-for="(page, idx) in paginationPages" :key="idx">
            <button v-if="page !== '...'" @click="goToPage(page)" :class="{
              'bg-primary text-white': page === currentPage,
              'bg-white text-gray-700 hover:bg-gray-100': page !== currentPage
            }" class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition">
              {{ page }}
            </button>
            <span v-else class="px-3 py-2 text-gray-400 select-none text-sm">...</span>
          </template>
        </div>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition">
          <ChevronRight class="w-5 h-5" />
        </button>
        <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages"
          class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition">
          &raquo;
        </button>
      </nav>
    </div>
  </div>
</template>