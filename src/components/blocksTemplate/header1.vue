<template>
    <header class="block header">
      <h1 v-html="content" />
    </header>
  </template>
  
  <script setup lang="ts">
  defineProps<{ content: string }>()
  </script>
  
  <style scoped>
  .header {
    background-color: #f5f5f5;
    padding: 20px;
    text-align: center;
  }
</style>  