import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import App from './App.vue';
import PerformanceChecklist from './components/PerformanceChecklist.vue';
import TeamSelector from './components/TeamSelector.vue';
import TeamAssessment from './components/TeamAssessment.vue';

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

const teamAssessmentRoute = { 
  path: '/team-assessment',
  name: 'team-assessment',
  component: TeamAssessment
}

const Router = new VueRouter({
  routes: [teamSelectorRoute, performanceChecklistRoute, teamAssessmentRoute]
});

Vue.use(Vuex);

const Store = new Vuex.Store({
  state: {
    team: null,
    questions: null
  },
  mutations: {
    selectTeam : function(team) {
      this.state.team = team;
    },
    updateSurvey : function(questions) {
      this.state.questions = questions;
    }
  }
});

Vue.config.productionTip = false

new Vue({
  router: Router,
  store: Store,
  render: h => h(App),
}).$mount('#app')
