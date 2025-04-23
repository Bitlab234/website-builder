import { defineAsyncComponent } from 'vue';

export const componentMap = {
    Header1: defineAsyncComponent(() => import('@/components/ComponentOne.vue')),
    Header2: defineAsyncComponent(() => import('@/components/ComponentTwo.vue')),
    Main1: defineAsyncComponent(() => import('@/components/div1_1.vue')),
};