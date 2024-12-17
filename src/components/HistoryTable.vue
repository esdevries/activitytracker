<template>
  <q-table dense :rows="formattedHistory" :columns="columns" row-key="begin">
    <template v-slot:body-cell-begin="props">
      <q-td :props="props">
        {{ formatDate(props.row.begin) }}
      </q-td>
    </template>

    <template v-slot:body-cell-end="props">
      <q-td :props="props">
        {{ props.row.end ? formatDate(props.row.end) : '' }}
      </q-td>
    </template>

    <template v-slot:body-cell-duration="props">
      <q-td :props="props">
        {{
          props.row.end
            ? formatTime(props.row.duration)
            : formatTime(calculateDuration(props.row.begin, new Date().toISOString()))
        }}
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { HistoryEvent, TableColumn } from 'src/data'
import { calculateDuration, formatTime, formatDate } from 'src/data'

const props = defineProps({
  history: {
    type: Array as PropType<HistoryEvent[]>,
    required: true,
  },
})

const formattedHistory = ref<HistoryEvent[]>([])
const columns: TableColumn[] = [
  { name: 'begin', label: 'Start Time', align: 'left', field: 'begin', required: true },
  { name: 'end', label: 'End Time', align: 'left', field: 'end', required: true },
  { name: 'duration', label: 'Duration', align: 'center', field: 'duration', required: true },
]

watch(
  () => props.history,
  (newHistory) => {
    formattedHistory.value = newHistory
      .map((event) => ({
        ...event,
        duration: event.end
          ? calculateDuration(event.begin, event.end)
          : calculateDuration(event.begin, new Date().toISOString()),
      }))
      .sort((a, b) => new Date(b.begin).getTime() - new Date(a.begin).getTime())
  },
  { immediate: true },
)

onMounted(() => {
  setInterval(() => {
    formattedHistory.value = formattedHistory.value.map((event) => ({
      ...event,
      duration: event.end
        ? calculateDuration(event.begin, event.end)
        : calculateDuration(event.begin, new Date().toISOString()),
    }))
  }, 1000)
})
</script>
