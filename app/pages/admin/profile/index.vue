<script setup>
  import { Calendar, Clock, Shield } from "lucide-vue-next";
  import UbahPassword from "~/components/ui/UbahPassword.vue";
  import { ref, onMounted, computed } from "vue";
  // Pastikan path import ini sesuai dengan lokasi file base.js Anda
  import { storage_URL } from "~/lib/base.js"; 

  definePageMeta({
    layout: "dashboard",
    middleware: "middleware",
  });

  const user = ref(null);
  const lastLogin = ref("-");


onMounted(() => {
  // Ambil data user
  const dataUser = localStorage.getItem("user");
  if (dataUser) {
    try {
      user.value = JSON.parse(dataUser);
    } catch (e) {
      console.error("Gagal parsing data user", e);
    }
  }

  // Ambil last login
  const last = localStorage.getItem("last_login");
  if (last) {
    lastLogin.value = last;
  }
});


  // --- LOGIKA GAMBAR PROFIL OTOMATIS ---
  const userAvatar = computed(() => {
    // 1. Ambil nama (Default 'Admin' jika null)
    const name = user.value?.nama || "Admin";

    // 2. Cek foto dari backend (profil / foto_profile)
    // Sesuaikan field dengan apa yang disimpan di localStorage
    const backendPhoto = user.value?.profil || user.value?.foto_profile;

    if (backendPhoto && backendPhoto !== 'null' && backendPhoto !== '') {
       // Jika URL lengkap (misal login google)
       if (backendPhoto.startsWith('http')) return backendPhoto;
       // Jika path file backend
       return `${storage_URL}/uploads/${backendPhoto}`;
    }

    // 3. Generate Avatar (UI Avatars)
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true`;
  });
</script>

<template>
  <h1 class="text-2xl font-semibold mb-4">Profil Admin</h1>

  <div
    class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start gap-10 border border-gray-100"
  >
    <div class="relative flex flex-col items-center text-center md:text-left md:items-start">
      <div
        class="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-utama/30 shadow-md transition-transform group-hover:scale-105"
      >
        <img
          :src="userAvatar"
          alt="Profil Admin"
          class="w-full h-full object-cover"
        />
      </div>

      <span
        class="mt-4 inline-flex items-center gap-2 bg-utama/10 text-utama px-3 py-1 rounded-full text-sm font-medium shadow-sm"
      >
        <Shield class="w-4 h-4"/>
        {{ user?.role?.nama_role || user?.roles || "Admin" }}
      </span>
    </div>

    <div class="flex-1 w-full">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div class="space-y-3 w-full">
          <div class="flex items-center gap-4">
            <div class="w-32 sm:w-36 text-gray-500 font-medium">Nama</div>
            <div class="text-gray-800 font-semibold">{{ user?.nama || "Nama Admin" }}</div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-32 sm:w-36 text-gray-500 font-medium">Email</div>
            <div class="text-gray-800 break-words">{{ user?.email || "admin@example.com" }}</div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-32 sm:w-36 text-gray-500 font-medium">NIM / NIP</div>
            <div class="text-gray-800 font-semibold">{{ user?.NIM || user?.NIP || '-' }}</div>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 my-4"></div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
        <div
          class="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <Calendar class="w-4 h-4 text-utama"/>
            <span class="text-gray-500">Tanggal Bergabung</span>
          </div>
          <p class="font-semibold text-gray-800">
            {{ user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-' }}
          </p>
        </div>
        <div
          class="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <Clock class="w-4 h-4 text-utama"/>
            <span class="text-gray-500">Terakhir Login</span>
          </div>
          <p class="font-semibold text-gray-800">{{ lastLogin }}</p>
        </div>
      </div>
    </div>
  </div>

  <UbahPassword />

</template>