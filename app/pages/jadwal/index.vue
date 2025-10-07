// ...existing code...
<script>
export default {
  name: "LabTable"
};
</script>
// ...existing code...
<template>
  <div class="bg-gray-50 font-sans antialiased min-h-screen p-8">

    <!-- Header Section -->
    <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-8">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <!-- Judul -->
        <div>
          <h1 class="text-3xl font-bold text-emerald-800 tracking-tight">
            List Jadwal
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Lihat dan kelola jadwal penggunaan lab dan fasilitas
          </p>
        </div>

        <!-- Filter & Search -->
        <form class="w-full md:w-auto">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <!-- Dropdown -->
            <select
              class="w-full sm:w-48 px-3 py-2.5 border border-emerald-200 text-gray-700 text-sm rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Semua</option>
              <option value="ruangan">Ruangan</option>
              <option value="barang">Barang</option>
            </select>

            <!-- Search Input -->
            <input
              type="text"
              placeholder="Cari lab, ruangan, atau kegiatan..."
              class="w-full sm:w-80 px-3 py-2.5 border border-emerald-200 text-sm rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400"
            />
          </div>
        </form>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-emerald-50 text-emerald-700 uppercase text-sm">
            <tr>
              <th class="px-6 py-4 font-semibold">Lab/Ruangan</th>
              <th class="px-6 py-4 font-semibold">Tanggal & Waktu</th>
              <th class="px-6 py-4 font-semibold">Kapasitas</th>
              <th class="px-6 py-4 font-semibold">Status</th>
              <th class="px-6 py-4 font-semibold">Kegiatan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr class="hover:bg-emerald-50 transition-colors duration-200">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">Lab Komputer A</div>
                <div class="text-sm text-gray-500">Lantai 2, Gedung Teknik</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">07 Oktober 2025</div>
                <div class="text-sm text-gray-500">08:00 - 10:00 WIB</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">30 Orang</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Tersedia
                </span>
              </td>
              <td class="px-6 py-4 text-gray-900">Praktikum Pemrograman Web</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-end items-center text-sm text-gray-600">
      <div class="flex gap-2">
        <button class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
          Previous
        </button>
        <button class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
          Next
        </button>
      </div>
    </div>
  </div>
</template>
// ...existing code...