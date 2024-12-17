<template>
  <ActivityEditor v-if="activity?.id" :id="activity.id" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ActivityEditor from 'src/components/ActivityEditor.vue'
import { Activity } from 'app/model'

const route = useRoute()
const router = useRouter()
const activityId = route.params.id
const parsedId = typeof activityId === 'string' ? parseInt(activityId) : NaN

const activity = ref<Activity | null>(null)
onMounted(() => {
  if (isNaN(parsedId)) {
    router.push({ name: '404' })
  } else {
    try {
      const fetchedActivity = Activity.get(parsedId)
      activity.value = fetchedActivity
    } catch (error) {
      console.log(error)
      router.push({ name: '404' })
    }
  }
})
</script>
