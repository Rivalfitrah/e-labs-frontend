
import axios from 'axios'

// filepath: d:\Fahri\codebase\projects ssmt5\backend-express\e-labs-frontend\app\lib\api.js
import { base_URL } from '../base'

export async function listBarang() {
    try {
        const token = localStorage.getItem('token')  // ambil token dulu
        const response = await axios.get(`${base_URL}/api/admin/master/barang`, {
            withCredentials: true,
        })
        console.log('Fetched barang data:', response.data.data)
        return response.data.data
    } catch (error) {
        console.error('Error fetching barang:', error)
        throw error
    }
}

export async function updateBarang(id: string, formData: any) {
    // Token ada di httpOnly cookies, tidak perlu set Authorization header manual
    try {
        const response = await axios.patch(
            `${base_URL}/api/admin/master/barang/${id}`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json'
                }
            }
        );
        console.log('Update barang response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during update barang:', error);
        throw error;
    }
}

export async function deleteBarang(id: string) {
    try {
        const response = await axios.delete(
            `${base_URL}/api/admin/master/barang/delete/${id}`,
            {
                withCredentials: true
            }
        );
        console.log('Delete barang response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during delete barang:', error);
        throw error;
    } finally{
        // No operation needed here
    }
}

export async function createBarang(formData: any) {
    // Token ada di httpOnly cookies, tidak perlu set Authorization header manual
    try {
        const response = await axios.post(
            `${base_URL}/api/admin/master/barang`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json'
                }
            }
        );
        console.log('Create barang response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during create barang:', error);
        throw error;
    }
}

export async function getDashboardBarang() {
    try{
        const response = await axios.get(`${base_URL}/api/admin/master/barang/dashboard`, {
            withCredentials: true
        });
        console.log('Dashboard barang data:', response.data);
        return response.data;
    }catch(error){
        console.error('Error fetching dashboard barang:', error)
        throw error
    }
}

export async function getKategoriBarang() {
    try {
        const response = await axios.get(`${base_URL}/api/admin/master/barang/kategori`, {
            withCredentials: true
        });
        console.log('Fetched kategori barang data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching kategori barang:', error);
        throw error;
    }
}