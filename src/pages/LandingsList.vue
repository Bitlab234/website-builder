<template>
    <div class="landings-list">
        <TheHeader />
        <h1>Мои лендинги</h1>

        <ul>
            <li v-for="landing in landings" :key="landing.id">
                <RouterLink :to="`/landings/${landing.id}`">Лендинг ID: {{ landing.id }}</RouterLink>
            </li>
        </ul>

        <TheFooter />
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TheHeader from '@/pages/templates/TheHeader.vue';
import TheFooter from '@/pages/templates/TheFooter.vue';

export default {
    name: 'LandingsList',
    components: {
        TheHeader,
        TheFooter,
    },
    setup() {
        const landings = ref([]);

        const fetchLandings = async () => {
            try {
                const res = await axios.get('http://localhost:3000/landings');
                landings.value = res.data;
            } catch (err) {
                console.error('Ошибка при загрузке лендингов:', err);
            }
        };

        onMounted(fetchLandings);

        return { landings };
    },
};
</script>