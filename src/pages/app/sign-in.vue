<route lang="yaml">
meta:
  hiddenFooter: true
  auth: false
</route>

<template>
  <div>
    <q-header class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <Icon icon="fluent:chevron-left-24-filled" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Đăng nhập</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page padding>
      <q-form @submit.prevent="login" ref="qFormRef">
        <q-card class="transparent">
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
              :rules="[(value) => value.length > 1 || 'Please enter password']"
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
            <div class="text-right pt-4">
              <router-link
                to="/app/forgot-password"
                class="text-gray-300 text-12px"
                >Forget Password?</router-link
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
                >Log in</q-btn
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
              <a href="/terms-of-use" target="_blank" class="text-white"
                >Terms</a
              >
              and
              <a href="/privacy-policy" target="_blank" class="text-white"
                >Privacy Policy</a
              >
            </small>
          </q-card-section>

          <q-card-section class="mt-4">
            <div class="or mb-2">
              <span class="px-4 text-gray-300 bg-dark-page">hoặc</span>
            </div>

            <q-btn
              outline
              rounded
              no-caps
              class="w-full text-#fff text-opacity-20 py-2 mt-2"
            >
              <div class="w-full flex flex-items pl-8 pr-28%">
                <Icon icon="logos:twitter" class="size-1.5em mr-10" />
                <div
                  class="text-weight-normal text-white text-center min-w-0 w-full flex-1"
                >
                  Continue with Twitter
                </div>
              </div>
            </q-btn>
            <q-btn
              outline
              rounded
              no-caps
              class="w-full text-#fff text-opacity-20 py-2 mt-2"
            >
              <div class="w-full flex flex-items pl-8 pr-28%">
                <Icon icon="logos:google-icon" class="size-1.5em mr-10" />
                <div
                  class="text-weight-normal text-white text-center min-w-0 w-full flex-1"
                >
                  Continue with Google
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
                <Icon
                  icon="fluent:mail-24-filled"
                  color="white"
                  class="size-1.5em mr-10"
                />
                <div
                  class="text-weight-normal text-white text-center min-w-0 w-full flex-1"
                >
                  Sign up with Email
                </div>
              </div>
            </q-btn>
          </q-card-section>
        </q-card>
      </q-form>
    </q-page>
  </div>
</template>

<script lang="ts" setup>
import { QForm } from "quasar"

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const qFormRef = ref<QForm>()

const email = ref("")
const password = ref("")

const accept = ref(false)
const showPassword = ref(false)

async function login() {
  const { data, error } = await authStore.signIn(email.value, password.value)

  if (error) {
    $q.notify({
      position: "bottom-right",
      message:
        `Đăng nhập thất bại (code: ${error.status})` +
        (import.meta.env.DEV ? `(${error.message})` : ""),
    })

    return
  }

  $q.notify({
    position: "bottom-right",
    message: `Đã đăng nhập với tư cách ${
      data.user.user_metadata.name ?? data.user.email
    }`,
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
</style>
