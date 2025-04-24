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
    Header3: defineAsyncComponent(() => import('@/components/header3.vue')),
    Main3_1: defineAsyncComponent(() => import('@/components/div3_1_II.vue')),
    Main3_2: defineAsyncComponent(() => import('@/components/div3_2_NI.vue')),
    Footer3: defineAsyncComponent(() => import('@/components/footer3.vue')),
    Header4: defineAsyncComponent(() => import('@/components/header4.vue')),
    Main4_1: defineAsyncComponent(() => import('@/components/div4_1_NI.vue')),
    Main4_2: defineAsyncComponent(() => import('@/components/div4_2_NI.vue')),
    Main4_3: defineAsyncComponent(() => import('@/components/div4_3_NI.vue')),
    Footer4: defineAsyncComponent(() => import('@/components/footer4.vue')),
};