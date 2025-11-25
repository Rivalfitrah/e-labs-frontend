<script setup>
import { ref, computed, onMounted } from 'vue';
import TheNavbar from '/components/landing/TheNavbar.vue';
import ConfirmModal from '/components/landing/ConfirmationModal.vue';
import BorrowBarangForm from '/components/landing/BorrowBarangForm.vue';
import { getAllBarang, pengajuanPeminjamanBarang } from '/lib/api/barang/barangApi';
import { Package, ArrowRight } from 'lucide-vue-next';
import Swal from 'sweetalert2';

// --- STATE ---
const searchQuery = ref('');
const items = ref([]);
const loading = ref(true);
const error = ref(null);

// --- MODAL STATE ---
const showModal = ref(false);
const showBorrowForm = ref(false);
const selectedItem = ref(null);
const selectedItems = ref([]);
const nimInput = ref('');

// --- FETCH DATA DARI API ---
const loadBarang = async () => {
  try {
    const res = await getAllBarang();
    const data = res.data;

    console.log('Data barang dari API:', data); // Debug log

    // Mapping data API ke format frontend
    items.value = data.map(b => {
      const imageUrl = b.foto_barang_url 
        ? `http://localhost:3001/storage/${b.foto_barang_url}`
        : 'https://via.placeholder.com/300x200?text=No+Image';
      
      return {
        id: b.id,
        name: b.nama_barang,
        kode: b.kode_barang,
        stock: b.jumlah,
        kategori: b.kategori?.nama_kategori || 'Tidak ada kategori',
        imageUrl: imageUrl,
        status: b.jumlah > 0 ? 'Tersedia' : 'Habis',
        imageError: false, // Flag untuk mencegah infinite loop
      };
    });
  } catch (err) {
    console.error('Gagal ambil data barang:', err);
    error.value = 'Gagal memuat data barang.';
  } finally {
    loading.value = false;
  }
};

// --- Handle Image Error ---
const handleImageError = (item) => {
  if (!item.imageError) {
    item.imageError = true;
    item.imageUrl = 'https://via.placeholder.com/300x200?text=No+Image';
  }
};

// --- FILTER BERDASARKAN SEARCH ---
const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  return items.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.kode?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --- MODAL FUNCTIONS ---
const openConfirmModal = (item) => {
  if (item.status === 'Tersedia') {
    selectedItem.value = item;
    showModal.value = true;
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Barang Tidak Tersedia',
      text: 'Stok barang ini sudah habis.',
    });
  }
};

const closeConfirmModal = () => {
  showModal.value = false;
  selectedItem.value = null;
};

const handleConfirm = async (nimPeminjam) => {
  try {
    nimInput.value = nimPeminjam;
    
    // Tambahkan barang ke list selectedItems
    selectedItems.value = [selectedItem.value];
    
    closeConfirmModal();
    
    // Buka form peminjaman
    setTimeout(() => {
      showBorrowForm.value = true;
    }, 200);

  } catch (error) {
    console.error("Error saat konfirmasi:", error);
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Terjadi kesalahan. Silakan coba lagi.',
    });
  }
};

const closeBorrowForm = () => {
  showBorrowForm.value = false;
  selectedItems.value = [];
  selectedItem.value = null;
  nimInput.value = '';
};

const handleSubmitBorrow = async () => {
  console.log("Peminjaman barang berhasil diajukan");
  
  try {
    await loadBarang(); // Refresh data barang
    
    closeBorrowForm();
    
  } catch (error) {
    console.error('Gagal refresh data setelah submit:', error);
  }
};

// --- HANDLE CLICK BARANG ---
const handleItemClick = (item) => {
  openConfirmModal(item);
};

onMounted(loadBarang);
</script>

<template>
  <div class="bg-[#F6FBF6] min-h-screen">
    <TheNavbar />
    
    <div class="container mx-auto p-8">
      <!-- Header Section -->
      <div class="bg-white max-w-7xl mx-auto p-8 rounded-lg shadow-md">
        <div class="text-center mb-10">
          <h1 class="text-3xl font-bold text-gray-800">Peminjaman Barang Lab</h1>
          <p class="text-gray-600 mt-2">
            Pilih barang yang ingin Anda pinjam. Pastikan dikembalikan dengan kondisi yang sama.
          </p>
        </div>

        <!-- SEARCH BAR -->
        <div class="mb-8 max-w-lg mx-auto">
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari barang berdasarkan nama atau kode..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- LOADING STATE -->
        <div v-if="loading" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-500"></div>
          <p class="text-gray-500 mt-4">Memuat data barang...</p>
        </div>

        <!-- ERROR STATE -->
        <div v-else-if="error" class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-500 text-lg">{{ error }}</p>
        </div>

        <!-- EMPTY STATE -->
        <div v-else-if="filteredItems.length === 0" class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-gray-500 text-lg">Barang tidak ditemukan</p>
        </div>

        <!-- BARANG CARDS GRID -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div 
            v-for="item in filteredItems" 
            :key="item.id"
            @click="handleItemClick(item)"
            class="relative bg-white rounded-xl border-2 overflow-hidden transition-all duration-300"
            :class="{
              'border-gray-200 hover:border-green-500 hover:shadow-lg cursor-pointer': item.status === 'Tersedia',
              'border-gray-200 cursor-not-allowed opacity-60': item.status === 'Habis'
            }"
          >
            <!-- Status Badge - Top Right -->
            <div class="absolute top-4 right-4 z-10">
              <span 
                class="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md"
                :class="{
                  'bg-green-100 text-green-700 border border-green-300': item.status === 'Tersedia',
                  'bg-red-100 text-red-700 border border-red-300': item.status === 'Habis'
                }"
              >
                {{ item.status }}
              </span>
            </div>

            <!-- Image Section -->
            <div class="relative h-48 bg-gray-100 overflow-hidden">
              <img 
                :src="item.imageUrl" 
                :alt="item.name"
                class="w-full h-full object-cover"
                @error="handleImageError(item)"
              />
            </div>

            <!-- Content Section -->
            <div class="p-6">
              <!-- Barang Icon & Name -->
              <div class="mb-4">
                <div class="flex items-start gap-3">
                  <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package class="h-6 w-6 text-green-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-bold text-gray-800 truncate">
                      {{ item.name }}
                    </h3>
                    <p v-if="item.kode" class="text-sm text-gray-500 mt-1">
                      Kode: {{ item.kode }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Item Details -->
              <div class="space-y-2 mb-4">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ item.kategori }}</span>
                </div>
                
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Stok: <strong>{{ item.stock }}</strong> unit</span>
                </div>
              </div>

              <!-- Action Indicator -->
              <div 
                v-if="item.status === 'Tersedia'"
                class="flex items-center justify-between pt-4 border-t border-gray-100"
              >
                <span class="text-sm font-medium text-gray-500">Klik untuk pinjam</span>
                <ArrowRight class="h-5 w-5 text-gray-400" />
              </div>

              <!-- Unavailable Indicator -->
              <div 
                v-else
                class="flex items-center justify-center pt-4 border-t border-gray-100"
              >
                <span class="text-sm font-medium text-gray-400">Stok habis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmModal
      v-if="showModal"
      :show="showModal"
      title="Konfirmasi Peminjaman Barang"
      @close="closeConfirmModal"
      @confirm="handleConfirm"
    />

    <!-- Borrow Form Modal -->
    <BorrowBarangForm
      v-if="showBorrowForm"
      :show="showBorrowForm"
      :nim="nimInput"
      :selected-items="selectedItems"
      @submitted="handleSubmitBorrow"
      @close="closeBorrowForm"
    />
  </div>
</template>