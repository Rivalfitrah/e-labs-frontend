<script setup>
import UiInfoBox from '~/components/ui/infoBox.vue'
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, QrCode, ImageDown } from 'lucide-vue-next'
// Asumsikan fungsi API Ruangan berada di lokasi yang sama atau sudah diimpor
import { listRuangan, updateRuangan, deleteRuangan, createRuangan, qrGenerateRuangan, deleteQR } from '~/lib/api/ruangan'
import { onMounted, ref, computed } from 'vue'
import Swal from 'sweetalert2'
import { storage_URL } from '~/lib/base.js'


definePageMeta({
  layout: 'dashboard'
})

// State for data
const ruangan = ref([])
const isLoading = ref(true)
const isGeneratingQR = ref(false); // State baru untuk loading QR
const qrLoadingIds = ref([]); // Array id ruangan yang sedang proses generate QR
function setQRLoading(id, status) {
  if (status) {
    if (!qrLoadingIds.value.includes(id)) qrLoadingIds.value.push(id);
  } else {
    qrLoadingIds.value = qrLoadingIds.value.filter(qid => qid !== id);
  }
}


// State untuk notifikasi (Toast sederhana)
const notification = ref({ show: false, message: '', type: 'success' });

// Fungsi untuk menampilkan Toast
function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
}


// --- Pagination State ---
const currentPage = ref(1)
const itemsPerPage = ref(10) // Tentukan jumlah item per halaman, sudah diatur ke 10
const search = ref('') // State untuk fitur pencarian

// State for Modals
const isEditModalOpen = ref(false)
const isAddModalOpen = ref(false) // Modal untuk Tambah Ruangan

// Inisialisasi data untuk EDIT
const selectedRuangan = ref({
  id: null,
  gedung: '',
  nama_ruangan: '',
  kode_ruangan: '',
})

// Inisialisasi data untuk TAMBAH BARU
const newRuangan = ref({
  gedung: '',
  nama_ruangan: '',
  kode_ruangan: '',
})


onMounted(async () => {
  try {
    const apiResponse = await listRuangan()
    // PERBAIKAN ROBUST: Mengambil data array ruangan dari response
    const roomsArray = apiResponse?.data || apiResponse;
    const actualData = Array.isArray(roomsArray) ? roomsArray : (roomsArray?.data || []);

    ruangan.value = actualData;

  } catch (error) {
    console.error('Failed to fetch ruangan list:', error)
    showNotification('Gagal memuat data ruangan.', 'error');
    ruangan.value = [];
  } finally {
    isLoading.value = false
  }
})

// --- Computed Properties for Pagination & Filtering ---

// 1. Filtered and Sorted Data (jika ada pencarian atau sorting)
const filteredRuangan = computed(() => {
  const query = search.value.toLowerCase().trim();
  // Pastikan ruangan.value adalah array sebelum di-filter
  const dataArray = Array.isArray(ruangan.value) ? ruangan.value : [];

  if (!query) {
    return dataArray;
  }
  return dataArray.filter(item =>
    item.nama_ruangan?.toLowerCase().includes(query) ||
    item.kode_ruangan?.toLowerCase().includes(query) ||
    item.gedung?.toLowerCase().includes(query)
  );
});

// 2. Total Pages
const totalPages = computed(() => {
  return Math.ceil(filteredRuangan.value.length / itemsPerPage.value)
})

// 3. Paginated Data to Display
const paginatedRuangan = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRuangan.value.slice(start, end)
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

// --- MODAL CONTROL FUNCTIONS ---

function openAddModal() {
  newRuangan.value = {
    gedung: '',
    nama_ruangan: '',
    kode_ruangan: '',
  };
  isAddModalOpen.value = true;
}

function closeAddModal() {
  isAddModalOpen.value = false;
}

function openEditModal(item) {
  selectedRuangan.value = { ...item }
  isEditModalOpen.value = true
}

function closeEditModal() {
  isEditModalOpen.value = false
}

// --- SUBMIT HANDLERS ---

// Handler for regular form submission (Edit Modal)
async function handleSave() {
  const dataToUpdate = {
    gedung: selectedRuangan.value.gedung,
    nama_ruangan: selectedRuangan.value.nama_ruangan,
  };

  try {
    await updateRuangan(selectedRuangan.value.id, dataToUpdate);

    // Update local list
    const index = ruangan.value.findIndex(r => r.id === selectedRuangan.value.id);
    if (index !== -1) {
      Object.assign(ruangan.value[index], selectedRuangan.value);
    }

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Perubahan data ruangan berhasil disimpan!',
      timer: 2000,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Gagal menyimpan perubahan:', error);
    showNotification('Gagal menyimpan perubahan data. Periksa konsol.', 'error');
    return;
  }
  closeEditModal();
}


