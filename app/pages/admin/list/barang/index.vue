<script setup>
import UiInfoBox from '~/components/ui/infoBox.vue'
import { Search } from 'lucide-vue-next'
definePageMeta({
  layout: 'dashboard'
})
import { listBarang } from '~/lib/api'

console.log(listBarang())

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
          <th class="bg-primary text-white text-left px-4 py-2">Foto</th>
          <th class="bg-primary text-white text-left px-4 py-2">Nama Barang</th>
          <th class="bg-primary text-white text-left px-4 py-2">Kode Barang</th>
          <th class="bg-primary text-white text-left px-4 py-2">Merk</th>
          <th class="bg-primary text-white text-left px-4 py-2">Kondisi</th>
          <th class="bg-primary text-white text-left px-4 py-2">Jumlah</th>
          <th class="bg-primary text-white text-left px-4 py-2">Aksi</th>
        </tr>
      </thead>
    </table>
</template>
