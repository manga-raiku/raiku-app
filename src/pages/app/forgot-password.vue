<route lang="yaml">
meta:
  hiddenHeader: $lt.md
  hiddenFooter: true
  hiddenDrawer: true
  hiddenDrawerScope: true
  auth: guest
</route>

<template>
  <div>
    <q-header-custom v-if="$q.screen.lt.md" class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <i-fluent-chevron-left-24-filled class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>{{ $t("quen-mat-khau") }}</q-toolbar-title>
      </q-toolbar>
    </q-header-custom>

    <q-page padding>
      <q-card
        class="md:max-w-450px md:mx-auto bg-dark-page <md:transparent <md:shadow-none"
      >
        <q-card-section class="transparent relative">
          <img
            src="~assets/girl.png"
            class="absolute top--25% blur-20px <md:!hidden"
          />

          <div class="relative flex items-center justify-between <md:!hidden">
            <div class="text-20px mx-2">{{ $t("quen-mat-khau") }}</div>

            <div class="card-bg-cyan top--20%"></div>
            <div class="card-bg-blue top--20%"></div>
          </div>

          <div class="text-gray-400 text-13px text-center mb-5">
            {{
              step2
                ? $t("buoc-2-2-dat-mat-khau-moi")
                : $t("buoc-1-2-nhap-e-mail-cua-ban")
            }}
          </div>

          <q-form
            @submit.prevent="step2 ? updatePassword() : resetPassword()"
            ref="qFormRef"
          >
            <template v-if="!step2">
              <q-card-section>
                <p class="text-gray-400">
                  {{ $t("vui-long-nhap-dia-chi-email-tai-khoan-cua-ban") }}
                </p>
                <q-input
                  v-model="email"
                  :placeholder="$t('email')"
                  class="login-input"
                  color="sakura2"
                  dense
                  lazy-rules
                  :rules="[
                    (email) => email.length > 1 || $t('vui-long-nhap-e-mail'),
                    (email) =>
                      /^[\w\d\.]+@[\w\d]*\.[\w\d]{2,}$/i.test(email) ||
                      $t('vui-long-nhap-e-mail-hop-le')
                  ]"
                />
              </q-card-section>

              <q-card-section class="pt-0">
                <div class="flex items-center justify-center">
                  <q-btn
                    type="submit"
                    color="blue"
                    rounded
                    no-caps
                    :disable="!email"
                    class="w-full max-w-420px mx-auto text-weight-normal"
                    >{{ $t("gui-lien-ket-xac-minh") }}</q-btn
                  >
                </div>
              </q-card-section>
            </template>
            <template v-else>
              <q-card-section>
                <q-input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="$t('mat-khau')"
                  class="login-input mt-5"
                  color="sakura2"
                  dense
                  lazy-rules
                  :rules="[
                    (value) => value.length > 1 || $t('vui-long-nhap-mat-khau')
                  ]"
                >
                  <template #append>
                    <q-btn
                      round
                      unelevated
                      class="mr-1"
                      @click="showPassword = !showPassword"
                    >
                      <i-fluent-eye-24-regular
                        v-if="showPassword"
                        width="22"
                        height="22"
                      />
                      <i-fluent-eye-off-24-regular
                        v-else
                        width="22"
                        height="22"
                      />
                    </q-btn>
                  </template>
                </q-input>
              </q-card-section>

              <q-card-section class="pt-0">
                <div class="flex items-center justify-center">
                  <q-btn
                    type="submit"
                    color="blue"
                    rounded
                    no-caps
                    :disable="!password"
                    class="w-full max-w-420px mx-auto text-weight-normal"
                    >{{ $t("cap-nhat-mat-khau") }}</q-btn
                  >
                </div>
              </q-card-section>
            </template>
          </q-form>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script lang="ts" setup>
import { QForm } from "quasar"
// import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const i18n = useI18n()

const title = () => i18n.t("khoi-phuc-mat-khau")
useSeoMeta({
  title,
  description: title,
  ogTitle: title,
  ogDescription: title
})

const qFormRef = ref<QForm>()

const email = ref("")
const password = ref("")
const showPassword = ref(false)

const sendedEmail = ref(false)
const step2 = computed(() => "next" in route.query)

async function resetPassword() {
  const loader = $q.loading.show({
    spinnerColor: "main-3",
    spinnerSize: 40
  })

  const { error } = await authStore.resetPassword(email.value)

  loader()

  if (error) {
    $q.notify({
      position: "bottom",
      message:
        i18n.t("khoi-phuc-tai-khoan-that-bai") +
        (import.meta.env.DEV ? `(${error.message})` : "")
    })

    return
  }

  $q.notify({
    position: "bottom",
    message: i18n.t("da-gui-lien-ket-dat-lai-mat-khau-toi-email")
  })
  sendedEmail.value = true
}
async function updatePassword() {
  const loader = $q.loading.show({
    spinnerColor: "main-3",
    spinnerSize: 40
  })

  const { error } = await authStore.updatePassword(password.value)

  loader()

  if (error) {
    $q.notify({
      position: "bottom",
      message:
        i18n.t("khong-the-cap-nhat-mat-khau") +
        (import.meta.env.DEV ? `(${error.message})` : "")
    })

    return
  }

  $q.notify({
    position: "bottom",
    message: i18n.t("da-cap-nhat-mat-khau")
  })

  if (router.options.history.state.back === "/app/forgot-password") {
    if (history.length >= 2) router.go(-2)
    else void router.replace("/app")
  } else {
    if (history.length >= 1) router.go(-1)
    else void router.replace("/app")
  }
}
</script>

<style lang="scss" scoped>
.login-input :deep(.q-field__append) {
  height: 45px !important;
}

.card-bg-cyan {
  position: absolute;
  width: 6.458333rem;
  height: 6.458333rem;
  opacity: 0.4;
  filter: blur(2.708333rem);
  top: 0;
  right: 4.027778rem;
  background: linear-gradient(90deg, #00ffd9, #00d0ff);
}
.card-bg-blue {
  top: 1.111111rem;
  right: 0;
  width: 5.902778rem;
  background: linear-gradient(90deg, #536aff, #004eff);
  position: absolute;
  width: 6.458333rem;
  height: 6.458333rem;
  opacity: 0.4;
  filter: blur(2.708333rem);
  top: 0;
  right: 4.027778rem;
  background: linear-gradient(90deg, #00ffd9, #00d0ff);
}
</style>
