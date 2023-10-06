<route lang="yaml">
meta:
  hiddenHeader: $lt.md
  hiddenFooter: true
  hiddenDrawer: true
  hiddenDrawerScope: true
  auth: false
</route>

<template>
  <div>
    <q-header v-if="$q.screen.lt.md" class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <i-fluent-chevron-left-24-filled class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>{{ $t("dang-nhap") }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

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
            <div class="text-20px mx-2">{{ $t("dang-nhap") }}</div>

            <div class="card-bg-cyan top--20%"></div>
            <div class="card-bg-blue top--20%"></div>
          </div>

          <q-form @submit.prevent="login" ref="qFormRef">
            <q-card-section>
              <q-input
                v-model="email"
                :placeholder="$t('email')"
                class="login-input"
                color="main-2"
                dense
                lazy-rules
                :rules="[
                  (email) => email.length > 1 || $t('vui-long-nhap-e-mail'),
                  (email) =>
                    /^[\w\d\.]+@[\w\d]*\.[\w\d]{2,}$/i.test(email) ||
                    $t('vui-long-nhap-e-mail-hop-le')
                ]"
              />
              <q-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('mat-khau')"
                class="login-input mt-5"
                color="main-2"
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
              <div class="text-right pt-4">
                <router-link
                  to="/app/forgot-password"
                  class="text-gray-300 text-12px"
                  >{{ $t("quen-mat-khau-ques") }}</router-link
                >
              </div>
            </q-card-section>

            <q-card-section class="pt-0">
              <div class="flex items-center justify-center">
                <q-btn
                  type="submit"
                  color="blue"
                  rounded
                  no-caps
                  :disable="!email || !password || !accept"
                  class="w-full max-w-420px mx-auto text-weight-normal"
                  >{{ $t("dang-nhap") }}</q-btn
                >
              </div>

              <small class="display-block mt-3 text-gray-400 text-12px">
                <q-checkbox
                  v-model="accept"
                  required
                  size="2.2em"
                  color="main-3"
                  dense
                  class="mr-1"
                />
                {{ $t("toi-it-nhat-13-tuoi-toi-da-doc-va-dong-y-voi") }}
                <a
                  href="https://manga-raiku.github.io/tems-of-use"
                  target="_blank"
                  class="text-white"
                  >{{ $t("dieu-khoan") }}</a
                >
                {{ $t("va") }}
                <a
                  href="https://manga-raiku.github.io/privacy-police"
                  target="_blank"
                  class="text-white"
                  >{{ $t("chinh-sach-bao-mat") }}</a
                >
              </small>
            </q-card-section>

            <q-card-section class="mt-4">
              <div class="or mb-2">
                <span class="px-4 text-gray-300 bg-dark-page">{{
                  $t("hoac")
                }}</span>
              </div>

              <q-btn
                outline
                rounded
                no-caps
                class="w-full text-#fff text-opacity-20 py-2 mt-2"
                @click="authStore.signInOAuth2('twitter')"
              >
                <div class="w-full flex flex-items pl-8 pr-28%">
                  <i-logos-twitter class="size-1.5em mr-10" />
                  <div
                    class="text-weight-normal text-white text-center min-w-0 w-full flex-1"
                  >
                    {{ $t("tiep-tuc-voi-twitter") }}
                  </div>
                </div>
              </q-btn>
              <q-btn
                outline
                rounded
                no-caps
                class="w-full text-#fff text-opacity-20 py-2 mt-2"
                @click="authStore.signInOAuth2('google')"
              >
                <div class="w-full flex flex-items pl-8 pr-28%">
                  <i-logos-google-icon class="size-1.5em mr-10" />
                  <div
                    class="text-weight-normal text-white text-center min-w-0 w-full flex-1"
                  >
                    {{ $t("tiep-tuc-voi-google") }}
                  </div>
                </div>
              </q-btn>
              <q-btn
                outline
                rounded
                no-caps
                class="w-full text-#fff text-opacity-20 py-2 mt-2"
                to="/app/sign-up"
              >
                <div class="w-full flex flex-items pl-8 pr-28%">
                  <i-fluent-mail-24-filled
                    color="white"
                    class="size-1.5em mr-10"
                  />
                  <div
                    class="text-weight-normal text-white text-center min-w-0 w-full flex-1"
                  >
                    {{ $t("dang-ky-voi-e-mail") }}
                  </div>
                </div>
              </q-btn>
            </q-card-section>
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

const title = () => i18n.t("dang-nhap")
const description = () => i18n.t("dang-nhap-de-su-dung-cac-chuc-nang-nang-cao")
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const qFormRef = ref<QForm>()

const email = ref("")
const password = ref("")

const accept = ref(false)
const showPassword = ref(false)

async function login() {
  const loader = $q.loading.show({
    spinnerColor: "main-3",
    spinnerSize: 40
  })

  const { data, error } = await authStore.signIn(email.value, password.value)

  loader()

  if (error) {
    $q.notify({
      message:
        i18n.t("dang-nhap-that-bai-code-status", [error.status]) +
        (import.meta.env.DEV ? `(${error.message})` : "")
    })

    return
  }

  $q.notify({
    message: i18n.t("da-dang-nhap-voi-tu-cach-_user", [
      data.user.user_metadata.name ?? data.user.email
    ])
  })
  router.push((route.query.redirectTo ?? "/") + "")
}
</script>

<style lang="scss" scoped>
.login-input :deep(.q-field__append) {
  height: 45px !important;
}

.or {
  @apply relative text-center;

  &:before {
    content: "";
    @apply w-full h-1px absolute top-1/2 left-0 translate-y--1/2;
    background-color: rgba($color: #fff, $alpha: 0.1);
  }

  span {
    @apply relative;
    z-index: 2;
  }
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
