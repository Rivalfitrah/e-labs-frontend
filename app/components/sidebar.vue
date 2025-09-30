<script setup>
import { 
  LayoutDashboard, 
  Package, 
  Building2, 
  ClipboardList, 
  ChevronDown,
  Users,
  Settings,
  BarChart3,
  Calendar,
  Archive
} from 'lucide-vue-next'

import { ref } from 'vue'

const isPeminjamanOpen = ref(false)

const togglePeminjaman = () => {
  isPeminjamanOpen.value = !isPeminjamanOpen.value
}
</script>

<template>
  <div class="fixed top-0 left-0 h-screen w-64 bg-primary text-secondary flex flex-col shadow-xl z-40 transform transition-transform duration-300 md:fixed md:translate-x-0">
    <!-- Header Section -->
    <div class="p-6 border-b border-secondary/20">
      <div class="text-center">
        <h2 class="text-4xl font-bold font-sans mb-1">e-LABS+</h2>
        <span class="text-sm font-sans opacity-80">Admin Dashboard</span>
      </div>
    </div>

    <!-- Navigation Section -->
    <div class="flex-1 overflow-y-auto p-4">
      <nav class="space-y-2">
        <!-- Dashboard -->
        <div>
          <a href="#" class="flex items-center px-4 py-3 rounded-lg hover:bg-secondary/10 transition-all duration-200 group">
            <LayoutDashboard class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            <span class="font-sans font-medium">Dashboard</span>
          </a>
        </div>

        <!-- Peminjaman Section -->
        <div>
          <button 
            @click="togglePeminjaman"
            class="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary/10 transition-all duration-200 group"
          >
            <div class="flex items-center">
              <ClipboardList class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              <span class="font-sans font-medium">Peminjaman</span>
            </div>
            <ChevronDown 
              class="w-4 h-4 transition-transform duration-200" 
              :class="{ 'rotate-180': isPeminjamanOpen }"
            />
          </button>

          <!-- Submenu -->
          <div 
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="isPeminjamanOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="ml-8 mt-2 space-y-1 border-l-2 border-secondary/20 pl-4">
              <a href="#" class="flex items-center px-3 py-2 rounded-lg hover:bg-secondary/10 transition-all duration-200 group text-sm">
                <Package class="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                <span class="font-sans">Barang</span>
              </a>
              <a href="#" class="flex items-center px-3 py-2 rounded-lg hover:bg-secondary/10 transition-all duration-200 group text-sm">
                <Building2 class="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                <span class="font-sans">Ruangan</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Additional Menu Items -->
        <div>
          <a href="#" class="flex items-center px-4 py-3 rounded-lg hover:bg-secondary/10 transition-all duration-200 group">
            <Users class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            <span class="font-sans font-medium">Pengguna</span>
          </a>
        </div>

        <div>
          <a href="#" class="flex items-center px-4 py-3 rounded-lg hover:bg-secondary/10 transition-all duration-200 group">
            <Archive class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            <span class="font-sans font-medium">Inventaris</span>
          </a>
        </div>

        <div>
          <a href="#" class="flex items-center px-4 py-3 rounded-lg hover:bg-secondary/10 transition-all duration-200 group">
            <BarChart3 class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            <span class="font-sans font-medium">Laporan</span>
          </a>
        </div>

        <div>
          <a href="#" class="flex items-center px-4 py-3 rounded-lg hover:bg-secondary/10 transition-all duration-200 group">
            <Calendar class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            <span class="font-sans font-medium">Jadwal</span>
          </a>
        </div>
      </nav>
    </div>

    <!-- Footer Section -->
    <div class="p-4 border-t border-secondary/20">
      <a href="#" class="flex items-center px-4 py-3 rounded-lg hover:bg-secondary/10 transition-all duration-200 group">
        <Settings class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
        <span class="font-sans font-medium">Pengaturan</span>
      </a>
    </div>
  </div>
</template>
