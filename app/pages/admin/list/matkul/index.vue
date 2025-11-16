<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, BookOpen, GraduationCap } from 'lucide-vue-next'; 

// Import API Mata Kuliah dan API Prodi (Asumsi path ini sudah benar di project Anda)
import {
    getMatakuliahList, addMatakuliah, updateMatakuliah, deleteMatakuliah
} from '~/lib/api/pengguna';
import { getProdiList } from '~/lib/api/pengguna';

// Import komponen infobox
import UiInfoBox from '~/components/ui/infoBox.vue'; 

definePageMeta({
    layout: 'dashboard'
});

// --- STATE MANAGEMENT ---
const matakuliahList = ref([]);
const isLoading = ref(true);
const search = ref('');
const notification = ref({ show: false, message: '', type: 'success' });
const getProdiOptions = ref([]);
const matkulStats = ref({
    totalProdi: 0,
    totalSemester: 0
});

// Modal State
const isEditModalOpen = ref(false);
const isAddModalOpen = ref(false);

const initialSelectedMatkul = {
    id: undefined, matkul: '', semester: null, prodiId: null, prodi: null
};

const selectedMatakuliah = ref({ ...initialSelectedMatkul });
const newMatakuliahData = ref({ ...initialSelectedMatkul });

// --- UTILITY FUNCTIONS ---

function showNotification(message, type = 'success') {
    notification.value = { show: true, message, type };
    setTimeout(() => {
        notification.value.show = false;
    }, 3000);
}

// --- PAGINATION & FILTERING ---
const itemsPerPage = ref(10);
const currentPage = ref(1);

const filteredMatakuliah = computed(() => {
    const query = search.value.toLowerCase().trim();
    const dataArray = matakuliahList.value;

    if (!query) {
        return dataArray;
    }
    return dataArray.filter(item =>
        item.matkul?.toLowerCase().includes(query) ||
        item.prodi?.nama_prodi?.toLowerCase().includes(query) ||
        String(item.semester)?.includes(query)
    );
});

const totalPages = computed(() => {
    return Math.ceil(filteredMatakuliah.value.length / itemsPerPage.value);
});

const paginatedMatakuliah = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredMatakuliah.value.slice(start, end);
});

// LOGIKA PAGINATION DENGAN ELIPSIS (DARI INPUT USER)
const paginationPages = computed(() => {
    const pages = [];
    const maxPagesToShow = 5;
    const total = totalPages.value;
    const current = currentPage.value;

    if (total <= maxPagesToShow) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        pages.push(1);
        if (current > 3) pages.push('...');
        
        let start = Math.max(2, current - 1);
        let end = Math.min(total - 1, current + 1);

        if (current <= 3) end = 4;
        if (current >= total - 2) start = total - 3;
        
        // Memastikan range tidak tumpang tindih
        start = Math.max(start, 2);
        end = Math.min(end, total - 1);

        for (let i = start; i <= end; i++) {
            if (i > 1 && i < total) pages.push(i);
        }

        if (current < total - 2) pages.push('...');
        pages.push(total);
    }
    // Filter duplikat '...'
    return pages.filter((page, index, self) => page !== '...' || self[index - 1] !== '...');
});

function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
}
function prevPage() { if (currentPage.value > 1) currentPage.value--; }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++; }

// --- STATISTICS CALCULATION ---
function calculateStats(matkulData, prodiData) {
    // Hitung jumlah prodi unik dari data mata kuliah
    const uniqueProdiIds = new Set(matkulData.map(m => m.prodi_id || m.prodi?.id).filter(id => id !== null && id !== undefined));
    
    // Hitung jumlah semester unik dari data mata kuliah
    const uniqueSemesters = new Set(matkulData.map(m => m.semester).filter(s => s !== null && s !== undefined));
    
    matkulStats.value = {
        totalProdi: uniqueProdiIds.size,
        totalSemester: uniqueSemesters.size
    };
    
    console.log('Matkul stats calculated:', matkulStats.value);
}

