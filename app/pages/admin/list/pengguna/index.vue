<script setup>
import UiInfoBox from '~/components/ui/infoBox.vue' // <--- PERBAIKAN: IMPOR UIINFOBOX
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, Image as ImageIcon, Upload, Ban } from 'lucide-vue-next'
// Impor API yang relevan
import { listUser, updateUser, deleteUser, createUser, dashboardUser, deactivatedUser, reactivateUser } from '~/lib/api/pengguna' 
import { onMounted, ref, computed } from 'vue' 
import Swal from 'sweetalert2'

definePageMeta({
  layout: 'dashboard'
})

// --- GENERAL STATE ---
const users = ref([])
const isLoading = ref(true)
const search = ref('')
const notification = ref({ show: false, message: '', type: 'success' });

const roleOptions = [
    { value: 1, label: 'Mahasiswa', name: 'mahasiswa' },
    { value: 2, label: 'Dosen', name: 'dosen' },
    { value: 3, label: 'Pengelola', name: 'pengelola' },
    { value: 4, label: 'Superadmin', name: 'superadmin' },
];

// --- MODAL STATE (EDIT/PROFILE) ---
const isEditModalOpen = ref(false)
const isProfileModalOpen = ref(false)
const isAddModalOpen = ref(false)

const dashboardStats = ref({
    mahasiswa: 0,
    dosen: 0,
    pengelola: 0,
    aktif: 0,
    blokir: 0
});

const selectedUser = ref({
  id: null, 
  uniqueId: '',
  nama: '',
  email: '',
  NIM: null,       // Ditambahkan
  NIP: null,       // Ditambahkan
  semester: null,  // Ditambahkan
  prodi: null,     // Ditambahkan
  role: { id: 1, nama_role: 'mahasiswa' },
  isBlocked: false,
  profil: null // URL profil
})

const profileFile = ref(null); // File foto profil baru
const newProfileFile = ref(null); // File foto profil di modal tambah


// --- ADD USER STATE ---
const newUserData = ref({
    nama: '',
    email: '',
    password: '',
    uniqueId: '', // NIM/NIP/Unique ID
    roleId: 1, // Default: Mahasiswa
    isBlocked: false,
    NIM: null,
    NIP: null,
    semester: null,
    prodiId: null, // Asumsi ini diperlukan untuk Mahasiswa
})

// --- UTILITY FUNCTIONS ---

function showNotification(message, type = 'success') {
    notification.value = { show: true, message, type };
    setTimeout(() => {
        notification.value.show = false;
    }, 3000);
}

function getRoleLabel(roleName) {
    if (!roleName) return 'N/A';
    return roleOptions.find(r => r.name === roleName) ?.label || roleName;
}

function getStatusClass(isBlocked) {
    return isBlocked
        ? 'bg-red-100 text-red-800'
        : 'bg-green-100 text-green-800';
}

function getProfileUrl(path) {
    if (path === 'null' || !path) {
        return 'https://placehold.co/40x40/f1f1f1/333333?text=N/A';
    }
    // Asumsi path adalah URL penuh atau path relatif root.
    return `${path}`; 
}

// --- PAGINATION & FILTERING ---
const itemsPerPage = ref(10)
const currentPage = ref(1)

const filteredUsers = computed(() => {
  const query = search.value.toLowerCase().trim();
  const dataArray = Array.isArray(users.value) ? users.value : []; 

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
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
function prevPage() { if (currentPage.value > 1) currentPage.value--; }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++; }


// --- DATA FETCHING ---
onMounted(async () => {
  try {
    const [userResponse, statsResponse] = await Promise.all([
        listUser(),
        dashboardUser(),
    ]);

    // 1. User List
    const actualData = Array.isArray(userResponse) ? userResponse : (userResponse?.data || []);
    users.value = actualData;

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
    
  } catch (error) {
    console.error('Failed to fetch user list or dashboard stats:', error)
    showNotification('Gagal memuat data pengguna atau statistik.', 'error');
    users.value = [];
  } finally {
    isLoading.value = false
  }
})


// --- MODAL CONTROL ---
function openEditModal(item) {
  selectedUser.value = { 
    ...item,
    // Pastikan role.id terpisah untuk form select
    roleId: item.role ? item.role.id : 1
};
  isEditModalOpen.value = true
}

function closeEditModal() {
  isEditModalOpen.value = false
}

function openAddModal() {
    newUserData.value = {
        nama: '',
        email: '',
        password: '',
        uniqueId: '',
        roleId: 1, 
        isBlocked: false,
        NIM: null,
        NIP: null,
        semester: null,
        prodiId: null,
    };
    newProfileFile.value = null;
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

// --- FILE HANDLERS ---
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

function handleProfileFileChange(event) {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
        profileFile.value = file;
    }
}

function handleNewProfileFileChange(event) {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
        newProfileFile.value = file;
    }
}

