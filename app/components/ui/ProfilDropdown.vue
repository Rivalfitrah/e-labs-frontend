<script setup>
  import { CircleUserRound, LogOut, UserCircle } from "lucide-vue-next";
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { Logout ,getProfile } from "~/lib/api/auth";
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
      console.log("Fetched profile data:", profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  });

  const goToProfile =() =>{
    router.push('/admin/profile')
  }

  onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

  const handleLogout = async () => {
  try {
    await Logout()
    Swal.fire({
      icon: 'warning',
      title: 'Apakah Anda Ingin Keluar?',
      text: 'You have been logged out successfully!',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'No, cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire('Logged out!', 'You have been logged out.', 'success');
        await Logout()
        router.push('/auth/login')  // redirect to login page
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
      <div
        class="w-10 h-10 bg-gray-500 rounded-full overflow-hidden flex items-center justify-center"
      >
        <CircleUserRound :size="40" class="text-white" />
      </div>
      <div class="flex flex-col">
        <span class="hidden sm:inline text-gray-700 font-medium pr-5">
          {{ user?.data?.nama || "Guest" }}
        </span>
        <p class="text-sm">{{ user?.data?.email || "" }}</p>
      </div>
    </div>

    <transition>
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-md z-50"
      >
        <ul class="py-2 text-gray-700">
          <li>
            <button
              class="w-full flex items-center px-4 py-2 hover:bg-gray-100"
              @click="goToProfile"
            >
              <UserCircle :size="20" class="mr-2 text-gray-600" />
              <span>Profil Saya</span>
            </button>
          </li>

          <li>
            <button
              class="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50"
              @click="handleLogout"
            >
              <LogOut :size="20" class="mr-2" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
