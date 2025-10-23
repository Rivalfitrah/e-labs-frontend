<script setup>
definePageMeta({
  layout: 'dashboard'
})
import { Search } from 'lucide-vue-next'
import UiInfoBox from '~/components/ui/infoBox.vue'
</script>

<template>
  <UiInfoBox />

  <div class="flex flex-col md:flex-row md:items-center gap-2 mb-4">
    <div class="flex relative w-full">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-400"
        placeholder="Search..."
      />
    </div>
    <button
      class="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full md:w-auto">
      Tambah
    </button>
  </div>


  <table class="w-full border-collapse rounded-md">
      <thead>
        <tr>
          <th class="bg-primary text-white text-left px-4 py-2">No</th>
          <th class="bg-primary text-white text-left px-4 py-2">NIM</th>
          <th class="bg-primary text-white text-left px-4 py-2">Nama Mahasiswa</th>
          <th class="bg-primary text-white text-left px-4 py-2">Nama matakuliah</th>
          <th class="bg-primary text-white text-left px-4 py-2">Jam Mulai</th>
          <th class="bg-primary text-white text-left px-4 py-2">Jam Selesai</th>
          <th class="bg-primary text-white text-left px-4 py-2">Gedung</th>
          <th class="bg-primary text-white text-left px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <!-- Data rows will go here -->
         <tr>
          <th class="">1</th>
          <td>123456</td>
          <td>John Doe</td>
          <td>Matematika</td>
          <td>08:00</td>
          <td>10:00</td>
          <td>Gedung A</td>
          <td>
            <button class="bg-blue-500 text-white px-2 py-1 rounded-md">Setujui</button>
            <button class="bg-red-500 text-white px-2 py-1 rounded-md">Tolak</button>
          </td>
         </tr>
      </tbody>
    </table>
</template>
