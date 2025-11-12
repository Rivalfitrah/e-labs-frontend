<script setup>
import { ref, computed, onMounted } from 'vue';
import ConfirmModal from '/components/landing/ConfirmationModal.vue';
import BorrowForm from '/components/landing/BorrowForm.vue';
import { getAllRuangan, pengajuanRuanganTerjadwal } from '/lib/api/ruangan/ruanganAPI';
import Swal from 'sweetalert2';
import TheNavbar from '/components/landing/TheNavbar.vue';

// --- State Halaman ---
const selectedBuildingName = ref('');

// --- State Modal ---
const showModal = ref(false);
const showBorrowForm = ref(false);
const selectedRoom = ref(null);
const newBookingId = ref(null);

// --- Data ---
const buildings = ref([]);
const nimInput = ref('');

// --- Computed Properties ---
const currentBuildingData = computed(() => {
  if (!selectedBuildingName.value) {
    return null;
  }
  return buildings.value.find(b => b.name === selectedBuildingName.value);
});

// --- Fetching Data ---
const fetchAndMapRuangan = async () => {
  try {
    const ruanganData = await getAllRuangan();

    const grouped = ruanganData.reduce((acc, r) => {
      const gedung = r.gedung ?? 'Unknown';
      if (!acc[gedung]) acc[gedung] = [];

      let statusText = 'Tersedia';
      if (r.status === 'PENDING') statusText = 'Pending';
      if (r.status === 'DIAJUKAN') statusText = 'Diajukan';
      if (r.status === 'DIPAKAI') statusText = 'Dipakai';

      acc[gedung].push({
        id: r.id?.toString() ?? (r.kode_ruangan ?? Math.random().toString()),
        name: r.nama_ruangan
          ? `${r.nama_ruangan}${r.kode_ruangan ? ` (${r.kode_ruangan})` : ''}`
          : (r.kode_ruangan ?? 'Unnamed Room'),
        gedung,
        capacity: r.capacity ?? null,
        status: statusText,
      });

      return acc;
    }, {});

    buildings.value = Object.entries(grouped).map(([gedung, rooms]) => ({
      name: gedung,
      rooms,
    }));
  } catch (error) {
    console.error("Gagal fetch ruangan:", error);
    Swal.fire({
      icon: 'error',
      title: 'Gagal Mengambil Data',
      text: 'Terjadi kesalahan saat mengambil data ruangan.',
    });
  }
};

