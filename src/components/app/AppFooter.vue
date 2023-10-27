<template>
  <q-footer
    v-if="$q.screen.lt.md"
    :model-value="!route.meta.hiddenFooter"
    class="bg-dark-page"
  >
    <q-tabs
      indicator-color="transparent"
      active-color="white"
      class="bg-transparent text-grey-5 !shadow-2 text-[12px] tabs-main children:w-20% children:min-w-0"
      no-caps
    >
      <q-route-tab replace class="pt-1" to="/">
        <component
          :is="pathEqual(route.fullPath, '/') ? Icons.home[1] : Icons.home[0]"
          width="24"
          height="24"
          class="mb-1"
        />
        Trang chủ
      </q-route-tab>
      <q-route-tab
        replace
        class="pt-1"
        to="/search"
        :class="{
          'q-router-link--exact-active': route.name === 'search'
        }"
      >
        <component
          :is="route.name === 'search' ? Icons.search[1] : Icons.search[0]"
          width="24"
          height="24"
          class="mb-1"
        />
        Tìm kiếm
      </q-route-tab>
      <q-route-tab
        replace
        class="pt-1"
        to="/genre"
        :class="{
          'q-router-link--exact-active': route.name === 'genre'
        }"
      >
        <component
          :is="route.name === 'genre' ? Icons.box[1] : Icons.box[0]"
          width="24"
          height="24"
          class="mb-1"
        />
        Thể loại
      </q-route-tab>
      <q-route-tab
        replace
        class="pt-1"
        to="/library"
        :class="{
          'q-router-link--exact-active': route.path.startsWith('/library')
        }"
      >
        <component
          :is="
            route.path.startsWith('/library')
              ? Icons.library[1]
              : Icons.library[0]
          "
          width="24"
          height="24"
          class="mb-1"
        />
        Thư viện
      </q-route-tab>
      <q-route-tab
        replace
        class="pt-1"
        to="/app"
        :class="{
          'q-router-link--exact-active': route.path.startsWith('/app')
        }"
      >
        <component
          :is="route.path.startsWith('/app') ? Icons.user[1] : Icons.user[0]"
          width="24"
          height="24"
          class="mb-1"
        />
        Tôi
      </q-route-tab>
    </q-tabs>
  </q-footer>
</template>

<script lang="ts" setup>
import { Icons } from "src/constants"
import { pathEqual } from "src/logic/path-equal"

const route = useRoute()
</script>
