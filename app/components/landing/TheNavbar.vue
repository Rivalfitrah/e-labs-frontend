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
  <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
    <div class="flex justify-between items-center py-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center space-x-2">
        <div class="text-2xl font-bold text-primary">
          e-Labs+
        </div>
      </div>
      
      <ul class="flex items-center space-x-1">
        <li v-for="link in navLinks" :key="link.text" class="nav-item">
          <NuxtLink
            :to="link.to"
            class="nav-link"
          >
            {{ link.text }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  position: relative;
  display: inline-block;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #4b5563;
  transition: color 0.3s ease;
  text-decoration: none;
  letter-spacing: 0.01em;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 2px;
  transition: transform 0.3s ease;
}

.nav-link:hover {
  color: #10b981;
}

.nav-link:hover::after {
  transform: translateX(-50%) scaleX(1);
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  color: #10b981;
  font-weight: 600;
}

.nav-link.router-link-active::after,
.nav-link.router-link-exact-active::after {
  transform: translateX(-50%) scaleX(1);
  background: linear-gradient(90deg, #10b981, #059669);
}

@media (max-width: 768px) {
  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>