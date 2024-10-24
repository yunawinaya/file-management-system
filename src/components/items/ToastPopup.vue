<template>
  <div v-if="visible" :class="['toast', type]" @click="hideToast">
    {{ message }}
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  message: String,
  type: String,
  duration: Number,
})

const visible = ref(false)

const showToast = () => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, props.duration || 3000)
}

const hideToast = () => {
  visible.value = false
}

onMounted(() => {
  showToast()
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: opacity 0.3s;
  z-index: 1000;
}
.toast.info {
  background-color: #2196f3;
}
.toast.success {
  background-color: #4caf50;
}
.toast.error {
  background-color: #f44336;
}
</style>
