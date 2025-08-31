import EventCreateView from '@/views/EventCreateView.vue'
import EventDetailsView from '@/views/EventDetailsView.vue'
import EventShareView from '@/views/EventShareView.vue'
import EventsView from '@/views/EventsView.vue'
import EventView from '@/views/EventView.vue'
import SettingsView from '@/views/SettingsView.vue'
import EventBillView from '@/views/EventBillView.vue'
import EventExpensesView from '@/views/EventExpensesView.vue'
import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import idGuard from './id-guard'

export const routes = [
  {
    path: '/',
    name: 'events' as const,
    component: EventsView,
  },
  {
    path: '/event',
    component: EventView,
    children: [
      {
        path: '',
        name: 'event-create' as const,
        component: EventCreateView,
      },
      {
        path: '/:id/expenses',
        name: 'event-expenses' as const,
        component: EventExpensesView,
        beforeEnter: idGuard,
      },
      {
        path: '/:id/bill',
        name: 'event-bill' as const,
        component: EventBillView,
        beforeEnter: idGuard,
      },
      {
        path: '/:id/share',
        name: 'event-share' as const,
        component: EventShareView,
        beforeEnter: idGuard,
      },
      {
        path: '/:id',
        name: 'event-details' as const,
        component: EventDetailsView,
        beforeEnter: idGuard,
      },
    ],
  },
  {
    path: '/settings',
    name: 'settings' as const,
    component: SettingsView,
  },
]

type RouteName<T extends RouteRecordRaw | RouteRecordRaw[]> = T extends RouteRecordRaw
  ? T['children'] extends RouteRecordRaw[]
    ? RouteName<T['children'][number]>
    : T['name']
  : T extends RouteRecordRaw[]
    ? RouteName<T[number]>
    : never
export type RoutesNames = RouteName<typeof routes>

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
