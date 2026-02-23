import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LineupView from '../views/LineupView.vue'
import TicketsView from '../views/TicketsView.vue'
import InfoView from '../views/InfoView.vue'
import GalleryView from '../views/GalleryView.vue'

const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/lineup', name: 'lineup', component: LineupView },
    { path: '/merch', name: 'merch', component: () => import('../views/MerchView.vue') },
    { path: '/tickets', name: 'tickets', component: TicketsView },
    { path: '/info', name: 'info', component: InfoView },
    { path: '/gallery', name: 'gallery', component: GalleryView },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})

export default router
