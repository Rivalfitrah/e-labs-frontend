<script setup>
// Di Nuxt 3, kita tidak perlu import apa-apa untuk ini. Semuanya otomatis!
const navLinks = [
  { text: 'Home', to: '/' },
  { text: 'Ruangan', to: '/ruangan' },
  { text: 'Jadwal Lab', to: '/lab-terjadwal' },
  { text: 'Pinjam Barang', to: '/pinjam-barang' },
  // { text: 'Lab Non-Terjadwal', to: '/lab-non-terjadwal' },
  { text: 'Ruangan Kosong', to: '/terpinjam' },
]
</script>

<template>
  <nav class="flex justify-center items-center py-4">
    <ul class="flex items-center space-x-4 bg-white/50 backdrop-blur-sm p-2 rounded-full shadow-sm">
      <li v-for="link in navLinks" :key="link.text">
        <NuxtLink
          :to="link.to"
          class="px-5 py-2 rounded-full text-gray-700 font-medium transition-colors duration-300 hover:bg-black/10"
          active-class="bg-green-200 !text-black"
        >
          {{ link.text }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>