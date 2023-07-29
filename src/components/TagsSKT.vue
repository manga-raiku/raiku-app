<template>
  <div class="flex items-center">
    <q-skeleton type="circle" size="1.2em" class="mr-1" />

    <q-skeleton
      v-for="_ in 5"
      :key="_"
      type="QBtn"
      class="min-h-0 px-2 mx-2 my-1 h-20px bg-light-100 bg-opacity-10 text-13px my-1 <sm:mx-1 rounded-[30px]"
    />
  </div>
</template>
