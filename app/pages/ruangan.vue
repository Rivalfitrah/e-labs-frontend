<script setup>
import { ref, computed, onMounted } from 'vue';
import ConfirmModal from '@/components/landing/ConfirmationModal.vue'; 
import BorrowForm from '@/components/landing/BorrowForm.vue';
import { getAllRuangan, pengajuanRuanganTerjadwal } from '~/lib/api/ruangan/ruanganApi';
import Swal from 'sweetalert2'; // Tambahkan import

// --- State Halaman ---
const selectedBuildingName = ref('');
// isLoading dihapus

// --- State Modal ---
const showModal = ref(false);
const showBorrowForm = ref(false); 
const selectedRoom = ref(null); 
const newBookingId = ref(null);

// --- Data ---
const buildings = ref([]);
const nimInput = ref('');

// --- Computed Properties (Termasuk Validasi NIM) ---
const currentBuildingData = computed(() => {
  if (!selectedBuildingName.value) {
    return null;
  }
  return buildings.value.find(b => b.name === selectedBuildingName.value);
});

// --- Fetching Data ---
const fetchAndMapRuangan = async () => {
  try {
    const ruanganDataRaw = await getAllRuangan();
    const ruanganData = Array.isArray(ruanganDataRaw) ? ruanganDataRaw : [];

    const grouped = ruanganData.reduce((acc, r) => {
      const gedung = r.gedung ?? 'Unknown';
      if (!acc[gedung]) acc[gedung] = [];
      acc[gedung].push({
        id: r.id?.toString() ?? (r.kode_ruangan ?? Math.random().toString()),
        name: r.nama_ruangan
          ? `${r.nama_ruangan}${r.kode_ruangan ? ` (${r.kode_ruangan})` : ''}`
          : (r.kode_ruangan ?? 'Unnamed Room'),
        gedung, // tambahkan ini
        capacity: r.capacity ?? null,
        status: (r.status ?? 'KOSONG').toLowerCase() === 'kosong' ? 'Tersedia' : r.status,
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

onMounted(fetchAndMapRuangan);

// --- Functions Halaman ---
const selectBuilding = (buildingName) => {
  selectedBuildingName.value = buildingName;
};

const backToSelection = () => {
  selectedBuildingName.value = '';
};

// --- Fungsi Modal (SUDAH DIGABUNGKAN) ---
const openConfirmModal = (room) => {
  if (room.status === 'Tersedia') {
    selectedRoom.value = room;
    showModal.value = true;
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Ruangan Tidak Tersedia',
      text: 'Ruangan ini sedang tidak tersedia atau dipinjam.',
    });
  }
};

const closeConfirmModal = (resetRoom = true) => {
  showModal.value = false;
  if (resetRoom) {
    selectedRoom.value = null;
  }
};

// --- Fungsi Modal ---
const handleConfirm = async (nimPeminjam) => {
  try {
    nimInput.value = nimPeminjam;
    const res = await pengajuanRuanganTerjadwal({
      nim: nimPeminjam,
      ruangan_id: Number(selectedRoom.value.id),
    });
    console.log('Res pengajuan:', res);

    newBookingId.value = res.data?.id || res.data?.data?.id;

    sessionStorage.setItem('eLabsBorrowData', JSON.stringify({
      id: newBookingId.value,
      nim: nimPeminjam,
      gedung: selectedRoom.value.gedung,
      lab: selectedRoom.value.name
    }));

    closeConfirmModal(false);
    setTimeout(() => {
      showBorrowForm.value = true;
    }, 200);

  } catch (error) {
    console.error("Error saat membuat pengajuan ruangan:", error);
    Swal.fire({
      icon: 'error',
      title: 'Gagal Membuat Pengajuan',
      text: 'Gagal membuat pengajuan ruangan. Silakan coba lagi.',
    });
  }
};

// --- Fungsi Form Peminjaman ---
const closeBorrowForm = () => {
  showBorrowForm.value = false;
  selectedRoom.value = null; 
  newBookingId.value = null;
};

const handleSubmitBorrow = async (formData) => {
  console.log("Submit data akhir:", { ...formData, bookingId: newBookingId.value });
  try {
    // Simulasi submit akhir ke API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Setelah submit sukses, fetch ulang data ruangan agar statusnya update
    await fetchAndMapRuangan();

    Swal.fire({
      icon: 'success',
      title: 'Booking Berhasil!',
      text: 'Ruangan berhasil dipesan dan status ruangan otomatis terbaru.',
    });

    closeBorrowForm();
    
    // Otomatis kembali ke pilihan gedung
    backToSelection();

  } catch (error) {
    console.error('Gagal update booking:', error);
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menyimpan',
      text: 'Gagal menyimpan detail peminjaman. Silakan coba lagi.',
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
              'cursor-pointer': room.status === 'Tersedia',
              'cursor-not-allowed opacity-60': room.status !== 'Tersedia'
            }"
          >
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ room.name }}</h3>
            <span 
              class="px-3 py-1 rounded-full text-sm font-semibold"
              :class="{
                'bg-green-100 text-green-800': room.status === 'Tersedia',
                'bg-red-100 text-red-800': room.status !== 'Tersedia'
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
    @submitted="handleSubmitBorrow" @close="closeBorrowForm"
  />
</template>