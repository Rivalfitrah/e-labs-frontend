<script setup>

</script>

<template>
        <section class="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto w-full py-20">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jadwal <span class="text-green-600">Laboratorium</span>
          </h2>
          <p class="text-gray-600 text-lg max-w-2xl mx-auto">
            Lihat jadwal penggunaan laboratorium untuk merencanakan peminjaman Anda
          </p>
        </div>

        <div class="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div class="flex flex-col md:flex-row items-center justify-between mb-8">
            <div class="flex items-center gap-4 mb-4 md:mb-0">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Jadwal Terkini</h3>
                <p class="text-gray-600">Update jadwal laboratorium</p>
              </div>
            </div>
            <button class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Jadwal (PDF)
            </button>
          </div>

          <div class="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-green-500 transition-colors duration-300 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-600 text-lg mb-2">Belum ada jadwal yang diupload</p>
            <p class="text-gray-500 text-sm">Upload file PDF jadwal laboratorium di sini</p>
          </div>

          <div class="mt-8 grid md:grid-cols-3 gap-6">
            <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="font-semibold text-gray-900">Tersedia</span>
              </div>
              <p class="text-gray-600 text-sm">Ruangan siap digunakan</p>
            </div>
            <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="font-semibold text-gray-900">Sedang Digunakan</span>
              </div>
              <p class="text-gray-600 text-sm">Ruangan dalam peminjaman</p>
            </div>
            <div class="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="font-semibold text-gray-900">Tidak Tersedia</span>
              </div>
              <p class="text-gray-600 text-sm">Ruangan sedang maintenance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>