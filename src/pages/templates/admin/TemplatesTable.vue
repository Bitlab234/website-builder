<template>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Кол-во блоков</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="template in templates" :key="template.id">
                    <td>{{ template.id }}</td>
                    <td>{{ template.name }}</td>
                    <td>{{ template.description }}</td>
                    <td>{{ template.blocks_count }}</td>
                    <td>
                        <button class="action-btn edit-btn">Редактировать</button>
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
    name: 'TemplatesTable',
    setup() {
        const templates = ref([
            { id: 1, name: 'Основной шаблон', description: 'Основной шаблон для лендингов', blocks_count: 5 },
            { id: 2, name: 'Промо шаблон', description: 'Шаблон для промо-акций', blocks_count: 4 },
            { id: 3, name: 'Продуктовый шаблон', description: 'Шаблон для продуктов', blocks_count: 6 }
        ]);

        return {
            templates
        };
    }
};
</script>

<style scoped>
.edit-btn {
    background-color: #48bb78;
    color: white;
}

.edit-btn:hover {
    background-color: #38a169;
}

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