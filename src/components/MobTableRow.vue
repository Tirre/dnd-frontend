<template>
    <tr v-if="mobData['name']" @click="selectMob" :class="mobState">
        <td>
            <img :src="'https://www.dnd5eapi.co' + mobData.img" style="width: 3rem; height: 3rem" />
        </td>
        <td>
            <h5 v-if="dead && mobData['player']"> {{ mobData['name'] }} (KNOCKED) </h5>
            <h5 v-else-if="dead"> {{ mobData['name'] }} (DEAD) </h5>
            <h5 v-else> {{ mobData['name'] }} </h5>
        </td>
        <td> 
            <h5> {{ mobData['initiative'] }} </h5>
            <p @click="editInitiative=!editInitiative" style="cursor: pointer"> Edit </p>
            <q-input v-show="editInitiative" v-model.number="newInitiative" type="number" filled  @change.lazy="modifyInitiative" dense padding="none" />
        </td>
        <td :class="hpColorClass" class="bold">
            <div>
                <button v-if="mobData['hp'] > 0" class="btn btn-sm btn-warning hp-button hp-button-minus pull-left" @click="removeHP" :disabled="dead && !mobData['player']"> - </button>
                <button v-if="mobData['hp'] < mobData['maxHP']" class="btn btn-sm btn-success hp-button hp-button-plus pull-left" @click="restoreHP" :disabled="dead && !mobData['player']"> + </button>
                <h5> {{ mobData['hp'] }} </h5>
            </div>
            <!-- <div class="hp-button-holder">
                <button v-if="mobData['hp'] < mobData['maxHP']" class="btn btn-sm btn-success hp-button hp-button-plus" @click="restoreHP" :disabled="dead && !mobData['player']"> + </button>
                <button v-if="mobData['hp'] > 0" class="btn btn-sm btn-warning hp-button hp-button-minus" @click="removeHP" :disabled="dead && !mobData['player']"> - </button>
            </div> -->
        </td>
        <td>
            <button v-if="mobData['tempHP'] > 0" class="btn btn-sm btn-warning hp-button hp-button-minus pull-left" @click="removeTempHP" :disabled="dead"> - </button>
            <button class="btn btn-sm btn-success hp-button hp-button-plus pull-left" @click="restoreTempHP" :disabled="dead"> + </button>
            <h5> {{ mobData['tempHP'] || 0 }} </h5>
            <!-- <div class="hp-button-holder">
                <button class="btn btn-sm btn-success hp-button hp-button-plus" @click="restoreTempHP" :disabled="dead"> + </button>
                <button v-if="mobData['hp'] > 0" class="btn btn-sm btn-warning hp-button hp-button-minus" @click="removeTempHP" :disabled="dead"> - </button>
            </div> -->
        </td>
        <td>
            <h5> {{ mobData['ac'] }} </h5>
        </td>
        <td>
            <p style="cursor: pointer" v-show="!toggleAddCondition" @click="toggleAddCondition=!toggleAddCondition"> Add Condition </p>
            <div v-if="toggleAddCondition">
                <div class="input-group">
                    <label> Condition / Applier </label>
                    <ConditionList v-model="selectedCondition" />
                    <select v-model="selectedConditionApplier" class="form-control form-control-sm" >
                        <option v-for="mob in allMobNames" :value="mob"> {{ mob }} </option>
                    </select>
                    <div class="input-group-append">
                        <button class="btn btn-sm btn-success" @click="addCondition"> Add </button>
                    </div>
                    <div class="input-group-append">
                        <button class="btn btn-sm btn-danger" @click="toggleAddCondition=!toggleAddCondition"> Close </button>
                    </div>
                </div>
                
            </div>
            <q-list>
              <template v-for="condition in mobData['conditions']">
                <q-item clickable v-ripple @click="removeCondition(condition.name)">
                  <q-item-section>
                    <q-item-label> {{ condition.name }} </q-item-label>
                    <q-item-label caption> Round {{ condition.round }} </q-item-label>
                    <q-item-label caption v-if="condition.player.length > 0"> By {{ condition.player }} </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
            <!-- <ul>
                <li v-for="condition in mobData['conditions']" >
                    <span>
                        {{ condition.name }}
                    </span>
                    <span v-if="condition.player.length > 0">
                        - by {{ condition.player }}
                    </span>
                    <span> (Round {{ condition.round }})</span>
                    <button class="btn btn-danger btn-sm" @click="removeCondition(condition.name)"> &times; </button>
                </li>
            </ul> -->
        </td>
        <td> 
            <q-list>
              <template v-for="vuln in mobData['vulns']">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label> {{ vuln }} </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
        </td>
        <td>
            <q-list>
              <template v-for="resistance in mobData['resistances']">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label> {{ resistance }} </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
        </td>
        <td> 
            <button class="btn btn-sm btn-danger" @click="removeEntry()"> Remove </button>
        </td>
    </tr>
