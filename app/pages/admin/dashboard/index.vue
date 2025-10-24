<script setup>
import UiInfoBox from '~/components/ui/infoBox.vue'
import { Search } from 'lucide-vue-next'
definePageMeta({
  layout: 'dashboard'
})
import { listBarang } from '~/lib/api/auth'

console.log(listBarang())

</script>

<template>
  <UiInfoBox />
</template>
