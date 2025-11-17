<script setup>
  import { Calendar, CircleCheck, Clock } from "lucide-vue-next";

</script>

<template>
        <section class="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto w-full py-20">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cara Menggunakan <span class="text-green-600">e-Labs+</span>
          </h2>
          <p class="text-gray-600 text-lg max-w-2xl mx-auto">
            Hanya 3 langkah mudah untuk meminjam ruangan atau barang laboratorium
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <!-- Step 1 -->
          <div class="relative">
            <div class="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-green-500 h-full">
              <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-xl">
                1
              </div>
              <div class="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mb-6 mt-8 mx-auto">
                <Clock class="w-10 h-10 text-green-600" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4 text-center">Pilih dan Tentukan Jam</h3>
              <p class="text-gray-600 text-center leading-relaxed">
                Pilih tipe peminjaman (Lab/Barang), tentukan apakah terjadwal atau tidak, lalu pilih waktu yang Anda butuhkan.
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="relative">
            <div class="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500 h-full">
              <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-xl">
                2
              </div>
              <div class="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mb-6 mt-8 mx-auto">
                <Calendar class="w-10 h-10 text-blue-600" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4 text-center">Isi Formulir</h3>
              <p class="text-gray-600 text-center leading-relaxed">
                Untuk peminjaman tidak terjadwal, lengkapi data seperti keperluan dan penanggung jawab. Peminjaman terjadwal tidak perlu form.
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="relative">
            <div class="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-purple-500 h-full">
              <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-xl">
                3
              </div>
              <div class="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mb-6 mt-8 mx-auto">
                <CircleCheck class="w-10 h-10 text-purple-600" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4 text-center">Peminjaman Selesai</h3>
              <p class="text-gray-600 text-center leading-relaxed">
                Mahasiswa dapat menyerahkan KTM kepada pengelola untuk proses selanjutnya dan mulai menggunakan fasilitas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>