// --- DATA FETCHING ---
async function fetchInitialData() {
    isLoading.value = true;
    try {
        const [matkulResponse, prodiResponse] = await Promise.all([
            getMatakuliahList(),
            getProdiList(),
        ]);

        const actualMatkulData = Array.isArray(matkulResponse.data) ? matkulResponse.data : (matkulResponse?.data || []);
        matakuliahList.value = actualMatkulData;

        const prodiData = prodiResponse?.data || [];
        getProdiOptions.value = prodiData.map((prodi) => ({
            value: prodi.id,
            label: prodi.nama_prodi
        }));

        // Hitung statistik
        calculateStats(actualMatkulData, prodiData);

    } catch (error) {
        console.error('❌ Failed to fetch initial data:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Gagal memuat data Mata Kuliah atau Prodi. Silakan coba lagi.',
            icon: 'error',
            timer: 1500, showConfirmButton: false
        });
        matakuliahList.value = [];
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    fetchInitialData();
});

// --- MODAL & CRUD HANDLERS (Tidak diubah karena tidak ada error di sini) ---
function openEditModal(item) {
    selectedMatakuliah.value = {
        ...item,
        prodiId: item.prodi_id || item.prodi?.id || null,
        semester: item.semester || null,
    };
    isEditModalOpen.value = true;
}

function closeEditModal() {
    isEditModalOpen.value = false;
    selectedMatakuliah.value = { ...initialSelectedMatkul };
}

function openAddModal() {
    newMatakuliahData.value = { ...initialSelectedMatkul };
    isAddModalOpen.value = true;
}

function closeAddModal() {
    isAddModalOpen.value = false;
}

async function handleSave() {
    const dataToUpdate = {
        matkul: selectedMatakuliah.value.matkul,
        semester: selectedMatakuliah.value.semester,
        prodi_id: selectedMatakuliah.value.prodiId,
    };

    if (!selectedMatakuliah.value.matkul || !selectedMatakuliah.value.semester || !selectedMatakuliah.value.prodiId) {
        Swal.fire({
            icon: 'error', title: 'Error!',
            text: 'Nama Mata Kuliah, Semester, dan Prodi wajib diisi.',
            timer: 2000, showConfirmButton: false
        });
        return;
    }

    try {
        await updateMatakuliah(selectedMatakuliah.value.id, dataToUpdate);

        const index = matakuliahList.value.findIndex(m => m.id === selectedMatakuliah.value.id);
        if (index !== -1) {
            const prodiInfo = getProdiOptions.value.find(p => p.value === selectedMatakuliah.value.prodiId);
            
            Object.assign(matakuliahList.value[index], {
                ...selectedMatakuliah.value,
                prodi_id: selectedMatakuliah.value.prodiId,
                prodi: prodiInfo ? { id: prodiInfo.value, nama_prodi: prodiInfo.label } : null,
            });
        }

        Swal.fire({
            icon: 'success', title: 'Berhasil!',
            text: 'Perubahan data Mata Kuliah berhasil disimpan!',
            timer: 2000, showConfirmButton: false
        });
    } catch (error) {
        console.error('❌ Gagal menyimpan perubahan:', error);
        Swal.fire({
            icon: 'error', title: 'Error!',
            text: 'Gagal menyimpan perubahan Mata Kuliah. Cek konsol.',
            timer: 2000, showConfirmButton: false
        });
    } finally {
        closeEditModal();
    }
}

async function handleAddSubmit() {
    if (!newMatakuliahData.value.matkul || !newMatakuliahData.value.semester || !newMatakuliahData.value.prodiId) {
        Swal.fire({
            icon: 'error', title: 'Error!',
            text: 'Nama Mata Kuliah, Semester, dan Prodi wajib diisi.',
            timer: 2000, showConfirmButton: false
        });
        return;
    }

    const dataToAdd = {
        matkul: newMatakuliahData.value.matkul,
        semester: newMatakuliahData.value.semester,
        prodi_id: newMatakuliahData.value.prodiId,
    };

    try {
        const response = await addMatakuliah(dataToAdd);
        const newMatkulDataFromApi = response.data;

        if (newMatkulDataFromApi) {
            const prodiInfo = getProdiOptions.value.find(p => p.value === newMatkulDataFromApi.prodi_id);

            const newMatkul = {
                ...newMatkulDataFromApi,
                prodi: prodiInfo ? { id: prodiInfo.value, nama_prodi: prodiInfo.label } : null,
            };

            matakuliahList.value.push(newMatkul);
            currentPage.value = totalPages.value;
        } else {
            await fetchInitialData();
        }

        Swal.fire({
            icon: 'success', title: 'Berhasil!',
            text: `Mata Kuliah "${newMatakuliahData.value.matkul}" berhasil ditambahkan!`,
            timer: 2000, showConfirmButton: false
        });

    } catch (error) {
        console.error('❌ Gagal menambah Mata Kuliah:', error);
        Swal.fire({
            icon: 'error', title: 'Error!',
            text: 'Gagal menambah Mata Kuliah. Cek konsol.',
            timer: 2000, showConfirmButton: false
        });
    } finally {
        closeAddModal();
    }
}

