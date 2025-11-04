<script setup>
import UiInfoBox from '~/components/ui/infoBox.vue'
import UiPagination from '~/components/ui/pagination.vue'
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, Image as ImageIcon, Upload, Package, CheckCircle, Clock, Wrench, XCircle } from 'lucide-vue-next'
// Perhatian: Saya menambahkan createBarang, asumsikan fungsi ini ada di api.js
import { listBarang, updateBarang, deleteBarang, createBarang, getDashboardBarang, getKategoriBarang } from '~/lib/api/barang'
import { onMounted, ref, computed } from 'vue'
import { storage_URL } from '~/lib/base.js'
import Swal from 'sweetalert2'

definePageMeta({
  layout: 'dashboard'
})

// State for data
const barang = ref([])
const isLoading = ref(true)

// State for dashboard statistics
const barangStats = ref(null)


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
const itemsPerPage = ref(5) // Tentukan jumlah item per halaman
const search = ref('') // State untuk fitur pencarian

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
// State for Modals
const isEditModalOpen = ref(false)
const isImageModalOpen = ref(false)
const isAddModalOpen = ref(false) // Modal baru untuk Tambah Barang

// Inisialisasi data untuk EDIT
const selectedBarang = ref({
  id: null,
  nama_barang: '',
  kode_barang: '',
  merek: '',
  kondisi: 'BAIK',
  jumlah: 1,
  status: 'TERSEDIA',
  kategori_id: '', // tambahkan ini
  foto_barang_url: ''
})

// Inisialisasi data untuk TAMBAH BARU
const newBarang = ref({
  nama_barang: '',
  kode_barang: '',
  merek: '',
  kondisi: 'BAIK',
  jumlah: 1,
  status: 'TERSEDIA',
  kategori_id: '', // tambahkan ini
})

const newImageFile = ref(null); // Untuk menampung file gambar di modal tambah

const imageFile = ref(null) // Untuk menampung file gambar yang dipilih/di-drop di modal edit image
const fileInput = ref(null); // Ref untuk input file (digunakan di modal edit image)
const newFileInput = ref(null); // Ref untuk input file (digunakan di modal tambah)


onMounted(async () => {
  try {
    const barangData = await listBarang()
    barang.value = barangData
    
    // Fetch dashboard stats dengan error handling
    try {
      const statsData = await getDashboardBarang()
      // Process barang stats
      if (statsData?.data?.overview) {
        barangStats.value = statsData.data.overview
      }
    } catch (statsError) {
      console.warn('Dashboard endpoint not available, calculating stats from data:', statsError.response?.status)
      // Hitung statistik dari data yang ada sebagai fallback
      const total = barangData.length
      const tersedia = barangData.filter(b => b.status?.toLowerCase() === 'tersedia').length
      const dipinjam = barangData.filter(b => b.status?.toLowerCase() === 'dipinjam').length
      const rusak = barangData.filter(b => b.status?.toLowerCase() === 'rusak' || b.kondisi?.toLowerCase().includes('rusak')).length
      const tidakTersedia = barangData.filter(b => b.status?.toLowerCase() === 'tidak tersedia' || b.status?.toLowerCase() === 'tidak_tersedia').length
      
      barangStats.value = {
        total,
        tersedia,
        dipinjam,
        rusak,
        tidak_tersedia: tidakTersedia
      }
    }
  } catch (error) {
    console.error('Failed to fetch barang list:', error)
    showNotification('Gagal memuat data barang.', 'error');
  } finally {
    isLoading.value = false
  }
})

// get katetgori barang for form select options (if needed)
const kategoriBarang = ref([])
onMounted(async () => {
  try {
    const data = await getKategoriBarang()
    kategoriBarang.value = data
  } catch (error) {
    console.error('Failed to fetch kategori barang:', error)
  }
})
// --- Computed Properties for Pagination & Filtering ---

// 1. Filtered and Sorted Data (jika ada pencarian atau sorting)
const filteredBarang = computed(() => {
  const query = search.value.toLowerCase().trim();
  if (!query) {
    return barang.value;
  }
  return barang.value.filter(item =>
    item.nama_barang.toLowerCase().includes(query) ||
    item.kode_barang.toLowerCase().includes(query) ||
    item.merek.toLowerCase().includes(query)
  );
});

