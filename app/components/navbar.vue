<script>

</script>

<template>
    <nav class="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm px-6 py-4">
        <div class="container mx-auto max-w-7xl px-4">
            <div class="flex justify-between items-center">
                <nuxt-link to="/" class="text-2xl font-bold text-primary">
                    e-labs+
                </nuxt-link>
                <div class="space-x-4">
                    <nuxt-link to="/" class="text-primary hover:text-primary/50 transition">Home</nuxt-link>
                    <nuxt-link to="/booking" class="text-primary hover:text-primary/50 transition">Booking</nuxt-link>
                    <nuxt-link to="/jadwal" class="text-primary hover:text-primary/50 transition">Jadwal</nuxt-link>
                </div>
                <div>
                    <nuxt-link to="/auth/login">
                        <button class="bg-primary text-secondary px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition cursor-pointer">
                            Login
                        </button>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </nav>
</template>