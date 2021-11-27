import {createRouter, createWebHashHistory} from "vue-router";
import Home from "../views/Home.vue";
import { cookies } from "../utils/cookies"
 
const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/products",
                name: "products",
                meta: {
                    title: 'Product List'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/Products.vue")
            },
            {
                path: "/addProduct",
                name: "addProduct",
                meta: {
                    title: 'Add Product'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/AddProduct.vue")
            },
            {
                path: "/editProduct/:id",
                name: "editProduct",
                meta: {
                    title: 'Edit Product'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/EditProduct.vue")
            },
            {
                path: "/category",
                name: "category",
                meta: {
                    title: ' Product Categories'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/Category.vue")
            },
            {
                path: "/addCategory",
                name: "addCategory",
                meta: {
                    title: 'Add Category'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/AddCategory.vue")
            },
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: 'Dashboard'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            },
            {
                path: '/404',
                name: '404',
                meta: {
                    title: '找不到页面'
                },
                component: () => import (/* webpackChunkName: "404" */ '../views/404.vue')
            }, {
                path: '/403',
                name: '403',
                meta: {
                    title: '没有权限'
                },
                component: () => import (/* webpackChunkName: "403" */ '../views/403.vue')
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const token = cookies.get("api-token");
    if (!token && to.path !== '/login') {
        next('/login');
    } 
    next()
});

export default router;