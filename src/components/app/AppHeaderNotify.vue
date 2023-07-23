<template>
  <q-btn v-if="authStore.isLogged" round unelevated class="mr-2">
    <Icon
      :icon="
        showMenuNotify
          ? 'clarity:notification-solid'
          : 'clarity:notification-line'
      "
      width="24"
      height="24"
    />

    <q-badge floating rounded transparent class="top-0" :label="0" />
  </q-btn>
</template>

<script lang="ts" setup>
const authStore = useAuthStore()

const showMenuNotify = ref(false)
</script>
