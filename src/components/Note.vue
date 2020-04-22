<template>
    <div class="main">
        <Group></Group>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error" ,"log"] }] */
    import Group from './Group'

    export default {
        components:{
          Group
        },
        data: function () {
            return {
                notes: [{id: 1, title: '示例便笺（点我查看）', content: '可以在便笺中输入文字，方便快捷...'}],
                notesIdMax:2
            }
        },
        methods:{
            addNote:function () {
                this.notes.unshift({
                    id: this.notesIdMax,
                    title:'点我编辑',
                    content:''
                });

                this.notesIdMax++;
            }
        }
    }
</script>

<style scoped>
    .main {
        position: relative;
        display: flex;
        width: 76%;
        max-width: 1300px;
        margin: 20px auto;
        flex-direction: column;
    }

    .add-notes {
        display: flex;
        flex-direction: row-reverse;
        z-index: 150;
    }

    .add-notes button {
        height: 30px;
        width: 80px;
        border-radius: 15px;
        border: 1px solid #1371FB;
        color: #1371FB;
        background-color: #fff;
        cursor: pointer;
    }

    .add-notes button:hover {
        background-color: #1371FB;
        color: #fff;
    }

    .notes {
        display: flex;
        flex-wrap: wrap;
        padding: 20px 10px;
    }

    .note-item .stick {
        position: absolute;
        left: -15px;
        top: -15px;
    }

    .note-item {
        position: relative;
        text-decoration: none;
        color: #000;
        background: #FFFFCC;
        height: 65px;
        width: 260px;
        margin-right: 20px;
        margin-bottom: 25px;
        transition: all 200ms ease-out;
        z-index: auto;
        box-shadow: 0 0 2px #ddd;
    }

    .wrap {
        position: absolute;
        top: 0px;
        left: 0px;
        flex-direction: column;
        padding: 20px 0px 0px 5px;
        height: 65px;
        width: 100%;
        overflow: hidden;
        transition: all 300ms ease-out;
        z-index: auto;
    }

    .note-item .title {
        display: block;
        width: 90%;
        height: 30px;
        font-size: 15px;
        font-weight: bold;
        line-height: 30px;
        margin: auto;
        color: #444;
    }

    input.title {
        border: none;
        background-color: #FFFFCC;
    }

    input.title:focus {
        color: #1371FB;
    }

    .note-item .text {
        display: flex;
        width: 100%;
        flex-direction: row-reverse;
        height: 100%;
        padding: 10px 1px 25px 12px;
    }

    .note-item textarea {
        height: 100%;
        width: 100%;
        outline: none;
        resize: none;
        background-color: transparent;
        border: none;
        font-size: 14px;
        line-height: 20px;
        overflow: auto;
    }

    .note-item textarea::-webkit-scrollbar {
        width: 1px;
        background-color: #FFFFCC;
    }

    .note-item textarea::-webkit-scrollbar-thumb {
        background-color: #F4CD56;
    }

    .content {
        position: relative;
        display: flex;
        background-color: #fff;
        flex-wrap: wrap;
        min-height: 500px;
        margin-left: 200px;
        flex-direction: column;
        padding: 20px 20px;
        z-index: 120;
    }

    .filter {
        display: flex;
        width: 100%;
        flex-direction: row-reverse;
        padding-bottom: 10px;
    }

    .filter a {
        cursor: pointer;
        margin-left: 5px;
    }
</style>