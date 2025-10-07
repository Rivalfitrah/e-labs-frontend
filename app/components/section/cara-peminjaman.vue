<script>
import { Calendar, CheckCircle2, Clock } from 'lucide-vue-next'

export default {
  components: {
    Calendar,
    CheckCircle2,
    Clock
    
  }
}


</script>

<template>
<section class="py-20 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">Cara Booking Lab</h2>
            <p class="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ikuti langkah mudah untuk meminjam ruang laboratorium
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card class="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border rounded-lg border-primary/50">
              <div class="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center mb-4">
                <Calendar class="w-6 h-6 text-primary" />
              </div>
              <h3 class="text-xl font-semibold text-foreground mb-2">1. Pilih Lokasi & Waktu</h3>
              <p class="text-muted-foreground">
                Tentukan lokasi lab dan waktu peminjaman yang Anda butuhkan. Sistem akan menampilkan ketersediaan secara
                real-time.
              </p>
            </Card>

            <Card class="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border rounded-lg border-primary/50">
              <div class="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center mb-4">
                <CheckCircle2 class="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 class="text-xl font-semibold text-foreground mb-2">2. Isi Form Peminjaman</h3>
              <p class="text-muted-foreground">
                Lengkapi data peminjaman seperti keperluan, jumlah peserta, dan penanggung jawab kegiatan.
              </p>
            </Card>

            <div class="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border rounded-lg border-primary/50">
              <div class="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center mb-4">
                <Clock class="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 class="text-xl font-semibold text-foreground mb-2">3. Tunggu Konfirmasi</h3>
              <p class="text-muted-foreground">
                Laboran akan memverifikasi peminjaman Anda. Notifikasi akan dikirim melalui email setelah disetujui.
              </p>
            </div>
          </div>
        </div>
      </section>
</template>