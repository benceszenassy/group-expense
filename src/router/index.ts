import EventCreateView from '@/views/EventCreateView.vue'
import EventDetailsView from '@/views/EventDetailsView.vue'
import EventSettingsView from '@/views/EventSettingsView.vue'
import EventShareView from '@/views/EventShareView.vue'
import EventsView from '@/views/EventsView.vue'
import EventView from '@/views/EventView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { createMemoryHistory, createRouter } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'events',
      component: EventsView,
    },
    {
      path: '/event',
      name: 'event',
      component: EventView,
      children: [
        {
          path: '/',
          name: 'event-create',
          component: EventCreateView,
        },
        {
          path: '/:id',
          name: 'event-details',
          component: EventDetailsView,
        },
        {
          path: '/:id/share',
          name: 'event-share',
          component: EventShareView,
        },
        {
          path: '/:id/settings',
          name: 'event-settings',
          component: EventSettingsView,
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
