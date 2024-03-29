<template>
    <Breadcrumb :model="crumbs">
        <template #item="{item}">
            <ptj-crumb :item="item" />
        </template>
    </Breadcrumb>
</template>
<script setup>
import { computed, inject } from "vue";
import { rowToTree } from "../../js/helperfunctions.js"
import { getEntity, hasEntity } from "../../js/entity/entitymanager.js"

import Breadcrumb from "primevue/breadcrumb"
import PtjCrumb from "./crumb.vue"


const Client = inject("client");
const i18n = inject("i18n");

const t = i18n.t;


const props = defineProps({
    name : String,
    parent_id : Number,
    store : {
        type : Object,
        required : true
    }
});



let parent_id;

let entity = getEntity(props.store.model.name);
let structure = [];
let parent = entity.parent;

//if no get permissions, then no slug trail
if (hasEntity(parent) && getEntity(parent).perms.includes("get")) {

    if (props.store.type == "active") {
        structure.push(entity);
    }

    while(entity.parent) {
        const iparent = getEntity(entity.parent);
        if (iparent && iparent.perms.includes("get")) {
            structure.push(iparent);
            entity = iparent;
        } else {
            break;
        }
    }
    structure = structure.reverse();
} else {
    parent = null;
}

async function getData() {
    if (parent) {
      if (props.store.type == "active") {
        const data = await 
        props.store.load()
        .then(response => {
            parent_id = response["--parent"];
            return Client.get("/data/" + parent + "/active?__to=*&--id=" + response['--parent'])
        }).then(response => {
            return rowToTree(response, parent)
        });
        return data;
      } else {
        const data = await Client.get("/data/" + parent + "/active?__to=*&--id=" + props.store.parent_id)
        .then(response => {
            return rowToTree(response, parent)
        });
        return data;
      }
    } else {
        return {};
    }
}

const trail = await getData();

function trailRouteInfo(trail, route) {
    let info = [];
    let summary = [];
    for(let i in trail[route.name]) {
        if (route.cells[i].background) continue;
        if (route.cells[i].summary) summary.push(trail[route.name][i]);
        info.push({label : t("models." + route.name + ".fields." + i + ".label"), value : trail[route.name][i]});
    }
    
    const label = (summary.length > 0) ? summary.join(" ") : route.name + " - " + trail[route.name]["--id"];
    return {
        label,
        info
    }
}

let crumbs = computed(() => {
    let arr = [];
    for(const entity of structure) {
        //add an entity store route
        //need to get the parent id

        const obj = { label : entity.name, to : { name : "repo", params : { model : entity.name } } };
        
        if (entity.parent) {
            if (trail[entity.name]) obj.to.params.id = trail[entity.name]["--parent"]
            else obj.to.params.id = parent_id;
        }
         
        arr.push(obj);
        
        //set the active route
        if (trail[entity.name]) {
            const { label, info } = trailRouteInfo(trail, entity);
            const obj = {
                label : label,
                to : { name : "primary", params : { model : entity.name, id : trail[entity.name]["--id"]} }
            }
            if (info.length > 0) obj.info = info;
            
            arr.push(obj);
        }
    }
    return arr;
});

</script>
<style scoped>
    .p-breadcrumb {
    background: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    padding: 1rem;
}
</style>