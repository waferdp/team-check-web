<template>
    <div v-if="!loading">
        <h3>Assessment Summary</h3>
        <div>
            <span>Your team is {{assessment.stage}}</span>
        </div>
        <div>
            <span>Your average score is {{assessment.average}}</span>
        </div>
        <div v-if="assessment.high.length">
            <h3>Assessment Strengths</h3>    
            <ul>
                <li v-for="item in assessment.high" v-bind:key="item.key">
                    <span>{{item.key}}: {{item.value}}</span>
                </li>
            </ul>
        </div>
        <div v-if="assessment.low.length">
            <h3>Assessment Weaknesses</h3>    
            <ul>
                <li v-for="item in assessment.low" v-bind:key="item.key">
                    <span>{{item.key}}: {{item.value}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

    const endpoints = {
        teamAssessmentApi : process.env.VUE_APP_SERVER + '/api/team-assessments',
    }


export default {
    data: function() {
        return {
            assessment : null,
            loading: true
        }
    },
    computed: {
        hasData() {
            return this.assessment == true;
        },
    },
    created: function() {
        this.fetchAssessment()
            .then(apiAssessment => {
                this.loading = false;
                this.assessment = apiAssessment;
            });
    },
    methods: {
        getTeamId() {
            return this.$store.state.team?.id
        },
        fetchAssessment() {
            var teamId = this.getTeamId()
            var url  = endpoints.teamAssessmentApi;
            if(teamId) {
                url += '?teamId=' + teamId;
            }
            return fetch(url)
                .then(res => {
                    return res.json();
                });
        }
    }
}
</script>