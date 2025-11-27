<script setup>
import { ref, computed, onMounted } from 'vue';
import ConfirmModal from '/components/landing/ConfirmationModal.vue';
import BorrowBarangForm from '/components/landing/BorrowBarangForm.vue';
import { getAllBarang } from '/lib/api/barang/barangApi';
import { Package, ArrowRight } from 'lucide-vue-next';
import Swal from 'sweetalert2';
import { storage_URL } from '~/lib/base';

definePageMeta({
  layout: "landing-page",
});

// --- CONFIG ---
// Ganti port ini sesuai dengan port backend kamu (biasanya 3000 atau 3001)
const API_BASE_URL = storage_URL; 
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
  loading.value = true;
  try {
    const res = await getAllBarang();
    const data = res.data;

    // Mapping data API ke format UI Frontend
    items.value = data.map(b => {
      
      // 1. LOGIC URL GAMBAR
      // Backend kirim: "uploads/barang/foto.jpg"
      // Frontend ubah jadi: "http://localhost:3001/uploads/barang/foto.jpg"
      let imageUrl = 'https://via.placeholder.com/300x200?text=No+Image';
      
      if (b.foto_barang_url) {
        // Hapus slash di depan jika ada, supaya url rapi
        const cleanPath = b.foto_barang_url.startsWith('/') 
          ? b.foto_barang_url.slice(1) 
          : b.foto_barang_url;
        
        imageUrl = `${API_BASE_URL}/${cleanPath}`;
      }

      // 2. LOGIC STATUS TERSEDIA
      // Barang bisa dipinjam JIKA: Status di DB = 'TERSEDIA' DAN Jumlah > 0
      const isAvailable = b.status === 'TERSEDIA' && b.jumlah > 0;

      // 3. LOGIC KATEGORI
      // Ambil nama kategori jika ada relasi, jika tidak tampilkan default
      const namaKategori = b.kategori?.nama_kategori || 'Umum';

      return {
        id: b.id,
        name: b.nama_barang,
        kode: b.kode_barang,
        stock: b.jumlah,
        kategori: namaKategori,
        imageUrl: imageUrl,
        
        // Properti untuk UI
        isAvailable: isAvailable, 
        statusLabel: isAvailable ? 'Tersedia' : (b.jumlah === 0 ? 'Stok Habis' : 'Tidak Tersedia'),
        
        imageError: false, // Flag error gambar
      };
    });

  } catch (err) {
    console.error('Gagal ambil data barang:', err);
    error.value = 'Gagal memuat data barang. Pastikan server backend menyala.';
  } finally {
    loading.value = false;
  }
};

// --- Handle Image Error (Fallback jika gambar rusak) ---
const handleImageError = (item) => {
  if (!item.imageError) {
    item.imageError = true;
    item.imageUrl = 'https://via.placeholder.com/300x200?text=Gambar+Rusak';
  }
};

// --- FILTER SEARCH ---
const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  const query = searchQuery.value.toLowerCase();
  return items.value.filter(item =>
    item.name.toLowerCase().includes(query) ||
    (item.kode && item.kode.toLowerCase().includes(query))
  );
});

