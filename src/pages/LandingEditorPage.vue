<template>
  <div>you nice man</div>
  <div class="landing-builder">
    <h1>Создание лендинга</h1>

    <div v-if="template" class="block-selection">
      <h2>Шаблон: {{ template.name }}</h2>
      <p>{{ template.description }}</p>

      <h3>Выберите блоки</h3>
      <div class="block" v-for="(block, index) in template.blocks" :key="index">
        <input
          type="checkbox"
          :id="'block-' + index"
          v-model="selectedBlocks"
          :value="block"
        />
        <label :for="'block-' + index">{{ block.type }}: {{ block.content }}</label>
      </div>
    </div>

    <div v-if="selectedBlocks.length > 0" class="landing-preview">
      <h2>Предпросмотр лендинга</h2>
      <div v-for="(block, index) in selectedBlocks" :key="'preview-' + index">
        <component :is="componentMap[block.component]" :block="block" />
      </div>
    </div>

    <button @click="createLanding" :disabled="!selectedBlocks.length">Создать лендинг</button>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

interface Block {
  type: string;
  content: string;
  component?: string; // Добавим свойство для компонента
}

interface Template {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
}

export default {
  name: 'LandingBuilder',
  setup() {
    const route = useRoute();
    const templateId = route.params.templateId as string;

    const template = ref<Template | null>(null);
    const selectedBlocks = ref<Block[]>([]);

    // Динамически импортируем компоненты для блоков
    const componentMap = {
      Header1: defineAsyncComponent(() => import('@/components/ComponentOne.vue')),
      Header2: defineAsyncComponent(() => import('@/components/ComponentTwo.vue')),
      Main1: defineAsyncComponent(() => import('@/components/div1_1.vue')),
    };

    // Функция для получения шаблона из базы данных
    const fetchTemplate = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/templates/${templateId}`);
        template.value = res.data;
      } catch (err) {
        console.error('Ошибка при загрузке шаблона:', err);
      }
    };

    // Функция для создания лендинга
    const createLanding = async () => {
      try {
        await axios.post('http://localhost:3000/landings', {
          templateId,
          blocks: selectedBlocks.value,
        });
        alert('Лендинг успешно создан!');
      } catch (err) {
        console.error('Ошибка при создании лендинга:', err);
        alert('Не удалось сохранить лендинг');
      }
    };

    onMounted(fetchTemplate);  // Загружаем шаблон при монтировании компонента

    return {
      template,
      selectedBlocks,
      createLanding,
      componentMap,  // Возвращаем компонент для динамической загрузки
    };
  },
};
</script>

<style scoped>
.landing-builder {
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 1000px;
  margin: 0 auto;
}

.block-selection {
  margin-bottom: 20px;
}

.block {
  margin-bottom: 10px;
}

.landing-preview {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}

.landing-preview img {
  max-width: 100%;
  margin-top: 10px;
}

button {
  margin-top: 20px;
  padding: 10px 24px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
