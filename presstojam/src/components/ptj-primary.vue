<template>
    <a v-if="RouteStore.route.perms.includes('put')" @click="toggleState" class="ptj-edit-toggle">{{ next_state }}</a>
    <ptj-modal v-if="RouteStore.route.perms.includes('delete')" cls="ptj-del-modal">
        <template #button>
            {{ getDictionary('ptj-primary-delete') }}
        </template>
        <template #default="delScope">
            <ptj-delete :parentid="store.data.parent" @close="delScope.toggleShow" />
        </template>
    </ptj-modal>
    <div class="ptj-primary" :class="Map.model" v-if="store.fstate == 0">
        <ptj-form-row v-for="field in store.data.cells" :key="field.name" :field="field"> 
          <ptj-asset v-if="field.type=='asset'" :field="field" :id="store.data.primary" />
          <ptj-number v-else-if="field.type=='number'" :field="field" />
          <ptj-flag v-else-if="field.type=='flag'" :field="field" :id="store.data.primary" />
          <ptj-id v-else-if="field.type=='id'" :field="field" :parent="store.data.parent" />
          <ptj-time v-else-if="field.type=='time'" :field="field" />
          <ptj-string v-else-if="field.type=='string'" :field="field"  />
        </ptj-form-row>
        <input v-if="store.type =='edit'" type="submit" :value="getDictionary('ptj-primary-put-btn')" class="ptj-form-submit" @click="submit">
    </div>
    <div class="ptj-children">
        <ptj-button v-for="action in RouteStore.route.children" :key="action" :route="{ model : action, state : 'parent', key : Map.key}">
            {{ action }}
        </ptj-button>
    </div>
</template>

<script setup>
import client from "./../js/client.js"
import PtjNumber from "./ptj-number.vue"
import PtjAsset from "./ptj-asset.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjId from "./ptj-id.vue"
import PtjTime from "./ptj-time.vue"
import PtjString from "./ptj-string.vue"
import { DataRow } from "./../js/datarow.js"
import { reactive, ref, computed, onMounted, onBeforeUnmount } from "vue"
import PtjDelete from "./ptj-delete.vue"
import PtjModal from "./ptj-modal.vue"
import PtjForm from "./ptj-create-form.vue"
import PtjButton from "./ptj-button.vue"
import PtjFormRow from "./ptj-form-row.vue"
import { MetaRow } from "./../js/metarow.js"
import {RouteStore, getModelSettings } from "./../js/route.js"
import { Map } from "./../js/map.js"
import { getDictionary } from "./../js/dictionary.js"
  


const store = reactive({ data : new DataRow(), fstate : -1,  type : 'view', show_def : false, progress : { total : 0, progress : 0} });

function toggleState() {
    store.type = (store.type == "view") ? "edit" : "view";
    store.data.setMode(store.type);
    store.fstate = 0;
}

let next_state = computed(() => {
    return (store.type == "edit") ? "view" : "edit";
});



function buildParams(meta_settings) {
    let params = {};
    if (Map.to) params.__to = Map.to;
    if (Map.key) {
        if (Map.key == "first") params.__limit = 1;
        else params["--id"] = Map.key;
    }
    if (meta_settings.fields) params.__fields = meta_settings.fields;
    return params;
}


function reset() {
    store.data = new DataRow();
    store.fstate = 0;
    store.type = "view";
    store.show_def = false;
    store.progress = { total : 0, progress : 0};
}

const load = async() => {
    let meta_settings = getModelSettings();
    let params = buildParams(meta_settings);
   
    return client.get("/meta/" + Map.model + "/primary", params)
    .then(response => {
        const meta = new MetaRow();
        meta.map(response.fields, meta_settings.fields ?? []);
        store.data.applyMetaRow(meta);
    }).then(() => {
        return client.get("/data/" +  Map.model + "/primary", params);
    }).then(response => {
        store.data.row = response;
        //set the change values as well for each row
        for(let i in store.data.cells) {
            store.data.cells[i].change = store.data.cells[i].val;
        }
        store.fstate = 0;
    }).catch(e => console.log(e));

}


function submit() {

    store.fstate = (store.progress.total > 0) ? 1 : 2;
    store.data.clearErrors();
    let key = 0;
    let ndata = store.data.serialize(true);
    if (Object.keys(ndata).length == 0) {
        toggleState();
        return;
    }
    ndata["--id"] = Map.key;
    return client.put("/data/" + Map.model, ndata)
    .then(response=>{
        let promises = [];
        let assets = store.data.getCellByType("asset");
        store.progress.total = 0;
        for(let i in assets) {
            const val = assets[i].val;
            if (!val) continue;
            ++store.progress.total;
            const asset = new Asset();
            asset.url = "/asset/" + Map.model + "/" + i + "/" + response["--id"];
            let promise = asset.saveFile(assets[i].val)
            .then(() => {
                ++store.progress.progress;
            });
            promises.push(promise);
        }
        return Promise.all(promises);
    })
    .then(() => {
        for(let i in store.data.cells) {
            store.data.cells[i].val = store.data.cells[i].change;
        }
    })
    .then(() => {
        toggleState();
    })
    .catch(err => {
            //show error fields, mark fields as invalidate
        store.fstate = 0;
        if (typeof err == "string") {
            globalerror = err;
        } else {
            return err.json()
            .then(response => {
                const msg = response.exception[0];
                if (msg.type == "PressToJamCore\\Exceptions\\ValidationException") {
                    store.data.setErrors(JSON.parse(msg.message));
                }
            });
        }
    });
}

onMounted(async () => {
 await load();
});

onBeforeUnmount(() => {
    reset();
});

</script>