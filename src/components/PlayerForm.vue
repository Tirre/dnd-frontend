<template>
    <q-card>
        <q-card-section>
            <h6 class="text-center"> Add New Mob </h6>
            <div class="form-group">
                <div class="input-group">
                    <datalist id="datalist-monster-select">
                        <option v-for="monster in allMonsters" :value="monster.name"> {{ monster.name }} </option>
                    </datalist>
                    <input 
                        id="datalist-monster-selector"
                        ref="datalist-monster-selector"
                        list="datalist-monster-select"
                        class="form-control"
                        :placeholder="'Input Monster or Player (' + allMonsters.length + ' monsters loaded..)'"
                        v-model.lazy="name"
                    />

                    <!-- <div class="input-group-append">
                        <button class="btn btn-secondary btn-sm" @click="fetchMobInformation"> Fetch Mob Information </button>
                    </div> -->
                </div>
            </div>      

            <div class="form-group">
                <label> Hit Points </label>
                <input type="number" ref="hp" v-model="hp" min=0 placeholder="Insert Max HP" class="form-control form-control-sm" />
            </div>

            <div class="form-group">
                <label> Initiative </label>
                <input type="number" ref="initiative" v-model="initiative" min=0 placeholder="Insert Initiative" class="form-control form-control-sm" />
            </div>

            <div class="form-group">
                <label> Armor Class </label>
                <input type="number" ref="ac" v-model="ac" min=0 placeholder="Insert AC" class="form-control form-control-sm" />
            </div>

            <div class="form-group">
                <label> Vulnerabilities </label>
                <input ref="vulns" v-model="vulns" placeholder="Insert Vulnerabilities as a comma-delimited string" class="form-control form-control-sm" />
            </div>

            <div class="form-group">
                <label> Resistances </label>
                <input ref="resistances" v-model="resistances" placeholder="Insert Resistances as a comma-delimited string" class="form-control form-control-sm" />
            </div>
        </q-card-section>

        <q-card-section>
            <button class="btn btn-primary btn-sm" @click="addNewEntry()"> Add (+) </button>
        </q-card-section>
    </q-card>
</template>

<script>
    import MobInformationBox from '@/components/MobInformationBox.vue';

    export default {
        data(){
            return {
                allMonsters: [],
                name: "",
                hp: 0,
                initiative: 0,
                ac: 0,
                vulns: "",
                resistances: "",
                currentMob: null
            }
        },
        emits: [ 'add', 'updateMobInfo' ],
        components: {
            MobInformationBox
        },
        props: {
            importFormData: {
                required: false,
                type: Object
            }
        },
        watch: {
            importFormData: function(obj){
                this.name = obj.name;
                this.hp = obj.hp;
                this.ac = obj.ac;
                this.initiative = obj.initiative;
                this.vulns = obj.vulns;
                this.resistances = obj.resistances;
            },
            name: function(val){
                console.log("Attempting to check if name == mob name");
                for(var m = 0; m < this.allMonsters.length; m++){
                    if ( this.allMonsters[m].name == val ){
                        this.fetchMobInformation();
                        return true;
                    }
                }
            }
        },
        mounted: function(){
            this.$monstersAPI.get()
            .then((data) => {
                if (data){
                    this.allMonsters = data.data.results;
                } else {
                    this.allMonsters = [];
                }
            });
        },
        methods: {
            fetchMobInformation(mob){
                this.currentMob = null;
                this.$monstersAPI.get( this.mobNameForAPI )
                .then((data) => {
                    if(data){
                        this.currentMob = data.data;
                        this.$emit('updateMobInfo', this.currentMob);
                    } else {
                        this.currentMob = null;
                    }
                });
            },
            addNewEntry(){
                this.$emit('add', this.entityInformation);
                this.resetForm();
            },
            resetForm(){
                this.name = "";
                this.hp = 0;
                this.initiative = 0;
                this.ac = 0;
            }
        },
        computed: {
            entityInformation(){
                return {
                    'player': true,
                    'img': this.$data.image,
                    'name': this.$data.name,
                    'hp': this.$data.hp,
                    'initiative': this.$data.initiative,
                    'ac': this.$data.ac,
                    'vulns': this.$data.vulns.split(","),
                    'resistances': this.$data.resistances.split(",")
                }
            },
            mobNameForAPI(){
                return this.name.replaceAll(" ", "-").toLowerCase();
            }
        }
    }
</script>

<style scoped>
</style>