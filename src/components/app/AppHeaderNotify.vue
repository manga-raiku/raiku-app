<template>
  <q-btn v-if="authStore.session" round unelevated class="mr-2">
    <i-clarity-notification-solid
      v-if="showMenuNotify"
      width="24"
      height="24"
    />
    <i-clarity-notification-line v-else width="24" height="24" />

    <q-badge floating rounded transparent class="top-0" :label="0" />
  </q-btn>
</template>

<script lang="ts" setup>
const authStore = useAuthStore()

const showMenuNotify = ref(false)
</script>
