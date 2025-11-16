<script setup>
import { ref, onMounted, computed } from 'vue'
import { dashboardUser, listUser } from '~/lib/api/pengguna'
import { getDashboardBarang, listBarang } from '~/lib/api/barang'
import { getDashboardRuangan, listRuangan } from '~/lib/api/ruangan'
import { getListPengajuanRuanganTerjadwal } from '~/lib/api/peminjaman/terjadwal/peminjamanRuangan'

const penggunaStats = ref({
  total: 0
})

const barangStats = ref({
  total: 0
})

const ruanganStats = ref({
  total: 0
})

const peminjamanStats = ref({
  total: 0
})

const isLoading = ref(true)

onMounted(async () => {
  try {
    // Fetch stats pengguna
    try {
      const userResponse = await dashboardUser()
      console.log('User Response:', userResponse)
      
      if (userResponse?.data) {
        const userData = userResponse.data
        // Hitung total dari semua jenis pengguna
        penggunaStats.value.total = 
          (userData.totalMahasiswa || 0) + 
          (userData.totalDosen || 0) + 
          (userData.totalPengelola || 0) +
          (userData.totalSuperadmin || 0)
        
        // Fallback jika ada field total langsung
        if (penggunaStats.value.total === 0 && userData.total) {
          penggunaStats.value.total = userData.total
        }
      }
    } catch (error) {
      console.warn('Dashboard user endpoint error, using list fallback:', error.response?.status)
      // Fallback: hitung dari list users
      try {
        const users = await listUser()
        const userArray = Array.isArray(users) ? users : (users?.data || [])
        penggunaStats.value.total = userArray.length
      } catch (listError) {
        console.error('Error fetching user list:', listError)
      }
    }

    // Fetch stats barang
    try {
      const barangResponse = await getDashboardBarang()
      console.log('Barang Response:', barangResponse)
      
      if (barangResponse?.data?.overview) {
        barangStats.value.total = barangResponse.data.overview.total || 0
      } else if (barangResponse?.data) {
        barangStats.value.total = barangResponse.data.total || 0
      } else if (barangResponse?.overview) {
        barangStats.value.total = barangResponse.overview.total || 0
      }
    } catch (error) {
      console.warn('Dashboard barang endpoint error, using list fallback:', error.response?.status)
      // Fallback: hitung dari list barang
      try {
        const barang = await listBarang()
        const barangArray = Array.isArray(barang) ? barang : (barang?.data || [])
        barangStats.value.total = barangArray.length
      } catch (listError) {
        console.error('Error fetching barang list:', listError)
      }
    }

    // Fetch stats ruangan
    try {
      const ruanganResponse = await getDashboardRuangan()
      console.log('Ruangan Response:', ruanganResponse)
      
      if (ruanganResponse?.data?.overview) {
        ruanganStats.value.total = ruanganResponse.data.overview.total || 0
      } else if (ruanganResponse?.data) {
        ruanganStats.value.total = ruanganResponse.data.total || 0
      } else if (ruanganResponse?.overview) {
        ruanganStats.value.total = ruanganResponse.overview.total || 0
      }
    } catch (error) {
      console.warn('Dashboard ruangan endpoint error (400), using list fallback:', error.response?.status)
      // Fallback: hitung dari list ruangan
      try {
        const ruangan = await listRuangan()
        const ruanganArray = Array.isArray(ruangan) ? ruangan : (ruangan?.data || [])
        ruanganStats.value.total = ruanganArray.length
      } catch (listError) {
        console.error('Error fetching ruangan list:', listError)
      }
    }

    // Fetch stats peminjaman
    try {
      const peminjamanResponse = await getListPengajuanRuanganTerjadwal()
      console.log('Peminjaman Response:', peminjamanResponse)
      
      if (peminjamanResponse?.data && Array.isArray(peminjamanResponse.data)) {
        peminjamanStats.value.total = peminjamanResponse.data.length
      } else if (Array.isArray(peminjamanResponse)) {
        peminjamanStats.value.total = peminjamanResponse.length
      }
    } catch (error) {
      console.warn('Error fetching peminjaman:', error.response?.status)
    }

    console.log('Final Stats:', {
      pengguna: penggunaStats.value.total,
      barang: barangStats.value.total,
      ruangan: ruanganStats.value.total,
      peminjaman: peminjamanStats.value.total
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="!isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Pengguna -->
    <UiInfoBox type="mahasiswa">
      <template #title>Total Pengguna</template>
      {{ penggunaStats.total }}
    </UiInfoBox>

    <!-- Total Barang -->
    <UiInfoBox type="total">
      <template #title>Total Barang</template>
      {{ barangStats.total }}
    </UiInfoBox>

    <!-- Total Ruangan -->
    <UiInfoBox type="tersedia">
      <template #title>Total Ruangan</template>
      {{ ruanganStats.total }}
    </UiInfoBox>

    <!-- Total Peminjaman -->
    <UiInfoBox type="dipinjam">
      <template #title>Total Peminjaman</template>
      {{ peminjamanStats.total }}
    </UiInfoBox>
  </div>

  <!-- Loading State -->
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div v-for="i in 4" :key="i" class="bg-white p-6 rounded-xl shadow animate-pulse">
      <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div class="h-10 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
</template>