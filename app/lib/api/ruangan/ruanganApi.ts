import axios from "axios";

interface pengajuanRuanganTerjadwal {
    nim: string;
}

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const getAllRuangan = async () => {
  try {
    const res = await api.get("/ruangan");
    return res.data.data; // langsung ambil array data-nya
  } catch (err) {
    console.error("Error fetching ruangan:", err);
    return [];
  }
};

export const pengajuanRuanganTerjadwal = async (data: any) => {
  try {
    const res = await api.post(`/peminjaman/ruangan/terjadwal`, data);
    return res.data;
  } catch (error: any) {
    console.error('Error saat pengajuan ruangan terjadwal:', error);
    throw error.response?.data || error;
  }
};

export const isiFormPengajuanRuanganTerjadwal = async (id: string, data: any) => {
  try {
    const res = await api.patch(`/peminjaman/ruangan/terjadwal/lengkapi/${id}`, data)
    return res.data
  } catch (error: any) {
    console.error('Error saat mengisi form pengajuan ruangan terjadwal:', error)
    throw error.response?.data || error
  }
}


export const getMatkulbyNIM = async (nim: string) => {
  try {
    const res = await api.get(`/peminjaman/ruangan/matkul/${nim}`);
    return res.data; // return semua: { success, message, data }
  } catch (err) {
    console.error("Error fetching matkul by NIM:", err);
    return { success: false, message: "Gagal mengambil data matkul", data: [] };
  }
}