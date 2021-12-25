import Vue from 'vue';
import VueRouter from 'vue-router';
import Gallery from '@/views/Gallery.vue';
import Settings from '@/views/Settings.vue';
import Picture from '@/views/Picture.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Gallery',
        component: Gallery,
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings,
    },
    {
        path: '/picture/:path',
        name: 'Picture',
        component: Picture,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
