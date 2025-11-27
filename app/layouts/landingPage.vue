<script setup>
import TheNavbar from '@/components/landing/TheNavbar.vue'
import Footer from '@/components/section/Footer.vue'

</script>

<template>
    <div>
        <TheNavbar />
        <main class="mt-25">
            <slot />
        </main>
        <Footer />
    </div>
</template>