<script setup>
import UiInfoBox from '~/components/ui/infoBox.vue'
import { 
  Search, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Square,
  Calendar, // Icon untuk Total
  Clock,    // Icon untuk Pending
} from 'lucide-vue-next'

import { getListPengajuanRuanganTerjadwal, verifikasiPengajuanRuanganTerjadwal, cancelRuangan, SelesaiRuangan } from '~/lib/api/peminjaman/terjadwal/peminjamanRuangan'
import { onMounted, ref, computed, watch } from 'vue' // pastikan watch diimport
import Swal from 'sweetalert2'
import { getRuanganID } from '~/lib/api/ruangan'

definePageMeta({
  layout: 'dashboard',
  middleware: 'middleware'
})

// --- State for Data (Pengajuan) ---
const pengajuanList = ref([]) 
const isLoading = ref(true)

// --- State for Statistics ---
const pengajuanStats = ref({
  total: 0,
  pending: 0,
  disetujui: 0,
  ditolak: 0
});

// State untuk notifikasi (Toast sederhana)
const notification = ref({ show: false, message: '', type: 'success' });

function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value = { show: false, message: '', type: 'success' };
  }, 3000);
}

// --- Pagination State ---
const currentPage = ref(1)
const itemsPerPage = ref(10)
const search = ref('')
const ruanganDetailCache = ref({})
const ruanganDetails = ref({})

// --- API Fetch & Data Initialization ---
onMounted(async () => {
  await fetchPengajuanList();
})

async function fetchPengajuanList() {
  isLoading.value = true;
  try {
    const apiResponse = await getListPengajuanRuanganTerjadwal()
    // Mengambil array data dari response
    const actualData = apiResponse?.data || [];
    pengajuanList.value = actualData;

    // --- HITUNG STATISTIK DARI DATA LIST ---
    const total = actualData.length;
    
    // Asumsi status: 'PENDING'/'DIAJUKAN', 'DISETUJUI', 'DITOLAK'
    const pending = actualData.filter(item => 
      item.status === 'PENDING' || item.status === 'DIAJUKAN'
    ).length;
    
    const disetujui = actualData.filter(item => 
      item.status === 'DISETUJUI'
    ).length;
    
    const ditolak = actualData.filter(item => 
      item.status === 'DITOLAK'
    ).length;

    pengajuanStats.value = {
      total,
      pending,
      disetujui,
      ditolak
    };
    // ---------------------------------------

  } catch (error) {
    console.error('Failed to fetch scheduled room requests list:', error)
    showNotification('Gagal memuat data pengajuan ruangan terjadwal.', 'error');
    pengajuanList.value = [];
  } finally {
    isLoading.value = false
  }
}

// --- Computed Properties for Pagination & Filtering ---
// 1. Filtered Data
const filteredPengajuan = computed(() => {
  const query = search.value.toLowerCase().trim();
  const dataArray = Array.isArray(pengajuanList.value) ? pengajuanList.value : [];

  if (!query) {
    return dataArray;
  }
  return dataArray.filter(item =>
    item.user?.nama?.toLowerCase().includes(query) ||
    item.kegiatan?.toLowerCase().includes(query) ||
    item.status?.toLowerCase().includes(query)
  );
});

// 2. Total Pages
const totalPages = computed(() => {
  return Math.ceil(filteredPengajuan.value.length / itemsPerPage.value)
})

// 3. Paginated Data to Display
const paginatedPengajuan = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPengajuan.value.slice(start, end)
})

// --- Pagination Methods ---
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// --- Action Handlers ---
async function handleApprove(item) {
  Swal.fire({
    title: 'Konfirmasi Persetujuan',
    text: `Anda yakin ingin MENYETUJUI pengajuan kegiatan "${item.kegiatan}" dari ${item.user?.nama}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Setujui',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await verifikasiPengajuanRuanganTerjadwal(item.id, 'DISETUJUI');
        Swal.fire({
          title: 'Berhasil',
          text: `Pengajuan dari ${item.user?.nama} berhasil disetujui.`,
          icon: 'success',
          confirmButtonText: false,
          timer: 1500
        })
        await fetchPengajuanList();
      } catch (error) {
        Swal.fire({
          title: 'Gagal',
          text: 'Gagal menyetujui pengajuan.',
          icon: 'error',
          confirmButtonText: 'Tutup'
        })
      }
    }
  });
}

async function handleReject(item) {
  Swal.fire({
    title: 'Konfirmasi Penolakan',
    text: `Anda yakin ingin MENOLAK pengajuan kegiatan "${item.kegiatan}" dari ${item.user?.nama}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Ya, Tolak',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await cancelRuangan(item.id, 'DITOLAK');
        Swal.fire({
          title: 'Berhasil',
          text: `Pengajuan dari ${item.user?.nama} telah ditolak.`,
          icon: 'success',
          confirmButtonText: false,
          timer: 1500
        });
        await fetchPengajuanList();
      } catch (error) {
        Swal.fire({
          title: 'Gagal',
          text: 'Gagal menolak pengajuan.',
          icon: 'error',
          confirmButtonText: 'Tutup'
        });
      }
    }
  });
}

