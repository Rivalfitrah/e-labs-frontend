import { base_URL } from "~/lib/base";
import axios from "axios";
import { getUserRole } from "~/middleware/middleware";
export async function getListPengajuanRuanganTerjadwal() {
    try {
        const response = await axios.get(`${base_URL}/api/peminjaman/ruangan/terjadwal/list`, {
            withCredentials: true,
        })
        console.log('Fetched scheduled room requests:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching scheduled room requests:', error);
        throw error;
    }
}

export async function verifikasiPengajuanRuanganTerjadwal(id: any, status: any) {
    try {
        const role = await getUserRole(); // Ensure user role is checked before proceeding
        if (role !== 'pengelola' && role !== 'superadmin') {
            throw new Error('Unauthorized: Only pengelola and superadmin can verify room requests.');
        }
        const response = await axios.patch(`${base_URL}/api/admin/verifikasi/peminjaman-ruangan/${id}`, { 
            status
        }, {
            withCredentials: true,
        })
        console.log('Verification response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error verifying scheduled room request:', error);
        throw error;
    }
}
