import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.use(VueRouter);

const Router = new VueRouter()

Vue.config.productionTip = false

new Vue({
  Router,
  render: h => h(App(Router)),
}).$mount('#app')
