<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, Image as ImageIcon, Upload, Ban, MailWarningIcon, GraduationCap, User, ShieldCheck, UserCheck, UserX } from 'lucide-vue-next';

// Impor API (Asumsi path ini sudah benar di project Anda)
import {
  listUser, updateUser, deleteUser, createUser, dashboardUser, deactivatedUser,
  reactivateUser, getProdiList, giveWarning, importUsers
} from '~/lib/api/pengguna';
import { storage_URL } from '~/lib/base.js'

import UiInfoBox from '~/components/ui/infoBox.vue'
import UiPagination from '~/components/ui/pagination.vue'
import AddUserModal from '~/components/ui/AddUserModal.vue'

definePageMeta({
  layout: 'dashboard'
});

// --- STATE MANAGEMENT ---
const users = ref([]);
const isLoading = ref(true);
const search = ref('');
const notification = ref({ show: false, message: '', type: 'success' });
const getProdiOptions = ref([]);

const roleOptions = [
  { value: 1, label: 'Mahasiswa', name: 'mahasiswa' },
  { value: 2, label: 'Dosen', name: 'dosen' },
  { value: 3, label: 'Pengelola', name: 'pengelola' },
  { value: 4, label: 'Superadmin', name: 'superadmin' },
];

const dashboardStats = ref({
  mahasiswa: 0, dosen: 0, pengelola: 0, aktif: 0, blokir: 0
});

// Modal State
const isEditModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const isAddModalOpen = ref(false);

const initialSelectedUser = {
  id: undefined, uniqueId: '', nama: '', email: '', NIM: null, NIP: null, semester: null, prodiId: null,
  role: { id: 1, nama_role: 'mahasiswa' }, roleId: 1, isBlocked: false, profil: null
};

const selectedUser = ref({ ...initialSelectedUser });
const profileFile = ref(null);

// --- UTILITY FUNCTIONS ---

function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
}

function getRoleLabel(roleName) {
  if (!roleName) return 'N/A';
  return roleOptions.find(r => r.name === roleName)?.label || roleName;
}

function getStatusClass(isBlocked) {
  return isBlocked
    ? 'bg-red-100 text-red-800'
    : 'bg-green-100 text-green-800';
}

function getProfileUrl(path) {
  if (!path || path === 'null') {
    return 'https://placehold.co/40x40/f1f1f1/333333?text=N/A';
  }
  // Jika path sudah mengandung http/https, asumsikan itu URL penuh.
  if (path.startsWith('http') || path.startsWith('https')) {
    return path;
  }
  // Jika tidak, tambahkan storage_URL
  return `${storage_URL}/uploads/${path}`;
}

function validateFile(file) {
  if (!file.type.startsWith('image/')) {
    showNotification('File harus berupa gambar.', 'error');
    return false;
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    showNotification('Ukuran gambar maksimal 5MB.', 'error');
    return false;
  }
  return true;
}

