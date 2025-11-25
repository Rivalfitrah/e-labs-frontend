import { base_URL } from "~/lib/base";
import axios from "axios";

export async function PeminjamanList() {
    try {
        const response = await axios.get(`${base_URL}/api/peminjaman/barang/terjadwal/list`, {
            withCredentials: true,
        })
        console.log('Fetched scheduled borrowing requests:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching scheduled borrowing requests:', error);
        throw error;
    }
}