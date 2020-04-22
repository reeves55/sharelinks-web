<template>
    <div class="main">
        <div :class="datesData.length>0? 'line':'line no-border'"></div>
        <div class="content">
            <ul>
                <li v-for="date in datesData" v-bind:key="date.time" v-bind:date="date">
                    <div class="time">
                        <span>{{date.time}}</span>
                    </div>
                    <div class="notifications">
                        <div class="dot"></div>
                        <ul>
                            <li v-for="item in date.notifications" v-bind:key="item.fid" v-bind:item="item">
                                <div class="noti-type">
                                    <div :class="item.type=='回复'?'color-class reply':'color-class system'">
                                        <span>{{item.type}}</span>
                                    </div>
                                </div>

                                <div class="noti-text">
                                    <p v-html="item.content"></p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
                <li></li>
            </ul>

            <div class="no-content" v-if="datesData.length<=0">
                <img src="/no-content.png"/>
            </div>
        </div>

        <div class="loading" v-if="loading">
            <div class="loading-center">
                <img src="/loading-img.gif" height="80px" width="80px" style="display: inline-block"/>
            </div>
        </div>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error" ,"log"] }] */
    import axios from 'axios';
    import env from '../assets/js/env';
    import eventBus from '../assets/js/eventBus';

    export default {
        data: function () {
            return {
                datesData: [],
                loading: true
            }
        },
        created: function () {
            setTimeout(()=> {
                this.init();
            }, 200);
        },
        methods: {
            init: function () {
                // 从服务器拉取通知
                var url = env.host + "/notify/pull";
                var username = this.$cookie.get('username');
                var token = this.$cookie.get('token');
                axios.post(url, {
                    username: username,
                    token: token
                }).then(response => {
                    var msg = response.data;
                    console.log(msg)
                    if (msg.code > 0 && msg.data.length > 0) {
                        var notifications = msg.data;
                        var formatNotifiData = [];
                        var dateIndex = {};
                        notifications.forEach(function (item) {
                            var dateObj = new Date(item.faddedTime);
                            var dateStr = dateObj.getFullYear() + '/' + dateObj.getMonth() + '/' + dateObj.getDay();
                            if (dateIndex[dateStr] == undefined || dateIndex[dateStr] == null) {
                                var dateItem = {
                                    time: dateStr,
                                    notifications: [
                                        {
                                            type: item.ftype,
                                            content: item.fcontent
                                        }
                                    ]
                                }
                                formatNotifiData.push(dateItem);
                                dateIndex[dateStr] = dateItem;
                            } else {
                                dateItem = dateIndex[dateStr];
                                dateItem.notifications.push({
                                    type: item.ftype,
                                    content: item.fcontent
                                });
                            }
                        });

                        this.datesData = formatNotifiData;
                    }

                    this.loading = false;
                }).catch(error => {
                    console.error(error);
                }).finally(() => {
                    // 发射通知事件，去掉通知的红点
                    eventBus.$emit('notify-remove');
                });
            }
        }
    }
</script>

<style scoped>
    .color-class {
        border-radius: 13px;
        color: #fff;
        padding: 3px 8px;
        height: 26px;
        width: 80px;
        text-align: center;
    }

    .system {
        background-color: #FFCCCC;
        opacity: 0.9;
    }

    .reply {
        background-color: #3fc3ee;
        opacity: 0.6;
    }

    .notifications ul {
        padding: 0px !important;
        margin: 0px;
    }

    .notifications ul li {
        display: block;
        padding-bottom: 20px;
    }

    .notifications ul li .noti-type {
        vertical-align: top;
        display: inline-block;
    }

    .notifications ul li .noti-text {
        display: inline-block;
        width: 80%;
        margin-left: 25px;
    }

    .notifications ul li .noti-text p {
        text-align: justify;
        line-height: 24px;
        font-size: 15px;
    }

    .content ul {
        padding: 20px 20px;
    }

    .content ul li {
        position: relative;
        display: block;
        clear: both;
    }

    .content ul li:first-child .notifications {
        border: none;
        top: -10px;
    }

    .content ul li:first-child .dot {
        display: none;
    }

    .time {
        float: left;
        width: 150px;
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-weight: 600;
        text-decoration: underline;
        font-size: 16px;
    }

    .notifications {
        float: left;
        border-top: 1px dotted #ddd;
        position: relative;
        top: 20px;
        width: 80%;
        padding: 20px 30px;
        margin-bottom: 10px;
    }

    .notifications .dot {
        position: absolute;
        top: -3px;
        left: -3px;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background-color: #666;
    }

    .main {
        position: relative;
        margin: 100px auto;
        width: 80%;
        background-color: #fff;
        height: 100%;
        max-width: 1300px;
    }

    .line {
        position: absolute;
        left: 0px;
        top: 0px;
        bottom: 0px;
        width: 170px;
        border-right: 1px dashed #ccc;
    }

    .no-border {
        border-right: none;
    }

    .content {
        min-height: 600px;
    }

</style>