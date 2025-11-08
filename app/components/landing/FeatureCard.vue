<template>
  <div
    class="
      bg-green-100/60 p-8 rounded-2xl
      flex flex-col items-center justify-center space-y-4
      cursor-pointer hover:bg-green-200 transition-all
      w-64 h-64 shadow-md hover:shadow-xl
    "
  >
    <div class="text-gray-800">
      <slot name="icon"></slot>
    </div>

    <span class="text-xl font-semibold text-gray-800">
      <slot></slot>
    </span>
  </div>
</template>