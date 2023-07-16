<template>
  <div class="flex flex-nowrap">
    <div>
      <q-skeleton type="QAvatar" size="40px" />
    </div>
    <div>
      <div class="ml-3 min-w-0 bg-[rgba(50,50,50,0.5)] py-1 px-3 rounded-xl">
        <q-skeleton type="text" class="text-17px" width="240px" />
        <q-skeleton type="text" width="70px" />

        <q-skeleton type="text" class="mt-2 font-12px" height="16px" />
        <q-skeleton type="text" class="font-12px" height="16px" width="120px" />
      </div>

      <div
        class="text-gray-300 text-weight-medium px-5 mt-1 text-13px flex items-center"
      >
        <span class="flex items-center mr-4 cursor-pointer">
          <q-skeleton type="text" width="30px" />
        </span>

        <span class="flex items-center mr-4 cursor-pointer">
          <q-skeleton type="text" width="70px" />
        </span>

        <q-skeleton type="text" width="120px" />
      </div>
    </div>
  </div>
</template>
