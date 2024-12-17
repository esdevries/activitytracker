<template>
  <q-page padding>
    <div v-if="activity" class="q-mb-md q-py-md q-px-md">
      <div class="text-h4 text-center q-mb-md">
        <strong>{{ activity.name }}</strong>
      </div>
      <div class="text-body1" style="overflow-wrap: break-word">
        <p class="q-mb-xs">{{ activity.description }}</p>
        <q-btn
          dense
          icon="volume_up"
          color="accent"
          @click="readDescription"
          class="text-caption q-mt-none q-mb-md"
        />
        <ToolTip anchor="bottom left" message="Read out loud" :offset="[-15, -10]" />
      </div>

      <div class="q-mb-md text-h6">Total time tracked: {{ formatTime(totalTrackedTime) }}</div>

      <HistoryTable :history="formattedHistory" />
    </div>
  </q-page>

  <q-page-sticky position="bottom-right" :offset="[9, 18]">
    <q-btn fab icon="edit" color="accent" @click="editActivity" />
    <ToolTip anchor="top left" message="Edit activity" :offset="[20, 30]" />
  </q-page-sticky>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Activity } from 'app/model'
import HistoryTable from 'src/components/HistoryTable.vue'
import ToolTip from 'src/components/ToolTip.vue'
import { calculateDuration, formatTime } from 'src/data'
import { TextToSpeech } from '@capacitor-community/text-to-speech'

const route = useRoute()
const router = useRouter()
const activityId = route.params.id
const parsedId = typeof activityId === 'string' ? parseInt(activityId) : NaN
const activity = ref<Activity | null>(null)

const totalTrackedTime = ref(0)

const formattedHistory = computed(() => {
  if (!activity.value || !activity.value.history) return []

  return activity.value.history
    .map((event) => ({
      ...event,
      duration: event.end ? calculateDuration(event.begin, event.end) : 0,
    }))
    .sort((a, b) => new Date(b.begin).getTime() - new Date(a.begin).getTime())
})

function updateTotalTrackedTime() {
  if (activity.value && activity.value.history && activity.value.history.length > 0) {
    totalTrackedTime.value = activity.value.history.reduce((total, event) => {
      const eventDuration = event.end
        ? calculateDuration(event.begin, event.end)
        : calculateDuration(event.begin, new Date().toISOString())

      return total + eventDuration
    }, 0)
  }
}

onMounted(() => {
  if (isNaN(parsedId)) {
    router.push({ name: '404' })
  } else {
    try {
      const fetchedActivity = Activity.get(parsedId)
      activity.value = fetchedActivity
      updateTotalTrackedTime()
      setInterval(updateTotalTrackedTime, 1000)
    } catch (error) {
      console.log(error)
      router.push({ name: '404' })
    }
  }
})

function readDescription() {
  if (activity.value?.description) {
    TextToSpeech.speak({
      text: activity.value.description,
      lang: 'en',
    })
      .then(() => {
        console.log('Description read successfully')
      })
      .catch((error) => {
        console.error('Error reading description:', error)
      })
  }
}

function editActivity() {
  router.push({ name: 'edit' })
}
</script>
