<script setup>
  import { ref, computed, onMounted } from "vue";
  import { getAllBarang } from "/lib/api/barang/barangApi";
  import { createPeminjaman } from "/lib/api/peminjaman/terjadwal/PeminjamanBarang";
  import Swal from "sweetalert2";
  import { z } from "zod";

  definePageMeta({
    layout: "landing-page",
  });

  // --- STATE ---
  const searchQuery = ref("");
  const items = ref([]);
  const loading = ref(true);
  const error = ref(null);

  // --- FORM STATE ---
  const nimPeminjam = ref("");
  const jamMulai = ref("");
  const jamSelesai = ref("");
  const selectedItems = ref([]);
  const itemQuantities = ref({});

  // --- ERROR STATE ---
  const errors = ref({
    nimPeminjam: "",
    jamMulai: "",
    jamSelesai: "",
    items: ""
  });

  // --- TIME OPTIONS ---
  const timeOptions = [
    { value: "06:00", label: "06:00" },
    { value: "07:00", label: "07:00" },
    { value: "08:00", label: "08:00" },
    { value: "09:00", label: "09:00" },
    { value: "10:00", label: "10:00" },
    { value: "11:00", label: "11:00" },
    { value: "12:00", label: "12:00" },
    { value: "13:00", label: "13:00" },
    { value: "14:00", label: "14:00" },
    { value: "15:00", label: "15:00" },
    { value: "16:00", label: "16:00" },
    { value: "17:00", label: "17:00" },
    { value: "18:00", label: "18:00" },
  ];

  // --- VALIDATION SCHEMA ---
  const peminjamanSchema = z.object({
    nimPeminjam: z.string().min(1, "NIM/NIP tidak boleh kosong"),
    jamMulai: z.string().min(1, "Jam mulai harus diisi"),
    jamSelesai: z.string().min(1, "Jam selesai harus diisi"),
    items: z.array(z.object({
      id: z.number(),
      jumlah: z.number().min(1, "Jumlah harus lebih dari 0")
    })).min(1, "Pilih minimal 1 barang")
  }).refine((data) => {
    // Validasi jam mulai harus lebih kecil dari jam selesai
    if (!data.jamMulai || !data.jamSelesai) return false;
    
    const [startHour, startMinute] = data.jamMulai.split(":").map(Number);
    const [endHour, endMinute] = data.jamSelesai.split(":").map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    
    return endTime > startTime;
  }, {
    message: "Jam selesai harus lebih besar dari jam mulai",
    path: ["jamSelesai"]
  });

  // --- FETCH DATA DARI API ---
  const loadBarang = async () => {
    loading.value = true;
    try {
      const res = await getAllBarang();
      const data = res.data;

      items.value = data.map((b) => {
        const isAvailable = b.status === "TERSEDIA" && b.jumlah > 0;
        const namaKategori = b.kategori?.nama_kategori || "Umum";

        return {
          id: b.id,
          name: b.nama_barang,
          kode: b.kode_barang,
          stock: b.jumlah,
          kategori: namaKategori,
          isAvailable: isAvailable,
          statusLabel: isAvailable
            ? "Tersedia"
            : b.jumlah === 0
            ? "Stok Habis"
            : "Tidak Tersedia",
        };
      });
    } catch (err) {
      console.error("Gagal ambil data barang:", err);
      error.value =
        "Gagal memuat data barang. Pastikan server backend menyala.";
    } finally {
      loading.value = false;
    }
  };

  // --- FILTER SEARCH ---
  const filteredItems = computed(() => {
    if (!searchQuery.value) return items.value;
    const query = searchQuery.value.toLowerCase();
    return items.value.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.kode && item.kode.toLowerCase().includes(query))
    );
  });

  // --- CHECKBOX FUNCTIONS ---
  const toggleItem = (item) => {
    const index = selectedItems.value.findIndex((i) => i.id === item.id);
    if (index > -1) {
      selectedItems.value.splice(index, 1);
      delete itemQuantities.value[item.id];
    } else {
      selectedItems.value.push(item);
      itemQuantities.value[item.id] = 1;
    }
  };

  const isSelected = (item) => {
    return selectedItems.value.some((i) => i.id === item.id);
  };

  const selectAll = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      // Select all available items
      const availableItems = filteredItems.value.filter(
        (item) => item.isAvailable
      );
      selectedItems.value = [...availableItems];
      availableItems.forEach((item) => {
        itemQuantities.value[item.id] = 1;
      });
    } else {
      // Deselect all
      selectedItems.value = [];
      itemQuantities.value = {};
    }
  };

  // --- SUBMIT FUNCTION ---
  const handleSubmit = async () => {
    // Reset errors
    errors.value = {
      nimPeminjam: "",
      jamMulai: "",
      jamSelesai: "",
      items: ""
    };

    try {
      // Validasi dengan Zod
      const validationData = {
        nimPeminjam: nimPeminjam.value,
        jamMulai: jamMulai.value,
        jamSelesai: jamSelesai.value,
        items: selectedItems.value.map(item => ({
          id: item.id,
          jumlah: itemQuantities.value[item.id] || 0
        }))
      };

      const validation = peminjamanSchema.safeParse(validationData);
      
      if (!validation.success) {
        // Set error messages ke setiap field
        validation.error.errors.forEach(err => {
          const field = err.path[0];
          if (field in errors.value) {
            errors.value[field] = err.message;
          }
        });
        return;
      }

      // Validasi stok barang
      for (const item of selectedItems.value) {
        const qty = itemQuantities.value[item.id] || 0;
        if (qty > item.stock) {
          Swal.fire(
            "Peringatan",
            `Jumlah ${item.name} melebihi stok tersedia (${item.stock})`,
            "warning"
          );
          return;
        }
      }

      // Buat tanggal dengan jam yang dipilih
      const today = new Date();
      const [startHour, startMinute] = jamMulai.value.split(":");
      const [endHour, endMinute] = jamSelesai.value.split(":");

      const tanggalPinjam = new Date(today);
      tanggalPinjam.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const tanggalKembali = new Date(today);
      tanggalKembali.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      const peminjamanData = {
        ID_Peminjam: nimPeminjam.value,
        tanggal_pinjam: tanggalPinjam.toISOString(),
        tanggal_kembali: tanggalKembali.toISOString(),
        tujuan_peminjaman: "Peminjaman Barang Lab",
        items: selectedItems.value.map((item) => ({
          barang_id: item.id,
          jumlah: itemQuantities.value[item.id],
          kegiatan: "Peminjaman Barang Lab",
        })),
      };

      await createPeminjaman(peminjamanData);

      Swal.fire("Berhasil", "Peminjaman berhasil diajukan", "success");

      // Reset form
      nimPeminjam.value = "";
      jamMulai.value = "";
      jamSelesai.value = "";
      selectedItems.value = [];
      itemQuantities.value = {};
      errors.value = {
        nimPeminjam: "",
        jamMulai: "",
        jamSelesai: "",
        items: ""
      };

      await loadBarang();
    } catch (error) {
      console.error("Error submit peminjaman:", error);
      Swal.fire(
        "Gagal",
        "Terjadi kesalahan saat mengajukan peminjaman",
        "error"
      );
    }
  };

  onMounted(loadBarang);
