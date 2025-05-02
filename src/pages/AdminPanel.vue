<template>
    <div class="admin-panel">
        <header class="admin-header">
            <h1>Админ-панель</h1>
            <button @click="handleLogout" class="logout-btn">Выйти</button>
        </header>

        <div class="admin-content">
            <div class="admin-main">
                <h2>Управление лендингами</h2>
                <LandingsTable />

                <h2>Управление шаблонами</h2>
                <TemplatesTable />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LandingsTable from '@/pages/templates/admin/LandingsTable.vue';
import TemplatesTable from '@/pages/templates/admin/TemplatesTable.vue';

export default {
    name: 'AdminPanel',
    components: {
        LandingsTable,
        TemplatesTable
    },
    setup() {
        const router = useRouter();

        const handleLogout = () => {
            localStorage.removeItem('isAuthenticated');
            router.push('/admin/login');
        };

        onMounted(() => {
            if (!localStorage.getItem('isAuthenticated')) {
                router.push('/admin/login');
            }
        });

        return {
            handleLogout
        };
    }
};
</script>

<style scoped>
.admin-panel {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #007bff;
    color: white;
}

.admin-header h1 {
    margin: 0;
    font-size: 1.5rem;
}

.logout-btn {
    background: none;
    border: 1px solid white;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}

.logout-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.admin-content {
    padding: 2rem;
}

.admin-main h2 {
    margin-top: 2rem;
    color: #007bff;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
}
</style>