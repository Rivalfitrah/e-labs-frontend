import axios from "axios"

export const storage_URL = useRuntimeConfig().public.NUXT_PUBLIC_STORAGE_URL || 'http://localhost:3001/storage'
export const base_URL = useRuntimeConfig().public.NUXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function logger(){
    try {
        const response = await axios.get(`${base_URL}/api/logs`)
        console.log('Logger data:', response.data);
        return response.data
    } catch (error) {
        console.error('Error fetching logger data:', error)
    }
}
