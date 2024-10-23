<script setup>
import DirectoryTab from './items/DirectoryTab.vue'
import FormatBar from './items/FormatBar.vue'
import NavbarComp from './items/NavbarComp.vue'
import SearchBar from './items/SearchBar.vue'
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

// Reactive state for the currently selected folder
const selectedFolderId = ref(null)

// Method to select the folder and toggle its open/close state
const selectFolder = folder => {
  selectedFolderId.value = folder.id
  folder.open = !folder.open
}

// Method to add a new folder to the selected folder
const addNewFolder = () => {
  if (selectedFolderId.value === null) return

  // Find the selected folder
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
    // Add a new folder with a unique ID and default name
    const newFolderId = Date.now() // Unique ID based on timestamp
    const currentDate = new Date().toISOString().split('T')[0] // Get current date in YYYY-MM-DD format
    const newFolder = {
      id: newFolderId,
      name: `New Folder ${newFolderId}`,
      type: 'folder',
      dateCreated: currentDate,
      lastModified: currentDate, // Set lastModified to the current date
      parentId: selectedFolder.id, // Set parentId to the ID of the selected folder
      open: false,
      children: [],
    }

    selectedFolder.children.push(newFolder)

    // Update the lastModified date of the parent folder to the current date
    selectedFolder.lastModified = currentDate
  }
}
</script>

<template>
  <div class="flex flex-col">
    <NavbarComp />
    <div class="border border-gray-200 rounded-md mx-10 my-8">
      <FormatBar :addNewFolder="addNewFolder" />
      <SearchBar />
      <div class="border-t border-gray-200 min-h-screen">
        <DirectoryTab
          :folders="folders"
          :selectedFolderId="selectedFolderId"
          :selectFolder="selectFolder"
        />
      </div>
    </div>
  </div>
</template>
