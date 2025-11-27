<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const navLinks = [
  { text: 'Home', to: '/' },
  { text: 'Ruangan', to: '/ruangan' },
  { text: 'Jadwal Lab', to: '/lab-terjadwal' },
  { text: 'Pinjam Barang', to: '/pinjam-barang' },
  { text: 'Ruangan Kosong', to: '/terpinjam' },
]

// State untuk mendeteksi scroll dan menu mobile
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

// Fungsi untuk menangani scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// Toggle menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Lifecycle hooks untuk event listener scroll
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav 
    class="fixed top-0 w-full z-50 transition-all duration-300 border-b"
    :class="[
      (isScrolled || isMobileMenuOpen) 
        ? 'bg-white/90 backdrop-blur-md border-gray-200 shadow-sm' 
        : 'bg-transparent border-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <div class="flex-shrink-0 flex items-center cursor-pointer" @click="$router.push('/')">
          <div class="text-2xl font-bold text-primary transition-colors duration-300">
            e-Labs+
          </div>
        </div>
        
        <div class="hidden md:block">
          <ul class="flex items-center space-x-4">
            <li v-for="link in navLinks" :key="link.text">
              <NuxtLink :to="link.to" class="nav-link">
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="flex md:hidden">
          <button 
            @click="toggleMobileMenu"
            type="button" 
            class="text-gray-500 hover:text-primary focus:outline-none focus:text-primary transition-colors"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                v-if="!isMobileMenuOpen" 
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16" 
              />
              <path 
                v-else 
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-100 shadow-lg">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.text"
            :to="link.to"
            class="mobile-nav-link block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
            @click="isMobileMenuOpen = false"
          >
            {{ link.text }}
          </NuxtLink>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
/* --- Desktop Styles --- */
.nav-link {
  position: relative;
  display: inline-block;
  padding: 0.5rem 1rem;
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
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, #10b981, #059669); /* Primary color gradient */
  border-radius: 2px;
  transition: transform 0.3s ease;
}

.nav-link:hover {
  color: #10b981; /* Primary color */
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
}

/* --- Mobile Styles Override --- */
.mobile-nav-link.router-link-active,
.mobile-nav-link.router-link-exact-active {
  color: #10b981;
  background-color: #ecfdf5; /* Light green bg active state */
  font-weight: 600;
}
</style>