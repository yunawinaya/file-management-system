<script setup>
import { defineProps, ref, computed } from 'vue'
import { useToast } from './useToast'
import DeleteModal from './DeleteModal.vue'
import RenameModal from './RenameModal.vue'

// Accept the props
const props = defineProps({
  folders: Array,
  addNewFolder: Function,
  selectedFolderId: Number,
  selectedItems: Array,
})

const { addToast } = useToast()

const showModal = ref(false)
const showRenameModal = ref(false)
const modalMessage = ref('')
const modalTitle = ref('')
const renameTitle = ref('')
const newName = ref('')

const isItemSelected = computed(() => props.selectedItems.length > 0)
const selectedItemCount = computed(() => props.selectedItems.length)

const handleFileUpload = async event => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder_id', props.selectedFolderId)

  addToast('Uploading file...', 'info', 3000)

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

    addToast('File uploaded successfully!', 'success', 3000)

    // Update the folder with the new file
    const findFolderById = (folders, id) => {
      for (const folder of folders) {
        if (folder.id === id) return folder
        if (folder.children) {
          const result = findFolderById(folder.children, id)
          if (result) return result
        }
      }
    }

    const targetFolder = findFolderById(props.folders, props.selectedFolderId)
    if (targetFolder) {
      targetFolder.files.push(newFile)
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    addToast('Error uploading file. Please try again.', 'error', 3000)
  }
}

const deleteSelectedItems = () => {
  if (props.selectedItems.length === 0) {
    addToast('No items selected for deletion.', 'info', 3000)
    return
  }

  const itemCount = props.selectedItems.length
  if (itemCount === 1) {
    // Single item deletion message
    const itemType =
      props.selectedItems[0].type === 'folder' ? 'Folder' : 'File'
    modalMessage.value = `Are you sure you want to delete this ${itemType.toLowerCase()}?`
    modalTitle.value = itemType
  } else {
    // Multiple items deletion message
    modalMessage.value = `Are you sure you want to delete these ${itemCount} items?`
    modalTitle.value = 'Items'
  }

  showModal.value = true // Show the modal
}

const confirmDeletion = async () => {
  showModal.value = false

  for (const item of props.selectedItems) {
    const type = item.type === 'folder' ? 'folders' : 'files'
    try {
      addToast(`Deleting ${item.name}...`, 'info')
      const response = await fetch(
        `https://fms-backend-neon.vercel.app/api/${type}/${item.id}`,
        {
          method: 'DELETE',
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`)
      }

      addToast(`${item.name} deleted successfully!`, 'success')

      // Update UI: Remove the item from the folders array if necessary
      const findFolderById = (folders, id) => {
        for (const folder of folders) {
          if (folder.id === id) return folder
          if (folder.children) {
            const result = findFolderById(folder.children, id)
            if (result) return result
          }
        }
      }

      if (item.type === 'folder') {
        const parentFolder = findFolderById(props.folders, item.parent_id)
        if (parentFolder) {
          const index = parentFolder.children.findIndex(f => f.id === item.id)
          if (index !== -1) {
            parentFolder.children.splice(index, 1)
          }
        }
      } else {
        const folder = findFolderById(props.folders, item.folder_id)
        if (folder) {
          const index = folder.files.findIndex(f => f.id === item.id)
          if (index !== -1) {
            folder.files.splice(index, 1)
          }
        }
      }
    } catch (error) {
      console.error(error)
      addToast(`Error deleting ${item.name}. Please try again.`, 'error')
    }
  }
}

const renameSelectedItem = () => {
  if (props.selectedItems.length !== 1) {
    addToast('Please select only one item to rename.', 'error', 3000)
    return
  }

  const selectedItem = props.selectedItems[0]
  const itemType = selectedItem.type === 'folder' ? 'Folder' : 'File'
  renameTitle.value = itemType
  newName.value = selectedItem.name
  showRenameModal.value = true
}

const confirmRename = async newNameValue => {
  if (!newNameValue.trim()) {
    addToast('Name cannot be empty.', 'error', 3000)
    return
  }

  showRenameModal.value = false

  const selectedItem = props.selectedItems[0]
  const type = selectedItem.type === 'folder' ? 'folders' : 'files'

  try {
    addToast(`Renaming ${selectedItem.name}...`, 'info')

    const response = await fetch(
      `https://fms-backend-neon.vercel.app/api/${type}/${selectedItem.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newNameValue.trim() }),
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to rename ${type}`)
    }

    const updatedItem = await response.json()
    addToast(`${updatedItem.name} renamed successfully!`, 'success')

    // Update the folders array with the new name directly
    if (selectedItem.type === 'folder') {
      selectedItem.name = updatedItem.name
    } else {
      selectedItem.name = updatedItem.name
    }

    // Trigger any necessary reactivity updates
  } catch (error) {
    console.error(error)
    addToast(`Error renaming ${selectedItem.name}. Please try again.`, 'error')
  }
}

const cancelRename = () => {
  showRenameModal.value = false
}

const cancelDeletion = () => {
  showModal.value = false
}
</script>

<template>
  <div class="flex space-x-1 items-center py-1.5 px-2 bg-gray-100 rounded-t-md">
    <div v-if="!isItemSelected" class="flex gap-1">
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

    <div v-else class="flex flex-1 justify-between items-center">
      <div class="flex gap-1">
        <!-- <div
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
        </div> -->
        <div
          class="flex items-center space-x-1 cursor-pointer hover:bg-gray-500 p-2 rounded-md text-gray-600 text-sm hover:text-white group"
          @click="deleteSelectedItems"
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
          @click="renameSelectedItem"
        >
          <img
            src="@/assets/icons/rename.svg"
            alt="rename icon"
            class="h-5 w-5 brightness-50 group-hover:brightness-0 group-hover:invert"
          />
          <p>Rename</p>
        </div>
      </div>
      <div class="text-sm text-gray-600 p-2">
        {{ selectedItemCount }} item(s) selected
      </div>
    </div>

    <DeleteModal
      :visible="showModal"
      :title="modalTitle"
      :message="modalMessage"
      @confirm="confirmDeletion"
      @cancel="cancelDeletion"
    />
    <RenameModal
      :visible="showRenameModal"
      :title="renameTitle"
      :name="newName"
      @update:name="value => (newName.value = value)"
      @confirm="confirmRename"
      @cancel="cancelRename"
    />
  </div>
</template>