</script>

<template>
  <div class="bg-[#F6FBF6] min-h-screen">
    <div class="container mx-auto p-8">
      <div class="bg-white max-w-7xl mx-auto p-8 rounded-lg shadow-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800">
            Peminjaman Barang Lab
          </h1>
          <p class="text-gray-600 mt-2">
            Centang barang yang ingin dipinjam dan isi data peminjaman
          </p>
        </div>

        <!-- Form Peminjaman -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">
            Data Peminjaman
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >NIM/NIP Peminjam</label
              >
              <input
                v-model="nimPeminjam"
                type="text"
                placeholder="Masukkan NIM/NIP"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
                  errors.nimPeminjam ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                ]"
              />
              <p v-if="errors.nimPeminjam" class="text-red-500 text-sm mt-1">
                {{ errors.nimPeminjam }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Jam Mulai</label
              >
              <select
                v-model="jamMulai"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white',
                  errors.jamMulai ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                ]"
              >
                <option value="" disabled>Pilih Jam Mulai</option>
                <option
                  v-for="time in timeOptions"
                  :key="time.value"
                  :value="time.value"
                >
                  {{ time.label }}
                </option>
              </select>
              <p v-if="errors.jamMulai" class="text-red-500 text-sm mt-1">
                {{ errors.jamMulai }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Jam Selesai</label
              >
              <select
                v-model="jamSelesai"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white',
                  errors.jamSelesai ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                ]"
              >
                <option value="" disabled>Pilih Jam Selesai</option>
                <option
                  v-for="time in timeOptions"
                  :key="time.value"
                  :value="time.value"
                >
                  {{ time.label }}
                </option>
              </select>
              <p v-if="errors.jamSelesai" class="text-red-500 text-sm mt-1">
                {{ errors.jamSelesai }}
              </p>
            </div>
          </div>
        </div>

        <!-- Error message untuk items -->
        <div v-if="errors.items" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm font-medium">{{ errors.items }}</p>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari barang berdasarkan nama atau kode..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-16">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-500"
          ></div>
          <p class="text-gray-500 mt-4">Memuat data barang...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-red-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-red-500 text-lg">{{ error }}</p>
          <button
            @click="loadBarang"
            class="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredItems.length === 0" class="text-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p class="text-gray-500 text-lg">Barang tidak ditemukan</p>
        </div>

        <!-- Tabel Barang -->
        <div v-else class="overflow-x-auto">
          <table
            class="w-full border-collapse bg-white rounded-lg overflow-hidden shadow"
          >
            <thead>
              <tr class="bg-green-600 text-white">
                <th class="px-4 py-3 text-left text-sm font-semibold">
                  <input
                    type="checkbox"
                    @change="selectAll($event)"
                    class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold">
                  Kode Barang
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold">
                  Nama Barang
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold">
                  Kategori
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold">
                  Stok Tersedia
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold">
                  Jumlah Pinjam
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredItems"
                :key="item.id"
                class="border-b hover:bg-gray-50 transition"
                :class="{ 'bg-green-50': isSelected(item) }"
              >
                <td class="px-4 py-3">
                  <input
                    type="checkbox"
                    :checked="isSelected(item)"
                    @change="toggleItem(item)"
                    :disabled="!item.isAvailable"
                    class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 disabled:opacity-50"
                  />
                </td>
                <td class="px-4 py-3 text-sm font-mono text-gray-700">
                  {{ item.kode || "-" }}
                </td>
                <td class="px-4 py-3 text-sm font-medium text-gray-800">
                  {{ item.name }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ item.kategori }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.stock }} unit
                </td>
                <td class="px-4 py-3">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-semibold"
                    :class="{
                      'bg-green-100 text-green-700': item.isAvailable,
                      'bg-red-100 text-red-700': !item.isAvailable,
                    }"
                  >
                    {{ item.statusLabel }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <input
                    v-if="isSelected(item)"
                    v-model.number="itemQuantities[item.id]"
                    type="number"
                    min="1"
                    :max="item.stock"
                    class="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <span v-else class="text-gray-400 text-sm">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary & Submit -->
        <div
          v-if="selectedItems.length > 0"
          class="mt-6 bg-green-50 p-4 rounded-lg flex items-center justify-between"
        >
          <div class="text-sm text-gray-700">
            <span class="font-semibold">{{ selectedItems.length }}</span> barang
            dipilih
          </div>
          <button
            @click="handleSubmit"
            class="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md"
          >
            Submit Peminjaman
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