// Handler for ADD NEW ITEM
async function handleAddSubmit() {
  if (!newRuangan.value.nama_ruangan || !newRuangan.value.kode_ruangan || !newRuangan.value.gedung) {
    showNotification('Semua field wajib diisi.', 'error');
    return;
  }

  try {
    const response = await createRuangan(newRuangan.value);

    const newRuanganData = response.data;

    if (newRuanganData) {
      ruangan.value.push(newRuanganData);
      currentPage.value = totalPages.value;
    } else {
      const freshData = await listRuangan();
      ruangan.value = freshData.data;
    }

    closeAddModal();

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: `Ruangan "${newRuangan.value.nama_ruangan}" berhasil ditambahkan!`,
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    console.error('Gagal menambah ruangan:', error);
    showNotification('Gagal menambah ruangan. Cek konsol dan pastikan Kode Ruangan unik.', 'error');
  }
}


// --- DELETE HANDLERS ---
async function confirmDelete(item) {
  const result = await Swal.fire({
    title: 'Apakah Anda Yakin?',
    text: `Anda akan menghapus ruangan "${item.nama_ruangan}" (${item.kode_ruangan}) secara permanen. Tindakan ini tidak dapat dibatalkan!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  });

  if (result.isConfirmed) {
    await handleDelete(item.id, item.nama_ruangan);
  }
}

async function handleDelete(id, nama_ruangan) {
  try {
    await deleteRuangan(id);

    // Hapus dari array lokal
    ruangan.value = ruangan.value.filter(r => r.id !== id);
    // Atur ulang halaman setelah penghapusan
    if (paginatedRuangan.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }

    // Notifikasi sukses
    Swal.fire({
      title: 'Terhapus!',
      text: `Ruangan "${nama_ruangan}" telah berhasil dihapus.`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    console.error('Gagal menghapus ruangan:', error);
    Swal.fire({
      title: 'Gagal!',
      text: `Gagal menghapus ruangan "${nama_ruangan}". Silakan coba lagi.`,
      icon: 'error'
    });
  }
}
// --- FUNGSI GENERATE QR BARU ---
// Fungsi ini generate QR dengan URL khusus: /booking/aktivasi/[id]

// Update handleGenerateQR agar loading per ruangan
async function handleGenerateQR(item) {
  if (qrLoadingIds.value.includes(item.id)) return; // hanya blokir satu ruangan

  setQRLoading(item.id, true);

  try {
    const urlName = `/booking/aktivasi/${item.id}`;
    const response = await qrGenerateRuangan(item.id, urlName);
    const qrPath = response?.QR_Image || null;

    const index = ruangan.value.findIndex(r => r.id === item.id);
    if (index !== -1 && qrPath) {
      ruangan.value[index].QR_Image_url = qrPath;
    }

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: `QR Code untuk Ruangan ${item.kode_ruangan} berhasil dibuat/diperbarui!`,
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    console.error('Gagal generate QR Code:', error);
    Swal.fire({
      title: 'Gagal Generate QR',
      text: `Gagal membuat QR Code untuk ruangan ${item.kode_ruangan}. Silakan coba lagi.`,
      icon: 'error'
    });
  } finally {
    setQRLoading(item.id, false);
  }
}
// Import deleteQRRuangan dari API
function downloadQR(url, filename) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    });
}
async function handleDeleteQR(item) {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus QR',
    text: `Anda yakin ingin menghapus QR Code untuk ruangan ${item.kode_ruangan}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  });

  if (!result.isConfirmed) return;

  try {
    await deleteQR(item.id);

    const index = ruangan.value.findIndex(r => r.id === item.id);
    if (index !== -1) {
      ruangan.value[index].QR_Image_url = null;
    }

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: `QR Code untuk Ruangan ${item.kode_ruangan} berhasil dihapus!`,
      timer: 2000,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Gagal menghapus QR Code:', error);
    Swal.fire({
      title: 'Gagal Hapus QR',
      text: `Gagal menghapus QR Code untuk ruangan ${item.kode_ruangan}. Silakan coba lagi.`,
      icon: 'error'
    });
  }
}

