<script setup>
  import HeroDashboard from "~/components/ui/dashboard/HeroDashboard.vue";
import PeminjamanNew from "~/components/ui/dashboard/PeminjamanNew.vue";
  import StatsDashboard from "~/components/ui/dashboard/StatsDashboard.vue";

  definePageMeta({
    layout: "dashboard",
  });
</script>

<template>
  <div>
    <HeroDashboard />
    <div class="pt-5">
      <StatsDashboard />
    </div>

    <section class="mt-5">
      <!-- status peminjaman -->
       <PeminjamanNew />


    </section>
  </div>
</template>
