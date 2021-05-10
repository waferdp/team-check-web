<template>
    <div v-if="hasData">
        <ul class="list-group">
            <checklist-item v-bind:key="item.index" :item=item  v-for="item in getPage().items" />
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
                <input type="submit" class="btn btn-primary float-end" v-if="isLastPage" v-on:click="sendJsonData">
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
        checklistApi : process.env.VUE_APP_SERVER + '/api/performance-checklist'
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
                result: [],
                errors: [],
                pagination: {
                    currentPage : 1,
                    totalPages: function () {
                        return !this.hasData() ? 0 : Math.floor(this.result.length / this.itemsPerPage) + 1; 
                    },
                    itemsPerPage: 5
                },
                loading: false,
            };
        },
        created: function() {
            this.fetchJsonData()
            .then(json => {
                this.result = json.map((e, i) => {
                    return {  
                        index: i,
                        key: e,
                        value: null
                    };
                });
            });
        },
        computed: {
            hasData() {
                return this.result.length > 0;
            },
            isFirstPage() {
                return this.pagination.currentPage <= 1;
            },
            isLastPage() {
                return this.pagination.currentPage * this.pagination.itemsPerPage >= this.result.length;
            },
        },
        methods: {
            getPage(){ 
                var end = this.pagination.currentPage * this.pagination.itemsPerPage;
                var start = end - this.pagination.itemsPerPage;
                var items = this.result.slice(start, end);
                return  {
                    pagination: this.pagination,
                    items: items
                };
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
            fetchJsonData() {
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
                this.result.forEach(item => {
                    if(!item.value) {
                        let newError = {
                            question: item.index,
                            page: Math.floor(item.index / this.pagination.itemsPerPage)
                        };
                        validationErrors.push(newError);
                    }
                });
                var errors = [];
                var totalPages = Math.floor(this.result.length / this.pagination.itemsPerPage);
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
                this.errors = errors;
            },
            sendJsonData() {
                this.validateForm();

                if(this.errors.length) {
                    return;
                }
                fetch(endpoints.checklistApi, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.result)
                })
                .then(res =>{
                    alert('Response from  ' + res.statusText);
                    console.log(res);
                });
            }
        }
    }
</script>
