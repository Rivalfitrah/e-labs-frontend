<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

definePageMeta({
  layout: "landing-page",
})

const eventData = [
  {
    title: "Praktikum Algoritma",
    date: "2025-02-10",
    extendedProps: {
      ruangan: "Lab A",
      waktu: "08:00 - 10:00"
    }
  },
  {
    title: "Peminjaman Rapat",
    date: "2025-02-12",
    extendedProps: {
      ruangan: "Lab B",
      waktu: "13:00 - 15:00"
    }
  }
]

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: eventData,
  dateClick: handleDateClick,
  eventClick: handleEventClick,
  height: 650,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek'
  }
}

function handleDateClick(info) {
  alert("Tanggal dipilih: " + info.dateStr)
}

function handleEventClick(info) {
  alert(`Kegiatan: ${info.event.title}
Tanggal: ${info.event.startStr}
Ruangan: ${info.event.extendedProps.ruangan}
Waktu: ${info.event.extendedProps.waktu}`)
}
</script>

<template>
  <div class="py-10 min-h-screen bg-gray-50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 class="font-bold text-3xl mb-8 text-center">Lab Terjadwal</h1>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>