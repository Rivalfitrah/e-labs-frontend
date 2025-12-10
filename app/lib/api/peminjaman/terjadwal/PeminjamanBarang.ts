import { base_URL } from "~/lib/base";
import axios from "axios";

export interface PeminjamanBarangData {
  ID_Peminjam: string;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  tujuan_peminjaman: string;
  dokumen_pendukung?: string;
  items: {
    barang_id: number;
    jumlah: number;
    kegiatan?: string;
  }[];
}

export async function createPeminjaman(data: PeminjamanBarangData) {
    try {
        const response = await axios.post(
            `${base_URL}/api/peminjaman/barang/terjadwal`,
            data,
            { withCredentials: true }
        );
        console.log('Create peminjaman response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating peminjaman:', error);
        throw error;
    }
}

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
            `${base_URL}/api/admin/verifikasi/peminjaman-barang/tolak/${id}`,
            { status: "DITOLAK" },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function selesaikanPeminjamanBarang(id: string) {
    try {
        const response = await axios.patch(
            `${base_URL}/api/admin/verifikasi/peminjaman-barang/selesai/${id}`,
            { status: "SELESAI" },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}