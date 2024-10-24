<script setup>
import { defineProps } from 'vue'

// Accept the prop
const props = defineProps({
  folders: Array,
  addNewFolder: Function,
  selectedFolderId: Number,
})

const handleFileUpload = async event => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder_id', props.selectedFolderId)

  try {
    const response = await fetch(
      'https://fms-backend-neon.vercel.app/api/files',
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!response.ok) {
      throw new Error('File upload failed')
    }

    const newFile = await response.json()
    console.log('File uploaded successfully:', newFile)

    // Find the selected folder to add the new file as a child
    const findFolderById = (folders, id) => {
      for (const folder of folders) {
        if (folder.id === id) return folder
        if (folder.children) {
          const result = findFolderById(folder.children, id)
          if (result) return result
        }
      }
    }

    // Get the folder where the file was uploaded
    const targetFolder = findFolderById(props.folders, props.selectedFolderId)
    if (targetFolder) {
      // Add the new file to the folder's files array
      targetFolder.files.push(newFile)
    }
  } catch (error) {
    console.error('Error uploading file:', error)
  }
}
</script>

<template>
  <div class="flex space-x-1 items-center py-1.5 px-2 bg-gray-100 rounded-t-md">
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
        <input
          type="file"
          id="file-upload"
          class="hidden"
          @change="handleFileUpload"
        />
        <label
          for="file-upload"
          class="flex items-center space-x-1 cursor-pointer"
        >
          <img
            src="@/assets/icons/upload.svg"
            alt="upload icon"
            class="h-5 w-5 brightness-50 group-hover:brightness-0 group-hover:invert"
          />
          <p>Upload</p>
        </label>
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
