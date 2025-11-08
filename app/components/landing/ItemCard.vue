<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
    <div class="flex items-center gap-6">
      <img :src="item.imageUrl" :alt="item.name" class="w-20 h-20 object-cover bg-gray-100 rounded-lg" />
      
      <div>
        <h3 class="text-lg font-semibold text-gray-800">{{ item.name }}</h3>
        <p class="text-sm text-gray-500">Stock: {{ item.stock }}</p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button
        :disabled="item.stock === 0"
        :class="{
          'bg-green-100 text-green-700 hover:bg-green-200 font-semibold': item.stock > 0,
          'bg-gray-200 text-gray-500 cursor-not-allowed font-medium': item.stock === 0
        }"
        class="px-6 py-2 rounded-full text-sm transition-colors"
      >
        {{ item.stock > 0 ? 'Pinjam' : 'Tidak Tersedia' }}
      </button>

      <button class="text-gray-400 hover:text-gray-600">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </button>
    </div>
  </div>
</template>