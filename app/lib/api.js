
import axios from 'axios'

const base_URL = 'https://test-e-labs.vercel.app'

export async function listBarang() {
    try {
        const token = localStorage.getItem('token')  // ambil token dulu
        const response = await axios.get(`${base_URL}/api/admin/master/barang`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log('Fetched barang data:', response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching barang:', error)
        throw error
    }
}


export async function Login (email, password) {
    try {
        const response = await axios.post(`${base_URL}/api/auth/login`, {
            email,
            password
        })
        console.log('Login response:', response.data)
        return response.data
    } catch (error) {
        console.error('Error during login:', error)
        throw error
    }
}