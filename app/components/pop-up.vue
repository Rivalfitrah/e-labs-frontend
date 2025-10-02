<template>
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" v-if="show">
    <!-- Modal Card -->
    <div class="bg-white/80 backdrop-blur-lg border border-white/40 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn">
      
      <!-- Close Button -->
      <button
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-[var(--color-primary)] mb-2">
        Pilih Jenis Peminjaman
      </h2>
      <p class="text-gray-600 text-center mb-6 text-sm">
        Silakan pilih opsi peminjaman sesuai kebutuhan Anda
      </p>

      <!-- Options -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <!-- Terjadwal -->
        <div
          class="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/90 to-[var(--color-primary)] text-white cursor-pointer hover:-translate-y-2 hover:shadow-xl transition"
          @click="$emit('select', 'terjadwal')"
        >
          <CalendarIcon class="w-12 h-12 mb-4" />
          <h3 class="font-semibold text-lg">Terjadwal</h3>
          <p class="text-sm text-white/80 mt-2 text-center">
            Pesan lab sesuai slot jadwal yang tersedia
          </p>
        </div>

        <!-- Non Terjadwal -->
        <div
          class="flex flex-col items-center p-6 rounded-xl bg-white text-gray-800 border border-gray-200 cursor-pointer hover:-translate-y-2 hover:shadow-xl transition"
          @click="goToLogin"
        >
          <ClockIcon class="w-12 h-12 text-[var(--color-primary)] mb-4" />
          <h3 class="font-semibold text-lg">Non-Terjadwal</h3>
          <p class="text-sm text-gray-500 mt-2 text-center">
            Pinjam langsung, login diperlukan untuk konfirmasi
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import icons (lucide-vue-next)
import { Calendar as CalendarIcon, Clock as ClockIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login') // arahkan ke halaman login
}

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'select'])
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
</style>
