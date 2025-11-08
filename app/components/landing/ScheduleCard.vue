<script setup>
const props = defineProps({
  lab: {
    type: Object,
    required: true
  },
  selectedScheduleId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['selectSchedule', 'pinjam']);

function handleSelection(scheduleId) {
  emit('selectSchedule', scheduleId);
}
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
    <h3 class="text-lg font-bold mb-4">{{ lab.name }}</h3>
    <div class="space-y-3">
      <div v-for="schedule in lab.schedules" :key="schedule.id" class="flex items-center">
        <label :for="schedule.id" class="text-sm text-gray-600">
          <span class="font-semibold">{{ schedule.time }}</span> - {{ schedule.course }}
        </label>
      </div>
    </div>

  </div>
</template>