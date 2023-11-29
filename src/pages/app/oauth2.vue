<route lang="yaml">
name: oauth2
meta:
  hiddenHeader: true
  hiddenFooter: true
  hiddenDrawer: true
  hiddenDrawerScope: true
</route>

<script lang="ts" setup>
const auth = useAuthStore()

const isPopup = window.opener !== null

watch(
  () => auth.session,
  (session) => {
    if (session) {
      window.opener?.postMessage({
        type: "popup:oauth->authorized",
        refresh_token: session.refresh_token
      })
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="text-center px-6 pt-10 text-20px">
    <img
      src="~assets/app_icon.png"
      alt="app icon"
      width="60"
      height="60"
      class="rounded-xl bg-white mx-auto"
    />

    <template v-if="!isPopup">
      <div un-pt="2">{{ $t("msg-oauth2-tab") }}</div>

      <div un-flex un-justify-center un-mt="5">
        <q-btn
          rounded
          outline
          class="before:text-#fff before:text-opacity-20 px-4"
          color="sakura3"
          padding="8px 20px"
          no-caps
          to="/"
          :label="$t('trang-chinh')"
        />
      </div>
    </template>
    <template v-else>
      <div un-pt="3">{{ $t("dang-cap-phep-oauth-2") }}</div>

      <div un-flex un-justify-center>
        <q-spinner-dots color="sakura3" size="40px" />
      </div>
    </template>
  </div>
</template>
