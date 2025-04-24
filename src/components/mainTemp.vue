<template>
    <ComponentOne1 />
    <div>
        <button @click="setCurrentComponent('ComponentOne')">Показать 1</button>
        <button @click="setCurrentComponent('ComponentTwo')">Показать 2</button>
        <button @click="setCurrentComponent('ComponentThree')">Показать 3</button>

        <!-- Динамическое отображение компонента -->
        <component :is="currentComponent" />
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, shallowRef } from 'vue';
import ComponentOne1 from './header1.vue'

// Создаём объект с компонентами, которые будут загружаться динамически
const components = {
    ComponentOne: defineAsyncComponent(() => import('./header1.vue')),
    ComponentTwo: defineAsyncComponent(() => import('../components/ComponentTwo.vue')),
    ComponentThree: defineAsyncComponent(() => import('../components/ComponentThree.vue')),
};

// Используем shallowRef, чтобы избежать излишней реактивности
let currentComponent = shallowRef(components.ComponentOne); // Изначально показываем ComponentOne

// Функция для изменения текущего компонента
const setCurrentComponent = (componentName: string) => {
    console.log(`Переключение на компонент: ${componentName}`);
    currentComponent.value = components[componentName]; // Обновление компонента
};
</script>