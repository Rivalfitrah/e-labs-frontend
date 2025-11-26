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

// PATCH Verifikasi Peminjaman Barang - Setujui
export async function setujuiPeminjamanBarang(id: string) {
    try {
        const response = await axios.patch(
            `${base_URL}/api/admin/verifikasi/peminjaman-barang/${id}`,
            { status: "DISETUJUI" },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

// PATCH Verifikasi Peminjaman Barang - Tolak
export async function tolakPeminjamanBarang(id: string) {
    try {
        const response = await axios.patch(
            `${base_URL}/api/admin/verifikasi/peminjaman-barang/${id}`,
            { status: "DITOLAK" },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}