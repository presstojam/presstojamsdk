<template>
    <Panel header="Routes">
        <Accordion>
            <AccordionTab v-for="(route, uri) in routes" :header="uri">
                <sitemap-node :route="route" />
            </AccordionTab>
        </Accordion>
    </Panel>
 </template>
<script setup>
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Panel from 'primevue/panel';

import SitemapNode from "./sitemap-node.vue"
import { getEntities } from "../../js/entity/entitymanager.js"

const routes = getEntities();

</script>