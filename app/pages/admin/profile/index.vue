<script setup>
definePageMeta({
  layout: 'dashboard'
})

</script>

<template>
    <h1 class="text-2xl font-semibold mb-4">Profil Admin</h1>

    <div class="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
    <!-- Foto Profil -->
    <div class="relative">
        <div class="w-32 h-32 rounded-full overflow-hidden ring-4 ring-utama/20 shadow-md">
        <img src="/logo.jpg" alt="Profil Admin" class="w-full h-full object-cover">
        </div>
        <!-- Tombol edit foto (opsional) -->
        <button class="absolute bottom-2 right-2 bg-utama text-white p-2 rounded-full shadow hover:bg-utama/80 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-.828.515L7 15l1.657-3.999a2 2 0 01.343-.514z" />
        </svg>
        </button>
    </div>

    <!-- Informasi Profil -->
    <div class="flex-1">
        <h2 class="text-2xl font-semibold text-gray-800 mb-1">Nama: Nama Admin</h2>
        <p class="text-gray-600 mb-2"> Email: admin@example.com</p>

        <!-- Badge Role -->
        <span class="inline-block bg-utama/10 text-utama text-sm font-medium px-3 py-1 rounded-full">
        Role: Admin
        </span>
    </div>
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-8 mt-6">
    <h3 class="text-xl font-semibold mb-4">Ganti Password</h3>

    <form class="space-y-4">
        <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
        <input type="password" class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-utama focus:border-utama" placeholder="Masukkan password lama">
        </div>

        <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
        <input type="password" class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-utama focus:border-utama" placeholder="Masukkan password baru">
        </div>

        <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
        <input type="password" class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-utama focus:border-utama" placeholder="Konfirmasi password baru">
        </div>

        <button type="submit" class="mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-md shadow hover:bg-utama/80 transition">
        Simpan Perubahan
        </button>
    </form>
    </div>



</template>