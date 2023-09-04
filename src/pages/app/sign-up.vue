<route lang="yaml">
meta:
  hiddenHeader: $lt.md
  hiddenFooter: true
  hiddenDrawer: true
  auth: false
</route>

<template>
  <div>
    <q-header v-if="$q.screen.lt.md" class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <Icon icon="fluent:chevron-left-24-filled" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Đăng ký</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page padding>
      <q-card class="md:max-w-450px md:mx-auto bg-dark-page <md:transparent">
        <q-card-section class="transparent relative">
          <img
            src="~assets/girl.png"
            class="absolute top--25% blur-20px <md:display-none"
          />

          <div
            class="relative flex items-center justify-between <md:display-none"
          >
            <div class="text-20px mx-2">Đăng ký</div>

            <div class="card-bg-cyan top--20%"></div>
            <div class="card-bg-blue top--20%"></div>
          </div>

          <q-form @submit.prevent="signUp" ref="qFormRef">
            <q-card-section>
              <q-input
                v-model="email"
                placeholder="Email"
                class="login-input"
                color="main-2"
                dense
                lazy-rules
                :rules="[
                  (email) => email.length > 1 || 'Please enter email',
                  (email) =>
                    /^[\w\d\.]+@[\w\d]*\.[\w\d]{2,}$/i.test(email) ||
                    'Email invalid format',
                ]"
              />
              <q-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                class="login-input mt-5"
                color="main-2"
                dense
                lazy-rules
                :rules="[
                  (value) => value.length > 1 || 'Please enter password',
                ]"
              >
                <template #append>
                  <q-btn
                    round
                    unelevated
                    class="mr-1"
                    @click="showPassword = !showPassword"
                  >
                    <Icon
                      v-if="showPassword"
                      icon="fluent:eye-24-regular"
                      width="22"
                      height="22"
                    />
                    <Icon v-else icon="fluent:eye-off-24-regular" />
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
                  :disable="!email || !password || !accept"
                  class="w-full max-w-420px mx-auto text-weight-normal"
                  >Create new account</q-btn
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
                I am at least 13 years old. I have read and agree to the
                <a
                  href="https://manga-raiku.github.io/tems-of-use"
                  target="_blank"
                  class="text-white"
                  >Terms</a
                >
                and
                <a
                  href="https://manga-raiku.github.io/privacy-police"
                  target="_blank"
                  class="text-white"
                  >Privacy Policy</a
                >
              </small>
            </q-card-section>

            <q-card-section class="mt-4">
              <q-btn
                rounded
                no-caps
                unelevated
                class="w-full max-w-420px mx-auto text-weight-normal text-gray-300"
              >
                <Icon
                  icon="fluent:chevron-left-20-regular"
                  class="size-1.5em"
                />
                Back
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
const router = useRouter()
const authStore = useAuthStore()

const qFormRef = ref<QForm>()

const email = ref("")
const password = ref("")

const accept = ref(false)
const showPassword = ref(false)

async function signUp() {
  const loader = $q.loading.show({
    spinnerColor: "main-3",
    spinnerSize: 40,
  })

  const { error } = await authStore.signUp(email.value, password.value)

  loader()

  if (error) {
    $q.notify({
      position: "bottom-right",
      message:
        "Đăng ký tài khoản thất bại " +
        (import.meta.env.DEV ? `(${error.message})` : ""),
    })

    return
  }

  $q.notify({
    position: "bottom-right",
    message: "Đã đăng ký, hãy kiểm tra email",
  })
  router.back()
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
