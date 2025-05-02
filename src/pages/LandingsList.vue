<template>
  <div class="landings-list">
    <TheHeader />
    <h1>Мои лендинги</h1>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <ul v-else>
      <li v-for="landing in landings" :key="landing.id">
        <RouterLink :to="`/landings/${landing.id}`">
          Лендинг #{{ landing.id }} (Шаблон: {{ landing.template_id }})
        </RouterLink>
      </li>
    </ul>

    <TheFooter />
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAllLandings } from '@/services/api';
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
    const loading = ref(true);
    const error = ref('');

    const fetchLandings = async () => {
      try {
        loading.value = true;
        error.value = '';
        landings.value = await fetchAllLandings();
      } catch (err) {
        error.value = 'Ошибка при загрузке лендингов';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchLandings);

    return { landings, loading, error };
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