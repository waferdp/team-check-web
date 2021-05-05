<template>
    <div v-if="hasData">
        <ul class="list-group gap-3">
            <li class="list-group-item border" v-bind:key="item.index" v-for="item in getPage().items">
                <span>{{item.index + 1}}: {{item.key}}</span>
                <div class="row">
                    <div class="col-md-3">
                        <input class="form-check-input" type="radio" v-model="item.value" v-bind:key="item.index" v-bind:id="item.index + '-1'" v-bind:name="item.index" v-bind:value="1">
                        <label class="form-check-label" v-bind:for="item.index + '-1'">1. Disagree strongly</label>
                    </div>

                    <div class="col-md-3">
                        <input class="form-check-input" type="radio" v-model="item.value" v-bind:key="item.index" v-bind:id="item.index + '-2'" v-bind:name="item.index" v-bind:value="2">
                        <label class="form-check-label" v-bind:for="item.index + '-2'">2. Disagree to some extent</label>
                    </div>

                    <div class="col-md-3">
                        <input class="form-check-input" type="radio" v-model="item.value" v-bind:key="item.index" v-bind:id= "item.index + '-3'" v-bind:name="item.index" v-bind:value="3">
                        <label class="form-check-label" v-bind:for="item.index + '-3'">3. Agree to some extent</label>
                    </div>

                    <div class="col-md-3">
                        <input class="form-check-input" type="radio" v-model="item.value" v-bind:key="item.index" v-bind:id="item.index + '-4'" v-bind:name="item.index" v-bind:value="4">
                        <label class="form-check-label" v-bind:for="item.index + '-4'">4. Agree strongly</label>
                    </div>
                </div>
            </li>
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
            <div class="col-md-12" v-for="error in errors" v-bind:key="error">
                <div class="alert alert-danger">
                    {{error}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
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
            fetchJsonData() {
                this.loading = true;
                return fetch('/performance_checklist.json')
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
                    var errorsOnPage = validationErrors.filter(error => error.page === i);
                    if(errorsOnPage.length) {
                        errors.push(`Question${errorsOnPage.length > 1 ? 's' : ''} ${errorsOnPage.map(error => error.question + 1)} on page ${i+1} ${errorsOnPage.length > 1 ? 'are' : 'is'} not answered`);
                    }
                }
                this.errors = errors;
            },
            sendJsonData() {
                this.validateForm();

                if(this.errors.length) {
                    return;
                }
                console.log(JSON.stringify(this.result));
                fetch('/api/performance-checklist', {
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