const profilePreviewUrl = computed(() => {
    if (profileFile.value) {
        return URL.createObjectURL(profileFile.value);
    }
    return getProfileUrl(selectedUser.value.profil);
});

const newProfilePreviewUrl = computed(() => {
    if (newProfileFile.value) {
        return URL.createObjectURL(newProfileFile.value);
    }
    return 'https://placehold.co/150x150/f1f1f1/333333?text=N/A';
});


// --- FIELD VISIBILITY COMPUTED PROPERTIES ---

// Edit Modal
const isSelectedUserMahasiswa = computed(() => selectedUser.value.role === 1);
const isSelectedUserDosenPengelola = computed(() => selectedUser.value.role >= 2 && selectedUser.value.role <= 4);

// Add Modal
const isNewUserMahasiswa = computed(() => newUserData.value.roleId === 1);
const isNewUserDosenPengelola = computed(() => newUserData.value.roleId >= 2 && newUserData.value.roleId <= 4);


// --- CRUD HANDLERS ---

async function handleSave() {
    const dataToUpdate = {
        nama: selectedUser.value.nama,
        email: selectedUser.value.email,
        roleId: selectedUser.value.role,
        isBlocked: selectedUser.value.isBlocked,
    };
    
    // Tambahkan field spesifik berdasarkan role
    if (isSelectedUserMahasiswa.value) {
        // Asumsi NIM/Semester/Prodi bisa diupdate.
        dataToUpdate.NIM = selectedUser.value.NIM;
        dataToUpdate.semester = selectedUser.value.semester;
        dataToUpdate.prodi = selectedUser.value.prodi; // Jika prodiId tidak tersedia di selectedUser
    } else if (isSelectedUserDosenPengelola.value) {
        dataToUpdate.NIP = selectedUser.value.NIP;
    }

    try {
        // PERBAIKAN: Menggunakan uniqueId sebagai ID untuk update
        await updateUser(selectedUser.value.uniqueId, dataToUpdate);

        const index = users.value.findIndex(u => u.uniqueId === selectedUser.value.uniqueId);
        if (index !== -1) {
            Object.assign(users.value[index], {
                ...selectedUser.value,
                // Pastikan role name diupdate juga
                role: roleOptions.find(r => r.id === selectedUser.value.role)
            });
        }

        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Perubahan data pengguna berhasil disimpan!',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Gagal menyimpan perubahan:', error);
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
    formData.append('foto_profile', profileFile.value); // <--- WAJIB
    // Tambahkan field lain jika perlu
    
    // Tambahkan field non-file (seperti roleId) agar backend tidak menganggap req.body kosong
    // Ini membantu melewati pengecekan 'isBodyEmpty' di backend saat file diupload.
    formData.append('roleId', selectedUser.value.role); 

    try {
        // PERBAIKAN: Menggunakan uniqueId sebagai ID untuk update
        const response = await updateUser(selectedUser.value.uniqueId, formData);

        // Asumsikan respons berisi path profil baru (misal: response.data.profil)
        const newProfilePath = response?.data?.profil || profileFile.value.name;

        const index = users.value.findIndex(u => u.uniqueId === selectedUser.value.uniqueId);
        if (index !== -1) {
            users.value[index].profil = newProfilePath; 
        }

        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Foto profil berhasil diunggah!',
            timer: 2000,
            showConfirmButton: false
        });
        
    } catch (error) {
        console.error('Gagal mengunggah profil:', error);
        showNotification('Gagal mengunggah profil. Cek koneksi atau izin API.', 'error');
    } finally {
        closeProfileModal();
    }
}


