<script setup>
import { ref, onMounted, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { jadwalRuangan } from '~/lib/api/ruangan'
import SidebarListRuangan from '~/components/ui/SidebarLIstRuangan.vue'

definePageMeta({
  layout: "landing-page",
})

const events = ref([])
const jadwalData = ref([])
const isLoading = ref(true)
const selectedDate = ref(null)
const periodInfo = ref(null)

// Fetch data jadwal ruangan menggunakan API function yang sudah ada
const fetchRuanganData = async (tanggal = null) => {
  try {
    isLoading.value = true
    
    let params = {}
    
    if (tanggal) {
      // Jika ada tanggal spesifik, gunakan parameter tanggal
      params = { tanggal }
    } else {
      // Default: ambil bulan dan tahun saat ini
      const now = new Date()
      params = {
        bulan: (now.getMonth() + 1).toString(),
        tahun: now.getFullYear().toString()
      }
    }
    
    const response = await jadwalRuangan(params)
    
    // Handle response structure dari API jadwal
    if (response.status === 'success') {
      jadwalData.value = response.data || []
      periodInfo.value = response.period || null
      convertToCalendarEvents(response.data || [])
    }
    
  } catch (error) {
    console.error('Error fetching ruangan data:', error)
    jadwalData.value = []
    events.value = []
  } finally {
    isLoading.value = false
  }
}

// Konversi data jadwal ke format events calendar
const convertToCalendarEvents = (data) => {
  const calendarEvents = []
  
  data.forEach(jadwal => {
    // Convert UTC time to local date
    const startDate = new Date(jadwal.jam_mulai)
    const endDate = new Date(jadwal.jam_selesai)
    const eventDate = startDate.toISOString().split('T')[0]
    
    // Format waktu lokal
    const startTime = startDate.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
    const endTime = endDate.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
    
    // Tentukan warna berdasarkan status
    let backgroundColor, borderColor
    switch (jadwal.status) {
      case 'BERLANGSUNG':
        backgroundColor = '#10b981'
        borderColor = '#059669'
        break
      case 'DISETUJUI':
        backgroundColor = '#3b82f6'
        borderColor = '#2563eb'
        break
      case 'PENDING':
        backgroundColor = '#f59e0b'
        borderColor = '#d97706'
        break
      case 'DITOLAK':
        backgroundColor = '#ef4444'
        borderColor = '#dc2626'
        break
      case 'SELESAI':
        backgroundColor = '#6b7280'
        borderColor = '#4b5563'
        break
      default:
        backgroundColor = '#6b7280'
        borderColor = '#4b5563'
    }

    calendarEvents.push({
      id: jadwal.id,
      title: jadwal.kegiatan,
      date: eventDate,
      backgroundColor,
      borderColor,
      extendedProps: {
        ruangan: `${jadwal.ruangan.nama_ruangan} (${jadwal.ruangan.kode_ruangan})`,
        gedung: jadwal.ruangan.gedung,
        waktu: `${startTime} - ${endTime}`,
        peminjam: jadwal.user?.nama || 'N/A',
        nim: jadwal.user?.NIM || jadwal.user?.NIP || 'N/A',
        status: jadwal.status,
        matkul: jadwal.matkul?.matkul || 'N/A',
        semester: jadwal.matkul?.semester || 'N/A',
        isLoop: jadwal.isLoop || false,
        accepted_by_id: jadwal.accepted_by_id
      }
    })
  })
  
  events.value = calendarEvents
}

// Load data saat komponen dimount
onMounted(() => {
  fetchRuanganData()
})

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: events,
  dateClick: handleDateClick,
  eventClick: handleEventClick,
  height: 650,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek'
  },
  eventDisplay: 'block',
  displayEventTime: false,
  locale: 'id'
})

function handleDateClick(info) {
  selectedDate.value = info.dateStr
  fetchRuanganData(info.dateStr)
}

