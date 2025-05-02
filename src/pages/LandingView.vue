<template>
    <header class="headerMain">
        <h1>Просмотр лендинга #{{ landingId }}</h1>
        <nav>
            <router-link to="/LandingsList">← Назад к списку лендингов</router-link>
        </nav>
    </header>
    <div class="header-spacing"></div>
    <div class="landing-preview-page">
        <div v-if="loading" class="loading">Загрузка лендинга...</div>
        <div v-else-if="error" class="error">{{ error }}</div>

        <div v-else-if="landing">
            <div class="landing-info">
                <p>ID: {{ landing.id }}</p>
                <p>Шаблон: {{ landing.template_id }}</p>
            </div>

            <div class="blocks-titles">
                <h2>Список блоков:</h2>
                <ul>
                    <li v-for="(block, index) in landing.blocks" :key="index">
                        {{ index + 1 }}. {{ block.type }} ({{ block.component }})
                    </li>
                </ul>
            </div>

            <div class="blocks-container">
                <h2>Просмотр лэндинга:</h2>
                <div class="block" v-for="(block, index) in landing.blocks" :key="index">
                    <div class="block-content">
                        <component 
                            v-if="componentMap[block.component]" 
                            :is="componentMap[block.component]" 
                            :block="block" 
                        />
                        <div v-else class="component-missing">
                            Компонент "{{ block.component }}" не найден
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchLandingById } from '@/services/api';
import { componentMap } from '@/utils/componentMap';

export default {
    name: 'LandingPreview',
    setup() {
        const route = useRoute();
        const landing = ref<any>(null);
        const loading = ref(true);
        const error = ref('');

        const landingId = computed(() => route.params.id);

        const fetchLanding = async () => {
            try {
                loading.value = true;
                error.value = '';
                landing.value = await fetchLandingById(landingId.value as string);
            } catch (err) {
                error.value = 'Ошибка при загрузке лендинга';
                console.error('Ошибка при получении лендинга:', err);
            } finally {
                loading.value = false;
            }
        };

        onMounted(fetchLanding);

        return {
            landing,
            landingId,
            loading,
            error,
            componentMap,
        };
    },
};
</script>

<style scoped>
.headerMain {
    background-color: #007bff;
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header h1 {
    margin: 0;
    font-size: 24px;
}

nav a {
    color: white;
    text-decoration: none;
    margin-left: 15px;
}

nav a:hover {
    text-decoration: underline;
}

.header-spacing {
  margin-bottom: 40px;
}
</style>