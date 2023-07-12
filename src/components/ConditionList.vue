<template>
    <select class="form-control form-control-sm" v-model="selectedValue" @change="emitVmodel">
        <template v-for="condition in conditions">
            <option :value="condition.value"> {{ condition.name }} </option>
        </template>
    </select>
</template>

<script>
    export default {
        data(){
            return {
                conditions: [],
                selectedValue: ''
            }
        },
        props: {
            modelValue: {
                required: true,
                type: String
            }
        },
        watch: {
            selectedValue: function(val){
                this.emitVmodel();
            },
            modelValue: function(val){
                this.selectedValue = val;
            }
        },
        emits: [ "update:modelValue" ],
        mounted: function(){
            this.$dnd.get('conditions/')
            .then( (data) => {
                var apiConditions = data.data.results;
                for(var i = 0; i < apiConditions.length; i++){
                    this.conditions.push( {'name': apiConditions[i].name, 'value': apiConditions[i].index } )
                }
                console.log(this.conditions);
            });
        },
        methods: {
            emitVmodel(){
                console.log("emitting update:modelValue with", this.selectedValue);
                this.$emit("update:modelValue", this.selectedValue);
            }
        }
    }
</script>

<style scoped>
</style>