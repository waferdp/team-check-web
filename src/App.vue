<template>
  <div id="app">
        <header>
      <div class="container mt-5">
        <b-navbar toggleable="lg" type="dark" variant="dark" class="container">
          <b-navbar-brand href="#">
            <h1>{{ currentTeam || "Team"}} Self Assessment</h1>
          </b-navbar-brand>
          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
              <router-link to="/team-selector" custom v-slot="{navigate, isActive}">
                <b-nav-item :active="isActive" @click="navigate" role="button" right>            
                  <span class="nav-link">Team</span>
                </b-nav-item>
              </router-link>
              <router-link to="/performance-checklist" custom v-slot="{navigate, isActive}">
                <b-nav-item :active="isActive" @click="navigate" role="button" right>
                  <span class="nav-link">Survey</span>
                </b-nav-item>
              </router-link>
              <router-link to="/team-assessment" custom v-slot="{navigate, isActive}">
                <b-nav-item :active="isActive" class="align-right" @click="navigate" role="button" right>
                  <span class="nav-link">Assessment</span>
                </b-nav-item>
              </router-link>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
    </header>
    <main>
      <div class="container">
        <router-view @select="selectTeam">
          <team-selector />
          <performance-checklist />
          <team-assessment />
        </router-view>
      </div>
    </main>
  </div>
</template>

<script>
import PerformanceChecklist from './components/PerformanceChecklist.vue';
import TeamSelector from './components/TeamSelector.vue';
import TeamAssessment from './components/TeamAssessment.vue'


export default {
  name: 'App',
  components: {
    PerformanceChecklist,
    TeamSelector,
    TeamAssessment,
  },
  data: function() {
    return {
      currentTeam: null 
    };
  },
  methods: {
    selectTeam(team) {
      this.currentTeam = team;
    }
  }
}
</script>

<style scoped>
  .active {
    font-weight: bold;
  }
</style>

