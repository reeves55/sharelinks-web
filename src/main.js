import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import VueSweetalert2 from 'vue-sweetalert2'
import Cookie from 'vue-cookie'
import VueScrollTo from 'vue-scrollto'

Vue.use(Cookie);
Vue.use(VueSweetalert2);
Vue.use(VueScrollTo);

Vue.config.productionTip = true;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

