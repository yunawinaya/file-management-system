<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  showModal: Boolean,
  newFolderName: String,
})

const emit = defineEmits(['close', 'create'])

const localFolderName = ref('')
const showError = ref(false)

// Watch for changes in the prop value and update the local state accordingly
watch(
  () => props.newFolderName,
  newValue => {
    localFolderName.value = newValue
  },
)

// Watch for changes in showModal to reset the input when the modal is opened
watch(
  () => props.showModal,
  newValue => {
    if (newValue) {
      localFolderName.value = '' // Reset the localFolderName when the modal opens
      showError.value = false // Reset the error state
    }
  },
)

const close = () => {
  emit('close')
}

const create = () => {
  if (!localFolderName.value.trim()) {
    showError.value = true
  } else {
    emit('create', localFolderName.value)
  }
}
</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-1/3">
      <div class="flex items-center justify-between px-5 py-3">
        <h2 class="text-md">Create New Folder</h2>
        <img
          src="@/assets/icons/close.svg"
          @click="close"
          alt="close icon"
          class="h-5 w-5 brightness-0 group-hover:brightness-0 group-hover:invert cursor-pointer"
        />
      </div>
      <div class="border-y-2">
        <div class="px-5 my-3">
          <input
            v-model="localFolderName"
            type="text"
            placeholder="Folder Name"
            class="border border-gray-300 text-sm p-2 rounded w-full"
          />
          <p v-if="showError" class="text-xs text-red-500 my-2">
            The folder name cannot be empty.
          </p>
        </div>
      </div>
      <div class="flex justify-end space-x-2 py-3 px-5">
        <button
          @click="create"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer text-sm"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>
