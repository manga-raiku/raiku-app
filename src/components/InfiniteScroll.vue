<template>
  <q-infinite-scroll :offset="250">
    <slot />
    <template #loading>
      <div class="row justify-center q-my-md">
        <q-spinner-dots color="main-3" size="40px" />
      </div>
    </template>
  </q-infinite-scroll>
</template>
