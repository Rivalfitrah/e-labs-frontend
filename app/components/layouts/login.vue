<script setup>
  import Swal from "sweetalert2";
  import { ref } from "vue";
  import { Login } from "~/lib/api/auth";
  import { Mail, Lock, Eye, EyeOff } from "lucide-vue-next";
  import { z } from "zod";

  const email = ref("");
  const password = ref("");
  const loading = ref(false);
  const showPassword = ref(false);

  const errors = ref({
    email: "",
    password: "",
  });

  const loginSchema = z.object({
    email: z
      .string()
      .nonempty({ message: "Email Tidak Boleh Kosong" })
      .email({ message: "Email tidak valid" }),
    password: z
      .string()
      .min(8, { message: "Password harus minimal 8 karakter" }),
  });

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const handleLogin = async () => {
    // Reset error
    errors.value = { email: "", password: "" };

    // Jalankan validasi Zod
    const result = loginSchema.safeParse({
      email: email.value,
      password: password.value,
    });

    // Jika gagal validasi → tampilkan error dan berhenti
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      errors.value.email = fieldErrors.email?.[0] || "";
      errors.value.password = fieldErrors.password?.[0] || "";

      return; // STOP, jangan lanjut login
    }

    // Jika valid, baru proses login
    loading.value = true;

    try {
      const response = await Login(email.value, password.value);

      localStorage.setItem("user", JSON.stringify(response.data));

      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang di E-LABS+!",
        timer: 1500,
        showConfirmButton: false,
      });

      window.location.href = "/admin/dashboard";
    } catch (error) {
      let errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Email atau password salah.";

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
        <div class="mt-10">
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
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div class="mt-6">
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
          <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <p>
          <NuxtLink
            to="/auth/forgot-password"
            class="text-sm text-blue-600 hover:underline mt-4 block"
            >Forgot Password?</NuxtLink
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
