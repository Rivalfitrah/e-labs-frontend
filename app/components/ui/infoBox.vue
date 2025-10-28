<template>
  <div class="bg-white p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform border-l-4"
       :class="borderColorClass">
    <div class="text-xs text-gray-500 mb-1 font-semibold uppercase">
      <slot name="title">Informasi</slot>
    </div>
    <div class="font-extrabold text-4xl mt-1" :class="textColorClass">
      <slot>0</slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // Gunakan prop 'type' untuk menentukan warna
  type: {
    type: String,
    default: 'default', // 'total', 'tersedia', 'dipinjam', 'rusak', 'tidak_tersedia'
  }
});

const colorMap = {
  total: { border: 'border-primary', text: 'text-primary' },
  tersedia: { border: 'border-green-500', text: 'text-green-600' },
  dipinjam: { border: 'border-yellow-500', text: 'text-yellow-600' },
  rusak: { border: 'border-red-500', text: 'text-red-600' },
  'tidak-tersedia': { border: 'border-gray-500', text: 'text-gray-600' },
  
  // User types
  mahasiswa: { border: 'border-primary', text: 'text-primary' },
  dosen: { border: 'border-blue-500', text: 'text-blue-600' },
  pengelola: { border: 'border-yellow-500', text: 'text-yellow-600' },
  active: { border: 'border-green-500', text: 'text-green-600' },
  blocked: { border: 'border-red-500', text: 'text-red-600' },
  
  default: { border: 'border-gray-300', text: 'text-gray-700' },
};

const borderColorClass = computed(() => {
  return colorMap[props.type]?.border || colorMap.default.border;
});

const textColorClass = computed(() => {
  return colorMap[props.type]?.text || colorMap.default.text;
});
</script>