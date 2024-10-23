<script setup>
import FormatBar from './items/FormatBar.vue'
import NavbarComp from './items/NavbarComp.vue'
import SearchBar from './items/SearchBar.vue'

// import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex flex-col">
    <NavbarComp />
    <div class="mx-10 my-8">
      <FormatBar />
      <SearchBar />
    </div>
    <!-- <RouterView /> -->
  </div>
</template>
