<template>
  <div>
    <h1>Каталог шаблонов</h1>
    <input v-model="searchQuery" placeholder="Поиск по шаблонам..." />
    <div v-if="loading">Загрузка...</div>
    <div v-if="error" class="error">Ошибка: {{ error }}</div>
    <div v-for="template in filteredTemplates" :key="template.id">
      <h3>{{ template.name }}</h3>
      <button @click="viewTemplate(template.id)">Подробнее</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Импортируем интерфейс TemplateData
import { TemplateData } from '../types';

export default {
  name: 'TemplateListPage',
  setup() {
    const searchQuery = ref('');
    const templates = ref<TemplateData[]>([]); // Заменили на TemplateData
    const loading = ref(true);
    const error = ref('');
    const router = useRouter();

    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:3000/templates');
        templates.value = response.data; // Теперь response.data будет соответствовать TemplateData[]
      } catch (err) {
        error.value = 'Не удалось загрузить шаблоны';
      } finally {
        loading.value = false;
      }
    };

    const filteredTemplates = computed(() => {
      return templates.value.filter((template) =>
        template.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const viewTemplate = (id: string) => { // id теперь строка, как в интерфейсе TemplateData
      router.push(`/template/${id}`);
    };

    onMounted(fetchTemplates);

    return {
      searchQuery,
      templates,
      loading,
      error,
      filteredTemplates,
      viewTemplate,
    };
  }
};
</script>

<style scoped>
/* Общие стили для контейнера */
div {
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

/* Стили для заголовка */
h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Стили для поля поиска */
input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Стили для текста загрузки */
.loading {
  font-size: 18px;
  color: #007bff;
}

/* Стили для ошибки */
.error {
  font-size: 16px;
  color: red;
  margin-top: 10px;
}

/* Стили для списка шаблонов */
div > div {
  margin-bottom: 20px;
}

/* Стили для заголовка шаблона */
h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

/* Стили для кнопки */
button {
  padding: 10px 15px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button:focus {
  outline: none;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  div {
    padding: 10px;
  }

  h1 {
    font-size: 20px;
  }

  input {
    font-size: 14px;
  }

  h3 {
    font-size: 18px;
  }

  button {
    font-size: 14px;
  }
}
</style>
