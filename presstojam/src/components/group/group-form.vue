<template>
     <Fieldset :toggleable="true" :collapsed="true">
        <template #legend>
            <i class="pi pi-filter"></i> Groups
        </template>
        <span v-for="cell in cells">
            <label>{{ cell.name }}</label>
            <Checkbox name="group" v-model="groups" :value="cell.name" />
        </span>
        <p style="text-align:right">
        <Button :label="$t('btns.filter')" @click="update"/>
        </p>

    </Fieldset>


</template>
<script setup>
import Fieldset from 'primevue/fieldset';
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import { computed, ref } from "vue"
import { trigger } from "./../../js/bus/bus.js"
import { ReferenceTypes } from "./../../js/entity/id.js"

const props = defineProps({
    repo : Object,
    name : String
});

const groups = ref(props.repo.groups);
const fields = props.repo.model.fields;

const cells = computed(() => {
    const group_cells = [];
    for(let i in fields) {
        const field = fields[i];
        if (field.type == "id") {
            if (field.reference_type == ReferenceTypes.REFERENCE) group_cells.push(field);
        } else if (field.type == "flag" || (field.type == "string" && field.isEnum())) {
            group_cells.push(field);
        }
    }
    return group_cells;
});


function update() {
    props.repo.groups = groups.value;
    props.repo.reload();
    trigger("group_form", props.name, groups.value);
} 
</script>