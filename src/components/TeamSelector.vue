<template>
    <div class="form-inline col-md-6">
        <div class="form-group mt-3 mb-5">
            <h2>Select team</h2>
            <select class="form-select" v-model="selected" v-on:change="updateState">
                <option disabled value="null">Please choose a team</option>
                <option v-for="team in teams" v-bind:key="team.id">{{team.name}}</option>
            </select>
        </div>
        <div class="form-group">
            <button class="btn btn-primary" v-if="!newTeam" v-on:click="createEmptyTeam">
                New team
            </button>
            <div class="input-group" v-else>
                <label class="input-group-text" for="new-team-name">Name</label>
                <input class="form-control" v-model="newTeam.name" id="new-team-name">
                <button class="input-group-button" v-on:click="addTeam">
                    Add
                </button>
            </div>
        </div>
        <div v-if="selectedTeam" class="card">
            <div class="form-group">
                <!-- <label class="card-title" for="selected-name"> -->
                <h3 class="card-title">{{selectedTeam.name}}</h3>
                <!-- </label> -->
                <!-- <input class="form-control" v-model="selectedTeam.name" id="selected-name"> -->
            </div>
            <h5 class="card-subtitle">Team members</h5>
            <div class="form-group">
                <ul class="list-group offset-md-1">
                    <li class="list-item" v-for="(member, index) in this.selectedTeam.members" v-bind:key="index">
                        <div class="input-group" v-if="member.id">
                            <span>{{member.name}}&nbsp;</span>
                            <a class="btn btn-default" href="#" v-on:click="removeMember(member.id)">-</a>
                        </div>
                        <div class="input-group" v-else>
                            <label class="input-group-text" v-bind:for="index + '-name'">Name</label>
                            <input class="form-control" v-model="member.name" v-bind:id="index + '-name'">
                            <button class="input-group-button" v-on:click="saveTeam">
                                Add
                            </button>
                        </div>
                    </li>
                </ul>
                <div>
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
    const endpoints = {
        teamApi : process.env.VUE_APP_SERVER + '/api/teams'
    }

    export default {
        name: 'team-selector',
        components: {},
        created: function() {
            this.selected = this.$store.team;
            
            this.updateTeams();
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
                this.selectedTeam = this.teams.find(team => team.name = this.selected);
                this.$store.team = this.selected;
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
                    this.selectedTeam = json;
                });
            },
            addTeam: function() {
                return this.postTeam(this.newTeam)
                .then(() => {
                    this.newTeam = null;
                    this.updateTeams();
                });
            },
            createEmptyTeam: function() {
                this.newTeam = {
                    name: ""
                };
            },
            addMember: function() {
                this.selectedTeam.members.push({
                    name: ""
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
                return fetch(endpoints.teamApi + '/' + this.selectedTeam.id, {
                    method: 'DELETE'
                })
                .then(() => {
                    this.selectedTeam = null;
                    this.selected = null;
                    this.teams = this.teams.filter(team => team.id != id);
                });
            }
        }
    }
</script>
