<script setup>
  definePageMeta({
    layout: "dashboard",
    middleware: "middleware",
  });

  // 1. Tambahkan CheckSquare untuk icon tombol selesai
  import {
    Search,
    Eye,
    CheckCircle,
    XCircle,
    CheckSquare,
  } from "lucide-vue-next";
  import UiInfoBox from "~/components/ui/infoBox.vue";
  import { ref, onMounted, computed } from "vue";
  // Pastikan Anda mengimpor API untuk menyelesaikan peminjaman (Contoh: selesaikanPeminjamanBarang)
  // Jika belum ada, Anda perlu membuatnya di file API.
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

  // Handle aksi setujui peminjaman
  async function handleSetujui(id) {
    try {
      const res = await setujuiPeminjamanBarang(id);
      const index = peminjamanList.value.findIndex((item) => item.id === id);
      if (index !== -1 && res.data) {
        peminjamanList.value[index].status_peminjaman = res.data.status;
      }
      Swal.fire("Berhasil", res?.message || "Peminjaman disetujui.", "success");
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
      const index = peminjamanList.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        peminjamanList.value[index].status_peminjaman =
          res?.data?.status || "DITOLAK";
      }
      Swal.fire("Ditolak", res?.message || "Peminjaman ditolak.", "success");
    } catch (error) {
      Swal.fire(
        "Gagal",
        error?.response?.data?.message || "Gagal menolak peminjaman.",
        "error"
      );
    }
  }

  // 2. Handle aksi Selesaikan Peminjaman (Pengembalian Barang)
  async function handleSelesai(id) {
    // Konfirmasi dulu sebelum menyelesaikan
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
        // --- PERBAIKAN DISINI ---

        // 1. Panggil API Selesaikan YANG ASLI (Uncomment baris ini)
        const res = await selesaikanPeminjamanBarang(id); // 2. Hapus bagian MOCK LOGIC / Dummy Response yang lama // const res = { message: "Peminjaman diselesaikan", ... }; // <--- INI PENYEBABNYA // Update Local State
        const index = peminjamanList.value.findIndex((item) => item.id === id);
        if (index !== -1) {
          peminjamanList.value[index].status_peminjaman = "SELESAI";
        }

        Swal.fire(
          "Selesai!",
          res?.message || "Peminjaman telah diselesaikan.",
          "success"
        );

        // Opsional: Fetch ulang data agar sinkron stok 100%
        // await fetchPeminjamanList();
      } catch (error) {
        console.error(error); // Log error ke console browser untuk debug
        Swal.fire(
          "Gagal",
          error?.response?.data?.message || "Gagal menyelesaikan peminjaman.",
          "error"
        );
      }
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
      <Search
        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
      />
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
          <tr
            class="bg-primary text-white text-center text-sm uppercase tracking-wider"
          >
            <th
              class="text-center px-4 py-3 w-16 sticky left-0 bg-primary z-10"
            >
              No
            </th>
            <th class="text-center px-4 py-3 min-w-[140px]">Kode Peminjaman</th>
            <th class="text-center px-4 py-3 min-w-[120px]">NIM</th>
            <th class="text-center px-4 py-3 min-w-[160px]">Nama Peminjam</th>
            <th class="text-center px-4 py-3 min-w-[140px]">Tanggal Pinjam</th>
            <th class="text-center px-4 py-3 min-w-[140px]">Tanggal Kembali</th>
            <th class="text-center px-4 py-3 min-w-[160px]">Tujuan</th>
            <th class="text-center px-4 py-3 min-w-[120px]">Status</th>
            <th class="text-center px-4 py-3 min-w-[180px]">Nama Barang</th>
            <th class="text-center px-4 py-3 min-w-[100px]">Jumlah</th>
            <th
              class="text-center px-4 py-3 min-w-[120px] sticky right-0 bg-primary z-10"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm text-center">
          <tr
            v-for="(data, index) in filteredList"
            :key="data.id"
            class="hover:bg-blue-50 transition border-t border-gray-100 group text-center"
          >
            <td
              class="px-4 py-3 font-mono align-middle sticky left-0 bg-white group-hover:bg-blue-50 z-10 border-r border-gray-100"
            >
              {{ index + 1 }}
            </td>
            <td class="px-4 py-3">{{ data.kode_peminjaman }}</td>
            <td class="px-4 py-3">{{ data.ID_Peminjam }}</td>
            <td class="px-4 py-3">{{ data.nama_peminjam }}</td>
            <td class="px-4 py-3">
              {{ formatDate(data.tanggal_pinjam) }}<br /><span
                class="text-xs text-gray-500"
                >{{ formatTime(data.tanggal_pinjam) }}</span
              >
            </td>
            <td class="px-4 py-3">
              {{ formatDate(data.tanggal_kembali) }}<br /><span
                class="text-xs text-gray-500"
                >{{ formatTime(data.tanggal_kembali) }}</span
              >
            </td>
            <td class="px-4 py-3">{{ data.tujuan_peminjaman }}</td>

            <td class="px-4 py-3">
              <span
                :class="{
                  'bg-yellow-100 text-yellow-800':
                    data.status_peminjaman === 'DIAJUKAN',
                  'bg-green-100 text-green-800':
                    data.status_peminjaman === 'DISETUJUI',
                  'bg-red-100 text-red-800':
                    data.status_peminjaman === 'DITOLAK',
                  'bg-blue-100 text-blue-800':
                    data.status_peminjaman === 'SEBAGIAN_DISETUJUI',
                  'bg-gray-100 text-gray-800':
                    data.status_peminjaman === 'SELESAI' ||
                    data.status_peminjaman === 'DIKEMBALIKAN',
                }"
                class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer inline-block"
              >
                {{ data.status_peminjaman || "N/A" }}
              </span>
            </td>

            <td class="px-4 py-3">
              <ul>
                <li
                  v-for="item in data.barang_dipinjam"
                  :key="item.kode_peminjaman_item"
                  class="mb-1"
                >
                  <span class="font-semibold">{{ item.nama_barang }}</span>
                </li>
              </ul>
            </td>
            <td class="px-4 py-3">
              <ul>
                <li
                  v-for="item in data.barang_dipinjam"
                  :key="item.kode_peminjaman_item"
                  class="mb-1"
                >
                  <span>{{ item.jumlah }}</span>
                </li>
              </ul>
            </td>

            <td
              class="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-blue-50 z-10 border-l border-gray-100"
            >
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
  </div>
</template>
