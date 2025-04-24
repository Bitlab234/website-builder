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

<style scoped>
.landings-list {
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
}

h1 {
  font-size: 32px;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

li:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

a {
  text-decoration: none;
  color: #007bff;
  font-weight: 600;
  font-size: 18px;
}

a:hover {
  text-decoration: underline;
}
</style>