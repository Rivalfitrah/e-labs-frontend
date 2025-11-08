<script setup>
import { ref } from 'vue';
import TheNavbar from '@/components/landing/TheNavbar.vue';
import BorrowedRoomsTable from '@/components/landing/BorrowedRoomsTable.vue';
import BorrowedItemsTable from '@/components/landing/BorrowedItemsTable.vue';

// State untuk mengontrol filter view
const filterView = ref('Ruangan'); // Nilai default

// --- CONTOH DATA (nantinya dari API) ---
const borrowedRooms = ref([
  { id: 1, lab: 'Labkom CA 01', location: 'Gedung CA', status: 'kosong', lamakosong: '1 jam 30 menit' },
  { id: 2, lab: 'Labkom CA RPL', location: 'Gedung CA', status: 'kosong', lamakosong: '2 jam' },
  { id: 3, lab: 'Labkom CB K70', location: 'Gedung CB', status: 'kosong', lamakosong: '20 menit' },
]);

// const borrowedItems = ref([
//   { id: 1, item: 'HDMI', nim: 'J04XXXXXXXX', jamPinjam: '08:00', jamKembali: '10:00' },
//   { id: 2, item: 'HDMI', nim: 'J04XXXXXXXX', jamPinjam: '08:00', jamKembali: '10:00' },
//   { id: 3, item: 'Kabel LAN', nim: 'J03XXXXXXXX', jamPinjam: '09:30', jamKembali: '11:00' },
// ]);
</script>

<template>
  <div class="bg-[#F6FBF6] min-h-screen">
    <TheNavbar />
    <div class="container mx-auto p-8">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">
          List Peminjaman Lab Komputer
        </h1>
      </div>
      <div class="mb-8 flex justify-start">
        <select v-model="filterView" class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400">
          <option value="Ruangan">Ruangan</option>
        </select>
      </div>

      <div class="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
        <BorrowedRoomsTable v-if="filterView === 'Ruangan'" :rooms="borrowedRooms" />
      </div>
    </div>
  </div>
</template>