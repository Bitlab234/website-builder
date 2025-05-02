<template>
    <div class="admin-panel">
        <header class="admin-header">
            <h1>Админ-панель</h1>
            <button @click="handleLogout" class="logout-btn">Выйти</button>
        </header>

        <div class="admin-content">
            <div class="admin-main">
                <h2>Управление лендингами</h2>

                <!-- Таблица лендингов -->
                <div class="table-container" v-if="!loading.landings">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Шаблон</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="landings.length" v-for="landing in landings" :key="landing.id">
                                <td>{{ landing.id }}</td>
                                <td>{{ landing.template_id }}</td>
                                <td>
                                    <button class="action-btn view-btn">Просмотр</button>
                                    <button class="action-btn delete-btn">Удалить</button>
                                </td>
                            </tr>
                            <tr v-else>
                                <td colspan="4" class="no-data">Нет данных о лендингах</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="loading">Загрузка лендингов...</div>

                <h2>Управление шаблонами</h2>

                <div class="table-container" v-if="!loading.templates">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="templates.length" v-for="template in templates" :key="template.id">
                                <td>{{ template.id }}</td>
                                <td>{{ template.name }}</td>
                                <td>{{ template.description }}</td>
                                <td>
                                    <button class="action-btn view-btn">Просмотр</button>
                                    <button class="action-btn edit-btn">Редактировать</button>
                                    <button class="action-btn delete-btn">Удалить</button>
                                </td>
                            </tr>
                            <tr v-else>
                                <td colspan="4" class="no-data">Нет данных о шаблонах</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="loading">Загрузка шаблонов...</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { adminCheckAuth, adminLogout, fetchAllLandings, fetchAllTemplates } from '@/services/api';

export default {
    name: 'AdminPanel',
    setup() {
        const router = useRouter();
        const landings = ref<any[]>([]);
        const templates = ref<any[]>([]);
        const loading = ref({
            landings: true,
            templates: true
        });
        const error = ref('');

        const checkAuth = async () => {
            try {
                const isAuthenticated = await adminCheckAuth();
                if (!isAuthenticated) {
                    router.push('/admin/login');
                } else {
                    await loadData();
                }
            } catch (err) {
                error.value = 'Ошибка проверки авторизации';
                console.error(err);
            }
        };

        const loadData = async () => {
            try {
                loading.value = { landings: true, templates: true };

                const [landingsData, templatesData] = await Promise.all([
                    fetchAllLandings(),
                    fetchAllTemplates()
                ]);

                landings.value = landingsData || [];
                templates.value = templatesData || [];

            } catch (err) {
                error.value = 'Ошибка загрузки данных';
                console.error(err);
            } finally {
                loading.value = { landings: false, templates: false };
            }
        };

        const formatDate = (dateString: string) => {
            try {
                return new Date(dateString).toLocaleDateString();
            } catch {
                return dateString;
            }
        };

        const handleLogout = async () => {
            await adminLogout();
            router.push('/admin/login');
        };

        onMounted(checkAuth);

        return {
            landings,
            templates,
            loading,
            error,
            handleLogout,
            formatDate
        };
    }
};
</script>

<style scoped>
.admin-panel {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #007bff;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.logout-btn {
    background: none;
    border: 1px solid white;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
}

.logout-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
}

.admin-content {
    padding: 2rem;
    flex: 1;
}

.admin-main h2 {
    margin-top: 2rem;
    color: #007bff;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
    font-size: 1.3rem;
}

.table-container {
    overflow-x: auto;
    margin: 1rem 0 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
}

.data-table th,
.data-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

.data-table th {
    background-color: #f7fafc;
    font-weight: 600;
    color: #4a5568;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
}

.data-table tr:hover {
    background-color: #f8f9fa;
}

.no-data {
    text-align: center;
    padding: 20px;
    color: #718096;
    font-style: italic;
}

.loading {
    padding: 20px;
    text-align: center;
    color: #4a5568;
    font-style: italic;
}

.action-btn {
    padding: 6px 12px;
    margin-right: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
}

.action-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.view-btn {
    background-color: #4299e1;
    color: white;
}

.view-btn:hover {
    background-color: #3182ce;
}

.edit-btn {
    background-color: #48bb78;
    color: white;
}

.edit-btn:hover {
    background-color: #38a169;
}

.delete-btn {
    background-color: #f56565;
    color: white;
}

.delete-btn:hover {
    background-color: #e53e3e;
}

.error {
    color: #e53e3e;
    padding: 1rem;
    background: #fff5f5;
    border-radius: 4px;
    margin: 1rem 0;
    border-left: 4px solid #e53e3e;
}
</style>