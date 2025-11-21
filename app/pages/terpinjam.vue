<script lang="ts" setup>
import type { Header, Item } from 'vue3-easy-data-table'
import { ref, onMounted, onUnmounted } from 'vue'
import { getRuanganRealtime } from '~/lib/api/ruangan/ruanganApi'

definePageMeta({
  layout: "landing-page",
})

const headers: Header[] = [
  { text: "RUANGAN", value: "nama_ruangan", sortable: true },
  { text: "KEGIATAN", value: "kegiatan" },
  { text: "JADWAL ASLI", value: "jadwal_display" },
  { text: "STATUS SAAT INI", value: "status_realtime" },
  { text: "HITUNG MUNDUR", value: "countdown" },
];

const items = ref<Item[]>([]);
const now = ref(new Date());
let timerInterval: any = null;
const formatDuration = (ms: number) => {
  if (isNaN(ms) || ms < 0) return "00:00:00"; 
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)));
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
const getRealtimeInfo = (item: any) => {
  if (!item || !item.status_db) {
     return { text: '-', color: 'text-gray-400', bg: 'bg-gray-100', countdown: '-' };
  }
  if (item.status_db === 'KOSONG') {
    return {
      text: 'KOSONG',
      color: 'text-green-700',
      bg: 'bg-green-100',
      countdown: '-'
    };
  }
  if (!item.jam_selesai) {
     return { text: 'Invalid Data', color: 'text-gray-400', bg: 'bg-gray-100', countdown: '-' };
  }

  const jadwalSelesai = new Date(item.jam_selesai).getTime();
  if (isNaN(jadwalSelesai)) {
     return { text: 'Error Date', color: 'text-red-500', bg: 'bg-red-50', countdown: 'Error' };
  }

  const currentTime = now.value.getTime();
  const diff = jadwalSelesai - currentTime;
  if (diff <= 0) {
    return {
      text: 'Sesi Berakhir',
      color: 'text-gray-500',
      bg: 'bg-gray-100',
      countdown: '00:00:00'
    };
  }

  if (item.status_db === 'SELESAI') {
    return {
      text: 'KOSONG (Sisa Waktu)',
      color: 'text-green-700',
      bg: 'bg-green-100',
      countdown: formatDuration(diff)
    };
  }

  return {
    text: 'SEDANG DIGUNAKAN',
    color: 'text-red-700',
    bg: 'bg-red-100',
    countdown: formatDuration(diff)
  };
};

onMounted(async () => {
  try {
    const response = await getRuanganRealtime({});

    if (response && response.data) {
      const currentTimestamp = new Date().getTime();

      items.value = response.data.map((ruang: any) => {
          let activeSchedule = null;

          if (ruang.jadwal_hari_ini && ruang.jadwal_hari_ini.length > 0) {
              const candidates = ruang.jadwal_hari_ini.filter((j: any) => {
                  const start = new Date(j.jam_mulai).getTime();
                  const end = new Date(j.jam_selesai).getTime();
                  const isTimeMatch = currentTimestamp >= start && currentTimestamp < end;
                  const isStatusMatch = ['DISETUJUI', 'SELESAI', 'BERLANGSUNG'].includes(j.status);

                  return isTimeMatch && isStatusMatch;
              });
              if (candidates.length > 0) {
                  candidates.sort((a: any, b: any) => {
                      if (a.status === 'DISETUJUI' && b.status === 'SELESAI') return -1;
                      if (a.status === 'SELESAI' && b.status === 'DISETUJUI') return 1;
                      return b.id - a.id;
                  });
                  activeSchedule = candidates[0];
              }
          }

          // JIKA KETEMU JADWAL YANG COCOK
          if (activeSchedule) {
              const formatWIB = (isoString: string) => {
                  return new Date(isoString).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                      timeZone: 'Asia/Jakarta'
                  });
              };

              return {
                  nama_ruangan: ruang.nama,
                  kegiatan: activeSchedule.kegiatan || "Tidak ada ket.",
                  jam_mulai: activeSchedule.jam_mulai,
                  jam_selesai: activeSchedule.jam_selesai,
                  status_db: activeSchedule.status,
                  jadwal_display: `${formatWIB(activeSchedule.jam_mulai)} - ${formatWIB(activeSchedule.jam_selesai)} WIB`
              };
          }
          else {
              return {
                  nama_ruangan: ruang.nama,
                  kegiatan: "-",
                  jam_mulai: null, 
                  jam_selesai: null, 
                  status_db: "KOSONG", 
                  jadwal_display: "-"
              };
          }
      });
    timerInterval = setInterval(() => {
      now.value = new Date();
    }, 1000);

  }
  } catch (e) {
    console.error("Error onMounted:", e);
  }
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Status Ruangan Real-time</h1>
    
    <EasyDataTable
      :headers="headers"
      :items="items"
      table-class-name="customize-table"
    >
      <template #item-status_realtime="{ item }">
        <div 
          class="px-3 py-1 rounded-full text-xs font-bold w-fit"
          :class="getRealtimeInfo(item).bg + ' ' + getRealtimeInfo(item).color"
        >
          {{ getRealtimeInfo(item).text }}
        </div>
      </template>

      <template #item-countdown="{ item }">
        <span class="font-mono text-lg font-bold text-gray-700">
          {{ getRealtimeInfo(item).countdown }}
        </span>
      </template>

    </EasyDataTable>
  </div>
</template>

<style scoped>
</style>