// --- MODAL FUNCTIONS ---
const openConfirmModal = (item) => {
  if (item.isAvailable) {
    selectedItem.value = item;
    showModal.value = true;
  } else {
    Swal.fire({
      icon: 'error', // Icon error lebih tegas
      title: 'Tidak Dapat Dipinjam',
      text: `Barang ini sedang ${item.statusLabel.toLowerCase()}.`,
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
    selectedItems.value = [selectedItem.value];
    
    closeConfirmModal();
    
    // Delay sedikit agar transisi modal halus
    setTimeout(() => {
      showBorrowForm.value = true;
    }, 200);

  } catch (error) {
    console.error("Error saat konfirmasi:", error);
  }
};

const closeBorrowForm = () => {
  showBorrowForm.value = false;
  selectedItems.value = [];
  selectedItem.value = null;
  nimInput.value = '';
};

// Saat form peminjaman sukses disubmit
const handleSubmitBorrow = async () => {
  try {
    // Refresh data barang agar stok terupdate di tampilan
    await loadBarang(); 
    closeBorrowForm();
    Swal.fire('Berhasil', 'Pengajuan peminjaman berhasil dibuat', 'success');
  } catch (error) {
    console.error('Gagal refresh data:', error);
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
    
    <div class="container mx-auto p-8">
      <div class="bg-white max-w-7xl mx-auto p-8 rounded-lg shadow-md">
        <div class="text-center mb-10">
          <h1 class="text-3xl font-bold text-gray-800">Peminjaman Barang Lab</h1>
          <p class="text-gray-600 mt-2">
            Pilih barang yang ingin Anda pinjam. Pastikan dikembalikan dengan kondisi yang sama.
          </p>
        </div>

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
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div v-if="loading" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-500"></div>
          <p class="text-gray-500 mt-4">Memuat data barang...</p>
        </div>

        <div v-else-if="error" class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-500 text-lg">{{ error }}</p>
          <button @click="loadBarang" class="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">Coba Lagi</button>
        </div>

        <div v-else-if="filteredItems.length === 0" class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-gray-500 text-lg">Barang tidak ditemukan</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="item in filteredItems" 
            :key="item.id"
            @click="handleItemClick(item)"
            class="relative bg-white rounded-xl border-2 overflow-hidden transition-all duration-300 group"
            :class="{
              'border-transparent shadow hover:border-green-500 hover:shadow-xl cursor-pointer transform hover:-translate-y-1': item.isAvailable,
              'border-gray-200 cursor-not-allowed opacity-75 grayscale': !item.isAvailable
            }"
          >
            <div class="absolute top-4 right-4 z-10">
              <span 
                class="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-sm"
                :class="{
                  'bg-green-100/90 text-green-700 border border-green-200': item.isAvailable,
                  'bg-red-100/90 text-red-700 border border-red-200': !item.isAvailable
                }"
              >
                {{ item.statusLabel }}
              </span>
            </div>

            <div class="relative h-48 bg-gray-100 overflow-hidden">
              <img 
                :src="item.imageUrl" 
                :alt="item.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                @error="handleImageError(item)"
              />
            </div>

            <div class="p-5">
              <div class="mb-4">
                <div class="flex items-start gap-3">
                  <div 
                    class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="item.isAvailable ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'"
                  >
                    <Package class="h-5 w-5" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-bold text-gray-800 truncate leading-tight" :title="item.name">
                      {{ item.name }}
                    </h3>
                    <p v-if="item.kode" class="text-xs text-gray-500 mt-1 font-mono">
                      {{ item.kode }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-2 mb-4 border-t border-gray-100 pt-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Kategori</span>
                  <span class="font-medium text-gray-700 truncate max-w-[120px]">{{ item.kategori }}</span>
                </div>
                
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Stok</span>
                  <span class="font-medium" :class="item.stock > 0 ? 'text-gray-700' : 'text-red-500'">
                    {{ item.stock }} unit
                  </span>
                </div>
              </div>

              <div 
                v-if="item.isAvailable"
                class="flex items-center justify-center pt-3 mt-2 bg-green-50 rounded-lg py-2 text-green-700 font-medium text-sm group-hover:bg-green-600 group-hover:text-white transition-colors"
              >
                <span>Pinjam Barang</span>
                <ArrowRight class="h-4 w-4 ml-2" />
              </div>

              <div 
                v-else
                class="flex items-center justify-center pt-3 mt-2 bg-gray-50 rounded-lg py-2 text-gray-400 font-medium text-sm"
              >
                <span>Tidak Tersedia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-if="showModal"
      :show="showModal"
      title="Konfirmasi Peminjaman Barang"
      @close="closeConfirmModal"
      @confirm="handleConfirm"
    />

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