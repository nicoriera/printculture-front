<script setup lang="ts">
import HeaderApp from '../components/HeaderApp.vue'
</script>
<template>
  <HeaderApp />
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
      <div class="mx-auto mb-8 max-w-screen-sm lg:mb-16">
        <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          PRINT TEAM
        </h2>
        <p class="font-light text-gray-500 sm:text-xl dark:text-gray-400">
          Connect with our print mate.
        </p>
      </div>
      <div class="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
        <div class="text-center text-gray-500 dark:text-gray-400">
          <img
            class="mx-auto mb-4 w-36 h-36 rounded-full"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
            alt="Bonnie Avatar"
          />
          <h3 class="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            <a href="#">Bonnie Green</a>
          </h3>
        </div>
        <div class="text-center text-gray-500 dark:text-gray-400">
          <img
            class="mx-auto mb-4 w-36 h-36 rounded-full"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png"
            alt="Helene Avatar"
          />
          <h3 class="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            <a href="#">Helene Engels</a>
          </h3>
        </div>
      </div>
    </div>
  </section>
</template>
