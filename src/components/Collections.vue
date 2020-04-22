<template>
    <div class="content">
        <!--这里是不同颜色选项-->
        <div class="operation">
            <div class="left" style="display: flex;">
                <div class="manage">
                    <a @click="showManage">
                        <span class="fa fa-gear">&nbsp;管理</span>
                    </a>
                </div>

                <div :class="mode==0? 'manage active':'manage'">
                    <router-link :to="{name:'colorCollection',params:{mark:'all'}}">
                        <span class="fa fa-reorder">&nbsp;列表</span>
                    </router-link>
                </div>

                <div :class="mode==1? 'manage active':'manage'">
                    <router-link :to="{name:'tagCollection',params:{tag:'all'}}">
                        <span class="fa fa-tags">&nbsp;标签</span>
                    </router-link>
                </div>
            </div>

            <div class="filter" v-if="mode==0">
                筛选收藏：
                <a v-on:click="changeMark(0)" class="all" title="全部"></a>
                <a v-on:click="changeMark(1)" class="redMark" title="红色标签"></a>
                <a v-on:click="changeMark(2)" class="orangeMark" title="橙色标签"></a>
                <a v-on:click="changeMark(3)" class="yellowMark" title="黄色标签"></a>
                <a v-on:click="changeMark(4)" class="greenMark" title="绿色标签"></a>
                <a v-on:click="changeMark(5)" class="blueMark" title="蓝色标签"></a>
                <a v-on:click="changeMark(6)" class="purpleMark" title="紫色标签"></a>
                <a v-on:click="changeMark(7)" class="greyMark" title="灰色标签"></a>
            </div>
        </div>

        <div class="color-div" v-if="mode==0" style="width: 100%">
            <!-- 列表视图 -->
            <div id="posts" class="posts">
                <!-- 收藏链接 -->
                <div class="post" v-for="post in posts" v-bind:key="post.fid" v-bind:post="post">
                    <div class="colorTag">
                    <span id="colorTagValue"
                          v-bind:class="markClass==0? 'all':markClass==1? 'redMark':markClass==2?'orangeMark':markClass==3? 'yellowMark': markClass==4? 'greenMark': markClass==5? 'blueMark':markClass==6? 'purpleMark':markClass==7?'greyMark':'none'"></span>
                    </div>
                    <div class="post-content">
                        <h3>
                            <a v-bind:href="post.url" target="_blank" :title="post.title">{{post.title}}</a>

                        </h3>
                        <p style="color: #b2bac2;">
                            <span class="author">{{post.author}}</span><span class="date">{{post.date}}</span>
                            <router-link v-bind:class="post.category | getCategoryClass"
                                         v-bind:to="'/posts/'+post.category">
                                {{post.category}}
                            </router-link>
                            <a v-if="post.new" class="new-link">NEW</a>

                            <router-link class="goto-detail" v-bind:to="{name:'postDetail',params:{id:post.fid}}"
                                         style="margin-left: 10px;text-decoration: underline;color: lightgray">
                                <div style="width: 24px;display: inline-block;text-align: center"><span
                                        class="fa fa-lg fa-angle-double-right"></span></div>
                            </router-link>
                        </p>
                    </div>

                    <div class="right">
                        <div style="display: flex;align-items: center;height: 100%;padding: 0px 5px"
                             v-on:mouseleave="closeTipWindow($event)">
                            <div class="share" v-if="post.fauthor==username">
                                <div class="show" v-if="post.fshare=='Y'" title="点击取消分享"
                                     v-on:click="cancelShare(post.fid,$event)"><span
                                        class="fa fa-lg fa-check"></span></div>
                                <div v-if="post.fshare=='N'" title="分享此链接"
                                     class="notopen" v-on:mouseenter="openTipWindow($event)"
                                     style="position: relative">
                                    <span class="fa fa-lg fa-paper-plane-o"></span>

                                    <div class="tip-window" style="border: none;margin-top: 12px">
                                        <div class="categoryList">
                                            <ul class="dropdown-menu">
                                                <li v-for="category in categoryList" v-bind:key="category.fid"
                                                    v-on:click="sharePost(post.fid,category.fname,$event)"
                                                    v-bind:category="category">
                                                    <a>{{category.fname}}</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div class="colorMark" id="colorMark">
                            <div>
                                <a v-on:click="toggleColorMarkChoice(post.fid,$event)" class="btn btn-default">标记</a>

                                <div class="tip-window" style="visibility: hidden">
                                    <div class="tip-arrow"></div>
                                    <div class="colorMarkContent">
                                        <a v-on:click="markUserCollection(post.fid,1,$event)" class="redMark"></a>
                                        <a v-on:click="markUserCollection(post.fid,2,$event)" class="orangeMark"></a>
                                        <a v-on:click="markUserCollection(post.fid,3,$event)" class="yellowMark"></a>
                                        <a v-on:click="markUserCollection(post.fid,4,$event)" class="greenMark"></a>
                                        <a v-on:click="markUserCollection(post.fid,5,$event)" class="blueMark"></a>
                                        <a v-on:click="markUserCollection(post.fid,6,$event)" class="purpleMark"></a>
                                        <a v-on:click="markUserCollection(post.fid,7,$event)" class="greyMark"></a>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!--收藏操作：标记颜色或者取消收藏-->
                        <a v-on:click="cancelCollect(post.fid)" class="discuss btn btn-default">取消收藏</a>

                    </div>
                </div>
            </div>

            <a class="load-more" v-on:click="loadMore" v-if="hasMore && posts.length>=30">{{loadingMore? '':'加载更多'}}
                <img v-if="loadingMore" src="/loading-img.gif" height="55px" width="55px"
                     style="display: inline-block"/>
            </a>
        </div>

        <div class="tag-div" v-if="mode==1">
            <!-- 标签视图 -->
            <Tag v-for="tag in tagList" :key="tag.name" :tag="tag" :category-list="categoryList"></Tag>
        </div>

        <div class="loading" v-if="loading">
            <div class="loading-center">
                <img src="/loading-img.gif" height="80px" width="80px" style="display: inline-block"/>
            </div>
        </div>

        <!-- 管理用户自己的分类 -->
        <Manage v-if="manageStatus" v-on:close="closeMarkWindow"></Manage>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    import axios from 'axios';
    import transferTime from '../assets/js/transferTime';
    import env from '../assets/js/env';
    import Manage from './Manage';
    import Tag from './Tag';

    export default {
        name: "collections",
        components: {
            Manage, Tag
        },
        data: function () {
            return {
                tagList: [],
                categoryList: [],
                posts: [],
                mark: 0,
                hasMore: true,
                loading: true,
                page: 0,
                markClass: 0,
                loadingMore: false,
                username: '',
                manageStatus: false,
                mode: 0
            }
        },
        created: function () {
            window.addEventListener('scroll', this.handleScroll, true);
            this.username = this.$cookie.get("username");

            setTimeout(() => {
                this.loadPageData();
            }, 200);

            this.init();
        },
        watch: {
            '$route'(to) {
                this.mark = to.params.mark;
            },
            'mark'() {
                // 切换不同颜色标签时，重置页面内容
                this.posts = [];
                this.loading = true;

                setTimeout(()=> {
                    this.loadPageData();
                }, 100);
            }
        },
        filters: {
            getCategoryClass: function (category) {
                var type = '';
                switch (category) {
                    case 'Docker':
                    case '优秀官网':
                    case '软件':
                    case '程序开发':
                        type = 'blue-link';
                        break;
                    case 'IT资源':
                    case '大数据':
                    case 'MongoDB':
                        type = 'pink-link';
                        break;
                    case '设计':
                    case '人工智能':
                    case '区块链':
                    case '其他资源':
                        type = 'orange-link';
                        break;
                    default:
                        type = 'blue-link';
                        break;
                }

                return 'catagory-link' + ' ' + type;
            }
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
            },
            changeMode: function (mode) {
                this.mode = mode;

                if (mode == 1) {
                    // 请求标签数据
                    var url = env.host + '/collection/tag'
                    axios.post(url, {
                        username: this.$cookie.get('username'),
                        token: this.$cookie.get('token'),
                        tag: 'summary',
                        page: 1
                    }).then(response => {
                        var msg = response.data;
                        if (msg.code > 0) {
                            this.tagList = msg.data;
                        }
                    }).catch(error => {
                        console.error(error);
                    });
                }
            },
            openTipWindow: function (event) {
                var el = event.target;
                el.setAttribute('class', 'open');
            },
            closeTipWindow: function (event) {
                var el = event.target;
                var shareEl = el.getElementsByClassName('open');
                if (shareEl && shareEl.length > 0) {
                    shareEl[0].setAttribute('class', 'notopen');
                }
            },
            showManage: function () {
                this.manageStatus = true;
            },
            closeMarkWindow: function () {
                this.manageStatus = false;
            },
            cancelShare: function (postId) {
                // 取消分享用户收藏的链接
                var url = env.host + '/posts/cancelshare'
                axios.post(url, {
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token'),
                    fpostId: postId
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        var i = 0;
                        for (; i < this.posts.length; i++) {
                            if (this.posts[i].fid == postId) {
                                break;
                            }
                        }

                        this.posts[i].fshare = 'N';

                        this.$swal({
                            type: 'success',
                            title: '取消分享成功',
                            showConfirmButton: false,
                            timer: 1000
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            sharePost: function (postId, category) {
                // 分享用户收藏的链接
                var url = env.host + '/posts/share';
                axios.post(url, {
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token'),
                    fpostId: postId,
                    category: category
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        var i = 0;
                        for (; i < this.posts.length; i++) {
                            if (this.posts[i].fid == postId) {
                                break;
                            }
                        }

                        this.posts[i].fshare = 'Y';

                        this.$swal({
                            type: 'success',
                            title: '谢谢你的分享 ' + String.fromCodePoint(0x1F929),
                            showConfirmButton: false,
                            timer: 1000
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            deletePost: function (postId) {
                var i = 0;
                for (; i < this.posts.length; i++) {
                    if (this.posts[i].fid == postId) {
                        break;
                    }
                }

                this.posts.splice(i, 1);
            },
            cancelCollect: function (postId) {
                this.$swal({
                    title: '确定取消收藏吗?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showCloseButton: true,
                    showLoaderOnConfirm: true
                }).then((result) => {
                    if (result.value) {
                        // 确定取消收藏
                        var url = env.host + '/collection/delete'
                        axios.post(url, {
                            username: this.$cookie.get('username'),
                            token: this.$cookie.get('token'),
                            fpostId: postId
                        }).then(response => {
                            var msg = response.data;
                            if (msg.code > 0) {
                                this.deletePost(postId)

                                this.$swal({
                                    type: 'success',
                                    title: '取消成功',
                                    showConfirmButton: false,
                                    timer: 1000
                                });
                            }
                        }).catch(error => {
                            console.error(error);
                        });
                    }
                });
            },
            markUserCollection: function (postId, mark, event) {
                // axios标记用户收藏
                var url = env.host + '/collection/color/mark'
                axios.post(url, {
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token'),
                    colortag: mark,
                    fpostId: postId
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        if (this.mark != 0) {
                            this.deletePost(postId)
                        }

                        this.$swal({
                            type: 'success',
                            title: '标记成功',
                            showConfirmButton: false,
                            timer: 1000
                        });
                    }
                }).catch(error => {
                    console.error(error);
                }).finally(() => {
                    var el = event.target;
                    var markEl = el.parentElement.parentElement;
                    markEl.setAttribute('style', 'visibility: hidden');
                });
            },
            toggleColorMarkChoice: function (postId, event) {
                var el = event.target;
                var markEl = el.parentElement.children[1];
                if (markEl.getAttribute("style") == 'visibility: visiable') {
                    markEl.setAttribute("style", "visibility: hidden");
                } else {
                    markEl.setAttribute("style", "visibility: visiable");
                }
                event.stopPropagation();
            },
            changeMark: function (mark) {
                this.hasMore = true;
                this.page = 0;
                this.mark = mark;
            },
            handleScroll: function () {
                var contentHeight = window.document.body.scrollHeight
                var scollHeight = window.document.documentElement.scrollTop
                var viewHeight = window.document.documentElement.clientHeight
                var bottomDis = contentHeight - scollHeight - viewHeight

                if (bottomDis <= 0) {
                    this.loadMore();
                }
            },
            loadPageData: function () {
                if (!this.hasMore) return
                this.page = this.page + 1; // 为了防止重复请求

                var url = env.host + '/collection/color';

                // ajax请求页面数据
                axios.post(url, {
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token'),
                    colortag: this.mark,
                    page: this.page - 1
                }).then(response => {
                    var msg = response.data;
                    if (msg.data.length > 0) {
                        var formattedPosts = msg.data;
                        formattedPosts.forEach(function (element) {
                            element.url = element.furl;
                            element.title = element.ftitle;
                            element.author = element.fauthor;
                            element.like = element.flike;
                            element.category = element.fcategory;
                            element.categoryURL = '/posts/page?category=' + element.fcategory;

                            var parser = document.createElement('a');
                            parser.href = element.furl;
                            element.subTitle = parser.hostname;
                            element.date = transferTime(element.faddedTime);

                            var addedTime = new Date(element.faddedTime).getTime();
                            var dayBegin = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                            element.new = (addedTime - dayBegin) < 24 * 60 * 60 * 1000 && addedTime - dayBegin > 0 ? true : false;
                        });

                        this.posts = this.posts.concat(formattedPosts);
                    } else {
                        this.hasMore = false;
                    }
                    this.markClass = this.mark
                }).catch(error => {
                    this.page = this.page - 1;
                    console.error(error);
                }).finally(() => {
                    this.loading = false;
                    this.loadingMore = false;
                });
            },
            loadMore: function () {
                this.loadingMore = true;

                setTimeout(()=> {
                    this.loadPageData();
                }, 150);
            }
        }
    }
</script>

<style scoped>
    .tag-div {
        width: 100%;
        display: flex;
        position: relative;
        padding: 20px 23px 20px 0px;
    }

    .dropdown-menu li:hover a {
        color: #1371FB;
    }

    .categoryList ul {
        margin: 0px;
        display: flex;
        flex-direction: column;
        width: 100%;
        text-decoration: none;
    }

    .categoryList ul li {
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    .colorMark {
        position: relative;
        display: flex;
        margin-right: 10px;
    }

    .right {
        position: absolute;
        right: 20px;
        top: 0px;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .post:hover .share {
        visibility: visible;
    }

    .share {
        display: flex;
        align-items: center;
        justify-content: center;
        visibility: hidden;
        color: #1371FB;
        line-height: 24px;
        margin-right: 20px;
        padding: 10px;
        border-radius: 15px;
        width: 30px;
        height: 30px;
        position: relative;
    }

    .share {
        visibility: hidden;
    }

    .share .show {
        visibility: visible;
    }

    .share:hover {
        background-color: #F1F3F4;
    }

    .share div {
        cursor: pointer;
    }

    .post .discuss {
        display: block;
        float: right;
    }

    .colorMarkContent {
        width: 100%;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .colorMarkContent a {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 8px;
    }

    .colorTag {
        float: left;
        margin-top: 14px;
        margin-right: 15px;
    }

    .operation {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 64px;
    }

    .manage {
        display: flex;
        height: 100%;
        align-items: center;
        color: #aaa;
        padding: 0px 10px 0px 5px;
    }

    .manage a {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 15px;
        line-height: 20px;
        transition: all 200ms ease-out;
        text-decoration: none;
        color: #aaa;
    }

    .manage a:hover {
        color: #666;
    }

    .manage.active div {
        color: #666;
    }

    .filter {
        margin: 20px 15px 20px;
    }

    .filter a {
        cursor: pointer;
        margin-left: 5px;
    }

    .content {
        width: 80%;
        margin: auto;
        padding-top: 50px;
        max-width: 1300px;
    }

    .post .btn {
        border-radius: 0px;
    }
</style>