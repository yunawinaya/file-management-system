<script setup>
import FolderDirectory from './items/FolderDirectory.vue'
import FormatBar from './items/FormatBar.vue'
import NavigationBar from './items/NavigationBar.vue'
import SearchBar from './items/SearchBar.vue'
import NewFolderModal from './items/NewFolderModal.vue'
import { ref } from 'vue'

// Initial folder data
const folders = ref([
  {
    id: 0,
    name: 'Files',
    type: 'folder',
    dateCreated: '2024-10-01',
    lastModified: '2024-10-01',
    open: true,
    parentId: null,
    children: [
      {
        id: 1,
        name: 'Documents',
        type: 'folder',
        dateCreated: '2024-10-02',
        lastModified: '2024-10-02',
        open: false,
        parentId: 0,
        children: [
          {
            id: 2,
            name: 'Projects',
            type: 'folder',
            dateCreated: '2024-10-05',
            lastModified: '2024-10-05',
            open: false,
            parentId: 1,
            children: [
              {
                id: 3,
                name: 'Vue App.txt',
                type: 'file',
                fileType: '.txt',
                dateCreated: '2024-10-06',
                lastModified: '2024-10-06',
                size: 2048, // size in bytes
                parentId: 2,
              },
              {
                id: 4,
                name: 'React App.pdf',
                type: 'file',
                fileType: '.pdf',
                dateCreated: '2024-10-06',
                lastModified: '2024-10-06',
                size: 1048576, // size in bytes
                parentId: 2,
              },
            ],
          },
          {
            id: 5,
            name: 'Resume.pdf',
            type: 'file',
            fileType: '.pdf',
            dateCreated: '2024-10-03',
            lastModified: '2024-10-03',
            size: 512000, // size in bytes
            parentId: 1,
          },
        ],
      },
      {
        id: 6,
        name: 'Pictures',
        type: 'folder',
        dateCreated: '2024-10-04',
        lastModified: '2024-10-04',
        open: false,
        parentId: 0,
        children: [
          {
            id: 7,
            name: 'Vacation.jpg',
            type: 'file',
            fileType: '.jpg',
            dateCreated: '2024-10-05',
            lastModified: '2024-10-05',
            size: 307200, // size in bytes
            parentId: 6,
          },
          {
            id: 8,
            name: 'Family.png',
            type: 'file',
            fileType: '.png',
            dateCreated: '2024-10-05',
            lastModified: '2024-10-05',
            size: 204800, // size in bytes
            parentId: 6,
          },
        ],
      },
      {
        id: 9,
        name: 'Music',
        type: 'folder',
        dateCreated: '2024-10-05',
        lastModified: '2024-10-05',
        open: false,
        parentId: 0,
        children: [
          {
            id: 10,
            name: 'Song.mp3',
            type: 'file',
            fileType: '.mp3',
            dateCreated: '2024-10-06',
            lastModified: '2024-10-06',
            size: 5242880, // size in bytes
            parentId: 9,
          },
        ],
      },
      {
        id: 11,
        name: 'Videos',
        type: 'folder',
        dateCreated: '2024-10-06',
        lastModified: '2024-10-06',
        open: false,
        parentId: 0,
        children: [
          {
            id: 12,
            name: 'Travel Vlog.mp4',
            type: 'file',
            fileType: '.mp4',
            dateCreated: '2024-10-06',
            lastModified: '2024-10-06',
            size: 10485760, // size in bytes
            parentId: 11,
          },
          {
            id: 13,
            name: 'Tutorial.mov',
            type: 'file',
            fileType: '.mov',
            dateCreated: '2024-10-06',
            lastModified: '2024-10-06',
            size: 15728640, // size in bytes
            parentId: 11,
          },
        ],
      },
    ],
  },
])

const selectedFolderId = ref(0)
const showModal = ref(false)
const newFolderName = ref('')

const selectFolder = folder => {
  if (selectedFolderId.value === folder.id) {
    // If the folder is already selected, toggle its open/close state
    folder.open = !folder.open
  } else {
    // If it's not selected, select it without toggling its state
    selectedFolderId.value = folder.id
  }
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
      <div class="border-t border-gray-200 min-h-screen">
        <FolderDirectory
          :folders="folders"
          :selectedFolderId="selectedFolderId"
          :selectFolder="selectFolder"
        />
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
