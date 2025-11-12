
import axios from 'axios'

// filepath: d:\Fahri\codebase\projects ssmt5\backend-express\e-labs-frontend\app\lib\api.js
import { base_URL } from '../base'
import { navigateTo } from '#app';
import Swal from 'sweetalert2';
import type { LoginPayload, UpdatePasswordPayload } from '../types/AuthType';

console.log('runtime config:', useRuntimeConfig())
export async function Login(email: string, password: string) {
    try {
        const response = await axios.post(
            `${base_URL}/api/auth/login`,
            { email, password },
            { withCredentials: true } // <-- penting!
        );
        console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

export async function Logout(){
    // Hpus token dari cookies
    try{
        const response = await axios.post(
            `${base_URL}/api/auth/logout`,
            {},
            { withCredentials: true } // <-- penting!
        );
        console.log('Logout response:', response.data);
        return response.data;
    }catch(error){
        console.error('Error during logout:', error);
        throw error;
    }
}

export async function getProfile() {
  try {
    const response = await axios.get(`${base_URL}/api/auth/me`, {
      withCredentials: true,
    });
    console.log("Profile response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error);

    // ✅ Jika token tidak valid / expired
    if (error.response && [401, 403].includes(error.response.status)) {
      console.warn("Token tidak valid atau sudah expired. Redirect ke login...");

      // 🔥 Tampilkan toast dulu (di kanan atas)
      await Swal.fire({
        toast: true,
        position: "top-end", // pojok kanan atas
        icon: "warning",
        title: "Sesi Anda telah berakhir",
        text: "Silakan login kembali untuk melanjutkan.",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      // 🔄 Setelah toast selesai (2.5 detik), redirect ke login
      await navigateTo("/auth/login");
    }

    throw error;
  }
}

export async function UpdatePassword(payload: UpdatePasswordPayload) {
    try {
        const response = await axios.patch(
            `${base_URL}/api/auth/change-your-password`,
            payload,
            { withCredentials: true } 
        );
        console.log('Update password response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during update password:', error);
        throw error;
    }
}