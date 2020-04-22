<template>

</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    import env from '../assets/js/env';
    import axios from 'axios';

    export default {
        data: function () {
            return {
                tag: this.$route.params.tag,
            }
        },
        filters: {},
        methods: {}
    }
</script>

<style>

</style>