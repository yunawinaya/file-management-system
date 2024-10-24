<template>
  <div class="toast-container">
    <Toast
      v-for="(toast, index) in toasts"
      :key="index"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
  </div>
</template>

<script setup>
import { useToast } from './useToast'
import Toast from './ToastPopup.vue' // Import your Toast component

const { toasts } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}
</style>
