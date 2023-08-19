<route lang="yaml">
meta:
  hiddenFooter: true
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
      <q-input
        readonly
        :model-value="jscode"
        outlined
        prefix="javascript:"
        label-slot
      >
        <template #prepend>
          <q-avatar>
            <Icon icon="skill-icons:javascript" class="size-1.5em" />
          </q-avatar>
        </template>

        <template #label> Copy this code and run it on the website </template>

        <template #append>
          <q-btn round class="ml--4" @click="copyCodeToClipboard">
            <Icon icon="solar:copy-line-duotone" class="size-1.5em" />
          </q-btn>
        </template>
      </q-input>

      <q-input
        v-model="binaryAuth"
        outlined
        label="Dán ủy quyền nhị phân vào đây"
        color="main-3"
        class="mt-4"
        :rules="[verifyBinaryAuth]"
        clearable
      >
        <template #append>
          <q-btn round @click="pasteCodeFromClipboard">
            <Icon icon="solar:clipboard-text-line-duotone" class="size-1.5em" />
          </q-btn>
        </template>
      </q-input>

      <div v-if="auth" class="min-h-100px">
        <div class="ml-2 text-blue-300">Đây có phải là bạn không?</div>
        <div
          class="mt-2 flex flex-nowrap items-center border border-gray-300 border-opacity-60 rounded-20px py-2 px-3"
        >
          <q-avatar size="40">
            <q-img no-spinner :src="auth.avatar" />
          </q-avatar>

          <div class="pl-2 w-full min-w-0">
            <div class="text-subtitle1 ellipsis">{{ auth.fullName }}</div>
            <div class="text-gray-300 text-0.95em">
              {{ dayjs(auth.date).fromNow() }}
            </div>
          </div>

          <div class="justify-self-end">
            <q-btn
              text
              no-caps
              no-wrap
              color="main-4"
              rounded
              outline
              label="Tiếp tục"
              @click="continueLogin"
            />
          </div>
        </div>
      </div>
      <div v-else class="min-h-100px">
        Xem video để biết cách đăng nhập bằng Binary Auth
        <q-video
          :ratio="16 / 9"
          src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0"
          class="mt-1"
        />
      </div>
    </q-page>
  </div>
</template>

<script lang="ts" setup>
import { computedAsync } from "@vueuse/core"
import Login from "src/apis/nettruyen/runs/auth/login"
import jscode from "src/injecters/user-auth?braw&minify&obfuscate"
import dayjs from "src/logic/dayjs"

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const binaryAuth = ref("")
async function verifyBinaryAuth(binaryAuth: string): Promise<string | true> {
  try {
    const data = JSON.parse(binaryAuth)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await decryptText(data, process.env.CRYPTO_PASSWORD!)
    return true
  } catch (err) {
    console.warn(err)

    return "Binary auth invalid format!"
  }
}

const auth = computedAsync(
  async (onCleanup) => {
    if (!binaryAuth.value) return

    onCleanup(() => (auth.value = undefined))

    return JSON.parse(
      await decryptText(
        JSON.parse(binaryAuth.value),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.CRYPTO_PASSWORD!,
      ),
    )
  },
  undefined,
  {
    onError: import.meta.env.DEV ? console.error.bind(console) : undefined,
  },
)

async function copyCodeToClipboard() {
  try {
    await copyToClipboard(`javascript:${jscode}`)
    $q.notify({
      position: "bottom-right",
      message: "Copied!",
    })
  } catch (err) {
    $q.notify({
      position: "bottom-right",
      message: err + "",
    })
  }
}
async function pasteCodeFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    const parse = (str: string) => {
      try {
        return JSON.parse(str)
      } catch {
        return null
      }
    }
    const data = parse(text)

    if (
      typeof data !== "object" ||
      data === null ||
      typeof data.iv !== "string" ||
      typeof data.salt !== "string" ||
      typeof data.buffer !== "string"
    ) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error("Binary auth not verify format.")
    }

    const msg = await verifyBinaryAuth(text)
    if (msg === true) binaryAuth.value = text
    // eslint-disable-next-line functional/no-throw-statement
    else throw new Error(msg)
  } catch (err) {
    $q.notify({
      position: "bottom-right",
      message: err + "",
    })
  }
}

async function continueLogin() {
  if (auth.value) authStore.setUser(auth.value)
}
</script>
