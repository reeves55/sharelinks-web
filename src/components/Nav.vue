<template>
    <nav id="sharelinks-nav" class="nav shrink">
        <div class="left">
            <div class="logo">
                <router-link :to="hasLogin? {name: 'root'}:{name: 'posts',params:{category: 'all'}}" title="我的收藏"><img
                        style="width: 100px;height: 50px" src="/logo.png">
                </router-link>
            </div>

            <div class="menu">
                <li v-if="hasLogin">
                    <router-link :to="{name: 'addPost'}"><span class="fa fa-plus"></span></router-link>
                </li>

                <li class="dropdown">
                    <a href="#" class="dropdown-toggle nav-item" data-toggle="dropdown" aria-haspopup="true"
                       aria-expanded="false">发现&nbsp;<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li>
                            <router-link :to="{name:'posts',params:{category:'all'}}">
                                全部
                            </router-link>
                        </li>
                        <li v-for="category in categoryList" v-bind:key="category.fid"
                            v-bind:category="category">
                            <router-link :to="{name:'posts',params:{category:category.fname}}">
                                {{category.fname}}
                            </router-link>
                        </li>
                    </ul>
                </li>

                <li v-if="hasLogin">
                    <router-link v-if="hasLogin" :to="{name:'notification'}">
                        通知
                    </router-link>
                </li>
            </div>
        </div>
        <div class="right">
            <div class="search">
                <li>
                    <form v-on:submit.prevent="search">
                        <input type="text" v-on:keyup="search" v-on:click="gotoSearch"
                               v-model="searchKeyWord"
                               class="form-control search-input" placeholder="Search">
                    </form>
                </li>
            </div>

            <div class="avatar">
                <li class="avtar-item" v-if="!hasLogin" v-on:click="showLogin">
                    <img src="/avatar.png" class="avtar" data-toggle="tooltip" data-placement="bottom"
                         style="width: 25px;height: 25px;"
                         title="您还未登陆">
                </li>

                <li class="dropdown" v-if="hasLogin">
                    <a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                        <img src="/login-avatar.png" class="avtar" data-toggle="tooltip"
                             style="height: 25px;width: 25px"
                             data-placement="bottom"
                             title="已登陆">
                    </a>

                    <div class="dropdown-menu dropdown-menu-right"
                         style="padding: 10px;border-radius: 0px;min-width: 200px">
                        <button class="btn btn-primary col-xs-12 col-sm-12" id="login-buttons-password"
                                v-on:click="logout"
                                type="button">
                            退出登陆
                        </button>
                    </div>
                </li>
            </div>
        </div>

        <LoginModal v-on:loginSubmit="loginSubmit" v-if="showLoginDialog" v-on:close="closeLoginDialog"></LoginModal>
    </nav>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error" ,"log"] }] */
    import axios from 'axios'
    import eventBus from '../assets/js/eventBus'
    import LoginModal from './LoginModal'
    import env from '../assets/js/env'
    import SockJS from 'sockjs-client'
    import Stomp from 'webstomp-client'

    export default {
        name: "sharelinks-nav",
        components: {
            LoginModal
        },
        data: function () {
            return {
                categoryList: [],
                searchKeyWord: '',
                hasLogin: false,
                showLoginDialog: false,
                searchTime: 0,
                newNotify: false,
                socket: null,
                stompClient: null
            }
        },
        mounted: function () {
            this.init();
            //this.connect();
        },
        created: function () {
            // 检测通知浏览状态变化
            eventBus.$on('notify-remove', ()=> {
                this.newNotify = false;
            });

            window.addEventListener('scroll', this.monitorScroll, true);
        },

        methods: {
            init: function () {
                // 初始化分类信息
                var url = env.host + "/category/all";
                axios.get(url)
                    .then(response => {
                        this.categoryList = response.data;
                    }).catch(error => {
                    console.error(error);
                });

                var username = this.$cookie.get('username');
                var token = this.$cookie.get('token');

                // 登陆认证
                axios.post(env.host + '/user/login', {
                    username: username,
                    token: token
                }).then(response => {
                    console.log(response.data);
                    var content = response.data;
                    if (content.code > 0) {
                        this.hasLogin = true
                        this.connect();
                    } else {
                        this.$router.push({name: 'posts', params: {category: 'all'}});
                    }

                }).catch(error => {
                    this.$router.push({name: 'posts', params: {category: 'all'}});
                    console.log('用户未登陆');
                    console.log(error);
                });

                // 检测是否有新的通知
                url = '';
                axios.post(env.host + '/notify/detect', {
                    username: username,
                    token: token
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        this.newNotify = msg.data;
                    }

                }).catch(error => {
                    console.log(error);
                });
            },
            monitorScroll: function () {
                var scollHeight = window.document.documentElement.scrollTop
                var el = document.getElementById('sharelinks-nav')
                if (scollHeight >= 20) {
                    el.setAttribute('class', 'nav shrink shadow')
                } else {
                    el.setAttribute('class', 'nav shrink')
                }
            },
            search: function () {
                if (this.searchKeyWord == '') {
                    eventBus.$emit('searchKeyWord', '*');
                } else {
                    var interval = new Date().getTime() - this.searchTime;
                    if (interval > 500) {
                        eventBus.$emit('searchKeyWord', this.searchKeyWord);
                    }

                    this.searchTime = new Date().getTime();
                }
            },
            gotoSearch: function () {
                this.$router.push({path: '/posts/search/' + ' '});
            },
            showLogin: function () {
                this.showLoginDialog = true
            },
            closeLoginDialog: function () {
                this.showLoginDialog = false
            },
            loginSubmit: function (result) {
                if (result == 'OK') {
                    this.$router.go(0)
                }
            },
            logout: function () {
                var url = env.host + '/user/logout';
                axios.post(url, {
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token')
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        this.$cookie.delete('username');
                        this.$cookie.delete('token');

                        if (this.$route.name == 'collection') {
                            // 如果从我的收藏界面登出，则重定向到发现界面
                            this.$router.push({name: 'posts', params: {category: 'all'}});
                            this.hasLogin = false;
                        } else {
                            this.$router.go(0)
                        }

                        this.socket = null;
                        this.stompClient = null;
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            // websocket connection
            connect: function () {
                console.log("ready to connect websocket server...");
                var username = this.$cookie.get('username');
                var token = this.$cookie.get('token');
                this.socket = new SockJS(env.wshost + "/ws/notify?username=" + username + "&token=" + token);
                this.stompClient = Stomp.over(this.socket);
                this.stompClient.connect(
                    {},
                    frame => {
                        console.log(frame);

                        // 订阅和此用户单独有关的频道
                        this.stompClient.subscribe(
                            '/user/topic/single',
                            (respnose) => {
                                this.newNotify = true;
                                console.log(respnose);
                            }
                        );

                        // 订阅所有用户都能接收到的频道
                        this.stompClient.subscribe('/topic/all', ()=> {
                            console.log('/topic/all')
                            this.newNotify = true
                        });
                    },
                    error => {
                        console.log(error);
                    }
                );
            }
        }
    }
</script>

<style scoped>
    .nav {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding: 0 5%;
        justify-content: space-between;
        height: 80px;
        transition: all 200ms ease;
        background-color: #fff;
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        z-index: 1000;
        border-bottom: 1px solid #E7E7E7;
    }

    nav::before, nav::after {
        display: none;
    }

    .shadow {
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 2px 4px -1px rgba(0, 0, 0, .2);
    }

    .nav:hover .menu {
        visibility: visible;
    }

    .nav .left {
        display: flex;
        align-items: center;
    }

    .nav .left .menu {
        display: flex;
        height: 100%;
        flex-direction: row;
        transition: all 200ms ease-out;
    }

    .shrink {
        height: 50px !important;
    }

    .shrink .menu {
        padding-left: 20px;
    }

    .menu a {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0px 20px;
        color: #777;
        text-decoration: none;
        width: 100%;
    }

    .menu a:hover {
        color: #1371FB;
    }

    .menu li {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .nav .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .search {
        height: 100%;
        padding-right: 50px;
    }

    .search li {
        display: flex;
        height: 80%;
        align-items: center;
    }

    .search li input {
        height: 40px;
    }

    .avatar {
        display: flex;
        height: 100%;
    }

    .avatar li {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .avatar li a {
        display: flex;
        height: 100%;
        align-items: center;
        padding: 0 20px;
    }

    .avtar-item {
        cursor: pointer;
    }
</style>