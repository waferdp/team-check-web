<template>
    <div v-if="hasData">
        <ul class="list-group">
            <checklist-item v-bind:key="item.index" v-on:update="update" :item=item v-for="item in getPage().items" />
        </ul>
        <div class="row">
            <div class="col-md-3">
                <button type="button" class="btn btn-outline-primary" v-if="!isFirstPage" v-on:click="prevPage">Previous</button>
            </div>
            <div class="offset-md-2 col-md-2">
                <span>Page {{pagination.currentPage}}</span>
            </div>
            <div class="offset-md-2 col-md-3">
                <button type="button" class="btn btn-outline-primary float-end" v-if="!isLastPage" v-on:click="nextPage">Next</button>
                <input type="submit" class="btn btn-primary float-end" v-if="isLastPage" v-on:click="postSurvey">
            </div>
        </div>
        <div class="row" v-if="errors.length">
            <div class="col-md-12" v-for="error in errors" v-bind:key="error.page">
                <div class="alert alert-danger" v-on:click="gotoPage(error.page)" role="button">
                    {{error.message}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ChecklistItem from './ChecklistItem.vue';

    const endpoints = {
        checklistQuestions : '/performance_checklist.json',
        checklistApi : process.env.VUE_APP_SERVER + '/api/performance-checklists'
    }

    function compileErrorMessage(errorsOnPage, pageNumber) {
        var message = `Question${errorsOnPage.length > 1 ? 's' : ''} ` +
            ` ${errorsOnPage.map(error => error.question + 1)}` +
            ` on page ${pageNumber} ${errorsOnPage.length > 1 ? 'are' : 'is'} not answered`;
        return message;
    }
    
    export default {
        name: 'performance-checklist',
        components: {
            ChecklistItem
        },
        data: function() {
            return {
                questions: [],
                errors: [],
                pagination: {
                    currentPage : 1,
                    totalPages: function () {
                        return !this.hasData() ? 0 : Math.floor(this.questions.length / this.itemsPerPage) + 1; 
                    },
                    itemsPerPage: 5
                },
                loading: false,
            };
        },
        created: function() {
            if(this.$store.state.questions) {
                this.questions = this.$store.state.questions;
            } else {
                this.fetchQuestions()
                .then(json => {
                    this.questions = json.map((e, i) => {
                        return {  
                            index: i,
                            key: e,
                            value: null
                        };
                    });
                });
            }
        },
        computed: {
            hasData() {
                return this.questions.length > 0;
            },
            isFirstPage() {
                return this.pagination.currentPage <= 1;
            },
            isLastPage() {
                return this.pagination.currentPage * this.pagination.itemsPerPage >= this.questions.length;
            },
        },
        methods: {
            getPage(){ 
                var end = this.pagination.currentPage * this.pagination.itemsPerPage;
                var start = end - this.pagination.itemsPerPage;
                var items = this.questions.slice(start, end);
                return  {
                    pagination: this.pagination,
                    items: items
                };
            },
            getTeamId() {
                return this.$store.state.team?.id;
            },
            nextPage() {
                this.pagination.currentPage++;
            },
            prevPage() {
                this.pagination.currentPage--;
            },
            gotoPage(pageNumber) {
                this.pagination.currentPage = pageNumber;
            },
            update() {
                this.$store.state.questions = this.questions;
            },
            fetchQuestions() {
                this.loading = true;
                return fetch(endpoints.checklistQuestions)
                .then(res => {
                    return res.json();
                })
                .then(json => {
                    this.loading=false;
                    return json;
                });
            },
            validateForm() {
                var validationErrors = [];
                this.questions.forEach(item => {
                    if(!item.value) {
                        let newError = {
                            question: item.index,
                            page: Math.floor(item.index / this.pagination.itemsPerPage)
                        };
                        validationErrors.push(newError);
                    }
                });
                var errors = [];
                var totalPages = Math.floor(this.questions.length / this.pagination.itemsPerPage);
                for (var i = 0; i < totalPages; i++) {
                    var pageNumber = i+1;
                    var errorsOnPage = validationErrors.filter(error => error.page === i);
                    if(errorsOnPage.length) {
                        var pageError = {
                            page : pageNumber,
                            message : compileErrorMessage(errorsOnPage, pageNumber)
                        };
                        errors.push(pageError);
                    }
                }
                if(!this.getTeamId()) {
                    errors.push({page: 0, message: "Team not selected"});
                }

                this.errors = errors;
            },
            postSurvey() {
                this.validateForm();
                if(this.errors.length) {
                    return;
                }
                var teamAnswer = {
                    teamId : this.getTeamId(),
                    items : this.questions
                };
                fetch(endpoints.checklistApi, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(teamAnswer)
                })
                .then(res =>{
                    alert('Response from server: ' + res.statusText);
                    console.log(res);
                });
            }
        }
    }
</script>