onMounted(async () => {
  await fetchAndMapRuangan();

  const pendingId = sessionStorage.getItem('pendingBookingId');
  const pendingNim = sessionStorage.getItem('pendingNim');
  const pendingRoomData = sessionStorage.getItem('pendingRoom');

  if (pendingId && pendingNim && pendingRoomData) {
    const room = JSON.parse(pendingRoomData);
    
    Swal.fire({
      title: 'Booking Belum Selesai',
      text: `Anda punya booking ruangan ${room.name} yang belum lengkap. Lanjutkan?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batalkan Booking'
    }).then((result) => {
      if (result.isConfirmed) {
        selectedRoom.value = room;
        newBookingId.value = pendingId;
        nimInput.value = pendingNim;
        showBorrowForm.value = true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        sessionStorage.removeItem('pendingBookingId');
        sessionStorage.removeItem('pendingNim');
        sessionStorage.removeItem('pendingRoom');
        
        fetchAndMapRuangan(); 
        Swal.fire('Dibatalkan', 'Booking Anda telah dibatalkan.', 'info');
      }
    });
  }
});


// --- Functions Halaman ---
const selectBuilding = (buildingName) => {
  selectedBuildingName.value = buildingName;
};

const backToSelection = () => {
  selectedBuildingName.value = '';
};

// --- Fungsi Modal ---
const openConfirmModal = (room) => {
  if (room.status === 'Tersedia' || room.status === 'Pending') {
    selectedRoom.value = room;
    showModal.value = true;
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Ruangan Tidak Tersedia',
      text: 'Ruangan ini sudah diajukan atau dipinjam.',
    });
  }
};

const closeConfirmModal = (resetRoom = true) => {
  showModal.value = false;
  if (resetRoom) {
    selectedRoom.value = null;
  }
};

const handleConfirm = async (nimPeminjam) => {
  try {
    nimInput.value = nimPeminjam;
    const res = await pengajuanRuanganTerjadwal({
      nim: nimPeminjam,
      ruangan_id: Number(selectedRoom.value.id),
    });

    newBookingId.value = res.data?.id || res.data?.data?.id;

    sessionStorage.setItem('pendingBookingId', newBookingId.value);
    sessionStorage.setItem('pendingNim', nimPeminjam);
    sessionStorage.setItem('pendingRoom', JSON.stringify(selectedRoom.value));

    closeConfirmModal(false);
    setTimeout(() => {
      showBorrowForm.value = true;
    }, 200);

  } catch (error) {
    console.error("Error saat membuat pengajuan ruangan:", error);
    const errorMessage = error.response?.data?.message || 'Gagal membuat pengajuan. Silakan coba lagi.';
    Swal.fire({
      icon: 'error',
      title: 'Gagal Membuat Pengajuan',
      text: errorMessage,
    });
  }
};

// --- Fungsi Form Peminjaman ---
const closeBorrowForm = () => {
  // 1. Tutup modal (seperti sebelumnya)
  showBorrowForm.value = false;
  selectedRoom.value = null; 
  newBookingId.value = null;
  backToSelection(); 
};

const handleSubmitBorrow = async () => {
  console.log("BorrowForm submitted successfully, refreshing data...");
  try {
    await fetchAndMapRuangan();

    Swal.fire({
      icon: 'success',
      title: 'Booking Berhasil!',
      text: 'Peminjaman Anda telah dikonfirmasi.',
      timer: 2000,
      showConfirmButton: false
    });

    sessionStorage.removeItem('pendingBookingId');
    sessionStorage.removeItem('pendingNim');
    sessionStorage.removeItem('pendingRoom');

    closeBorrowForm();
    backToSelection();

  } catch (error) {
    console.error('Gagal refresh data setelah submit:', error);
    Swal.fire({
      icon: 'error',
      title: 'Gagal Refresh Data',
      text: 'Booking Anda berhasil, tapi gagal me-refresh tampilan. Silakan refresh halaman.',
    });
  }
};

// --- Fungsi Validasi NIM ---
function handleNimInput(event) {
  let value = event.target.value.toUpperCase();
  if (value === '') {
    nimInput.value = '';
    return;
  }
  if (value[0] !== 'J') {
    nimInput.value = '';
  } else {
    let rest = value.substring(1).replace(/[^0-9]/g, '');
    nimInput.value = 'J' + rest;
  }
}

const handleCloseBorrowForm = async () => {
  closeBorrowForm(); // Tutup modal
  backToSelection(); // Kembali ke pemilihan gedung (ini yang bikin 'refresh' tampilan)
  
  // Opsional: Jika kamu BENAR-BENAR ingin mengambil data terbaru dari server saat ini juga:
  // await fetchAndMapRuangan(); 
};
</script>

<template>
  <div class="bg-[#F6FBF6] min-h-screen">
    <TheNavbar />
    <div class="container mx-auto p-8">
      
      <div v-if="!selectedBuildingName">
        <div class="text-center mb-10">
          <h1 class="text-3xl font-bold text-gray-800">Pilih Gedung</h1>
          <p class="text-gray-600 mt-2">
            Silakan pilih gedung untuk melihat ruangan yang tersedia.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div 
            v-for="building in buildings" 
            :key="building.name"
            @click="selectBuilding(building.name)"
            class="bg-white rounded-lg shadow-lg p-10 text-center transition duration-300 transform hover:-translate-y-2 hover:shadow-xl cursor-pointer"
          >
            <img 
              :src="building.name.toLowerCase().includes('ca') ? '/gedung-ca.png' : '/gedung-cb.png'" 
              :alt="`Gedung ${building.name}`" 
              class="w-full rounded-lg mb-4"
            >
            <h2 class="text-3xl font-bold text-gray-800">{{ building.name }}</h2>
            <p class="text-gray-600 mt-2">{{ building.rooms.length }} Ruangan Tersedia</p>
          </div>
        </div>
      </div>
      
      <div v-else>
        <button 
          @click="backToSelection" 
          class="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300">
          &larr; Kembali ke Pilihan Gedung
        </button>

        <h2 class="w-full text-3xl font-bold text-gray-700 mb-8 text-center">{{ selectedBuildingName }}</h2>
        
        <div v-if="currentBuildingData" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="room in currentBuildingData.rooms" 
            :key="room.id"
            @click="openConfirmModal(room)"             
            class="bg-white rounded-lg shadow-lg p-6 transition duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            :class="{
              'cursor-pointer': room.status === 'Tersedia' || room.status === 'Pending',
              'cursor-not-allowed opacity-60': room.status === 'Diajukan',
              'cursor-not-allowed opacity-60': room.status === 'Dipakai',
              'ring-2 ring-yellow-500': room.status === 'Pending'
            }"
          >
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ room.name }}</h3>
            <span 
              class="px-3 py-1 rounded-full text-sm font-semibold"
              :class="{
                'bg-green-100 text-green-800': room.status === 'Tersedia',
                'bg-yellow-100 text-yellow-800': room.status === 'Pending',
                'bg-red-100 text-red-800': room.status === 'Diajukan'
              }"
            >
              {{ room.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    v-if="showModal"
    :show="showModal"
    title="Konfirmasi Peminjaman"
    @close="closeConfirmModal"
    @confirm="handleConfirm"
  />  

  <BorrowForm
    v-if="showBorrowForm && selectedRoom"
    :show="showBorrowForm"
    :nim="nimInput"         
    :room="selectedRoom"
    :id-peminjaman="newBookingId"
    :booking-id="newBookingId"
    @submitted="handleSubmitBorrow" 
    @close="closeBorrowForm"
  />
</template>