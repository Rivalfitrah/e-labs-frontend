<script>

</script>

<template>
    <div class="bg-primary w-full h-screen flex flex-col items-center justify-center">
        <div class="bg-white p-8 rounded-xl shadow-md max-w-3xl">
            <h1 class="text-[#258D5C] font-bold text-8xl justify-center flex">e-LABS+</h1>
            <span class="text-[#258D5C] justify-center flex">Electronic Labs & Assets Borrowing System</span>
            <form action="">
                <div class="mt-10">
                    <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                    <input type="text" name="username" id="username" autocomplete="username" class="font-sans mt-2 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                </div>
                <div class="mt-6">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" id="password" autocomplete="current-password" class="font-sans mt-2 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                </div>
                <div class="mt-6">
                    <button type="submit" class="font-sans w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>