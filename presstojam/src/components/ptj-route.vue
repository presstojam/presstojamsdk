<template>
    <ptj-slug-trail />
    <Suspense>
        <template #default>
            <div :class="[Map.model, Map.state]">
            <h1>{{ RouteStore.title }}</h1>
            <component v-if="component" :is="component" />
            </div>
        </template>
        <template #fallback>
            <div>Loading ...</div>
        </template>
    </Suspense>
</template>
<script setup>

import { computed, onMounted } from "vue"
import PtjSlugTrail from "./ptj-slug-trail.vue"
import { RouteStore, loadRoute, loadSlugTrail } from "../js/route.js"
import PtjRepo from "./ptj-repo.vue"
import PtjPrimary from "./ptj-primary.vue"
import PtjAccountHandler from "./ptj-account-handler.vue"
import { Map } from "../js/map.js"


const component = computed(() => {
    if (!RouteStore.component) return null;
    else if (RouteStore.component == "ptj-primary") return PtjPrimary;
    else if (RouteStore.component == "ptj-repo") return PtjRepo;
    else if (RouteStore.component == "ptj-account-handler") return PtjAccountHandler;
});




onMounted(() => {
    loadSlugTrail();
    return loadRoute();
});

</script>