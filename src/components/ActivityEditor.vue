<template>
  <div v-if="activity" class="q-pa-md">
    <q-input
      v-model="activity.name"
      label="Name"
      color="accent"
      outlined
      stack-label
      class="q-mb-sm"
    />
    <q-input
      label="Description"
      v-model="activity.description"
      color="accent"
      filled
      type="textarea"
    />
    <q-btn
      label="Delete"
      color="negative"
      icon="delete"
      @click="deleteActivity"
      class="q-mt-md full-width"
    />
  </div>

  <div v-if="deletedActivity">
    <NotifyUndo v-model="deletedActivity" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'
import { Activity } from 'app/model'
import NotifyUndo from './NotifyUndo.vue'

const props = defineProps<{
  id: number
}>()

const router = useRouter()
const activity = ref<Activity | null>(null)
const deletedActivity = ref<Activity | null>(null)

onMounted(() => {
  activity.value = Activity.get(props.id)
})

const deleteActivity = () => {
  if (activity.value) {
    activity.value.delete()
    deletedActivity.value = activity.value
    router.push({ name: 'activities' })
  }
}
</script>
