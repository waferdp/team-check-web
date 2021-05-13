<template>
    <div>
        <h2>Select team</h2>
        <select class="form-select" v-model="selected" v-on:change="updateState">
            <option disabled value="null">Please choose a team</option>
            <option v-for="team in teams" v-bind:key="team.id">{{team.name}}</option>
        </select>
    </div>
</template>

<script>
    export default {
        name: 'team-selector',
        components: {},
        created: function() {
            this.selected = this.$store.team;
        },
        data: function() {
            return {
                selected: null,
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
            }
        }
    }
</script>
