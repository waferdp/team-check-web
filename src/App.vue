<template>
  <div id="app">
        <header>
      <div class="container mt-5">
        <nav class="navbar navbar-dark bg-dark navbar-expand-md">
          <div class="container navbar-brand">
            <h1>{{ currentTeam || "Team"}} Self Assessment</h1>
          </div>
          <div class="collapse navbar-collapse">
            <ul class="navbar-nav">
              <router-link to="/team-selector" custom v-slot="{navigate, isActive}">
                <li :class="['nav-item', isActive && 'active']" @click="navigate" role="button">            
                  <span class="nav-link">Team</span>
                </li>
              </router-link>
              <router-link to="/performance-checklist" custom v-slot="{navigate, isActive}">
                <li :class="['nav-item', isActive && 'active']" @click="navigate" role="button">
                  <span class="nav-link">Survey</span>
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
          <team-selector />
          <performance-checklist />
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
  },
  mounted() {
    let start = '/team-selector'
    this.$router.push({ path: start});
  }
}
</script>

<style scoped>
  .active {
    font-weight: bold;
  }
</style>

