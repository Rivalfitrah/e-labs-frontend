<script setup>
import StepIndicator from "@/components/StepIndicator.vue";

const activeSteps = ["Pilih Tanggal", "Pilih Waktu", "Konfirmasi"];
const currentStep = 2; // contoh: user di step ke-2
</script>

<template>
  <div class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4 py-6">
      <StepIndicator :steps="activeSteps" :current-step="currentStep" />
    </div>
  </div>
</template>
