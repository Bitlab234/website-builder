<template>
  <div class="landing-editor">
    <TheHeader />

    <div v-if="loading">Загрузка данных...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <h1>Редактор лендинга</h1>

      <div v-if="template">
        <h2>Шаблон: {{ template.name }}</h2>
        <p>{{ template.description }}</p>
      </div>

      <div class="blocks-selection">
        <h3>Выбор и порядок блоков</h3>

        <div v-if="blocks.length === 0" class="no-blocks">
          Нет доступных блоков
        </div>

        <div v-else class="blocks-list">
          <div v-for="(block, index) in blocks" :key="block.id" class="block-item">
            <div class="block-header">
              <input type="checkbox" :id="'block-' + block.id" v-model="selectedBlockIds" :value="block.id" />
              <label :for="'block-' + block.id">
                {{ block.type }} ({{ block.component }})
              </label>
              <div class="block-actions" v-if="isBlockSelected(block.id)">
                <button class="order-btn order-btn-up" @click="moveBlockUp(index)" :disabled="index === 0">↑</button>
                <button class="order-btn order-btn-down" @click="moveBlockDown(index)"
                  :disabled="index === blocks.length - 1">↓</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="landing-preview">
        <h3>Предпросмотр лендинга</h3>
        <div v-if="selectedBlocks.length === 0" class="no-selected-blocks">
          Выберите блоки для отображения
        </div>
        <div v-else>
          <div v-for="block in selectedBlocks" :key="'preview-' + block.id" class="preview-block">
            <div v-if="componentMap[block.component]">
              <component :is="componentMap[block.component]" :block="block" />
            </div>
            <div v-else class="component-missing">
              Компонент "{{ block.component }}" не найден
            </div>
          </div>
        </div>
      </div>

      <div class="save-section">
        <button class="save-btn" @click="saveLanding" :disabled="selectedBlocks.length === 0 || saving">
          <span v-if="!saving">Сохранить лендинг</span>
          <span v-else>Сохранение...</span>
        </button>
        <div v-if="saveSuccess" class="save-success">
          Лендинг успешно сохранен!
        </div>
        <div v-if="saveError" class="save-error">
          {{ saveError }}
        </div>
      </div>
    </template>

    <TheFooter />
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  fetchTemplateById,
  fetchTemplateBlocks,
  createLanding,
  saveLandingBlocks
} from '@/services/api';
import TheHeader from '@/pages/templates/TheHeader.vue';
import TheFooter from '@/pages/templates/TheFooter.vue';
import { componentMap } from '@/utils/componentMap';
import type { Template, TemplateBlock } from '@/services/types';

export default {
  name: 'LandingEditorPage',
  components: {
    TheHeader,
    TheFooter
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const templateId = Number(route.params.templateId);

    const template = ref<Template | null>(null);
    const blocks = ref<TemplateBlock[]>([]);
    const selectedBlockIds = ref<number[]>([]);
    const loading = ref(true);
    const error = ref('');

    const saving = ref(false);
    const saveError = ref('');
    const saveSuccess = ref(false);

    const selectedBlocks = computed(() => {
      return blocks.value.filter(block => selectedBlockIds.value.includes(block.id));
    });

    const isBlockSelected = (id: number) => {
      return selectedBlockIds.value.includes(id);
    };

    const moveBlockUp = (index: number) => {
      if (index > 0) {
        const newBlocks = [...blocks.value];
        [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
        blocks.value = newBlocks;
      }
    };

    const moveBlockDown = (index: number) => {
      if (index < blocks.value.length - 1) {
        const newBlocks = [...blocks.value];
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        blocks.value = newBlocks;
      }
    };

    const saveLanding = async () => {
      try {
        saving.value = true;
        saveError.value = '';
        saveSuccess.value = false;

        if (!template.value) {
          throw new Error('Шаблон не загружен');
        }

        const { id: landingId } = await createLanding(template.value.id.toString());

        await saveLandingBlocks(
          landingId,
          selectedBlocks.value
        );

        saveSuccess.value = true;

        setTimeout(() => {
          router.push('/LandingsList');
        }, 1000);

      } catch (err) {
        saveError.value = err.message || 'Ошибка при сохранении лендинга';
        console.error('Ошибка сохранения:', err);
      } finally {
        saving.value = false;
      }
    };

    const loadData = async () => {
      try {
        loading.value = true;
        error.value = '';

        const [templateData, blocksData] = await Promise.all([
          fetchTemplateById(templateId),
          fetchTemplateBlocks(templateId)
        ]);

        template.value = templateData;
        blocks.value = blocksData;
        selectedBlockIds.value = blocksData.map(block => block.id);

      } catch (err) {
        error.value = 'Не удалось загрузить данные';
        console.error('Ошибка загрузки:', err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadData);

    return {
      template,
      blocks,
      selectedBlockIds,
      selectedBlocks,
      loading,
      error,
      saving,
      saveError,
      saveSuccess,
      componentMap,
      isBlockSelected,
      moveBlockUp,
      moveBlockDown,
      saveLanding
    };
  }
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

.block-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.block-actions {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.order-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #007bff;
  cursor: pointer;
}

input[type="checkbox"] {
  margin: 0;
  vertical-align: middle;
}

label {
  margin: 0;
  vertical-align: middle;
}
</style>