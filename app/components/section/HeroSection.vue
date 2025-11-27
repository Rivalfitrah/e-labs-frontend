<script>

</script>

<template>
        <section class="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100 opacity-70"></div>
      <div class="max-w-7xl mx-auto text-center relative z-10 py-20">
        <div class="inline-block mb-4 px-6 py-2 bg-green-100 rounded-full text-green-700 font-semibold text-sm">
          🎓 Sekolah Vokasi IPB
        </div>
        <h1 class="text-6xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800 mb-6">
          e-Labs+
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 mb-4 font-medium">Electronic Labs & Assets Borrowing System</p>
        <p class="max-w-3xl mx-auto text-gray-600 mb-12 text-lg leading-relaxed">
          Sistem informasi peminjaman alat dan ruang laboratorium komputer yang modern, cepat, dan terintegrasi untuk kemudahan Anda.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
          <NuxtLink to="/ruangan" class="w-full sm:w-auto">
            <button class="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Pinjam Ruangan
            </button>
          </NuxtLink>
          
          <NuxtLink to="/pinjam-barang" class="w-full sm:w-auto">
            <button class="group w-full sm:w-auto px-10 py-4 bg-white text-green-600 border-2 border-green-600 text-lg font-bold rounded-xl shadow-lg hover:bg-green-50 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Pinjam Barang
            </button>
          </NuxtLink>
        </div>
      </div>
    </section>
</template>