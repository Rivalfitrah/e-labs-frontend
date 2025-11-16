<script setup>
import { UserCircle2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { getProfile } from '~/lib/api/auth';

const user = ref(null);

  onMounted(async () => {
    try {
      const profileData = await getProfile();
      user.value = profileData;
      console.log("Fetched profile data:", profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  });


</script>

<template>
  <div>
<div class="w-full bg-linear-to-r from-green-700 to-green-500 h-52 rounded-b-3xl shadow-lg relative overflow-hidden">
  <div class="h-full flex items-center justify-between px-8">

    <!-- Text Section -->
    <div class="flex flex-col gap-2 z-10">
      <h1 class="text-white text-3xl font-bold drop-shadow">
        Selamat Datang,
        <span class="text-white/90" id="typing-text">{{ user?.data?.nama }}</span>
      </h1>

      <span class="text-white/90">{{ user?.data?.email }} | {{ user?.data?.role.nama_role }}</span>

      <p class="text-green-50/90 text-lg max-w-md leading-relaxed">
        Mengelola data dan aktivitas eLabs kini lebih mudah.
      </p>
    </div>

  </div>
</div>


  </div>
</template>

