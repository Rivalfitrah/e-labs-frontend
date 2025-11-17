<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'middleware'
})
import { Search } from 'lucide-vue-next'
import UiInfoBox from '~/components/ui/infoBox.vue'
</script>

<template>
  <UiInfoBox />

  <div class="flex flex-col md:flex-row md:items-center gap-2 mb-4">
    <div class="flex relative w-full mt-5 gap-4">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-400 bg-white"
        placeholder="Search..."
      />
      <button
        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full md:w-auto">
        Tambah
      </button>
    </div>
  </div>


  <table class="w-full border-separate border-spacing-0 rounded-xl overflow-hidden shadow-md">
  <thead>
    <tr class="bg-primary text-white text-sm uppercase tracking-wide">
      <th class="text-left px-5 py-3">No</th>
      <th class="text-left px-5 py-3">NIM</th>
      <th class="text-left px-5 py-3">Nama Mahasiswa</th>
      <th class="text-left px-5 py-3">Nama Matakuliah</th>
      <th class="text-left px-5 py-3">Jam Mulai</th>
      <th class="text-left px-5 py-3">Jam Selesai</th>
      <th class="text-left px-5 py-3">Gedung</th>
      <th class="text-center px-5 py-3">Aksi</th>
    </tr>
  </thead>

  <tbody class="text-gray-700 text-sm">
    <tr class="hover:bg-gray-50 transition">
      <td class="px-5 py-4">1</td>
      <td class="px-5 py-4">123456</td>
      <td class="px-5 py-4">John Doe</td>
      <td class="px-5 py-4">Matematika</td>
      <td class="px-5 py-4">08:00</td>
      <td class="px-5 py-4">10:00</td>
      <td class="px-5 py-4">Gedung A</td>
      <td class="px-5 py-4 text-center space-x-2">
        <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-sm">Setujui</button>
        <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-sm">Tolak</button>
      </td>
    </tr>
  </tbody>
</table>

</template>
