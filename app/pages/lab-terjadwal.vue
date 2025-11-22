<script setup>
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import scheduleData from '~/data/schedule.json'
import SidebarListRuangan from '~/components/ui/SidebarLIstRuangan.vue'

definePageMeta({
  layout: "landing-page",
})

const events = ref([])

// Load data dari JSON dan ambil 5 data pertama
onMounted(() => {
  events.value = scheduleData.slice(0, 5)
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
  eventBackgroundColor: '#3788d8',
  eventBorderColor: '#3788d8',
  locale: 'id'
})

function handleDateClick(info) {
  alert("Tanggal dipilih: " + info.dateStr)
}

function handleEventClick(info) {
  const event = info.event
  alert(`Kegiatan: ${event.title}
Tanggal: ${new Date(event.start).toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}
Ruangan: ${event.extendedProps.ruangan}
Waktu: ${event.extendedProps.waktu}`)
}
</script>

<template>
  <div class="py-10 min-h-screen bg-gray-50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 class="font-bold text-3xl mb-8 text-center text-gray-800">Lab Terjadwal</h1>

      <!-- Grid Layout: Calendar + Sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Calendar Section (2/3 width on large screens) -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <FullCalendar :options="calendarOptions" />
          </div>
        </div>

        <!-- Sidebar Section (1/3 width on large screens) -->
        <div class="lg:col-span-1">
          <SidebarListRuangan :schedules="events" />
        </div>
      </div>
    </div>
  </div>
</template>