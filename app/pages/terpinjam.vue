<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getRuanganRealtimeState } from '../lib/api/ruangan/ruanganApi' 
import { io } from "socket.io-client";
import { base_URL } from '../lib/base';


definePageMeta({
  layout: "landing-page",
})

// Setup Socket
const socket = io(base_URL);

// State
const items = ref<any[]>([]);
const now = ref(Date.now());
let timerInterval: any = null;

// --- HELPER: Format Sisa Waktu ---
const formatDuration = (ms: number) => {
  if (isNaN(ms) || ms < 0) return "00:00:00"; 
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)));
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const formatTime = (ts: number) => {
  if (!ts) return "-";
  return new Date(ts).toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit', hour12: false
  });
};

// --- LOGIC UTAMA (Dengan Safety Check Anti-Crash) ---
const getRealtimeInfo = (item: any) => {
  // SAFETY CHECK: Kalau item null/undefined, return default biar gak error render
  if (!item) {
     return { text: '-', color: 'text-gray-400', bg: 'bg-gray-100', countdown: '-' };
  }

  // 1. KASUS KOSONG MURNI
  if (item.status_raw === 'KOSONG') {
     return { text: 'KOSONG', color: 'text-green-700', bg: 'bg-green-100', countdown: '-' };
  }

  // Hitung selisih waktu
  // Pakai (item.ts_selesai || 0) biar kalau null dianggap 0
  const diff = (item.ts_selesai || 0) - now.value;

  // 2. KASUS EARLY RELEASE (Status SELESAI)
  if (item.status_raw === 'SELESAI') {
    if (diff > 0) {
        return { 
            text: 'KOSONG (Sisa Waktu)', 
            color: 'text-green-700', 
            bg: 'bg-green-100', 
            countdown: formatDuration(diff) 
        };
    } else {
        return { 
            text: 'KOSONG', 
            color: 'text-green-700', 
            bg: 'bg-green-100', 
            countdown: '-' 
        };
    }
  }

  // 3. KASUS WAKTU HABIS
  if (diff <= 0) {
       return { text: 'Sesi Berakhir', color: 'text-gray-500', bg: 'bg-gray-100', countdown: '00:00:00' };
  }

  // 4. KASUS NORMAL
  return { text: 'SEDANG DIGUNAKAN', color: 'text-red-700', bg: 'bg-red-100', countdown: formatDuration(diff) };
};

// --- ON MOUNTED ---
onMounted(async () => {
  try {
    const response = await getRuanganRealtimeState({}); 

    if (response && response.data) {
      items.value = response.data.map((room: any) => {
        return {
           id_asli: room.id,
           nama_ruangan: room.nama,
           status_raw: room.status, 
           
           kegiatan: room.currentBooking ? room.currentBooking.kegiatan : "-",
           ts_selesai: room.currentBooking ? room.currentBooking.jam_selesai_ts : null,
           
           jadwal_display: room.currentBooking 
              ? `Sampai ${formatTime(room.currentBooking.jam_selesai_ts)}` 
              : "-"
        };
      });
    }

    // SOCKET LISTENER
    socket.on("room_update", (updatedRoom: any) => {
        console.log("⚡ Room Update:", updatedRoom);
        
        const index = items.value.findIndex((i: any) => i.id_asli === updatedRoom.id);
        
        if (index !== -1) {
            // Update data lokal
            items.value[index] = {
               id_asli: updatedRoom.id,
               nama_ruangan: updatedRoom.nama,
               status_raw: updatedRoom.status,
               kegiatan: updatedRoom.currentBooking ? updatedRoom.currentBooking.kegiatan : "-",
               ts_selesai: updatedRoom.currentBooking ? updatedRoom.currentBooking.jam_selesai_ts : null,
               jadwal_display: updatedRoom.currentBooking 
                  ? `Sampai ${formatTime(updatedRoom.currentBooking.jam_selesai_ts)}` 
                  : "-"
            };
        }
    });

    // TIMER
    timerInterval = setInterval(() => {
      now.value = Date.now();
    }, 1000);

  } catch (e) {
    console.error("Error:", e);
  }
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  socket.off("room_update");
  socket.disconnect(); 
});
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Status Ruangan Real-time</h1>
      <p class="text-sm text-gray-500">Memantau ketersediaan ruangan secara langsung</p>
    </div>
    
    <div class="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ruangan</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kegiatan</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Jadwal Selesai</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status Saat Ini</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Hitung Mundur</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">
          <tr 
            v-for="item in items" 
            :key="item.id_asli" 
            class="hover:bg-blue-50 transition duration-150 ease-in-out"
          >
            <td class="px-6 py-4 font-medium text-gray-900">
              {{ item.nama_ruangan }}
            </td>
            <td class="px-6 py-4 text-gray-600 text-sm">
              {{ item.kegiatan }}
            </td>
            <td class="px-6 py-4 text-gray-600 text-sm font-mono">
              {{ item.jadwal_display }}
            </td>
            <td class="px-6 py-4">
              <span 
                class="px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"
                :class="getRealtimeInfo(item).bg + ' ' + getRealtimeInfo(item).color"
              >
                <span class="w-2 h-2 rounded-full bg-current"></span>
                {{ getRealtimeInfo(item).text }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <span class="font-mono text-lg font-bold text-gray-700 tracking-widest">
                {{ getRealtimeInfo(item).countdown }}
              </span>
            </td>
          </tr>

          <tr v-if="items.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-gray-400 italic">
              Belum ada data ruangan...
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
tr {
  transition: all 0.2s;
}
</style>