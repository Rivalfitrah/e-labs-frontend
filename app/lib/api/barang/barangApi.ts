import axios from "axios";
import { base_URL } from "../../base";

const api = axios.create({
  baseURL: base_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getAllBarang() {
    try {
        const response = await api.get("/api/barang");
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil data barang:", error);
        throw error;
    }
}

export async function pengajuanPeminjamanBarang(payload: {
    ID_Peminjam: string;
    items: Array<{
      barang_id: number;
      jumlah: number;
      kegiatan: string;
    }>;
    tanggal_pinjam: string;
    tanggal_kembali: string;
    tujuan_peminjaman: string;
    dokumen_pendukung?: string | File;
}) {
    try {
        // Jika ada dokumen, gunakan FormData
        if (payload.dokumen_pendukung) {
            const formData = new FormData();
            formData.append("ID_Peminjam", payload.ID_Peminjam);
            formData.append("items", JSON.stringify(payload.items));
            formData.append("tanggal_pinjam", payload.tanggal_pinjam);
            formData.append("tanggal_kembali", payload.tanggal_kembali);
            formData.append("tujuan_peminjaman", payload.tujuan_peminjaman);
            formData.append("dokumen_pendukung", payload.dokumen_pendukung);

            const response = await axios.post(
                `${base_URL}/api/peminjaman/barang/terjadwal`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            return response.data;
        } else {
            // Jika tidak ada dokumen, kirim sebagai JSON biasa
            const response = await axios.post(
                `${base_URL}/api/peminjaman/barang/terjadwal`,
                {
                    ID_Peminjam: payload.ID_Peminjam,
                    items: payload.items,
                    tanggal_pinjam: payload.tanggal_pinjam,
                    tanggal_kembali: payload.tanggal_kembali,
                    tujuan_peminjaman: payload.tujuan_peminjaman
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data;
        }

    } catch (error) {
        console.error("Gagal mengajukan peminjaman barang:", error);
        throw error;
    }
}


