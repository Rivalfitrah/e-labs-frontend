<script setup>
import { ref, watch } from 'vue';
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { pengajuanPeminjamanBarang } from '/lib/api/barang/barangApi';
import { z } from 'zod';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// === Props ===
const props = defineProps({
  show: Boolean,
  nim: String,
  selectedItems: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'submitted']);

// === State ===
const tanggalPinjam = ref('');
const tanggalKembali = ref('');
const tujuanPeminjaman = ref('');
const dokumenPendukung = ref(null);
const isLoading = ref(false);

const errors = ref({
  tanggalPinjam: "",
  tanggalKembali: "",
  tujuanPeminjaman: ""
});

// Items yang akan dipinjam (dengan jumlah dan kegiatan)
const borrowItems = ref([]);

// === Validasi Zod ===
const borrowSchema = z.object({
  tanggalPinjam: z.string().min(1, "Tanggal pinjam harus diisi"),
  tanggalKembali: z.string().min(1, "Tanggal kembali harus diisi"),
  tujuanPeminjaman: z.string().min(3, "Tujuan peminjaman minimal 3 karakter"),
}).refine((data) => {
  const start = new Date(data.tanggalPinjam);
  const end = new Date(data.tanggalKembali);
  return end >= start;
}, {
  path: ["tanggalKembali"],
  message: "Tanggal kembali harus sama atau lebih besar dari tanggal pinjam"
});

// === Watch props.selectedItems ===
watch(() => props.selectedItems, (newItems) => {
  if (newItems && newItems.length > 0) {
    borrowItems.value = newItems.map(item => ({
      barang_id: item.id,
      nama_barang: item.name,
      jumlah: 1,
      max_stock: item.stock,
      kegiatan: ''
    }));
  }
}, { immediate: true });

// === Handle File Upload ===
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    dokumenPendukung.value = file;
  }
};

// === Submit Form ===
const submitForm = async () => {
  // Reset errors
  errors.value = { tanggalPinjam: "", tanggalKembali: "", tujuanPeminjaman: "" };

  // Validasi Zod
  const result = borrowSchema.safeParse({
    tanggalPinjam: tanggalPinjam.value,
    tanggalKembali: tanggalKembali.value,
    tujuanPeminjaman: tujuanPeminjaman.value,
  });

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    errors.value.tanggalPinjam = fieldErrors.tanggalPinjam ? fieldErrors.tanggalPinjam[0] : "";
    errors.value.tanggalKembali = fieldErrors.tanggalKembali ? fieldErrors.tanggalKembali[0] : "";
    errors.value.tujuanPeminjaman = fieldErrors.tujuanPeminjaman ? fieldErrors.tujuanPeminjaman[0] : "";
    return;
  }

  // Validasi items
  const hasInvalidItems = borrowItems.value.some(item => 
    !item.jumlah || item.jumlah <= 0 || item.jumlah > item.max_stock || !item.kegiatan.trim()
  );

  if (hasInvalidItems) {
    Swal.fire({
      icon: 'warning',
      title: 'Data Tidak Lengkap',
      text: 'Pastikan setiap barang memiliki jumlah dan kegiatan yang valid.',
    });
    return;
  }

  isLoading.value = true;
  try {
    const payload = {
      ID_Peminjam: props.nim,
      items: borrowItems.value.map(item => ({
        barang_id: item.barang_id,
        jumlah: item.jumlah,
        kegiatan: item.kegiatan
      })),
      tanggal_pinjam: tanggalPinjam.value,
      tanggal_kembali: tanggalKembali.value,
      tujuan_peminjaman: tujuanPeminjaman.value,
      dokumen_pendukung: dokumenPendukung.value || undefined
    };

    await pengajuanPeminjamanBarang(payload);
    
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Peminjaman barang berhasil diajukan.',
      timer: 2000,
      showConfirmButton: false
    });

    emit('submitted');
    resetForm();

  } catch (error) {
    console.error('Gagal submit peminjaman barang:', error);
    
    const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat mengajukan peminjaman.';
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: errorMessage,
    });
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  tanggalPinjam.value = '';
  tanggalKembali.value = '';
  tujuanPeminjaman.value = '';
  dokumenPendukung.value = null;
  borrowItems.value = [];
  errors.value = { tanggalPinjam: "", tanggalKembali: "", tujuanPeminjaman: "" };
};

const closeForm = () => {
  resetForm();
  emit('close');
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 overflow-y-auto">
    <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-2xl space-y-5 my-8">
      
      <!-- Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-bold text-gray-800">Form Peminjaman Barang</h3>
        <button @click="closeForm" class="text-gray-500 hover:text-gray-800 text-3xl font-light">&times;</button>
      </div>

      <!-- NIM -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">NIM/NIP Peminjam</label>
        <input 
          type="text" 
          :value="nim" 
          disabled
          class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <!-- Daftar Barang yang Dipinjam -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Barang yang Dipinjam</label>
        <div class="space-y-3 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
          <div 
            v-for="(item, index) in borrowItems" 
            :key="index"
            class="bg-gray-50 p-3 rounded-md space-y-2"
          >
            <div class="font-medium text-gray-800">{{ item.nama_barang }}</div>
            
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-600 mb-1">Jumlah (Max: {{ item.max_stock }})</label>
                <input 
                  v-model.number="item.jumlah" 
                  type="number" 
                  min="1" 
                  :max="item.max_stock"
                  class="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label class="block text-xs text-gray-600 mb-1">Kegiatan</label>
                <select 
                  v-model="item.kegiatan" 
                  class="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                >
                  <option disabled value="">Pilih Kegiatan</option>
                  <option value="Kuliah">Kuliah</option>
                  <option value="Praktikum">Praktikum</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tanggal Pinjam & Kembali -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal & Jam Pinjam</label>
          <FlatPickr
            v-model="tanggalPinjam"
            :config="{ enableTime: true, dateFormat: 'Y-m-d H:i', time_24hr: true }"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          <p v-if="errors.tanggalPinjam" class="text-xs text-red-500 mt-1">{{ errors.tanggalPinjam }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal & Jam Kembali</label>
          <FlatPickr
            v-model="tanggalKembali"
            :config="{ enableTime: true, dateFormat: 'Y-m-d H:i', time_24hr: true }"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          <p v-if="errors.tanggalKembali" class="text-xs text-red-500 mt-1">{{ errors.tanggalKembali }}</p>
        </div>
      </div>

      <!-- Tujuan Peminjaman -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan Peminjaman</label>
        <textarea 
          v-model="tujuanPeminjaman" 
          rows="3"
          placeholder="Jelaskan tujuan peminjaman..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        ></textarea>
        <p v-if="errors.tujuanPeminjaman" class="text-xs text-red-500 mt-1">{{ errors.tujuanPeminjaman }}</p>
      </div>

      <!-- Dokumen Pendukung (Optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Dokumen Pendukung (Opsional)</label>
        <input 
          type="file" 
          @change="handleFileChange"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
        />
        <p class="text-xs text-gray-500 mt-1">Format: PDF, DOC, DOCX, JPG, PNG (Max 5MB)</p>
      </div>

      <!-- Submit Button -->
      <button 
        @click="submitForm"
        :disabled="isLoading || borrowItems.length === 0"
        class="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-md shadow-md hover:bg-green-700 transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
      >
        <span v-if="isLoading">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memproses...
        </span>
        <span v-else>
          Ajukan Peminjaman
        </span>
      </button>

    </div>
  </div>
</template>
