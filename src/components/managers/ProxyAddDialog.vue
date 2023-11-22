<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="w-full mx-6 !max-w-560px flex flex-nowrap flex-col">
      <q-card-section class="pb-0">
        <h2 class="text-h6">{{ $t("them-proxy") }}</h2>
      </q-card-section>

      <q-card-section class="min-h-0 flex-1 flex flex-nowrap flex-col py-0">
        <div class="min-h-0 flex-1 h-full overflow-y-auto scrollbar-custom">
          <q-input
            v-model="proxyUrl"
            type="url"
            bottom-slots
            clearable
            autofocus
            :placeholder="$t('placeholder-input-proxy-url')"
            color="sakura2"
            :rules="[
              (v) => !!v || $t('vui-long-nhap-dia-chi-proxy'),
              (v) =>
                !!v.match(/^https?:\/\/[^.]+(?:(\.[^.]{2,})|(?:\:\d+))/) ||
                $t('dia-chi-proxy-khong-hop-le'),
              (value) =>
                !proxyStore.has(value) ||
                i18n.t('proxy-da-duoc-cai-dat-tu-truoc')
            ]"
          />

          <q-toggle
            v-model="queryMode"
            :label="$t('che-do-query')"
            class="ml--2 toggle-sakura3"
          />

          <q-input
            v-model="paramName"
            type="text"
            maxlength="20"
            :placeholder="$t('ten-cua-tham-so')"
            bottom-slots
          />

          <label class="mt-3 block">{{ $t("headers") }}</label>
          <FormList
            :model-value="headers"
            @push="headers.push($event)"
            @edit="headers[$event.index][$event.type] = $event.value"
            @remove="headers.splice($event, 1)"
          />

          <label class="mt-3 block">{{ $t("query") }}</label>
          <FormList
            :model-value="queries"
            @push="queries.push($event)"
            @edit="queries[$event.index][$event.type] = $event.value"
            @remove="queries.splice($event, 1)"
          />

          <label class="mt-3 block">{{ $t("body") }}</label>
          <FormList
            :model-value="body"
            @push="body.push($event)"
            @edit="body[$event.index][$event.type] = $event.value"
            @remove="body.splice($event, 1)"
          />
        </div>
      </q-card-section>

      <q-card-section class="pt-0" align="right">
        <q-btn flat no-caps rounded v-close-popup>{{ $t("huy") }}</q-btn>
        <q-btn
          flat
          no-caps
          rounded
          color="sakura3"
          :disable="!proxyUrl"
          :loading="addingProxy"
          @click="addProxy"
          >{{ $t("them-proxy") }}</q-btn
        >
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (name: "update:modelValue", value: boolean): void
  (name: "installed"): void
}>()

const proxyStore = useProxyStore()

const $q = useQuasar()
const i18n = useI18n()

const proxyUrl = ref("")
const queryMode = ref(false)
const paramName = ref("")
const headers = reactive<[string, string][]>([])
const queries = reactive<[string, string][]>([])
const body = reactive<[string, string][]>([])

const addingProxy = ref(false)
async function addProxy() {
  addingProxy.value = true

  try {
    const url = proxyUrl.value
    await proxyStore.add(url, {
      name: paramName.value,
      modeQuery: queryMode.value,
      headers: Object.fromEntries(toRaw(headers)),
      query: Object.fromEntries(toRaw(queries)),
      body: Object.fromEntries(toRaw(body))
    })

    $q.notify({
      message: i18n.t("da-them-proxy-url", [url])
    })
    emit("installed")
  } catch (err) {
    WARN(err)
    const message = i18n.t("loi-khi-them-proxy-err-err", [err + ""])

    $q.notify({
      message
    })
  } finally {
    addingProxy.value = false
  }

  addingProxy.value = false
}

watch(
  () => props.modelValue,
  (modelValue) => {
    if (!modelValue) {
      proxyUrl.value = ""
      queryMode.value = false
      paramName.value = ""
      headers.splice(0)
      queries.splice(0)
      body.splice(0)

      addingProxy.value = false
    }
  }
)
</script>
