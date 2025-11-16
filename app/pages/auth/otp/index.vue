<script setup>
import { ref, nextTick } from 'vue'
import { ResetPassword } from '~/lib/api/auth'

const otpInputs = ref([])
const otp = ref(['', '', '', '', '', ''])

// Auto focus ke input berikutnya
const handleInput = async (index, event) => {
  const value = event.target.value
  
  if (value && index < 5) {
    await nextTick()
    otpInputs.value[index + 1]?.focus()
  }
}

// Handle backspace untuk fokus ke input sebelumnya
const handleKeydown = async (index, event) => {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    await nextTick()
    otpInputs.value[index - 1]?.focus()
  }
}

// Handle paste
const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').slice(0, 6)
  
  pastedData.split('').forEach((char, index) => {
    if (index < 6 && /^\d$/.test(char)) {
      otp.value[index] = char
    }
  })
}

const submitOTP = async () => {
  const otpValue = otp.value.join('')
  try {
    const response = await ResetPassword(otpValue, newPassword);

  } catch (error) {
    console.error("Error during OTP submission:", error);
  }
  // Handle OTP submission
}
</script>

<template>
    <div
    class="bg-primary w-full h-screen flex flex-col items-center justify-center"
  >
    <div class="bg-white p-8 rounded-xl shadow-md max-w-3xl">
      <h1 class="text-[#258D5C] font-bold text-8xl justify-center flex">
        e-LABS+
      </h1>
      <span class="text-[#258D5C] justify-center flex"
        >Electronic Labs & Assets Borrowing System</span
      >

      <form @submit.prevent="submitOTP">
        <!-- OTP Input -->
        <div class="mt-10">
          <label class="block text-sm font-medium text-gray-700 mb-4 text-center">
            Masukkan Kode OTP
          </label>
          <p class="text-sm text-gray-500 text-center mb-6">
            Kami telah mengirimkan kode verifikasi ke email Anda
          </p>
          
          <div class="flex items-center justify-center gap-3">
            <!-- Group 1 (3 input) -->
            <div class="flex gap-2">
              <input 
                v-for="i in 3" 
                :key="i-1"
                v-model="otp[i-1]"
                :ref="el => otpInputs[i-1] = el"
                type="text" 
                maxlength="1" 
                inputmode="numeric"
                pattern="[0-9]"
                @input="handleInput(i-1, $event)"
                @keydown="handleKeydown(i-1, $event)"
                @paste="handlePaste"
                class="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                placeholder="0"
              />
            </div>
    
            <!-- Separator -->
            <span class="text-3xl font-bold text-gray-300 mx-1">-</span>
    
            <!-- Group 2 (3 input) -->
            <div class="flex gap-2">
              <input 
                v-for="i in 3" 
                :key="i+2"
                v-model="otp[i+2]"
                :ref="el => otpInputs[i+2] = el"
                type="text" 
                maxlength="1" 
                inputmode="numeric"
                pattern="[0-9]"
                @input="handleInput(i+2, $event)"
                @keydown="handleKeydown(i+2, $event)"
                @paste="handlePaste"
                class="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <!-- Resend OTP -->
          <div class="text-center mt-6">
            <p class="text-sm text-gray-600">
              Tidak menerima kode? 
              <button type="button" class="text-primary font-semibold hover:underline ml-1">
                Kirim Ulang
              </button>
            </p>
          </div>
        </div>

        <button
          type="submit"
          class="mt-8 bg-primary text-white px-4 py-4 rounded-xl hover:bg-green-700 transition w-full font-semibold text-lg shadow-md hover:shadow-lg">
          Verifikasi OTP
        </button>
      </form>



      
      
    </div>
  </div>
</template>