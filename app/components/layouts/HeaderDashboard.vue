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
  <div class="bg-white w-full shadow-md fixed">
    <header class="flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b">
      <!-- Left: hamburger (mobile) -->
      <div class="flex items-center gap-2">
        <button
          class="p-2 rounded-md md:hidden text-gray-700 hover:bg-gray-100 transition"
          @click="emit('toggle-sidebar')"
          aria-label="Toggle sidebar"
        >
          <Menu v-if="!props.isSidebarOpen" :size="20" />
          <X v-else :size="20" />
        </button>
      </div>

      <!-- Right: actions -->
      <div class="flex items-center ml-auto gap-3">
        <button
          class="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition"
          @click="handleLogout"
        >
          <LogOut :size="22" />
        </button>

        <div class="flex items-center gap-2 cursor-pointer">
          <div class="w-10 h-10 bg-gray-500 rounded-full overflow-hidden">
            <CircleUserRound :size="40" class="text-white" />
          </div>
          <span class="hidden md:inline text-[#243B83] font-medium">
            {{ user && user.data ? user.data.nama : 'Guest' }}
          </span>
        </div>
      </div>
    </header>
  </div>
</template>