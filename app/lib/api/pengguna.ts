
import axios from 'axios'

// filepath: d:\Fahri\codebase\projects ssmt5\backend-express\e-labs-frontend\app\lib\api.js
import { base_URL } from '../base'

export async function listUser() {
    try {
        const response = await axios.get(`${base_URL}/api/admin/users`, {
            withCredentials: true,
        })
        console.log('Fetched user data:', response.data.data)
        return response.data.data
    } catch (error) {
        console.error('Error fetching user:', error)
        throw error
    }
}

export async function updateUser(uniqueId: any, formData: any) {
    // Token ada di httpOnly cookies, tuniqueIdak perlu set Authorization header manual
    try {
        const response = await axios.patch(
            `${base_URL}/api/admin/users/${uniqueId}`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json'
                }
            }
        );
        console.log('Update user response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during update user:', error);
        throw error;
    }
}

export async function deleteUser(id: string) {
    try {
        const response = await axios.delete(
            `${base_URL}/api/admin/users/${id}`,
            {
                withCredentials: true
            }
        );
        console.log('Delete user response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during delete user:', error);
        throw error;
    } finally {
        // No operation needed here
    }
}

export async function createUser(formData : any) {
  try {
    const isFormData = formData instanceof FormData;

    const response = await axios.post(
      `${base_URL}/api/admin/users/tambah`,
      formData,
      {
        withCredentials: true,
        headers: isFormData
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error during create user:', error);
    throw error;
  }
}


export async function dashboardUser() {
    try {
        const response = await axios.get(`${base_URL}/api/admin/users/dashboard/stats`, {
            withCredentials: true,
        })
        console.log('Fetched dashboard user data:', response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching dashboard user data:', error)
        throw error
    }   
}

export async function deactivatedUser(id: string) {
    try {
        const response = await axios.patch(
            `${base_URL}/api/admin/users/${id}/deactivate`,
            {}, // No body needed, just an empty object
            {
                withCredentials: true,
            }
        );
        console.log('Deactivated user response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deactivating user:', error);
        throw error;
    }
}


export async function reactivateUser(id: string) {
    try {
        const response = await axios.patch(
            `${base_URL}/api/admin/users/${id}/reactivate`,
            {}, // No body needed, just an empty object
            {
                withCredentials: true,
            }
        );
        console.log('Reactivated user response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deactivating user:', error);
        throw error;
    }
}

export async function getProdiList() {
    try {
        const response = await axios.get(`${base_URL}/api/admin/users/prodi`, {
            withCredentials: true
        });
        console.log('Fetched prodi list:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching prodi list:', error);
        throw error;
    }
}
export async function giveWarning(uniqueId: string) {
    try {
        const response = await axios.post(
            `${base_URL}/api/admin/users/${uniqueId}/warning`,
            {}, // No body needed
            {
                withCredentials: true
            }
        );
        console.log('Give warning response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error giving warning:', error);
        throw error;
    }
}

export async function getMatakuliahList() {
    try {
        const response = await axios.get(`${base_URL}/api/admin/matkul/list`, {
            withCredentials: true
        });
        console.log('Fetched matakuliah list:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching matakuliah list:', error);
        throw error;
    }
}

export async function addMatakuliah() {
    try {
        const response = await axios.post(`${base_URL}/api/admin/matkul`, {
            withCredentials: true
        });
        console.log('Add matakuliah response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding matakuliah:', error);
        throw error;
    }
}

export async function deleteMatakuliah(id: string) {
    try {
        const response = await axios.delete(`${base_URL}/api/admin/matkul/${id}`, {
            withCredentials: true
        });
        console.log('Delete matakuliah response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting matakuliah:', error);
        throw error;
    }
}

export async function updateMatakuliah(id: string, formData: any) {
    try {
        const response = await axios.patch(
            `${base_URL}/api/admin/matkul/${id}`,
            formData,
            {
                withCredentials: true
            }
        );
        console.log('Update matakuliah response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating matakuliah:', error);
        throw error;
    }
}

export async function getDetailMatkul(id: string) {
    try {
        const response = await axios.get(`${base_URL}/api/admin/matkul/${id}`, {
            withCredentials: true
        });
        console.log('Fetched matakuliah detail:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching matakuliah detail:', error);
        throw error;
    }
}

export async function importUsers(formData: any) {
    try {
        const response = await axios.post(`${base_URL}/api/admin/users/import?mode=all`, formData, {
            withCredentials: true
        });
        console.log('Import users response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error importing users:', error);
        throw error;
    }
}