async function confirmDelete(item) {
    const result = await Swal.fire({
        title: 'Apakah Anda Yakin?',
        text: `Anda akan menghapus Mata Kuliah "${item.matkul}" (Semester ${item.semester}) secara permanen.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        await handleDelete(item.id, item.matkul);
    }
}

async function handleDelete(id, namaMatkul) {
    try {
        await deleteMatakuliah(id);

        matakuliahList.value = matakuliahList.value.filter(m => m.id !== id);
        if (paginatedMatakuliah.value.length === 0 && currentPage.value > 1) {
            currentPage.value--;
        }

        Swal.fire({
            title: 'Terhapus!', text: `Mata Kuliah "${namaMatkul}" telah berhasil dihapus.`,
            icon: 'success', timer: 2000, showConfirmButton: false
        });

    } catch (error) {
        console.error('❌ Gagal menghapus Mata Kuliah:', error);
        Swal.fire({
            title: 'Gagal!',
            text: `Gagal menghapus Mata Kuliah "${namaMatkul}". Silakan coba lagi.`,
            icon: 'error'
        });
    }
}
</script>

<template>

    <transition enter-active-class="transition ease-out duration-300 transform"
        enter-from-class="opacity-0 translate-y-full" enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-300 transform" leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-full">
        <div v-if="notification.show" :class="{
            'bg-green-500': notification.type === 'success',
            'bg-red-500': notification.type === 'error'
        }" class="fixed bottom-4 right-4 text-white p-4 rounded-lg shadow-xl z-50 transition-all duration-300">
            {{ notification.message }}
        </div>
    </transition>

    <!-- Statistik Mata Kuliah -->
    <section class="mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UiInfoBox
                type="total"
                class="hover:scale-105 transition-transform duration-200"
            >
                <template #title>
                    <span class="flex items-center gap-2">
                        <GraduationCap class="w-4 h-4 text-primary" />
                        Total Prodi
                    </span>
                </template>
                <span class="text-2xl font-bold text-primary">{{ matkulStats?.totalProdi || 0 }}</span>
            </UiInfoBox>

            <UiInfoBox
                type="tersedia"
                class="hover:scale-105 transition-transform duration-200"
            >
                <template #title>
                    <span class="flex items-center gap-2">
                        <BookOpen class="w-4 h-4 text-green-600" />
                        Total Semester
                    </span>
                </template>
                <span class="text-2xl font-bold text-green-600">{{ matkulStats?.totalSemester || 0 }}</span>
            </UiInfoBox>
        </div>
    </section>

    <div class="flex flex-col md:flex-row md:items-center gap-2 mb-4">
        <div class="flex relative w-full">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" v-model="search"
                class="pl-10 pr-4 py-2 w-full border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                placeholder="Cari Mata Kuliah, Prodi, atau Semester..." />
        </div>
        <button @click="openAddModal"
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full md:w-auto font-medium shadow-md">
            Tambah 
        </button>
    </div>


    <div v-if="isLoading" class="text-center py-8 text-lg text-gray-500">
        Memuat data mata kuliah...
    </div>


    <div v-else-if="matakuliahList.length === 0"
        class="text-center py-8 text-lg text-gray-500 border border-dashed rounded-lg p-10 bg-white">
        Tidak ada data mata kuliah yang ditemukan.
    </div>


    <div v-else class="shadow-xl rounded-xl overflow-hidden bg-white">
        <!-- Desktop Table - Hidden on Mobile -->
        <div class="hidden md:block">
        <table class="w-full border-separate border-spacing-0">
            <thead>
                <tr class="bg-primary text-white text-center text-sm uppercase tracking-wider">
                    <th class="text-center px-5 py-3 w-12">No</th>
                    <th class="text-left px-5 py-3 w-64">Mata Kuliah</th>
                    <th class="text-center px-5 py-3 w-40">Prodi</th>
                    <th class="text-center px-5 py-3 w-20">Semester</th>
                    <th class="text-center px-5 py-3 w-32">Aksi</th>
                </tr>
            </thead>
            <tbody class="text-gray-700 text-sm text-center">
                <tr v-for="(data, index) in paginatedMatakuliah" :key="data.id"
                    class="hover:bg-gray-50 transition border-t border-gray-100">
                    <td class="px-5 py-3 font-mono align-middle">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                    <td class="px-5 py-3 text-left align-middle font-semibold">
                        {{ data.matkul }}
                    </td>
                    <td class="px-5 py-3 align-middle">
                        <span
                            class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                            {{ data.prodi?.nama_prodi || 'N/A' }}
                        </span>
                    </td>
                    <td class="px-5 py-3 align-middle">
                        <span
                            class="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                            {{ data.semester }}
                        </span>
                    </td>
                    <td class="px-5 py-3 text-center align-middle">
                        <div class="flex justify-center items-center gap-2">
                            <button @click="openEditModal(data)" title="Ubah Mata Kuliah"
                                class="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                                <Pencil class="inline w-4 h-4" />
                            </button>
                            <button @click="confirmDelete(data)" title="Hapus Mata Kuliah"
                                class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md text-xs font-medium transition transform hover:scale-105 flex items-center justify-center">
                                <Trash2 class="inline w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="paginatedMatakuliah.length === 0 && filteredMatakuliah.length > 0">
                    <td colspan="5" class="text-center py-4 text-gray-500">Tidak ada mata kuliah di halaman ini.</td>
                </tr>
                <tr v-else-if="filteredMatakuliah.length === 0">
                    <td colspan="5" class="text-center py-4 text-gray-500">Tidak ada hasil yang cocok dengan pencarian
                        Anda.
                    </td>
                </tr>
            </tbody>
        </table>
        </div>

        <!-- Mobile Card View - Visible on Mobile Only -->
        <div class="md:hidden divide-y divide-gray-200">
            <div v-for="(data, index) in paginatedMatakuliah" :key="'mobile-' + data.id"
                class="p-4 hover:bg-gray-50 transition">
                <div class="flex items-start gap-3">
                    <!-- No -->
                    <div class="flex-shrink-0 w-8">
                        <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                            {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 text-sm mb-2">{{ data.matkul }}</h3>
                        
                        <div class="space-y-1 text-xs text-gray-600">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-gray-500 w-20">Prodi:</span>
                                <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                    {{ data.prodi?.nama_prodi || 'N/A' }}
                                </span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-gray-500 w-20">Semester:</span>
                                <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                    {{ data.semester }}
                                </span>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="grid grid-cols-2 gap-2 mt-3">
                            <button @click="openEditModal(data)"
                                class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg shadow text-xs font-medium transition flex items-center justify-center gap-1">
                                <Pencil class="w-3.5 h-3.5" />
                                <span>Edit</span>
                            </button>
                            <button @click="confirmDelete(data)"
                                class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow text-xs font-medium transition flex items-center justify-center gap-1">
                                <Trash2 class="w-3.5 h-3.5" />
                                <span>Hapus</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State for Mobile -->
            <div v-if="paginatedMatakuliah.length === 0 && filteredMatakuliah.length > 0" class="p-8 text-center text-gray-500 text-sm">
                Tidak ada mata kuliah di halaman ini.
            </div>
            <div v-else-if="filteredMatakuliah.length === 0" class="p-8 text-center text-gray-500 text-sm">
                Tidak ada hasil yang cocok dengan pencarian Anda.
            </div>
        </div>


        <div v-if="totalPages > 1"
            class="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
            <span class="text-sm text-gray-700">
                Menampilkan
                <span class="font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                sampai
                <span class="font-semibold">{{ Math.min(currentPage * itemsPerPage, filteredMatakuliah.length) }}</span>
                dari
                <span class="font-semibold">{{ filteredMatakuliah.length }}</span>
                Mata Kuliah
            </span>
            <nav class="flex items-center space-x-1" aria-label="Pagination">
                <button @click="goToPage(1)" :disabled="currentPage === 1"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                    class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition text-sm">
                    &laquo;
                </button>
                <button @click="prevPage" :disabled="currentPage === 1"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                    class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition">
                    <ChevronLeft class="w-5 h-5" />
                </button>
                <div class="flex space-x-1">
                    <template v-for="(page, idx) in paginationPages" :key="idx">
                        <button v-if="page !== '...'" @click="goToPage(page)" :class="{
                            'bg-primary text-white': page === currentPage,
                            'bg-white text-gray-700 hover:bg-gray-100': page !== currentPage
                        }" class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition">
                            {{ page }}
                        </button>
                        <span v-else class="px-3 py-2 text-gray-400 select-none text-sm">...</span>
                    </template>
                </div>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                    class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition">
                    <ChevronRight class="w-5 h-5" />
                </button>
                <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                    class="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 transition text-sm">
                    &raquo;
                </button>
            </nav>
        </div>
        </div>


    <div v-if="isEditModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
        @click.self="closeEditModal">

        <div class="absolute inset-0 bg-black opacity-50"></div>

        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 scale-100 opacity-100"
            @click.stop>

            <h2 class="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
                Ubah Mata Kuliah: <br><span class="text-primary">{{ selectedMatakuliah?.matkul }}</span>
            </h2>

            <button @click="closeEditModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <form v-if="selectedMatakuliah" @submit.prevent="handleSave" class="space-y-4">
                <div>
                    <label for="modal_matkul" class="block text-sm font-medium text-gray-700 mb-1">Nama Mata
                        Kuliah</label>
                    <input id="modal_matkul" type="text" v-model="selectedMatakuliah.matkul"
                        class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                        required />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="modal_semester"
                            class="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                        <input id="modal_semester" type="number" v-model.number="selectedMatakuliah.semester"
                            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                            min="1" required />
                    </div>

                    <div>
                        <label for="modal_prodi" class="block text-sm font-medium text-gray-700 mb-1">Program Studi
                            (Prodi)</label>
                        <select id="modal_prodi" v-model.number="selectedMatakuliah.prodiId"
                            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
                            required>
                            <option :value="null" disabled>Pilih Prodi</option>
                            <option v-for="prodi in getProdiOptions" :key="prodi.value" :value="prodi.value">
                                {{ prodi.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" @click="closeEditModal"
                        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm">
                        Batal
                    </button>
                    <button type="submit"
                        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md">
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    </div>


    <div v-if="isAddModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
        @click.self="closeAddModal">
        <div class="absolute inset-0 bg-black opacity-50"></div>

        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 scale-100 opacity-100"
            @click.stop>

            <h2 class="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
                Tambah Mata Kuliah Baru
            </h2>

            <button @click="closeAddModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <form @submit.prevent="handleAddSubmit" class="space-y-4">

                <div>
                    <label for="add_matkul" class="block text-sm font-medium text-gray-700 mb-1">Nama Mata
                        Kuliah</label>
                    <input id="add_matkul" type="text" v-model="newMatakuliahData.matkul"
                        class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                        required />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="add_semester" class="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                        <input id="add_semester" type="number" v-model.number="newMatakuliahData.semester"
                            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition"
                            min="1" required />
                    </div>

                    <div>
                        <label for="add_prodi_id" class="block text-sm font-medium text-gray-700 mb-1">Program Studi
                            (Prodi)</label>
                        <select id="add_prodi_id" v-model.number="newMatakuliahData.prodiId"
                            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition bg-white"
                            required>
                            <option :value="null" disabled>Pilih Prodi</option>
                            <option v-for="prodi in getProdiOptions" :key="prodi.value" :value="prodi.value">
                                {{ prodi.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" @click="closeAddModal"
                        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm">
                        Batal
                    </button>
                    <button type="submit"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md">
                        Tambah Mata Kuliah
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* Transisi sudah tidak relevan karena field statis */
</style>