<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  lab: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['close']);
</script>

<template>
  <!-- BACKDROP -->
  <transition name="fade">
    <div
      v-if="show"
      @click.self="emit('close')"
      class="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/40"
    >
      <!-- MODAL CARD -->
      <transition name="scale">
        <div
          v-if="lab"
          class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 transform transition-all"
        >
          <!-- HEADER -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Detail Ruangan Dipinjam</h2>
            <button
              @click="emit('close')"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- BODY -->
          <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4">
              <span class="font-semibold text-gray-500">Jam:</span>
              <span class="col-span-2 text-gray-800">{{ lab.bookingDetails.time }}</span>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <span class="font-semibold text-gray-500">Hari Tanggal:</span>
              <span class="col-span-2 text-gray-800">{{ lab.bookingDetails.date }}</span>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <span class="font-semibold text-gray-500">Kegiatan:</span>
              <span class="col-span-2 text-gray-800">{{ lab.bookingDetails.activity }}</span>
            </div>
            <hr class="my-4" />
            <div class="grid grid-cols-3 gap-4">
              <span class="font-semibold text-gray-500">Peminjam:</span>
              <span class="col-span-2 text-gray-800 font-bold">{{ lab.bookingDetails.borrower }}</span>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <span class="font-semibold text-gray-500">Prodi:</span>
              <span class="col-span-2 text-gray-800">{{ lab.bookingDetails.major }}</span>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <span class="font-semibold text-gray-500">Angkatan:</span>
              <span class="col-span-2 text-gray-800">{{ lab.bookingDetails.classYear }}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
/* Animasi halus */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.25s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
}
</style>