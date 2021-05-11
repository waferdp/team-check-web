<template>
    <div>
        <h2>Select team</h2>
        <select class="custom-select" v-model="selected">
            <option disabled selected>Please choose a team</option>
            <option v-for="team in teams" v-bind:key="team.id">{{team.name}}</option>
        </select>
    </div>
</template>

<script>

    export default {
        name: 'team-selector',
        computed: {
            teamId() {
                return this.$route.params.id
            }
        },
        components: {},
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
        }
    }
</script>