</template>

<script>
    import ConditionList from '@/components/ConditionList.vue';

    export default {
        data(){
            return {
                toggleAddCondition: false,
                selectedCondition: "charmed",
                selectedConditionApplier: "",
                availableConditions: [],
                editInitiative: false,
                newInitiative: 0
            }
        },
        components: {
            ConditionList
        },
        emits: ['removeEntry', 'restoreHP', 'removeHP', 'restoreTempHP', 'removeTempHP', 'selectMob', 'addCondition', 'removeCondition', 'modifyInitiative' ],
        mounted: function(){

        },
        methods: {
            modifyInitiative(value){
                this.$emit('modifyInitiative', this.mobData.name, this.newInitiative);
                this.editInitiative = false;
            },
            removeCondition(Condition){
                this.$emit('removeCondition', this.mobData.name, Condition);
            },
            addCondition(){
                this.$emit('addCondition', this.mobData.name, { 'name': this.selectedCondition, 'player': this.selectedConditionApplier } );
                this.selectedCondition = "";
                this.selectedConditionApplier = "";
                this.toggleAddCondition = false;
            },
            selectMob(){
                this.$emit('selectMob', this.mobData.monster);
            },
            removeTempHP(){
                this.$emit('removeTempHP', this.mobData.name, 1);
            },
            restoreTempHP(){
                this.$emit('restoreTempHP', this.mobData.name, 1);
            },
            removeHP(){
                this.$emit('removeHP', this.mobData.name, 1);
            },
            restoreHP(){
                this.$emit('restoreHP', this.mobData.name, 1);
            },
            removeEntry(){
                this.$emit('removeEntry', this.mobData.name);
            }
        },
        props: {
            mobData: {
                required: true,
                type: Object,
                default: function(){
                    return {};
                }
            },
            allMobNames: {
                required: false,
                type: Array,
                default: function(){
                    return [];
                }
            }
        },
        computed: {
            hpColorClass(){
                if (this.mobData['hp'] == this.mobData['maxHP']){
                    return "green-text";
                } else if (this.mobData['hp'] < this.mobData['maxHP']/3){
                    return "red-text";
                } else {
                    return "yellow-text";
                }
            },
            dead(){
                return this.mobData['hp'] <= 0;
            },
            mobState(){
                if (this.mobData['hp'] <= 0){
                    if (this.mobData['player']){
                        return "knocked-row";
                    } else {
                        return "dead-row";
                    }
                } else {
                    return "";
                }
            }
        }
    }
</script>

<style scoped>
    ul {
        list-style: none;
        text-align:left;
    }
    .hp-button-holder {
        width: 100%;
        height: auto;
        position: relative;
    }
    .hp-button {
        width: 1.5rem;
        height: 1.5rem;
        padding: 0.2rem;
        /* position: absolute; */
    }
    .hp-button-minus {
        left: 0px;
        top: 0px;
    }
    .hp-button-plus {
        right: 0px;
        top: 0px;
    }

    .bold {
        font-weight: bold;
    }
    .green-text {
        color: green;
    }

    .yellow-text{
        color: orange;
    }
    .red-text {
        color: red;
    }

    .knocked-row {
        background-color: rgba(0,0,0,0.3);
        color: white;
    }
    .dead-row {
        background-color: rgba(0,0,0,0.9);
        color: white;
    }
</style>