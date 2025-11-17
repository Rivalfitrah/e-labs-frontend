<script setup>
import { ref, computed, watch } from 'vue'; // 'computed' tidak terpakai, tapi saya biarkan
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { isiFormPengajuanRuanganTerjadwal } from '/lib/api/ruangan/ruanganAPI';
import { getMatkulbyNIM } from '/lib/api/ruangan/ruanganAPI';

// === TAMBAHKAN IMPORT INI ===
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// === Props dari parent ===
const props = defineProps({
  show: Boolean,
  nim: String,
  room: {
    type: Object,
    default: () => ({})
  },
  bookingId: [String, Number],
  idPeminjaman: Number
})

const emit = defineEmits(['close', 'submitted'])

// === State lokal ===
const selectedMatkul = ref('')
const jamMulai = ref('')
const jamSelesai = ref('')
const availableMatkul = ref([])
const isLoading = ref(false) // <-- TAMBAHKAN INI UNTUK LOADING STATE

// === Ambil matkul (Tidak berubah) ===
const fetchMatkul = async () => {
  if (!props.nim) return
  try {
    const res = await getMatkulbyNIM(props.nim)
    console.log('Data matkul yang diterima:', res) 
    availableMatkul.value = res.data || [] 
  } catch (err) {
    console.error('Gagal ambil data mata kuliah:', err)
    availableMatkul.value = []
  }
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal && props.nim) {
      fetchMatkul()
    }
  },
  { immediate: true }
)

// Ketika modal dibuka, ambil ulang data matkul
watch(() => props.show, (val) => {
  if (val) fetchMatkul()
})

// === Submit form (INI YANG KITA MODIFIKASI) ===
const submitForm = async () => {
  isLoading.value = true 
  try {
    const payload = {
      id: props.bookingId,
      nim: props.nim,
      matkul_id: selectedMatkul.value,
      gedung: props.room.gedung,
      lab: props.room.name,
      jam_mulai: jamMulai.value,
      jam_selesai: jamSelesai.value
    }

    await isiFormPengajuanRuanganTerjadwal(props.idPeminjaman, payload)
    emit('submitted') 
  

  } catch (error) {
    console.error('Gagal submit form:', error)
    
    // Tampilkan SweetAlert GAGAL (ini boleh di sini)
    Swal.fire({
      title: 'Gagal!',
      text: 'Terjadi kesalahan saat mengajukan peminjaman. Silakan coba lagi.',
      icon: 'error',
      confirmButtonText: 'Tutup'
    })
  
  } finally {
    isLoading.value = false 
  }
}

const closeForm = () => {
  emit('close'); 
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto">
    
    <div v-if="room" class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg space-y-5">

      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-bold text-gray-800">Isi Detail Peminjaman</h3>
        <button @click="closeForm" class="text-gray-500 hover:text-gray-800 text-3xl font-light">&times;</button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">NIM</label>
          <input 
            type="text" 
            :value="nim" 
            disabled
            class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Gedung</label>
          <input 
            type="text" 
            :value="room.gedung" 
            disabled
            class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Lab</label>
          <input 
            type="text" 
            :value="room.name" 
            disabled
            class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
        <select 
          v-model="selectedMatkul"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="" disabled>Pilih Mata Kuliah</option>
          <option v-for="matkul in availableMatkul" :key="matkul.id" :value="matkul.id">
            {{ matkul.matkul }}
          </option>
        </select>
        <p v-if="availableMatkul.length === 0" class="text-xs text-red-500 mt-1">
          Tidak ada mata kuliah terdaftar untuk NIM ini.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
          <FlatPickr
            v-model="jamMulai"
            :config="{ enableTime: true, noCalendar: false, dateFormat: 'Y-m-d H:i' }"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
          <FlatPickr
            v-model="jamSelesai"
            :config="{ enableTime: true, noCalendar: false, dateFormat: 'Y-m-d H:i' }"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <button 
        type="button" 
        @click="submitForm"
        :disabled="!selectedMatkul || !jamMulai || !jamSelesai || availableMatkul.length === 0 || isLoading" 
        class="mt-6 w-full px-6 py-3 bg-green-600 text-white font-bold rounded-md shadow-md hover:bg-green-700 transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
      >
        <span v-if="isLoading">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        <span v-else>
          Pinjam
        </span>
      </button>

    </div>
  </div>
</template>