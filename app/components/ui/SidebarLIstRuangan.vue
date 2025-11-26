<script setup>
import { computed } from 'vue'
import { MapPin, Clock, Calendar } from 'lucide-vue-next'

const props = defineProps({
  schedules: {
    type: Array,
    default: () => []
  }
})

// Group schedules by ruangan
const groupedByRuangan = computed(() => {
  const groups = {}
  
  props.schedules.forEach(schedule => {
    const ruangan = schedule.extendedProps?.ruangan || 'Unknown'
    if (!groups[ruangan]) {
      groups[ruangan] = []
    }
    groups[ruangan].push(schedule)
  })
  
  return groups
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  })
}

const getColorClass = (backgroundColor) => {
  const colorMap = {
    '#3b82f6': 'bg-blue-100 border-blue-500 text-blue-700',
    '#10b981': 'bg-green-100 border-green-500 text-green-700',
    '#f59e0b': 'bg-amber-100 border-amber-500 text-amber-700',
    '#8b5cf6': 'bg-purple-100 border-purple-500 text-purple-700',
    '#ec4899': 'bg-pink-100 border-pink-500 text-pink-700',
    '#ef4444': 'bg-red-100 border-red-500 text-red-700',
    '#6b7280': 'bg-gray-100 border-gray-500 text-gray-700'
  }
  return colorMap[backgroundColor] || 'bg-gray-100 border-gray-500 text-gray-700'
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg flex flex-col h-full max-h-[700px]">
    <!-- Header - Fixed -->
    <div class="p-6 border-b border-gray-200 flex-shrink-0">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <MapPin class="w-5 h-5 text-primary" />
        Ruangan Terpakai
      </h2>
    </div>

    <!-- Content - Scrollable -->
    <div class="flex-1 overflow-y-auto p-6">
      <div v-if="Object.keys(groupedByRuangan).length > 0" class="space-y-4">
        <div 
          v-for="(schedules, ruangan) in groupedByRuangan" 
          :key="ruangan"
          class="border-l-4 border-primary bg-gray-50 rounded-r-lg p-4 hover:shadow-md transition-all"
        >
          <!-- Ruangan Header -->
          <div class="flex items-center gap-2 mb-3">
            <MapPin class="w-4 h-4 text-primary" />
            <h3 class="font-bold text-gray-800 text-sm">{{ ruangan }}</h3>
           
          </div>

          <!-- Schedule List -->
          <div class="space-y-2">
            <div 
              v-for="(schedule, idx) in schedules" 
              :key="idx"
              class="border-l-2 pl-3 py-2 rounded"
              :class="getColorClass(schedule.backgroundColor)"
            >
              <p class="font-semibold text-sm">{{ schedule.title }}</p>
              <div class="flex items-center gap-3 mt-1 text-xs">
                <div class="flex items-center gap-1">
                  <Calendar class="w-3 h-3" />
                  <span>{{ formatDate(schedule.date) }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Clock class="w-3 h-3" />
                  <span>{{ schedule.extendedProps?.waktu }}</span>
                </div>
              </div>
              <div class="mt-1">
                <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                      :class="getColorClass(schedule.backgroundColor)">
                  {{ schedule.extendedProps?.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 text-gray-500">
        <MapPin class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Belum ada ruangan terpakai</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions */
.hover\:shadow-md {
  transition: box-shadow 0.3s ease;
}
</style>