async function handleAddSubmit() {
    if (!newUserData.value.nama || !newUserData.value.email || !newUserData.value.password || !newUserData.value.uniqueId) {
        showNotification('Nama, Email, Password, dan ID Unik wajib diisi.', 'error');
        return;
    }
    
    const formData = new FormData();
    
    // Append text fields
    for (const key in newUserData.value) {
        if (key !== 'roleId') { 
            formData.append(key, newUserData.value[key] || '');
        }
    }
    formData.append('roleId', newUserData.value.roleId);

    // Append image file if present
    if (newProfileFile.value) {
        formData.append('foto_profile', newProfileFile.value);
    }
    
    try {
        const response = await createUser(formData); 
        const newUserDataFromApi = response.data;

        if (newUserDataFromApi) {
             users.value.push(newUserDataFromApi);
             currentPage.value = totalPages.value; 
        } else {
             const freshData = await listUser();
             users.value = freshData.data;
        }

        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `Pengguna "${newUserData.value.nama}" berhasil ditambahkan!`,
            timer: 2000,
            showConfirmButton: false
        });

    } catch (error) {
        console.error('Gagal menambah pengguna:', error);
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
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        await handleDelete(item.id, item.nama);
    }
}

async function handleDelete(id, nama) {
    try {
        await deleteUser(id);

        users.value = users.value.filter(u => u.id !== id);
        if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
            currentPage.value--;
        }
        
        Swal.fire({
            title: 'Terhapus!',
            text: `Pengguna "${nama}" telah berhasil dihapus.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });

    } catch (error) {
        console.error('Gagal menghapus pengguna:', error);
        Swal.fire({
            title: 'Gagal!',
            text: `Gagal menghapus pengguna "${nama}". Silakan coba lagi.`,
            icon: 'error'
        });
    }
}

// --- DEACTIVATE HANDLER ---
async function handleDeactivate(item) {
    const action = item.isBlocked ? 'mengaktifkan' : 'memblokir';
    const confirmTitle = item.isBlocked ? 'Aktifkan Pengguna?' : 'Blokir Pengguna?';
    const confirmText = item.isBlocked ? 
        `Anda akan mengaktifkan kembali pengguna "${item.nama}".` :
        `Anda yakin ingin memblokir pengguna "${item.nama}" dengan NIM : (${item.NIM})? Ini akan membatasi aksesnya.`;
        
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
            // Panggil API deactivatedUser untuk memblokir. Jika item.isBlocked=false (aktif), panggil deactivatedUser.
            // Panggil API reactivateUser untuk mengaktifkan. Jika item.isBlocked=true (terblokir), panggil reactivateUser.
            if (item.isBlocked) {
                await reactivateUser(item.id);
            } else {
                await deactivatedUser(item.id);
            }
            
            // Update local state: toggle isBlocked status
            const index = users.value.findIndex(u => u.id === item.id);
            if (index !== -1) {
                users.value[index].isBlocked = !item.isBlocked;
            }
            
            // Update dashboard stats (opsional, tapi lebih baik)
            const statsResponse = await dashboardUser();
            const statsData = statsResponse?.data;
            if (statsData) {
                dashboardStats.value = {
                    mahasiswa: statsData.totalMahasiswa || 0,
                    dosen: statsData.totalDosen || 0,
                    pengelola: statsData.totalPengelola || 0,
                    aktif: statsData.totalActive || 0,
                    blokir: statsData.totalBlocked || 0
                };
            }

            Swal.fire({
                title: 'Berhasil!',
                text: `Pengguna "${item.nama}" berhasil di${action}an.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error(`Gagal ${action} pengguna:`, error);
            Swal.fire({
                title: 'Gagal!',
                text: `Gagal ${action} pengguna. Silakan coba lagi.`,
                icon: 'error'
            });
        }
    }
}
</script>


