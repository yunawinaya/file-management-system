<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  folders: Array,
  selectedFolderId: Number,
  selectFolder: Function,
})

const folderOnly = computed(() => {
  return props.folders.filter(folder => folder.type === 'folder')
})

const handleClick = folder => {
  props.selectFolder(folder)
}
</script>

<template>
  <div>
    <div v-for="folder in folderOnly" :key="folder.id">
      <div
        class="flex items-center w-full cursor-pointer p-2 border-l-4"
        @click="handleClick(folder)"
        :class="[
          folder.id === props.selectedFolderId
            ? 'border-gray-700 bg-gray-500 text-white'
            : 'border-transparent hover:bg-gray-200 text-gray-800',
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
          alt="folder icon"
          class="h-5 w-5 ml-2"
        />
        <p class="ml-2">{{ folder.name }}</p>
      </div>

      <div v-if="folder.open" class="pl-6">
        <FolderDirectory
          :folders="folder.children"
          :selectedFolderId="props.selectedFolderId"
          :selectFolder="props.selectFolder"
        />
      </div>
    </div>
  </div>
</template>
