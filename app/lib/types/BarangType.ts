export interface UpdateBarangPayload {
  nama_barang: string;
  merek: string;
  kondisi: string;
  jumlah: number;
  status: string;
  kategori_id: number;
}

export interface CreateBarangPayload {
  nama_barang: string;
  merek: string;
  kondisi: string;
  jumlah: number;
  status: string;
  kategori_id: number;
  foto_barang?: File; 
}