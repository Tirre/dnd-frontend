<template>
  <div class="row">
    <div class="col-auto">
      <div class="q-pa-md q-gutter-sm">
        <q-btn class="pull-left" size="xs" label="Prev" icon="arrow_back_ios" color="primary" @click="decrementRound" />        
        <q-btn class="pull-right" size="xs" label="Next" icon="arrow_forward_ios" color="primary" @click="incrementRound" />
        <p> Current Round: {{ currentRound }} </p>
      </div>
    </div>

    <div class="col-auto">
      <div class="q-pa-md q-gutter-sm">
        <q-btn size="xs" label="Players" icon="menu_book" color="primary" @click="playerDialog = true" />
        <q-btn size="xs" label="Monsters" icon="menu_book" color="secondary" @click="monsterDialog = true" />
      </div>
    </div>

    <div class="col-auto">
      <div class="q-pa-md q-gutter-sm">
        <q-toggle v-model="addMobToggle" label="Mob Form" left-label />
        <q-btn size="xs" label="Round" icon="restart_alt" color="brown-5" @click="currentRound = 1" />
        <q-btn size="xs" label="Combat" icon="restart_alt" color="deep-orange" @click="currentRound = 1; mobs = []; currentMob = null" />
        <q-btn size="xs" label="Save" icon="save" color="primary" @click="saveDialog = true" />
        <q-btn size="xs" label="Load" icon="file_open" color="secondary" @click="loadDialog = true" />
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-12">
      <q-table
        class="mt-2"
        flat
        bordered
        :rows="mobs"
        color="amber"
        :pagination="paginationOptions"
        :hide-pagination="true"
      >
        <!-- <template #top>
          <q-toolbar>
            <q-toolbar-title class=“absolute-center”> Mob Initiative Table </q-toolbar-title>
          </q-toolbar>
        </template> -->
        <template #header="props">
            <MobTableRowHeader />
        </template>
        <template #body="props">
            <MobTableRow :allMobNames="mobNames" :mobData="props.row" @modifyInitiative="modifyInitiativeByName" @selectMob="selectMob" @removeTempHP="removeTempHPByName" @restoreTempHP="restoreTempHPByName" @removeHP="removeHPByName" @restoreHP="restoreHPByName" @removeEntry="removeEntryByName" @addCondition="addConditionByName" @removeCondition="removeConditionByName" />
        </template>
      </q-table>
    </div>
    <div class="col-sm-12 col-lg-6 mt-3">
      <MobForm v-show="addMobToggle" @add="addEntry" @updateMobInfo="updateMob" :importFormData="importFormData" />
    </div>
    <div class="col-sm-12 col-lg-6 mt-3">
      <MobInformationBox v-if="currentMob" :mobData="currentMob" @importValues="addEntry" @importValuesToForm="importToForm" @removeData="resetMobData" />
    </div>
   
    <q-dialog v-model="playerDialog" size="medium">
      <q-card>
        <q-card-section>
          <h6> Available Locally Created Players </h6>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-pa-md">
            <q-list bordered separator>
              <template v-for="player in availablePlayers">
                <q-item clickable v-ripple @click="addEntry(player)">
                  <q-item-section>
                    <q-item-label> {{ player.name }} </q-item-label>
                    <q-item-label caption> {{ player.hp }} </q-item-label>
                    <q-item-label caption> {{ player.ac }} </q-item-label>
                    <q-btn size="sm" label="Delete" color="red" @click="deleteEntityLocal(player)" icon="remove_circle" />
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="monsterDialog" size="medium">
      <q-card>
        <q-card-section>
          <h6> Available Locally Created Monsters </h6>
        </q-card-section>

        <q-separator />
        <q-card-section>
          <div class="q-pa-md">
            <q-list bordered separator>
              <template v-for="monster in localMonsters">
                <q-item clickable v-ripple @click="addEntry(monster)">
                  <q-item-section>
                    <q-item-label> {{ monster.name }} </q-item-label>
                    <q-item-label caption> {{ monster.hp }} </q-item-label>
                    <q-item-label caption> {{ monster.ac }} </q-item-label>
                    <q-btn size="sm" label="Delete" color="red" @click="deleteEntityLocal(JSON.parse(json.stringify(monster)))" icon="remove_circle" />
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="saveDialog" size="medium">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center"> Save Session </div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="q-pa-md q-gutter-sm">
            <q-input v-model="saveSessionName" outlined label="Session Name" />
            <q-btn push label="Save Session" icon="save" color="secondary" @click="saveSession(saveSessionName, mobs)" v-close-popup />
            <q-btn push label="Close" icon="close" color="brown-5" v-close-popup />
          </div>
        </q-card-section>
        <q-separator />
      </q-card>
    </q-dialog>

    <q-dialog 
      v-model="loadDialog"
      persistent
      maximized="true"
      size="medium"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center"> Load Session or Start New </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-pa-md q-gutter-sm">
            <q-input v-model="loadSessionName" outlined label="Session Name" />
            <q-btn push label="Start New" icon="new" color="secondary" @click="mobs = []" v-close-popup />
            <q-btn push label="Load Session" icon="load" color="primary" @click="mobs = loadSession(loadSessionName)" v-close-popup />
            <q-btn push label="Close" icon="close" color="brown-5" v-close-popup />
          </div>
        </q-card-section>
        <q-separator />
        
        <q-card-section>
          <div class="q-pa-md">
            <q-list bordered separator>
              <template v-for="session in sessions = getSessionDetails()">
                <q-item clickable v-ripple @click="loadSessionName=session.name; loadSession(loadSessionName)">
                  <q-item-section>
                    <q-item-label> {{ session.name }} </q-item-label>
                    <q-item-label caption> {{ session.mobs.join(" / ") }} </q-item-label>
                    <q-item-label caption> {{ session.players.join(" / ") }} </q-item-label>
                    <q-btn size="sm" label="Delete" color="red" @click="deleteSession(session.name)" icon="remove_circle" />
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- <p> [ { 'dice': 6, 'amount': 2 }, { 'dice': 4, 'amount': 1 }, { 'dice': 20, 'amount': 1 } ] = {{ sumDiceObj([ { 'dice': 6, 'amount': 2 }, { 'dice': 4, 'amount': 1 }, { 'dice': 20, 'amount': 1 }]) }} </p>
    <p> {{ parseDiceString("2d6") }} ({{ sumDiceString("2d6") }})</p>
    <p> {{ parseDiceString("2d20+2d6+13") }} ({{ sumDiceString("2d20+2d6+13") }})</p>
    <p> {{ parseDiceString("d6+4") }} ({{ sumDiceString("d6+4") }})</p>
    <p> {{ parseDiceString("2d6-2") }} ({{ sumDiceString("2d6-2") }})</p>
    <p> {{ parseDiceString("12d12") }} ({{ sumDiceString("12d12") }})</p> -->
  </div>
