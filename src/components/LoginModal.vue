<template>
    <div class="modal fade in" v-bind:style="style" v-if="show">
        <div class="modal-dialog" role="document">
            <!-- 主体内容 -->
            <div class="modal-content">
                <button v-on:click="close" type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">×</span></button>

                <div class="modal-header">
                    <h4 class="modal-title" id="exampleModalLabel">{{status.title}}</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div v-bind:class="status.usernameClass">
                            <label for="username" class="control-label">{{tooltip.username}}</label>
                            <input type="text" v-model="username" class="form-control" id="username"
                                   placeholder="请输入用户名">
                            <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"
                                  v-if="status.usernameClass=='form-group has-error has-feedback' && status.mode=='register'"></span>
                            <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"
                                  v-if="status.usernameClass=='form-group has-feedback' && username!='' && status.mode=='register'"></span>
                        </div>
                        <div v-bind:class="status.passwordClass">
                            <label for="password" class="control-label">{{tooltip.password}}</label>
                            <input type="password" v-model="password" class="form-control" id="password"
                                   placeholder="请输入密码">
                            <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"
                                  v-if="status.passwordClass=='form-group has-error has-feedback' && status.mode=='register'"></span>
                            <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"
                                  v-if="status.passwordClass=='form-group has-feedback' && password!='' && status.mode=='register'"></span>

                        </div>
                        <div v-bind:class="(passwordRepeat!=password)? 'form-group has-error has-feedback':'form-group has-feedback'"
                             v-if="status.mode=='register'">
                            <input type="password" v-model="passwordRepeat" class="form-control" id="password-repeat"
                                   placeholder="请再次输入密码">
                            <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"
                                  v-if="passwordRepeat!=password && passwordRepeat!=''"></span>
                            <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"
                                  v-if="passwordRepeat==password && passwordRepeat!=''"></span>

                        </div>
                        <div class="form-group" v-if="status.mode=='register'">
                            <label for="mail" class="control-label">常用邮箱:</label>
                            <input type="email" v-model="mail" class="form-control" id="mail" placeholder="选填">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" v-on:click="registerStatus" class="btn btn-default"
                            v-if="status.mode=='login'"
                            style="margin-right: 5px">注册
                    </button>
                    <button v-on:click="submit" type="button" class="btn btn-primary"
                            v-bind:disabled="status.submitted">
                        {{status.behavior}}<i v-if="status.submitted" class="fa fa-spinner fa-spin fa-lg fa-fw"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error" ,"log"] }] */
    import axios from 'axios';
    import SHA1 from 'sha1'
    import random from '../assets/js/randomNumber'
    import env from '../assets/js/env'

    export default {
        name: "login-modal",
        data: function () {
            return {
                style: 'background: rgba(0,0,0,0.5);display: block',
                username: '',
                show: true,
                password: '',
                passwordRepeat: '',
                mail: '',
                status: {
                    mode: 'login',
                    title: '用户请登陆',
                    behavior: '马上登陆',
                    submitted: false,
                    usernameClass: 'form-group',
                    passwordClass: 'form-group'
                },
                tooltip: {
                    username: '用户名:',
                    password: '密码:',
                }
            }
        },
        watch: {
            'username'(newValue) {
                if (newValue != '' && this.status.mode == 'register') {
                    // 向后端查询用户名是否已经存在
                    var url = env.host + '/user/check';
                    axios.post(url, {
                        username: newValue
                    }).then(response => {
                        if (response.data.code < 0) {
                            this.tooltip.username = '用户名已存在';
                            this.status.usernameClass = 'form-group has-error has-feedback';
                        } else {
                            this.tooltip.username = '用户名:';
                            this.status.usernameClass = 'form-group has-feedback';
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    this.tooltip.username = '用户名:';
                    this.status.usernameClass = 'form-group';
                }
            },
            'password'(newValue) {
                if (newValue != '' && this.status.mode == 'register') {
                    if (newValue.length < 6) {
                        this.tooltip.password = '密码过短:';
                        this.status.passwordClass = 'form-group has-error has-feedback';
                    } else {
                        this.tooltip.password = '密码:';
                        this.status.passwordClass = 'form-group has-feedback';
                    }
                } else {
                    this.tooltip.password = '密码:';
                    this.status.passwordClass = 'form-group';
                }
            }
        },
        methods: {
            close: function () {
                this.show = false;
                this.$emit('close');
            },
            submit: function () {
                this.status.submitted = true

                if (this.username == '') {
                    this.tooltip.username = '用户名不能为空'
                    this.status.usernameClass = 'form-group has-error has-feedback'
                    this.status.submitted = false
                }

                if (this.password == '') {
                    this.tooltip.password = '密码不能为空'
                    this.status.passwordClass = 'form-group has-error has-feedback'
                    this.status.submitted = false
                }

                // 注册时两次密码输入必须相同
                if (this.status.mode == 'register') {
                    if (this.password.length < 6) {
                        this.tooltip.password = '密码过短'
                        this.status.passwordClass = 'form-group has-error has-feedback'
                        this.status.submitted = false
                    }

                    if (this.password != this.passwordRepeat) {
                        this.status.submitted = false
                    }
                }

                if (!this.status.submitted) {
                    return false
                }

                var username = this.username;
                var password = this.password;
                var mail = this.mail;

                // 用户登陆
                if (this.status.mode == 'login') {
                    var verifyCode = random(0, 9999999);
                    password = SHA1(SHA1(password) + verifyCode);
                    var url = env.host + "/user/login";
                    axios.post(url, {
                        username: username,
                        password: password,
                        verifyCode: verifyCode,
                    }).then(response => {
                        console.log(response.data)
                        if (response.data.code > 0) {
                            // 登陆成功
                            this.$cookie.set('token', response.data.data, {expires: 7, domain: env.domain});
                            this.$cookie.set('username', username, {expires: 7, domain: env.domain});
                            this.$emit('loginSubmit', 'OK')
                        } else {
                            this.tooltip.password = '密码错误'
                            this.status.passwordClass = 'form-group has-error has-feedback'
                            this.status.submitted = false
                        }
                    }).catch(error => {
                        console.log(error)
                    });
                }

                // 用户注册
                if (this.status.mode == 'register') {
                    url = env.host + "/user/register";
                    axios.post(url, {
                        username: username,
                        password: SHA1(password),
                        mail: mail
                    }).then(response => {
                        console.log(response.data)
                        if (response.data.code > 0) {
                            console.log(response.data)
                            // 注册成功
                            this.$cookie.set('token', response.data.data, {expires: 7, domain: env.domain});
                            this.$cookie.set('username', username, {expires: 7, domain: env.domain});
                            this.$emit('loginSubmit', 'OK')
                        } else {
                            console.log('注册失败')
                        }
                    }).catch(error => {
                        console.log(error)
                    });
                }
            },
            registerStatus: function () {
                this.status.mode = 'register';
                this.status.behavior = '立即注册';
                this.status.title = '请注册账户';
                this.username = '';
                this.password = '';
            }
        }
    }
</script>

<style scoped>
    @import "../assets/css/font-awesome.css";

    @media (min-width: 768px) {
        .modal-dialog {
            width: 700px;
            margin: 3% auto;
        }
    }

    .form-group {
        padding-bottom: 5px;
    }
</style>