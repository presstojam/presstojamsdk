<template>
    <PtjAccountHandler v-if="require_login" />
    <min-data v-else-if="integrity_check == false"/>
    <div v-else>
        <Nav :name="name" v-if="no_nav == false"/>
        <PtjRoutes />
        <PtjDialog />
    </div>
</template>
<script setup>

import { ref, inject } from 'vue';
import configs from "../js/configs.js"
import { loadSiteMap } from "../js/entity/entitymanager.js"
import PtjAccountHandler from "./account/account.vue"
import PtjRoutes from './routes.vue'
import Nav from "./nav/nav.vue"
import PtjDialog from "./effects/dialog.vue"
import MinData from "./dataintegrity/mindata.vue"
import { subscribe } from "./../js/bus/bus.js"


const _profile = configs.get("profile");

const name = ref("");


const client = inject("client");
const i18n = inject("i18n");
const router = inject("router");

const require_login = ref(false);
const integrity_check = ref(false);

const no_nav = configs.get("no_nav", false);


function loadRoutes() {
    const base = configs.get("base");

    return client.get("/user/site-map")
    .then(response => {
        return loadSiteMap(response);
    })
    .then(routes => {
        let def = false;

        for(const i in routes) {
            if (!def && !routes[i].parent) def = { path : base + "/" , name : 'home', redirect : base + "/data/" + i};
        }

        if (def) {
            router.addRoute(def);
        }
    })
    .then(() => {
       
    })
}


function loadDictionary() {
    return client.get("/user/dictionary")
    .then(response => {
        for(let i in response) {
            i18n.setLocaleMessage(i, response[i]);
        }
    });
}

function loadUser() {
    return client.get("/user/details")
    .then(response => {
        name.value = (response.name) ? response.name : response.email;
    });  
}




await client.get("/user/check-user")
.then(response => {
    if (response.name != _profile) {
        require_login.value = true;
        return loadDictionary();
    } else {
        let promises = [];
        promises.push(loadUser());
        promises.push(loadDictionary());
        promises.push(loadRoutes());
        return Promise.all(promises);
    }    
});


subscribe("integrity_min_data", "user", (model, check) => {
    if (!model) integrity_check.value = check;
});


</script>