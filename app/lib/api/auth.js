
import axios from 'axios'

// filepath: d:\Fahri\codebase\projects ssmt5\backend-express\e-labs-frontend\app\lib\api.js
const base_URL = useRuntimeConfig().public.NUXT_PUBLIC_API_URL || 'http://localhost:3001'
export const storage_URL = useRuntimeConfig().public.NUXT_PUBLIC_STORAGE_URL || 'http://localhost:3001/storage'

export async function Login(email, password) {
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

