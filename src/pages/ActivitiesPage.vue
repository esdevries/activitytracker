<template>
  <ActivityList />

  <q-page-sticky position="bottom-right" :offset="[9, 18]">
    <q-btn fab icon="add" color="accent" @click="addActivity" />
    <ToolTip anchor="top left" message="Add new Activity" :offset="[20, 30]" />
  </q-page-sticky>
</template>

<script setup lang="ts">
import ActivityList from 'src/components/ActivityList.vue';
import { useRouter } from 'vue-router';
import { Activity } from 'app/model';
import ToolTip from 'src/components/ToolTip.vue';

const router = useRouter();

function addActivity() {
  const activity = Activity.create({
    name: 'New Activity',
    description: 'Time to edit your brand new activity.'
  })

  router.push({ name: 'edit', params: { id: activity.id } });
}
</script>