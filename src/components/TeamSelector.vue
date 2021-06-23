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

            <h3 class="card-title">{{selectedTeam.name}}</h3>
            <h5 class="card-subtitle">Team members</h5>
            <div class="form-group card-body">
                <ul class="list-group offset-md-1">
                    <li class="list-item" v-for="(member, index) in this.selectedTeam.members" v-bind:key="index">
                        <div class="input-group" v-if="member.id">
                            <span class="col-lg-10 col-sm-9">{{member.name}}&nbsp;</span>
                            <a class="btn btn-default text-black col-xs-1" href="#" v-on:click="removeMember(member.id)">
                                <b-icon class="float-right" icon="trash" />
                            </a>
                        </div>
                        <form class="input-group" v-else>
                            <label class="input-group-text" v-bind:for="index + '-name'">Name</label>
                            <input class="form-control" v-model="member.name" v-bind:id="index + '-name'" :ref="index + '-memberName'">
                            <button class="input-group-button" v-on:click="postMember(member)" v-on:submit="postMember(member)">
                                Add
                            </button>
                        </form>
                    </li>
                    <li v-if="canAdd"  class="list-item">
                        <b-button variant="outline-secondary" @click="addMember">
                            New team member
                        </b-button>
                    </li>
                </ul>
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
            deleteMember: function(memberId) {
                var url = endpoints.teamMemberApi(this.selectedTeam.id) + '/' + memberId;
                return fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
            },
            postMember: function(member) {
                return fetch(endpoints.teamMemberApi(this.selectedTeam.id), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(member)
                })
                .then( res => {
                    return res.json();
                })
                .then(team => {
                    this.updateTeam(team);
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
                this.deleteMember(id);
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
        float: right;
    }
</style>