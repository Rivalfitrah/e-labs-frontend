<script setup>
import { ref, onMounted } from 'vue'
import { getListPengajuanRuanganTerjadwal } from '~/lib/api/peminjaman/terjadwal/peminjamanRuangan'
import { listRuangan } from '~/lib/api/ruangan'
import { Clock, User, FileText } from 'lucide-vue-next'

const peminjamanList = ref([])
const ruanganList = ref([])
const isLoading = ref(true)

// Ambil 5 peminjaman terbaru
const latestPeminjaman = ref([])

// Function untuk mendapatkan nama ruangan berdasarkan ID
const getRuanganName = (ruanganId) => {
  const ruangan = ruanganList.value.find(r => r.id === ruanganId)
  return ruangan?.nama_ruangan || ruangan?.nama || `Ruangan ID: ${ruanganId}`
}

const getStatusColor = (status) => {
  const colors = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'disetujui': 'bg-green-100 text-green-800 border-green-300',
    'ditolak': 'bg-red-100 text-red-800 border-red-300',
    'selesai': 'bg-blue-100 text-blue-800 border-blue-300'
  }
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300'
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(async () => {
  try {
    // Fetch data peminjaman dan ruangan secara parallel
    const [peminjamanResponse, ruanganResponse] = await Promise.all([
      getListPengajuanRuanganTerjadwal(),
      listRuangan()
    ])
    
    // Set data peminjaman
    const data = peminjamanResponse?.data || []
    peminjamanList.value = Array.isArray(data) ? data : []
    
    // Set data ruangan
    const ruanganData = Array.isArray(ruanganResponse) ? ruanganResponse : (ruanganResponse?.data || [])
    ruanganList.value = ruanganData
    
    
    // Ambil 5 peminjaman terbaru
    latestPeminjaman.value = peminjamanList.value
      .sort((a, b) => new Date(b.createdAt || b.tanggal) - new Date(a.createdAt || a.tanggal))
      .slice(0, 5)
      
  } catch (error) {
    console.error('Error fetching peminjaman:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
    <!-- Card Kiri: Detail Peminjaman Terbaru -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock class="w-5 h-5 text-primary" />
        Peminjaman Terbaru
      </h2>
      
      <div v-if="!isLoading" class="space-y-3">
        <div 
          v-if="latestPeminjaman.length === 0"
          class="text-center py-8 text-gray-500"
        >
          Belum ada peminjaman
        </div>
        
        <div 
          v-for="(item, index) in latestPeminjaman" 
          :key="index"
          class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <User class="w-4 h-4 text-gray-500" />
                <p class="font-semibold text-gray-800">
                  {{ item.user?.nama || 'Tidak diketahui' }}
                </p>
              </div>
              <div class="flex items-center gap-2 mb-1">
                <FileText class="w-4 h-4 text-gray-500" />
                <p class="text-sm text-gray-600">
                  {{ getRuanganName(item.ruangan_id) }}
                </p>
              </div>
              <p class="text-xs text-gray-500">
                {{ formatDate(item.tanggal) }} • {{ item.kegiatan || 'Tidak ada keterangan' }}
              </p>
            </div>
            <span 
              class="px-3 py-1 rounded-full text-xs font-semibold border"
              :class="getStatusColor(item.status)"
            >
              {{ item.status || 'Pending' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="space-y-3">
        <div v-for="i in 5" :key="i" class="p-4 border border-gray-200 rounded-lg animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
</template>