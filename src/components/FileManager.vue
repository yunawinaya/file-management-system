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
      'https://fms-backend-neon.vercel.app/api/folders',
    )
    const data = await response.json()
    console.log('Fetched Data:', data)

    folders.value = data

    const rootFolder = folders.value.find(
      folder => folder.name === 'Files' && folder.parent_id === null,
    )
    if (rootFolder) {
      rootFolder.open = true
      selectedFolderId.value = rootFolder.id
    }
  } catch (error) {
    console.error('Error fetching folders:', error)
  }
})

const selectedFolderId = ref(0)
const showModal = ref(false)
const newFolderName = ref('')

const selectedItems = ref([])

const updateSelectedItems = items => {
  selectedItems.value = items
}

const selectFolder = folder => {
  if (selectedFolderId.value === folder.id) {
    folder.open = !folder.open
  } else {
    folder.open = true
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

const createNewFolder = async name => {
  if (selectedFolderId.value === null || !name.trim()) return

  try {
    const response = await fetch(
      'https://fms-backend-neon.vercel.app/api/folders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          parent_id: selectedFolderId.value,
        }),
      },
    )

    if (!response.ok) {
      throw new Error('Error creating folder')
    }

    const newFolder = await response.json()

    // Find the selected folder to add the new folder as a child
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

    if (selectedFolder) {
      newFolder.children = []
      newFolder.files = []
      selectedFolder.children.push(newFolder)
      selectedFolder.lastModified = new Date().toISOString()
    }

    showModal.value = false
  } catch (error) {
    console.error('Error creating new folder:', error)
  }
}

const selectedFolder = computed(() => {
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
      <FormatBar
        :addNewFolder="openAddFolderModal"
        :selectedFolderId="selectedFolderId"
        :folders="folders"
        :selectedItems="selectedItems"
      />
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
            @update-selected="updateSelectedItems"
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
