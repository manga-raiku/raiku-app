<route lang="yaml">
meta:
  hiddenFooter: true
  auth: true
</route>

<template>
  <div>
    <q-header class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <Icon icon="fluent:chevron-left-24-filled" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Profile</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page padding>
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label>Avatar</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="flex items-center">
              <q-avatar v-if="authStore.profile?.avatar_url" size="25">
                <img :src="authStore.profile?.avatar_url" />
              </q-avatar>

              <Icon icon="fluent:chevron-right-20-regular" class="size-1.5em" />
            </div>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>Full name</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="flex items-center">
              <span class="text-gray-300">{{
                authStore.profile?.full_name
              }}</span>
              <Icon icon="fluent:chevron-right-20-regular" class="size-1.5em" />
            </div>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>Gender</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="flex items-center">
              <span class="text-gray-300">{{ authStore.profile?.gener }}</span>
              <Icon icon="fluent:chevron-right-20-regular" class="size-1.5em" />
            </div>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>Date of birth</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="flex items-center">
              <span class="text-gray-300">{{ authStore.profile?.birth }}</span>
              <Icon icon="fluent:chevron-right-20-regular" class="size-1.5em" />
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
        >Sign Out</q-btn
      >
    </q-page>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

async function signOut() {
  const { error } = await authStore.signOut()

  if (error) {
    $q.notify({
      position: "bottom-right",
      message:
        `Không thể đăng xuất (code: ${error.status})` +
        (import.meta.env.DEV ? `(${error.message})` : ""),
    })

    return
  }

  $q.notify({
    position: "bottom-right",
    message: "Đã đăng xuất",
  })
  router.back()
}
</script>
