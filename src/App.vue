<template>
  <div id="app">
        <header>
      <div class="container mt-5">
        <nav class="navbar navbar-dark bg-dark ">
          <div class="container navbar-brand">
            <h1>Team Performance Checklist</h1>
          </div>
          <div>
            <router-link to="/performance-checklist">Survey</router-link>
            <router-link to="/team-selector">Team</router-link>
          </div>
        </nav>
      </div>
    </header>
    <main>
      <div class="container">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import PerformanceChecklist from './components/PerformanceChecklist.vue';
import TeamSelector from './components/TeamSelector.vue';

const routes = [
  { path: '/performance-checklist', component: PerformanceChecklist },
  { path: '/team/:id', component: TeamSelector}
]
this.Router.addRoute(routes)

export default {
  name: 'App',
  props: {
    Router: Object
  },
  components: {
    PerformanceChecklist,
    TeamSelector
  }
}
</script>

