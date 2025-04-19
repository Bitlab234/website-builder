<template>
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
  </template>
  
  <script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

interface Template {
  id: number;
  name: string;
  description: string;
  author: string;
  license: string;
  price: string;
}

export default {
  name: 'TemplateDetailPage',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const template = ref<Template | null>(null);
    const loading = ref(true);
    const error = ref('');

    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/templates/${route.params.id}`);
        template.value = response.data;
      } catch (err) {
        error.value = 'Не удалось загрузить шаблон';
      } finally {
        loading.value = false;
      }
    };

    const editTemplate = (id: number) => {
      router.push(`/editor/${id}`);
    };

    onMounted(fetchTemplate);

    return {
      template,
      loading,
      error,
      editTemplate
    };
  }
};
</script>

  
  <style scoped>
  .error {
    color: red;
  }
  </style>
  