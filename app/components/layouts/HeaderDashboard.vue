<script setup>
import { LogOut, CircleUserRound, Menu, X } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import { Logout, getProfile } from "~/lib/api/auth";

// Accept sidebar open prop and emit toggle event
const props = defineProps({
  isSidebarOpen: { type: [Boolean, Object], default: false }
})
const emit = defineEmits(["toggle-sidebar"]);

const user = ref(null)

onMounted(async () => {
  try {
    const profileData = await getProfile()
    user.value = profileData
    console.log('Fetched profile data:', profileData)
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
})

const handleLogout = async () => {
  try {
    await Logout()
    window.location.href = '/auth/login'  // redirect to login page
  } catch (error) {
    console.error('Error during logout:', error)
  }
}
</script>

<template>
  <!-- Hapus div wrapper luar yang duplikat, cukup satu header saja -->
  <header class="bg-white w-full shadow-md">
    <div class="flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b">
      <!-- Left: hamburger (mobile only) -->
      <div class="flex items-center gap-2 md:hidden">
        <button
          class="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
          @click="emit('toggle-sidebar')"
          aria-label="Toggle sidebar"
          :aria-expanded="props.isSidebarOpen"
        >
          <Menu v-if="!props.isSidebarOpen" :size="24" />
          <X v-else :size="24" />
        </button>
      </div>

      <!-- Right: user info & logout -->
      <div class="flex items-center gap-3 ml-auto">
        <!-- Logout Button -->
        <button
          class="p-2 rounded-full bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 transition group"
          @click="handleLogout"
          title="Logout"
        >
          <LogOut :size="20" class="text-gray-700 group-hover:text-red-600 transition" />
        </button>
        <!-- User Profile -->
        <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition">
          <div class="w-10 h-10 bg-gray-500 rounded-full overflow-hidden flex items-center justify-center">
            <CircleUserRound :size="40" class="text-white" />
          </div>
          <span class="hidden sm:inline text-gray-700 font-medium">
            {{ user?.data?.nama || 'Guest' }}
          </span>
        </div>

      </div>
    </div>
  </header>
</template>