// --- PAGINATION & FILTERING ---
const itemsPerPage = ref(10);
const currentPage = ref(1);
// PAGINATION SMART (Dinamis dengan elipsis)
const paginationPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= maxPagesToShow) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');
    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);

    if (current <= 3) end = 4;
    if (current >= total - 2) start = total - 3;

    start = Math.max(start, 2);
    end = Math.min(end, total - 1);

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < total) pages.push(i);
    }

    if (current < total - 2) pages.push('...');
    pages.push(total);
  }
  return pages.filter((page, idx, arr) => page !== '...' || arr[idx - 1] !== '...');
});
const filteredUsers = computed(() => {
  const query = search.value.toLowerCase().trim();
  const dataArray = users.value;

  if (!query) {
    return dataArray;
  }
  return dataArray.filter(item =>
    item.nama?.toLowerCase().includes(query) ||
    item.email?.toLowerCase().includes(query) ||
    item.uniqueId?.toLowerCase().includes(query)
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}
function prevPage() { if (currentPage.value > 1) currentPage.value--; }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++; }

// --- DATA FETCHING ---
async function fetchInitialData() {
  isLoading.value = true;
  try {
    // Gabungkan semua API calls ke Promise.all
    const [userResponse, statsResponse, prodiResponse] = await Promise.all([
      listUser(),
      dashboardUser(),
      getProdiList(),
    ]);

    // 1. User List
    const actualUserData = Array.isArray(userResponse) ? userResponse : (userResponse?.data || []);
    users.value = actualUserData;

    // 2. Dashboard Stats
    const statsData = statsResponse?.data;
    if (statsData && typeof statsData === 'object') {
      dashboardStats.value = {
        mahasiswa: statsData.totalMahasiswa || 0,
        dosen: statsData.totalDosen || 0,
        pengelola: statsData.totalPengelola || 0,
        aktif: statsData.totalActive || 0,
        blokir: statsData.totalBlocked || 0
      };
    }

    // 3. Prodi List
    const prodiData = prodiResponse?.data || [];
    getProdiOptions.value = prodiData.map((prodi) => ({
      value: prodi.id,
      label: prodi.nama_prodi
    }));

  } catch (error) {
    console.error('❌ Failed to fetch initial data:', error);
    showNotification('Gagal memuat data awal.', 'error');
    users.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchInitialData();
});

// --- MODAL HANDLERS ---

function openEditModal(item) {
  // Membuat salinan dalam format yang dibutuhkan modal
  selectedUser.value = {
    ...item,
    roleId: item.role ? item.role.id : 1,
    // Pastikan prodiId/NIM/NIP diisi dengan null jika kosong
    prodiId: item.prodiId || null,
    NIM: item.NIM || null,
    NIP: item.NIP || null,
  };
  isEditModalOpen.value = true;
}

function closeEditModal() {
  isEditModalOpen.value = false;
  selectedUser.value = { ...initialSelectedUser };
}

function openAddModal() {
  isAddModalOpen.value = true;
}

function closeAddModal() {
  isAddModalOpen.value = false;
}

function openProfileModal(item) {
  selectedUser.value = { ...item };
  profileFile.value = null;
  isProfileModalOpen.value = true;
}

function closeProfileModal() {
  isProfileModalOpen.value = false;
  profileFile.value = null;
}

// --- FILE HANDLERS (MODAL) ---

function handleProfileFileChange(event) {
  const file = event.target.files?.[0];
  if (file && validateFile(file)) {
    profileFile.value = file;
  } else {
    profileFile.value = null;
  }
}

const profilePreviewUrl = computed(() => {
  if (profileFile.value) {
    return URL.createObjectURL(profileFile.value);
  }
  return getProfileUrl(selectedUser.value.profil);
});

// --- FIELD VISIBILITY COMPUTED PROPERTIES ---

const isSelectedUserMahasiswa = computed(() => selectedUser.value.roleId === 1);
const isSelectedUserDosenPengelola = computed(() => selectedUser.value.roleId !== 1 && selectedUser.value.roleId !== undefined);


// --- CRUD HANDLERS ---

async function handleSave() {
  const newRole = roleOptions.find(r => r.value === selectedUser.value.roleId);

  if (!newRole) {
    showNotification('Role yang dipilih tidak valid.', 'error');
    return;
  }

  // Siapkan data yang akan dikirim (tanpa field null/undefined yang tidak relevan)
  const dataToUpdate = {
    nama: selectedUser.value.nama,
    email: selectedUser.value.email,
    roleId: newRole.value,
    isBlocked: selectedUser.value.isBlocked,
  };

  // Tambahkan field spesifik
  if (isSelectedUserMahasiswa.value) {
    dataToUpdate.NIM = selectedUser.value.NIM;
    dataToUpdate.semester = selectedUser.value.semester;
    dataToUpdate.prodiId = selectedUser.value.prodiId;
  } else if (isSelectedUserDosenPengelola.value) {
    dataToUpdate.NIP = selectedUser.value.NIP;
  }

  try {
    await updateUser(selectedUser.value.uniqueId, dataToUpdate);

    // Update state lokal
    const index = users.value.findIndex(u => u.uniqueId === selectedUser.value.uniqueId);
    if (index !== -1) {
      // Lakukan update dengan data baru dari modal
      Object.assign(users.value[index], {
        ...selectedUser.value,
        role: { id: newRole.value, nama_role: newRole.name },
      });
    }

    Swal.fire({
      icon: 'success', title: 'Berhasil!',
      text: 'Perubahan data pengguna berhasil disimpan!',
      timer: 2000, showConfirmButton: false
    });
  } catch (error) {
    console.error('❌ Gagal menyimpan perubahan:', error);
    showNotification('Gagal menyimpan perubahan. Periksa konsol.', 'error');
  } finally {
    closeEditModal();
  }
}

async function handleProfileUpload() {
  if (!profileFile.value) {
    showNotification('Pilih gambar profil untuk diunggah.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('foto_profile', profileFile.value);

  // Kirim data non-file minimal untuk menghindari backend menganggap body kosong
  formData.append('roleId', selectedUser.value.roleId ? String(selectedUser.value.roleId) : '1');

  try {
    const response = await updateUser(selectedUser.value.uniqueId, formData);

    // Asumsikan respons berisi path profil baru (misal: response.data.profil)
    const newProfilePath = response?.data?.profil || profileFile.value.name;

    const index = users.value.findIndex(u => u.uniqueId === selectedUser.value.uniqueId);
    if (index !== -1) {
      users.value[index].profil = newProfilePath;
    }

    Swal.fire({
      icon: 'success', title: 'Berhasil!',
      text: 'Foto profil berhasil diunggah!', timer: 2000, showConfirmButton: false
    });

  } catch (error) {
    console.error('❌ Gagal mengunggah profil:', error);
    showNotification('Gagal mengunggah profil. Cek koneksi atau izin API.', 'error');
  } finally {
    closeProfileModal();
  }
}


async function handleAddSubmit({ userData, profileFile }) {
  // Validasi dasar
  if (!userData.nama || !userData.email || !userData.password || !userData.uniqueId) {
    showNotification('Nama, Email, Password, dan ID Unik wajib diisi.', 'error');
    return;
  }

  const formData = new FormData();

  // Append fields
  for (const key in userData) {
    // Cek apakah key adalah 'semester' atau 'prodiId' dan nilainya 0 atau null, jika iya, lewati
    if ((key === 'semester' || key === 'prodiId') && (userData[key] === null || userData[key] === 0)) {
      continue;
    }
    formData.append(key, userData[key] ? String(userData[key]) : '');
  }

  // Append image file if present
  if (profileFile) {
    formData.append('foto_profile', profileFile);
  }

  try {
    const response = await createUser(formData);
    const newUserDataFromApi = response.data;

    if (newUserDataFromApi) {
      // Update role object agar sesuai dengan data user
      const roleInfo = roleOptions.find(r => r.value === newUserDataFromApi.roleId);
      const newUser = {
        ...newUserDataFromApi,
        role: { id: newUserDataFromApi.roleId, nama_role: roleInfo?.name || 'mahasiswa' },
        isBlocked: false, // Asumsi default tidak terblokir
        profil: newUserDataFromApi.profil || null
      }

      users.value.push(newUser);
      currentPage.value = totalPages.value;
    } else {
      // Fallback: refetch data jika respons API tidak lengkap
      await fetchInitialData();
    }

    Swal.fire({
      icon: 'success', title: 'Berhasil!',
      text: `Pengguna "${userData.nama}" berhasil ditambahkan!`,
      timer: 2000, showConfirmButton: false
    });

  } catch (error) {
    console.error('❌ Gagal menambah pengguna:', error);
    showNotification('Gagal menambah pengguna. Cek konsol.', 'error');
  } finally {
    closeAddModal();
  }
}


async function confirmDelete(item) {
  const result = await Swal.fire({
    title: 'Apakah Anda Yakin?',
    text: `Anda akan menghapus pengguna "${item.nama}" (${item.uniqueId}) secara permanen.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  });

  if (result.isConfirmed) {
    await handleDelete(item.uniqueId, item.nama);
  }
}

async function handleDelete(uniqueId, nama) {
  try {
    await deleteUser(uniqueId);

    users.value = users.value.filter(u => u.uniqueId !== uniqueId);
    if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }

    Swal.fire({
      title: 'Terhapus!', text: `Pengguna "${nama}" telah berhasil dihapus.`,
      icon: 'success', timer: 2000, showConfirmButton: false
    });

  } catch (error) {
    console.error('❌ Gagal menghapus pengguna:', error);
    Swal.fire({
      title: 'Gagal!',
      text: `Gagal menghapus pengguna "${nama}". Silakan coba lagi.`,
      icon: 'error'
    });
  }
}

// --- DEACTIVATE / REACTIVATE HANDLERS ---
async function handleDeactivate(item) {
  const action = item.isBlocked ? 'mengaktifkan' : 'memblokir';
  const confirmTitle = item.isBlocked ? 'Aktifkan Pengguna?' : 'Blokir Pengguna?';
  const confirmText = item.isBlocked ?
    `Anda akan mengaktifkan kembali pengguna "${item.nama}".` :
    `Anda yakin ingin memblokir pengguna "${item.nama}" (${item.NIM || item.NIP || item.uniqueId})? Ini akan membatasi aksesnya.`;

  const result = await Swal.fire({
    title: confirmTitle,
    text: confirmText,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: item.isBlocked ? '#22c55e' : '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: item.isBlocked ? 'Ya, Aktifkan!' : 'Ya, Blokir!',
    cancelButtonText: 'Batal'
  });

  if (result.isConfirmed) {
    try {
      if (item.isBlocked) {
        await reactivateUser(item.id);
      } else {
        await deactivatedUser(item.id);
      }

      // Update local state dan refetch stats
      const index = users.value.findIndex(u => u.id === item.id);
      if (index !== -1) {
        users.value[index].isBlocked = !item.isBlocked;
      }
      await fetchInitialData(); // Ambil data stats terbaru

      Swal.fire({
        title: 'Berhasil!',
        text: `Pengguna "${item.nama}" berhasil di${action}an.`,
        icon: 'success',
        timer: 2000, showConfirmButton: false
      });

    } catch (error) {
      console.error(`❌ Gagal ${action} pengguna:`, error);
      Swal.fire({
        title: 'Gagal!', text: `Gagal ${action} pengguna. Silakan coba lagi.`, icon: 'error'
      });
    }
  }
}

// Gabungkan handleReactivate ke handleDeactivate (toggle status) untuk DRY
async function handleToggleBlock(item) {
  await handleDeactivate(item);
}


async function handleGiveWarning(user) {
  try {
    const result = await Swal.fire({
      title: 'Konfirmasi Peringatan',
      text: `Anda akan memberi peringatan kepada "${user.nama}" (${user.NIM || user.NIP || user.uniqueId}). Lanjutkan?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e42',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Beri Peringatan!',
      cancelButtonText: 'Batal'
    });
    if (!result.isConfirmed) return;

    const response = await giveWarning(user.uniqueId);

    // Update totalPeringatan di array users secara lokal
    const idx = users.value.findIndex(u => u.uniqueId === user.uniqueId);
    if (idx !== -1) {
      const newCount = response?.totalPeringatan ?? (users.value[idx].totalPeringatan ?? 0) + 1;
      users.value[idx].totalPeringatan = newCount;
    }

    Swal.fire({
      icon: 'success', title: 'Peringatan Diberikan!',
      text: `Peringatan telah berhasil dikirim kepada "${user.nama}".`,
      timer: 2000, showConfirmButton: false
    });
  } catch (error) {
    console.error('❌ Gagal memberi peringatan:', error);
    showNotification('Gagal memberi peringatan. Cek konsol.', 'error');
  }
}
// ...existing code...

async function handleImportFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validasi ekstensi file
  const validExtensions = ['.xlsx', '.xls'];
  const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  
  if (!validExtensions.includes(fileExtension)) {
    Swal.fire({
      icon: 'error',
      title: 'Format File Salah',
      text: 'Hanya file Excel (.xlsx, .xls) yang diperbolehkan!',
    });
    event.target.value = '';
    return;
  }

  // Tampilkan loading saat proses import
  Swal.fire({
    title: 'Mengupload File...',
    html: `
      <div class="flex flex-col items-center">
        <div class="mb-4">Mohon tunggu, file sedang diproses</div>
        <div class="text-sm text-gray-500">${file.name}</div>
      </div>
    `,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const formData = new FormData();
    formData.append('excelFile', file);

    await importExcelPengguna(formData);

    // Reset input file
    event.target.value = '';
  } catch (error) {
    console.error('Error handling import:', error);
    
    // Tampilkan error jika gagal
    Swal.fire({
      icon: 'error',
      title: 'Gagal Import!',
      text: error.response?.data?.message || 'Terjadi kesalahan saat mengimport file. Silakan coba lagi.',
    });
    
    // Reset input file
    event.target.value = '';
  }
}

async function importExcelPengguna(formData) {
  try {
    const response = await importUsers(formData);
    
    // Refresh data
    await fetchInitialData();
    
    // Tutup loading dan tampilkan success
    Swal.fire({
      icon: 'success',
      title: 'Import Berhasil!',
      html: `
        <div class="text-center">
          <p class="text-lg mb-2">Data pengguna berhasil diimport!</p>
          <p class="text-sm text-gray-600">Total data yang berhasil diimport: <strong>${response?.data?.totalImported || 'N/A'}</strong></p>
        </div>
      `,
      timer: 3000,
      showConfirmButton: true,
      confirmButtonText: 'OK'
    });
    
    return response;
  } catch (error) {
    showNotification('Gagal import pengguna. Cek file dan format.', 'error');
    console.error('Error importing users:', error);
    throw error;
  }
}

// Fungsi Drag & Drop (Opsional, tapi sudah ada di template)
function handleDragOver(event) {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
}
function handleDragLeave() {
  // Tidak ada aksi spesifik di sini
}
function handleDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer?.files?.[0];
  if (file && validateFile(file)) {
    profileFile.value = file;
  }
}

// Alias untuk template (gunakan dashboardStats sebagai userStats)
const userStats = computed(() => dashboardStats.value)
</script>


<template>
  <div>
    <!-- Toast Notification -->
    <transition enter-active-class="transition ease-out duration-300 transform"
      enter-from-class="opacity-0 translate-y-full" enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-300 transform" leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-full">
      <div v-if="notification.show" :class="{
        'bg-green-500': notification.type === 'success',
        'bg-red-500': notification.type === 'error'
      }" class="fixed bottom-4 right-4 text-white p-4 rounded-lg shadow-xl z-50 transition-all duration-300">
        {{ notification.message }}
      </div>
    </transition>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <UiInfoBox type="mahasiswa" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <GraduationCap class="w-4 h-4 text-primary" />
            Total Mahasiswa
          </span>
        </template>
        <span class="text-2xl font-bold text-primary">{{ userStats?.mahasiswa || 0 }}</span>
      </UiInfoBox>

      <UiInfoBox type="dosen" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <User class="w-4 h-4 text-blue-600" />
            Total Dosen
          </span>
        </template>
        <span class="text-2xl font-bold text-blue-600">{{ userStats?.dosen || 0 }}</span>
      </UiInfoBox>

      <UiInfoBox type="pengelola" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-yellow-600" />
            Total Pengelola
          </span>
        </template>
        <span class="text-2xl font-bold text-yellow-600">{{ userStats?.pengelola || 0 }}</span>
      </UiInfoBox>

      <UiInfoBox type="active" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <UserCheck class="w-4 h-4 text-green-600" />
            Pengguna Aktif
          </span>
        </template>
        <span class="text-2xl font-bold text-green-600">{{ userStats?.aktif || 0 }}</span>
      </UiInfoBox>

      <UiInfoBox type="blocked" class="hover:scale-105 transition-transform duration-200">
        <template #title>
          <span class="flex items-center gap-2">
            <UserX class="w-4 h-4 text-red-600" />
            Pengguna Terblokir
          </span>
        </template>
        <span class="text-2xl font-bold text-red-600">{{ userStats?.blokir || 0 }}</span>
      </UiInfoBox>
    </div>

    <div class="flex flex-col md:flex-row md:items-center gap-2 mb-4 mt-8">
      <div class="flex relative w-full">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" v-model="search"
          class="pl-10 pr-4 py-2 w-full border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
          placeholder="Cari Nama, ID, atau Email Pengguna..." />
      </div>
      <button @click="openAddModal"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md mr-2 flex items-center gap-2">
        <span>Tambah</span>
      </button>
      <label class="inline-flex items-center cursor-pointer relative">
        <span
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md flex items-center gap-2"
          tabindex="0" @keydown.enter="$refs.importInput.click()" @click="$refs.importInput.click()">
          <span>Import</span>
        </span>
        <input ref="importInput" type="file" accept=".xlsx,.xls"
          class="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer" @change="handleImportFile" />
      </label>
    </div>


    <div v-if="isLoading" class="text-center py-8 text-lg text-gray-500">
      Memuat data pengguna...
    </div>


    <div v-else-if="users.length === 0"
      class="text-center py-8 text-lg text-gray-500 border border-dashed rounded-lg p-10 bg-white">
      Tidak ada data pengguna yang ditemukan.
    </div>


    <div v-else class="shadow-xl rounded-xl overflow-hidden bg-white">
      <!-- Wrapper untuk tabel dengan overflow horizontal -->
      <div class="overflow-x-auto">
        <table class="w-full table-fixed border-separate border-spacing-0 min-w-max">
          <thead>
            <tr class="bg-primary text-white text-center text-xs uppercase tracking-wider">
              <th class="text-center px-3 py-3 w-16">No</th>
              <th class="text-center px-3 py-3 w-16">KLP</th>
              <th class="text-center px-3 py-3 w-20">Foto</th>
              <th class="text-left px-3 py-3 w-48">Nama & Email</th>
              <th class="text-center px-3 py-3 w-32">ID/NIM/NIP</th>
              <th class="text-center px-3 py-3 w-24">Role</th>
              <th class="text-center px-3 py-3 w-36">Prodi</th>
              <th class="text-center px-3 py-3 w-20">Semester</th>
              <th class="text-center px-3 py-3 w-24">Peringatan</th>
              <th class="text-center px-3 py-3 w-24">Status</th>
              <th class="text-center px-3 py-3 w-40">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-xs text-center">
            <tr v-for="(data, index) in paginatedUsers" :key="data.id"
              class="hover:bg-gray-50 transition border-t border-gray-100">
              <td class="px-3 py-3 font-mono align-middle">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="px-3 py-3 font-mono text-gray-500 align-middle">
                <div class="wrap-break-word text-xs">{{ data.KLP }}</div>
              </td>
              <td class="px-3 py-3 align-middle">
                <div class="w-8 h-8 rounded-full overflow-hidden border border-gray-300 shrink-0 mx-auto">
                  <img :src="getProfileUrl(`${storage_URL}/uploads/${data.profilUrl}`)" alt="Foto Profil"
                    class="w-full h-full object-cover"
                    onerror="this.onerror=null;this.src='https://placehold.co/32x32/f1f1f1/333333?text=N/A';" />
                </div>
              </td>
              <td class="px-3 py-3 text-left align-middle font-semibold">
                <div class="w-full">
                  <p class="wrap-break-word text-xs font-semibold leading-tight">{{ data.nama }}</p>
                  <p class="wrap-break-word text-xs text-gray-500 font-normal leading-tight mt-1">{{ data.email }}</p>
                </div>
              </td>
              <td class="px-3 py-3 font-mono text-gray-500 align-middle">
                <div class="wrap-break-word text-xs">{{ data.NIM || data.NIP || data.uniqueId }}</div>
              </td>
              <td class="px-3 py-3 align-middle">
                <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium wrap-break-word">
                  {{ data.role ? getRoleLabel(data.role.nama_role) : 'N/A' }}
                </span>
              </td>
              <td class="px-3 py-3 align-middle">
                <span v-if="data.prodiId"
                  class="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium wrap-break-word">
                  {{getProdiOptions.find(p => p.value === data.prodiId)?.label || 'N/A'}}
                </span>
                <span v-else class="text-gray-400 text-xs">N/A</span>
              </td>
              <td class="px-3 py-3 align-middle">
                <span v-if="data.semester"
                  class="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  {{ data.semester }}
                </span>
                <span v-else class="text-gray-400 text-xs">N/A</span>
              </td>
              <td class="px-3 py-3 align-middle">
                <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  {{ data.totalPeringatan ?? 0 }}
                </span>
              </td>
              <td class="px-3 py-3 align-middle">
                <span :class="getStatusClass(data.isBlocked)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                  {{ data.isBlocked ? 'BLOCKED' : 'AKTIF' }}
                </span>
              </td>
              <td class="px-3 py-3 text-center align-middle">
                <div class="flex justify-center items-center gap-1 flex-wrap">
                  <button @click="openProfileModal(data)" title="Ubah Foto Profil"
                    class="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                    <ImageIcon class="inline w-3 h-3" />
                  </button>
                  <button @click="handleToggleBlock(data)"
                    :title="data.isBlocked ? 'Aktifkan Pengguna' : 'Blokir Pengguna'" :class="{
                      'bg-green-600 hover:bg-green-700': data.isBlocked,
                      'bg-red-500 hover:bg-red-600': !data.isBlocked && (data.totalPeringatan ?? 0) >= 3,
                      'bg-red-800 hover:bg-red-900': !data.isBlocked && (data.totalPeringatan ?? 0) < 3,
                    }"
                    class="text-white p-1.5 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                    <Ban class="inline w-3 h-3" />
                  </button>
                  <button @click="handleGiveWarning(data)"
                    class="bg-orange-500 hover:bg-orange-600 text-white p-1.5 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center"
                    title="Beri Peringatan">
                    <MailWarningIcon class="inline w-3 h-3" />
                  </button>
                  <button @click="openEditModal(data)" title="Ubah Pengguna"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                    <Pencil class="inline w-3 h-3" />
                  </button>
                  <button @click="confirmDelete(data)" title="Hapus Pengguna"
                    class="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                    <Trash2 class="inline w-3 h-3" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedUsers.length === 0 && filteredUsers.length > 0">
              <td colspan="10" class="text-center py-4 text-gray-500">Tidak ada pengguna di halaman ini.</td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="10" class="text-center py-4 text-gray-500">Tidak ada hasil yang cocok dengan pencarian Anda.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Component -->
      <UiPagination :current-page="currentPage" :total-pages="totalPages" :total-items="filteredUsers.length"
        :items-per-page="itemsPerPage" item-label="pengguna" @previous="prevPage" @next="nextPage"
        @go-to-page="goToPage" />
    </div>


    <!-- Edit User Modal -->
    <div v-if="isEditModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      @click.self="closeEditModal">

      <div class="absolute inset-0 bg-black opacity-50"></div>

      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 scale-100 opacity-100"
        @click.stop>

        <h2 class="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
          Ubah Data Pengguna: <br><span class="text-primary">{{ selectedUser?.nama }}</span>
        </h2>

        <button @click="closeEditModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form v-if="selectedUser" @submit.prevent="handleSave" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <!-- Nama -->
            <div>
              <label for="modal_nama" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input id="modal_nama" type="text" v-model="selectedUser.nama"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                required />
            </div>

            <!-- Email -->
            <div>
              <label for="modal_email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="modal_email" type="email" v-model="selectedUser.email"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                required />
            </div>
          </div>
          <!-- Role -->
          <div>
            <label for="modal_role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select id="modal_role" v-model.number="selectedUser.roleId"
              class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
              required>
              <option v-for="role in roleOptions" :key="role.value" :value="role.value">
                {{ role.label }}
              </option>
            </select>
          </div>
          <!-- FIELD SPESIFIK MAHASISWA -->
          <div v-if="isSelectedUserMahasiswa" class="space-y-4 pt-2 border-t border-gray-100">
            <h4 class="text-md font-semibold text-gray-800">Detail Mahasiswa</h4>
            <div class="grid grid-cols-2 gap-4">
              <!-- NIM -->
              <div>
                <label for="modal_nim" class="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                <input id="modal_nim" type="text" v-model="selectedUser.NIM"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                  required />
              </div>

              <!-- Semester -->
              <div>
                <label for="modal_semester" class="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <input id="modal_semester" type="number" v-model.number="selectedUser.semester"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                  min="1" />
              </div>
            </div>
            <!-- Prodi -->
            <div>
              <label for="modal_prodi" class="block text-sm font-medium text-gray-700 mb-1">Program Studi
                (Prodi)</label>
              <select id="modal_prodi" v-model.number="selectedUser.prodiId"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white">
                <option value="" disabled>Pilih Prodi</option>
                <option v-for="prodi in getProdiOptions" :key="prodi.value" :value="prodi.value">
                  {{ prodi.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- FIELD SPESIFIK DOSEN/PENGELOLA -->
          <div v-else-if="isSelectedUserDosenPengelola" class="space-y-4 pt-2 border-t border-gray-100">
            <h4 class="text-md font-semibold text-gray-800">Detail Dosen/Staf</h4>
            <div class="grid grid-cols-1 gap-4">
              <!-- NIP -->
              <div>
                <label for="modal_nip" class="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                <input id="modal_nip" type="text" v-model="selectedUser.NIP"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                  required />
              </div>
            </div>
          </div>
          <!-- Status Blocked -->
          <div class="flex items-center space-x-2 mt-6">
            <input id="modal_blocked" type="checkbox" v-model="selectedUser.isBlocked"
              class="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
            <label for="modal_blocked" class="text-sm font-medium text-gray-700">Blokir Pengguna
              (isBlocked)</label>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeEditModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm">
              Batal
            </button>
            <button type="submit"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tambah User Modal -->
    <AddUserModal :is-open="isAddModalOpen" :role-options="roleOptions" :prodi-options="getProdiOptions"
      @close="closeAddModal" @submit="handleAddSubmit" @validation-error="showNotification($event, 'error')" />
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