</script>


<template>


  <!-- Toast Notification -->
  <transition enter-active-class="transition ease-out duration-300 transform"
    enter-from-class="opacity-0 translate-y-full" enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-300 transform" leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-full">
    <div v-if="notification.show" :class="{
      'bg-green-500': notification.type === 'success',
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
        placeholder="Cari Nama Ruangan, Kode, atau Gedung..." />
    </div>
    <button @click="openAddModal"
      class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full md:w-auto font-medium shadow-md">
      Tambah
    </button>
  </div>


  <div v-if="isLoading" class="text-center py-8 text-lg text-gray-500">
    Memuat data ruangan...
  </div>


  <div v-else-if="ruangan.length === 0"
    class="text-center py-8 text-lg text-gray-500 border border-dashed rounded-lg p-10 bg-white">
    Tidak ada data ruangan yang ditemukan. Silakan tambahkan ruangan baru.
  </div>


  <div v-else class="shadow-xl rounded-xl overflow-hidden bg-white">
    <table class="w-full border-separate border-spacing-0">
      <thead>
        <tr class="bg-primary text-white text-center text-sm uppercase tracking-wider">
          <th class="text-center  px-5 py-3 w-12">No</th>
          <th class="text-center  px-5 py-3 w-40">Gedung</th>
          <th class="text-center  px-5 py-3 w-56">Nama Ruangan</th>
          <th class="text-center  px-5 py-3 w-32">Kode Ruangan</th>
          <th class="text-center  px-5 py-3 w-32">Status Ruangan</th>
          <th class="text-center  px-5 py-3 w-32">QR Code</th>
          <th class="text-center px-5 py-3 w-32">Aksi</th>
        </tr>
      </thead>
      <tbody class="text-gray-700 text-sm text-center">

        <tr v-for="(data, index) in paginatedRuangan" :key="data.kode_ruangan"
          class="hover:bg-gray-50 transition border-t border-gray-100">
          <td class="px-5 py-3 font-mono align-middle">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td class="px-5 py-3 font-semibold align-middle">
            <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
              {{ data.gedung }}
            </span>
          </td>
          <td class="px-5 py-3 font-semibold align-middle">{{ data.nama_ruangan }}</td>
          <td class="px-5 py-3 font-mono text-gray-500 align-middle">{{ data.kode_ruangan }}</td>
          <td class="px-5 py-3 font-mono align-middle">
            <span :class="{
              'bg-green-100 text-green-800': data.status === 'Tersedia',
              'bg-red-100 text-red-800': data.status === 'Tidak Tersedia'
            }" class="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
              {{ data.status || 'N/A' }}
            </span>
          </td>
          <td class="px-5 py-3 align-middle">
            <div
              class="w-12 h-12 overflow-hidden border border-gray-300 flex-shrink-0 mx-auto flex items-center justify-center">
              <img v-if="qrLoadingIds.includes(data.id)" src="https://placehold.co/40x40/f1f1f1/333333?text=..."
                alt="Loading QR" class="w-full h-full object-cover" />
              <img v-else
                :src="data.QR_Image_url ? `${storage_URL}/uploads/${data.QR_Image_url}` : 'https://placehold.co/40x40/f1f1f1/333333?text=QR'"
                alt="QR Code Ruangan" class="w-full h-full object-cover"
                @error="event.target.src = 'https://placehold.co/40x40/f1f1f1/333333?text=QR'" />
            </div>
          </td>
          <td class="px-5 py-3 text-center align-middle">
            <div class="flex justify-center items-center gap-2">

              <!-- Tombol Generate QR -->
              <button @click="handleGenerateQR(data)" :disabled="isGeneratingQR"
                :class="{ 'opacity-60 cursor-not-allowed': isGeneratingQR }"
                class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                <QrCode class="inline w-4 h-4" />
              </button>
              <!-- Tombol delete QR -->
              <button @click="handleDeleteQR(data)" :disabled="isGeneratingQR"
                :class="{ 'opacity-60 cursor-not-allowed': isGeneratingQR }"
                class="bg-red-800 hover:bg-red-900 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                <QrCode class="inline w-4 h-4" />
              </button>
              <!-- Tombol Download QR -->
              <a v-if="data.QR_Image_url" href="javascript:void(0)"
                @click.stop="downloadQR(`${storage_URL}/uploads/${data.QR_Image_url}`, `QR_${data.gedung}_Ruangan_${data.kode_ruangan}.png`)"
                class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center"
                title="Download QR Code">
                <ImageDown class="inline w-4 h-4" />
              </a>
              <!-- Tombol Edit -->
              <button @click="openEditModal(data)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                <Pencil class="inline w-4 h-4" />
              </button>

              <!-- Tombol Delete -->
              <button @click="confirmDelete(data)"
                class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                <Trash2 class="inline w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="paginatedRuangan.length === 0 && filteredRuangan.length > 0">
          <td colspan="7" class="text-center py-4 text-gray-500">Tidak ada ruangan di halaman ini.</td>
          <!-- Colspan diubah menjadi 7 -->
        </tr>
        <tr v-else-if="filteredRuangan.length === 0">
          <td colspan="7" class="text-center py-4 text-gray-500">Tidak ada hasil yang cocok dengan pencarian Anda.</td>
          <!-- Colspan diubah menjadi 7 -->
        </tr>
      </tbody>
    </table>

    <!-- Pagination Dinamis -->
    <div v-if="totalPages > 1" class="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
      <span class="text-sm text-gray-700">
        Menampilkan
        <span class="font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
        sampai
        <span class="font-semibold">{{ Math.min(currentPage * itemsPerPage, filteredRuangan.length) }}</span>
        dari
        <span class="font-semibold">{{ filteredRuangan.length }}</span>
        ruangan
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


  <!-- Edit Ruangan Modal -->
  <div v-if="isEditModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
    @click.self="closeEditModal">

    <div class="absolute inset-0 bg-black opacity-50"></div>


    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 scale-100 opacity-100"
      @click.stop>

      <h2 class="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
        Ubah Data Ruangan: <span class="text-primary">{{ selectedRuangan?.nama_ruangan }}</span>
      </h2>


      <button @click="closeEditModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>


      <form v-if="selectedRuangan" @submit.prevent="handleSave" class="space-y-4">

        <!-- Kode Ruangan (Read-only) -->
        <div>
          <label for="modal_kode_ruangan" class="block text-sm font-medium text-gray-700 mb-1">Kode Ruangan</label>
          <input id="modal_kode_ruangan" type="text" :value="selectedRuangan.kode_ruangan"
            class="w-full border border-gray-200 bg-gray-50 rounded-lg p-2 cursor-not-allowed text-gray-500" disabled />
        </div>

        <!-- Nama Ruangan -->
        <div>
          <label for="modal_nama_ruangan" class="block text-sm font-medium text-gray-700 mb-1">Nama Ruangan</label>
          <input id="modal_nama_ruangan" type="text" v-model="selectedRuangan.nama_ruangan"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            required />
        </div>

        <!-- Gedung -->
        <div>
          <label for="modal_gedung" class="block text-sm font-medium text-gray-700 mb-1">Gedung</label>
          <input id="modal_gedung" type="text" v-model="selectedRuangan.gedung"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            required />
        </div>


        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="closeEditModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm">
            Batal
          </button>
          <button type="submit"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Tambah Ruangan Modal -->
  <div v-if="isAddModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
    @click.self="closeAddModal">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Modal Content Container -->
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 scale-100 opacity-100"
      @click.stop>

      <h2 class="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
        Tambah Ruangan Baru
      </h2>

      <!-- Close Button -->
      <button @click="closeAddModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Form Tambah Ruangan -->
      <form @submit.prevent="handleAddSubmit" class="space-y-4">

        <!-- Kode Ruangan -->
        <div>
          <label for="add_kode_ruangan" class="block text-sm font-medium text-gray-700 mb-1">Kode Ruangan (ID
            Unik)</label>
          <input id="add_kode_ruangan" type="text" v-model="newRuangan.kode_ruangan"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            required />
        </div>

        <!-- Nama Ruangan -->
        <div>
          <label for="add_nama_ruangan" class="block text-sm font-medium text-gray-700 mb-1">Nama Ruangan</label>
          <input id="add_nama_ruangan" type="text" v-model="newRuangan.nama_ruangan"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            required />
        </div>

        <!-- Gedung -->
        <div>
          <label for="add_gedung" class="block text-sm font-medium text-gray-700 mb-1">Gedung</label>
          <input id="add_gedung" type="text" v-model="newRuangan.gedung"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            required />
        </div>


        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="closeAddModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm">
            Batal
          </button>
          <button type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md">
            Tambah Ruangan
          </button>
        </div>
      </form>
    </div>
  </div>

</template>
