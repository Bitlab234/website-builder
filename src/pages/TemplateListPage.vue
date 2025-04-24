<template>
  <TheHeader />
  <div>
    <h1>Каталог шаблонов</h1>
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Поиск по шаблонам..." class="main-search" />
      <select v-model="selectedKeyword" class="keyword-select small-select">
        <option value="">Все ключевые слова</option>
        <option v-for="kw in allKeywords" :key="kw" :value="kw">{{ kw }}</option>
      </select>
    </div>
    <div v-if="loading">Загрузка...</div>
    <div v-if="error" class="error">Ошибка: {{ error }}</div>
    <div v-for="template in filteredTemplates" :key="template.id">
      <h3>{{ template.name }}</h3>
      <p v-if="template.Keywords" class="keywords">
        <span v-for="(kw, index) in template.Keywords.split(',')" :key="index" class="keyword">
          {{ kw.trim() }}
        </span>
      </p>
      <button @click="viewTemplate(template.id)">Подробнее</button>
    </div>
  </div>
  <TheFooter />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import TheHeader from '@/pages/templates/TheHeader.vue';
import TheFooter from '@/pages/templates/TheFooter.vue';
import type { TemplateData } from '../types';

const searchQuery = ref('');
const selectedKeyword = ref('');
const templates = ref<TemplateData[]>([]);
const loading = ref(true);
const error = ref('');
const router = useRouter();

const fetchTemplates = async () => {
  try {
    const response = await axios.get('http://localhost:3000/templates');
    templates.value = response.data;
  } catch {
    error.value = 'Не удалось загрузить шаблоны';
  } finally {
    loading.value = false;
  }
};

const allKeywords = computed(() => {
  const keywords = new Set<string>();
  templates.value.forEach(t => {
    t.Keywords?.split(',').forEach(k => keywords.add(k.trim()));
  });
  return Array.from(keywords);
});

const filteredTemplates = computed(() =>
  templates.value.filter(t => {
    const nameMatch = t.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const keywordMatch = !selectedKeyword.value || (t.Keywords && t.Keywords.includes(selectedKeyword.value));
    return nameMatch && keywordMatch;
  })
);

const viewTemplate = (id: string) => {
  router.push(`/template/${id}`);
};

onMounted(fetchTemplates);
</script>

<style scoped>
div {
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.main-search {
  flex: 2;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.keyword-select {
  flex: 1;
  padding: 6px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.small-select {
  max-width: 200px;
}

.loading {
  font-size: 18px;
  color: #007bff;
}

.error {
  font-size: 16px;
  color: red;
  margin-top: 10px;
}

div > div {
  margin-bottom: 20px;
}

h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

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

@media (max-width: 768px) {
  div {
    padding: 10px;
  }

  h1 {
    font-size: 20px;
  }

  .main-search {
    font-size: 14px;
  }

  .keyword-select {
    font-size: 12px;
  }

  h3 {
    font-size: 18px;
  }

  button {
    font-size: 14px;
  }
}

.keywords {
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword {
  background-color: #e0f0ff;
  color: #0056b3;
  padding: 5px 10px;
  border-radius: 16px;
  font-size: 13px;
  white-space: nowrap;
}
</style>
