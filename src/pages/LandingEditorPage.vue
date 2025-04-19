<template>
  <div>
    <h1>Конструктор лендинга</h1>
    <div v-for="(block, index) in editableBlocks" :key="index">
      <label>{{ block.name }}</label>
      <input v-if="block.type === 'text'" v-model="block.value" />
      <input
        v-if="block.type === 'image'"
        type="file"
        @change="(event) => handleImageChange(index, event)"
      />
    </div>
    <button @click="saveLanding">Сохранить</button>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

interface EditableBlock {
  name: string;
  type: 'text' | 'image';
  value: string;
}

export default {
  name: 'LandingEditorPage',
  setup() {
    const route = useRoute();
    const editableBlocks = ref<EditableBlock[]>([]);
    const templateId = route.params.templateId;

    const fetchTemplateBlocks = async () => {
      // Заглушка — можно заменить на запрос с сервера
      editableBlocks.value = [
        { name: 'Заголовок', type: 'text', value: '' },
        { name: 'Изображение', type: 'image', value: '' },
      ];
    };

    const handleImageChange = (index: number, event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        editableBlocks.value[index].value = URL.createObjectURL(file);
      }
    };

    const saveLanding = async () => {
      try {
        await axios.post('http://localhost:3000/landings', {
          templateId,
          blocks: editableBlocks.value,
        });
        alert('Лендинг успешно сохранён!');
      } catch (err) {
        alert('Ошибка при сохранении');
      }
    };

    onMounted(fetchTemplateBlocks);

    return {
      editableBlocks,
      saveLanding,
      handleImageChange,
    };
  },
};
</script>

<style scoped>
/* Добавь стили, если нужно */
</style>
