<script setup>
import { defineProps } from 'vue'

// Accept the prop
const props = defineProps({
  addNewFolder: Function,
})
</script>

<template>
  <div class="flex space-x-1 items-center py-1.5 px-2 bg-gray-100 rounded-md">
    <div class="flex gap-1">
      <div
        class="flex items-center space-x-1 cursor-pointer hover:bg-gray-500 p-2 rounded-md text-gray-600 text-sm hover:text-white group"
        @click="props.addNewFolder"
      >
        <img
          src="@/assets/icons/add.svg"
          alt="add icon"
          class="h-5 w-5 brightness-50 group-hover:brightness-0 group-hover:invert"
        />
        <p>New Folder</p>
      </div>

      <div
        class="flex items-center space-x-1 cursor-pointer hover:bg-gray-500 p-2 rounded-md text-gray-600 text-sm hover:text-white group"
      >
        <img
          src="@/assets/icons/upload.svg"
          alt="upload icon"
          class="h-5 w-5 brightness-50 group-hover:brightness-0 group-hover:invert"
        />
        <p>Upload</p>
      </div>
    </div>
    <div class="flex flex-1 justify-between">
      <div class="flex gap-1">
        <div
          class="flex items-center space-x-1 cursor-pointer hover:bg-gray-500 p-2 rounded-md text-gray-600 text-sm hover:text-white group"
        >
          <img
            src="@/assets/icons/cut.svg"
            alt="cut icon"
            class="h-5 w-5 brightness-50 group-hover:brightness-0 group-hover:invert"
          />
          <p>Cut</p>
        </div>
        <div
          class="flex items-center space-x-1 cursor-pointer hover:bg-gray-500 p-2 rounded-md text-gray-600 text-sm hover:text-white group"
        >
          <img
            src="@/assets/icons/copy.svg"
            alt="copy icon"
            class="h-5 w-5 brightness-50 group-hover:brightness-0 group-hover:invert"
          />
          <p>Copy</p>
        </div>
        <div
          class="flex items-center space-x-1 cursor-pointer hover:bg-gray-500 p-2 rounded-md text-gray-600 text-sm hover:text-white group"
        >
          <img
            src="@/assets/icons/delete.svg"
            alt="delete icon"
            class="h-5 w-5 brightness-50 group-hover:brightness-0 group-hover:invert"
          />
          <p>Delete</p>
        </div>
        <div
          class="flex items-center space-x-1 cursor-pointer hover:bg-gray-500 p-2 rounded-md text-gray-600 text-sm hover:text-white group"
        >
          <img
            src="@/assets/icons/download.svg"
            alt="download icon"
            class="h-5 w-5 brightness-50 group-hover:brightness-0 group-hover:invert"
          />
          <p>Download</p>
        </div>
        <div
          class="flex items-center space-x-1 cursor-pointer hover:bg-gray-500 p-2 rounded-md text-gray-600 text-sm hover:text-white group"
        >
          <img
            src="@/assets/icons/rename.svg"
            alt="rename icon"
            class="h-5 w-5 brightness-50 group-hover:brightness-0 group-hover:invert"
          />
          <p>Rename</p>
        </div>
      </div>
      <div class="flex px-2">
        <div
          class="flex items-center space-x-1 cursor-pointer hover:bg-gray-500 p-2 rounded-md text-gray-600 text-sm hover:text-white group"
        >
          <p>selected</p>
          <img
            src="@/assets/icons/close.svg"
            alt="rename icon"
            class="h-5 w-5 brightness-0 group-hover:brightness-0 group-hover:invert"
          />
        </div>
      </div>
    </div>
  </div>
</template>
