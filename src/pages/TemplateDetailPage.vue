<template>
  <TheHeader />

  <div v-if="template">
    <h1>{{ template.name }}</h1>
    <p>{{ template.description }}</p>
    <p>Автор: {{ template.author }}</p>
    <p>Лицензия: {{ template.license }}</p>
    <p>Стоимость: {{ template.price }}</p>
    <button @click="editTemplate(template.id)">Создать лендинг</button>
  </div>
  <div v-if="loading">Загрузка...</div>
  <div v-if="error" class="error">Ошибка: {{ error }}</div>

  <TheFooter />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchTemplateById } from '@/services/api'; // Импортируем функцию из API-сервиса
import TheHeader from '@/pages/templates/TheHeader.vue';
import TheFooter from '@/pages/templates/TheFooter.vue';

// Интерфейс можно перенести в файл types.ts и импортировать оттуда
interface Template {
  id: number;
  name: string;
  description: string;
  author: string;
  license: string;
  price: string;
}

const route = useRoute();
const router = useRouter();
const template = ref<Template | null>(null);
const loading = ref(true);
const error = ref('');

const fetchTemplate = async () => {
  try {
    const id = Number(route.params.id);
    if (isNaN(id)) throw new Error('Неверный ID шаблона');
    
    template.value = await fetchTemplateById(id);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Не удалось загрузить шаблон';
    console.error('Ошибка загрузки шаблона:', err);
  } finally {
    loading.value = false;
  }
};

const editTemplate = (id: number) => {
  router.push(`/editor/${id}`);
};

onMounted(fetchTemplate);
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>