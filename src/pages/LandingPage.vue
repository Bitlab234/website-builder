<template>
    <div class="landing-builder">
      <h1>Создание лендинга</h1>
  
      <div v-if="selectedTemplate" class="landing-preview">
        <h2>Предпросмотр лендинга</h2>
  
        <div v-for="(block, index) in selectedTemplate.blocks" :key="index">
          <!-- Отображаем компонент, если указан -->
          <component
            v-if="block.component"
            :is="componentMap[block.component]"
          />
          
          <!-- Отображаем контент, если указан -->
          <div v-else-if="block.type === 'main'">
            <p>{{ block.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import axios from 'axios';
  import ComponentOne1 from './ComponentOne111.vue'

  // Загружаем шаблон по ID из URL (например: /builder/1)
  const route = useRoute();
  const templateId = route.params.id;
  
  // Состояния
  const selectedTemplate = ref<any | null>(null);
  
  // Карта динамических компонентов (шапки и футеры)
  const componentMap = {
    Header1: defineAsyncComponent(() => import('@/components/ComponentOne.vue'))
  };
  
  // Загрузка шаблона с сервера
  const loadTemplate = async () => {
    const response = await axios.get('http://localhost:3000/templates'); // или твой путь
    selectedTemplate.value = response.data.find((t: any) => t.id === templateId);
  };
  
  loadTemplate();
  </script>
  

<style scoped>
.landing-builder {
    padding: 20px;
    font-family: Arial, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
}

h1 {
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
}

.template-selection,
.block-selection {
    margin-bottom: 30px;
}

h2 {
    font-size: 20px;
    margin-bottom: 10px;
}

.template,
.block {
    margin: 10px 0;
}

label {
    font-size: 16px;
    margin-left: 10px;
}

input[type="radio"],
input[type="checkbox"] {
    cursor: pointer;
}

.landing-preview {
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
}

.landing-preview h3 {
    font-size: 22px;
    color: #333;
}

.landing-preview p {
    font-size: 18px;
    color: #555;
}

.landing-preview img {
    max-width: 100%;
    margin-top: 10px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 20px;
    display: block;
    width: 200px;
    margin-left: auto;
    margin-right: auto;
}

button:hover {
    background-color: #0056b3;
}

button:focus {
    outline: none;
}

footer {
    font-size: 14px;
    color: #999;
    margin-top: 20px;
}

/* Адаптивность */
@media (max-width: 768px) {
    .landing-builder {
        padding: 10px;
    }

    h1 {
        font-size: 24px;
    }

    label {
        font-size: 14px;
    }

    button {
        font-size: 14px;
    }
}
</style>