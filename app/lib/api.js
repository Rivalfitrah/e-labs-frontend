
import axios from 'axios'

// filepath: d:\Fahri\codebase\projects ssmt5\backend-express\e-labs-frontend\app\lib\api.js
const base_URL = useRuntimeConfig().public.NUXT_PUBLIC_API_URL || 'http://localhost:3001'
export async function listBarang() {
    try {
        const token = localStorage.getItem('token')  // ambil token dulu
        const response = await axios.get(`${base_URL}/api/admin/master/barang`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log('Fetched barang data:', response.data.data)
        return response.data.data
    } catch (error) {
        console.error('Error fetching barang:', error)
        throw error
    }
}

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