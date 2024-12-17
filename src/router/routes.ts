import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/track',
  },
  {
    path: '/track',
    component: () => import('layouts/MainLayout.vue'),
    children: [
    { path: '', name: 'track', component: () => import('pages/TrackPage.vue') },
    { path: 'add', name: 'add', component: () => import('pages/AddTrackPage.vue') }
    ],
  },
  {
    path: '/activities',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'activities', component: () => import('pages/ActivitiesPage.vue') },
      { path: ':id', name: 'viewer', component: () => import('pages/ActivityView.vue') },
      { path: ':id/edit', name: 'edit', component: () => import('pages/ActivityEditPage.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
