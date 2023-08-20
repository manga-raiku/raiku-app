<template>
  <div>
    <q-header class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <Icon icon="fluent:chevron-left-24-filled" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Thông báo</q-toolbar-title>
      </q-toolbar>
    </q-header>
<q-page>
  notification
</q-page>
  </div>
</template>


<script lang="ts" setup>
const router = useRouter()
</script>
