<script setup>
  definePageMeta({
    layout: "dashboard",
    middleware: "middleware",
  });

  import {
    Search,
    Eye,
    CheckCircle,
    XCircle,
    CheckSquare,
    Package,
    Clock,
    ChevronLeft,
    ChevronRight,
  } from "lucide-vue-next";
  
  import UiInfoBox from "~/components/ui/infoBox.vue";
  import { ref, onMounted, computed } from "vue";
  
  import {
    PeminjamanList,
    setujuiPeminjamanBarang,
    tolakPeminjamanBarang,
    selesaikanPeminjamanBarang,
  } from "~/lib/api/peminjaman/terjadwal/PeminjamanBarang";
  import Swal from "sweetalert2";

  const peminjamanList = ref([]);
  const isLoading = ref(true);
  const search = ref("");

  // --- PAGINATION STATE ---
  const currentPage = ref(1);
  const itemsPerPage = ref(10); 

  // State untuk Statistik
  const stats = ref({
    total: 0,
    pending: 0,
    disetujui: 0,
    ditolak: 0
  });

  // --- FUNGSI HITUNG STATISTIK (DIPISAH) ---
  // Agar bisa dipanggil ulang saat update manual tanpa fetch ke server
  function calculateStats() {
    const data = peminjamanList.value;
    stats.value = {
      total: data.length,
      pending: data.filter(item => item.status_peminjaman === 'DIAJUKAN').length,
      disetujui: data.filter(item => item.status_peminjaman === 'DISETUJUI').length,
      ditolak: data.filter(item => item.status_peminjaman === 'DITOLAK').length,
    };
  }

  onMounted(async () => {
    await fetchPeminjamanList();
  });

  async function fetchPeminjamanList() {
    isLoading.value = true;
    try {
      const apiResponse = await PeminjamanList();
      const data = apiResponse?.data || [];
      peminjamanList.value = data;
      
      // Panggil fungsi hitung
      calculateStats();

    } catch (error) {
      Swal.fire(
        "Gagal memuat data",
        error?.message || "Terjadi kesalahan",
        "error"
      );
      peminjamanList.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  // Handle aksi setujui peminjaman
  async function handleSetujui(id) {
    try {
      // 1. Panggil API
      const res = await setujuiPeminjamanBarang(id);
      
      // 2. UPDATE STATE LOKAL (KUNCI PERBAIKAN)
      // Langsung ubah status di array lokal tanpa menunggu fetch ulang
      const index = peminjamanList.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        peminjamanList.value[index].status_peminjaman = "DISETUJUI";
      }
      
      // 3. Update Statistik
      calculateStats();

      Swal.fire("Berhasil", res?.message || "Peminjaman disetujui.", "success");
      
      // 4. Fetch ulang di background (opsional, untuk memastikan data sinkron)
      // fetchPeminjamanList(); 
    } catch (error) {
      Swal.fire(
        "Gagal",
        error?.response?.data?.message || "Gagal menyetujui peminjaman.",
        "error"
      );
    }
  }

  // Handle aksi tolak peminjaman
  async function handleTolak(id) {
    try {
      const res = await tolakPeminjamanBarang(id);
      
      // UPDATE STATE LOKAL
      const index = peminjamanList.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        peminjamanList.value[index].status_peminjaman = "DITOLAK";
      }
      calculateStats();

      Swal.fire("Ditolak", res?.message || "Peminjaman ditolak.", "success");
    } catch (error) {
      Swal.fire(
        "Gagal",
        error?.response?.data?.message || "Gagal menolak peminjaman.",
        "error"
      );
    }
  }

  // Handle aksi Selesaikan Peminjaman
  async function handleSelesai(id) {
    const result = await Swal.fire({
      title: "Selesaikan Peminjaman?",
      text: "Pastikan barang sudah dikembalikan dan dicek kondisinya.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Selesaikan!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await selesaikanPeminjamanBarang(id);
        
        // UPDATE STATE LOKAL
        const index = peminjamanList.value.findIndex((item) => item.id === id);
        if (index !== -1) {
          peminjamanList.value[index].status_peminjaman = "SELESAI";
        }
        calculateStats();

        Swal.fire(
          "Selesai!",
          res?.message || "Peminjaman telah diselesaikan.",
          "success"
        );
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Gagal",
          error?.response?.data?.message || "Gagal menyelesaikan peminjaman.",
          "error"
        );
      }
    }
  }

  // --- COMPUTED PROPERTIES UNTUK FILTER & PAGINATION ---

  // 1. Filter Data (Search)
  const filteredList = computed(() => {
    const query = search.value.toLowerCase().trim();
    if (!query) return peminjamanList.value;
    return peminjamanList.value.filter(
      (item) =>
        item.nama_peminjam?.toLowerCase().includes(query) ||
        item.kode_peminjaman?.toLowerCase().includes(query) ||
        item.status_peminjaman?.toLowerCase().includes(query)
    );
  });

  // 2. Total Halaman
  const totalPages = computed(() => {
    return Math.ceil(filteredList.value.length / itemsPerPage.value);
  });

  // 3. Data yang Ditampilkan (Sliced)
  const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredList.value.slice(start, end);
  });

  // --- PAGINATION METHODS ---
  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  }

  // --- FORMATTERS ---
  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  function formatTime(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
</script>

<template>
  <section class="mb-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UiInfoBox type="total" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <Package class="w-4 h-4 text-primary" />
            Total Transaksi
          </span>
        </template>
        <span class="text-2xl font-bold text-primary">{{ stats.total }}</span>
      </UiInfoBox>

      <UiInfoBox type="dipinjam" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <Clock class="w-4 h-4 text-yellow-600" />
            Menunggu
          </span>
        </template>
        <span class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</span>
      </UiInfoBox>

      <UiInfoBox type="tersedia" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-green-600" />
            Sedang Dipinjam
          </span>
        </template>
        <span class="text-2xl font-bold text-green-600">{{ stats.disetujui }}</span>
      </UiInfoBox>

      <UiInfoBox type="rusak" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <XCircle class="w-4 h-4 text-red-600" />
            Ditolak
          </span>
        </template>
        <span class="text-2xl font-bold text-red-600">{{ stats.ditolak }}</span>
      </UiInfoBox>
    </div>
  </section>

  <div class="flex flex-col md:flex-row md:items-center gap-2 mb-4">
    <div class="flex relative w-full mt-2 gap-4">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        v-model="search"
        type="text"
        class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 bg-white"
        placeholder="Cari Peminjam, Kode, atau Status..."
        @input="currentPage = 1" 
      />
      </div>
  </div>

  <div v-if="isLoading" class="text-center py-8 text-lg text-gray-500">
    Memuat data peminjaman barang...
  </div>

  <div
    v-else-if="filteredList.length === 0"
    class="text-center py-8 text-lg text-gray-500 border border-dashed rounded-lg p-10 bg-white"
  >
    Tidak ada data peminjaman barang ditemukan.
  </div>

  <div v-else class="shadow-xl rounded-xl overflow-hidden bg-white">
    <div class="overflow-x-auto">
      <table class="w-full border-separate border-spacing-0 min-w-[1400px]">
        <thead>
          <tr class="bg-primary text-white text-center text-sm uppercase tracking-wider">
            <th class="text-center px-4 py-3 w-16 sticky left-0 bg-primary z-10">No</th>
            <th class="text-center px-4 py-3 min-w-[140px]">Kode Peminjaman</th>
            <th class="text-center px-4 py-3 min-w-[120px]">NIM</th>
            <th class="text-center px-4 py-3 min-w-[160px]">Nama Peminjam</th>
            <th class="text-center px-4 py-3 min-w-[140px]">Tanggal Pinjam</th>
            <th class="text-center px-4 py-3 min-w-[140px]">Tanggal Kembali</th>
            <th class="text-center px-4 py-3 min-w-[160px]">Tujuan</th>
            <th class="text-center px-4 py-3 min-w-[120px]">Status</th>
            <th class="text-center px-4 py-3 min-w-[180px]">Nama Barang</th>
            <th class="text-center px-4 py-3 min-w-[100px]">Jumlah</th>
            <th class="text-center px-4 py-3 min-w-[120px] sticky right-0 bg-primary z-10">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm text-center">
          <tr
            v-for="(data, index) in paginatedList"
            :key="data.id"
            class="hover:bg-blue-50 transition border-t border-gray-100 group text-center"
          >
            <td class="px-4 py-3 font-mono align-middle sticky left-0 bg-white group-hover:bg-blue-50 z-10 border-r border-gray-100">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            <td class="px-4 py-3">{{ data.kode_peminjaman }}</td>
            <td class="px-4 py-3">{{ data.ID_Peminjam }}</td>
            <td class="px-4 py-3">{{ data.nama_peminjam }}</td>
            <td class="px-4 py-3">
              {{ formatDate(data.tanggal_pinjam) }}<br /><span class="text-xs text-gray-500">{{ formatTime(data.tanggal_pinjam) }}</span>
            </td>
            <td class="px-4 py-3">
              {{ formatDate(data.tanggal_kembali) }}<br /><span class="text-xs text-gray-500">{{ formatTime(data.tanggal_kembali) }}</span>
            </td>
            <td class="px-4 py-3">{{ data.tujuan_peminjaman }}</td>

            <td class="px-4 py-3">
              <span
                :class="{
                  'bg-yellow-100 text-yellow-800': data.status_peminjaman === 'DIAJUKAN',
                  'bg-green-100 text-green-800': data.status_peminjaman === 'DISETUJUI',
                  'bg-red-100 text-red-800': data.status_peminjaman === 'DITOLAK',
                  'bg-blue-100 text-blue-800': data.status_peminjaman === 'SEBAGIAN_DISETUJUI',
                  'bg-gray-100 text-gray-800': data.status_peminjaman === 'SELESAI' || data.status_peminjaman === 'DIKEMBALIKAN',
                }"
                class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer inline-block"
              >
                {{ data.status_peminjaman || "N/A" }}
              </span>
            </td>

            <td class="px-4 py-3">
              <ul>
                <li v-for="item in data.barang_dipinjam" :key="item.kode_peminjaman_item" class="mb-1">
                  <span class="font-semibold">{{ item.nama_barang }}</span>
                </li>
              </ul>
            </td>
            <td class="px-4 py-3">
              <ul>
                <li v-for="item in data.barang_dipinjam" :key="item.kode_peminjaman_item" class="mb-1">
                  <span>{{ item.jumlah }}</span>
                </li>
              </ul>
            </td>

            <td class="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-blue-50 z-10 border-l border-gray-100">
              <div class="flex justify-center items-center gap-2">
                <button
                  class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                  title="Lihat Detail"
                >
                  <Eye class="w-4 h-4" />
                </button>

                <template v-if="data.status_peminjaman === 'DIAJUKAN'">
                  <button
                    @click="handleSetujui(data.id)"
                    class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                    title="Setujui Pengajuan"
                  >
                    <CheckCircle class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleTolak(data.id)"
                    class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                    title="Tolak Pengajuan"
                  >
                    <XCircle class="w-4 h-4" />
                  </button>
                </template>

                <template v-if="data.status_peminjaman === 'DISETUJUI'">
                  <button
                    @click="handleSelesai(data.id)"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                    title="Selesaikan / Barang Kembali"
                  >
                    <CheckSquare class="w-4 h-4" />
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPages > 1" class="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
      
      <span class="text-sm text-gray-700">
        Menampilkan
        <span class="font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
        sampai
        <span class="font-semibold">{{ Math.min(currentPage * itemsPerPage, filteredList.length) }}</span>
        dari
        <span class="font-semibold">{{ filteredList.length }}</span>
        peminjaman
      </span>

      <nav class="flex items-center space-x-1" aria-label="Pagination">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>

        <div class="hidden sm:flex space-x-1">
          <button 
            v-for="page in totalPages" 
            :key="page" 
            @click="goToPage(page)" 
            :class="{
              'bg-primary text-white': page === currentPage,
              'bg-white text-gray-700 hover:bg-gray-100': page !== currentPage
            }" 
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition"
          >
            {{ page }}
          </button>
        </div>

        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
      </nav>
    </div>

  </div>
</template>