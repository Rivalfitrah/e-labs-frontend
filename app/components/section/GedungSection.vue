<script setup>

</script>

<template>
        <section class="min-h-screen flex items-center justify-center px-4 bg-white">
      <div class="max-w-7xl mx-auto w-full py-20">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gedung <span class="text-green-600">Laboratorium</span>
          </h2>
          <p class="text-gray-600 text-lg max-w-2xl mx-auto">
            Fasilitas laboratorium modern untuk mendukung pembelajaran Anda
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-10">
          <!-- Gedung CA -->
          <div class="group bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-500">
            <div class="h-64 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center relative overflow-hidden">
              <div class="absolute inset-0 bg-black opacity-10"></div>
              <img src="/gedung-ca.png" alt="gedung CA" class="w-full  h-full">

            </div>
            <div class="p-8">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-3xl font-bold text-gray-900">Gedung CA</h3>
                <span class="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Aktif</span>
              </div>
              <p class="text-gray-600 leading-relaxed mb-6">
                Gedung Laboratorium CA dilengkapi dengan fasilitas komputer terkini, ruang praktikum yang nyaman, dan peralatan pendukung pembelajaran yang lengkap.
              </p>
            </div>
          </div>

          <!-- Gedung CB -->
          <div class="group bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-500">
            <div class="h-64 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative overflow-hidden">
              <div class="absolute inset-0 bg-black opacity-10"></div>
              <img src="/gedung-cb.png" alt="gedung CB" class="w-full h-full">
            </div>
            <div class="p-8">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-3xl font-bold text-gray-900">Gedung CB</h3>
                <span class="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Aktif</span>
              </div>
              <p class="text-gray-600 leading-relaxed mb-6">
                Gedung Laboratorium CB menawarkan ruang praktikum yang luas, peralatan multimedia, dan suasana belajar yang kondusif untuk berbagai kegiatan akademik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>