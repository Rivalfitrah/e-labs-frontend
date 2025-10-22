<script setup>
  import {
    LayoutDashboard,
    Package,
    Building2,
    ClipboardList,
    Users,
    Settings,
    BarChart3,
    Calendar,
  } from "lucide-vue-next";

  import { ref } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();

  const isPeminjamanOpen = ref(false);

  const togglePeminjaman = () => {
    isPeminjamanOpen.value = !isPeminjamanOpen.value;
  };

  const menus = [
    { name: "Dashboard", icon: LayoutDashboard, link: "/admin/dashboard" },
    {
      name: "Peminjaman",
      icon: ClipboardList,
      submenus: [
        { name: "Barang", icon: Package, link: "/admin/peminjaman/barang" },
        { name: "Ruangan", icon: Building2, link: "/admin/peminjaman/ruangan" },
      ],
    },
    { name: "Pengguna", icon: Users, href: "/admin/users" },
    { name: "Laporan", icon: BarChart3, href: "/admin/reports" },
    { name: "Jadwal", icon: Calendar, href: "/admin/schedule" },
  ];
</script>

<template>
  <div
    class="fixed top-0 left-0 h-screen w-64 bg-primary text-secondary flex flex-col shadow-xl z-40 transform transition-transform duration-300 md:fixed md:translate-x-0"
  >
    <!-- Header Section -->
    <div class="p-6 border-b border-secondary/20">
      <div class="text-center">
        <h2 class="text-4xl font-bold font-sans mb-1">e-LABS+</h2>
        <span class="text-sm font-sans opacity-80">Admin Dashboard</span>
      </div>
    </div>

    <!-- Navigation Section -->
    <div class="flex-1 overflow-y-auto p-4">
      <nav class="space-x-2">
        <ul class="space-y-2">
          <li v-for="menu in menus" :key="menu.href">
            <!-- Parent -->
            <NuxtLink
              :to="menu.link"
              class="block px-4 py-2 rounded-lg transition"
              :class="
                route.path.startsWith(menu.link)
                  ? 'bg-white text-primary'
                  : 'text-white hover:bg-blue-600 hover:text-white'
              "
            >
              <component :is="menu.icon" class="inline-block w-5 h-5 mr-3" />
              {{ menu.name }}
            </NuxtLink>

            <!-- Submenu langsung muncul (jika ada submenus) -->
            <ul v-if="menu.submenus" class="ml-6 mt-1 space-y-1">
              <li v-for="child in menu.submenus" :key="child.link">
                <NuxtLink
                  :to="child.link"
                  class="block px-3 py-1 text-sm rounded-lg transition"
                  :class="
                    route.path === child.link
                      ? 'bg-white text-primary'
                      : 'text-white/80 hover:bg-blue-600 hover:text-white'
                  "
                >
                  <component :is="child.icon" class="inline-block w-5 h-5 mr-3" />
                  {{ child.name }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>

    <div class="p-4 border-t border-secondary/20">
      <a
        href="#"
        class="flex items-center px-4 py-3 rounded-lg hover:bg-secondary/10 transition-all duration-200 group"
      >
        <Settings
          class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
        />
        <span class="font-sans font-medium">Pengaturan</span>
      </a>
    </div>
  </div>
</template>
