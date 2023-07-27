<template>
  <section class="mx--2 overflow-hidden whitespace-nowrap">
    <q-skeleton
      v-for="index in 5"
      :key="index"
      type="QBtn"
      height="30px"
      class="display-inline-block mx-2 my-2 rounded-[30px]"
    />
  </section>

  <ul class="row mx--2">
    <li
      v-for="item in 30"
      :key="item"
      class="col-6 col-sm-4 col-md-3 px-2 py-2"
    >
      <div
        class="block bg-#f8f8f8 bg-opacity-7.5 hover:bg-opacity-12 transition-background-color duration-200 rounded-md py-7px px-4 relative cursor-pointer"
      >
        <q-skeleton type="text" class="text-16px" width="120px" />
        <q-skeleton type="text" width="60px" />
      </div>
    </li>
  </ul>
</template>
