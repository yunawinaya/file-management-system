<script setup>
import FolderDirectory from './items/FolderDirectory.vue'
import FormatBar from './items/FormatBar.vue'
import NavigationBar from './items/NavigationBar.vue'
import SearchBar from './items/SearchBar.vue'
import NewFolderModal from './items/NewFolderModal.vue'
import { computed, onMounted, ref } from 'vue'
import FolderContents from './items/FolderContents.vue'

const folders = ref([])

onMounted(async () => {
  try {
    const response = await fetch(
      'https://fms-backend-blush.vercel.app/api/folders',
    )
    folders.value = await response.json()
    console.log(folders)
  } catch (error) {
    console.error('Error fetching folders:', error)
  }
})

const selectedFolderId = ref(0)
const showModal = ref(false)
const newFolderName = ref('')

const selectFolder = folder => {
  if (selectedFolderId.value === folder.id) {
    folder.open = !folder.open
  } else {
    selectedFolderId.value = folder.id
  }
}

const openFolder = folder => {
  folder.open = true
  selectedFolderId.value = folder.id
}

const openAddFolderModal = () => {
  showModal.value = true
  newFolderName.value = ''
}

const createNewFolder = name => {
  if (selectedFolderId.value === null || !name.trim()) return

  const findFolderById = (folders, id) => {
    for (const folder of folders) {
      if (folder.id === id) return folder
      if (folder.children) {
        const result = findFolderById(folder.children, id)
        if (result) return result
      }
    }
  }

  const selectedFolder = findFolderById(folders.value, selectedFolderId.value)

  if (selectedFolder && selectedFolder.type === 'folder') {
    const newFolderId = Date.now()
    const currentDate = new Date().toISOString().split('T')[0]
    const newFolder = {
      id: newFolderId,
      name: name,
      type: 'folder',
      dateCreated: currentDate,
      lastModified: currentDate,
      parentId: selectedFolder.id,
      open: false,
      children: [],
    }

    selectedFolder.children.push(newFolder)
    selectedFolder.lastModified = currentDate

    showModal.value = false
  }
}

const selectedFolder = computed(() => {
  // Function to find the selected folder
  const findFolderById = (folders, id) => {
    for (const folder of folders) {
      if (folder.id === id) return folder
      if (folder.children) {
        const result = findFolderById(folder.children, id)
        if (result) return result
      }
    }
  }

  return findFolderById(folders.value, selectedFolderId.value)
})

const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <div class="flex flex-col">
    <NavigationBar />
    <div class="border border-gray-200 rounded-md mx-10 my-8">
      <FormatBar :addNewFolder="openAddFolderModal" />
      <SearchBar />
      <div class="flex border-t border-gray-200 min-h-screen w-full">
        <div class="w-1/3">
          <FolderDirectory
            :folders="folders"
            :selectedFolderId="selectedFolderId"
            :selectFolder="selectFolder"
          />
        </div>
        <div class="w-2/3">
          <FolderContents
            v-if="selectedFolder"
            :folder="selectedFolder"
            @open-folder="openFolder"
          />
        </div>
      </div>
    </div>

    <NewFolderModal
      :showModal="showModal"
      :newFolderName="newFolderName"
      @close="closeModal"
      @create="createNewFolder"
    />
  </div>
</template>
