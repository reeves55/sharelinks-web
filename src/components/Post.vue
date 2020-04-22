<template>
    <div class="post">
        <div class="post-content">
            <h3>
                <a v-bind:href="post.furl" :title="post.ftitle" target="_blank">{{post.ftitle}}</a>
            </h3>
            <p style="color: #b2bac2;">
                <span class="author">{{post.fauthor}}</span><span class="date">{{post.date}}</span>
                <router-link v-bind:class="post.fcategory | getCategoryClass"
                             v-bind:to="{name:'posts',params:{category:post.fcategory}}">
                    {{post.fcategory}}
                </router-link>
                <a v-if="post.new" class="new-link">NEW</a>
                <router-link class="goto-detail" v-bind:to="{name:'postDetail',params:{id:post.fid}}" v-if="!edit"
                             style="margin-left: 10px;text-decoration: underline;color: lightgray">
                    <div style="width: 24px;display: inline-block;text-align: center"><span
                            class="fa fa-lg fa-angle-double-right"></span></div>
                </router-link>
            </p>
        </div>

        <div class="moreInfo" v-if="!edit && operation">
                    <span class="hot" v-if="post.flike>=3 && post.flike/(post.flike+post.freported)>0.6"><i
                            class="fa fa-fire fa-lg"></i></span>
            <!-- 添加到自己的收藏夹 -->
            <a class="like-link notopen" v-on:mouseenter="openTipWindow($event)"
               v-on:mouseleave="closeTipWindow($event)">
                <span><i class="fa fa-star fa-lg"></i></span>
                <span style="margin-left: 5px">{{post.flike}}</span>

                <div class="tip-window" style="border: none;margin-top: -20px">
                    <div class="categoryList">
                        <ul class="dropdown-menu">
                            <li v-for="tag in tags" v-bind:key="tag.name"
                                v-on:click="collectPost(post.fid,tag.name,$event)"
                                v-bind:tag="tag">
                                <a>{{tag.name}}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </a>
        </div>

        <!--链接编辑和删除按钮-->
        <div class="edit" v-if='post.fauthor==this.$cookie.get("username") && edit'>
            <div class="dropdown">
                <button class="btn btn-default dropdown-toggle" type="button" id="edit-dropdown"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="edit-dropdown">
                    <li><a style="color: #2577b7;cursor: pointer" v-on:click="$emit('editPost')">编辑</a></li>
                    <li><a style="color: red;cursor: pointer" v-on:click="$emit('delPost')">删除</a></li>

                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    import axios from 'axios'
    import env from '../assets/js/env'

    export default {
        props: ['post', 'edit', 'operation', 'tags'],
        data: function () {
            return {}
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
            collectPost: function (postId, tag) {
                var url = env.host + "/posts/like";
                axios.post(url, {
                    fid: this.post.fid,
                    tag: tag,
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token'),
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        this.post.flike++;

                        this.$swal({
                            type: 'success',
                            title: '收藏成功',
                            showConfirmButton: false,
                            timer: 1000
                        });
                    } else {
                        this.$swal('警告', msg.msg, 'warning');
                    }
                }).catch(error => {
                    console.error(error);
                    this.$swal('错误', '服务出现了问题', 'error');
                });
            },
            openTipWindow: function (event) {
                var el = event.target;
                el.setAttribute('class', 'like-link open');
            },
            closeTipWindow: function (event) {
                var el = event.target;
                el.setAttribute('class', 'like-link notopen');
            }
        }
    }
</script>

<style scoped>
    .notopen .tip-window {
        visibility: hidden;
    }

    .open .tip-window {
        visibility: visible;
    }

    .post:first-child {
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
    }

    .edit {
        position: absolute;
        right: 0px;
        top: 0px;
        bottom: 0px;
        width: 60px;
    }

    .dropdown {
        height: 100%;
    }

    #edit-dropdown {
        position: absolute;
        right: 0px;
        top: 0px;
        bottom: 0px;
        display: inline-block;
        border: none;
        border-radius: 0px;
        width: 60px;
    }

    .moreInfo {
        position: absolute;
        right: 25px;
        top: 0px;
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: flex-end;
    }

    .moreInfo .hot {
        color: #FF6666;
        display: inline-block;
        margin-right: 25px;
    }

    .categoryList ul {
        margin: 0px;
        padding: 0px;
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

    .dropdown-menu li a {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .dropdown-menu li:hover a {
        color: #1371FB;
    }

</style>