<template>
    
    <div class="mb-6">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <UiInfoBox type="mahasiswa" @click="search = ''; currentPage = 1" class="cursor-pointer hover:scale-105 transition-transform duration-200">
          <template #title>
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-width="2" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z"/></svg>
              Total Mahasiswa
            </span>
          </template>
          <span class="text-2xl font-bold text-primary">{{ dashboardStats.mahasiswa }}</span>
          <div class="text-xs text-gray-500 mt-1">Klik untuk reset filter</div>
        </UiInfoBox>
        <UiInfoBox type="dosen" @click="search = 'dosen'; currentPage = 1" class="cursor-pointer hover:scale-105 transition-transform duration-200">
          <template #title>
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"/><path stroke-width="2" d="M12 14v7m0 0H7m5 0h5"/></svg>
              Total Dosen
            </span>
          </template>
          <span class="text-2xl font-bold text-blue-600">{{ dashboardStats.dosen }}</span>
          <div class="text-xs text-gray-500 mt-1">Klik untuk filter dosen</div>
        </UiInfoBox>
        <UiInfoBox type="pengelola" @click="search = 'pengelola'; currentPage = 1" class="cursor-pointer hover:scale-105 transition-transform duration-200">
          <template #title>
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z"/><path stroke-width="2" d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>
              Total Pengelola
            </span>
          </template>
          <span class="text-2xl font-bold text-yellow-600">{{ dashboardStats.pengelola }}</span>
          <div class="text-xs text-gray-500 mt-1">Klik untuk filter pengelola</div>
        </UiInfoBox>
        <UiInfoBox type="active" @click="search = ''; currentPage = 1" class="cursor-pointer hover:scale-105 transition-transform duration-200">
          <template #title>
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              Pengguna Aktif
            </span>
          </template>
          <span class="text-2xl font-bold text-green-600">{{ dashboardStats.aktif }}</span>
          <div class="text-xs text-gray-500 mt-1">Klik untuk lihat semua aktif</div>
        </UiInfoBox>
        <UiInfoBox type="blocked" @click="search = 'blocked'; currentPage = 1" class="cursor-pointer hover:scale-105 transition-transform duration-200">
          <template #title>
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"/></svg>
              Pengguna Terblokir
            </span>
          </template>
          <span class="text-2xl font-bold text-red-600">{{ dashboardStats.blokir }}</span>
          <div class="text-xs text-gray-500 mt-1">Klik untuk filter terblokir</div>
        </UiInfoBox>
      </div>
    </div>

  <!-- Toast Notification -->
  <transition 
    enter-active-class="transition ease-out duration-300 transform"
    enter-from-class="opacity-0 translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-300 transform"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-full"
  >
    <div v-if="notification.show" 
      :class="{
        'bg-green-500': notification.type === 'success',
        'bg-red-500': notification.type === 'error'
      }"
      class="fixed bottom-4 right-4 text-white p-4 rounded-lg shadow-xl z-50 transition-all duration-300"
    >
      {{ notification.message }}
    </div>
  </transition>
  
  <div class="flex flex-col md:flex-row md:items-center gap-2 mb-4">
    <div class="flex relative w-full">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        v-model="search"
        class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
        placeholder="Cari Nama, ID, atau Email Pengguna..."
      />
    </div>
    <button
      @click="openAddModal"
      class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full md:w-auto font-medium shadow-md">
      Tambah
    </button>
  </div>

  
  <div v-if="isLoading" class="text-center py-8 text-lg text-gray-500">
    Memuat data pengguna...
  </div>

  
  <div v-else-if="users.length === 0" class="text-center py-8 text-lg text-gray-500 border border-dashed rounded-lg p-10 bg-white">
    Tidak ada data pengguna yang ditemukan.
  </div>

  
  <div v-else class="shadow-xl rounded-xl overflow-hidden bg-white">
    <table class="w-full border-separate border-spacing-0">
      <thead>
        <tr class="bg-primary text-white text-center text-sm uppercase tracking-wider">
          <th class="text-center  px-5 py-3 w-12">No</th>
          <th class="text-center  px-5 py-3 w-16">Foto</th>
          <th class="text-left  px-5 py-3 w-40">Nama & Email</th>
          <th class="text-center  px-5 py-3 w-32">ID/NIM/NIP</th>
          <th class="text-center  px-5 py-3 w-20">Role</th>
          <th class="text-center  px-5 py-3 w-24">Status</th>
          <th class="text-center px-5 py-3 w-32">Aksi</th>
        </tr>
      </thead>
      <tbody class="text-gray-700 text-sm text-center">
        
        <tr v-for="(data, index) in paginatedUsers" :key="data.id" class="hover:bg-gray-50 transition border-t border-gray-100">
          <td class="px-5 py-3 font-mono align-middle">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          
          <td class="px-5 py-3 align-middle">
            <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-300 flex-shrink-0 mx-auto">
              <img :src="getProfileUrl(data.profil)"
                   alt="Foto Profil"
                   class="w-full h-full object-cover"
                   onerror="this.onerror=null;this.src='https://placehold.co/40x40/f1f1f1/333333?text=N/A';" />
            </div>
          </td>

          <td class="px-5 py-3 text-left align-middle font-semibold">
            <p>{{ data.nama }}</p>
            <p class="text-xs text-gray-500 font-normal">{{ data.email }}</p>
          </td>

          <td class="px-5 py-3 font-mono text-gray-500 align-middle">
            {{ data.NIM || data.NIP || data.uniqueId }}
          </td>

          <td class="px-5 py-3 align-middle">
            <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                {{ data.role ? getRoleLabel(data.role.nama_role) : 'N/A' }}
            </span>
          </td>

          <td class="px-5 py-3 align-middle">
            <span :class="getStatusClass(data.isBlocked)"
                  class="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                {{ data.isBlocked ? 'BLOCKED' : 'AKTIF' }}
            </span>
          </td>

          <td class="px-5 py-3 text-center align-middle">
            <div class="flex justify-center items-center gap-2">
              
              <button
                @click="openProfileModal(data)"
                class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center"
              >
                <ImageIcon class="inline w-4 h-4" />
              </button>
              
              <button
                @click="data.isBlocked ? handleReactivate(data) : handleDeactivate(data)"
                :class="data.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-800 hover:bg-red-900'"
                class="text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center"
              >
                <Ban class="inline w-4 h-4" />
              </button>
              
              <button
                @click="openEditModal(data)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center"
              >
                <Pencil class="inline w-4 h-4" />
              </button>
              
              <button
                @click="confirmDelete(data)"
                class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center"
              >
                <Trash2 class="inline w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
        
        <tr v-if="paginatedUsers.length === 0 && filteredUsers.length > 0">
          <td colspan="7" class="text-center py-4 text-gray-500">Tidak ada pengguna di halaman ini.</td>
        </tr>
        <tr v-else-if="filteredUsers.length === 0">
          <td colspan="7" class="text-center py-4 text-gray-500">Tidak ada hasil yang cocok dengan pencarian Anda.</td>
        </tr>
      </tbody>
    </table>
    
    
    <div v-if="totalPages > 1" class="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
      
      
      <span class="text-sm text-gray-700">
        Menampilkan 
        <span class="font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
        sampai
        <span class="font-semibold">{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</span>
        dari
        <span class="font-semibold">{{ filteredUsers.length }}</span>
        pengguna
      </span>

      
      <nav class="flex items-center space-x-1" aria-label="Pagination">
        
        
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          :class="{'opacity-50 cursor-not-allowed': currentPage === 1}"
          class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>

        
        <div class="hidden sm:flex space-x-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="{
              'bg-primary text-white': page === currentPage,
              'bg-white text-gray-700 hover:bg-gray-100': page !== currentPage
            }"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition"
          >
            {{ page }}
          </button>
        </div>

        
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          :class="{'opacity-50 cursor-not-allowed': currentPage === totalPages}"
          class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
      </nav>
    </div>
    
  </div>


  <!-- Edit User Modal -->
  <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300" @click.self="closeEditModal">
    
    <div class="absolute inset-0 bg-black opacity-50"></div>

    
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 scale-100 opacity-100"
         @click.stop>
      
      <h2 class="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
        Ubah Data Pengguna: <span class="text-primary">{{ selectedUser?.nama }}</span>
      </h2>

      
      <button @click="closeEditModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      
      <form v-if="selectedUser" @submit.prevent="handleSave" class="space-y-4">

        <!-- Nama -->
        <div>
          <label for="modal_nama" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            id="modal_nama"
            type="text"
            v-model="selectedUser.nama"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            required
          />
        </div>

        <!-- Email -->
        <div>
          <label for="modal_email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="modal_email"
            type="email"
            v-model="selectedUser.email"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            required
          />
        </div>
        
        <!-- Role -->
        <div>
          <label for="modal_role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            id="modal_role"
            v-model.number="selectedUser.role"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
            required
          >
            <option 
                v-for="role in roleOptions" 
                :key="role.value" 
                :value="role.value"
            >
                {{ role.label }}
            </option>
          </select>
        </div>
        
        <!-- FIELD SPESIFIK MAHASISWA -->
        <div v-if="isSelectedUserMahasiswa" class="space-y-4 pt-2 border-t border-gray-100">
            <h4 class="text-md font-semibold text-gray-800">Detail Mahasiswa</h4>
            
            <!-- NIM -->
            <div>
              <label for="modal_nim" class="block text-sm font-medium text-gray-700 mb-1">NIM</label>
              <input
                id="modal_nim"
                type="text"
                v-model="selectedUser.NIM"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                required
              />
            </div>
            
            <!-- Semester -->
            <div>
              <label for="modal_semester" class="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <input
                id="modal_semester"
                type="number"
                v-model.number="selectedUser.semester"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                min="1"
              />
            </div>
            
            <!-- Prodi -->
            <div>
              <label for="modal_prodi" class="block text-sm font-medium text-gray-700 mb-1">Program Studi (Prodi)</label>
              <input
                id="modal_prodi"
                type="text"
                v-model="selectedUser.prodi"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
              />
            </div>
        </div>

        <!-- FIELD SPESIFIK DOSEN/PENGELOLA -->
        <div v-else-if="isSelectedUserDosenPengelola" class="space-y-4 pt-2 border-t border-gray-100">
            <h4 class="text-md font-semibold text-gray-800">Detail Dosen/Staf</h4>
            
            <!-- NIP -->
            <div>
              <label for="modal_nip" class="block text-sm font-medium text-gray-700 mb-1">NIP</label>
              <input
                id="modal_nip"
                type="text"
                v-model="selectedUser.NIP"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                required
              />
            </div>
        </div>


        <!-- Status Blocked -->
        <div class="flex items-center space-x-2">
            <input
                id="modal_blocked"
                type="checkbox"
                v-model="selectedUser.isBlocked"
                class="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label for="modal_blocked" class="text-sm font-medium text-gray-700">Blokir Pengguna (isBlocked)</label>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="closeEditModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Profile Image Upload Modal -->
  <div v-if="isProfileModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300" @click.self="closeProfileModal">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Modal Content Container -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 scale-100 opacity-100"
         @click.stop>
      
      <h2 class="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
        Unggah Foto Profil: <span class="text-primary">{{ selectedUser?.nama }}</span>
      </h2>

      <!-- Close Button -->
      <button @click="closeProfileModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <form @submit.prevent="handleProfileUpload" class="space-y-4">
        <!-- Preview -->
        <div class="mt-4 flex flex-col items-center">
            <div class="w-24 h-24 rounded-full overflow-hidden border border-gray-300 mb-3">
                <img :src="profilePreviewUrl" 
                     alt="Pratinjau Profil" 
                     class="w-full h-full object-cover" />
            </div>
            <p class="text-sm font-medium text-gray-700 mb-2">Pilih Foto Baru:</p>
        </div>

        <!-- Drag and Drop Area -->
        <label for="profile_file_input"
          @dragover.prevent="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          class="flex flex-col items-center justify-center w-full p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
        >
          <Upload class="w-12 h-12 text-gray-400 mb-3" />
          <p class="mb-2 text-sm text-gray-500 text-center">
            <span class="font-semibold">Klik untuk memilih</span> atau seret dan lepas gambar di sini
          </p>
          <p class="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
          <input 
            id="profile_file_input" 
            type="file" 
            class="hidden" 
            @change="handleProfileFileChange" 
            accept="image/*" 
          />
        </label>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="closeProfileModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="!profileFile"
            :class="{'opacity-50 cursor-not-allowed': !profileFile}"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
          >
            Unggah Profil
          </button>
        </div>
      </form>
    </div>
  </div>

    <!-- Tambah User Modal -->
  <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300" @click.self="closeAddModal">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <!-- Modal Content Container -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 scale-100 opacity-100"
         @click.stop>
      
      <h2 class="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
        Tambah Pengguna Baru
      </h2>

      <!-- Close Button -->
      <button @click="closeAddModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Form Tambah User -->
      <form @submit.prevent="handleAddSubmit" class="space-y-4">

        <!-- Role -->
        <div>
          <label for="add_role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            id="add_role"
            v-model.number="newUserData.roleId"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
            required
          >
            <option 
                v-for="role in roleOptions" 
                :key="role.value" 
                :value="role.value"
            >
                {{ role.label }}
            </option>
          </select>
        </div>

        <!-- Nama -->
        <div>
          <label for="add_nama" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            id="add_nama"
            type="text"
            v-model="newUserData.nama"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            required
          />
        </div>

        <!-- ID Unik (NIM/NIP) -->
        <div>
          <label for="add_unique_id" class="block text-sm font-medium text-gray-700 mb-1">ID Unik (NIM/NIP)</label>
          <input
            id="add_unique_id"
            type="text"
            v-model="newUserData.uniqueId"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            required
          />
        </div>
        
        <!-- Email -->
        <div>
          <label for="add_email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="add_email"
            type="email"
            v-model="newUserData.email"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label for="add_password" class="block text-sm font-medium text-gray-700 mb-1">Password (Awal)</label>
          <input
            id="add_password"
            type="password"
            v-model="newUserData.password"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
            required
          />
        </div>
        
        <!-- FIELD SPESIFIK MAHASISWA -->
        <div v-if="isNewUserMahasiswa" class="space-y-4 pt-2 border-t border-gray-100">
            <h4 class="text-md font-semibold text-gray-800">Detail Mahasiswa</h4>
            
            <!-- NIM -->
            <div>
              <label for="add_nim" class="block text-sm font-medium text-gray-700 mb-1">NIM</label>
              <input
                id="add_nim"
                type="text"
                v-model="newUserData.NIM"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                required
              />
            </div>
            
            <!-- Semester -->
            <div>
              <label for="add_semester" class="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <input
                id="add_semester"
                type="number"
                v-model.number="newUserData.semester"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                min="1"
              />
            </div>
            
            <!-- Prodi ID -->
            <div>
              <label for="add_prodi_id" class="block text-sm font-medium text-gray-700 mb-1">Prodi ID</label>
              <input
                id="add_prodi_id"
                type="number"
                v-model.number="newUserData.prodiId"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                min="1"
              />
            </div>
        </div>

        <!-- FIELD SPESIFIK DOSEN/PENGELOLA -->
        <div v-else-if="isNewUserDosenPengelola" class="space-y-4 pt-2 border-t border-gray-100">
            <h4 class="text-md font-semibold text-gray-800">Detail Dosen/Staf</h4>
            
            <!-- NIP (Jika role bukan mahasiswa) -->
            <div>
              <label for="add_nip" class="block text-sm font-medium text-gray-700 mb-1">NIP</label>
              <input
                id="add_nip"
                type="text"
                v-model="newUserData.NIP"
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                required
              />
            </div>
        </div>


        <!-- Foto Profil Upload -->
        <p class="text-sm font-medium text-gray-700 mb-1 pt-2">Foto Profil (Opsional)</p>
        <label for="new_profile_file_input"
          class="flex flex-col items-center justify-center w-full p-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
        >
          <Upload class="w-8 h-8 text-gray-400 mb-1" />
          <p class="text-sm text-gray-500 text-center">Seret/Pilih Gambar</p>
        </label>
        <input 
          id="new_profile_file_input" 
          type="file" 
          class="hidden" 
          @change="handleNewProfileFileChange" 
          accept="image/*" 
          ref="newFileInput"
        />

        <!-- Image Preview Tambah -->
        <div v-if="newProfileFile" class="mt-2 flex flex-col items-center">
          <p class="text-sm font-medium text-gray-700 mb-2">Pratinjau Gambar:</p>
          <img 
            :src="newProfilePreviewUrl" 
            alt="Pratinjau Profil Baru" 
            class="w-24 h-24 object-cover rounded-full border border-gray-200 shadow-sm"
          />
          <p class="mt-1 text-sm text-gray-600">{{ newProfileFile.name }}</p>
        </div>


        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="closeAddModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md"
          >
            Tambah Pengguna
          </button>
        </div>
      </form>
    </div>
  </div>

</template>
