
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
    const token = useCookie("token").value;

    if (!token) {
      console.warn("Tidak ada token → pengguna belum login.");
      return { noToken: true };
    }

    const response = await axios.get(`${base_URL}/api/auth/me`, {
      withCredentials: true,
    });

    return response.data;

  } catch (error: any) {
    const status = error.response?.status;

    // token invalid / expired
    if ([401, 403].includes(status)) {
      return { expired: true };
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