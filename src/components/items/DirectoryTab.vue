<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  folders: Array,
  selectedFolderId: Number,
  selectFolder: Function,
})

// Method to filter only folders (those with children)
const folderOnly = computed(() => {
  return props.folders.filter(folder => folder.children)
})
</script>

<template>
  <div>
    <div v-for="folder in folderOnly" :key="folder.id">
      <div
        class="flex items-center"
        @click="() => props.selectFolder(folder)"
        :class="[
          'p-2 cursor-pointer',
          folder.id === props.selectedFolderId
            ? 'bg-blue-200 text-blue-800'
            : 'hover:bg-gray-200 text-gray-800',
        ]"
      >
        <svg
          v-if="folder.children && folder.children.length"
          :class="{ 'transform rotate-90': folder.open }"
          class="h-4 w-4 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
        <img
          src="@/assets/icons/folder.svg"
          alt="add icon"
          class="h-5 w-5 ml-2"
        />
        <p class="ml-2">{{ folder.name }}</p>
      </div>

      <div v-if="folder.open" class="ml-4">
        <DirectoryTab
          :folders="folder.children"
          :selectedFolderId="props.selectedFolderId"
          :selectFolder="props.selectFolder"
        />
      </div>
    </div>
  </div>
</template>
