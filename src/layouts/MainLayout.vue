<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ currentPageTitle }}
        </q-toolbar-title>

        <div>
          <q-btn
            flat
            dense
            round
            :icon="soundOn ? 'volume_up' : 'volume_off'"
            aria-label="Toggle Sound"
            @click="toggleSound"
          />
          <ToolTip anchor="bottom left" message="Toggle audio" :offset="[10, 15]" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header class="text-h5 text-weight-bold">
          Activity Tracker
        </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { useRoute } from 'vue-router';
import EssentialLink from 'components/EssentialLink.vue';
import type { EssentialLinkProps } from 'src/data';
import ToolTip from 'src/components/ToolTip.vue';
import { Activity } from 'app/model';

const route = useRoute();

const currentPageTitle = computed(() => {
  const path = route.path;

  switch (true) {
    case path === '/track':
      return 'Time Tracking';
    case path === '/track/add':
      return 'Add other activity';
    case path === '/activities':
      return 'List of Activities';
    case /^\/activities\/\d+\/edit$/.test(path):
      return 'Edit Activity';
    case path.startsWith('/activities/'):
      return 'View Activity';
    default:
      return 'My App';
  }
});

const linksList = computed((): EssentialLinkProps[] => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const recentActivities = Activity.all().filter((activity) => {
    const mostRecentHistory = activity.history?.[activity.history.length - 1];

    if (mostRecentHistory) {
      const activityStart = new Date(mostRecentHistory.begin);
      return activityStart >= sevenDaysAgo;
    }

    return false;
  });

  return [
    {
      title: 'Time tracking',
      caption: `${recentActivities.length} recent activities`,
      icon: 'schedule',
      link: '/track',
    },
    {
      title: 'Activities',
      caption: `${Activity.all().length} activities`,
      icon: 'fas fa-running',
      link: '/activities',
    },
  ];
});

const leftDrawerOpen = ref(false);
const soundOn = ref(true);

provide('soundOn', soundOn);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleSound() {
  soundOn.value = !soundOn.value;
}
</script>
