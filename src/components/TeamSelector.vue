<template>
    <div class="form-inline col-md-6">
        <div class="form-group mt-3">
            <h2>Select team</h2>
            <select class="form-select" v-model="selected" v-on:change="updateState">
                <option disabled value="null">Please choose a team</option>
                <option v-for="team in teams" v-bind:key="team.id">{{team.name}}</option>
            </select>
        </div>
        <div class="form-group mb-5">
            <button class="btn btn-primary" v-if="!newTeam" v-on:click="createEmptyTeam">
                New team
            </button>
            <form class="input-group" v-else>
                <label class="input-group-text" for="new-team-name">Name</label>
                <input class="form-control" v-model="newTeam.name" id="new-team-name" ref="teamName">
                <button class="input-group-button" v-on:click="addTeam" v-on:submit="addTeam">
                    Add
                </button>
            </form>
        </div>
        <div v-if="selectedTeam" class="card">
            <h3 class="card-title">{{selectedTeam.name}}</h3>
            <h5 class="card-subtitle">Team members</h5>
            <div class="form-group">
                <ul class="list-group offset-md-1">
                    <li class="list-item" v-for="(member, index) in this.selectedTeam.members" v-bind:key="index">
                        <div class="input-group" v-if="member.id">
                            <span>{{member.name}}&nbsp;</span>
                            <a class="btn btn-default" href="#" v-on:click="removeMember(member.id)">-</a>
                        </div>
                        <form class="input-group" v-else>
                            <label class="input-group-text" v-bind:for="index + '-name'">Name</label>
                            <input class="form-control" v-model="member.name" v-bind:id="index + '-name'" :ref="index + '-memberName'">
                            <button class="input-group-button" v-on:click="saveTeam" v-on:submit="saveTeam">
                                Add
                            </button>
                        </form>
                    </li>
                </ul>
                <div class="float-right">
                    <button class="btn btn-danger mt-3" v-on:click="deleteTeam">
                        <span>Delete team</span>
                    </button>
                    <button class="btn btn-primary mt-3" v-on:click="addMember">
                        <span>New team member</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    const endpoints = {
        teamApi : process.env.VUE_APP_SERVER + '/api/teams'
    }

    export default {
        name: 'team-selector',
        components: {},
        created: function() {
            this.updateTeams();
            this.selected = this.$store.state.team;
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
        methods: {
            updateState: function() {
                this.selectedTeam = this.teams.find(team => team.name == this.selected);
                this.$store.commit('selectTeam', this.selected);
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
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(team)
                })
                .then(res => {
                    return res.json();
                });
            },
            saveTeam: function() {
                return this.postTeam(this.selectedTeam)
                .then(json => {
                    this.selected = json.name;
                    this.updateState();
                });
            },
            addTeam: function() {
                return this.postTeam(this.newTeam)
                .then(team => {
                    var id = team.id;
                    this.newTeam = null;
                    this.updateTeams()
                    .then(teams =>{
                        this.selected = teams.find(team => team.id == id).name;
                        this.updateState();
                    });
                });
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
            addMember: function() {
                var size = this.selectedTeam.members.push({
                    name: ""
                });
                var refName = (size-1) + '-memberName';
                Vue.nextTick()
                    .then(() => {
                        this.$refs[refName][0].focus();
                    });
                
            },
            removeMember: function(id) {
                var members = this.selectedTeam.members;
                var removed = members.filter(member => member.id != id);
                this.selectedTeam.members = removed;
                this.saveTeam();
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
            }
        }
    }
</script>
