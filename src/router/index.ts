import { createRouter, createWebHistory } from 'vue-router';

import TemplateListPage from '../pages/TemplateListPage.vue';
import TemplateDetailPage from '../pages/TemplateDetailPage.vue';
import LandingEditorPage from '../pages/LandingEditorPage.vue';
import LandingsList from '../pages/LandingsList.vue';
import LandingView from '../pages/LandingView.vue';
import Login from '../pages/Login.vue';
import AdminPanel from '../pages/AdminPanel.vue';

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
    path: '/LandingsList',
    name: 'LandingListPage',
    component: LandingsList,
  },
  {
    path: '/Landings/:id',
    name: 'LandingPage',
    component: LandingView,
  },
  {
    path: '/admin/login',
    neme: 'adminLogin',
    component: Login,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanel,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;