<script setup>
import { ref, computed } from 'vue';
import { Upload } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  roleOptions: {
    type: Array,
    required: true
  },
  prodiOptions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'submit']);

const newUserData = ref({
  nama: '',
  email: '',
  password: '',
  roleId: 1,
  NIM: null,
  NIP: null,
  semester: null,
  prodiId: null,
});

const newProfileFile = ref(null);
const newFileInput = ref(null);

// --- Computed Properties ---
const isNewUserMahasiswa = computed(() => newUserData.value.roleId === 1);
const isNewUserDosenPengelola = computed(() => newUserData.value.roleId !== 1);

const newProfilePreviewUrl = computed(() => {
  if (newProfileFile.value) {
    return URL.createObjectURL(newProfileFile.value);
  }
  return 'https://placehold.co/150x150/f1f1f1/333333?text=N/A';
});

// --- Methods ---
function validateFile(file) {
  if (!file.type.startsWith('image/')) {
    return { valid: false, message: 'File harus berupa gambar.' };
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    return { valid: false, message: 'Ukuran gambar maksimal 5MB.' };
  }
  return { valid: true };
}

function handleNewProfileFileChange(event) {
  const file = event.target.files?.[0];
  if (file) {
    const validation = validateFile(file);
    if (validation.valid) {
      newProfileFile.value = file;
    } else {
      newProfileFile.value = null;
      emit('validation-error', validation.message);
    }
  }
}

function handleClose() {
  // Reset form
  newUserData.value = {
    nama: '',
    email: '',
    password: '',
    roleId: 1,
    NIM: null,
    NIP: null,
    semester: null,
    prodiId: null,
  };
  newProfileFile.value = null;
  emit('close');
}

function handleSubmit() {
  const payload = { ...newUserData.value };

  // Validasi sesuai backend
  if (payload.roleId === 1) {
    // Mahasiswa: wajib NIM, tidak boleh NIP
    if (!payload.NIM) {
      emit('validation-error', 'NIM wajib diisi untuk mahasiswa');
      return;
    }
    payload.NIP = null;
  } else {
    // Dosen/Pengelola/Admin: wajib NIP, tidak boleh NIM
    if (!payload.NIP) {
      emit('validation-error', 'NIP wajib diisi untuk dosen/pengelola/admin');
      return;
    }
    payload.NIM = null;
    payload.semester = null;
    payload.prodiId = null;
  }

  emit('submit', {
    userData: payload,
    profileFile: newProfileFile.value
  });

  handleClose();
}

</script>

<template>
  <!-- Tambah User Modal -->
  <div v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
    @click.self="handleClose">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Modal Content Container -->
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto"
      @click.stop>

      <h2 class="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
        Tambah Pengguna Baru
      </h2>

      <!-- Close Button -->
      <button @click="handleClose" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Form Tambah User -->
      <form @submit.prevent="handleSubmit" class="space-y-4">

        <div class="grid grid-cols-2 gap-4">
          <!-- Role -->
          <div>
            <label for="add_role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select id="add_role" v-model.number="newUserData.roleId"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
              required>
              <option v-for="role in roleOptions" :key="role.value" :value="role.value">
                {{ role.label }}
              </option>
            </select>
          </div>

          <!-- Nama -->
          <div>
            <label for="add_nama" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input id="add_nama" type="text" v-model="newUserData.nama"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
              required />
          </div>

          <!-- Email -->
          <div>
            <label for="add_email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="add_email" type="email" v-model="newUserData.email"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
              required />
          </div>

        </div>
        <div>
          <label for="add_password" class="block text-sm font-medium text-gray-700 mb-1">Password (Awal)</label>
          <input id="add_password" type="password" v-model="newUserData.password"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            required />
        </div>
        <!-- FIELD SPESIFIK MAHASISWA & DOSEN/PENGELOLA -->
        <transition name="fade">
          <div v-if="isNewUserMahasiswa" class="space-y-4 pt-2 border-t border-gray-100">
            <h4 class="text-md font-semibold text-gray-800">Detail Mahasiswa</h4>
            <div class="grid grid-cols-2 gap-4">
              <!-- NIM -->
              <div>
                <label for="add_nim" class="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                <input id="add_nim" type="text" v-model="newUserData.NIM"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                  required />
              </div>
              <!-- Semester -->
              <div>
                <label for="add_semester" class="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <input id="add_semester" type="number" v-model.number="newUserData.semester"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                  min="1" />
              </div>
            </div>
            <!-- Prodi ID -->
            <div>
              <label for="add_prodi_id" class="block text-sm font-medium text-gray-700 mb-1">Program Studi
                (Prodi)</label>
              <select id="add_prodi_id" v-model.number="newUserData.prodiId"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
                required>
                <option :value="null" disabled>Pilih Prodi</option>
                <option v-for="prodi in prodiOptions" :key="prodi.value" :value="prodi.value">
                  {{ prodi.label }}
                </option>
              </select>
            </div>
          </div>
          <div v-else-if="isNewUserDosenPengelola" class="space-y-4 pt-2 border-t border-gray-100">
            <h4 class="text-md font-semibold text-gray-800">Detail Dosen/Staf</h4>
            <div>
              <label for="add_nip" class="block text-sm font-medium text-gray-700 mb-1">NIP</label>
              <input id="add_nip" type="text" v-model="newUserData.NIP"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                required />
            </div>
          </div>
        </transition>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="handleClose"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm">
            Batal
          </button>
          <button type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md">
            Tambah Pengguna
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Untuk transisi field spesifik mahasiswa/dosen di modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
