<template>
    <div id="app">
        <a id="top"></a>
        <Nav></Nav>
        <router-view></router-view>
        <footer class="footer">
            © 2018&nbsp;
            <a href="https://web.reeveslee.com" target="_blank"> ShareLinks</a>.
            使用<a href="https://cn.vuejs.org/">Vue</a>框架&nbsp;
            <a href="http://www.miitbeian.gov.cn/" rel="nofollow" target="_blank">皖ICP备16018709号-1</a>
            &nbsp;
            <a href="https://www.51.la/report/main?comId=19743337" target="_blank"><span style="display:inline-block;background-color:#EF5350;color:#fff;padding:2px 5px;font-family:arial;font-size:12px;font-weight:bold;">51La</span></a>
        </footer>

        <div class="backtotop">
            <a v-scroll-to="{el:'#top'}" id="upToTopLink"><img src="/uptoTop.png" width="60px"
                                                                                      height="60px"></a>
        </div>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error" ,"log"] }] */
    import Nav from './components/Nav'
    import eventBus from './assets/js/eventBus'

    export default {
        name: 'app',
        components: {
            Nav
        },
        created: function () {
            // 通过总线事件进行跨组件通信
            eventBus.$on('up-to-top', function () {
                document.getElementById('upToTopLink').click();
            });
        },
        methods:{
            monitorScroll: function () {
                var scollHeight = document.getElementById('main-view').scrollTop;
                var el = document.getElementById('sharelinks-nav')
                if (scollHeight >= 50) {
                    if (el.getAttribute('class') == 'nav shrink') {
                        el.setAttribute('class', 'nav shrink shadow');
                    }
                } else {
                    if (el.getAttribute('class') == 'nav shrink shadow') {
                        el.setAttribute('class', 'nav shrink');
                    }
                }
            },
        }
    }
</script>

<style>
    @import "assets/css/style.css";

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        background: #F4F5F5;
        padding-left: calc(100vw - 100%);
        height: 100%;
        width: 100%;
    }

    .backtotop {
        position: fixed;
        right: 3%;
        bottom: 3%;
        opacity: 0.8;
    }

    .backtotop a {
        cursor: pointer;
    }

    footer {
        display: flex;
        justify-content: center;
        margin: 40px 0px;
    }
</style>
