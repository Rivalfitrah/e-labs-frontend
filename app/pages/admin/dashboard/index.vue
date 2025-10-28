<script setup>
import UiInfoBox from '~/components/ui/infoBox.vue'
import { 
  BarChart3, 
  Users, 
  Package, 
  Building, 
  GraduationCap, 
  UserCheck, 
  UserX, 
  ShieldCheck,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Wrench
} from 'lucide-vue-next'
import { onMounted, ref } from 'vue'

// Import API functions
import { getDashboardBarang } from '~/lib/api/barang'
import { dashboardUser } from '~/lib/api/pengguna'
import { getDashboardRuangan } from '~/lib/api/ruangan'

definePageMeta({
  layout: 'dashboard'
})

// State management
const isLoading = ref(true)
const barangStats = ref(null)
const userStats = ref(null)
const ruanganStats = ref(null)

// Fetch all dashboard data
async function fetchDashboardData() {
  isLoading.value = true
  try {
    const [barangData, userData, ruanganData] = await Promise.all([
      getDashboardBarang().catch(err => {
        console.error('Error fetching barang stats:', err)
        return null
      }),
      dashboardUser().catch(err => {
        console.error('Error fetching user stats:', err)
        return null
      }),
      getDashboardRuangan().catch(err => {
        console.error('Error fetching ruangan stats:', err)
        return null
      })
    ])

    // Process barang data
    if (barangData?.data?.overview) {
      barangStats.value = barangData.data.overview
    }

    // Process user data
    if (userData?.data) {
      userStats.value = {
        mahasiswa: userData.data.totalMahasiswa || 0,
        dosen: userData.data.totalDosen || 0,
        pengelola: userData.data.totalPengelola || 0,
        aktif: userData.data.totalActive || 0,
        blokir: userData.data.totalBlocked || 0
      }
    }

    // Process ruangan data
    if (ruanganData?.data?.overview) {
      ruanganStats.value = ruanganData.data.overview
    }

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-8 text-white shadow-2xl">
      <div class="flex items-center gap-4 mb-4">
        <div class="bg-white/20 p-3 rounded-xl">
          <BarChart3 class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-3xl font-bold">Dashboard E-Labs</h1>
          <p class="text-green-100">Selamat datang di sistem manajemen laboratorium</p>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div class="bg-white/10 backdrop-blur rounded-xl p-4">
          <div class="flex items-center gap-3">
            <Users class="w-6 h-6" />
            <div>
              <p class="text-sm opacity-90">Total Pengguna</p>
              <p class="text-2xl font-bold">
                {{ userStats ? (userStats.mahasiswa + userStats.dosen + userStats.pengelola) : 0 }}
              </p>
            </div>
          </div>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-xl p-4">
          <div class="flex items-center gap-3">
            <Package class="w-6 h-6" />
            <div>
              <p class="text-sm opacity-90">Total Barang</p>
              <p class="text-2xl font-bold">{{ barangStats?.total || 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-xl p-4">
          <div class="flex items-center gap-3">
            <Building class="w-6 h-6" />
            <div>
              <p class="text-sm opacity-90">Total Ruangan</p>
              <p class="text-2xl font-bold">{{ ruanganStats?.total || 0 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="inline-flex items-center gap-3 text-gray-600">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span class="text-lg font-medium">Memuat data dashboard...</span>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-8">
      <!-- User Statistics Section -->
      <section class="space-y-4">
        <div class="flex items-center gap-3 mb-6">
          <div class="bg-blue-100 p-2 rounded-lg">
            <Users class="w-6 h-6 text-blue-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Statistik Pengguna</h2>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <UiInfoBox type="mahasiswa" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <GraduationCap class="w-4 h-4 text-primary" />
                Total Mahasiswa
              </span>
            </template>
            <span class="text-2xl font-bold text-primary">{{ userStats?.mahasiswa || 0 }}</span>
          </UiInfoBox>

          <UiInfoBox type="dosen" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <User class="w-4 h-4 text-blue-600" />
                Total Dosen
              </span>
            </template>
            <span class="text-2xl font-bold text-blue-600">{{ userStats?.dosen || 0 }}</span>
          </UiInfoBox>

          <UiInfoBox type="pengelola" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <ShieldCheck class="w-4 h-4 text-yellow-600" />
                Total Pengelola
              </span>
            </template>
            <span class="text-2xl font-bold text-yellow-600">{{ userStats?.pengelola || 0 }}</span>
          </UiInfoBox>

          <UiInfoBox type="active" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <UserCheck class="w-4 h-4 text-green-600" />
                Pengguna Aktif
              </span>
            </template>
            <span class="text-2xl font-bold text-green-600">{{ userStats?.aktif || 0 }}</span>
          </UiInfoBox>

          <UiInfoBox type="blocked" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <UserX class="w-4 h-4 text-red-600" />
                Pengguna Terblokir
              </span>
            </template>
            <span class="text-2xl font-bold text-red-600">{{ userStats?.blokir || 0 }}</span>
          </UiInfoBox>
        </div>
      </section>

      <!-- Equipment Statistics Section -->
      <section class="space-y-4">
        <div class="flex items-center gap-3 mb-6">
          <div class="bg-green-100 p-2 rounded-lg">
            <Package class="w-6 h-6 text-green-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Statistik Barang & Alat</h2>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <UiInfoBox type="total" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <Package class="w-4 h-4 text-primary" />
                Total Barang
              </span>
            </template>
            <span class="text-2xl font-bold text-primary">{{ barangStats?.total || 0 }}</span>
          </UiInfoBox>

          <UiInfoBox type="tersedia" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <CheckCircle class="w-4 h-4 text-green-600" />
                Tersedia
              </span>
            </template>
            <span class="text-2xl font-bold text-green-600">{{ barangStats?.tersedia || 0 }}</span>
          </UiInfoBox>

          <UiInfoBox type="dipinjam" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <Clock class="w-4 h-4 text-yellow-600" />
                Dipinjam
              </span>
            </template>
            <span class="text-2xl font-bold text-yellow-600">{{ barangStats?.dipinjam || 0 }}</span>
          </UiInfoBox>

          <UiInfoBox type="rusak" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <Wrench class="w-4 h-4 text-red-600" />
                Rusak
              </span>
            </template>
            <span class="text-2xl font-bold text-red-600">{{ barangStats?.rusak || 0 }}</span>
          </UiInfoBox>

          <UiInfoBox type="tidak-tersedia" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <XCircle class="w-4 h-4 text-gray-600" />
                Tidak Tersedia
              </span>
            </template>
            <span class="text-2xl font-bold text-gray-600">{{ barangStats?.tidak_tersedia || 0 }}</span>
          </UiInfoBox>
        </div>
      </section>

      <!-- Room Statistics Section -->
      <section class="space-y-4">
        <div class="flex items-center gap-3 mb-6">
          <div class="bg-purple-100 p-2 rounded-lg">
            <Building class="w-6 h-6 text-purple-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Statistik Ruangan</h2>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <UiInfoBox type="total" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <Building class="w-4 h-4 text-primary" />
                Total Ruangan
              </span>
            </template>
            <span class="text-2xl font-bold text-primary">{{ ruanganStats?.total || 0 }}</span>
          </UiInfoBox>

          <UiInfoBox type="tersedia" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <CheckCircle class="w-4 h-4 text-green-600" />
                Ruangan Tersedia
              </span>
            </template>
            <span class="text-2xl font-bold text-green-600">{{ ruanganStats?.tersedia || 0 }}</span>
          </UiInfoBox>

          <UiInfoBox type="dipinjam" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <Clock class="w-4 h-4 text-yellow-600" />
                Ruangan Dipinjam
              </span>
            </template>
            <span class="text-2xl font-bold text-yellow-600">{{ ruanganStats?.dipinjam || 0 }}</span>
          </UiInfoBox>

          <UiInfoBox type="tidak-tersedia" class="hover:scale-105 transition-transform duration-200">
            <template #title>
              <span class="flex items-center gap-2">
                <XCircle class="w-4 h-4 text-gray-600" />
                Ruangan Tidak Tersedia
              </span>
            </template>
            <span class="text-2xl font-bold text-gray-600">{{ ruanganStats?.tidak_tersedia || 0 }}</span>
          </UiInfoBox>
        </div>
      </section>

    </div>
  </div>
</template>
