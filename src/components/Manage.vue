<template>
    <div class="modal fade in wider">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <button v-on:click="close" type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">×</span></button>

                <div class="modal-header">
                    <h4 class="modal-title" id="exampleModalLabel">管理我的标签</h4>
                </div>
                <div class="modal-body">
                    <form v-on:submit.prevent="prependTag($event)">
                        <div class="add">
                            <input type="text" v-model="tagAdd" class="form-control"
                                   placeholder="请输入标签名">
                            <div class="addSubmit">
                                <div @click="prependTag($event)">
                                    <span class="fa fa-plus"></span>
                                </div>
                            </div>
                        </div>

                        <div class="tags">
                            <ul>
                                <li v-for="tag in tags" :key="tag.name" :tag="tag" @click="removeTag(tag.name)">
                                    <span>{{tag.name}}</span>
                                    <div class="delete" v-if="tag.name!='默认'"><span class="fa fa-remove"></span></div>
                                </li>
                            </ul>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" @click="submitTags" class="btn btn-primary"
                            style="margin-right: 5px;width: 100px">完成
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    import axios from 'axios';
    import env from '../assets/js/env';

    export default {
        data: function () {
            return {
                tagAdd: '',
                tags: []
            }
        },
        mounted: function () {
            this.init();
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
                        msg.data.forEach((item) => {
                            this.tags.push({name: item});
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            prependTag: function (event) {
                event.preventDefault();
                if (this.tagAdd.indexOf(';') != -1) {
                    // 去掉冲突的分隔符
                    this.tagAdd = this.tagAdd.replace(/;/gi, '');
                }

                var isRepeat = false;
                this.tags.forEach((item)=> {
                    if (item.name == this.tagAdd) isRepeat = true;
                });

                if (isRepeat) {
                    // 所添加的标签重复了
                    console.log('标签重复了...');
                    console.log(this.tags);
                } else {
                    var that = this;
                    this.tags.unshift({
                        name: that.tagAdd
                    });
                }
            },
            removeTag: function (tag) {
                if (tag == '默认') return;

                var i = 0;
                for (; i < this.tags.length; i++) {
                    if (this.tags[i].name == tag) {
                        break;
                    }
                }

                this.tags.splice(i, 1);
            },
            submitTags: function () {
                var tagStr = '';

                if (this.tags.length > 0) {
                    this.tags.forEach(function (item) {
                        tagStr = tagStr + item.name + ';';
                    });
                    tagStr = tagStr.substr(0, tagStr.length - 1);
                } else {
                    tagStr = '默认';
                }

                // 更新用户分类标签
                var url = env.host + '/user/updatecoltags'
                axios.post(url, {
                    username: this.$cookie.get('username'),
                    token: this.$cookie.get('token'),
                    tags: tagStr
                }).then(response => {
                    var msg = response.data;
                    if (msg.code > 0) {
                        this.close();

                        this.$swal({
                            type: 'success',
                            title: '更新成功',
                            showConfirmButton: false,
                            timer: 1000
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            },
            close: function () {
                this.$emit('close');
            }
        }
    }
</script>

<style scoped>
    .tags ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .tags ul {
        padding: 10px;
    }

    .tags ul li {
        position: relative;
        display: flex;
        height: 28px;
        border-radius: 14px;
        padding: 4px 8px;
        align-items: center;
        justify-content: center;
        margin: 5px 5px;
        background-color: #F0F0F0;
        border: 1px solid #1371FB;
        color: #1371FB;
        cursor: pointer;
    }

    .tags ul li:hover {
        background-color: #1371FB;
        color: #fff;
    }

    .tags ul li .delete {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 12px;
        height: 12px;
        color: #FF6666;
        font-size: 6px;
        margin-left: 4px;
    }

    .modal-header {
        border: none;
    }

    .tags {
        padding-top: 30px;
    }

    .add {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .addSubmit {
        padding-left: 20px;
    }

    .addSubmit div {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #888;
    }

    .addSubmit div:hover {
        background-color: #1371FB;
        color: #fff;
    }

    .modal {
        background: rgba(0, 0, 0, 0.5);
        display: block;
    }

    .modal.wider div.modal-dialog {
        width: 44%;
    }
</style>