<script setup>
import { ref, computed, onMounted } from 'vue';
import TheNavbar from '/components/landing/TheNavbar.vue';
import ItemCard from '/components/landing/ItemCard.vue';
import { barangApi } from '/lib/api/barang/barangApi'; // <-- pastikan ini ada

// --- STATE ---
const searchQuery = ref('');
const items = ref([]);
const loading = ref(true);
const error = ref(null);

// --- FETCH DATA DARI API ---
const loadBarang = async () => {
  try {
    const res = await barangApi.getAll();
    const data = res.data;

    // Mapping data API ke format frontend
    items.value = data.map(b => ({
      id: b.id,
      name: b.nama_barang,
      stock: b.jumlah,
      imageUrl: b.foto_barang_url
        ? `http://localhost:3000/${b.foto_barang_url}`
        : 'https://via.placeholder.com/300x200?text=No+Image', // fallback kalau kosong
    }));
  } catch (err) {
    console.error('Gagal ambil data barang:', err);
    error.value = 'Gagal memuat data barang.';
  } finally {
    loading.value = false;
  }
};

// --- FILTER BERDASARKAN SEARCH ---
const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  return items.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(loadBarang);
</script>

<template>
  <div class="bg-[#F6FBF6] min-h-screen">
    <TheNavbar />

    <div class="container mx-auto p-8">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-800">Peminjaman Barang Lab</h1>
        <p class="text-gray-600 mt-2">
          Pastikan barang yang anda pinjam, dikembalikan dengan kondisi yang sama dengan saat anda meminjamnya.
        </p>
      </div>

      <!-- SEARCH BAR -->
      <div class="mb-8 max-w-lg mx-auto">
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari Barang..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      <!-- LOADING / ERROR / DATA -->
      <div class="max-w-4xl mx-auto space-y-4">
        <div v-if="loading" class="text-center text-gray-500">Memuat data barang...</div>
        <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
        <div v-else-if="filteredItems.length === 0" class="text-center text-gray-500">
          Barang tidak ditemukan.
        </div>
        <ItemCard
          v-else
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>