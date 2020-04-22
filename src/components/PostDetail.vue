<template>
    <div class="main row-fluid">
        <Post :post="post" :edit="true" :operation="false" v-on:editPost="editPost" v-on:delPost="delPost"></Post>

        <!--收藏或者举报按钮-->
        <div class="operation">
            <button type="button" v-on:click="likePost" id="starBtn" class="starBtn btn btn-default">
                <span style="color: #FF6666" class="glyphicon glyphicon-heart" aria-hidden="true"></span>
                <i name="starSpan"> {{post.like}}</i>
            </button>

            <button type="button" v-on:click="reportPost" id="badBtn" style="margin-left: 10px"
                    class="starBtn btn btn-default">
                <span style="color: darkblue" class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                <i name="badBtn"> {{post.freported}} </i>举报
            </button>
        </div>

        <div name="comment" class="comment-form form">
            <div class="form-group">
                <div class="controls">
                    <label for="comment-area">发布你的评论</label>
                    <textarea name="body" placeholder="等待你的评论..." id="comment-area" class="form-control textarea"
                              rows="7"
                              v-model="comment"></textarea>
                    <span class="help-block"></span>
                </div>
            </div>
            <button v-on:click="addComment" class="btn btn-primary submit-btn">提交</button>
        </div>

        <!--评论区-->
        <ul class="comments" v-if="comments.length>0">
            <li v-for="comment in comments" v-bind:key="comment.fid" v-bind:comment="comment">
                <div class="content">
                    <p>{{comment.fcontent}}</p>
                </div>

                <div class="time">
                    <span style="color: #aaa">{{comment.faddedTime | formatDate}}</span>
                </div>

                <div class="user">
                    <span>---</span><i>{{comment.fuserName}}</i>
                </div>
            </li>
        </ul>

        <!-- 链接编辑模态框 -->
        <div class="modal fade in" style="background: rgba(0,0,0,0.5);display: block" v-if="editState">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <button v-on:click="close" type="button" class="close" data-dismiss="modal"
                            aria-label="Close"><span
                            aria-hidden="true">×</span></button>
                    <div class="modal-header">
                        <h4 class="modal-title" id="exampleModalLabel">修改链接信息</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form edit-form" v-on:submit.prevent="submitEdit">
                            <div class="form-group">
                                <label class="control-label" for="url">URL</label>
                                <div class="controls">
                                    <input name="url" id="url" type="text" v-model="postEditing.url"
                                           placeholder="http://example.com"
                                           class="form-control">
                                    <span class="help-block"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label" for="title">标题</label>
                                <div class="controls">
                                    <input name="title" id="title" type="text" v-model="postEditing.title"
                                           placeholder="给链接一个名字，方便别人找到它"
                                           class="form-control">
                                    <span class="help-block"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label" for="categorySelect">选择分类</label>
                                <div class="controls">
                                    <select id="categorySelect" class="form-control select"
                                            v-model="postEditing.category">
                                        <option v-for="category in categoryList" v-bind:key="category.fid"
                                                v-bind:value="category.fname">
                                            {{category.fname}}
                                        </option>
                                    </select>
                                    <span class="help-block"></span>
                                </div>
                            </div>

                            <input type="submit" class="btn btn-primary" value="提交"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!--加载中-->
        <div class="loading" v-if="loading">
            <div class="loading-center">
                <img src="/loading-img.gif" height="80px" width="80px" style="display: inline-block"/>
            </div>
        </div>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    import transferTime from '../assets/js/transferTime'
    import axios from 'axios'
    import VueElementLoading from 'vue-element-loading'
    import env from '../assets/js/env'
    import Post from './Post'

    export default {
        name: "post-detail",
        components: {
            VueElementLoading,
            Post
        },
        data: function () {
            return {
                post: {},
                postEditing: {
                    url: '',
                    title: '',
                    category: ''
                },
                fid: this.$route.params.id,
                loading: true,
                comments: [],
                comment: '',
                editState: false,
                categoryName: '区块链',
                categoryList: [],
            }
        },
        created: function () {
            this.init();
        },
        filters: {
            formatDate: function (date) {
                return transferTime(date)
            },
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
            submitEdit: function () {
                // 编辑链接
                var url = env.host + '/post/edit';
                // 确定修改链接
                axios.post(url, {
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token'),
                    fpostId: this.post.fid,
                    ftitle: this.postEditing.title,
                    furl: this.postEditing.url,
                    fcategory: this.postEditing.category,
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        // 成功修改链接
                        this.post.ftitle = this.postEditing.title;
                        this.post.furl = this.postEditing.url;
                        this.post.fcategory = this.postEditing.category;
                    } else {
                        this.editState = false
                        this.$swal({
                            type: 'error',
                            title: '修改失败',
                            showConfirmButton: false,
                            timer: 1000
                        });
                    }
                }).catch(error => {
                    this.$swal({
                        type: 'error',
                        title: '修改失败',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    console.error(error);
                });
                this.editState = false
            },
            close: function () {
                this.editState = false
            },
            editPost: function () {
                // 编辑链接
                this.editState = true
            },
            delPost: function () {
                // 删除链接
                this.$swal({
                    title: '确定删除链接吗?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showCloseButton: true,
                    showLoaderOnConfirm: true
                }).then((result) => {
                    if (result.value) {
                        var url = env.host + '/post/delete';
                        // 确定删除链接
                        axios.post(url, {
                            username: this.$cookie.get('username'),
                            token: this.$cookie.get('token'),
                            fpostId: this.post.fid,
                        }).then(response => {
                            var msg = response.data;
                            if (msg.code > 0) {
                                // 成功删除链接
                                this.$router.push({path: '/'});
                            }
                        }).catch(error => {
                            console.error(error);
                        }).finally(()=>{
                            this.$router.go(-1); // 删除链接返回之前的页面
                        });
                    }
                });
            },
            addComment: function () {
                if ('' == this.comment.trim()) {
                    return;
                }

                var url = env.host + '/comment/add';

                // ajax请求页面数据
                axios.post(url, {
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token'),
                    fpostId: this.post.fid,
                    content: this.comment
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        var newComment = {
                            fcontent: this.comment,
                            fuserName: this.$cookie.get('username'),
                            faddedTime: new Date().getTime()
                        }
                        this.comments.unshift(newComment);
                    }
                }).catch(error => {
                    console.error(error);
                });
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

                url = env.host + '/posts/fetch/' + this.fid;
                // ajax请求页面数据
                axios.get(url)
                    .then(response => {
                        var msg = response.data;
                        var content = msg.data.post;
                        var comments = msg.data.comments;
                        this.comments = comments;

                        var parser = document.createElement('a');
                        parser.href = content.furl;
                        content.subTitle = parser.hostname;
                        content.date = transferTime(content.faddedTime);
                        content.url = "/posts/" + content.fid;
                        content.title = content.ftitle;
                        content.author = content.fauthor;
                        content.like = content.flike;
                        content.category = content.fcategory;
                        content.categoryURL = '/posts/page?category=' + content.fcategory;

                        var addedTime = new Date(content.faddedTime).getTime();
                        var dayBegin = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                        content.new = (addedTime - dayBegin) < 24 * 60 * 60 * 1000 && addedTime - dayBegin > 0 ? true : false;

                        this.post = content;
                        this.postEditing.title = this.post.ftitle;
                        this.postEditing.url = this.post.furl;
                        this.postEditing.category = this.post.fcategory;
                    })
                    .catch(error => {
                        console.error(error);
                    })
                    .finally(() => this.loading = false);
            },
            likePost: function () {
                var url = env.host + "/posts/like";
                axios.post(url, {
                    fid: this.post.fid,
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token'),
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        this.post.like++;

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
            reportPost: function () {
                var url = env.host + "/posts/report";
                axios.post(url, {
                    fid: this.post.fid,
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token'),
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        this.post.freported++;

                        this.$swal({
                            type: 'success',
                            title: '举报成功',
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
            }
        }
    }
</script>

<style scoped>
    .operation {
        margin-top: 15px;
        padding-left: 10px;
    }

    .operation button {
        border: none;
    }

    .edit-form {
        margin-bottom: 15px;
        padding: 0px 10px;
    }

    .comments {
        padding: 20px;
        background: #FFF;
        border-radius: 3px;
        margin-bottom: 10px;
        -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
        padding-bottom: 30px;
    }

    .comments li {
        display: block;
        padding: 5px 10px;
        clear: both;
        border-bottom: dotted 1px #ddd;
        padding-bottom: 25px;
        margin-top: 10px;
    }

    .comments li:last-child {
        border-bottom: none !important;
    }

    .user {
        float: right;
        right: 15px;
        font-size: 12px;
    }

    .time {
        float: left;
        left: 10px;
        font-size: 12px;
    }

    .main {
        width: 80%;
        margin: auto;
        padding-top: 80px;
        max-width: 1300px;
    }

    .comment-form {
        margin-top: 30px;
        background: #fff;
        border-radius: 3px;
        padding: 20px;
        margin-bottom: 10px;
        -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    }

    .submit-btn {
        min-width: 100px;
        margin-top: 20px;
    }
</style>