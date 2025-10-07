<script>
import { Calendar, Beaker } from 'lucide-vue-next'
import CaraPeminjaman from '../components/section/cara-peminjaman.vue'
import Navbar from '../components/navbar.vue'

export default {
  components: {
    Calendar,
    Beaker,
    CaraPeminjaman,
    Navbar
  }
}
</script>

<template>
  <div class="bg-[#E8F5E9]">
    <navbar />
 <section class="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 h-screen">
        <div class="absolute inset-0 opacity-5 bg-cover bg-center" />
        <div class="container mx-auto px-4 py-20 md:py-32 relative">
          <div class="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-4">
              <Beaker class="w-4 h-4" />
              <span>Sistem Peminjaman Lab & Barang Terpadu</span>
            </div>
            <h1 class="text-4xl md:text-6xl font-bold text-foreground text-balance leading-tight">
              Pinjam Lab & Barang dengan <span class="text-primary">Mudah</span>
            </h1>
            <p class="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Cek ketersediaan lab dan barang secara real-time. Proses booking yang cepat, mudah, dan transparan untuk
              kebutuhan akademik Anda.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <nuxt-link to="/booking">
                <button class="bg-primary text-white px-3 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition duration-300">
                  Mulai Booking
                </button>
              </nuxt-link>
              <nuxt-link to="/jadwal">
                <button class="bg-secondary flex text-secondary-foreground px-3 py-3 rounded-lg shadow-lg hover:bg-secondary/90 transition duration-300 items-center gap-2">
                  <Calendar class="w-4 h-4" />
                  Cek Jadwal Lab
                </button>
              </nuxt-link>
            </div>
          </div>
        </div>
      </section>

      <cara-peminjaman />




  </div>
</template>