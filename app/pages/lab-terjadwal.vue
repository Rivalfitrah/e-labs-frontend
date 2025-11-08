<script setup>
import { ref, computed } from 'vue';

// --- STATE MANAGEMENT ---
const selectedSchedule = ref(null);
const isModalVisible = ref(false);


// --- CONTOH DATA (nantinya dari API) ---
const buildings = ref([
  {
    name: 'Gedung CA',
    labs: [
      {
        id: 'ca01',
        name: 'Labkom CA 01',
        schedules: [
          { id: 'ca01-1', time: '07:00 - 11:00', course: 'Basis Data - TPL 60', day: 'Senin' },
          { id: 'ca01-2', time: '11:00 - 15:00', course: 'Pemrograman Web - TPL 60', day: 'Selasa' },
          { id: 'ca01-3', time: '15:00 - 19:00', course: 'Analisa Visualisasi Data - TPL 60', day: 'Rabu' },
          { id: 'ca01-4', time: '09:00 - 12:00', course: 'Jaringan Komputer', day: 'Kamis' }, // Contoh data untuk hari Kamis
        ]
      },
      {
        id: 'ca02',
        name: 'Labkom CA 02',
        schedules: [
          { id: 'ca02-1', time: '07:00 - 11:00', course: 'Basis Data - TPL 60', day: 'Senin' },
          { id: 'ca02-2', time: '11:00 - 15:00', course: 'Pemrograman Web - TPL 60', day: 'Kamis' },
          { id: 'ca02-3', time: '15:00 - 19:00', course: 'Analisa Visualisasi Data - TPL 60', day: 'Jumat' },
        ]
      },
    {
        id: 'ca03',
        name: 'Labkom CA 03',
        schedules: [
          { id: 'ca03-1', time: '07:00 - 11:00', course: 'Basis Data - TPL 60', day: 'Senin' },
          { id: 'ca03-2', time: '11:00 - 15:00', course: 'Pemrograman Web - TPL 60', day: 'Kamis' },
          { id: 'ca03-3', time: '15:00 - 19:00', course: 'Analisa Visualisasi Data - TPL 60', day: 'Jumat' },
        ]
      },
    ]
  },
  {
    name: 'Gedung CB',
    labs: [
      {
        id: 'cb01',
        name: 'Labkom CB 01',
        schedules: [
          { id: 'cb01-1', time: '07:00 - 11:00', course: 'Basis Data - TPL 60', day: 'Senin' },
          { id: 'cb01-2', time: '11:00 - 15:00', course: 'Pemrograman Web - TPL 60', day: 'Selasa' },
          { id: 'cb01-3', time: '15:00 - 19:00', course: 'Analisa Visualisasi Data - TPL 60', day: 'Rabu' },
        ]
      },
      {
        id: 'cb02',
        name: 'Labkom CB 02',
        schedules: [
          { id: 'cb02-1', time: '07:00 - 11:00', course: 'Basis Data - TPL 60', day: 'Kamis' },
          { id: 'cb02-2', time: '11:00 - 15:00', course: 'Pemrograman Web - TPL 60', day: 'Jumat' },
          { id: 'cb02-3', time: '15:00 - 19:00', course: 'Analisa Visualisasi Data - TPL 60', day: 'Jumat' },
        ]
      },
    ]
  }
]);

// --- DIUBAH: Logika untuk deteksi hari ini ---

// 1. Buat mapping hari dari angka (JS) ke string (Indonesia)
const dayMap = [
  'Minggu', // 0
  'Senin',  // 1
  'Selasa', // 2
  'Rabu',   // 3
  'Kamis',  // 4
  'Jumat',  // 5
  'Sabtu'   // 6
];

// 2. Dapatkan tanggal & hari ini
const today = new Date();
const todayIndex = today.getDay(); // 0 (Minggu) - 6 (Sabtu)
const todayName = dayMap[todayIndex];

// 3. Tentukan hari default untuk filter
// Jika hari ini adalah 'Sabtu' (6) atau 'Minggu' (0), default ke 'Semua'.
// Jika tidak, default ke hari ini (Senin-Jumat).
let defaultDay = 'Semua';
if (todayIndex >= 1 && todayIndex <= 5) { // 1=Senin, 5=Jumat
  defaultDay = todayName;
}

