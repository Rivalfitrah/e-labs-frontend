<script setup>
import { ref } from 'vue'
import { ResetPassword } from '~/lib/api/auth'
import Swal from 'sweetalert2';

import { Lock } from 'lucide-vue-next';

const newPassword = ref('');
const confirmNewPassword = ref('');

const resetPassword = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const otp = urlParams.get('otp');

    // VALIDASI WAJIB
    if (!email || !otp) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Link',
            text: 'Link reset password tidak valid atau sudah kadaluarsa.',
        });
        return;
    }

    if (newPassword.value !== confirmNewPassword.value) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Password dan konfirmasi password tidak sama.',
        });
        return;
    }

    try {
        await ResetPassword(
            email,
            otp,
            newPassword.value,
            confirmNewPassword.value
        );

        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Password kamu sudah direset! Silakan login dengan password baru kamu.",
        }).then(() => {
            navigateTo("/auth/login");
        });

    } catch (error) {
        Swal.fire({ 
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'terjadi kesalahan saat mencoba mereset password.',
        });
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

        <form @submit.prevent="resetPassword">
            <!-- New Password -->
            <div class="mt-10 relative">
            <label for="new-password" class="block text-sm font-medium text-gray-700"
                >New Password</label
            >
            <div class="relative mt-2">
                <Lock
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                />
                <input
                v-model="newPassword"
                type="password"
                id="new-password"
                placeholder="Enter your new password"
                class="block w-full px-12 py-3 border rounded-xl"
                />
            </div>
            </div>

                        <div class="mt-10 relative">
            <label for="confirm-new-password" class="block text-sm font-medium text-gray-700"
                >Confirm New Password</label
            >
            <div class="relative mt-2">
                <Lock
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                />
                <input
                v-model="confirmNewPassword"
                type="password"
                id="confirm-new-password"
                placeholder="Enter your new password"
                class="block w-full px-12 py-3 border rounded-xl"
                />
            </div>
            </div>

            <button
            type="submit"
            class="mt-6 bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full">
            Set New Password
            </button>
        </form>   
    </div>
  </div>
</template>