async function handleSelesai(item) {
  Swal.fire({
    title: 'Selesaikan Peminjaman?',
    text: `Apakah kegiatan "${item.kegiatan}" sudah selesai dan ruangan kosong?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#f59e0b',
    confirmButtonText: 'Ya, Selesai',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await SelesaiRuangan(item.id); 
        Swal.fire({
          title: 'Berhasil',
          text: `Status peminjaman berhasil diubah menjadi SELESAI.`,
          icon: 'success',
          confirmButtonText: false,
          timer: 1500
        });
        await fetchPengajuanList();
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: 'Gagal',
          text: error.response?.data?.message || 'Gagal menyelesaikan peminjaman.',
          icon: 'error',
          confirmButtonText: 'Tutup'
        });
      }
    }
  });
}

// --- Formatting Helpers ---
function formatTime(dateTimeString) {
  if (!dateTimeString) return 'N/A';
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' });
  } catch {
    return 'Waktu Invalid';
  }
}

function formatDate(dateTimeString) {
  if (!dateTimeString) return 'N/A';
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Jakarta' });
  } catch {
    return 'Tanggal Invalid';
  }
}

function handleViewDetail(item) {
  Swal.fire({
    title: `Detail Pengajuan #${item.id}`,
    html: `
            <div class="text-left space-y-2">
                <p><strong>Peminjam:</strong> ${item.user?.nama || 'N/A'} (${item.user?.NIM || item.user?.NIP || 'N/A ID'})</p>
                <p><strong>Kegiatan:</strong> ${item.kegiatan || 'Tanpa Keterangan'}</p>
                <p><strong>Tanggal:</strong> ${formatDate(item.tanggal)}</p>
                <p><strong>Waktu:</strong> ${formatTime(item.jam_mulai)} - ${formatTime(item.jam_selesai)}</p>
                <p><strong>Status:</strong> <span class="font-bold text-lg">${item.status}</span></p>
                ${item.responden ? `<p><strong>Direspon Oleh:</strong> ${item.responden.nama}</p>` : ''}
            </div>
        `,
    icon: 'info',
    confirmButtonText: 'Tutup'
  });
}

function dokumenBadge(dokumen) {
  if (!dokumen) return '';
  return `<a href="${dokumen}" target="_blank" class="underline text-blue-600 hover:text-blue-800">Download</a>`;
}

async function getRuanganDetail(ruangan_id) {
  if (!ruangan_id) return null
  if (ruanganDetailCache.value[ruangan_id]) {
    return ruanganDetailCache.value[ruangan_id]
  }
  try {
    const res = await getRuanganID(ruangan_id)
    const detail = res?.data || null
    if (detail) ruanganDetailCache.value[ruangan_id] = detail
    return detail
  } catch {
    return null
  }
}

function formatCreatedAt(createdAt) {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  return date.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
}

async function ensureRuanganDetails() {
  const ids = paginatedPengajuan.value.map(item => item.ruangan_id).filter(Boolean)
  for (const id of ids) {
    if (!ruanganDetails.value[id]) {
      const detail = await getRuanganDetail(id)
      if (detail) ruanganDetails.value[id] = detail
    }
  }
}

watch(paginatedPengajuan, () => {
  ensureRuanganDetails()
})
</script>


