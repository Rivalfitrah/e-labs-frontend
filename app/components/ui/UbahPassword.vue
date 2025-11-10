<script setup>

</script>

<template>
      <div class="bg-white rounded-2xl shadow-lg p-8 mt-6">
    <h3 class="text-xl font-semibold mb-4">Ganti Password</h3>

    <form class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Password Lama</label
        >
        <input
          type="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-utama focus:border-utama"
          placeholder="Masukkan password lama"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Password Baru</label
        >
        <input
          type="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-utama focus:border-utama"
          placeholder="Masukkan password baru"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Konfirmasi Password Baru</label
        >
        <input
          type="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-utama focus:border-utama"
          placeholder="Konfirmasi password baru"
        />
      </div>

      <button
        type="submit"
        class="mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-md shadow hover:bg-utama/80 transition"
      >
        Simpan Perubahan
      </button>
    </form>
  </div>
</template>