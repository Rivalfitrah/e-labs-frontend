<template>
  <FullCalendar 
    :options="calendarOptions" 
  />
</template>

<script setup>
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'

// Plugins FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // click, drag

// Data events dummy
const events = ref([
  { title: 'Meeting', start: '2025-11-20' },
  { title: 'Workshop', start: '2025-11-22', end: '2025-11-23' }
])

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',

  selectable: true,
  editable: true,
  events: events.value,

  // Klik tanggal → Tambah event baru
  dateClick(info) {
    const title = prompt("Nama event:")
    if (title) {
      events.value.push({
        title: title,
        start: info.dateStr
      })
    }
  },

  // Klik event → Detail
  eventClick(info) {
    alert(`Event: ${info.event.title}`)
  },

  // Event dipindah drag & drop
  eventDrop(info) {
    console.log("Dipindah ke:", info.event.startStr)
  }
})
</script>

<style>
/* Tambahan jika butuh full kalender lebar penuh */
.fc {
  max-width: 100%;
}
</style>
