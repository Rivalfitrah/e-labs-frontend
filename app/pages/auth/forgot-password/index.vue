<script setup>
import { Mail } from 'lucide-vue-next';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { ForgotPassword } from '~/lib/api/auth';

const email = ref('');

const forgotPassword = async () => {
    try {
        const response = await ForgotPassword(email.value);
        localStorage.setItem("reset_email", email.value);

        Swal.fire({
            icon: "success",
            title: "Success",
            text: "OTP sudah dikirim ke email kamu!",
        }).then(() => {
            navigateTo("/auth/otp");
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'terjadi kesalahan saat mencoba mereset password.',
        });
        console.error("Error during password reset:", error);
    }
}
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

      <form @submit.prevent="forgotPassword">
        <!-- Email -->
        <div class="mt-10 relative">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <div class="relative mt-2">
            <Mail
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            />
            <input
            v-model="email"
            type="text"
            id="email"
            placeholder="Enter your email"
            class="block w-full px-12 py-3 border rounded-xl"
            />
          </div>
        </div>

        <button
        type="submit"
          class="mt-6 bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full">
          Reset Password
        </button>

      </form>

      
    </div>
  </div>
</template>