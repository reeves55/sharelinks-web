<template>
    <div class="content">
        <div style="display: flex;justify-content: flex-end;width: 100%">
            <div id="choice" class="btn-group btn-group-sm type" role="group" aria-label="...">
                <button v-on:click="newest" id="newBtn" type="button" v-bind:class="newClass">最新</button>
                <button v-on:click="hotest" id="popularBtn" type="button" v-bind:class="hotClass">最热</button>
            </div>
        </div>


        <div id="posts" class="posts">
            <Post v-for="post in posts" :key="post.fid" :post="post" :edit="false" :operation="true" :tags="tags"></Post>
        </div>

        <a class="load-more" v-on:click="loadMore" v-if="hasMore">{{loadingMore? '':'加载更多'}}
            <img v-if="loadingMore" src="/loading-img.gif" height="55px" width="55px" style="display: inline-block"/>
        </a>

        <div class="loading" v-if="loading">
            <div class="loading-center">
                <img src="/loading-img.gif" height="80px" width="80px" style="display: inline-block"/>
            </div>
        </div>

        <div class="place" v-if="!loaded"></div>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    import axios from 'axios'
    import transferTime from '../assets/js/transferTime'
    import VueElementLoading from 'vue-element-loading'
    import Post from './Post'
    import eventBus from '../assets/js/eventBus'
    import env from '../assets/js/env'

    export default {
        name: "posts",
        components: {
            VueElementLoading,
            Post
        },
        data: function () {
            return {
                tags: [],
                posts: [],
                postPage: {},
                category: 'all',
                order: '',
                newClass: 'btn btn-default active',
                hotClass: 'btn btn-default',
                searchKeyWord: '',
                hasMore: true,
                loading: true,
                loaded: false,
                loadingMore: false
            }
        },
        created: function () {
            this.init();
            var path = this.$route.path;
            var categoryParam = path.split('/')[path.split('/').length - 1];
            if (categoryParam != this.category) {
                this.category = categoryParam;
            }
            this.loadPageData();
            window.addEventListener('scroll', this.handleScroll, true);
        },
        watch: {
            '$route'(to) {
                this.category = to.params.category;
                this.loading = true;
                setTimeout(()=> {
                    this.loadPageData();
                }, 100);

                eventBus.$emit('up-to-top');
            }
        },
        methods: {
            init: function () {
                // 获取用户定义的标签
                var url = env.host + '/user/getcoltags'
                axios.post(url, {
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token'),
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        msg.data.forEach((item)=> {
                            this.tags.push({name: item});
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            handleScroll: function () {
                var contentHeight = window.document.body.scrollHeight
                var scollHeight = window.document.documentElement.scrollTop
                var viewHeight = window.document.documentElement.clientHeight
                var bottomDis = contentHeight - scollHeight - viewHeight

                if (bottomDis <= 0) {
                    this.loadMore()
                }
            },
            loadPageData: function () {
                var url = '';
                if ('all' == this.category) {
                    url = env.host + "/posts/page";

                    if ('' != this.order) {
                        url = url + "?order=" + this.order;
                    }
                } else {
                    url = env.host + "/posts/page?category=" + this.category;

                    if ('' != this.order) {
                        url = url + "&order=" + this.order;
                    }
                }

                // ajax请求页面数据
                axios.get(url)
                    .then(response => {
                        this.postsPage = response.data;
                        if (this.postsPage.pageable.pageNumber >= this.postsPage.totalPages - 1) {
                            this.hasMore = false;
                        } else {
                            this.hasMore = true;
                        }

                        var content = this.postsPage.content;
                        content.forEach(function (element) {
                            var parser = document.createElement('a');
                            parser.href = element.furl;
                            element.subTitle = parser.hostname;
                            element.date = transferTime(element.faddedTime);

                            var addedTime = new Date(element.faddedTime).getTime();
                            var dayBegin = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                            element.new = (addedTime - dayBegin) < 24 * 60 * 60 * 1000 && addedTime - dayBegin > 0 ? true : false;
                        });

                        this.posts = content;
                    })
                    .catch(error => {
                        console.error(error);
                    })
                    .finally(() => {
                        this.loading = false;
                        this.loaded = true
                    });
            },
            loadMore: function () {
                this.loadingMore = true;

                // 显示加载动画
                setTimeout(()=> {
                    if (this.postsPage.pageable.pageNumber >= this.postsPage.totalPages - 1) {
                        this.hasMore = false;
                    } else {
                        var url = '';
                        if ('all' == this.category) {
                            url = env.host + "/posts/page?page=" + (this.postsPage.pageable.pageNumber + 1);
                        } else {
                            url = env.host + "/posts/page?category=" + this.category + "&page=" + (this.postsPage.pageable.pageNumber + 1);
                        }

                        // 按最新或者最热排序
                        if ('' != this.order) {
                            url = url + "&order=" + this.order;
                        }

                        // ajax请求页面数据
                        axios.get(url)
                            .then(response => {
                                this.postsPage = response.data;
                                var content = response.data.content;

                                if (content.length > 0) {
                                    var posts = this.posts;
                                    content.forEach(function (element) {
                                        var parser = document.createElement('a');
                                        parser.href = element.furl;
                                        element.subTitle = parser.hostname;
                                        element.date = transferTime(element.faddedTime);

                                        var addedTime = new Date(element.faddedTime).getTime();
                                        var dayBegin = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                                        element.new = (addedTime - dayBegin) < 24 * 60 * 60 * 1000 && addedTime - dayBegin > 0 ? true : false;
                                        posts.push(element);
                                    });
                                } else {
                                    this.loading = false
                                }
                            })
                            .catch(error => {
                                console.error(error);
                            })
                            .finally(() => this.loadingMore = false);
                    }
                }, 250);
            },
            hotest: function () {
                this.order = 'flike';
                this.hotClass = 'btn btn-default active';
                this.newClass = 'btn btn-default';
                this.loading = true;
                setTimeout(()=> {
                    this.loadPageData();
                }, 200);
            },
            newest: function () {
                this.order = '';
                this.hotClass = 'btn btn-default';
                this.newClass = 'btn btn-default active';
                this.loading = true;
                setTimeout(()=> {
                    this.loadPageData();
                }, 200);
            }
        }
    }
</script>

<style scoped>
    .place {
        height: 2000px;
        width: 100%;
    }

    .content {
        width: 80%;
        margin: auto;
        padding-top: 50px;
        max-width: 1300px;
    }

    #choice {
        float: right;
        right: 10px;
        margin-bottom: 20px;
        margin-top: 20px;
    }

    #newBtn {
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
    }

    #popularBtn {
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
    }

    .posts {
        clear: both;
        width: 100%;
    }
</style>