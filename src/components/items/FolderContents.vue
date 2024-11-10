<script setup>
import { defineProps, computed, ref, watch, defineEmits } from 'vue'
import pngIcon from '@/assets/icons/png.svg'
import pdfIcon from '@/assets/icons/pdf.svg'
import mp3Icon from '@/assets/icons/mp3.svg'
import mp4Icon from '@/assets/icons/mp4.svg'
import txtIcon from '@/assets/icons/txt.svg'

const props = defineProps({
  folder: {
    type: Object,
    required: true,
  },
  folderPath: {
    type: Array,
    required: true,
  },
  allFolders: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['open-folder', 'update-selected'])

const selectedItems = ref([])
const searchQuery = ref('')

const emitSelectedItems = () => {
  emit('update-selected', selectedItems.value)
}

watch(() => selectedItems.value, emitSelectedItems, { deep: true })

const searchAllFolders = (folders, query) => {
  let results = []

  folders.forEach(folder => {
    if (folder.name.toLowerCase().includes(query.toLowerCase())) {
      results.push(folder)
    }

    if (folder.files) {
      const matchedFiles = folder.files.filter(file =>
        file.name.toLowerCase().includes(query.toLowerCase()),
      )
      results = results.concat(matchedFiles)
    }

    if (folder.children) {
      results = results.concat(searchAllFolders(folder.children, query))
    }
  })

  return results
}

const folderContents = computed(() => {
  if (searchQuery.value) {
    return searchAllFolders(props.allFolders, searchQuery.value)
  } else {
    return [...(props.folder.children || []), ...(props.folder.files || [])]
  }
})

watch(
  () => props.folder,
  () => {
    selectedItems.value = []
  },
)

const getFileIcon = fileType => {
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

  const index = selectedItems.value.findIndex(
    selectedItem => selectedItem.id === item.id,
  )
  if (index !== -1) {
    selectedItems.value = [
      ...selectedItems.value.slice(0, index),
      ...selectedItems.value.slice(index + 1),
    ]
  } else {
    selectedItems.value = [...selectedItems.value, item]
  }
}

const handleRowClick = (item, event) => {
  event.stopPropagation()
  toggleSelectItem(item, event)
}

const handleDoubleClick = item => {
  if (item.type === 'folder') {
    emit('open-folder', item)
  }
}

const toggleSelectAll = () => {
  if (selectedItems.value.length === folderContents.value.length) {
    selectedItems.value = []
  } else {
    selectedItems.value = [...folderContents.value]
  }
}

const areAllSelected = computed(() => {
  return (
    folderContents.value.length > 0 &&
    selectedItems.value.length === folderContents.value.length
  )
})

const navigateToFolder = folder => {
  emit('open-folder', folder)
}
</script>

<template>
  <div class="border-l border-gray-200 min-h-full">
    <div
      class="p-3 bg-gray-50 flex justify-between items-center border-b border-gray-300"
    >
      <nav class="flex items-center text-sm text-gray-600">
        <span
          v-for="(folder, index) in folderPath"
          :key="folder.id"
          class="flex items-center"
        >
          <span
            class="cursor-pointer hover:text-blue-600 transition-colors duration-200"
            @click="navigateToFolder(folder)"
          >
            {{ folder.name }}
          </span>
          <span v-if="index < folderPath.length - 1" class="mx-2 text-gray-400"
            >/</span
          >
        </span>
      </nav>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
    </div>

    <table class="w-full table-auto border-collapse" v-resizable>
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 text-left w-5 relative">
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
            'bg-blue-50': selectedItems.some(
              selectedItem => selectedItem.id === item.id,
            ),
          }"
          @click="event => handleRowClick(item, event)"
          @dblclick="handleDoubleClick(item)"
        >
          <td class="p-2" @click.stop>
            <input
              type="checkbox"
              :checked="
                selectedItems.some(selectedItem => selectedItem.id === item.id)
              "
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
