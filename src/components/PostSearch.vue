<template>
    <div class="content">
        <div id="posts" class="posts">
            <Post v-for="post in posts" :post="post" :key="post.fid" :edit="false" :operation="false"></Post>
        </div>

        <div class="loading" v-if="loading">
            <div class="loading-center">
                <img src="/loading-img.gif" height="80px" width="80px" style="display: inline-block"/>
            </div>
        </div>
        <div class="place" v-if="loading"></div>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    import transferTime from '../assets/js/transferTime'
    import axios from 'axios'
    import eventBus from '../assets/js/eventBus'
    import env from '../assets/js/env'
    import Post from './Post'

    export default {
        name: "post-search",
        components: {
            Post
        },
        data: function () {
            return {
                keyword: '',
                posts: {},
                loading: true
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
        mounted: function () {
            var me = this;
            eventBus.$on('searchKeyWord', function (data) {
                var queryStr = data.replace(/\s+/g, ' ').replace(/\s$/, '');

                me.keyword = queryStr;
                me.loadData();
            });

            this.loadData();
        },
        methods: {
            loadData: function () {
                var url = env.host + '/posts/search';
                axios.post(url, {
                    ftitle: (this.keyword == '') ? '.' : this.keyword
                }).then(response => {
                    var msg = response.data;

                    var content = msg.data;
                    content.forEach(function (element) {
                        var parser = document.createElement('a');
                        parser.href = element.furl;
                        element.fsubTitle = parser.hostname;
                        element.fdate = transferTime(element.faddedTime);

                        var addedTime = new Date(element.faddedTime).getTime();
                        var dayBegin = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                        element.new = (addedTime - dayBegin) < 24 * 60 * 60 * 1000 && addedTime - dayBegin > 0 ? true : false;
                    });

                    this.posts = content;
                })
                    .catch(error => {
                        console.error(error);
                    })
                    .finally(() => this.loading = false);
            }
        }
    }
</script>

<style scoped>
    .content {
        width: 78%;
        max-width: 1200px;
        padding-top: 50px;
        margin: auto;
    }

    .place {
        height: 2000px;
        width: 100%;
    }

    .posts {
        margin-top: 60px;
    }
</style>