<template>
    <div v-if="!loading">
        <div v-if="assessment">
            <h2>Assessment Summary</h2>
            <div class="row">
                <div class="col-md-12">
                    <img v-if="assessment.stage == 'FormingStorming'" class="stage" src="forming_storming.png" >
                    <img v-if="assessment.stage == 'Norming'" class="stage" src="norming.png">
                    <img v-if="assessment.stage == 'Performing'" class="stage" src="performing.png">
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div v-html="markdownToHtml"></div>
                    <!-- <span>Your team is <strong>{{assessment.stage}}</strong></span> -->
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <span>Your average score is {{assessment.average}}</span>
                </div>
            </div>
            <div v-if="assessment.high.length" class="mt-5">
                <h3>Assessment Strengths</h3>    
                <ul>
                    <li v-for="item in assessment.high" v-bind:key="item.key">
                        <span>{{item.key}}: {{item.value}}</span>
                    </li>
                </ul>
            </div>
            <div v-if="assessment.low.length" class="mt-5">
                <h3>Assessment Weaknesses</h3>    
                <ul>
                    <li v-for="item in assessment.low" v-bind:key="item.key">
                        <span>{{item.key}}: {{item.value}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="error" class="alert alert-danger">
            <span>{{error}}</span>
        </div>
    </div>
</template>

<script>
var marked = require('marked')

const endpoints = {
    teamAssessmentApi : process.env.VUE_APP_SERVER + '/api/team-assessments',
    teamAssesmentStatic: process.env.VUE_APP_BASE_URL
}


export default {
    data: function() {
        return {
            assessment : null,
            loading: true,
            error: null,
            markdownToHtml: null
        }
    },
    computed: {
        hasData() {
            return this.assessment == true;
        }
    },
    created: function() {
        this.fetchAssessment()
            .then(apiAssessment => {
                this.loading = false;
                this.assessment = apiAssessment;
                this.fetchStaticAssesmentText(apiAssessment.stage)
                    .then(markdown => {
                        this.markdownToHtml = marked.marked(markdown)
                    })
            })
            .catch(error => {
                this.loading = false;
                this.error = 'Assessment "' + error.statusText + '" for team "' + this.getTeamName() + '"';
            });
    },
    methods: {
        getTeamId() {
            return this.$store.state.team?.id
        },
        getTeamName() {
            return this.$store.state.team?.name;
        },
        fetchAssessment() {
            var teamId = this.getTeamId()
            var url  = endpoints.teamAssessmentApi;
            if(teamId) {
                url += '?teamId=' + teamId;
            }
            return fetch(url)
                .then(res => {
                    if (!res.ok) { 
                        throw res;
                    }
                    else {
                        return res.json();
                    }
                });                
        },
        fetchStaticAssesmentText(teamStage) {
            var url = `${endpoints.teamAssesmentStatic}/${teamStage}.md`
            return fetch(url)
                .then(result => {
                    if (!result.ok) {
                        throw result;
                    }
                    else {
                        return result.text()
                    }
                });
        }
    }
}
</script>

<style>
img.stage {
    width: auto; 
    height: 200px;
}
</style>