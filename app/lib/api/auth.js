
import axios from 'axios'

axios.defaults.withCredentials = true; 

const base_URL = useRuntimeConfig().public.NUXT_PUBLIC_API_URL || 'http://localhost:3001'
console.log('runtime config:', useRuntimeConfig())
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

export async function getProfile(){
    try{
        const response = await axios.get(
            `${base_URL}/api/auth/me`,
            { withCredentials: true }
        );
        console.log('Profile response:', response.data);
        return response.data;
    }catch(error){
        console.error('Error fetching profile:', error);
        throw error;
    }
}