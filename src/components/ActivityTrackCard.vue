<template>
  <q-card class="q-mx-md q-my-md flex row">
    <q-toolbar class="q-px-md">
      <q-toolbar-title class="q-mb-none text-accent text-italic text-bold">
        {{ activity.name }}
      </q-toolbar-title>
      <q-btn
        push
        elevated
        :color="activity.isTracked ? 'red' : 'green'"
        @click="toggleIsTracked"
        :label="activity.isTracked ? 'Untrack' : 'Track'"
      />
      <ToolTip
        anchor="bottom right"
        :message="`Click here to ${activity.isTracked ? 'Untrack' : 'Track'}!`"
        :offset="[-100, 0]"
      />
    </q-toolbar>
  </q-card>
</template>

<script setup lang="ts">
import { Activity } from 'app/model'
import ToolTip from './ToolTip.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const activity = Activity.get(props.id)
const toggleIsTracked = () => {
  activity.isTracked = !activity.isTracked

  if (activity.isTracked) {
    activity.history.push({ begin: new Date().toISOString() })
  } else {
    const lastTrackingRecord = activity.history[activity.history.length - 1]
    if (lastTrackingRecord && !lastTrackingRecord.end) {
      lastTrackingRecord.end = new Date().toISOString()
    }
  }
  router.push({ name: 'track' })
}
</script>
