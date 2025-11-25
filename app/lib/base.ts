import axios from "axios"

export const storage_URL = useRuntimeConfig().public.NUXT_PUBLIC_STORAGE_URL
export const base_URL = useRuntimeConfig().public.NUXT_PUBLIC_API_URL

export async function logger(){
    try {
        const response = await axios.get(`${base_URL}/api/logs`)
        console.log('Logger data:', response.data);
        return response.data
    } catch (error) {
        console.error('Error fetching logger data:', error)
    }
}
