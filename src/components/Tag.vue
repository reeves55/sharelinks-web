<template>
    <div class="tag">
        <router-link :to="{name:'tagPage',params:{tag:tag.ftag}}" class="wrap">
            <div class="content">
                <h3>
                    <span>{{tag.ftag}}</span>
                </h3>

                <p>
                    <span :class="tag.fshare=='Y'?'time dot':'time'">{{tag.fadded_time | formatDate}}</span>
                    <span v-if="tag.fshare=='Y'" :title="'被收藏'+tag.star+'次'"
                          class="fa fa-star">&nbsp;<span>{{tag.star}}</span></span>
                </p>
            </div>
        </router-link>

        <div class="operation">
            <div style="display: flex;align-items: center;height: 100%;padding: 0px 5px"
                 v-on:mouseleave="closeTipWindow($event)">
                <div class="share" v-if="tag.count>0">
                    <div title="点击取消分享" v-if="tag.fshare=='Y'" @click="cancelShare(tag.ftag,$event)"><span
                            class="fa fa-lg fa-check"></span></div>
                    <div title="分享此标签" class="notopen" v-if="tag.fshare=='N'" style="position: relative"
                         v-on:mouseenter="openTipWindow($event)">
                        <span class="fa fa-lg fa-paper-plane-o"></span>
                        <div class="tip-window" style="border: none;margin-top: 12px">
                            <div class="categoryList">
                                <ul class="dropdown-menu">
                                    <li v-for="category in categoryList" v-bind:key="category.fid"
                                        v-on:click="shareTag(tag.ftag,category.fname,$event)"
                                        v-bind:category="category">
                                        <a>{{category.fname}}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="count" v-if="tag.count>0">
                <div class="number">
                    <span>{{tag.count}}</span>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    import env from '../assets/js/env';
    import axios from 'axios';

    export default {
        props: ['tag', 'categoryList'],
        data: function () {
            return {}
        },
        filters: {
            formatDate: function (date) {
                let dateObj = new Date(date);
                return dateObj.getFullYear() + ' /' + dateObj.getMonth() + ' /' + dateObj.getDay();
            }
        },
        methods: {
            tagDetail: function () {
                console.log('tag detail...');
            },
            openTipWindow: function (event) {
                var el = event.target;
                el.setAttribute('class', 'open');
                event.stopPropagation();
            },
            closeTipWindow: function (event) {
                var el = event.target;
                var shareEl = el.getElementsByClassName('open');
                if (shareEl && shareEl.length > 0) {
                    shareEl[0].setAttribute('class', 'notopen');
                }
                event.stopPropagation();
            },
            shareTag: function (tag, category, event) {
                event.stopPropagation();
                this.$swal({
                    title: '设置分享后的标签名称',
                    input: 'text',
                    inputPlaceholder: '输入一个易懂又彰显特点的标签描述',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showCloseButton: true,
                    showLoaderOnConfirm: true
                }).then((result) => {
                    if (result.value) {
                        // 分享用户收藏的链接
                        var url = env.host + '/posts/tag/share';
                        axios.post(url, {
                            username: this.$cookie.get('username'),
                            token: this.$cookie.get('token'),
                            tag: tag,
                            category: category,
                            title: result.value
                        }).then(response => {
                            var msg = response.data;
                            if (msg.code > 0) {
                                this.tag.fshare = 'Y';
                                this.$swal({
                                    type: 'success',
                                    title: '分享成功',
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
            cancelShare: function (postId) {
                // 分享用户收藏的链接
                var url = env.host + '/'
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
        }
    }
</script>

<style>
    .tag {
        min-width: 360px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100px;
        background-color: #fff;
        padding: 0px 20px;
        margin-right: 10px;
        flex-wrap: wrap;
    }

    .wrap {
        display: flex;
        height: 100%;
        text-decoration: none !important;
        color: #2e3135;
    }

    .tag:hover {
        box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
    }

    .tag:hover .share {
        visibility: visible;
    }

    .tag:before, .tag:after {
        display: none;
    }

    .content, .operation {
        display: flex;
        height: 100%;
        align-items: center;
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .content h3 {
        display: flex;
        width: 100%;
        font-size: 1.8rem;
    }

    .content p {
        display: flex;
        width: 100%;
        color: #b2bac2;
    }

    .content p span {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content p .dot:after {
        content: "\B7";
        margin: 0.2em;
        color: #b2bac2;

    }

    .dropdown-menu li:hover a {
        color: #1371FB;
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

    .share:hover {
        background-color: #F1F3F4;
    }

    .share div {
        cursor: pointer;
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
        height: 40px;
        justify-content: center;
        align-items: center;
    }

    .count {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .count .number {
        height: 24px;
        padding: 2px 10px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #F0F0F0;
    }
</style>