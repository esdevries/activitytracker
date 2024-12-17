<template>
  <router-link 
    v-for="activity in sortedActivities" 
    :key="activity.id || Math.random()" 
    :to="`/activities/${activity.id}`"
    style="text-decoration: none;"
  >
    <q-card class="q-mx-md q-my-md">
      <ToolTip anchor="bottom middle" :message="`View ${activity.name}!`" />
      <q-toolbar class="q-px-md">
        <q-toolbar-title class="q-mb-none text-accent text-italic text-bold">
          {{ activity.name }}
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section class="text-subtitle3 q-pt-none text-black text-italic" style="overflow-wrap: break-word;">
        {{ activity.description }}
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Activity } from 'app/model';
import ToolTip from './ToolTip.vue';

const activities = ref<Activity[]>(Activity.all() || []);

const sortedActivities = computed(() => {
  return activities.value
    .filter(activity => activity.id !== undefined && activity.id !== null)
    .sort((a, b) => (a.id as number) - (b.id as number));
});
</script>
