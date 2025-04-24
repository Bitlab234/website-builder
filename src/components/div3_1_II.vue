<template>
    <div class="image-uploader">
        <h2>Загрузка изображения</h2>
        <input type="file" accept="image/*" @change="onFileChange" />
        <div v-if="imageUrl">
            <p>Превью:</p>
            <img :src="imageUrl" alt="Preview" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const imageUrl = ref<string | null>(null);

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        imageUrl.value = URL.createObjectURL(file);
    }
};
</script>

<style scoped>
.image-uploader {
    background-color: #e07b7b;
    color: white;
    padding: 20px;
}

img {
    margin-top: 10px;
    max-width: 100%;
    height: auto;
}
</style>