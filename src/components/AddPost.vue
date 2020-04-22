<template>
    <div class="content">
        <div id="main" class="row-fluid">
            <form class="main form" v-on:submit.prevent="submitPost">
                <div class="form-group">
                    <label class="control-label" for="url">URL</label>
                    <div class="controls">
                        <input name="url" id="url" type="text" v-model="url" v-on:keyup="changeUrl"
                               placeholder="http://example.com"
                               class="form-control">
                        <span class="help-block"></span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label" for="title">标题</label>
                    <div class="controls">
                        <input name="title" id="title" type="text" v-bind:disabled="titleDisabled" v-model="title"
                               placeholder="给链接一个名字，方便别人找到它"
                               class="form-control">
                        <span class="help-block"></span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label" for="categorySelect">选择标签</label>
                    <div class="controls">
                        <select id="categorySelect" class="form-control select" v-model="tagName">
                            <option value="默认" selected>默认</option>
                            <option v-for="tag in tagList" v-bind:key="tag.name"
                                    v-bind:value="tag.name">
                                {{tag.name}}
                            </option>
                        </select>
                        <span class="help-block"></span>
                    </div>
                </div>

                <input type="submit" class="btn btn-primary submit-btn" value="提交"/>
            </form>
        </div>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error" ,"log"] }] */
    import axios from 'axios';
    import env from '../assets/js/env';

    export default {
        name: "add-post",
        data: function () {
            return {
                url: '',
                title: '',
                tagName: '默认',
                tagList: [],
                titleDisabled: false
            }
        },
        created: function () {
            this.init();
        },
        methods: {
            init: function () {
                // 获取用户定义的标签
                var url = env.host + '/user/getcoltags';
                axios.post(url, {
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token'),
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        msg.data.forEach(item => {
                            this.tagList.push({name: item});
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });

                this.tagName = this.tagList[0].name;
            },
            submitPost: function () {
                if (this.url == '' || this.title == '') {
                    return;
                }

                // 添加链接
                var url = env.host + "/posts/add";
                axios.post(url, {
                    url: this.url,
                    title: this.title,
                    category: this.categoryName,
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token')
                }).then(response => {
                    var msg = response.data;
                    if (msg.code < 0) {
                        // 链接重复，提示用户
                        this.$swal('错误', '您添加的链接已存在', 'error');
                    } else {
                        this.$router.push({name: 'collection', params: {tag: 'all'}});
                    }
                }).catch(error => {

                    console.error(error);
                });
            },
            changeUrl: function () {
                if (this.url != '') {
                    this.titleDisabled = true;
                    var url = env.services.urlService + this.url;
                    // 根据输入的url,自动填充链接标题
                    axios.get(url)
                        .then(response => {
                            let result = response.data;
                            if (result.title == null || result.title == '' || result.title == undefined) {
                                this.title = '自动获取标题失败，请手动输入';
                            } else {
                                this.title = result.title;
                            }

                            this.titleDisabled = false;
                        })
                        .catch(error => {
                            console.log(error);
                            this.title = '自动获取标题失败，请手动输入';
                            this.titleDisabled = false;
                        })
                        .finally(() => this.loading = false);
                } else {
                    this.title = ''
                }
            }
        }
    }
</script>

<style scoped>
    .content {
        width: 80%;
        margin: auto;
        margin-top: 90px;
        max-width: 1300px;
    }

    #main {
        background: white;
        padding: 30px 80px;
        border-radius: 4px;
        text-align: left;
        width: 100%;
    }

    .submit-btn {
        min-width: 100px;
        margin-top: 15px;
    }

    .form-group {
        padding-bottom: 2px;
    }

    .form-group label {
        font-size: 1.5rem;
    }
</style>