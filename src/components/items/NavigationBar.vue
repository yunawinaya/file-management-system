<!-- <script setup>
import { RouterLink, useRoute } from 'vue-router'

const isActiveLink = routePath => {
  const route = useRoute()
  return route.path === routePath
}
</script> -->

<template>
  <nav class="bg-gray-600 border-b border-gray-200">
    <div class="mx-auto px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
          class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Logo -->
          <a class="flex flex-shrink-0 items-center mr-4" href="index.html">
            <span class="hidden md:block text-white text-2xl font-bold ml-2"
              >File Management System</span
            >
          </a>
          <div class="md:ml-auto">
            <!-- <div class="flex space-x-2">
              <a
                href="jobs.html"
                class="bg-transparent border border-white text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                >Login</a
              >
              <a
                href="add-job.html"
                class="bg-gray-500 text-white hover:bg-gray-700 rounded-md px-3 py-2"
                >Sign up</a
              >
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
