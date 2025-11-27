<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { jadwalRuangan } from '~/lib/api/ruangan'
import SidebarListRuangan from '~/components/ui/SidebarLIstRuangan.vue'
import { X, MapPin, Clock, User, BookOpen, Calendar } from 'lucide-vue-next'

definePageMeta({
  layout: "landing-page",
})

const events = ref([])
const jadwalData = ref([])
const isLoading = ref(true)
const selectedDate = ref(null)
const periodInfo = ref(null)

// Tooltip state
const showTooltip = ref(false)
const tooltipData = ref({})
const tooltipPosition = ref({ x: 0, y: 0 })

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
  // Add click listener for closing tooltip
  // document.addEventListener('click', handleClickOutside)
})

// onUnmounted(() => {
//   document.removeEventListener('click', handleClickOutside)
// })

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
}

function handleEventClick(info) {
  const event = info.event
  const props = event.extendedProps
  
  // Get click position
  const rect = info.el.getBoundingClientRect()
  const windowWidth = window.innerWidth
  const tooltipWidth = 320 // Estimated tooltip width
  
  // Calculate position to prevent overflow
  let xPosition = rect.left + window.scrollX + rect.width / 2
  if (xPosition + tooltipWidth / 2 > windowWidth) {
    xPosition = windowWidth - tooltipWidth - 20
  } else if (xPosition - tooltipWidth / 2 < 20) {
    xPosition = tooltipWidth / 2 + 20
  }
  
  tooltipPosition.value = {
    x: xPosition,
    y: rect.top + window.scrollY - 10
  }
  
  // Set tooltip data
  tooltipData.value = {
    title: event.title,
    date: new Date(event.start).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    ruangan: props.ruangan,
    gedung: props.gedung,
    waktu: props.waktu,
    peminjam: props.peminjam,
    nim: props.nim,
    matkul: props.matkul,
    semester: props.semester,
    status: props.status,
    isLoop: props.isLoop,
    backgroundColor: event.backgroundColor
  }
  
  showTooltip.value = true
}

function closeTooltip() {
  showTooltip.value = false
}

// Close tooltip when clicking outside
// function handleClickOutside(event) {
//   const tooltip = document.querySelector('.event-tooltip')
//   if (tooltip && !tooltip.contains(event.target)) {
//     showTooltip.value = false
//   }
// }

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

// Get status badge style
function getStatusStyle(status) {
  switch (status) {
    case 'BERLANGSUNG':
      return 'bg-green-100 text-green-800 border border-green-200'
    case 'DISETUJUI':
      return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'DITOLAK':
      return 'bg-red-100 text-red-800 border border-red-200'
    case 'SELESAI':
      return 'bg-gray-100 text-gray-800 border border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
}
</script>

<template>
  <div class="py-10 min-h-screen bg-gray-50 relative">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

    <!-- Event Tooltip Bubble -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-2"
    >
      <div
        v-if="showTooltip"
        class="event-tooltip fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-5 w-80"
        :style="{
          left: tooltipPosition.x - 160 + 'px',
          top: tooltipPosition.y - 10 + 'px',
          transform: 'translateY(-100%)'
        }"
      >
        <!-- Arrow pointing down -->
        <div class="absolute top-full left-1/2 transform -translate-x-1/2">
          <div class="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-200"></div>
        </div>

        <!-- Close button -->
        <button
          @click="closeTooltip"
          class="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X class="w-4 h-4 text-gray-500" />
        </button>

        <!-- Header -->
        <div class="mb-4 pr-8">
          <h3 class="font-bold text-gray-800 text-base leading-tight">{{ tooltipData.title }}</h3>
          <div class="flex items-center gap-1 mt-1">
            <Calendar class="w-3 h-3 text-gray-500" />
            <span class="text-xs text-gray-600">{{ tooltipData.date }}</span>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-3 text-sm">
          <!-- Location -->
          <div class="flex items-start gap-2">
            <MapPin class="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <div>
              <p class="font-medium text-gray-700">{{ tooltipData.ruangan }}</p>
              <p class="text-gray-500 text-xs">{{ tooltipData.gedung }}</p>
            </div>
          </div>

          <!-- Time -->
          <div class="flex items-center gap-2">
            <Clock class="w-4 h-4 text-gray-500" />
            <span class="text-gray-700">{{ tooltipData.waktu }}</span>
          </div>

          <!-- User -->
          <div class="flex items-center gap-2">
            <User class="w-4 h-4 text-gray-500" />
            <span class="text-gray-700">{{ tooltipData.peminjam }} ({{ tooltipData.nim }})</span>
          </div>

          <!-- Course -->
          <div class="flex items-start gap-2">
            <BookOpen class="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p class="font-medium text-gray-700">{{ tooltipData.matkul }}</p>
              <p class="text-gray-500 text-xs">Semester {{ tooltipData.semester }}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="getStatusStyle(tooltipData.status)"
          >
            {{ tooltipData.status }}
          </span>
          <div v-if="tooltipData.isLoop" class="flex items-center gap-1">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-gray-500">Berulang</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Additional styles for calendar */
:deep(.fc-event) {
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.fc-event:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>