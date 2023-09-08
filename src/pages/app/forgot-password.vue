<route lang="yaml">
meta:
  hiddenHeader: $lt.md
  hiddenFooter: true
  hiddenDrawer: true
  hiddenDrawerScope: true
</route>

<template>
  <div>
    <q-header v-if="$q.screen.lt.md" class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <Icon icon="fluent:chevron-left-24-filled" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Quên mật khẩu</q-toolbar-title>
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
            <div class="text-20px mx-2">Quên mật khẩu</div>

            <div class="card-bg-cyan top--20%"></div>
            <div class="card-bg-blue top--20%"></div>
          </div>

          <div class="text-gray-400 text-13px text-center mb-5">
            {{
              sendedEmail
                ? "Step 2/2: Set new password"
                : "Step 1/2: Enter your email account"
            }}
          </div>

          <q-form
            @submit.prevent="sendedEmail ? updatePassword() : resetPassword()"
            ref="qFormRef"
          >
            <template v-if="!sendedEmail">
              <q-card-section>
                <p class="text-gray-400">
                  Please enter the email address of your account:
                </p>
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
                    >Verify</q-btn
                  >
                </div>
              </q-card-section>
            </template>
            <template v-else>
              <q-card-section>
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
                    :disable="!password"
                    class="w-full max-w-420px mx-auto text-weight-normal"
                    >Update password</q-btn
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
const router = useRouter()
const authStore = useAuthStore()

const qFormRef = ref<QForm>()

const email = ref("")
const password = ref("")
const showPassword = ref(false)

const sendedEmail = ref(false)

async function resetPassword() {
  const loader = $q.loading.show({
    spinnerColor: "main-3",
    spinnerSize: 40,
  })

  const { error } = await authStore.resetPassword(email.value)

  loader()

  if (error) {
    $q.notify({
      position: "bottom",
      message:
        "Khôi phục tài khoản thất bại " +
        (import.meta.env.DEV ? `(${error.message})` : ""),
    })

    return
  }

  $q.notify({
    position: "bottom",
    message: "Đã gửi liên kết đặt lại mật khẩu tới email",
  })
  sendedEmail.value = true
}
async function updatePassword() {
  const loader = $q.loading.show({
    spinnerColor: "main-3",
    spinnerSize: 40,
  })

  const { error } = await authStore.updatePassword(password.value)

  loader()

  if (error) {
    $q.notify({
      position: "bottom",
      message:
        "Không thể cập nhật mật khẩu " +
        (import.meta.env.DEV ? `(${error.message})` : ""),
    })

    return
  }

  $q.notify({
    position: "bottom",
    message: "Đã cập nhật mật khẩu",
  })

  router.back()
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
