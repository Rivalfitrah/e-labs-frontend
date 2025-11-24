<script setup>
import { X, MapPin, Clock, Calendar } from 'lucide-vue-next'

defineProps({
  isOpen: Boolean,
  event: Object // Object event dari FullCalendar
})

const emit = defineEmits(['close'])

// Helper untuk format tanggal full
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        @click="$emit('close')"
      ></div>

      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all scale-100 overflow-hidden">
        
        <div class="h-3 w-full bg-primary"></div>

        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-bold text-gray-800 pr-8">
              {{ event?.title || 'Detail Kegiatan' }}
            </h3>
            <button 
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="space-y-4">
            
            <div class="flex items-start gap-3 text-gray-600">
              <Calendar class="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <p class="text-sm font-medium text-gray-500">Tanggal</p>
                <p class="text-base font-semibold text-gray-800">{{ formatDate(event?.start) }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3 text-gray-600">
              <Clock class="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <p class="text-sm font-medium text-gray-500">Waktu</p>
                <p class="text-base font-semibold text-gray-800">
                  {{ event?.extendedProps?.waktu || '-' }} WIB
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3 text-gray-600">
              <MapPin class="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <p class="text-sm font-medium text-gray-500">Ruangan</p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-1">
                  {{ event?.extendedProps?.ruangan || 'Unknown' }}
                </span>
              </div>
            </div>

             <div v-if="event?.extendedProps?.description" class="mt-4 pt-4 border-t border-gray-100">
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ event.extendedProps.description }}
              </p>
            </div>

          </div>

          <div class="mt-8 flex justify-end gap-3">
            <button 
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Tutup
            </button>
            </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>