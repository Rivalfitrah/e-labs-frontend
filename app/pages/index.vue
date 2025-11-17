<script setup>
  import { ref, onMounted } from "vue";
  import BorrowForm from "@/components/landing/BorrowForm.vue";
  import HeroSection from "~/components/section/HeroSection.vue";
  import WhyUse from "~/components/section/WhyUse.vue";
  import CaraMenggunakan from "~/components/section/CaraMenggunakan.vue";
  import GedungSection from "~/components/section/GedungSection.vue";
  import Schedule from "~/components/section/Schedule.vue";


  definePageMeta({
    layout: "landing-page",
  })

  const isFormVisible = ref(false);

  onMounted(() => {
    const dataJSON = sessionStorage.getItem("eLabsBorrowData");
    if (dataJSON) {
      isFormVisible.value = true;
    }

    // Smooth scroll untuk navigasi
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  });

  const showForm = () => {
    isFormVisible.value = true;
  };

  const hideForm = () => {
    isFormVisible.value = false;
  };

  const handleFormSubmit = (formData) => {
    console.log(
      "Form berhasil disubmit! Data diterima di index.vue:",
      formData
    );
    // Di sini kamu bisa kirim 'formData' ke API...
    // Setelah submit, sembunyikan form
    isFormVisible.value = false;
  };
</script>

<template>
  <div class="bg-gradient-to-b from-white to-gray-50 min-h-screen font-sans">
    <!-- Hero Section -->
    <HeroSection />
    <!-- Why e-Labs+ Section -->
    <WhyUse />
    <!-- How to Use Section -->
    <CaraMenggunakan />
    <!-- Building Section -->
    <GedungSection />

    <!-- Schedule Section -->
    <Schedule />
    <!-- Form Modal (if visible) -->
    <BorrowForm
      v-if="isFormVisible"
      @cancel="hideForm"
      @submit="handleFormSubmit"
    />

  </div>
</template>

<style scoped>
  /* Smooth animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  section {
    animation: fadeIn 0.6s ease-out;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #16a34a;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #15803d;
  }
</style>
