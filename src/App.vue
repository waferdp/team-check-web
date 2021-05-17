<template>
  <div id="app">
        <header>
      <div class="container mt-5">
        <nav class="navbar navbar-dark bg-dark navbar-expand-md">
          <div class="container navbar-brand">
            <h1>Team Performance Assessment</h1>
          </div>
          <div class="navbar-brand navbar-dark">
            <h3>{{currentTeam}}</h3>
          </div>
          <div class="collapse navbar-collapse">
            <ul class="navbar-nav">
              <router-link to="/performance-checklist" custom v-slot="{navigate, isActive}">
                <li :class="['nav-item', isActive && 'active']" @click="navigate" role="button">
                  <span class="nav-link">Survey</span>
                </li>
              </router-link>
              <router-link to="/team-selector" custom v-slot="{navigate, isActive}">
                <li :class="['nav-item', isActive && 'active']" @click="navigate" role="button">            
                  <span class="nav-link">Team</span>
                </li>
              </router-link>
            </ul>
          </div>
        </nav>
      </div>
    </header>
    <main>
      <div class="container">
        <router-view @select="selectTeam">
          <performance-checklist />
          <team-selector />
        </router-view>
      </div>
    </main>
  </div>
</template>

<script>
import PerformanceChecklist from './components/PerformanceChecklist.vue';
import TeamSelector from './components/TeamSelector.vue';

export default {
  name: 'App',
  components: {
    PerformanceChecklist,
    TeamSelector
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

