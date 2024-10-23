<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  files: Array,
})

// Method to format file size from bytes to a more readable format (KB, MB, etc.)
const formatSize = size => {
  if (size < 1024) return `${size} bytes`
  if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`
  if (size < 1073741824) return `${(size / 1048576).toFixed(1)} MB`
  return `${(size / 1073741824).toFixed(1)} GB`
}

// Method to format the modified date and time
const formatDateTime = dateTime => {
  const date = new Date(dateTime)
  return date.toLocaleString()
}
</script>

<template>
  <div class="mt-6 border border-gray-200 rounded-md p-4">
    <table class="min-w-full border-collapse">
      <thead class="bg-gray-100">
        <tr>
          <th class="py-2 px-4">Select</th>
          <th class="py-2 px-4">Icon</th>
          <th class="py-2 px-4">Name</th>
          <th class="py-2 px-4">Modified</th>
          <th class="py-2 px-4">Size</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="file in files" :key="file.id" class="hover:bg-gray-50">
          <td class="py-2 px-4 text-center">
            <input type="checkbox" />
          </td>
          <td class="py-2 px-4">
            <img
              :src="`@/assets/icons/${file.fileType.replace('.', '')}.svg`"
              :alt="`${file.fileType} icon`"
              class="h-5 w-5"
            />
          </td>
          <td class="py-2 px-4">{{ file.name }}</td>
          <td class="py-2 px-4">{{ formatDateTime(file.lastModified) }}</td>
          <td class="py-2 px-4">{{ formatSize(file.size) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
