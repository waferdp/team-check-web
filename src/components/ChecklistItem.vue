<template>
    <li class="list-group-item border">
        <div class="mt-3">
            <span>{{item.index + 1}}: {{item.key}}</span>
        </div>
        <div class="row mt-5 mb-3 m-1">
            <div class="col-md-3 form-check form-check-inline">
                <input class="form-check-input" type="radio" v-model="item.value" v-bind:id="item.index + '-1'" v-bind:name="item.index" v-bind:value="1">
                <label role="button" class="form-check-label" v-bind:for="item.index + '-1'">1. Disagree strongly</label>
            </div>
            <div class="col-md-3 form-check form-check-inline">
                <input class="form-check-input" type="radio" v-model="item.value" v-bind:id="item.index + '-2'" v-bind:name="item.index" v-bind:value="2">
                <label role="button" class="form-check-label" v-bind:for="item.index + '-2'">2. Disagree to some extent</label>
            </div>

            <div class="col-md-3 form-check form-check-inline">
                <input class="form-check-input" type="radio" v-model="item.value" v-bind:id= "item.index + '-3'" v-bind:name="item.index" v-bind:value="3">
                <label role="button" class="form-check-label" v-bind:for="item.index + '-3'">3. Agree to some extent</label>
            </div>

            <div class="col-md-2 form-check form-check-inline">
                <input class="form-check-input" type="radio" v-model="item.value" v-bind:id="item.index + '-4'" v-bind:name="item.index" v-bind:value="4">
                <label role="button" class="form-check-label" v-bind:for="item.index + '-4'">4. Agree strongly</label>
            </div>
        </div>
    </li>
</template>

<script>

    export default {
    name: 'checklist-item',
    props: {
        item: {
            index: String,
            key: String,
            value: Number
        }
    },
    components: {
        }
    }
</script>
