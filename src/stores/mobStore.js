import { defineStore } from 'pinia';
import axios from 'axios';

var dndAPIUrl = "https://www.dnd5eapi.co/api/";
var axiosMonsterAPI = axios.create({
    baseURL: dndAPIUrl + "monsters/",
});
var axiosSpellsAPI = axios.create({
    baseURL: dndAPIUrl + "spells/",
});
var axiosConditionsAPI = axios.create({
    baseURL: dndAPIUrl + "conditions/",
});

export const useMobStore = defineStore('mob', {
    id: 'mob',
    state: () => ({
        combatMobs: [],
        localMonsters: [],
        apiMonsters: [],
        availablePlayers: []
    }),
    getters: {
        availableMonsters(state){
            var allMonsters = [];
            for(var i = 0; i < state.apiMonsters.length; i++){
                allMonsters.push(state.apiMonsters[i]);
            }
            /*
            for(var i = 0; i < state.localMonsters.length; i++){
                allMonsters.push(state.localMonsters[i]);
            }
            
            for(var i = 0; i < state.availablePlayers.length; i++){
                allMonsters.push(state.availablePlayers[i]);
            }
            */
            return allMonsters;
        },
        monsterCount(state){
            return state.availableMonsters.length;
        },
        localMonsterCount(state){
            return state.localMonsters.length;
        },
        apiMonsterCount(state){
            return state.apiMonsters.length;
        },
        playerCount(state){
            return state.availablePlayers.length;
        }
    },
    actions: {
        getPlayersLocal(){
            var players = [];
            for(var key in localStorage){
                if (key.startsWith("player-")){
                    try {
                        var p = JSON.parse(localStorage.getItem(key));
                        p['type'] = 'local';
                        players.push(p);
                    } catch(err){

                    }
                    
                }
            }
            console.log("getPlayersLocal: found", players);
            this.availablePlayers = players;
            return players;
        },
        getMonstersLocal(){
            var monsters = [];
            for(var key in localStorage){
                if (key.startsWith("monster-")){
                    try {
                        var m = JSON.parse(localStorage.getItem(key));
                        m['type'] = 'local';
                        monsters.push(m);
                    } catch(err){

                    }
                    
                }
            }
            console.log("getMonstersLocal: found", monsters);
            this.localMonsters = monsters;
            return monsters;
        },
        getMonstersAPI(){
            var apiMonsters = [];
            axiosMonsterAPI.get()
            .then((data) => {
                console.log("store:getMonstersAPI", data.data.results.length);
                if (data.data.results){
                    apiMonsters = data.data.results;
                    for(var m = 0; m < apiMonsters.length; m++){
                        apiMonsters[m]['type'] = 'api';
                    }
                    this.apiMonsters = apiMonsters;
                } else {
                    this.apiMonsters = [];
                }
                return apiMonsters;
            });
        },
        deletePlayerLocal(playerName){
            if ( confirm("Are you sure you want to delete player " + playerName + "?") ){
                try {
                    localStorage.removeItem("player-" + playerName);
                    this.getPlayersLocal();
                } catch(err){
                    console.log("Player " + playerName + " was not found...");
                }
            }
        },
        deleteMonsterLocal(monsterName){
            if ( confirm("Are you sure you want to delete monster " + monsterName + "?") ){
                try {
                    localStorage.removeItem("monster-" + monsterName);
                    this.getMonstersLocal();
                } catch(err){
                    console.log("Monster " + monsterName + " was not found...");
                }
            }
        },
        deleteEntityLocal(entity){
            if (entity.player){
                this.deletePlayerLocal(entity.name);
            } else {
                this.deleteMonsterLocal(entity.name);
            }
        },
        savePlayerLocal(player){
            localStorage.setItem("player-" + player['name'], JSON.stringify(player));
            this.getPlayersLocal();
        },
        saveMonsterLocal(monster){
            localStorage.setItem("monster-" + monster['name'], JSON.stringify(monster));
            this.getMonstersLocal();
        },
        saveEntityLocal(entity){
            if (entity.player){
                this.savePlayerLocal(entity);
            } else {
                this.saveMonsterLocal(entity);
            }
        },
        deleteSession(sessionName){
            if ( confirm("Are you sure you want to delete session " + sessionName + "?") ){
                try {
                    localStorage.removeItem("session-" + sessionName);
                } catch(err){
                    console.log("Session " + monsterName + " was not found...");
                }
            }
        },
        getSessions(){
            var sessions = [];
            for(var key in localStorage){
                if (key.startsWith("session-")){
                    sessions.push(key);
                }
            }
            return sessions;
        },
        getSessionDetails(){
            var sessions = [];
            for(var key in localStorage){
                if (key.startsWith("session-")){
                    var sesh = JSON.parse(localStorage.getItem(key));
                    var mob_names = sesh.map(function(key){ return key.name });
                    var player_names = ["Gheldin", "Aldric", "Balfor"];
                    var hp = sesh.map(function(key){ return key.hp });
                    sessions.push({
                        'name': key.replace("session-", ""),
                        'mobs': mob_names,
                        'players': player_names
                    });
                }
            }
            return sessions;
        },
        loadSession(sessionName){
            var state = [];
            try {
                state = JSON.parse(localStorage.getItem("session-" + sessionName));
            } catch(err){
                console.log(err);
            }
            this.combatMobs = state;
            return state;
        },
        saveSession(sessionName, state){
            if (state){
                localStorage.setItem("session-" + sessionName, JSON.stringify(state));
            } else {
                localStorage.setItem("session-" + sessionName, JSON.stringify(this.combatMobs));
            }
            
        }
    }
});