<template>
    <q-card>
        <q-card-section>
            <h6 class="text-center"> Add New Mob </h6>
            <div class="form-group">
                <div class="input-group">
                    <datalist id="datalist-monster-select">
                        <option v-for="monster in availableMonsters" :value="monster.name"> {{ monster.name }} </option>
                    </datalist>
                    <input 
                        id="datalist-monster-selector"
                        ref="datalist-monster-selector"
                        list="datalist-monster-select"
                        class="form-control"
                        :placeholder="'Input Monster or Player (' + availableMonsters.length + ' monsters loaded..)'"
                        v-model.lazy="name"
                    />

                    <!-- <div class="input-group-append">
                        <button class="btn btn-secondary btn-sm" @click="fetchMobInformation"> Fetch Mob Information </button>
                    </div> -->
                </div>
            </div>      

            <div class="form-group">
                <div class="row">
                    <div class="col">
                        <label> Hit Points </label>
                        <input type="number" ref="hp" v-model="hp" min=0 placeholder="Insert Max HP" class="form-control form-control-sm" />
                    </div>

                    <div class="col">
                        <label> Initiative </label>
                        <input type="number" ref="initiative" v-model="initiative" min=0 placeholder="Insert Initiative" class="form-control form-control-sm" />
                    </div>

                    <div class="col">
                        <label> Armor Class </label>
                        <input type="number" ref="ac" v-model="ac" min=0 placeholder="Insert AC" class="form-control form-control-sm" />
                    </div>
                </div>
            </div>

            <div class="form-group">
                <div class="row">
                    <div class="col">
                        <label> Vulnerabilities </label>
                        <input ref="vulns" v-model="vulns" placeholder="Insert Vulnerabilities as a comma-delimited string" class="form-control form-control-sm" />
                    </div>

                    <div class="col">
                        <label> Resistances </label>
                        <input ref="resistances" v-model="resistances" placeholder="Insert Resistances as a comma-delimited string" class="form-control form-control-sm" />
                    </div>
                </div>
            </div>
        </q-card-section>

        <q-card-section>
            <div class="row justify-center">
                <div>
                    <q-checkbox v-model="isPlayer" label="Player?" />
                </div>
            </div>
            <div class="row justify-center">
                <button class="btn btn-primary btn-sm" @click="addNewEntry()"> Add (+) </button>
                <button class="btn btn-success btn-sm" @click="saveEntityLocal(entityInformation); resetForm()"> Save {{ isPlayer ? "Player" : "Monster" }} </button>
            </div>
        </q-card-section>
    </q-card>
</template>

<script>
    import MobInformationBox from '@/components/MobInformationBox.vue';
    import { storeToRefs } from 'pinia';
    import { useMobStore } from '@/stores/mobStore.js';

    export default {
        setup(){
            const mobStore = useMobStore();
            const { saveEntityLocal } = mobStore;
            const { availableMonsters } = storeToRefs(mobStore);

            return {
                saveEntityLocal,
                availableMonsters
            }
        },
        data(){
            return {
                allMonsters: [],
                name: "",
                hp: 0,
                initiative: 0,
                ac: 0,
                vulns: "",
                resistances: "",
                isPlayer: false,
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
                this.player = false;
            },
            name: function(val){
                console.log("Attempting to check if name == mob name");
                for(var m = 0; m < this.availableMonsters.length; m++){
                    if ( this.availableMonsters[m].name == val ){
                        console.log("attempting to fetch mob information from API");
                        this.fetchMobInformation();
                        return true;
                    }
                }
            }
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
                this.isPlayer = false;
            }
        },
        computed: {
            entityInformation(){
                return {
                    'name': this.$data.name,
                    'hp': this.$data.hp,
                    'initiative': this.$data.initiative,
                    'ac': this.$data.ac,
                    'vulns': this.$data.vulns.split(","),
                    'resistances': this.$data.resistances.split(","),
                    'img': this.$data.image,
                    'player': this.$data.isPlayer
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