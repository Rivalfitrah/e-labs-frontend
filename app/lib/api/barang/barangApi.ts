import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export const barangApi = {
  getAll: async () => {
    try {
      const response = await api.get("/barang");
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil data barang:", error);
      throw error;
    }
  },
};