// 2. Total Pages
const totalPages = computed(() => {
  return Math.ceil(filteredBarang.value.length / itemsPerPage.value)
})

// 3. Paginated Data to Display
const paginatedBarang = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBarang.value.slice(start, end)
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

/**
 * Opens the Add modal.
 */
function openAddModal() {
  // Reset form data saat membuka modal
  newBarang.value = {
    nama_barang: '',
    kode_barang: '',
    merek: '',
    kondisi: 'BAIK',
    jumlah: 1,
  };
  newImageFile.value = null;
  isAddModalOpen.value = true;
}

/**
 * Closes the Add modal.
 */
function closeAddModal() {
  isAddModalOpen.value = false;
  newImageFile.value = null;
}


/**
 * Opens the edit modal with the selected item's data.
 */
function openEditModal(item) {
  selectedBarang.value = { ...item }
  isEditModalOpen.value = true
}

/**
 * Closes the edit modal and resets the selected item.
 */
function closeEditModal() {
  isEditModalOpen.value = false
}

/**
 * Opens the image upload modal with the selected item's data.
 */
function openImageModal(item) {
  selectedBarang.value = { ...item }
  imageFile.value = null
  isImageModalOpen.value = true
}

/**
 * Closes the image upload modal and resets related states.
 */
function closeImageModal() {
  isImageModalOpen.value = false
  imageFile.value = null
}

// --- FILE HANDLER FUNCTIONS (GENERALIZED) ---

function validateFile(file) {
  if (!file.type.startsWith('image/')) {
    showNotification('File harus berupa gambar.', 'error');
    return false;
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    showNotification('Ukuran gambar maksimal 5MB.', 'error');
    return false;
  }
  return true;
}

// Handler for file input change in EDIT IMAGE MODAL
function handleFileChange(event) {
  const file = event.target.files[0]
  if (file && validateFile(file)) {
    imageFile.value = file
  }
}

// Handler for file input change in ADD MODAL
function handleNewFileChange(event) {
  const file = event.target.files[0]
  if (file && validateFile(file)) {
    newImageFile.value = file
  }
}

// Handler for drag and drop in EDIT IMAGE MODAL
function handleDrop(event) {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file && validateFile(file)) {
    imageFile.value = file
  }
  event.currentTarget.classList.remove('border-primary', 'border-dashed', 'bg-blue-50');
}

// Handler for drag and drop in ADD MODAL
function handleNewDrop(event) {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file && validateFile(file)) {
    newImageFile.value = file
  }
  event.currentTarget.classList.remove('border-primary', 'border-dashed', 'bg-blue-50');
}

function handleDragOver(event) {
  event.preventDefault()
  event.currentTarget.classList.add('border-primary', 'border-dashed', 'bg-blue-50');
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove('border-primary', 'border-dashed', 'bg-blue-50');
}

// --- SUBMIT HANDLERS ---

