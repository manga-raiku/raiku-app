<template>
  <q-header class="z-200 bg-dark-page">
    <q-toolbar class="relative">
      <q-btn flat dense round class="mr-2">
        <Icon icon="fluent:chevron-left-24-regular" width="25" height="25" />
      </q-btn>

      <q-space />

      <q-toolbar-title
        class="absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] text-[16px] max-w-[calc(100%-34px*2)] line-clamp-1"
      >
        The loai
      </q-toolbar-title>

      <q-btn flat dense round @click="showDialogSorter = true">
        <Icon icon="fluent:filter-24-regular" width="24" height="24" />
      </q-btn>
    </q-toolbar>

    <div class="row text-subtitle1 text-[16px] py-4">
      <div class="col-4 px-1">
        <div
          class="bg-dark-700 px-4 text-zinc-400 py-1 h-[45px] flex items-center justify-between"
          @click="showDialogGener = true"
        >
          {{ t("the-loai") }}
          <Icon icon="fluent:chevron-down-24-regular" />
        </div>
      </div>
      <div v-if="defaultsOptions.typer" class="col-4 px-1">
        <div
          class="bg-dark-700 px-4 text-zinc-400 py-1 h-[45px] flex items-center justify-between"
          @click="showDialogSeaser = true"
        >
          {{ t("mua") }}
          <Icon icon="fluent:chevron-down-24-regular" />
        </div>
      </div>
      <div v-else class="col-4 px-1">
        <div
          class="bg-dark-700 px-4 text-zinc-400 py-1 h-[45px] flex items-center justify-between"
          @click="showDialogTyper = true"
        >
          {{ t("loai") }}
          <Icon icon="fluent:chevron-down-24-regular" />
        </div>
      </div>
      <div class="col-4 px-1">
        <div
          class="bg-dark-700 px-4 text-zinc-400 py-1 h-[45px] flex items-center justify-between"
          @click="showDialogSorter = true"
        >
          {{ t("sap-xep") }}
          <Icon icon="fluent:chevron-down-24-regular" />
        </div>
      </div>
    </div>

    <div v-if="textFilter" class="text-center text-gray-500 mb-1">
      <!-- {{ t("da-chon-textfilter", [textFilter]) }} -->
    </div>
  </q-header>
</template>
