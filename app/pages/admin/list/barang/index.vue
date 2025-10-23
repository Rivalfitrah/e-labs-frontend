<script setup>
import UiInfoBox from '~/components/ui/infoBox.vue'
import { Search } from 'lucide-vue-next'
definePageMeta({
  layout: 'dashboard'
})
import { listBarang } from '~/lib/api'
import { onMounted, ref } from 'vue'

const barang = ref([])
onMounted(async () => {
  const data = await listBarang()
  barang.value = data
})

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


  <table class="w-full border-separate border-spacing-0 rounded-xl overflow-hidden shadow-md">
  <thead>
    <tr class="bg-primary text-white text-sm uppercase tracking-wide">
      <th class="text-left px-5 py-3">No</th>
      <th class="text-left px-5 py-3">Foto</th>
      <th class="text-left px-5 py-3">Nama Barang</th>
      <th class="text-left px-5 py-3">Kode barang</th>
      <th class="text-left px-5 py-3">Merk</th>
      <th class="text-left px-5 py-3">Kondisi</th>
      <th class="text-left px-5 py-3">Jumlah</th>
      <th class="text-center px-5 py-3">Aksi</th>
    </tr>
  </thead>

  <tbody class="text-gray-700 text-sm">
    <tr v-for="(data, index) in barang" :key="index" class="hover:bg-gray-50 transition">
      <td class="px-5 py-4">{{ index + 1 }}</td>
      <td class="px-5 py-4">
        <div class="w-14 h-14 rounded-full overflow-hidden border border-gray-300">
          <img src="/logo.jpg" alt="Foto Barang" class="w-full h-full object-cover" />
        </div>
        </td>
      <td class="px-5 py-4">{{ data.nama_barang }}</td>
      <td class="px-5 py-4">{{ data.kode_barang }}</td>
      <td class="px-5 py-4">{{ data.merk }}</td>
      <td class="px-5 py-4">{{ data.kondisi }}</td>
      <td class="px-5 py-4">{{ data.jumlah }}</td>
      <td class="px-5 py-4 text-center space-x-2">
        <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-sm">Setujui</button>
        <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-sm">Tolak</button>
      </td>
    </tr>
  </tbody>
</table>

</template>
