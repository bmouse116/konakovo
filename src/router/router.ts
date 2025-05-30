import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/MainPage.vue";
import AfishaPage from "../pages/AfishaPage.vue";
import AfishaInfo from "../pages/AfishaInfo.vue";

const routes = [
    {
        path: '/',
        component: MainPage,
        name: 'MainPage'
    },
    {
        path: '/afisha',
        component: AfishaPage,
        name: 'AfishaPage'
    },
    {
        path: '/afisha-info/:id',
        component: AfishaInfo,
        name: 'AfishaInfo'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router