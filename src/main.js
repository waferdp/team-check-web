import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import App from './App.vue';
import PerformanceChecklist from './components/PerformanceChecklist.vue';
import TeamSelector from './components/TeamSelector.vue';

Vue.use(VueRouter);

const performanceChecklistRoute =   { 
  path: '/performance-checklist', 
  name: 'performance-checklist',
  component: PerformanceChecklist 
};

const teamSelectorRoute = { 
  path: '/team-selector',
  name: 'team-selector',
  component: TeamSelector
}

const Router = new VueRouter({
  routes: [performanceChecklistRoute, teamSelectorRoute]
});

Vue.use(Vuex);

const Store = new Vuex.Store({
  state: {
    team: null,
    survey: null
  },
  mutations: {
  }
});

Vue.config.productionTip = false

new Vue({
  router: Router,
  store: Store,
  render: h => h(App),
}).$mount('#app')
