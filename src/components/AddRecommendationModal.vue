<script setup lang="ts">
import type { IRecommendation } from '../types/recommendation'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add', recommendation: IRecommendation): void
}>()

// ... logique du formulaire
</script>

<template>
  <div class="md:w-2/4 flex p-4 md:m-4 md:shadow-lg z-900 fixed top-11 left-0 bg-white z-50">
    <!-- Contenu du modal -->
    <h2 class="text-2xl font-bold mb-4">Add New Recommendation</h2>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          v-model="form.title"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      <div>
        <label for="link" class="block text-sm font-medium text-gray-700">Link</label>
        <input
          type="url"
          id="link"
          v-model="form.link"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          v-model="form.category"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="Movie">Movie</option>
          <option value="Book">Book</option>
          <option value="Music">Music</option>
          <option value="Podcast">Podcast</option>
        </select>
      </div>
      <div>
        <label for="tag" class="block text-sm font-medium text-gray-700">Tag</label>
        <input
          type="text"
          id="tag"
          v-model="form.tag"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Recommendation
        </button>
      </div>
    </form>
  </div>
</template>
