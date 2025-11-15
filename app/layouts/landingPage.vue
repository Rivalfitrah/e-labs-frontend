<script setup>
import TheNavbar from '@/components/landing/TheNavbar.vue'

</script>

<template>
    <div>
        <TheNavbar />
        <main>
            <slot />
        </main>
        
    </div>
</template>