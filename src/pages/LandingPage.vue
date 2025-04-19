<template>
    <div class="landing-builder">
        <h1>Создание лендинга</h1>

        <div class="template-selection">
            <h2>Выберите шаблон</h2>
            <div class="template" v-for="template in templates" :key="template.id">
                <input type="radio" :id="template.id" v-model="selectedTemplateId" :value="template.id" />
                <label :for="template.id">{{ template.name }}</label>
            </div>
        </div>

        <div v-if="selectedTemplateId" class="block-selection">
            <h2>Выберите блоки для лендинга</h2>
            <div class="block" v-for="block in selectedTemplate.blocks" :key="block.type">
                <input type="checkbox" :id="block.type" v-model="selectedBlocks" :value="block" />
                <label :for="block.type">{{ block.type }}: {{ block.content }}</label>
            </div>
        </div>

        <div v-if="selectedBlocks.length > 0" class="landing-preview">
            <h2>Предпросмотр лендинга</h2>
            <div v-for="block in selectedBlocks" :key="block.type">
                <div v-if="block.type === 'header'">
                    <h3>{{ block.content }}</h3>
                </div>
                <div v-if="block.type === 'footer'">
                    <footer>{{ block.content }}</footer>
                </div>
                <div v-if="block.type === 'main'">
                    <p>{{ block.content }}</p>
                </div>
                <div v-if="block.type === 'image'">
                    <img :src="block.content" alt="Image Block" />
                </div>
            </div>
        </div>

        <button @click="createLanding">Создать лендинг</button>
    </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';

export default {
  name: 'LandingBuilder',
  setup() {
    // Данные шаблонов
    const templates = ref([
      {
        id: '1',
        name: 'Шаблон 1',
        blocks: [
          { type: 'header', content: 'Заголовок 1' },
          { type: 'main', content: 'Основной контент 1' },
          { type: 'footer', content: 'Подвал 1' },
        ],
      },
      {
        id: '2',
        name: 'Шаблон 2',
        blocks: [
          { type: 'header', content: 'Заголовок 2' },
          { type: 'main', content: 'Основной контент 2' },
          { type: 'image', content: 'https://via.placeholder.com/150' },
          { type: 'footer', content: 'Подвал 2' },
        ],
      },
    ]);

    const selectedTemplateId = ref<string | null>(null);
    const selectedBlocks = ref<any[]>([]);

    // Выбор шаблона
    const selectedTemplate = computed(() => {
      return templates.value.find(template => template.id === selectedTemplateId.value);
    });

    // Функция для создания лендинга
    const createLanding = () => {
      console.log('Создан лендинг с блоками:', selectedBlocks.value);
    };

    return {
      templates,
      selectedTemplateId,
      selectedBlocks,
      selectedTemplate,
      createLanding,
    };
  },
};
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