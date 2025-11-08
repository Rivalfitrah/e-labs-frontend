<template>
  <div class="bg-[#F6FBF6] min-h-screen font-sans">
    <TheNavbar />

    <main class="text-center pt-16 pb-24">
      <h1 class="text-7xl font-bold text-green-600">e-Labs+</h1>
      <p class="mt-2 text-lg text-gray-600">Electronic Labs & Assets Borrowing System</p>
      <div v-if="!isFormVisible" class="mt-16 w-full max-w-4xl mx-auto px-4">
        <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
        <NuxtLink to="/ruangan" class="w-full sm:w-64">
          <button 
            class="w-full px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 transform hover:-translate-y-1"
          >
            Pinjam Ruangan
          </button>
        </NuxtLink>
        
        <NuxtLink to="/pinjam-barang" class="w-full sm:w-64">
          <button 
            class="w-full sm:w-64 px-8 py-4 bg-white text-green-600 border-2 border-green-600 text-lg font-bold rounded-lg shadow-lg hover:bg-green-50 transition duration-300 transform hover:-translate-y-1"
          >
            Pinjam Barang
          </button>
        </NuxtLink>
        </div>

        <!-- BAGIAN FITUR (TETAP SAMA) -->
        <div class="mt-24 text-left">
          <h2 class="text-3xl font-bold text-gray-800 text-center mb-10">
            Mengapa Menggunakan e-Labs+?
          </h2>
          <div class="grid md:grid-cols-3 gap-8">
            <!-- Fitur 1: Cek Real-time -->
            <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
              <h3 class="text-xl font-bold text-gray-900 mb-3">Cek Ketersediaan Real-time</h3>
              <p class="text-gray-600">
                Lihat ketersediaan alat dan ruang lab secara langsung. Tidak perlu lagi khawatir benturan jadwal atau datang ke lab hanya untuk bertanya.
              </p>
            </div>
            <!-- Fitur 2: Proses Cepat -->
            <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
              <h3 class="text-xl font-bold text-gray-900 mb-3">Proses Digital & Transparan</h3>
              <p class="text-gray-600">
                Ganti formulir kertas manual dengan form digital yang cepat dan praktis. Proses peminjaman jadi lebih mudah dan tercatat.
              </p>
            </div>
            <!-- Fitur 3: Notifikasi & Riwayat -->
            <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
              <h3 class="text-xl font-bold text-gray-900 mb-3">Notifikasi & Riwayat</h3>
              <p class="text-gray-600">
                Dapatkan notifikasi pengingat untuk jadwal pemakaian atau pengembalian. Kamu juga bisa melihat semua riwayat peminjaman alat atau ruang.
              </p>
            </div>
          </div>
        </div>

        <!-- Deskripsi (TETAP SAMA) -->
        <p class="max-w-2xl mx-auto mt-20 text-gray-600">
          Sistem informasi peminjaman alat dan ruang laboratorium komputer di Sekolah Vokasi IPB. Dengan E-LABS+, proses peminjaman jadi lebih cepat, transparan, dan terintegrasi.
        </p>
      </div>
      <!-- AKHIR TAMPILAN AWAL -->

      <BorrowForm
        v-if="isFormVisible"
        @cancel="hideForm"
        @submit="handleFormSubmit"
      />
      <!-- AKHIR BAGIAN YANG DIUBAH -->
      
    </main>
  </div>
</template>


<script setup>

import { ref, onMounted } from 'vue';

import BorrowForm from '@/components/landing/BorrowForm.vue';
const isFormVisible = ref(false); 

onMounted(() => {
  const dataJSON = sessionStorage.getItem('eLabsBorrowData');
  if (dataJSON) {
    isFormVisible.value = true;
  }
});


const showForm = () => {
  isFormVisible.value = true;
};

const hideForm = () => {
  isFormVisible.value = false;
};

const handleFormSubmit = (formData) => {
  console.log('Form berhasil disubmit! Data diterima di index.vue:', formData);
  
  // Di sini kamu bisa kirim 'formData' ke API...
  
  // Setelah submit, sembunyikan form
  isFormVisible.value = false;
};



</script>

<style>
/* Style global tetap di sini */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
body {
  font-family: 'Poppins', sans-serif;
}
</style>