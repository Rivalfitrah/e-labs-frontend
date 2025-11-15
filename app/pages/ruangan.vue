<script setup>
import { ref, computed, onMounted } from 'vue';
import ConfirmModal from '/components/landing/ConfirmationModal.vue';
import BorrowForm from '/components/landing/BorrowForm.vue';
import { getAllRuangan, pengajuanRuanganTerjadwal } from '/lib/api/ruangan/ruanganAPI';
import Swal from 'sweetalert2';
import TheNavbar from '/components/landing/TheNavbar.vue';
import { ArrowLeft, ArrowRight, House } from 'lucide-vue-next';

// --- State Halaman ---
const selectedBuildingName = ref('');
const currentStep = ref(1); // Progress step indicator

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
  currentStep.value = 2; // Move to step 2 when building is selected
};

const backToSelection = () => {
  selectedBuildingName.value = '';
  currentStep.value = 1; // Back to step 1
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

    currentStep.value = 3; // Move to step 3 when form is opened

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
  currentStep.value = 1; // Reset to step 1
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
      
      <!-- Progress Indicator -->
       <div class="bg-white max-w-7xl mx-auto p-6 rounded-lg shadow-md">
         <div class="max-w-md mx-auto mb-12">
           <div class="flex items-center justify-center space-x-4">
             <!-- Step 1 -->
             <div class="flex flex-col items-center">
               <div 
                 class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                 :class="currentStep >= 1 ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-300 text-gray-600'"
               >
                 1
               </div>
               <span class="text-xs mt-2 font-medium" :class="currentStep >= 1 ? 'text-green-600' : 'text-gray-500'">
                 Pilih Gedung
               </span>
             </div>
             
             <!-- Connector 1-2 -->
             <div 
               class="w-16 h-1 rounded transition-all duration-300"
               :class="currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300'"
             ></div>
             
             <!-- Step 2 -->
             <div class="flex flex-col items-center">
               <div 
                 class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                 :class="currentStep >= 2 ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-300 text-gray-600'"
               >
                 2
               </div>
               <span class="text-xs mt-2 font-medium" :class="currentStep >= 2 ? 'text-green-600' : 'text-gray-500'">
                 Pilih Ruangan
               </span>
             </div>
             
             <!-- Connector 2-3 -->
             <div 
               class="w-16 h-1 rounded transition-all duration-300"
               :class="currentStep >= 3 ? 'bg-green-500' : 'bg-gray-300'"
             ></div>
             
             <!-- Step 3 -->
             <div class="flex flex-col items-center">
               <div 
                 class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                 :class="currentStep >= 3 ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-300 text-gray-600'"
               >
                 3
               </div>
               <span class="text-xs mt-2 font-medium" :class="currentStep >= 3 ? 'text-green-600' : 'text-gray-500'">
                 Isi Form
               </span>
             </div>
           </div>
         </div>
       </div>

<div class="bg-white pt-15 mt-10 max-w-7xl mx-auto p-8 rounded-lg shadow-md">
  <!-- pilih gedung -->
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
        class="bg-white rounded-lg shadow-lg p-10 text-center transition duration-300 transform border-transparent hover:border-2 hover:border-green-600 hover:shadow-xl cursor-pointer"
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
  <!-- Header Section with Back Button -->
  <div class="flex items-center justify-between mb-8">
    <button 
      @click="backToSelection" 
      class="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-green-500 hover:text-green-600 transition duration-300 font-medium">
      <ArrowLeft />
      Kembali
    </button>
    
    <!-- Building Info Badge -->
    <div class="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd" />
      </svg>
      <span class="font-semibold text-green-700">{{ selectedBuildingName }}</span>
    </div>
  </div>

  <!-- Title Section -->
  <div class="text-center mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-2">Pilih Ruangan</h2>
    <p class="text-gray-600">Klik pada ruangan untuk melakukan peminjaman</p>
  </div>
  
  <!-- Room Cards Grid -->
  <div v-if="currentBuildingData" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div 
      v-for="room in currentBuildingData.rooms" 
      :key="room.id"
      @click="openConfirmModal(room)"             
      class="relative bg-white rounded-xl border-2 p-6 transition-all duration-300"
      :class="{
        'border-gray-200 hover:border-green-500 hover:shadow-lg cursor-pointer': room.status === 'Tersedia',
        'border-yellow-300 hover:border-yellow-400 hover:shadow-lg cursor-pointer': room.status === 'Pending',
        'border-gray-200 cursor-not-allowed opacity-60': room.status === 'Diajukan' || room.status === 'Dipakai'
      }"
    >
      <!-- Status Badge - Top Right -->
      <div class="absolute top-4 right-4">
        <span 
          class="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
          :class="{
            'bg-green-100 text-green-700 border border-green-300': room.status === 'Tersedia',
            'bg-yellow-100 text-yellow-700 border border-yellow-300': room.status === 'Pending',
            'bg-red-100 text-red-700 border border-red-300': room.status === 'Diajukan',
            'bg-gray-100 text-gray-700 border border-gray-300': room.status === 'Dipakai'
          }"
        >
          {{ room.status }}
        </span>
      </div>

      <!-- Room Icon -->
      <div class="mb-4">
        <div class="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center">
          <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg> -->
          <House class="h-7 w-7 text-green-600" />
        </div>
      </div>

      <!-- Room Name -->
      <h3 class="text-xl font-bold text-gray-800 mb-4 pr-20">
        {{ room.name }}
      </h3>

      <!-- Room Details -->
      <div class="space-y-2 mb-4">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd" />
          </svg>
          <span>{{ room.gedung }}</span>
        </div>
        
        <div v-if="room.capacity" class="flex items-center gap-2 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <span>Kapasitas: {{ room.capacity }} orang</span>
        </div>
      </div>

      <!-- Action Indicator -->
      <div 
        v-if="room.status === 'Tersedia' || room.status === 'Pending'"
        class="flex items-center justify-between pt-4 border-t border-gray-100"
      >
        <span class="text-sm font-medium text-gray-500">Klik untuk pinjam</span>
        <ArrowLeft class="h-5 w-5 text-gray-400 transform rotate-180" />
      </div>

      <!-- Unavailable Indicator -->
      <div 
        v-else
        class="flex items-center justify-center pt-4 border-t border-gray-100"
      >
        <span class="text-sm font-medium text-gray-400">Tidak tersedia</span>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else class="text-center py-16">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
    <p class="text-gray-500 text-lg">Tidak ada ruangan tersedia</p>
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
  </div>
</template>