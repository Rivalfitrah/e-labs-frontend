import axios from "axios";
import { base_URL } from "../../base";

interface pengajuanRuanganTerjadwal {
  nim: string;
}

export const getAllRuangan = async () => {
  try {
    const res = await axios.get(`${base_URL}/api/ruangan`);
    return res.data.data;
  } catch (err) {
    console.error("Error fetching ruangan:", err);
    return [];
  }
};

export const pengajuanRuanganTerjadwal = async (data: any) => {
  try {
    const res = await axios.post(`${base_URL}/api/peminjaman/ruangan/terjadwal`, data, {
      withCredentials: true
    });
    return res.data;
  } catch (error: any) {
    console.error('Error saat pengajuan ruangan terjadwal:', error);
    throw error.response?.data || error;
  }
};

export const isiFormPengajuanRuanganTerjadwal = async (id: string, data: any) => {
  try {
    const res = await axios.patch(`${base_URL}/api/peminjaman/ruangan/terjadwal/lengkapi/${id}`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    })
    return res.data
  } catch (error: any) {
    console.error('Error saat mengisi form pengajuan ruangan terjadwal:', error)
    throw error.response?.data || error
  }
}

export const getMatkulbyNIM = async (nim: string) => {
  try {
    const res = await axios.get(`${base_URL}/api/peminjaman/ruangan/matkul/${nim}`, {
      withCredentials: true
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching matkul by NIM:", err);
    return { success: false, message: "Gagal mengambil data matkul", data: [] };
  }
}

export const getRuanganRealtime = async (data: any = {}) => { 
  try {
    const res = await axios.get(`${base_URL}/api/ruangan/status/realtime`, {
      withCredentials: true,
      params: data
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching ruangan realtime:", err);
    return { success: false, message: "Gagal mengambil data ruangan realtime", data: [] };
  }
}

export const getRuanganRealtimeState = async (data: any = {}) => {
  try {
    const res = await axios.get(`${base_URL}/api/ruangan/status/all/realtime`, {
      withCredentials: true,
      params: data
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching ruangan realtime state:", err);
    return { success: false, message: "Gagal mengambil data ruangan realtime state", data: [] };
  }
}