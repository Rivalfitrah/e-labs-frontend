<script setup>
import { LogOut, CircleUserRound } from "lucide-vue-next";
import { ref } from "vue";
import { Logout } from "~/lib/api/auth";
const user = ref(null)

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
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
<div class="bg-white w-full shadow-md">
  <header class="flex justify-end items-center gap-4 px-6 py-3 border-b">
    <button
      class="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition"
      @click="handleLogout"
    >
      <!-- use Vue binding syntax for props -->
      <LogOut :size="22" />
    </button>

    <div class="flex items-center gap-2 cursor-pointer">
      <div class="w-10 h-10 bg-gray-500 rounded-full overflow-hidden">
        <!-- public assets should be referenced from root, adjust if your image is stored elsewhere -->
        <!-- <img
          src="/logo.jpg"
          alt="Profile"
          class="w-full h-full object-cover"
        /> -->
        <CircleUserRound :size="40" class="text-white" />
      </div>
      <span class="hidden md:inline text-[#243B83] font-medium">
        {{ user ? user.nama : 'Guest' }}
      </span>
    </div>
  </header>
</div>
</template>