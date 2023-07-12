<template>
    <q-card>
        <q-card-section>
            <div>
                <h6 class="text-center"> {{ mobData.name }} </h6>
                <img :src="'https://www.dnd5eapi.co' + mobData.image" style="width: 3rem; height: 3rem" />
                <button class="pull-right btn btn-sm btn-danger btn-close" @click="removeData"> X </button>
            </div>
        </q-card-section>

        <q-card-section>
            <div>
                <button class="btn btn-primary mx-1" @click="emitImport('importValues')" title="Import values to Initiative Table"> Import </button>
                <button class="btn btn-secondary mx-1" @click="emitImport('importValuesToForm')" title="Import values to Initiative Table"> Import to Form </button>
            </div>
            <div class="row">
                <div class="col-12">
                    <q-table
                        title="Combat Data"
                        :rows="combatData"
                        color="amber"
                        :pagination="paginationOptions"
                        :hide-pagination="true"
                        dense
                    >
                        <template #top>
                            <q-toolbar>
                                <q-toolbar-title class=“absolute-center”> Combat </q-toolbar-title>
                            </q-toolbar>
                        </template>
                    </q-table>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-6">
                    <q-table
                        title="Mob Information"
                        :rows="primaryData"
                        color="amber"
                        :pagination="paginationOptions"
                        :hide-pagination="true"
                        dense
                    >
                        <template #top>
                            <q-toolbar>
                                <q-toolbar-title class=“absolute-center”> General </q-toolbar-title>
                            </q-toolbar>
                        </template>
                    </q-table>
                </div>
                <div class="col-6">
                    <q-table
                        title="Attributes"
                        :rows="attributes"
                        color="amber"
                        :pagination="paginationOptions"
                        :hide-pagination="true"
                        dense
                    >
                        <template #top>
                            <q-toolbar>
                                <q-toolbar-title class=“absolute-center”> Attributes </q-toolbar-title>
                            </q-toolbar>
                        </template>
                    </q-table>
                </div>
            </div>

            <div class="row mt-2">
                <div class="col-12">
                    <h4> Actions </h4>
                    <q-table
                        :rows="actionsDesc"
                        color="amber"
                        :pagination="paginationOptions"
                        :hide-pagination="true"
                        dense
                    />
                </div>
                <div class="col-12 mt-2">
                    <q-table
                        :rows="actionsDetails"
                        color="amber"
                        :pagination="paginationOptions"
                        :hide-pagination="true"
                        dense
                    />
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script>
    import { rollD20, rollD15, rollD12, rollD10, rollD8, rollD6, rollD4, parseDiceString, sumDiceString, sumDiceObj } from '@/assets/diceUtils.js';

    export default {
        data() {
            return {
                paginationOptions: {
                    page: 1,
                    rowsPerPage: 0,
                    descending: false
                }
            }
        },
        emits: [ 'importValues', 'importValuesToForm', 'removeData' ],
        props: {
            mobData: {
                type: Object,
                required: true,
                default: function(){
                    return {}
                }
            }
        },
        methods: {
            sumDiceString,
            removeData: function(){
                this.$emit('removeData');
            },
            emitImport: function(emitName){
                var emitObj = { };
                emitObj['name'] = this.mobData.name;
                emitObj['ac'] = this.mobData.armor_class[0].value;
                emitObj['initiative'] = Math.floor( (Math.random() * 20)+1) + Math.floor((this.mobData.dexterity-10) / 2);
                emitObj['hp'] = Math.max(sumDiceString(this.mobData.hit_points_roll)[0], this.mobData.hit_points);
                emitObj['vulns'] = this.mobData.damage_vulnerabilities.join(",");
                emitObj['resistances'] = this.mobData.damage_resistances.join(",");
                emitObj['img'] = this.mobData.image;
                emitObj['player'] = true;
                this.$emit(emitName, emitObj);
            }
        },
        computed: {
            primaryData(){
                try {
                    return [
                        { 'name': 'Type', 'value': this.mobData.type },
                        { 'name': 'Subtype', 'value': this.mobData.subtype },
                        { 'name': 'Size', 'value': this.mobData.size },
                        { 'name': 'XP', 'value': this.mobData.xp },
                        { 'name': 'Challenge', 'value': this.mobData.challenge_rating },
                        { 'name': 'Languages', 'value': this.mobData.languages.split(",").join("\n") }
                    ]
                } catch(err){
                    return [ { 'name': 'Error', 'value': err } ];
                }
            },
            combatData(){
                try {
                    var obj = [
                        { 'name': 'HP (Avg)', 'value': this.mobData.hit_points },
                        { 'name': 'Hit Dice', 'value': this.mobData.hit_dice },
                        { 'name': 'HP Roll', 'value': this.mobData.hit_points_roll },
                        { 'name': 'Armor Class', 'value': this.mobData.armor_class[0].value },
                        { 'name': 'Resistances', 'value': this.mobData.damage_resistances.join("\n") },
                        { 'name': 'Vulnerabilities', 'value': this.mobData.damage_vulnerabilities.join("\n") },
                        { 'name': 'Immunities', 'value': this.mobData.damage_immunities.join("\n") }
                        // { 'name': 'Condition Immunities', 'value': this.mobData.condition_immunities.join("\n") },
                        
                    ]
                    for(var key in this.mobData.speed){
                        obj.push({
                            'name': "Speed (" + key + ")",
                            'value': this.mobData.speed[key]
                        });
                    }
                    return obj;
                } catch(err){
                    console.log(err);
                    return [ { 'name': 'Error', 'value': err } ];
                }
            },
            attributes(){
                try {
                    return [
                        { 'name': 'STR', 'value': this.mobData.strength },
                        { 'name': 'DEX', 'value': this.mobData.dexterity },
                        { 'name': 'CON', 'value': this.mobData.constitution },
                        { 'name': 'INT', 'value': this.mobData.intelligence },
                        { 'name': 'WIS', 'value': this.mobData.wisdom },
                        { 'name': 'CHA', 'value': this.mobData.charisma }
                    ]
                } catch(err){
                    return [ { 'name': 'Error', 'value': err } ];
                }
            },
            actionsDesc(){
                var actionDesc = [];
                for(var i = 0; i < this.mobData.actions.length; i++){
                    var action = this.mobData.actions[i];
                    try {
                        var a = { };
                        a['name'] = action.name || '-';
                        a['desc'] = action.desc || '-';
                    } catch(err){
                        var a = {
                            'name': action.name,
                            'desc': action.desc
                        }
                    }
                    actionDesc.push(a);
                }
                return actionDesc;
            },
            actionsDetails(){
                var actionDetails = [];
                for(var i = 0; i < this.mobData.actions.length; i++){
                    var action = this.mobData.actions[i];
                    try {
                        var a = { };
                        a['name'] = action.name || '-';
                        a['attack_bonus'] = action.attack_bonus ? action.attack_bonus : '-';
                        a['damage'] = action.damage[0].damage_dice ? action.damage[0].damage_dice : '-';
                        a['damage_type'] = action.damage[0].damage_type.name ? action.damage[0].damage_type.name : '-';
                    } catch(err){
                        console.log(err);
                        var a = {
                            'name': action.name,
                            'desc': action.desc
                        }
                    }
                    actionDetails.push(a);
                }
                return actionDetails;
            },
            actions(){
                var actions = [];
                for(var i = 0; i < this.mobData.actions.length; i++){
                    var action = this.mobData.actions[i];
                    try {
                        var a = { };
                        a['name'] = action.name || '-';
                        a['desc'] = action.desc || '-';
                        a['attack_bonus'] = action.attack_bonus ? action.attack_bonus : '-';
                        a['damage'] = action.damage[0].damage_dice ? action.damage[0].damage_dice : '-';
                        a['damage_type'] = action.damage[0].damage_type.name ? action.damage[0].damage_type.name : '-';
                    } catch(err){
                        var a = {
                            'name': action.name,
                            'desc': action.desc
                        }
                    }
                    actions.push(a);
                }
                return actions;
            }
        }
    }
</script>

<style scoped>
    .btn-close {
        position: absolute;
        right: 0px;
        top: 0px;
    }
</style>