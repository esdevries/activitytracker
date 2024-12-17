<template>
  <div class="text-h5 q-mx-md q-pt-md">
    <strong>Recent Activities</strong>
  </div>

  <ActivityTrackCard v-for="activity in filteredActivities" :key="activity.id || Math.random()"
    :id="activity.id ?? -1" />

  <q-page-sticky position="bottom-right" :offset="[9, 18]">
    <q-btn fab icon="add" color="accent" :to="'/track/add'" />
    <ToolTip anchor="top left" message="Add other activity" :offset="[20, 30]" />
  </q-page-sticky>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ToolTip from 'src/components/ToolTip.vue';
import ActivityTrackCard from 'src/components/ActivityTrackCard.vue';
import { Activity } from 'app/model';

const activities = ref<Activity[]>(Activity.all() || []);

const filteredActivities = computed(() => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  return activities.value.filter((activity) => {
    const mostRecentHistory = activity.history?.[activity.history.length - 1];

    if (mostRecentHistory) {
      const activityStart = new Date(mostRecentHistory.begin);
      return activityStart >= sevenDaysAgo;
    }

    return false;
  });
});
</script>
