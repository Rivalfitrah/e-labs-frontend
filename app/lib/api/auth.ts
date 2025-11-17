
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
    console.log("📡 Memanggil API /auth/me...");
    console.log("📡 Base URL:", base_URL);
    
    // Langsung hit API, backend akan baca token dari httpOnly cookie
    const response = await axios.get(`${base_URL}/api/auth/me`, {
      withCredentials: true, // PENTING: Kirim cookie httpOnly
    });

    console.log("✅ Profile berhasil diambil:", response.data);
    return response.data;

  } catch (error: any) {
    const status = error.response?.status;
    console.error("❌ Error getProfile:", {
      status,
      message: error.response?.data?.message,
      debug: error.response?.data?.debug,
      fullError: error.response?.data
    });

    // Jika 401 = no token atau invalid token
    if (status === 401) {
      const debugMsg = error.response?.data?.debug || '';
      if (debugMsg.includes('Missing token')) {
        console.warn("❌ No token provided");
        return { noToken: true };
      }
      console.warn("⚠️ Token expired atau invalid");
      return { expired: true };
    }

    // 403 = forbidden
    if (status === 403) {
      console.warn("⚠️ Token expired atau invalid");
      return { expired: true };
    }

    // Network error atau server error
    console.warn("⚠️ Network/Server error, treating as no token");
    return { noToken: true };
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

export async function ForgotPassword(email: string) {
    try {
        const response = await axios.post(
            `${base_URL}/api/auth/request-password-reset`,
            { email },
            { withCredentials: true } 
        );
        console.log('Forgot password response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during forgot password:', error);
        throw error;
    }
}


export async function VerifyOTP(email: string, otp: string) {
    try {
        const response = await axios.post(
            `${base_URL}/api/auth/verify-otp`,
            { email, otp },
            { withCredentials: true } 
        );
        console.log('Verify OTP response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during verify OTP:', error);
        throw error;
    }
}

export async function ResetPassword(
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
) {
    try {
        const response = await axios.post(
            `${base_URL}/api/auth/reset-password`,
            { email, otp, newPassword, confirmPassword },
            { withCredentials: true }
        );

        return response.data;

    } catch (error) {
        console.error('Error during reset password:', error);
        throw error;
    }
}

