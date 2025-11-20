<script setup>
  import { Calendar, Clock, Shield } from "lucide-vue-next";
  import UbahPassword from "~/components/ui/UbahPassword.vue";
import { ref } from "vue";
  import { onMounted } from "vue";
  definePageMeta({
    layout: "dashboard",
    middleware: "middleware",
  });

  const user = ref(null);

  onMounted(() => {
    const dataUser = localStorage.getItem("user");
    if (dataUser) {
      user.value = JSON.parse(dataUser);
    }
  });
</script>

<template>
  <h1 class="text-2xl font-semibold mb-4">Profil Admin</h1>

<div
  class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start gap-10 border border-gray-100"
>
  <!-- Foto Profil -->
  <div class="relative flex flex-col items-center text-center md:text-left md:items-start">
    <div
      class="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-utama/30 shadow-md transition-transform group-hover:scale-105"
    >
      <img
        src="/logo.jpg"
        alt="Profil Admin"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Badge Role -->
    <span
      class="mt-4 inline-flex items-center gap-2 bg-utama/10 text-utama px-3 py-1 rounded-full text-sm font-medium shadow-sm"
    >
      <Shield class="w-4 h-4"/>
      {{ user?.roles || "Admin" }}
    </span>
  </div>

  <!-- Informasi Profil -->
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
        <p class="font-semibold text-gray-800">{{ new Date(user?.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) }}</p>
      </div>
      <div
        class="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <Clock class="w-4 h-4 text-utama"/>
          <span class="text-gray-500">Terakhir Login</span>
        </div>
        <p class="font-semibold text-gray-800">09 November 2025</p>
      </div>
    </div>
  </div>
</div>

<UbahPassword />


</template>
