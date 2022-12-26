<template >
  <Splitter>
	  <SplitterPanel :size="20" style="padding:10px">
      <Toolbar class="mb-4">
                <template #start>
                  <Button type="button" v-if="expanded" icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                  <Button type="button" v-else icon="pi pi-plus" label="Expand All" @click="expandAll" />
                  
                </template>
        </Toolbar>
        <Tree :value="nodes" :filter="true" filterMode="lenient" selectionMode="single" :expandedKeys="expandedKeys" @nodeSelect="onNodeSelect" v-model:selectionKeys="selectedKey"/>
	  </SplitterPanel>
	  <SplitterPanel :size="80" style="padding:10px">
      <div class="wrapper" style="display:grid;">
        <Message severity="success" v-if="newrow">New row created</Message>
        <Message severity="success" v-if="delrow">Rows removed</Message>
        <Toolbar>
                <template #start>
                  <Button v-if="repo.active.value['--id']" icon="pi pi-times" class="p-button-rounded p-button-success" @click="onNodeClear" />
                  <ptj-primary-action v-if="has_primary && repo.active.value['--id']"  :model="store.model" :id="repo.active.value['--id']"/>
                  <ptj-edit-action v-if="repo.active.value['--id']"  :store="store" :data="repo.active.value" />
                  {{ label }}
                </template>

                <template #end>
                    <ptj-move-action :name="name + '_selected'" @onMove="reload" v-if="store.route.perms.includes('put')"/>
                    <ptj-create-action :name="name" @onSave="reload" v-if="store.route.perms.includes('post')"/> 
                    <ptj-delete-action :name="name + '_selected'" @onDel="onDel" v-if="store.route.perms.includes('delete')"/>
                </template>
          </Toolbar>
          <div style="overflow-x:scroll;">
            <ptj-table :name="name + '_selected'" :fields="fields" @reorder="reorderRows" />
          </div>
        </div>
    </SplitterPanel>
  </Splitter>
</template>

<script setup>
import Button from "primevue/button"
import Tree from 'primevue/tree'
import { computed, ref, inject } from "vue"
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import PtjTable from "../table/table.vue"
import Toolbar from 'primevue/Toolbar'
import { toTree, getForegroundCells, getLabel, saveOrder } from "../../js/helperfunctions.js" 
import PtjPrimaryAction from "../actions/primary-action.vue"
import Message from 'primevue/message';
import { createRepoStore, getStore, regStore } from "../../js/reactivestores.js"

import PtjMoveAction from "../actions/move-action.vue"
import PtjCreateAction from "../actions/create-action.vue"
import PtjDeleteAction from "../actions/delete-action.vue"
import PtjEditAction from "../actions/edit-action.vue"




const props = defineProps({
    name : {
      type : String,
      required : true
    }
});

const emits = defineEmits(["onMove"]);

const repo = getStore(props.name);
const store = repo.store;

const client = inject("client");


const has_primary = (store.route.children.length > 1) ? true : false;
const expanded = ref(false);
//const col_expandable = (Object.keys(store.route.schema).length > max_cols) ? true : false;
const delrow = ref(false);
const newrow = ref(false);
const childRepo = createRepoStore(store);
regStore(props.name + "_selected", childRepo);
childRepo.parent_id = repo.parent_id;
const selected = ref([]);


const nodes = computed(() => {
  const data= toTree(repo.data.value, store.route.schema);
  return data;
});


let fields = computed(() => {
    return getForegroundCells(store.route.schema);
});


function reorderRows(rows) {
  childRepo.data.value = rows;
  saveOrder(store.model, rows, client);
}

repo.load()
.then(response => {
  childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == 0);
});


repo.active.value['--recursive'] = 0;

const expandedKeys = ref({});
const selectedKey = ref();

const collapseAll = () => {
    expandedKeys.value = {};
    expanded.value = false;
};

const expandAll = () => {
    for (let node of nodes.value) {
        expandNode(node);
    }
    expandedKeys.value = {...expandedKeys.value};
    expanded.value = true;
};

const expandNode = (node) => {
    if (node.children && node.children.length) {
      expandedKeys.value[node.key] = true;
      for (let child of node.children) {
          expandNode(child);
      }
    }
};

function onDel() {
    repo.reload()
    .then(() => {
      childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == 0);
    });
    delrow.value = true;
}

const label = computed(() => {
  return getLabel(store.route.schema, repo.active.value);
})

const onNodeSelect = (node) => {
   repo.active.value = node.data;
   childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == node.key);
};

const onNodeClear = (node) => {
  repo.active.value = {};
  childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == 0);
}



function reload() {
  repo.selected.value = [];
  repo.reload()
  .then(() => {
    childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == 0);
  });
  newrow.value = true;
}

</script>
<style scoped>

.wrapper {
  display : grid;
  margin-left : 0;
  margin-right : 0;
  box-sizing : content-box;
}

</style>