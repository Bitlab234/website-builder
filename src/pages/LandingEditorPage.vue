<template>
  <div class="landing-builder">
    <TheHeader />

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
        <label :for="'block-' + index">{{ block.type }}</label>
      </div>
    </div>

    <div v-if="selectedBlocks.length > 0" class="landing-preview">
      <h2>Предпросмотр лендинга</h2>
      <div v-for="(block, index) in selectedBlocks" :key="'preview-' + index">
        <component :is="componentMap[block.component]" :block="block" />
      </div>
    </div>

    <button @click="createLanding" :disabled="!selectedBlocks.length">Создать лендинг</button>

    <TheFooter />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { componentMap } from '@/utils/componentMap';
import TheHeader from '@/pages/templates/TheHeader.vue';
import TheFooter from '@/pages/templates/TheFooter.vue';

interface Block {
  type: string;
  content: string;
  component?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
}

export default {
  name: 'LandingBuilder',
  components: {
    TheHeader,
    TheFooter,
  },
  setup() {
    const route = useRoute();
    const templateId = route.params.templateId as string;

    const template = ref<Template | null>(null);
    const selectedBlocks = ref<Block[]>([]);

    const fetchTemplate = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/templates/${templateId}`);
        template.value = res.data;
      } catch (err) {
        console.error('Ошибка при загрузке шаблона:', err);
      }
    };

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

    onMounted(fetchTemplate);

    return {
      template,
      selectedBlocks,
      createLanding,
      componentMap,
    };
  },
};
</script>

<style scoped>
.landing-builder {
  font-family: Arial, sans-serif;
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
