import Vue from "vue";
import VueRouter from "vue-router";

// 引入组件
import Posts from "./components/Posts"
import AddPost from './components/AddPost'
import PostDetail from './components/PostDetail'
import PostSearch from './components/PostSearch'
import Collections from './components/Collections'
import Notify from './components/Notify'
import Note from './components/Note'
//import TagePage from './components/TagePage'

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter);

const routes = [
    {
        name: 'posts',
        path: "/posts/:category",
        component: Posts
    },
    {
        name: 'postDetail',
        path: '/posts/detail/:id',
        component: PostDetail
    },
    {
        name: 'postSearch',
        path: '/posts/search/:keyword',
        component: PostSearch
    }
    ,
    {
        name: 'addPost',
        path: '/addPost',
        component: AddPost
    },
    {
        name: 'colorCollection',
        path: '/colorcol/:mark',
        component: Collections
    },
    {
        name: 'tagCollection',
        path: '/tagcol/:tag',
        component: Collections
    },
    {
        name: 'notification',
        path: '/notify',
        component: Notify
    },
    {
        name: 'note',
        path: '/note',
        component: Note
    },
    {
        name: 'root',
        path: '/',
        redirect: '/colorcol/all'
    }
]

var router = new VueRouter({
    mode: 'history',
    routes: routes
})
export default router;