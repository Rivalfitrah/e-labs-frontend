<template>
  <div class="bg-gradient-to-b from-white to-gray-50 min-h-screen font-sans">
    <TheNavbar />

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 opacity-60"></div>
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

    <!-- Why e-Labs+ Section -->
    <section class="min-h-screen flex items-center justify-center px-4 bg-white">
      <div class="max-w-7xl mx-auto w-full py-20">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mengapa Menggunakan <span class="text-green-600">e-Labs+</span>?
          </h2>
          <p class="text-gray-600 text-lg max-w-2xl mx-auto">
            Platform terpercaya yang memudahkan proses peminjaman dengan teknologi modern
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-500 hover:-translate-y-2">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Cek Ketersediaan Real-time</h3>
            <p class="text-gray-600 leading-relaxed">
              Lihat ketersediaan alat dan ruang lab secara langsung. Tidak perlu lagi khawatir benturan jadwal atau datang ke lab hanya untuk bertanya.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-500 hover:-translate-y-2">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Proses Digital & Transparan</h3>
            <p class="text-gray-600 leading-relaxed">
              Ganti formulir kertas manual dengan form digital yang cepat dan praktis. Proses peminjaman jadi lebih mudah dan tercatat.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-500 hover:-translate-y-2">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Notifikasi & Riwayat</h3>
            <p class="text-gray-600 leading-relaxed">
              Dapatkan notifikasi pengingat untuk jadwal pemakaian atau pengembalian. Kamu juga bisa melihat semua riwayat peminjaman.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How to Use Section -->
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

    <!-- Building Section -->
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

    <!-- Schedule Section -->
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

    <!-- Footer -->
    <footer class="bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-4 gap-12 mb-12">
          <!-- Brand -->
          <div class="md:col-span-2">
            <h3 class="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              e-Labs+
            </h3>
            <p class="text-gray-400 leading-relaxed mb-6">
              Sistem informasi peminjaman alat dan ruang laboratorium komputer Sekolah Vokasi IPB. Memudahkan proses peminjaman dengan teknologi digital yang modern dan terintegrasi.
            </p>
            <div class="flex gap-4">
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L7.94 13.98l-2.97-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-lg font-bold mb-4">Link Cepat</h4>
            <ul class="space-y-3">
              <li><a href="#" class="text-gray-400 hover:text-green-400 transition-colors duration-300">Beranda</a></li>
              <li><a href="/ruangan" class="text-gray-400 hover:text-green-400 transition-colors duration-300">Pinjam Ruangan</a></li>
              <li><a href="/pinjam-barang" class="text-gray-400 hover:text-green-400 transition-colors duration-300">Pinjam Barang</a></li>
              <li><a href="/terpinjam" class="text-gray-400 hover:text-green-400 transition-colors duration-300">Riwayat</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-lg font-bold mb-4">Kontak</h4>
            <ul class="space-y-3 text-gray-400">
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Sekolah Vokasi IPB<br/>Bogor, Jawa Barat</span>
              </li>
              <li class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>elabs@apps.ipb.ac.id</span>
              </li>
              <li class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(0251) 8629942</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2024 e-Labs+ | Sekolah Vokasi IPB. All rights reserved.
          </p>
          <div class="flex gap-6 text-sm">
            <a href="#" class="text-gray-400 hover:text-green-400 transition-colors duration-300">Kebijakan Privasi</a>
            <a href="#" class="text-gray-400 hover:text-green-400 transition-colors duration-300">Syarat & Ketentuan</a>
            <a href="#" class="text-gray-400 hover:text-green-400 transition-colors duration-300">Bantuan</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Form Modal (if visible) -->
    <BorrowForm
      v-if="isFormVisible"
      @cancel="hideForm"
      @submit="handleFormSubmit"
    />
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import TheNavbar from '@/components/landing/TheNavbar.vue';
import BorrowForm from '@/components/landing/BorrowForm.vue';
import { Calendar, CircleCheck, Clock } from 'lucide-vue-next';

const isFormVisible = ref(false); 

onMounted(() => {
  const dataJSON = sessionStorage.getItem('eLabsBorrowData');
  if (dataJSON) {
    isFormVisible.value = true;
  }

  // Smooth scroll untuk navigasi
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
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

<style scoped>
/* Smooth animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

section {
  animation: fadeIn 0.6s ease-out;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #16a34a;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #15803d;
}
</style>