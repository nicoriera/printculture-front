<script setup lang="ts"></script>
<template>
  <div
    class="flex-auto w-1/3 movie-card my-2 border inline-flex flex-col p-4 border-gray-200 rounded-lg shadow-sm hover:bg-blue-100 cursor-pointer hover:shadow-lg transition duration-300 ease-in-out overflow-y-auto"
    v-for="movie in apiResponse"
    :key="movie?.id"
  >
    <h3 class="font-medium mr-2">{{ movie?.title }}</h3>
    <p class="text-gray-500 truncate">{{ movie?.description }}</p>
    <div class="flex gap-2 mt-2">
      <button
        class="bg-blue-600 h-4 w-4 rounded-full cursor-pointer hover:bg-blue-700"
        @click="updateData(movie)"
      ></button>
      <button
        class="bg-red-600 h-4 w-4 rounded-full cursor-pointer hover:bg-red-700"
        @click="fetchDeleteRecomendation(movie)"
      ></button>
    </div>
  </div>
</template>