// Handler for regular form submission (Edit Modal)
async function handleSave() {
  // Buat objek data yang hanya berisi field yang bisa diubah (kecuali foto)
  const dataToUpdate = {
    nama_barang: selectedBarang.value.nama_barang,
    merek: selectedBarang.value.merek,
    kondisi: selectedBarang.value.kondisi,
    jumlah: selectedBarang.value.jumlah,
    status: selectedBarang.value.status,
    kategori_id: selectedBarang.value.kategori_id // tambahkan ini
  };

  try {
    // Kirim data update non-file
    await updateBarang(selectedBarang.value.id, dataToUpdate);

    // Update local list
    const index = barang.value.findIndex(b => b.id === selectedBarang.value.id);
    if (index !== -1) {
      Object.assign(barang.value[index], selectedBarang.value);
    }

    // Pakai SweetAlert2 untuk notifikasi sukses
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Perubahan data berhasil disimpan!',
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

// Handler for image upload (Edit Image Modal)
async function handleImageUpload() {
  if (!imageFile.value) {
    showNotification('Pilih gambar untuk diunggah.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('foto_barang', imageFile.value);

  try {
    const response = await updateBarang(selectedBarang.value.id, formData);

    const newFotoUrl = response?.data?.foto_barang_url || imageFile.value.name;

    // Update local data
    const index = barang.value.findIndex(b => b.id === selectedBarang.value.id);
    if (index !== -1) {
      barang.value[index].foto_barang_url = newFotoUrl;
      selectedBarang.value.foto_barang_url = newFotoUrl;
    }

    closeImageModal();

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Gambar berhasil diunggah!',
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    console.error('Gagal mengunggah gambar:', error);
    if (error.response && error.response.status === 401) {
      showNotification('Otentikasi Gagal (401). Periksa konfigurasi CORS di server Anda!', 'error');
    } else {
      showNotification('Gagal mengunggah gambar. Coba cek Network tab.', 'error');
    }
  }
}

// Handler for ADD NEW ITEM
async function handleAddSubmit() {
  // 1. Validasi form data
  if (!newBarang.value.nama_barang || !newBarang.value.kode_barang) {
    showNotification('Nama Barang dan Kode Barang wajib diisi.', 'error');
    return;
  }
  // File upload (newImageFile) adalah opsional, tapi jika ada, dimasukkan ke FormData

  const formData = new FormData();

  // Append text fields
  for (const key in newBarang.value) {
    formData.append(key, newBarang.value[key]);
  }

  // Append image file if present
  if (newImageFile.value) {
    formData.append('foto_barang', newImageFile.value);
  }

  try {
    // Panggil API createBarang (PATCH/POST tergantung API Anda)
    // Saya asumsikan createBarang menggunakan POST dan menerima FormData
    const response = await createBarang(formData);

    const newBarangData = response.data;

    // Update local list (jika data berhasil diambil)
    if (newBarangData) {
      // Tambahkan ke array barang dan atur ulang pagination
      barang.value.push(newBarangData);
      currentPage.value = totalPages.value; // Pindah ke halaman terakhir
    } else {
      // Jika respons API tidak mengembalikan data baru, refresh seluruh list
      const freshData = await listBarang();
      barang.value = freshData;
    }


    closeAddModal();

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: `Barang "${newBarang.value.nama_barang}" berhasil ditambahkan!`,
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    console.error('Gagal menambah barang:', error);
    showNotification('Gagal menambah barang. Cek konsol dan pastikan Kode Barang unik.', 'error');
  }
}


// --- DELETE HANDLERS ---
async function confirmDelete(item) {
  const result = await Swal.fire({
    title: 'Apakah Anda Yakin?',
    text: `Anda akan menghapus barang "${item.nama_barang}" secara permanen. Tindakan ini tidak dapat dibatalkan!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  });

  if (result.isConfirmed) {
    await handleDelete(item.id, item.nama_barang);
  }
}

function triggerNewFileInput() {
  if (newFileInput.value) newFileInput.value.click()
}

async function handleDelete(id, nama_barang) {
  try {
    await deleteBarang(id);

    // Hapus dari array lokal
    barang.value = barang.value.filter(b => b.id !== id);
    // Atur ulang halaman setelah penghapusan
    if (paginatedBarang.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }

    // Notifikasi sukses
    Swal.fire({
      title: 'Terhapus!',
      text: `Barang "${nama_barang}" telah berhasil dihapus.`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    console.error('Gagal menghapus barang:', error);
    Swal.fire({
      title: 'Gagal!',
      text: `Gagal menghapus barang "${nama_barang}". Silakan coba lagi.`,
      icon: 'error'
    });
  }
}


// Computed property untuk menampilkan preview gambar EDIT
const imagePreviewUrl = computed(() => {
  if (imageFile.value) {
    return URL.createObjectURL(imageFile.value)
  }
  // Tampilkan gambar yang sudah ada jika ada, atau placeholder
  return selectedBarang.value.foto_barang_url ? `${storage_URL}/${selectedBarang.value.foto_barang_url}` : 'https://placehold.co/150x150/f1f1f1/333333?text=N/A'
})

// Computed property untuk menampilkan preview gambar TAMBAH BARANG
const newImagePreviewUrl = computed(() => {
  if (newImageFile.value) {
    return URL.createObjectURL(newImageFile.value)
  }
  return 'https://placehold.co/150x150/f1f1f1/333333?text=N/A'
})
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

  <!-- Statistik Barang & Alat -->
  <section class="mb-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <UiInfoBox type="total" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <Package class="w-4 h-4 text-primary" />
            Total Barang
          </span>
        </template>
        <span class="text-2xl font-bold text-primary">{{ barangStats?.total || 0 }}</span>
      </UiInfoBox>

      <UiInfoBox type="tersedia" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-green-600" />
            Tersedia
          </span>
        </template>
        <span class="text-2xl font-bold text-green-600">{{ barangStats?.tersedia || 0 }}</span>
      </UiInfoBox>

      <UiInfoBox type="dipinjam" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <Clock class="w-4 h-4 text-yellow-600" />
            Dipinjam
          </span>
        </template>
        <span class="text-2xl font-bold text-yellow-600">{{ barangStats?.dipinjam || 0 }}</span>
      </UiInfoBox>

      <UiInfoBox type="rusak" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <Wrench class="w-4 h-4 text-red-600" />
            Rusak
          </span>
        </template>
        <span class="text-2xl font-bold text-red-600">{{ barangStats?.rusak || 0 }}</span>
      </UiInfoBox>

      <UiInfoBox type="tidak-tersedia" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <XCircle class="w-4 h-4 text-gray-600" />
            Tidak Tersedia
          </span>
        </template>
        <span class="text-2xl font-bold text-gray-600">{{ barangStats?.tidak_tersedia || 0 }}</span>
      </UiInfoBox>
    </div>
  </section>

  <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
    <div class="flex relative flex-1">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input type="text" v-model="search"
        class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
        placeholder="Cari Nama Barang, Kode, atau Merek..." />
    </div>
    <button @click="openAddModal"
      class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto font-medium shadow-md whitespace-nowrap">
      Tambah
    </button>
  </div>


  <div v-if="isLoading" class="text-center py-8 text-lg text-gray-500">
    Memuat data barang...
  </div>


  <div v-else-if="barang.length === 0"
    class="text-center py-8 text-lg text-gray-500 border border-dashed rounded-lg p-10 bg-white">
    Tidak ada data barang yang ditemukan. Silakan tambahkan barang baru.
  </div>


  <div v-else class="shadow-xl rounded-xl overflow-hidden bg-white">
    <!-- Wrapper untuk tabel dengan overflow horizontal -->
    <div class="overflow-x-auto">
      <table class="w-full table-auto border-separate border-spacing-0 min-w-max">
        <thead>
          <tr class="bg-primary text-white text-center text-xs uppercase tracking-wider">
            <th class="text-center px-2 py-3 min-w-[50px]">No</th>
            <th class="text-center px-2 py-3 min-w-[60px]">Foto</th>
            <th class="text-center px-3 py-3 min-w-[120px]">Nama Barang</th>
            <th class="text-center px-2 py-3 min-w-[80px]">Kode</th>
            <th class="text-center px-2 py-3 min-w-[100px]">Kategori</th>
            <th class="text-center px-2 py-3 min-w-[80px]">Merk</th>
            <th class="text-center px-2 py-3 min-w-[80px]">Kondisi</th>
            <th class="text-center px-2 py-3 min-w-[80px]">Status</th>
            <th class="text-center px-2 py-3 min-w-[60px]">Jumlah</th>
            <th class="text-center px-2 py-3 min-w-[120px]">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-xs text-center">
          <tr v-for="(data, index) in paginatedBarang" :key="data.kode_barang"
            class="hover:bg-gray-50 transition border-t border-gray-100">
            <td class="px-2 py-3 font-mono align-middle">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="px-2 py-3 align-middle">
              <div
                class="w-8 h-8 rounded-full overflow-hidden border border-gray-300 flex-shrink-0 mx-auto flex items-center justify-center">
                <img
                  :src="data.foto_barang_url ? `${storage_URL}/${data.foto_barang_url}` : 'https://placehold.co/32x32/f1f1f1/333333?text=N/A'"
                  alt="Foto Barang" class="w-full h-full object-cover"
                  onerror="this.onerror=null;this.src='https://placehold.co/32x32/f1f1f1/333333?text=N/A';" />
              </div>
            </td>
            <td class="px-3 py-3 font-semibold align-middle">
              <div class="max-w-[120px] truncate" :title="data.nama_barang">{{ data.nama_barang }}</div>
            </td>
            <td class="px-2 py-3 font-mono text-gray-500 align-middle">
              <div class="max-w-[80px] truncate" :title="data.kode_barang">{{ data.kode_barang }}</div>
            </td>
            <td class="px-2 py-3 font-mono text-gray-500 align-middle">
              <div class="max-w-[100px] truncate" :title="data.kategori.nama_kategori">{{ data.kategori.nama_kategori }}</div>
            </td>
            <td class="px-2 py-3 align-middle">
              <div class="max-w-[80px] truncate" :title="data.merek">{{ data.merek }}</div>
            </td>
            <td class="px-2 py-3 align-middle">
              <span :class="{
                'bg-green-100 text-green-800': data.kondisi.toLowerCase() === 'baik',
                'bg-yellow-100 text-yellow-800': data.kondisi.toLowerCase() === 'rusak ringan',
                'bg-red-100 text-red-800': data.kondisi.toLowerCase() === 'rusak berat'
              }" class="px-1 py-0.5 rounded-full text-xs font-medium">
                {{ data.kondisi }}
              </span>
            </td>
            <td class="px-2 py-3 font-mono align-middle">
              <div class="max-w-[80px] truncate" :title="data.status">{{ data.status }}</div>
            </td>

            <td class="px-2 py-3 font-mono align-middle">{{ data.jumlah }}</td>
            <td class="px-2 py-3 text-center align-middle">
              <div class="flex justify-center items-center gap-1">

                <button @click="openImageModal(data)"
                  class="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                  <ImageIcon class="inline w-3 h-3" />
                </button>

                <button @click="openEditModal(data)"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                  <Pencil class="inline w-3 h-3" />
                </button>
                <button @click="confirmDelete(data)"
                  class="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                  <Trash2 class="inline w-3 h-3" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="paginatedBarang.length === 0 && filteredBarang.length > 0">
            <td colspan="10" class="text-center py-4 text-gray-500">Tidak ada barang di halaman ini.</td>
          </tr>
          <tr v-else-if="filteredBarang.length === 0">
            <td colspan="10" class="text-center py-4 text-gray-500">Tidak ada hasil yang cocok dengan pencarian Anda.</td>
          </tr>
        </tbody>
      </table>

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
</div>



  <div v-if="isEditModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 overflow-y-auto"
    @click.self="closeEditModal">

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Modal Content -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-4 sm:p-6 relative transition-all duration-300 my-8" @click.stop>

      <!-- Header -->
      <div class="flex items-center justify-between mb-4 border-b pb-2">
        <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Ubah Data Barang: <br> <span class="text-primary">{{ selectedBarang?.nama_barang }}</span>
        </h2>
        <button @click="closeEditModal" class="text-gray-400 hover:text-gray-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form v-if="selectedBarang" @submit.prevent="handleSave" class="space-y-4">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Nama Barang -->
          <div>
            <label for="modal_nama_barang" class="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
            <input id="modal_nama_barang" type="text" v-model="selectedBarang.nama_barang"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
              required />
          </div>

          <!-- Kode Barang -->
          <div>
            <label for="modal_kode_barang" class="block text-sm font-medium text-gray-700 mb-1">Kode Barang</label>
            <input id="modal_kode_barang" type="text" :value="selectedBarang.kode_barang"
              class="w-full border border-gray-200 bg-gray-50 rounded-lg p-2 cursor-not-allowed text-gray-500"
              disabled />
          </div>

          <!-- Kategori Barang -->
          <div>
            <label for="modal_kategori_barang" class="block text-sm font-medium text-gray-700 mb-1">Kategori
              Barang</label>
            <select id="modal_kategori_barang" v-model="selectedBarang.kategori_id"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
              required>
              <option value="" disabled>Pilih Kategori</option>
              <option v-for="kategori in kategoriBarang.data" :key="kategori.id" :value="kategori.id">
                {{ kategori.nama_kategori }}
              </option>
            </select>
          </div>

          <!-- Merk -->
          <div>
            <label for="modal_merek" class="block text-sm font-medium text-gray-700 mb-1">Merk</label>
            <input id="modal_merek" type="text" v-model="selectedBarang.merek"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
              required />
          </div>

          <!-- Kondisi -->
          <div>
            <label for="modal_kondisi" class="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
            <select id="modal_kondisi" v-model="selectedBarang.kondisi"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
              required>
              <option v-for="option in [
                { value: 'BAIK', label: 'Baik' },
                { value: 'RUSAK_RINGAN', label: 'Rusak Ringan' },
                { value: 'RUSAK_BERAT', label: 'Rusak Berat' },
                { value: 'HILANG', label: 'Hilang' }
              ]" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
              <option v-if="!['BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT', 'HILANG'].includes(selectedBarang.kondisi)"
                :value="selectedBarang.kondisi" selected hidden>
                {{ selectedBarang.kondisi }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label for="modal_status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select id="modal_status" v-model="selectedBarang.status"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
              required>
              <option value="TERSEDIA">Tersedia</option>
              <option value="DIPINJAM">Dipinjam</option>
              <option value="RUSAK">Rusak</option>
              <option value="PERBAIKAN">Perbaikan</option>
              <option value="TIDAK_TERSEDIA">Tidak Tersedia</option>
              <option
                v-if="!['TERSEDIA', 'DIPINJAM', 'RUSAK', 'PERBAIKAN', 'TIDAK_TERSEDIA'].includes(selectedBarang.status)"
                :value="selectedBarang.status" selected hidden>
                {{ selectedBarang.status }}
              </option>
            </select>
          </div>


        </div>
        <!-- Jumlah -->
        <div>
          <label for="modal_jumlah" class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
          <input id="modal_jumlah" type="number" v-model.number="selectedBarang.jumlah"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            min="1" required />
        </div>
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
          <button type="button" @click="closeEditModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm">
            Batal
          </button>
          <button type="submit"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium shadow-md">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Image Upload Modal -->

  <div v-if="isImageModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 overflow-y-auto"
    @click.self="closeImageModal">
    <!-- Overlay -->

    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Modal Content Container -->

    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-4 sm:p-6 relative transform transition-all duration-300 scale-100 opacity-100 my-8"
      @click.stop>

      <h2 class="text-lg sm:text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
        Unggah Foto Barang: <br>
        <span class="text-primary">{{ selectedBarang?.nama_barang }}</span>
      </h2>

      <!-- Close Button -->

      <button @click="closeImageModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <form @submit.prevent="handleImageUpload" class="space-y-4">
        <!-- Drag and Drop Area -->
        <label for="file_input" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop"
          @click="triggerNewFileInput"
          class="flex flex-col items-center justify-center w-full p-4 sm:p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
          <Upload class="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-3" />
          <p class="mb-2 text-sm text-gray-500 text-center">
            <span class="font-semibold">Klik untuk memilih</span> atau seret dan lepas gambar di sini
          </p>
          <p class="text-xs text-gray-500">PNG, JPG, JPEG, WEBP (MAX. 5MB)</p>
        </label>
        <input id="file_input" type="file" class="hidden" @change="handleFileChange" accept="image/*" ref="fileInput" />

        <!-- Image Preview -->

        <div v-if="imageFile || selectedBarang.foto_barang_url" class="mt-4 flex flex-col items-center">
          <p class="text-sm font-medium text-gray-700 mb-2">Pratinjau Gambar:</p>
          <img :src="imagePreviewUrl" alt="Pratinjau Gambar"
            class="max-w-full max-h-48 object-contain border border-gray-200 rounded-lg shadow-sm" />
          <p v-if="imageFile" class="mt-2 text-sm text-gray-600">{{ imageFile.name }} ({{ (imageFile.size / 1024 /
            1024).toFixed(2) }} MB)</p>
          <p v-else class="mt-2 text-sm text-gray-600">Gambar yang sudah ada</p>
        </div>

        <!-- Action Buttons for Image Modal -->

        <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
          <button type="button" @click="closeImageModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm">
            Batal
          </button>
          <button type="submit" :disabled="!imageFile" :class="{ 'opacity-50 cursor-not-allowed': !imageFile }"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md">
            Unggah Gambar
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Tambah Barang Modal BARU -->
  <div v-if="isAddModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 overflow-y-auto"
    @click.self="closeAddModal">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Modal Content Container -->
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-4 sm:p-6 relative transform transition-all duration-300 scale-100 opacity-100 my-8"
      @click.stop>

      <h2 class="text-lg sm:text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
        Tambah Barang Baru
      </h2>

      <!-- Close Button -->
      <button @click="closeAddModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Form Tambah Barang -->
      <form @submit.prevent="handleAddSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Nama Barang -->
          <div>
            <label for="add_nama_barang" class="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
            <input id="add_nama_barang" type="text" v-model="newBarang.nama_barang"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
              required />
          </div>

          <!-- Kode Barang -->
          <div>
            <label for="add_kode_barang" class="block text-sm font-medium text-gray-700 mb-1">Kode Barang (ID
              Unik)</label>
            <input id="add_kode_barang" type="text" v-model="newBarang.kode_barang"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
              required />
          </div>

          <!-- Kategori Barang -->
          <div>
            <label for="add_kategori_barang" class="block text-sm font-medium text-gray-700 mb-1">Kategori
              Barang</label>
            <select id="add_kategori_barang" v-model="newBarang.kategori_id"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
              required>
              <option value="" disabled selected>Pilih Kategori</option>
              <option v-for="kategori in kategoriBarang.data" :key="kategori.id" :value="kategori.id">
                {{ kategori.nama_kategori }}
              </option>
            </select>
          </div>

          <!-- Merk -->
          <div>
            <label for="add_merek" class="block text-sm font-medium text-gray-700 mb-1">Merk</label>
            <input id="add_merek" type="text" v-model="newBarang.merek"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
              required />
          </div>

          <!-- Kondisi -->
          <div>
            <label for="add_kondisi" class="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
            <select id="add_kondisi" v-model="newBarang.kondisi"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
              required>
              <option v-for="option in [
                { value: 'BAIK', label: 'Baik' },
                { value: 'RUSAK_RINGAN', label: 'Rusak Ringan' },
                { value: 'RUSAK_BERAT', label: 'Rusak Berat' },
                { value: 'HILANG', label: 'Hilang' }
              ]" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label for="add_status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select id="add_status" v-model="newBarang.status"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
              required>
              <option v-for="option in [
                { value: 'TERSEDIA', label: 'Tersedia' },
                { value: 'DIPINJAM', label: 'Dipinjam' },
                { value: 'RUSAK', label: 'Rusak' },
                { value: 'PERBAIKAN', label: 'Perbaikan' },
                { value: 'TIDAK_TERSEDIA', label: 'Tidak Tersedia' }
              ]" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Jumlah -->

        </div>
        <div>
          <label for="add_jumlah" class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
          <input id="add_jumlah" type="number" v-model.number="newBarang.jumlah"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            min="1" required />
        </div>
        <!-- File Upload Area -->
        <div class="mt-2">
          <p class="text-sm font-medium text-gray-700 mb-1 pt-2">Foto Barang (Opsional)</p>
          <label for="new_file_input" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave"
            @drop="handleNewDrop" @click="triggerNewFileInput"
            class="flex flex-col items-center justify-center w-full p-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
            <Upload class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1" />
            <p class="text-sm text-gray-500 text-center">Seret/Pilih Gambar</p>
          </label>
          <input id="new_file_input" type="file" class="hidden" @change="handleNewFileChange" accept="image/*"
            ref="newFileInput" />

          <!-- Image Preview Tambah -->
          <div v-if="newImageFile" class="mt-2 flex flex-col items-center">
            <p class="text-sm font-medium text-gray-700 mb-2">Pratinjau Gambar:</p>
            <img :src="newImagePreviewUrl" alt="Pratinjau Gambar Baru"
              class="max-w-full max-h-32 object-contain border border-gray-200 rounded-lg shadow-sm" />
            <p class="mt-1 text-sm text-gray-600">{{ newImageFile.name }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
          <button type="button" @click="closeAddModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm">
            Batal
          </button>
          <button type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md">
            Tambah Barang
          </button>
        </div>
      </form>
    </div>
  </div>

</template>
