<template>
  <TemplateError
    :image="image"
    alt="image offline"
    :title="$t('khong-co-ket-noi-internet')"
    :caption="$t('desc-offline')"
    :retrying="retrying"
    :retry="retry"
  >
    <template #actions>
      <q-btn rounded flat color="sakura3" no-caps to="/library/offline">{{
        $t("di-den-truyen-da-tai")
      }}</q-btn>
    </template>
  </TemplateError>
</template>

<script lang="ts" setup>
import image from "src/assets/no_internet.svg"

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  retrying: boolean
  retry: () => void
}>()
</script>
