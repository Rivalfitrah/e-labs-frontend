<script setup>
  import Swal from "sweetalert2";
  import { ref } from "vue";
  import { Login } from "~/lib/api/auth";
  import { Mail, Lock, Eye, EyeOff } from "lucide-vue-next";

  const email = ref("");
  const password = ref("");
  const loading = ref(false);
  const showPassword = ref(false);

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const handleLogin = async () => {
    loading.value = true;
    try {
      const response = await Login(email.value, password.value);
      console.log("✅ Login response:", response);
      console.log("🍪 Backend sudah set httpOnly cookie dengan token:", response.data.token.substring(0, 30) + "...");
      
      // Simpan user data ke localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang di E-LABS+!",
        timer: 1500,
        showConfirmButton: false
      });

      console.log("🔄 Redirecting ke dashboard...");
      
      // Hard reload ke dashboard untuk memastikan middleware berjalan fresh
      window.location.href = "/admin/dashboard";
      
    } catch (error) {
      console.error("❌ Login error:", error);
      
      let errorMessage = "Email atau password salah. Silakan coba lagi.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      await Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: errorMessage,
      });
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div
    class="bg-primary w-full h-screen flex flex-col items-center justify-center"
  >
    <div class="bg-white p-8 rounded-xl shadow-md max-w-3xl">
      <h1 class="text-[#258D5C] font-bold text-8xl justify-center flex">
        e-LABS+
      </h1>
      <span class="text-[#258D5C] justify-center flex"
        >Electronic Labs & Assets Borrowing System</span
      >

      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="mt-10 relative">
          <label for="username" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <div class="relative mt-2">
            <Mail
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            />
            <input
              v-model="email"
              type="text"
              id="username"
              placeholder="Enter your email"
              class="block w-full px-12 py-3 border rounded-xl"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="mt-6 relative">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <div class="relative mt-2">
            <Lock
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            />
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              placeholder="Enter your password"
              class="block w-full px-12 py-3 border rounded-xl"
            />
            <!-- Icon Hide/Show -->
            <EyeOff
              v-if="!showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
              @click="togglePassword()"
            />
            <Eye
              v-else
              class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
              @click="togglePassword()"
            />
          </div>
        </div>

        <p>
          <a href="/auth/forgot-password" class="text-sm text-blue-600 hover:underline mt-4 block"
            >Forgot Password?</a
          >
        </p>

        <div class="mt-6">
          <button
            :disabled="loading"
            type="submit"
            class="w-full py-4 rounded-xl text-white bg-primary"
          >
            {{ loading ? "Logging in..." : "Login" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
