<template>
  <q-avatar v-if="authStore.session || $q.screen.lt.md" class="wrap-avatar">
    <q-img
      v-if="authStore.session"
      :src="
        authStore.profile?.avatar_url ??
        `https://ui-avatars.com/api/?name=${authStore.profile?.full_name}`
      "
      no-spinner
    />
    <i-solar-user-circle-bold-duotone v-else class="size-2em" />
  </q-avatar>
  <i-solar-menu-dots-bold v-else class="size-2em rotate-90deg wrap-avatar" />
</template>

<script lang="ts" setup>
const authStore = useAuthStore()
</script>

<style lang="scss" scoped>
.wrap-avatar {
  @apply transition-width transition-height duration-222 animate-ease-[cubic-bezier(0.25,0.1,0.25,1)];
}
</style>
