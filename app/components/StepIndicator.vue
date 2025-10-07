<script setup>
import { Check } from "lucide-vue-next";

defineProps({
  steps: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div class="flex items-center justify-center gap-6">
    <template v-for="(step, index) in steps" :key="index">
      <div class="flex items-center">
        <!-- Icon & Label -->
        <div class="flex flex-col items-center relative">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300"
            :class="{
              'border-emerald-500 bg-emerald-500 text-white': index < currentStep,
              'border-emerald-500 text-emerald-600 bg-white': index === currentStep,
              'border-gray-300 text-gray-400 bg-white': index > currentStep,
            }"
          >
            <Check v-if="index < currentStep" class="w-5 h-5" />
            <span v-else class="text-sm font-semibold">{{ index + 1 }}</span>
          </div>
          <span
            class="text-sm mt-2"
            :class="index === currentStep ? 'text-emerald-700 font-medium' : 'text-gray-500'"
          >
            {{ step }}
          </span>
        </div>

        <!-- Connector Line -->
        <div
          v-if="index < steps.length - 1"
          class="w-16 h-0.5 mx-3"
          :class="index < currentStep - 1 ? 'bg-emerald-500' : 'bg-gray-300'"
        ></div>
      </div>
    </template>
  </div>
</template>
