<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200 gap-3">
    <!-- Info Text -->
    <span class="text-sm text-gray-700 text-center sm:text-left">
      Menampilkan
      <span class="font-semibold">{{ startItem }}</span>
      sampai
      <span class="font-semibold">{{ endItem }}</span>
      dari
      <span class="font-semibold">{{ totalItems }}</span>
      {{ itemLabel }}
    </span>

    <!-- Pagination Controls -->
    <nav class="flex items-center space-x-1" aria-label="Pagination">
      <!-- Previous Button -->
      <button 
        @click="$emit('previous')" 
        :disabled="currentPage === 1"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition">
        <ChevronLeft class="w-5 h-5" />
      </button>

      <!-- Page Numbers (Hidden on mobile) -->
      <div class="hidden md:flex space-x-1">
        <button 
          v-for="page in visiblePages" 
          :key="page" 
          @click="$emit('goToPage', page)" 
          :class="{
            'bg-primary text-white': page === currentPage,
            'bg-white text-gray-700 hover:bg-gray-100': page !== currentPage
          }" 
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition">
          {{ page }}
        </button>
      </div>

      <!-- Mobile view - Show only current page info -->
      <div class="md:hidden flex items-center space-x-2">
        <span class="text-sm text-gray-600">{{ currentPage }} / {{ totalPages }}</span>
      </div>

      <!-- Next Button -->
      <button 
        @click="$emit('next')" 
        :disabled="currentPage === totalPages"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition">
        <ChevronRight class="w-5 h-5" />
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  },
  itemLabel: {
    type: String,
    default: 'item'
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  }
})

defineEmits(['previous', 'next', 'goToPage'])

// Computed properties
const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))

// Calculate visible page numbers
const visiblePages = computed(() => {
  const { currentPage, totalPages, maxVisiblePages } = props
  const pages = []
  
  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is less than max
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Calculate start and end based on current page
    const halfVisible = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})
</script>