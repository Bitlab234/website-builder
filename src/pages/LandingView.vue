<template>
    <header class="headerMain">
        <h1>Просмотр лендинга</h1>
        <nav>
            <router-link to="/">Главная</router-link>
        </nav>
    </header>
    <div class="header-spacing"></div>
    <div class="landing-preview-page">

        <div v-if="landing">
            <div class="block" v-for="(block, index) in landing.blocks" :key="index">
                <component v-if="componentMap[block.component]" :is="componentMap[block.component]" :block="block" />
                <div v-else>
                    <p>Компонент {{ block.component }} не найден</p>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { componentMap } from '@/utils/componentMap';

export default {
    name: 'LandingPreview',
    components: {
    },
    setup() {
        const route = useRoute();
        const landing = ref<any>(null);

        const fetchLanding = async () => {
            try {
                const id = route.params.id;
                const response = await axios.get(`http://localhost:3000/landings/${id}`);
                landing.value = response.data;
            } catch (error) {
                console.error('Ошибка при получении лендинга:', error);
            }
        };

        onMounted(fetchLanding);

        return {
            landing,
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