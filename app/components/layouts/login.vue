<script setup>
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { Login } from '~/lib/api'
import { useRouter } from 'vue-router'

const email = ref("")
const password = ref("")
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
    loading.value = true
    try {
        const response = await Login(email.value, password.value)
        console.log(response)
        Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You have been logged in successfully!',
        })
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data))

        // Redirect to dashboard or another page
        router.push('/admin/dashboard')
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password. Please try again.',
        })
        console.log(error)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="bg-primary w-full h-screen flex flex-col items-center justify-center">
        <div class="bg-white p-8 rounded-xl shadow-md max-w-3xl">
            <h1 class="text-[#258D5C] font-bold text-8xl justify-center flex">e-LABS+</h1>
            <span class="text-[#258D5C] justify-center flex">Electronic Labs & Assets Borrowing System</span>

            <form @submit.prevent="handleLogin">
                <div class="mt-10">
                    <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                    <input v-model="email" type="text" id="username" class="mt-2 block w-full px-3 py-3 border rounded-xl">
                </div>

                <div class="mt-6">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input v-model="password" type="password" id="password" class="mt-2 block w-full px-3 py-3 border rounded-xl">
                </div>

                <div class="mt-6">
                    <button
                    :disabled="loading"
                     type="submit" class="w-full py-4 rounded-xl text-white bg-primary ">
                     {{ loading ? 'Logging in...' : 'Login' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
