
import axios from 'axios'

// filepath: d:\Fahri\codebase\projects ssmt5\backend-express\e-labs-frontend\app\lib\api.js
const base_URL = useRuntimeConfig().public.NUXT_PUBLIC_API_URL || 'http://localhost:3001'
export async function listRuangan() {
    try {
        const response = await axios.get(`${base_URL}/api/admin/master/ruangan`, {
            withCredentials: true,
        })
        console.log('Fetched ruangan data:', response.data.data)
        return response.data.data
    } catch (error) {
        console.error('Error fetching ruangan:', error)
        throw error
    }
}

export async function updateRuangan(id, formData) {
    // Token ada di httpOnly cookies, tidak perlu set Authorization header manual
    try {
        const response = await axios.patch(
            `${base_URL}/api/admin/master/ruangan/${id}`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json'
                }
            }
        );
        console.log('Update ruangan response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during update ruangan:', error);
        throw error;
    }
}

export async function deleteRuangan(id) {
    try {
        const response = await axios.delete(
            `${base_URL}/api/admin/master/ruangan/delete/${id}`,
            {
                withCredentials: true
            }
        );
        console.log('Delete ruangan response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during delete ruangan:', error);
        throw error;
    } finally{
        // No operation needed here
    }
}

export async function createRuangan(formData) {
    // Token ada di httpOnly cookies, tidak perlu set Authorization header manual
    try {
        const response = await axios.post(
            `${base_URL}/api/admin/master/ruangan`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json'
                }
            }
        );
        console.log('Create ruangan response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during create ruangan:', error);
        throw error;
    }
}

export async function getDashboardRuangan() {
    try{
        const response = await axios.get(`${base_URL}/api/admin/master/ruangan/dashboard`, {
            withCredentials: true
        });
        console.log('Dashboard ruangan data:', response.data);
        return response.data;
    }catch(error){
        console.error('Error fetching dashboard ruangan:', error)
        throw error
    }
}