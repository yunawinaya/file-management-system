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

// Reactive state for selected items
const selectedItems = ref(new Set())

// Computed property to get both files and folders in the current folder
const folderContents = computed(() => {
  return props.folder ? props.folder.children : []
})

// Watch for changes in the folder prop to reset selected items when switching folders
watch(
  () => props.folder,
  () => {
    selectedItems.value.clear() // Clear selected items when the folder changes
  },
)

// Utility function to get the icon based on the file type
const getFileIcon = fileType => {
  switch (fileType) {
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
      return '@/assets/icons/default.svg'
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

// Function to handle item selection
const toggleSelectItem = (item, event) => {
  event.stopPropagation() // Prevent click event from propagating to parent
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
    // If all items are selected, deselect all
    selectedItems.value.clear()
  } else {
    // Otherwise, select all items
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
          class="border-t hover:bg-gray-50 cursor-pointer"
          :class="{
            'bg-blue-100 hover:bg-blue-100': selectedItems.has(item.id),
          }"
          @click="event => handleRowClick(item, event)"
          @dblclick="handleDoubleClick(item)"
        >
          <td class="p-2" @click.stop>
            <input
              type="checkbox"
              :checked="selectedItems.has(item.id)"
              @change.stop="() => toggleSelectItem(item)"
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
              :src="getFileIcon(item.name.split('.').pop())"
              alt="file icon"
              class="h-5 w-5"
            />
          </td>
          <td class="p-2 text-sm">{{ item.name }}</td>
          <td class="p-2 text-sm">{{ item.lastModified }}</td>
          <td class="p-2 text-sm">
            {{ item.type === 'file' ? formatSize(item.size) : '-' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
