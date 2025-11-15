<script setup>
  import { ref } from "vue";
  import TheNavbar from "@/components/landing/TheNavbar.vue";
  import DetailModal from "@/components/landing/DetailModal.vue";

  // --- STATE MANAGEMENT UNTUK MODAL ---
  const isDetailModalVisible = ref(false);
  const selectedLabForDetail = ref(null);

  // --- CONTOH DATA (DENGAN DETAIL BOOKING) ---
  const labs = ref([
    {
      id: 1,
      name: "Labkom CA 01",
      location: "Gedung CA",
      capacity: 60,
      status: "available",
    },
    {
      id: 2,
      name: "Labkom CA 02",
      location: "Gedung CA",
      capacity: 60,
      status: "booked",
      // <-- 2. TAMBAHKAN DETAIL PEMINJAMAN
      bookingDetails: {
        time: "11:00 - 15:00",
        date: "Sabtu, 18 Oktober 2025",
        activity: "Kegiatan Pelatihan Divisi SHN Himavo MicroIT",
        borrower: "Anargya Rabbani Aslam",
        major: "Teknologi Rekayasa Perangkat Lunak",
        classYear: 60,
      },
    },
    {
      id: 3,
      name: "Labkom CA RPL",
      location: "Gedung CA",
      capacity: 60,
      status: "booked",
      bookingDetails: {
        time: "08:00 - 12:00",
        date: "Minggu, 19 Oktober 2025",
        activity: "Workshop Vue 3 untuk Pemula",
        borrower: "Jane Doe",
        major: "Sistem Informasi",
        classYear: 59,
      },
    },
    {
      id: 4,
      name: "Labkom CB 01",
      location: "Gedung CB",
      capacity: 60,
      status: "available",
    },
  ]);

  // --- 3. FUNGSI UNTUK MENGONTROL MODAL ---
  function openDetailModal(lab) {
    selectedLabForDetail.value = lab;
    isDetailModalVisible.value = true;
  }

  function closeDetailModal() {
    isDetailModalVisible.value = false;
    // Kita bisa reset datanya setelah modal tertutup
    setTimeout(() => {
      selectedLabForDetail.value = null;
    }, 300); // delay untuk transisi
  }
</script>

<template>
  <div>
    <div class="bg-[#F6FBF6] min-h-screen">
      <TheNavbar />
      <div class="container mx-auto p-8">
        <div class="text-center mb-10">
          <h1 class="text-3xl font-bold text-gray-800">
            Peminjaman Ruangan Lab Komputer di Luar Jam Kuliah
          </h1>
          <p class="text-gray-600 mt-2">
            Anda harus menyiapkan surat peminjaman secara digital yang sudah
            ditandatangani
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th class="px-6 py-3 font-semibold">Lab</th>
                <th class="px-6 py-3 font-semibold">Lokasi</th>
                <th class="px-6 py-3 text-center font-semibold">Kapasitas</th>
                <th class="px-6 py-3 text-center font-semibold">Status</th>
                <th class="px-6 py-3 text-center font-semibold">Aksi</th>
                <th class="px-6 py-3 text-center font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="lab in labs" :key="lab.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 font-semibold text-gray-800">
                  {{ lab.name }}
                </td>
                <td class="px-6 py-4 text-gray-600">{{ lab.location }}</td>
                <td class="px-6 py-4 text-center text-gray-600">
                  {{ lab.capacity }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="[
                      'px-3 py-1 text-xs font-bold rounded-full',
                      lab.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{
                      lab.status === "available" ? "Dapat dipinjam" : "Dipinjam"
                    }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <NuxtLink
                    v-if="lab.status === 'available'"
                    to="/form-peminjaman"
                    class="text-green-600 font-semibold hover:underline"
                    >Pinjam Ruangan</NuxtLink
                  >
                  <span v-else class="text-gray-500">Terpinjam</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button
                    v-if="lab.status === 'booked'"
                    @click="openDetailModal(lab)"
                    class="text-blue-600 hover:underline"
                  >
                    Lihat Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <DetailModal
      :show="isDetailModalVisible"
      :lab="selectedLabForDetail"
      @close="closeDetailModal"
    />
  </div>
</template>
