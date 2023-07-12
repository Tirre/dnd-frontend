import axios from 'axios';

var dndAPIUrl = "https://www.dnd5eapi.co/api/";

var apiAxios = axios.create({
    baseURL: dndAPIUrl
});

export default {
    install: (app) => {
        app.config.globalProperties.$monstersAPI = axios.create({
            baseURL: dndAPIUrl + "monsters/",
        });
        app.config.globalProperties.$spellsAPI = axios.create({
            baseURL: dndAPIUrl + "spells/",
        });
        app.config.globalProperties.$conditionsAPI = axios.create({
            baseURL: dndAPIUrl + "conditions/",
        });

        app.config.globalProperties.$axios = axios.create({});
        app.config.globalProperties.$dnd = axios.create({
            baseURL: dndAPIUrl
        });
    }
}