function handleEventClick(info) {
  const event = info.event
  const props = event.extendedProps
  
  alert(`Kegiatan: ${event.title}
Tanggal: ${new Date(event.start).toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}
Ruangan: ${props.ruangan}
Gedung: ${props.gedung}
Waktu: ${props.waktu}
Peminjam: ${props.peminjam} (${props.nim})
Mata Kuliah: ${props.matkul} (Semester ${props.semester})
Status: ${props.status}
Loop: ${props.isLoop ? 'Ya' : 'Tidak'}`)
}

// Computed untuk data yang akan dikirim ke sidebar
const sidebarEvents = computed(() => {
  return events.value.map(event => ({
    title: event.title,
    date: event.date,
    backgroundColor: event.backgroundColor,
    extendedProps: event.extendedProps
  }))
})

// Summary berdasarkan data jadwal
const jadwalSummary = computed(() => {
  const totalJadwal = jadwalData.value.length
  const statusCounts = jadwalData.value.reduce((acc, jadwal) => {
    acc[jadwal.status] = (acc[jadwal.status] || 0) + 1
    return acc
  }, {})
  
  // Hitung ruangan unik yang terpakai
  const uniqueRuangan = new Set(jadwalData.value.map(j => j.ruangan_id))
  
  return {
    total_jadwal: totalJadwal,
    berlangsung: statusCounts.BERLANGSUNG || 0,
    disetujui: statusCounts.DISETUJUI || 0,
    selesai: statusCounts.SELESAI || 0,
    ruangan_terpakai: uniqueRuangan.size
  }
})
</script>

<template>
  <div class="py-10 min-h-screen bg-gray-50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- <h1 class="font-bold text-3xl mb-8 text-center text-gray-800">Lab Terjadwal</h1> -->

      <!-- Period Info -->
      <!-- <div v-if="periodInfo" class="mb-4 text-center">
        <p class="text-gray-600">
          Periode: {{ new Date(periodInfo.start).toLocaleDateString('id-ID') }} - 
          {{ new Date(periodInfo.end).toLocaleDateString('id-ID') }}
          ({{ periodInfo.month }}/{{ periodInfo.year }})
        </p>
      </div> -->

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 class="text-lg font-semibold text-gray-600">Total Jadwal</h3>
          <p class="text-2xl font-bold text-blue-600">{{ jadwalSummary.total_jadwal }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 class="text-lg font-semibold text-gray-600">Berlangsung</h3>
          <p class="text-2xl font-bold text-green-600">{{ jadwalSummary.berlangsung }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 class="text-lg font-semibold text-gray-600">Disetujui</h3>
          <p class="text-2xl font-bold text-blue-600">{{ jadwalSummary.disetujui }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 class="text-lg font-semibold text-gray-600">Selesai</h3>
          <p class="text-2xl font-bold text-gray-600">{{ jadwalSummary.selesai }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 class="text-lg font-semibold text-gray-600">Ruangan Terpakai</h3>
          <p class="text-2xl font-bold text-purple-600">{{ jadwalSummary.ruangan_terpakai }}</p>
        </div>
      </div>

      <!-- Grid Layout: Calendar + Sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Calendar Section (2/3 width on large screens) -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div v-if="isLoading" class="text-center py-8">
              <p class="text-gray-500">Memuat data jadwal...</p>
            </div>
            <FullCalendar v-else :options="calendarOptions" />
          </div>
        </div>

        <!-- Sidebar Section (1/3 width on large screens) -->
        <div class="lg:col-span-1">
          <SidebarListRuangan :schedules="sidebarEvents" />
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-6 bg-white rounded-lg shadow-md p-4">
        <h3 class="text-lg font-semibold mb-3 text-gray-800">Keterangan Status</h3>
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-green-500 rounded"></div>
            <span class="text-sm text-gray-600">BERLANGSUNG</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-blue-500 rounded"></div>
            <span class="text-sm text-gray-600">DISETUJUI</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-yellow-500 rounded"></div>
            <span class="text-sm text-gray-600">PENDING</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-red-500 rounded"></div>
            <span class="text-sm text-gray-600">DITOLAK</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-gray-500 rounded"></div>
            <span class="text-sm text-gray-600">SELESAI</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>