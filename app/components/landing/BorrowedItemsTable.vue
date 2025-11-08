<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <table class="w-full text-sm text-left">
    <thead class="text-gray-600 uppercase text-xs">
      <tr>
        <th class="px-6 py-3 font-semibold">Barang</th>
        <th class="px-6 py-3 font-semibold">NIM</th>
        <th class="px-6 py-3 font-semibold">Jam Pinjam</th>
        <th class="px-6 py-3 font-semibold">Jam Kembali</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 text-gray-700">
      <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
        <td class="px-6 py-4 font-semibold">{{ item.item }}</td>
        <td class="px-6 py-4">{{ item.nim }}</td>
        <td class="px-6 py-4">{{ item.jamPinjam }}</td>
        <td class="px-6 py-4">{{ item.jamKembali }}</td>
      </tr>
    </tbody>
  </table>
</template>