<template>
    <div class="col-md-6">
        <div class="form-group mt-3">
            <h2>Select team</h2>
            <b-form-select id="select-team" v-model="selected" v-on:change="updateState" :disabled = "loading ? 'disabled' : false">
                <option disabled value="null">Please choose / create a team</option>
                <optgroup>
                    <option v-for="team in teams" v-bind:key="team.id">{{team.name}}</option>
                </optgroup>
                <optgroup v-if="!newTeam">
                    <option v-bind:value="null">Create new team</option>
                </optgroup>
            </b-form-select>
            <sausage-spinner v-show="loading" class="float-right position-fixed" />
        </div>
        <div class="form-group mb-5" v-if="newTeam">
            <h4>Create team</h4>
            <form class="input-group">
                <label class="input-group-text" for="new-team-name">Name</label>
                <input class="form-control" v-model="newTeam.name" id="new-team-name" ref="teamName">
                <button id="add-team" class="input-group-button" v-on:click="addTeam" v-on:submit="addTeam">
                    Create
                </button>
            </form>
        </div>
        <div v-if="selectedTeam" class="card">
            <div class="corner-button">
                <b-dropdown class="float-right" right text="Right align" variant="link" no-caret>
                    <template #button-content>
                        <b-icon icon="three-dots-vertical" font-scale="1"></b-icon>
                    </template>
                    
                    <b-dropdown-item v-on:click="deleteTeam">
                        <span>Delete</span>
                    </b-dropdown-item>
                </b-dropdown>
            </div>
            <div class="card-body">
                <h3 class="card-title">{{selectedTeam.name}}</h3>
                <p class="card-text">{{selectedTeam.description}}</p>
            </div>
        </div>
        <div v-if="selectedTeam" class="row mt-3">
            <div class="offset-md-9 col-md-3">
                <button type="button" class="btn btn-primary" v-on:click="startSurvey">Start Survey</button>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import SausageSpinner from './SausageSpinner.vue'

    const endpoints = {
        teamApi : process.env.VUE_APP_SERVER + '/api/teams',
        teamMemberApi : function(teamId) {
            return process.env.VUE_APP_SERVER + '/api/teams/' + teamId;
        }
    }

    export default {
        name: 'team-selector',
        components: {
            SausageSpinner
        },
        created: function() {
            this.updateTeams();
            if(this.$store.state.team) {
                this.selectedTeam = this.$store.state.team;
                this.selected = this.selectedTeam.name;
            }
        },
        data: function() {
            return {
                selected: null,
                selectedTeam: null,
                loading: false,
                newTeam: null,
                teams: []
            }
        },
        computed: {
            canAdd() {
                var allHasId = this.selectedTeam.members.every( member => member.id );
                return allHasId;
            }
        },
        methods: {
            updateState: function() {
                if(this.selected == null) {
                    this.createEmptyTeam();
                }
                else {
                    this.newTeam = null;
                }
                this.selectedTeam = this.teams.find(team => team.name == this.selected);
                this.$store.state.team = this.selectedTeam;
                this.$emit('select', this.selected);
            },
            fetchTeams: function() {
                this.loading = true;
                return fetch(endpoints.teamApi)
                    .then( res => {
                        return res.json();
                    })
                    .then(json => {
                        this.loading = false;
                        return json;
                    });
            },
            updateTeams: function() {
                return this.fetchTeams()
                .then(teams => {
                    this.teams = teams;
                    return teams;
                });
            },
            postTeam: function(team) {
                return fetch(endpoints.teamApi, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(team)
                })
                .then(res => {
                    return res.json();
                });
            },
            addTeam: function() {
                return this.postTeam(this.newTeam)
                .then(json => {
                    this.newTeam = null;
                    this.updateTeams()
                    .then(() => {
                        this.selected = json.name;
                        this.updateState();
                    });
                });
            },
            updateTeam: function(team) {
                    var id = team.id;
                    var index = this.teams.findIndex(team => team.id == id);
                    if(this.selectedTeam.id == this.teams[index].id) {
                        this.selectedTeam = team;
                    }
                    this.teams[index] = team;
            },
            createEmptyTeam: function() {
                this.newTeam = {
                    name: ""
                };
                Vue.nextTick()
                    .then(() => {
                        this.$refs.teamName.focus();
                    });
            },
            deleteTeam: function() {
                var id = this.selectedTeam.id;
                return fetch(endpoints.teamApi + '/' + id, {
                    method: 'DELETE'
                })
                .then(() => {
                    this.selected = null;
                    this.teams = this.teams.filter(team => team.id != id);
                    this.updateState();
                });
            },
            startSurvey: function() {
                this.$router.push({ name: 'performance-checklist'});
            }
        }
    }
</script>

<style>
    .btn-link {
        color: black;
    }

    .btn-link::hover {
        color: grey;
    }

    .dropdown-toggle::after {
        display: none;
    }

    a {
        color: black;
    }
    
    .corner-button {
        display: inline-block;
        position: absolute;
        width: 100%;
    }
</style>