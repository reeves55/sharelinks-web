<template>
    <div class="group-main">
        <div class="group">
            <span class="name"><span class="fa fa-book"></span>开发</span>
            <div class="edit" v-if="false">编辑</div>
            <span class="number">5</span>
        </div>

        <div class="group">
            <span class="name"><span class="fa fa-book"></span>区块链</span>
            <div class="edit" v-if="false">编辑</div>
            <span class="number">5</span>
        </div>

        <div class="group">
            <span class="name"><span class="fa fa-book"></span>生活</span>
            <div class="edit" v-if="false">编辑</div>
            <span class="number">5</span>
        </div>

        <div class="group">
            <span class="name"><span class="fa fa-book"></span>视频</span>
            <div class="edit" v-if="false">编辑</div>
            <span class="number">5</span>
        </div>

        <div class="group">
            <span class="name"><span class="fa fa-book"></span>开发</span>
            <div class="edit" v-if="false">编辑</div>
            <span class="number">5</span>
        </div>
        <div class="add-group"></div>
    </div>
</template>

<script>
    export default {
        date: function () {
            return {}
        }
    }
</script>

<style scoped>
    .group-main {
        position: fixed;
        top: 12rem;
        left: 5%;
        padding-left: 30px;
        min-width: 150px;
        background-color: transparent;
    }

    .group {
        cursor: pointer;
        height: 40px;
        clear: both;
        line-height: 30px;
        padding: 5px;
        font-size: 12px;
        font-weight: bold;
        color: #555555;
        transition: all 200ms ease-out;
    }

    .group:hover {
        color: #1371FB;
    }

    .group .name {
        display: inline-block;
        float: left;
        line-height: 30px;
    }

    .group .name span {
        display: inline-block;
        margin-right: 10px;
    }

    .group .edit {
        float: right;
        height: 30px;
        line-height: 30px;
    }

    .group .number {
        float: right;
        display: inline-block;
        height: 30px;
        line-height: 30px;
    }

</style>