<template>
    <div>
        <h2>Select team</h2>
        <select class="form-select" v-model="selected" v-on:change="updateState">
            <option disabled value="null">Please choose a team</option>
            <option v-for="team in teams" v-bind:key="team.id">{{team.name}}</option>
        </select>
        <div v-if="selected">
            <div class="form-group">
                <label for="selected-name">Team name</label>
                <input class="form-input" v-model="selected.name" id="selected-name">
            </div>
            <ul class="list-group" v-if="selected.members">
                <li class="list-item" v-for="(member, index) in this.selected.members" v-bind:key="index">
                    <label v-bind:for="index + '-name'">Team name</label>
                    <input class="form-input" v-model="member.name" v-bind:id="index + '-name'">
                </li>
            </ul>
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
            
            this.fetchTeams()
            .then(teams => {
                this.teams = teams;
            });
        },
        data: function() {
            return {
                selected: null,
                loading: false,
                teams: [
                    {
                        name: "BlueBerries",
                        id: 1,
                    },
                    {
                        name: "Raspberries",
                        id: 2
                    }
                ]
            }
        },
        methods: {
            updateState: function() {
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
            saveTeam: function() {
                fetch(endpoints.checklistApi, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.selected)
                })
                .then(res => {
                    return res.json()
                })
                .then(json => {
                    this.selected = json;
                });

            }
        }
    }
</script>
