<script setup>
  import { CircleUserRound, LogOut, UserCircle } from "lucide-vue-next";
  import { ref, onMounted, computed } from "vue";
  import { useRouter } from "vue-router";
  import { Logout, getProfile } from "~/lib/api/auth";
  import { storage_URL } from "~/lib/base.js"; // Pastikan import base URL jika nanti butuh
  import Swal from "sweetalert2";
  import { onClickOutside } from '@vueuse/core'

  const isOpen = ref(false);
  const toggleDropdown = () => (isOpen.value = !isOpen.value);

  const router = useRouter();
  const dropdownRef = ref(null);
  const user = ref(null);

  onMounted(async () => {
    try {
      const profileData = await getProfile();
      user.value = profileData;
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  });

  // --- LOGIKA GAMBAR PROFIL OTOMATIS ---
  const userAvatar = computed(() => {
    // 1. Ambil nama dari data user
    const name = user.value?.data?.nama || "Guest";

    // 2. Cek jika backend punya foto (Optional, jaga-jaga jika nanti backend update)
    const backendPhoto = user.value?.data?.profil || user.value?.data?.foto_profile;
    
    if (backendPhoto && backendPhoto !== 'null' && backendPhoto !== '') {
       if (backendPhoto.startsWith('http')) return backendPhoto;
       return `${storage_URL}/uploads/${backendPhoto}`;
    }

    // 3. Generate Avatar berdasarkan Nama (UI Avatars)
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true`;
  });

  const goToProfile = () => {
    router.push('/admin/profile')
  }

  onClickOutside(dropdownRef, () => {
    isOpen.value = false;
  });

  const handleLogout = async () => {
    try {
      // Hapus Logout() disini agar tidak logout duluan sebelum konfirmasi
      
      Swal.fire({
        icon: 'warning',
        title: 'Apakah Anda Ingin Keluar?',
        text: 'Sesi Anda akan diakhiri.',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Keluar',
        cancelButtonText: 'Batal'
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Proses logout dilakukan SETELAH dikonfirmasi
          await Logout(); 
          
          Swal.fire({
             icon: 'success', 
             title: 'Berhasil Keluar!', 
             showConfirmButton: false, 
             timer: 1500 
          });
          
          router.push('/auth/login');
        }
      })
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <div
      class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition"
      @click="toggleDropdown"
    >
      <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
        <img 
          :src="userAvatar" 
          alt="User Profile" 
          class="w-full h-full object-cover"
        />
      </div>

      <div class="flex flex-col">
        <span class="hidden sm:inline text-gray-700 font-medium pr-5 truncate max-w-[150px]">
          {{ user?.data?.nama || "Guest" }}
        </span>
        <p class="text-xs text-gray-500 truncate max-w-[150px] hidden sm:block">
          {{ user?.data?.email || "" }}
        </p>
      </div>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-50 origin-top-right"
      >
        <div class="px-4 py-3 border-b border-gray-100 sm:hidden">
           <p class="text-sm font-medium text-gray-900 truncate">{{ user?.data?.nama }}</p>
           <p class="text-xs text-gray-500 truncate">{{ user?.data?.email }}</p>
        </div>

        <ul class="py-1 text-gray-700">
          <li>
            <button
              class="w-full flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              @click="goToProfile"
            >
              <UserCircle :size="18" class="mr-3 text-gray-500" />
              <span>Profil Saya</span>
            </button>
          </li>

          <li>
            <button
              class="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              @click="handleLogout"
            >
              <LogOut :size="18" class="mr-3" />
              <span>Keluar</span>
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>