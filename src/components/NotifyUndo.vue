<template>
  <div></div>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { Activity } from 'app/model';
import { defineProps, defineEmits, onMounted } from 'vue';

const props = defineProps<{
  modelValue: Activity | null;
}>();

const emit = defineEmits(['update:modelValue']);
const undoDelete = () => {
  if (props.modelValue) {
    Notify.create({
      message: 'Activity restored!',
      color: 'green',
      timeout: 2000,
      position: 'bottom',
    });

    Activity.create({
      id: props.modelValue.id,
      name: props.modelValue.name || '',
      description: props.modelValue.description || '',
      isTracked: props.modelValue.isTracked || false,
      history: props.modelValue.history || [],
    });

    emit('update:modelValue', null);
  }
};

onMounted(() => {
  Notify.create({
    message: 'Activity deleted!',
    color: 'negative',
    position: 'bottom',
    timeout: 6000,
    actions: [
      {
        label: 'Undo',
        color: 'white',
        handler: undoDelete,
      },
    ],
  });
});
</script>
