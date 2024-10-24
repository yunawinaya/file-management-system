<script setup>
import { defineProps, defineEmits } from 'vue'

const { visible, message } = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: 'Item',
  },
  message: {
    type: String,
    default: 'Are you sure you want to delete this item?',
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-1/3">
      <div class="flex items-center justify-between px-5 py-3">
        <h2 class="text-md">Delete {{ title }}</h2>
        <img
          src="@/assets/icons/close.svg"
          @click="cancel"
          alt="close icon"
          class="h-5 w-5 brightness-0 group-hover:brightness-0 group-hover:invert cursor-pointer"
        />
      </div>
      <div class="border-y-2">
        <div class="px-5 my-3">
          <p class="text-md my-2">
            {{ message }}
          </p>
        </div>
      </div>
      <div class="flex justify-end space-x-2 py-3 px-5">
        <button
          @click="confirm"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
