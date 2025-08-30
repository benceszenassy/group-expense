import EventCreateView from '@/views/EventCreateView.vue'
import EventDetailsView from '@/views/EventDetailsView.vue'
import EventSettingsView from '@/views/EventSettingsView.vue'
import EventShareView from '@/views/EventShareView.vue'
import EventsView from '@/views/EventsView.vue'
import EventView from '@/views/EventView.vue'
import SettingsView from '@/views/SettingsView.vue'
import EventBillView from '@/views/EventBillView.vue'
import EventExpensesView from '@/views/EventExpensesView.vue'
import { createWebHistory, createRouter } from 'vue-router'
import idGuard from './id-guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'events',
      component: EventsView,
    },
    {
      path: '/event',
      component: EventView,
      children: [
        {
          path: '',
          name: 'event-create',
          component: EventCreateView,
        },
        {
          path: '/:id/expenses',
          name: 'event-expenses',
          component: EventExpensesView,
          beforeEnter: idGuard,
        },
        {
          path: '/:id/bill',
          name: 'event-bill',
          component: EventBillView,
          beforeEnter: idGuard,
        },
        {
          path: '/:id/share',
          name: 'event-share',
          component: EventShareView,
          beforeEnter: idGuard,
        },
        {
          path: '/:id/settings',
          name: 'event-settings',
          component: EventSettingsView,
          beforeEnter: idGuard,
        },
        {
          path: '/:id',
          name: 'event-details',
          component: EventDetailsView,
          beforeEnter: idGuard,
        },
      ],
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
  ],
})

export default router
