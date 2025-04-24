<template>
    <div class="text-input">
        <h2>Ввод текста</h2>
        <textarea v-model="text" placeholder="Введите что-нибудь..." rows="6" cols="50"></textarea>
        <p><strong>Результат:</strong> {{ text }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const text = ref('');
</script>

<style scoped>
.text-input {
    background-color: #3498db;
    color: white;
    padding: 20px;
}

textarea {
    font-size: 16px;
    padding: 10px;
}
</style>