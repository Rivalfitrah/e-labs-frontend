<template>
  <!-- Modal Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <!-- Modal Content -->
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Edit Barang</h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nama Barang -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nama Barang
          </label>
          <input
            v-model="formData.nama_barang"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Masukkan nama barang"
          />
        </div>

        <!-- Kode Barang -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Kode Barang
          </label>
          <input
            v-model="formData.kode_barang"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Masukkan kode barang"
          />
        </div>

        <!-- Merek -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Merek
          </label>
          <input
            v-model="formData.merek"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Masukkan merek"
          />
        </div>

        <!-- Kondisi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Kondisi
          </label>
          <select
            v-model="formData.kondisi"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Pilih Kondisi</option>
            <option value="Baik">Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
          </select>
        </div>

        <!-- Jumlah -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Jumlah
          </label>
          <input
            v-model.number="formData.jumlah"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Masukkan jumlah"
          />
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-green-700 transition"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  nama_barang: '',
  kode_barang: '',
  merek: '',
  kondisi: '',
  jumlah: 0
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = { ...newData }
    }
  },
  { deep: true }
)

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('submit', formData.value)
  closeModal()
}
</script>