// 4. Format tanggal lengkap untuk ditampilkan
const fullDate = today.toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}); 

// --- AKHIR PERUBAHAN ---


//fitur search dan filter hari
const searchQuery = ref('');
// --- DIUBAH ---
// Menggunakan defaultDay yang sudah ditentukan (cth: 'Kamis' atau 'Semua')
const selectedDay = ref(defaultDay);
// --- ---

const filteredBuildings = computed(() => {
  const day = selectedDay.value;
  const query = searchQuery.value.trim().toLowerCase();

  if (day === 'Semua' && !query) {
    return buildings.value;
  }

  return buildings.value
    .map(building => {
      const filteredLabs = building.labs
        .map(lab => {
          const filteredSchedules = lab.schedules.filter(schedule => {
            const dayMatch = day === 'Semua' || schedule.day === day;
            const searchMatch = !query ||
              lab.name.toLowerCase().includes(query) ||
              schedule.course.toLowerCase().includes(query);

            return dayMatch && searchMatch;
          });

          return { ...lab, schedules: filteredSchedules };
        })
        .filter(lab => lab.schedules.length > 0);

      return { ...building, labs: filteredLabs };
    })
    .filter(building => building.labs.length > 0);
});


// --- METHODS / HANDLERS ---
function handlePinjamClick() {
  isModalVisible.value = true;
}

function handleConfirmPinjam() {
  console.log('PINJAM DIKONFIRMASI:', selectedSchedule.value);
  isModalVisible.value = false; 
  selectedSchedule.value = null; 
}

// Untuk mendapatkan detail jadwal yang dipilih
const selectedScheduleDetails = computed(() => {
  if (!selectedSchedule.value) return null;
  for (const building of buildings.value) {
    for (const lab of building.labs) {
      if (lab.id === selectedSchedule.value.labId) {
        for (const schedule of lab.schedules) {
          if (schedule.id === selectedSchedule.value.scheduleId) {
            return { labName: lab.name, ...schedule };
          }
        }
      }
    }
  }
  return null;
});

</script>

<template>
    <div class="bg-[#F6FBF6] min-h-screen">
        <TheNavbar />
        <div class="p-8">
            <!-- ================================== -->
            <div class="mb-6 text-center">
              <h2 class="text-2xl font-bold text-gray-800">Jadwal Lab</h2>
              <p class="text-lg text-green-600 font-medium">{{ fullDate }}</p>
            </div>
            <!-- ================================== -->

            <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
                <label for="hari">Hari:</label>
                <select 
                id="hari"
                v-model="selectedDay"
                class="border rounded-lg px-4 py-2">
                <option>Semua</option>
                <option>Senin</option>
                <option>Selasa</option>
                <option>Rabu</option>
                <option>Kamis</option>
                <option>Jumat</option>
                </select>
            </div>
            <div class="relative">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Cari Jadwal"
                    class="border rounded-lg px-4 py-2 pl-10"
                />
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </span>
            </div>
            </div>

            <div v-for="building in filteredBuildings" :key="building.name" class="mb-10">
            <h2 class="w-full text-2xl font-bold text-gray-700 mb-4 text-center">{{ building.name }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ScheduleCard
                v-for="lab in building.labs"
                :key="lab.id"
                :lab="lab"
                :selected-schedule-id="selectedSchedule ? selectedSchedule.scheduleId : null"
                @select-schedule="scheduleId => selectedSchedule = { labId: lab.id, scheduleId }"
                @pinjam="handlePinjamClick"
                />
            </div>
            </div>

            <ConfirmationModal
            :show="isModalVisible"
            title="Konfirmasi Peminjaman"
            @close="isModalVisible = false"
            @confirm="handleConfirmPinjam"
            >
            <p v-if="selectedScheduleDetails">
                Anda yakin ingin meminjam {{ selectedScheduleDetails.labName }} pada jadwal {{ selectedScheduleDetails.time }} untuk mata kuliah {{ selectedScheduleDetails.course }}?
            </p>
            </ConfirmationModal>
        </div>
    </div>
</template>