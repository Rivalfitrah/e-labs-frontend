<template>
  <div class="min-h-screen bg-gradient-to-br from-[#E8F5E9] to-white flex flex-col items-center justify-center font-sans relative overflow-hidden text-[#1E3A2F]">
    
    <!-- Background Accent -->
    <div class="absolute w-96 h-96 bg-[#4CAF50] rounded-full opacity-5 blur-3xl -top-20 -left-20"></div>
    <div class="absolute w-72 h-72 bg-[#8BC34A] rounded-full opacity-5 blur-3xl -bottom-10 -right-20"></div>

    <!-- Container -->
    <div class="z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center">
      
      <!-- Title -->
      <div class="text-center mb-12">
        <h1 class="text-6xl md:text-7xl font-extrabold text-[#2E7D32] tracking-tight">
          e<span class="text-[#1E3A2F] font-sans">-Labs+</span>
        </h1>
        <p class="mt-2 text-lg text-gray-600 font-medium">
          Electronic Labs & Assets Borrowing System
        </p>
      </div>

      <!-- Subtitle -->
      <div class="w-full text-center mb-10">
        <h2 class="text-3xl font-bold text-[#1E3A2F] mb-3 font-sans">
          Mulai Peminjaman Sekarang
        </h2>
        <p class="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Pilih laboratorium yang ingin Anda gunakan untuk memulai proses peminjaman. Sistem kami dirancang agar cepat dan mudah.
        </p>
      </div>

      <!-- Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full">
        
        <!-- Lab CA -->
        <div
          class="bg-white border-2 border-[#E0E0E0] rounded-3xl shadow-lg p-8 flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-[#4CAF50]"
          @click="selectLab('CA')"
        >
          <div class="bg-[#E8F5E9] p-4 rounded-full mb-6">
            <svg class="w-16 h-16 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-[#1E3A2F] text-center mb-2">Lab CA</h2>
          <p class="text-gray-500 text-center text-sm">
            Fasilitas lengkap untuk praktikum dan penelitian, fokus pada ilmu fisika & kimia.
          </p>
        </div>

        <!-- Lab CB -->
        <div
          class="bg-white border-2 border-[#E0E0E0] rounded-3xl shadow-lg p-8 flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-[#4CAF50]"
          @click="selectLab('CB')"
        >
          <div class="bg-[#E8F5E9] p-4 rounded-full mb-6">
            <svg class="w-16 h-16 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9.75 17L14.25 12 9.75 7m4.5 0L19.5 12l-5.25 5m-5.25-5L4.5 7l-5.25 5L9 17" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-[#1E3A2F] text-center mb-2">Lab CB</h2>
          <p class="text-gray-500 text-center text-sm">
            Dilengkapi komputer modern untuk coding, desain, dan kegiatan berbasis perangkat lunak.
          </p>
        </div>
      </div>
    </div>

    <!-- PopUp -->
    <PopUp
      :show="showPopup"
      @close="showPopup = false"
      @select="handleBookingOption"
    />

    <!-- Footer -->
    <footer class="absolute bottom-5 text-gray-400 text-sm">
      © 2025 e-Labs+ · All Rights Reserved
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PopUp from '~/components/pop-up.vue'

const showPopup = ref(false)
const selectedLab = ref(null)

const selectLab = (lab) => {
  selectedLab.value = lab
  showPopup.value = true
}

const handleBookingOption = (option) => {
  showPopup.value = false
  alert(`Lab ${selectedLab.value} | Peminjaman: ${option}`)
  // TODO: arahkan ke halaman kalender (terjadwal) atau login (non-terjadwal)
}
</script>


