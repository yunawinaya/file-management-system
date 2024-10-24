<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: 'Item',
  },
  name: {
    type: String,
    required: true,
  },
})

const localName = ref(props.name)

const emit = defineEmits(['confirm', 'cancel'])

watch(
  () => props.name,
  newValue => {
    localName.value = newValue
  },
)

const confirm = () => {
  emit('confirm', localName.value)
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
        <h2 class="text-md">Rename {{ title }}</h2>
        <img
          src="@/assets/icons/close.svg"
          @click="cancel"
          alt="close icon"
          class="h-5 w-5 brightness-0 group-hover:brightness-0 group-hover:invert cursor-pointer"
        />
      </div>
      <div class="border-y-2">
        <div class="px-5 my-3">
          <input
            v-model="localName"
            type="text"
            placeholder="Enter new name"
            class="border border-gray-300 text-sm p-2 rounded w-full"
          />
        </div>
      </div>
      <div class="flex justify-end space-x-2 py-3 px-5">
        <button
          @click="confirm"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer text-sm"
        >
          Rename
        </button>
      </div>
    </div>
  </div>
</template>
