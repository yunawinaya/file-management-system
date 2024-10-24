<script setup>
import { defineProps, computed, ref, watch, defineEmits } from 'vue'
import pngIcon from '@/assets/icons/png.svg'
import pdfIcon from '@/assets/icons/pdf.svg'
import mp3Icon from '@/assets/icons/mp3.svg'
import mp4Icon from '@/assets/icons/mp4.svg'
import txtIcon from '@/assets/icons/txt.svg'

// Define props to accept the folder contents
const props = defineProps({
  folder: Object,
})

// Define emits for communicating with the parent component
const emit = defineEmits(['open-folder'])

const selectedItems = ref(new Set())

const folderContents = computed(() => {
  return [...(props.folder.children || []), ...(props.folder.files || [])]
})

watch(
  () => props.folder,
  () => {
    selectedItems.value.clear()
  },
)

// Utility function to get the icon based on the file type
const getFileIcon = fileType => {
  // Remove dot if present
  const cleanedFileType = fileType?.replace('.', '')

  switch (cleanedFileType) {
    case 'jpg':
    case 'png':
      return pngIcon
    case 'pdf':
      return pdfIcon
    case 'mp3':
      return mp3Icon
    case 'mp4':
    case 'mov':
      return mp4Icon
    case 'txt':
      return txtIcon
    default:
      return new URL('@/assets/icons/default.svg', import.meta.url).href
  }
}

// Utility function to format file sizes
const formatSize = size => {
  if (size === undefined) return ''
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

const formatDate = dateStr => {
  const date = new Date(dateStr)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

const toggleSelectItem = (item, event = null) => {
  if (event) {
    event.stopPropagation()
  }

  if (selectedItems.value.has(item.id)) {
    selectedItems.value.delete(item.id)
  } else {
    selectedItems.value.add(item.id)
  }
}

// Function to handle row click and select the item
const handleRowClick = (item, event) => {
  event.stopPropagation()
  toggleSelectItem(item, event)
}

// Function to handle row double-click to open a folder
const handleDoubleClick = item => {
  if (item.type === 'folder') {
    emit('open-folder', item) // Emit the event to open the folder
  }
}

// Function to handle selecting or deselecting all items
const toggleSelectAll = () => {
  if (selectedItems.value.size === folderContents.value.length) {
    selectedItems.value.clear()
  } else {
    folderContents.value.forEach(item => selectedItems.value.add(item.id))
  }
}

// Computed property to check if all items are selected
const areAllSelected = computed(() => {
  return (
    folderContents.value.length > 0 &&
    selectedItems.value.size === folderContents.value.length
  )
})
</script>

<template>
  <div class="border-l border-gray-200 min-h-full">
    <table class="w-full table-auto border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 text-left w-5">
            <input
              type="checkbox"
              :checked="areAllSelected"
              @change="toggleSelectAll"
            />
          </th>
          <th class="p-2 text-left">
            <img
              src="@/assets/icons/folder.svg"
              alt="folder icon"
              class="h-5 w-5"
            />
          </th>
          <th class="p-2 text-left">Name</th>
          <th class="p-2 text-left">Modified</th>
          <th class="p-2 text-left">Size</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in folderContents"
          :key="item.id"
          class="border-t hover:bg-blue-50 cursor-pointer"
          :class="{
            'bg-blue-50': selectedItems.has(item.id),
          }"
          @click="event => handleRowClick(item, event)"
          @dblclick="handleDoubleClick(item)"
        >
          <td class="p-2" @click.stop>
            <input
              type="checkbox"
              :checked="selectedItems.has(item.id)"
              @change.stop="event => toggleSelectItem(item, event)"
            />
          </td>
          <td class="p-2">
            <img
              v-if="item.type === 'folder'"
              src="@/assets/icons/folder.svg"
              alt="folder icon"
              class="h-5 w-5"
            />
            <img
              v-else
              :src="getFileIcon(item.file_type)"
              alt="file icon"
              class="h-5 w-5"
            />
          </td>
          <td class="p-2 text-sm">{{ item.name }}</td>
          <td class="p-2 text-sm">{{ formatDate(item.last_modified) }}</td>
          <td class="p-2 text-sm">
            {{ item.size ? formatSize(item.size) : '-' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
