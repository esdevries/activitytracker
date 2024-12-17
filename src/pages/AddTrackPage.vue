<template>
  <ActivityTrackCard v-for="activity in filteredActivities" :key="activity.id || Math.random()"
    :id="activity.id ?? -1" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ActivityTrackCard from 'src/components/ActivityTrackCard.vue';
import { Activity } from 'app/model';

const activities = ref<Activity[]>(Activity.all() || []);
const filteredActivities = computed(() => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return activities.value.filter(activity => {
    const mostRecentHistory = activity.history?.[activity.history.length - 1];

    if (mostRecentHistory) {
      const activityStart = new Date(mostRecentHistory.begin);
      return activityStart < sevenDaysAgo;
    }
    return true;
  });
});
</script>
