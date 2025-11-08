<script setup>
defineProps({
  rooms: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <table class="w-full text-sm text-left">
    <thead class="text-gray-600 uppercase text-xs">
      <tr>
        <th class="px-6 py-3 font-semibold">Lab</th>
        <th class="px-6 py-3 font-semibold">Lokasi</th>
        <th class="px-6 py-3 text-center font-semibold">Status</th>
        <th class="px-6 py-3 font-semibold">Lama Kosong</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 text-gray-700">
      <tr v-for="room in rooms" :key="room.id" class="hover:bg-gray-50">
        <td class="px-6 py-4 font-semibold">{{ room.lab }}</td>
        <td class="px-6 py-4">{{ room.location }}</td>
        <td class="px-6 py-4 text-center">{{ room.status }}</td>
        <td class="px-6 py-4">{{ room.lamakosong }}</td>
      </tr>
    </tbody>
  </table>
</template>