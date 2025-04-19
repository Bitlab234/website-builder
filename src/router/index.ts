import { createRouter, createWebHistory } from 'vue-router';

import TemplateListPage from '../pages/TemplateListPage.vue';
import TemplateDetailPage from '../pages/TemplateDetailPage.vue';
import LandingEditorPage from '../pages/LandingEditorPage.vue';
import LandingPage from '../pages/LandingPage.vue';
import mainTemp from '../components/mainTemp.vue'; 

const routes = [
  {
    path: '/',
    name: 'TemplateList',
    component: TemplateListPage,
  },
  {
    path: '/template/:id',
    name: 'TemplateDetail',
    component: TemplateDetailPage,
  },
  {
    path: '/editor/:templateId',
    name: 'LandingEditor',
    component: LandingEditorPage,
  },
  { 
    path: '/editorLanding',
    name: 'LandingEditorPage', 
    component: LandingPage,
  },
  {
    path: '/mainTemp',
    name: 'Test',
    component: mainTemp,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;