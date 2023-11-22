<template>
  <q-infinite-scroll :offset="250">
    <slot />
    <template #loading>
      <div class="col-12 justify-center flex q-my-md">
        <q-spinner-dots color="sakura3" size="40px" />
      </div>
    </template>
  </q-infinite-scroll>
</template>
