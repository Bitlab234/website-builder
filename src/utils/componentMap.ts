import { defineAsyncComponent } from 'vue';

export const componentMap = {
    Header1: defineAsyncComponent(() => import('@/components/header1.vue')),
    Main1_1: defineAsyncComponent(() => import('@/components/div1_1_NI.vue')),
    Main1_2: defineAsyncComponent(() => import('@/components/div1_2_TI.vue')),
    Main1_3: defineAsyncComponent(() => import('@/components/div1_3_II.vue')),
    Footer1: defineAsyncComponent(() => import('@/components/footer1.vue')),
    Header2: defineAsyncComponent(() => import('@/components/header2.vue')),
    Main2_1: defineAsyncComponent(() => import('@/components/div2_1_NI.vue')),
    Main2_2: defineAsyncComponent(() => import('@/components/div2_2_TI.vue')),
    Main2_3: defineAsyncComponent(() => import('@/components/div2_3_NI.vue')),
    Footer2: defineAsyncComponent(() => import('@/components/footer2.vue')),
};