<template>
  <div>
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

    <section class="mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <UiInfoBox type="total" class="hover:scale-105 transition-transform duration-200">
          <template #title>
            <span class="flex items-center gap-2">
              <Calendar class="w-4 h-4 text-primary" />
              Total Pengajuan
            </span>
          </template>
          <span class="text-2xl font-bold text-primary">
            {{ pengajuanStats.total }}
          </span>
        </UiInfoBox>

        <UiInfoBox type="dipinjam" class="hover:scale-105 transition-transform duration-200">
          <template #title>
            <span class="flex items-center gap-2">
              <Clock class="w-4 h-4 text-yellow-600" />
              Menunggu Konfirmasi
            </span>
          </template>
          <span class="text-2xl font-bold text-yellow-600">
            {{ pengajuanStats.pending }}
          </span>
        </UiInfoBox>

        <UiInfoBox type="tersedia" class="hover:scale-105 transition-transform duration-200">
          <template #title>
            <span class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-green-600" />
              Disetujui
            </span>
          </template>
          <span class="text-2xl font-bold text-green-600">
            {{ pengajuanStats.disetujui }}
          </span>
        </UiInfoBox>

        <UiInfoBox type="rusak" class="hover:scale-105 transition-transform duration-200">
          <template #title>
            <span class="flex items-center gap-2">
              <XCircle class="w-4 h-4 text-red-600" />
              Ditolak
            </span>
          </template>
          <span class="text-2xl font-bold text-red-600">
            {{ pengajuanStats.ditolak }}
          </span>
        </UiInfoBox>

      </div>
    </section>

    <div class="flex flex-col md:flex-row md:items-center gap-2 mb-4">
      <div class="flex relative w-full">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" v-model="search"
          class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
          placeholder="Cari Peminjam, Kegiatan, atau Status..." />
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-8 text-lg text-gray-500">
      Memuat data pengajuan ruangan terjadwal...
    </div>

    <div v-else-if="pengajuanList.length === 0"
      class="text-center py-8 text-lg text-gray-500 border border-dashed rounded-lg p-10 bg-white">
      Tidak ada data pengajuan ruangan terjadwal yang ditemukan.
    </div>

    <div v-else class="shadow-xl rounded-xl overflow-hidden bg-white">
      <div
        class="bg-blue-50 border-b border-blue-200 px-4 py-2 text-sm text-blue-700 flex items-center gap-2 lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Geser ke kanan untuk melihat lebih banyak kolom</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-separate border-spacing-0 min-w-[1400px]">
          <thead>
            <tr class="bg-primary text-white text-center text-sm uppercase tracking-wider">
              <th class="text-center px-4 py-3 w-16 sticky left-0 bg-primary z-10">No</th>
              <th class="text-center px-4 py-3 min-w-[140px]">Peminjam</th>
              <th class="text-center px-4 py-3 min-w-[160px]">Kegiatan</th>
              <th class="text-center px-4 py-3 min-w-[120px]">Gedung</th>
              <th class="text-center px-4 py-3 min-w-[140px]">Ruangan</th>
              <th class="text-center px-4 py-3 min-w-[100px]">Tanggal</th>
              <th class="text-center px-4 py-3 min-w-[120px]">Waktu</th>
              <th class="text-center px-4 py-3 min-w-[100px]">Status</th>
              <th class="text-center px-4 py-3 min-w-[140px]">Responden</th>
              <th class="text-center px-4 py-3 min-w-[100px]">Dokumen</th>
              <th class="text-center px-4 py-3 min-w-[180px] sticky right-0 bg-primary z-10">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-sm text-center">
            <tr v-for="(data, index) in paginatedPengajuan" :key="data.id"
              class="hover:bg-blue-50 transition border-t border-gray-100 group text-center">
              <td
                class="px-4 py-3 font-mono align-middle sticky left-0 bg-white group-hover:bg-blue-50 z-10 border-r border-gray-100">
                <span :title="formatCreatedAt(data.createdAt)">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </span>
              </td>
              <td class="px-4 py-3 text-center align-middle font-semibold">
                <p class="truncate max-w-[140px]">{{ data.user?.nama || 'N/A' }}</p>
                <p class="text-xs text-gray-500 font-normal truncate max-w-[140px]">{{ data.user?.email || '' }}</p>
              </td>
              <td class="px-4 py-3 font-semibold align-middle text-center">
                <span v-if="data.kegiatan" class="line-clamp-2 max-w-[160px]">{{ data.kegiatan }}</span>
                <span v-else class="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">Tanpa
                  Kegiatan</span>
              </td>
              <td class="px-4 py-3 font-mono text-gray-500 align-middle">
                <template v-if="ruanganDetails[data.ruangan_id]">
                  <div class="text-xs text-gray-500 truncate max-w-[120px]">{{ ruanganDetails[data.ruangan_id].gedung }}
                    - {{
                      ruanganDetails[data.ruangan_id].kode_ruangan }}</div>
                </template>
                <template v-else>
                  <span class="italic text-gray-400">Memuat...</span>
                </template>
              </td>
              <td class="px-4 py-3 font-mono text-gray-500 align-middle">
                <template v-if="ruanganDetails[data.ruangan_id]">
                  <div class="font-semibold text-gray-800 truncate max-w-[140px]">{{
                    ruanganDetails[data.ruangan_id].nama_ruangan }}</div>
                </template>
                <template v-else>
                  <span class="italic text-gray-400">Memuat...</span>
                </template>
              </td>
              <td class="px-4 py-3 font-mono text-gray-500 align-middle whitespace-nowrap">
                {{ formatDate(data.tanggal) }}
              </td>
              <td class="px-4 py-3 font-mono text-gray-500 align-middle whitespace-nowrap">
                <div>{{ formatTime(data.jam_mulai) }}</div>
                <div>{{ formatTime(data.jam_selesai) }}</div>
              </td>
              <td class="px-4 py-3 font-mono align-middle">
                <span :class="{
                  'bg-yellow-100 text-yellow-800': data.status === 'PENDING' || data.status === 'DIAJUKAN',
                  'bg-green-100 text-green-800': data.status === 'DISETUJUI' || data.status === 'SELESAI',
                  'bg-red-100 text-red-800': data.status === 'DITOLAK'
                }" class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer inline-block"
                  :title="data.status === 'DISETUJUI' && data.responden ? 'Direspon oleh ' + data.responden.nama : ''">
                  {{ data.status || 'N/A' }}
                </span>
              </td>
              <td class="px-4 py-3 text-center align-middle font-semibold">
                <p class="truncate max-w-[140px]">{{ data.responden?.nama || 'Belum Direspon' }}</p>
              </td>
              <td class="px-4 py-3 text-center align-middle">
                <div v-if="data.dokumen" v-html="dokumenBadge(data.dokumen)" class="truncate max-w-[100px]"></div>
                <span v-else class="text-gray-400 italic">N/A</span>
              </td>
              <td
                class="px-4 py-3 text-center align-middle sticky right-0 bg-white group-hover:bg-blue-50 z-10 border-l border-gray-100">
                <div class="flex justify-center items-center gap-2">
                  <button @click="handleViewDetail(data)"
                    class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                    title="Lihat Detail">
                    <Eye class="w-4 h-4" />
                  </button>
                  <button v-if="data.status === 'DIAJUKAN' || data.status === 'PENDING'" @click="handleApprove(data)"
                    class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                    title="Setujui Pengajuan">
                    <CheckCircle class="w-4 h-4" />
                  </button>
                  <button v-if="data.status === 'DIAJUKAN' || data.status === 'PENDING'" @click="handleReject(data)"
                    class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                    title="Tolak Pengajuan">
                    <XCircle class="w-4 h-4" />
                  </button>
                  <button v-if="data.status === 'DISETUJUI'" @click="handleSelesai(data)"
                    class="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                    title="Tandai Selesai (Early Release)">
                    <Square class="w-4 h-4 fill-current" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedPengajuan.length === 0 && filteredPengajuan.length > 0">
              <td colspan="11" class="text-center py-4 text-gray-500">Tidak ada pengajuan di halaman ini.</td>
            </tr>
            <tr v-else-if="filteredPengajuan.length === 0">
              <td colspan="11" class="text-center py-4 text-gray-500">Tidak ada hasil yang cocok dengan pencarian Anda.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1"
        class="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
        <span class="text-sm text-gray-700">
          Menampilkan
          <span class="font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
          sampai
          <span class="font-semibold">{{ Math.min(currentPage * itemsPerPage, filteredPengajuan.length) }}</span>
          dari
          <span class="font-semibold">{{ filteredPengajuan.length }}</span>
          pengajuan
        </span>

        <nav class="flex items-center space-x-1" aria-label="Pagination">
          <button @click="prevPage" :disabled="currentPage === 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition">
            <ChevronLeft class="w-5 h-5" />
          </button>

          <div class="hidden sm:flex space-x-1">
            <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{
              'bg-primary text-white': page === currentPage,
              'bg-white text-gray-700 hover:bg-gray-100': page !== currentPage
            }" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition">
              {{ page }}
            </button>
          </div>

          <button @click="nextPage" :disabled="currentPage === totalPages"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition">
            <ChevronRight class="w-5 h-5" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>