<route lang="yaml">
name: not_found
</route>

<template>
  <q-page>
    <div class="w-full h-full text-white text-center q-pa-md flex flex-center">
      <div>
        <img
          src="~assets/not_found.svg"
          alt="not_found"
          class="w-240px sm:w-400px max-w-100% mx-auto"
        />

        <div class="text-20px text-weight-normal q-my-sm">404</div>
        <div
          class="text-subtitle2 text-weight-normal leading-normal text-gray-200 q-my-sm"
        >
          Oops. Nothing here...
        </div>

        <q-btn
          rounded
          outline
          class="before:text-#fff before:text-opacity-20 px-4"
          color="sakura3"
          padding="8px 20px"
          no-caps
          to="/"
          label="Go Home"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>
