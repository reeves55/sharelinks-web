<template>
    <nav id="sharelinks-nav" class="navbar navbar-default">
        <div class="nav-content">
            <div class="container-fluid">
                <div class="navbar-header">
                    <router-link class="navbar-brand" :to="{name:'root'}"><img style="width: 100px;height: 50px"
                                                                               src="/logo.png">
                    </router-link>
                </div>

                <div class="nav-items">
                    <ul class="nav navbar-nav">
                        <li v-if="hasLogin">
                            <router-link class="nav-item" :to="{name: 'addPost'}">我要分享链接</router-link>
                        </li>

                        <li v-if="hasLogin">
                            <router-link class="nav-item" v-if="hasLogin" :to="{name:'collection',params:{tag:'all'}}">
                                我的收藏
                            </router-link>
                        </li>

                        <li v-if="hasLogin">
                            <router-link class="nav-item" v-if="hasLogin" :to="{name:'note'}">
                                笔记
                            </router-link>
                        </li>

                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle nav-item" data-toggle="dropdown" aria-haspopup="true"
                               aria-expanded="false">分类 <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li v-for="category in categoryList" v-bind:key="category.fid"
                                    v-bind:category="category">
                                    <router-link :to="{name:'posts',params:{category:category.fname}}">
                                        {{category.fname}}
                                    </router-link>
                                </li>
                            </ul>
                        </li>

                        <li v-if="hasLogin">
                            <router-link class="nav-item" v-if="hasLogin" :to="{name:'notification'}">通知</router-link>
                            <span class="noti-num" v-if="newNotify"></span>
                        </li>
                    </ul>

                    <ul class="nav navbar-nav navbar-right">
                        <li>
                            <form class="navbar-form navbar-left" v-on:submit.prevent="search">
                                <div class="form-group">
                                    <input type="text" v-on:keyup="search" v-on:click="gotoSearch"
                                           v-model="searchKeyWord"
                                           class="form-control search-input" placeholder="Search">
                                </div>
                            </form>
                        </li>

                        <li class="avtar-item" v-if="!hasLogin" v-on:click="showLogin">
                            <img src="/avatar.png" class="avtar" data-toggle="tooltip" data-placement="bottom"
                                 title="您还未登陆">
                        </li>

                        <li id="login-dropdown-list" class="dropdown" v-if="hasLogin">
                            <a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                <img src="/login-avatar.png" class="avtar" data-toggle="tooltip"
                                     data-placement="bottom"
                                     title="已登陆">
                            </a>

                            <div class="dropdown-menu" id="login-menu">
                                <button class="btn btn-primary col-xs-12 col-sm-12" id="login-buttons-password"
                                        v-on:click="logout"
                                        type="button">
                                    退出登陆
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
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
            window.addEventListener('scroll', this.monitorScroll, true);
            // 检测通知浏览状态变化
            var that = this;
            eventBus.$on('notify-remove', function () {
                that.newNotify = false;
            });
        },
        methods: {
            monitorScroll: function () {
                var scollHeight = window.document.documentElement.scrollTop
                var el = document.getElementById('sharelinks-nav')
                if (scollHeight >= 20) {
                    el.setAttribute('class', 'navbar navbar-default shadow')
                } else {
                    el.setAttribute('class', 'navbar navbar-default')
                }
            },
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
                    }

                }).catch(error => {
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
            search: function () {
                if (this.searchKeyWord == '') {
                    return;
                }

                var interval = new Date().getTime() - this.searchTime;
                if (interval > 500) {
                    eventBus.$emit('searchKeyWord', this.searchKeyWord);
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
                        this.$router.go(0)
                        this.socket = null
                        this.stompClient = null
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
                this.socket = new SockJS(env.wshost + "/ws/notify?username="+username+"&token="+token);
                this.stompClient = Stomp.over(this.socket);
                var that = this
                this.stompClient.connect(
                    {},
                    frame => {
                        console.log(frame);

                        // 订阅和此用户单独有关的频道
                        this.stompClient.subscribe(
                            '/user/topic/single',
                            function(respnose){
                                that.newNotify = true;
                                console.log(respnose);
                            }
                        );

                        // 订阅所有用户都能接收到的频道
                        this.stompClient.subscribe('/topic/all',function () {
                            console.log('/topic/all')
                            that.newNotify = true
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
    /*@import "https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css";*/
    .noti-num {
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: #FF6666;
        border: none;
        position: absolute;
        right: 9px;
        top: 24px;
        z-index: 100;
        text-align: center;
        color: #fff;
        font-size: 12px;
    }

    #login-dropdown-list a {
        height: 70px;
    }

    #login-dropdown-list input {
        margin: 0 0 -1px;
        border-radius: 0px;
        position: relative;
        z-index: 1;
    }

    #login-dropdown-list input:first-of-type {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    .search-input {
        border-bottom: 1px solid #ccc;
        border-top: none;
        border-left: none;
        border-right: none;
        box-shadow: none;
        border-radius: 0px;
        width: 250px;
        max-width: 250px;
        position: relative;
        left: -50px;
        top: -3px
    }

    .search-input:focus {
        border-bottom: 2px solid #1371FB;
        color: #2577b7;
    }

    ul.nav {
        height: 100%;
    }

    nav {
        width: 100%;
        margin: auto;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        border-radius: 0px;
        background-color: #fff;
    }

    .navbar-header {
        float: left;
    }

    .navbar-header a {
        display: block;
        vertical-align: center;
        height: 100%;
    }

    .nav-items {
        display: block;
        width: 100%;
        padding-left: 150px;
    }

    .nav-items ul li a.nav-item {
        display: block;
        height: 100%;
        vertical-align: center;
        padding: 0px 20px;
        margin: 0px;
        line-height: 70px;
    }

    .nav-items ul li a.nav-item:hover {
        color: #1371FB;
    }

    ul.navbar-nav li {
        height: 100%;
    }

    ul.navbar-nav li form {
        margin: 0px;
        height: 100%;
        line-height: 70px;
        padding: 0px;
    }

    .container-fluid, .container-fluid div {
        height: 100%;
    }

    .nav-content {
        margin: auto;
        width: 90%;
        height: 70px;
    }

    .navbar-brand {
        color: #2577b7;
        font-weight: 600;
        padding: 10px;
    }

    .shadow {
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
    }

    a {
        cursor: pointer;
    }

    .avtar-item {
        position: relative;
        line-height: 70px;
        height: 60px;
        vertical-align: center;
        margin-left: 30px;
    }

    .avtar {
        border-radius: 50%;
        width: 30px;
        height: 30px;
        border: 2px solid white;
        text-decoration: none;
        cursor: pointer;
    }

    #login-menu {
        min-width: 200px;
        padding: 15px;
    }
</style>