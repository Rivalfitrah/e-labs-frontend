<script setup>
import { ref, computed } from 'vue';

// --- PROPS ---
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Anda yakin?'
  },
});

// --- EMITS ---
const emit = defineEmits(['close', 'confirm']);

// --- STATE ---
const nimInput = ref('');

// --- COMPUTED (Validation Logic) ---


const isNIMValid = computed(() => {
  return /^J\d+$/.test(nimInput.value); 
});

const showError = computed(() => {
  return nimInput.value.length > 0 && !isNIMValid.value;
});

const isConfirmDisabled = computed(() => {
  return !isNIMValid.value;
});


// --- METHODS ---

/**
 * Fungsi ini memfilter input secara real-time untuk
 * memastikan format 'J' + angka.
 */
function handleNimInput(event) {
  let value = event.target.value.toUpperCase();

  if (value === '') {
    nimInput.value = '';
    return;
  }

  // 1. Paksa karakter pertama harus 'J'
  if (value[0] !== 'J') {
    // Jika user mengetik selain 'J' di awal, reset inputnya
    nimInput.value = '';
  } else {
    // 2. Jika sudah 'J', filter sisa string agar hanya angka
    let rest = value.substring(1).replace(/[^0-9]/g, '');
    nimInput.value = 'J' + rest;
  }
}

/**
 * Kirim event 'confirm' dengan data NIM
 */
function handleConfirm() {
  if (isConfirmDisabled.value) return; // Keamanan ganda
  
  emit('confirm', nimInput.value);
  nimInput.value = ''; // Reset input
}

/**
 * Kirim event 'close'
 */
function handleClose() {
  emit('close');
  nimInput.value = ''; // Reset input
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-transparent bg-opacity-50 z-50 flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
      <h3 class="text-xl font-bold mb-4">{{ title }}</h3>
      
      <div class="mb-6">
        <label for="nim" class="block text-sm font-medium text-gray-700">Masukkan NIM Peminjam</label>
        <input
          id="nim"
          type="text"
          :value="nimInput"
          @input="handleNimInput"
          placeholder="Contoh: J12345678"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          :class="{ 
            'border-red-500 focus:border-red-500 focus:ring-red-500': showError, 
            'border-gray-300': !showError 
          }"
        />
        <p v-if="nimInput.length === 0" class="mt-1 text-sm text-gray-500">
          NIM harus diawali 'J' dan diikuti angka.
        </p>
      </div>

      <div class="flex justify-end gap-4">
        <button @click="handleClose" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Batal</button>
        <button 
          @click="handleConfirm"
          class="px-4 py-2 rounded-lg text-white transition-colors"
          :class="{ 
            'bg-green-500 hover:bg-green-600': !isConfirmDisabled, 
            'bg-gray-400 cursor-not-allowed': isConfirmDisabled 
          }"
          :disabled="isConfirmDisabled"
        >
          Ya, Pinjam
        </button>
      </div>
    </div>
  </div>
</template>