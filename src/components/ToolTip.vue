<template>
  <q-tooltip :anchor="anchor" class="bg-primary" :offset="offset" @show="handleShow">
    {{ message }}
  </q-tooltip>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import type { QTooltipProps } from 'quasar';

const soundOn = inject('soundOn', ref(true));

const props = defineProps<{
  message: string;
  color?: string;
  anchor: QTooltipProps['anchor'];
  offset?: [number, number];
}>();

function handleShow() {
  if (soundOn.value) { 
    TextToSpeech.speak({
      text: props.message,
      lang: 'en',
    })
      .then(() => {
        console.log('Tooltip message read aloud');
      })
      .catch((error) => {
        console.error('Error reading tooltip message:', error);
      });
  }
}

watch(() => soundOn.value, (newValue) => {
  console.log('Sound is', newValue ? 'on' : 'off');
});
</script>
