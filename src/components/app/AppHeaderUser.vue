<template>

  <q-btn flat round unelevated>
    <q-avatar v-if="authStore.isLogged" size="35px">
      <q-img
        v-if="authStore.user_data?.avatar"
        :src="forceHttp2(authStore.user_data.avatar)"
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
                    :src="forceHttp2(authStore.user_data.avatar)"
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
                  authStore.user_data!.name
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
                <q-item-label>{{ t("trung-tam-ca-nhan") }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-else>
            <q-item class="rounded-xl">
              <q-item-section>
                {{ t("cai-dat") }}
              </q-item-section>
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
              <q-item-label>{{ t("ngon-ngu") }}</q-item-label>
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
              <q-item-label>{{ t("cai-dat-chung") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <Icon icon="fluent:chevron-right-24-regular" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="rounded-xl">
            <q-item-section avatar class="min-w-0">
              <Icon
                icon="fluent:phone-vertical-scroll-24-regular"
                width="20"
                height="20"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t("cuon-vo-han") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="settingsStore.infinityScroll"
                dense
                color="main"
              />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="rounded-xl">
            <q-item-section avatar class="min-w-0">
              <Icon
                icon="fluent:phone-vertical-scroll-24-regular"
                width="20"
                height="20"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{
                t("khoi-phuc-tap-cuoi-cung-bo-anime")
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="settingsStore.restoreLastEp"
                dense
                color="main"
              />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="rounded-xl">
            <q-item-section avatar class="min-w-0">
              <Icon
                icon="fluent:phone-vertical-scroll-24-regular"
                width="20"
                height="20"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{
                t("luu-tien-trinh-xem-khi-offline")
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="settingsStore.enablePersistent"
                dense
                color="main"
              />
            </q-item-section>
          </q-item>

          <q-item
            v-if="authStore.isLogged"
            clickable
            v-ripple
            class="rounded-xl"
            @click="logout"
          >
            <q-item-section avatar class="min-w-0">
              <Icon icon="fa:sign-out" width="20" height="20" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t("thoat") }}</q-item-label>
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
            <q-item-section>
              {{ t("chon-ngon-ngu-cua-ban") }}
            </q-item-section>
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
            <q-item-section> {{ t("cai-dat-chung") }} </q-item-section>
          </q-item>

          <!-- <q-separator class="bg-[rgba(255,255,255,0.1)]" /> -->

          <q-item clickable v-ripple class="rounded-xl">
            <q-item-section>
              <q-item-label>{{ t("tu-dong-phat") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="settingsStore.player.autoNext"
                size="sm"
                color="green"
              />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple class="rounded-xl">
            <q-item-section>
              <q-item-label>{{ t("nhac-toi-tam-dung-xem") }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                v-model="settingsStore.player.enableRemindStop"
                size="sm"
                color="green"
              />
            </q-item-section>
          </q-item>
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
    {{ t("dang-nhap") }}
  </q-btn>


  <q-dialog v-model="showDialogLogin">
    <q-card class="h-[60vh] bg-dark-500 min-w-[300px] rounded-xl">
      <q-card-section>
        <div class="flex justify-between">
          <q-btn dense round flat unelevated />

          <div class="flex-1 text-center text-subtitle1">
            {{ t("dang-nhap-de-dong-bo-du-lieu") }}
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
              :placeholder="t('mat-khau')"
              @keydown.stop
            >
              <template v-slot:append>
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
            {{ t("dang-nhap-bang-tai-khoan-cua-ban-tren") }}
            <a href="https://animevietsub.cc" target="_blank">AnimeVietsub</a>.
            {{ t("du-lieu-cua-ban-se-duoc-dong-bo-ca-o-do-va-day") }}
          </div>

          <div class="text-grey text-center mt-5 mb-4">
            {{ t("tim-lai-mat-khau") }}
          </div>

          <q-btn
            type="submit"
            no-caps
            rounded
            unelevated
            class="bg-main w-full"
            :disable="!email || !password"
            >{{ t("dang-nhap") }}</q-btn
          >
        </form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>

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

  const $q = useQuasar()

  async function login() {
    const loader = $q.loading.show({
      message: t("dang-xac-thuc-vui-long-doi"),
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
        message: t("da-dang-nhap-voi-tu-cach-_user", [data.name]),
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      $q.notify({
        position: "bottom-right",
        message: t("dang-nhap-that-bai"),
        caption: err.message,
      })
    } finally {
      loader()
    }
  }

</script>