</template>

<script>
  import MobTableRow from '@/components/MobTableRow.vue';
  import MobTableRowHeader from '@/components/MobTableRowHeader.vue';
  import MapCanvas from '@/components/MapCanvas.vue';
  import MobTable from '@/components/MobTable.vue';
  import MobInformationBox from '@/components/MobInformationBox.vue';
  import MobForm from '@/components/MobForm.vue';

  import { rollD20, rollD15, rollD12, rollD10, rollD8, rollD6, rollD4, parseDiceString, sumDiceString, sumDiceObj } from '@/assets/diceUtils.js';

  import { storeToRefs } from 'pinia';
  import { useMobStore } from '@/stores/mobStore.js';

  export default {
    setup(){
      const mobStore = useMobStore();
      const { saveMonstersLocal, getMonstersLocal, getPlayersLocal, loadSession, saveSession, getSessions, getSessionDetails, deleteSession, deleteEntityLocal } = mobStore;
      const { availablePlayers, localMonsters } = storeToRefs(mobStore);

      return {
        saveMonstersLocal,
        getPlayersLocal,
        getMonstersLocal,
        loadSession,
        saveSession,
        getSessions,
        getSessionDetails,
        deleteSession,
        deleteEntityLocal,
        availablePlayers,
        localMonsters
      }
    },
    data(){
      return {
        mobs: [],
        currentMob: null,
        currentRound: 1,
        addMobToggle: true,
        paginationOptions: {
          page: 1,
          rowsPerPage: 0,
          descending: false
        },
        importFormData: {},
        saveSessionName: "",
        loadSessionName: "",
        loadDialog: true,
        saveDialog: false,
        playerDialog: false,
        monsterDialog: false
      }
    },
    computed: {
      mobNames(){
        return this.mobs.map(function(key){ return key.name });
      }
    },
    methods: {
      sumDiceObj,
      sumDiceString,
      parseDiceString,
      rollD4,
      rollD6,
      rollD8,
      rollD10,
      rollD12,
      rollD15,
      rollD20,
      incrementRound(){
        this.currentRound += 1;
      },
      decrementRound(){
        if ( this.currentRound > 1){
          this.currentRound -= 1;
        }
      },
      importToForm(obj){
        this.importFormData = obj;
      },
      modifyInitiativeByName(name, initiative){
        for(var i = 0; i < this.mobs.length; i++){
          if (this.mobs[i].name == name){
            this.mobs[i].initiative = initiative;
          }
        }
        this.$data.mobs = this.sortListByField(this.mobs, "initiative", false);
      },
      selectMob(monster){
        // console.log("Attempted to select", monster, "from the table");
      },
      addConditionByName(name, condition){
        for(var i = 0; i < this.mobs.length; i++){
          if (this.mobs[i].name == name){
            this.mobs[i]['conditions'].push( { 
              'name': condition.name ? condition.name : "<Condition>",
              'player': condition.player ? condition.player : "",
              'round': this.currentRound
            });
          }
        }
      },
      removeConditionByName(name, Condition){
        for(var i = 0; i < this.mobs.length; i++){
          if (this.mobs[i].name == name){
            for(var s = 0; s < this.mobs[i]['conditions'].length; s++){
              if ( this.mobs[i]['conditions'][s].name == Condition){
                this.mobs[i]['conditions'].splice(s, 1);
              }
            }
          }
        }
      },
      restoreHPByName(name, hp){
        for(var i = 0; i < this.mobs.length; i++){
          if (this.mobs[i].name == name){
            this.mobs[i]['hp'] += hp;
          }
        }
      },
      restoreTempHPByName(name, hp){
        for(var i = 0; i < this.mobs.length; i++){
          if (this.mobs[i].name == name){
            this.mobs[i]['tempHP'] += hp;
          }
        }
      },
      removeHPByName(name, hp){
        for(var i = 0; i < this.mobs.length; i++){
          if (this.mobs[i].name == name){
            if (this.mobs[i]['hp'] < hp){
              this.mobs[i]['hp'] = 0;
            } else {
              this.mobs[i]['hp'] -= hp;
            }
          }
        }
      },
      removeTempHPByName(name, hp){
        for(var i = 0; i < this.mobs.length; i++){
          if (this.mobs[i].name == name){
            if (this.mobs[i]['tempHP'] < hp){
              this.mobs[i]['tempHP'] = 0;
            } else {
              this.mobs[i]['tempHP'] -= hp;
            }
          }
        }
      },
      removeEntryByName(name){
        for(var i = 0; i < this.mobs.length; i++){
          if (this.mobs[i].name == name){
            this.mobs.splice(i, 1);
          }
        }
      },
      sortListByField(itemList, column, ascending){
        itemList.sort(function(a, b){
          try {
            if (ascending){
              if (a[column] > b[column]){
                return 1;
              } else if (a[column] < b[column]){
                return -1;
              } else {
                return 0;
              }
            } else {
              if (a[column] > b[column]){
                return -1;
              } else if (a[column] < b[column]){
                return 1;
              } else {
                return 0;
              }
            }
          } catch(err){
            return false;
          }
        });
        return itemList;
      },
      checkNameFree(name){
        for(var i = 0; i < this.mobs.length; i++){
          if ( this.mobs[i].name == name ){
            return false;
          }
        }
        return true;
      },
      addEntry(entry){
        var addEntry = {};
        for(var key in entry){
          addEntry[key] = entry[key];
        }
        var nameUnique = false;
        var newName = entry.name;
        var counter = 1;
        while(!nameUnique){
          console.log("Name not unique", counter, newName);
          nameUnique = this.checkNameFree(newName);
          if (nameUnique){
            break;
          } else {
            newName = entry.name + String(counter);
            counter++;
          }
        }
        addEntry['name'] = newName;
        addEntry['maxHP'] = entry['hp'];
        addEntry['tempHP'] = 0;
        addEntry['conditions'] = [];
        addEntry['monster'] = entry.name;

        this.$data.mobs.push(addEntry);
        this.$data.mobs = this.sortListByField(this.mobs, "initiative", false);
      },
      updateMob(mob){
        this.$data.currentMob = mob;
      },
      resetMobData(){
        this.$data.currentMob = null;
      }
    },
    components: {
      MapCanvas,
      MobTable,
      MobForm,
      MobInformationBox,
      MobTableRow,
      MobTableRowHeader
    }
  }
</script>

<style scoped>
  .q-btn {
    padding: 4px;
  }
</style>