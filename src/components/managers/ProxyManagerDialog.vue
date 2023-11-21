<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    full-height
  >
    <q-card
      class="h-full min-w-[min(500px,100%)] !max-w-560px flex flex-nowrap column min-h-0 rounded-xl"
    >
      <q-card-section class="text-16px flex items-center justify-between pl-7">
        {{ $t("trinh-quan-ly-proxy") }}

        <div>
          <q-btn unelevated round v-close-popup>
            <i-ep-close-bold class="size-1.5em" />
          </q-btn>
        </div>
      </q-card-section>
      <q-card-section
        class="w-full h-full min-h-0 flex-1 flex flex-nowrap column !py-0"
      >
        <q-list v-if="!error && data">
          <div class="flex items-center justify-between">
            <o-button
              light
              rounded
              type="primary"
              @click="stateStore.showProxyAddDialog = true"
            >
              <i-iconamoon-sign-plus-fill class="size-1.5em" />
              {{ $t("them-proxy") }}
            </o-button>

            <q-item-section side class="mr--2" @click="showEdit = !showEdit">
              <q-btn rounded no-caps flat class="text-sakura-3">{{
                showEdit ? $t("huy") : $t("sua")
              }}</q-btn>
            </q-item-section>
          </div>

          <q-toggle
            v-if="APP_NATIVE_MOBILE"
            v-model="proxyStore.useNativeAPI"
            class="toggle-sakura-3"
            label="Sử dụng Http của OS"
          />
          <q-toggle
            v-else
            v-model="proxyStore.useExtAPI"
            :disable="!APP_INFO.extension"
            class="toggle-sakura-3"
            label="Sử dụng Http của AnimeVsub Helper"
          >
            <q-tooltip v-if="!APP_INFO.extension"
              >Ứng dụng không thể tìm thấy Extension</q-tooltip
            >
          </q-toggle>

          <div v-if="!Object.keys(data).length" class="text-center py-6">
            {{ $t("khong-co-gi-ca") }}
          </div>
          <q-item
            v-else
            v-for="(info, url) in data"
            :key="url"
            clickable
            @click="proxyStore.useNativeAPI ? null : (proxyStore.enabled = url)"
            class="rounded-xl"
          >
            <q-item-section v-show="!showEdit" side>
              <q-radio
                v-model="proxyStore.enabled"
                :val="url"
                dense
                :disable="
                  APP_NATIVE_MOBILE
                    ? proxyStore.useNativeAPI
                    : APP_INFO.extension
                    ? proxyStore.useExtAPI
                    : false
                "
                color="toggle-sakura-3"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">
                {{ url }}
              </q-item-label>
            </q-item-section>
            <q-item-section v-if="showEdit" side>
              <q-btn
                round
                :disable="info.readonly"
                @click.stop.prevent="removeProxy(url)"
                @mousedown.stop
              >
                <i-iconamoon-sign-minus-circle-light
                  class="text-red-300 text-1.5em"
                />
              </q-btn>
            </q-item-section>
          </q-item>
          <!-- Noncomliant -->
        </q-list>
        <div v-else-if="error" class="px-6 py-5">
          {{ error }}
        </div>
        <div v-else class="flex items-center justify-center py-6">
          <q-spinner size="40px" color="sakura-3" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { APP_INFO, APP_NATIVE_MOBILE } from "src/constants"

defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<(name: "update:modelValue", value: boolean) => void>()

const proxyStore = useProxyStore()
const stateStore = useStateStore()
const $q = useQuasar()
const { t } = useI18n()
const i18n = useI18n()

const { data, error } = useRequest(() => proxyStore.getAllProxy())

function removeProxy(url: string) {
  $q.dialog({
    title: i18n.t("xoa-proxy"),
    message: i18n.t("ban-chac-chan-muon-xoa-proxy-nay-chu"),
    cancel: { label: t("huy"), flat: true, noCaps: true, rounded: true },
    ok: {
      label: t("xoa"),
      color: "red",
      flat: true,
      noCaps: true,
      rounded: true
    },
    persistent: true
  }).onOk(async () => {
    await proxyStore.remove(url)
    $q.notify({
      message: i18n.t("da-xoa-proxy-url", [url])
    })
  })
}
// ===== edit ====
const showEdit = ref(false)
</script>
