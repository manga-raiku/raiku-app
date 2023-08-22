<template>
  <q-btn flat round unelevated>
    <q-avatar v-if="authStore.isLogged" size="35px">
      <q-img
        v-if="authStore.user_data?.avatar"
        :src="authStore.user_data.avatar"
        no-spinner
        referrerpolicy="no-referrer"
      />
      <Icon
        v-else
        icon="fluent:person-circle-24-filled"
        width="30"
        height="30"
      />
    </q-avatar>
    <Icon v-else icon="fluent:settings-24-regular" width="30" height="30" />

    <q-menu v-model="showMenuAccount" class="rounded-xl bg-dark-page shadow-xl">
      <q-card class="transparent w-[280px] px-2 pb-3">
        <q-list v-if="tabMenuAccountActive === 'normal'">
          <template v-if="authStore.isLogged">
            <q-item class="rounded-xl">
              <q-item-section avatar>
                <q-avatar size="45px">
                  <img
                    v-if="authStore.user_data?.avatar"
                    :src="authStore.user_data.avatar"
                    referrerpolicy="no-referrer"
                  />
                  <Icon
                    v-else
                    icon="fluent:person-circle-24-filled"
                    width="45"
                    height="45"
                  />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="font-weight-medium text-subtitle1">{{
                  authStore.user_data?.fullName
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator class="bg-[rgba(255,255,255,0.1)]" />

            <q-item
              clickable
              v-ripple
              to="/tai-khoan/edit-profile"
              active-class=""
              class="rounded-xl"
            >
              <q-item-section avatar class="min-w-0">
                <Icon icon="fluent:info-24-regular" width="20" height="20" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Trung tâm cá nhân</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-else>
            <q-item class="rounded-xl">
              <q-item-section>Cài đặt</q-item-section>
            </q-item>

            <q-separator class="bg-[rgba(255,255,255,0.1)]" />
          </template>

          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            @click="tabMenuAccountActive = 'locale'"
          >
            <q-item-section avatar class="min-w-0">
              <Icon icon="carbon:translate" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Ngôn ngữ</q-item-label>
            </q-item-section>
            <q-item-section side>
              <Icon icon="fluent:chevron-right-24-regular" />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            class="rounded-xl"
            @click="tabMenuAccountActive = 'setting'"
          >
            <q-item-section avatar class="min-w-0">
              <Icon icon="fluent:settings-24-regular" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Cài đặt chung</q-item-label>
            </q-item-section>
            <q-item-section side>
              <Icon icon="fluent:chevron-right-24-regular" />
            </q-item-section>
          </q-item>

          <q-item
            v-if="authStore.isLogged"
            clickable
            v-ripple
            class="rounded-xl"
            @click="authStore.logout"
          >
            <q-item-section avatar class="min-w-0">
              <Icon icon="fa:sign-out" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Thoát</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-list v-if="tabMenuAccountActive === 'locale'">
          <q-item class="rounded-xl">
            <q-item-section avatar class="min-w-0">
              <q-btn
                round
                dense
                unelevated
                @click="tabMenuAccountActive = 'normal'"
              >
                <Icon
                  icon="fluent:ios-arrow-ltr-24-regular"
                  width="20"
                  height="20"
                />
              </q-btn>
            </q-item-section>
            <q-item-section>Chọn ngôn ngữ của bạn</q-item-section>
          </q-item>

          <!-- <q-separator class="bg-[rgba(255,255,255,0.1)]" /> -->

          <q-item
            v-for="{ name, code } in languages"
            :key="code"
            clickable
            v-ripple
            class="rounded-xl"
            @click="settingsStore.locale = code"
          >
            <q-item-section avatar class="min-w-0">
              <Icon
                v-if="settingsStore.locale === code"
                icon="fluent:checkmark-24-regular"
                width="20"
                height="20"
              />
              <span v-else class="block w-[20px]" />
            </q-item-section>
            <q-item-section>{{ name }}</q-item-section>
          </q-item>
        </q-list>

        <q-list v-if="tabMenuAccountActive === 'setting'">
          <q-item class="rounded-xl">
            <q-item-section avatar class="min-w-0">
              <q-btn
                round
                dense
                unelevated
                @click="tabMenuAccountActive = 'normal'"
              >
                <Icon
                  icon="fluent:ios-arrow-ltr-24-regular"
                  width="20"
                  height="20"
                />
              </q-btn>
            </q-item-section>
            <q-item-section>Cài đặt chung</q-item-section>
          </q-item>

          <!-- <q-separator class="bg-[rgba(255,255,255,0.1)]" /> -->
        </q-list>
      </q-card>
    </q-menu>
  </q-btn>

  <q-btn
    v-if="!authStore.isLogged"
    flat
    stack
    no-caps
    rounded
    unelevated
    class="font-weight-normal"
    @click="showDialogLogin = true"
  >
    <Icon icon="fluent:person-24-regular" width="20" height="20" />
    Đăng nhập
  </q-btn>

  <q-dialog v-model="showDialogLogin">
    <q-card class="h-[60vh] bg-dark-500 min-w-[300px] rounded-xl">
      <q-card-section>
        <div class="flex justify-between">
          <q-btn dense round flat unelevated />

          <div class="flex-1 text-center text-subtitle1">
            Đăng nhập để đồng bộ dữ liệu
          </div>

          <q-btn dense round unelevated icon="close" v-close-popup />
        </div>
      </q-card-section>

      <q-card-section>
        <form @submit.prevent="login">
          <div>
            <q-input
              v-model="email"
              outlined
              required
              type="email"
              name="email"
              class="login-input w-full"
              placeholder="E-mail"
              @keydown.stop
            />
          </div>
          <div class="mt-4 relative flex items-center flex-nowrap input-wrap">
            <q-input
              v-model="password"
              outlined
              required
              :type="showPassword ? 'text' : 'password'"
              name="password"
              class="login-input w-full"
              placeholder="Mật khẩu"
              @keydown.stop
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
          </div>

          <div class="text-center text-gray-300 my-3">
            Đăng nhập bằng tài khoản của bạn trên
            <a href="https://truyenqqq.vn" target="_blank">TruyenQQ</a>. Dữ liệu
            của bạn sẽ được đồng bộ cả ở đó và ở đây
          </div>

          <div class="text-grey text-center mt-5 mb-4">Tìm lại mật khẩu</div>

          <q-btn
            type="submit"
            no-caps
            rounded
            unelevated
            class="bg-main w-full"
            :disable="!email || !password"
            >Đăng nhập</q-btn
          >
        </form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { languages } from "src/i18n"

const $q = useQuasar()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()

const showMenuAccount = ref(false)
// account
// showMenuAccount
const tabMenuAccountActive = ref<"normal" | "locale" | "setting">("normal")
watch(showMenuAccount, (val) => {
  if (val) tabMenuAccountActive.value = "normal"
})

const showDialogLogin = ref(false)

const showPassword = ref(false)

const email = ref("")
const password = ref("")

async function login() {
  const loader = $q.loading.show({
    message: "Đang xác thực vui lòng đợi",
    boxClass: "bg-dark text-light-9",
    spinnerColor: "main",
    delay: Infinity,
  })

  try {
    const data = await authStore.login(email.value, password.value)

    showDialogLogin.value = false
    email.value = ""
    password.value = ""
    $q.notify({
      position: "bottom-right",
      message: `Đã đăng nhập với tư cách ${data.fullName}`,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err)
    $q.notify({
      position: "bottom-right",
      message: "Đăng nhập thất bại",
      caption:
        toType(err) === "Error" ? err.message : Object.values(err).join(", "),
    })
  } finally {
    loader()
  }
}
</script>

<style lang="scss" scoped>
.login-input :deep(.q-field__native) {
  background-color: transparent !important;

  &,
  &:focus,
  &:focus-visible {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }
}
.login-input :deep(.q-field__control),
.login-input :deep(.q-field__append) {
  height: 45px !important;
}
</style>
<!--
<style lang="scss" scoped>
.hidden-focus-helper :deep(.q-focus-helper) {
  display: none !important;
}
</style> -->
