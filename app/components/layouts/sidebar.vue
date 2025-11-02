<script setup>
import {
  LayoutDashboard,
  Package,
  Building2,
  ClipboardList,
  User,
  Settings,
  MonitorDot,
  BookOpen,
  Menu
} from "lucide-vue-next";

import { ref, computed } from "vue";
import { useRoute } from "vue-router";
// Ganti dengan path file yang sesuai
import { getUserRole } from "../middleware/middleware"; // ASUMSI PATH INI

const route = useRoute();

const isPeminjamanOpen = ref(false);
const userRole = ref(null); // Mulai dengan null atau loading state

// Panggil fungsi asinkron untuk mendapatkan peran saat setup
getUserRole().then(role => {
  userRole.value = role;
  console.log("Peran Pengguna yang didapatkan:", userRole.value);
});

const baseMenus = [
  { name: "Dashboard", icon: LayoutDashboard, link: "/admin/dashboard" },
  {
    name: "Peminjaman",
    icon: ClipboardList,
    link: null, // Set null jika hanya parent
    submenus: [
      { name: "Barang", icon: Package, link: "/admin/peminjaman/barang" },
      { name: "Ruangan", icon: Building2, link: "/admin/peminjaman/ruangan" },
    ],
  },
  {
    name: "List",
    icon: ClipboardList,
    link: null, // Set null jika hanya parent
    submenus: [
      { name: "Pengguna", icon: User, link: "/admin/list/pengguna" },
      { name: "Barang", icon: Package, link: "/admin/list/barang" },
      { name: "Ruangan", icon: Building2, link: "/admin/list/ruangan" },
      { name: "Mata Kuliah", icon: BookOpen, link: "/admin/list/matkul" },
    ],
  },
  {
    name: "Log Aktivitas",
    icon: MonitorDot,
    link: "/admin/log", // Set null jika hanya parent

  },
];

// Computed property untuk menu yang telah difilter
const menus = computed(() => {
  // Tunggu hingga userRole.value memiliki nilai
  if (!userRole.value) {
    return []; // Tampilkan menu kosong saat loading
  }

  // Peran yang tidak diizinkan melihat submenu Pengguna
  const restrictedRoles = ["mahasiswa", "dosen"];

  // Jika peran pengguna termasuk dalam restrictedRoles, lakukan filtering
  if (restrictedRoles.includes(userRole.value)) {
    return baseMenus.map(menu => {
      // Cek jika menu adalah 'List' dan memiliki submenus
      if (menu.name === 'List' && menu.submenus) {
        // Filter submenus: hilangkan yang namanya 'Pengguna'
        const filteredSubmenus = menu.submenus.filter(
          submenu => submenu.name !== 'Pengguna'
        );

        // Kembalikan menu List dengan submenu yang sudah difilter
        return { ...menu, submenus: filteredSubmenus };
      }
      // Kembalikan menu lainnya apa adanya
      return menu;
    });
  }

  // Jika peran tidak dibatasi (e.g., admin), kembalikan baseMenus lengkap
  return baseMenus;
});
</script>

<template>
  <div
    class="fixed top-0 left-0 h-screen w-64 bg-primary text-secondary flex flex-col shadow-xl z-40 transform transition-transform duration-300 md:fixed md:translate-x-0"
  >
    <div class="p-6 border-b border-secondary/20">
      <div class="text-center">
        <h2 class="text-4xl font-bold font-sans mb-1">e-LABS+</h2>
        <span class="text-sm font-sans opacity-80">Admin Dashboard</span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <nav class="space-x-2">
        <ul class="space-y-2">
          <li v-for="menu in menus" :key="menu.name"> 
            
            <NuxtLink
              v-if="menu.link"
              :to="menu.link"
              class="block px-4 py-2 rounded-lg transition"
              :class="
                route.path.startsWith(menu.link)
                  ? 'bg-white text-primary'
                  : 'text-white hover:bg-green-600 hover:text-white'
              "
            >
              <component :is="menu.icon" class="inline-block w-5 h-5 mr-3" />
              {{ menu.name }}
            </NuxtLink>
            
            <div 
              v-else 
              class="block px-4 py-2 rounded-lg transition cursor-pointer text-white hover:bg-green-600 hover:text-white"
            >
              <component :is="menu.icon" class="inline-block w-5 h-5 mr-3" />
              {{ menu.name }}
            </div>

            <!-- SUBMENU DENGAN LINGKARAN HOLLOW -->
            <ul v-if="menu.submenus && menu.submenus.length > 0" class="ml-6 mt-1 space-y-2">
              <li v-for="child in menu.submenus" :key="child.link">
                <NuxtLink
                  :to="child.link"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all group"
                  :class="
                    route.path === child.link
                      ? 'bg-white text-primary'
                      : 'text-white/80 hover:bg-green-600 hover:text-white'
                  "
                >
                  <!-- LINGKARAN DENGAN BORDER (HOLLOW) LEBIH BESAR -->
                  <span
                    class="w-4 h-4 rounded-full border-2 transition-all flex-shrink-0"
                    :class="
                      route.path === child.link
                        ? 'bg-white border-primary'
                        : 'border-white'
                    "
                  ></span>
                  <span>{{ child.name }}</span>
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

  <!-- hamburger menu mobile -->
   <div class="md:hidden">
    <button>
      <Menu class="w-8 h-8 text-white" />
    </button>
   </div>
</template>