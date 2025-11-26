<script setup>
  definePageMeta({
    layout: "dashboard",
    middleware: "middleware",
  });
  import { Search, Eye, CheckCircle, XCircle } from "lucide-vue-next";
  import UiInfoBox from "~/components/ui/infoBox.vue";
  import { ref, onMounted, computed } from "vue";
  import { PeminjamanList, setujuiPeminjamanBarang, tolakPeminjamanBarang } from "~/lib/api/peminjaman/terjadwal/PeminjamanBarang";
  // Handle aksi setujui peminjaman
  async function handleSetujui(id) {
    try {
      const res = await setujuiPeminjamanBarang(id);
      Swal.fire("Berhasil", res?.message || "Peminjaman disetujui.", "success");
      await fetchPeminjamanList();
    } catch (error) {
      Swal.fire("Gagal", error?.response?.data?.message || "Gagal menyetujui peminjaman.", "error");
    }
  }

  // Handle aksi tolak peminjaman
  async function handleTolak(id) {
    try {
      const res = await tolakPeminjamanBarang(id);
      Swal.fire("Ditolak", res?.message || "Peminjaman ditolak.", "success");
      await fetchPeminjamanList();
    } catch (error) {
      Swal.fire("Gagal", error?.response?.data?.message || "Gagal menolak peminjaman.", "error");
    }
  }
  import Swal from "sweetalert2";

  const peminjamanList = ref([]);
    const isLoading = ref(true);
    const search = ref("");

    onMounted(async () => {
      await fetchPeminjamanList();
    });

    async function fetchPeminjamanList() {
      isLoading.value = true;
      try {
        const apiResponse = await PeminjamanList();
        peminjamanList.value = apiResponse?.data || [];
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
  <UiInfoBox />

  <div class="flex flex-col md:flex-row md:items-center gap-2 mb-4">
    <div class="flex relative w-full mt-5 gap-4">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        v-model="search"
        type="text"
        class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 bg-white"
        placeholder="Cari Peminjam, Kode, atau Status..."
      />
    </div>
  </div>


  <div v-if="isLoading" class="text-center py-8 text-lg text-gray-500">
    Memuat data peminjaman barang...
  </div>

  <div v-else-if="filteredList.length === 0" class="text-center py-8 text-lg text-gray-500 border border-dashed rounded-lg p-10 bg-white">
    Tidak ada data peminjaman barang ditemukan.
  </div>

  <div v-else class="shadow-xl rounded-xl overflow-hidden bg-white">
    <!-- Info scroll untuk mobile -->
    <div class="bg-blue-50 border-b border-blue-200 px-4 py-2 text-sm text-blue-700 flex items-center gap-2 lg:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Geser ke kanan untuk melihat lebih banyak kolom</span>
    </div>
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
          <tr v-for="(data, index) in filteredList" :key="data.id" class="hover:bg-blue-50 transition border-t border-gray-100 group text-center">
            <td class="px-4 py-3 font-mono align-middle sticky left-0 bg-white group-hover:bg-blue-50 z-10 border-r border-gray-100">{{ index + 1 }}</td>
            <td class="px-4 py-3">{{ data.kode_peminjaman }}</td>
            <td class="px-4 py-3">{{ data.ID_Peminjam }}</td>
            <td class="px-4 py-3">{{ data.nama_peminjam }}</td>
            <td class="px-4 py-3">{{ formatDate(data.tanggal_pinjam) }}<br><span class="text-xs text-gray-500">{{ formatTime(data.tanggal_pinjam) }}</span></td>
            <td class="px-4 py-3">{{ formatDate(data.tanggal_kembali) }}<br><span class="text-xs text-gray-500">{{ formatTime(data.tanggal_kembali) }}</span></td>
            <td class="px-4 py-3">{{ data.tujuan_peminjaman }}</td>
            <td class="px-4 py-3">
              <span :class="{
                'bg-yellow-100 text-yellow-800': data.status_peminjaman === 'DIAJUKAN',
                'bg-green-100 text-green-800': data.status_peminjaman === 'DISETUJUI',
                'bg-red-100 text-red-800': data.status_peminjaman === 'DITOLAK'
              }" class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer inline-block">
                {{ data.status_peminjaman || 'N/A' }}
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
                <button class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-110 flex items-center justify-center flex-shrink-0" title="Lihat Detail">
                  <Eye class="w-4 h-4" />
                </button>
                <template v-if="data.status_peminjaman === 'DIAJUKAN'">
                  <button @click="handleSetujui(data.id)" class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-110 flex items-center justify-center flex-shrink-0" title="Setujui Pengajuan">
                    <CheckCircle class="w-4 h-4" />
                  </button>
                  <button @click="handleTolak(data.id)" class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-110 flex items-center justify-center flex-shrink-0" title="Tolak Pengajuan">
                    <XCircle class="w-4 h-4" />
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
