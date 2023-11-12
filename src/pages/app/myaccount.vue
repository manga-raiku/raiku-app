<route lang="yaml">
meta:
  hiddenHeader: $lt.md
  hiddenFooter: true
  hiddenDrawer: true
  auth: true
</route>

<template>
  <div>
    <q-header-custom v-if="$q.screen.lt.md" class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <i-fluent-chevron-left-24-filled class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>{{ $t("toi") }}</q-toolbar-title>
      </q-toolbar>
    </q-header-custom>

    <q-page padding>
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label>{{ $t("anh-dai-dien") }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="flex items-center">
              <q-avatar size="25">
                <img
                  :src="
                    authStore.profile?.avatar_url ??
                    `https://ui-avatars.com/api/?name=${authStore.profile?.full_name}`
                  "
                />
              </q-avatar>

              <i-fluent-chevron-right-20-regular class="size-1.5em" />
            </div>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>{{ $t("ho-va-ten") }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="flex items-center">
              <span class="text-gray-300">{{
                authStore.profile?.full_name
              }}</span>
              <i-fluent-chevron-right-20-regular class="size-1.5em" />
            </div>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>{{ $t("gioi-tinh") }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="flex items-center">
              <span class="text-gray-300">{{
                authStore.profile?.genre === true
                  ? $t("trai")
                  : authStore.profile?.genre === false
                  ? $t("gai")
                  : ""
              }}</span>
              <i-fluent-chevron-right-20-regular class="size-1.5em" />
            </div>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>{{ $t("ngay-sinh") }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="flex items-center">
              <span class="text-gray-300">{{
                authStore.profile?.birthday
              }}</span>
              <i-fluent-chevron-right-20-regular class="size-1.5em" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <q-btn
        dense
        rounded
        outline
        no-caps
        class="text-red-400 w-full mt-8"
        @click="signOut"
        >{{ $t("dang-xuat") }}</q-btn
      >
    </q-page>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()
const i18n = useI18n()

const title = () => i18n.t("tai-khoan-cua-toi")
useSeoMeta({
  title,
  description: title,
  ogTitle: title,
  ogDescription: title
})

async function signOut() {
  const { error } = await authStore.signOut()

  if (error) {
    $q.notify({
      position: "bottom",
      message:
        i18n.t("khong-the-dang-xuat-code-status", [error.status]) +
        (import.meta.env.DEV ? `(${error.message})` : "")
    })

    return
  }

  $q.notify({
    position: "bottom",
    message: i18n.t("da-dang-xuat")
  })
  router.back()
}
</script>
