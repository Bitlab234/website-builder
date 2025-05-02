<template>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Шаблон</th>
                    <th>Дата создания</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="landing in landings" :key="landing.id">
                    <td>{{ landing.id }}</td>
                    <td>{{ landing.template_id }}</td>
                    <td>{{ landing.created_at }}</td>
                    <td>
                        <button class="action-btn view-btn">Просмотр</button>
                        <button class="action-btn delete-btn">Удалить</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';

export default {
    name: 'LandingsTable',
    setup() {
        const landings = ref([
            { id: 1, template_id: 'template1', created_at: '2023-05-15' },
            { id: 2, template_id: 'template2', created_at: '2023-05-16' },
            { id: 3, template_id: 'template1', created_at: '2023-05-17' }
        ]);

        return {
            landings
        };
    }
};
</script>

<style scoped>
.table-container {
    overflow-x: auto;
    margin: 1rem 0;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
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
}

.data-table tr:hover {
    background-color: #f8f9fa;
}

.action-btn {
    padding: 6px 12px;
    margin-right: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
}

.view-btn {
    background-color: #4299e1;
    color: white;
}

.view-btn:hover {
    background-color: #3182ce;
}

.delete-btn {
    background-color: #f56565;
    color: white;
}

.delete-btn:hover {
    background-color: #e53e3e;
}
</style>