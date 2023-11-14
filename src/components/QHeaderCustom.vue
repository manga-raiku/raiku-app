<template>
  <header :class="classes" :style="style" @focusin="onFocusin">
    <slot name="default" />
    <div
      v-if="elevated"
      class="q-layout__shadow absolute-full overflow-hidden no-pointer-events"
    />
    <q-resize-observer
      :debounce="0"
      ref="qResizeObserverRef"
      @resize="onResize"
    />
  </header>
</template>

<script lang="ts" setup>
import { QResizeObserver } from "quasar"

const layoutKey = "_q_l_"

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    reveal?: boolean
    revealOffset?: number
    bordered?: boolean
    elevated?: boolean
    heightHint?: string | number
  }>(),
  {
    modelValue: true,
    revealOffset: 250,
    heightHint: 50
  }
)
const emit = defineEmits<{
  (name: "reveal", value: boolean): void
  (name: "focusin", event: Event): void
}>()

const $q = useQuasar()

const qResizeObserverRef = ref<InstanceType<typeof QResizeObserver>>()

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyRenderFn = () => {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $layout = inject(layoutKey, emptyRenderFn) as any
if ($layout === emptyRenderFn) {
  console.error("QHeader needs to be child of QLayout")
}

const size = ref(parseInt(props.heightHint + "", 10))
const revealed = ref(true)

const fixed = computed(
  () =>
    props.reveal === true ||
    $layout.view.value.indexOf("H") > -1 ||
    ($q.platform.is.ios && $layout.isContainer.value === true)
)

const offset = computed(() => {
  if (props.modelValue !== true) {
    return 0
  }
  if (fixed.value === true) {
    return revealed.value === true ? size.value : 0
  }
  const offset = size.value - $layout.scroll.value.position
  return offset > 0 ? offset : 0
})

const hidden = computed(
  () =>
    props.modelValue !== true ||
    (fixed.value === true && revealed.value !== true)
)

const revealOnFocus = computed(
  () =>
    props.modelValue === true && hidden.value === true && props.reveal === true
)

const classes = computed(
  () =>
    "q-header q-layout__section--marginal " +
    (fixed.value === true ? "fixed" : "absolute") +
    "-top" +
    (props.bordered === true ? " q-header--bordered" : "") +
    (hidden.value === true ? " q-header--hidden" : "") +
    (props.modelValue !== true ? " q-layout--prevent-focus" : "")
)

const style = computed(() => {
  const view = $layout.rows.value.top
  const css = {} as Record<string, string>

  if (view[0] === "l" && $layout.left.space === true) {
    css[$q.lang.rtl === true ? "right" : "left"] = `${$layout.left.size}px`
  }
  if (view[2] === "r" && $layout.right.space === true) {
    css[$q.lang.rtl === true ? "left" : "right"] = `${$layout.right.size}px`
  }

  return css
})

function updateLayout(prop: string, val: unknown) {
  $layout.update("header", prop, val)
}

function updateLocal<T>(prop: Ref<T>, val: T) {
  if (prop.value !== val) {
    prop.value = val
  }
}

function onResize({ height }: { height: number }) {
  if (height === 0) return
  updateLocal(size, height)
  updateLayout("size", height)
}

function onFocusin(evt: Event) {
  if (revealOnFocus.value === true) {
    updateLocal(revealed, true)
  }

  emit("focusin", evt)
}

watch(
  () => props.modelValue,
  (val) => {
    updateLayout("space", val)
    updateLocal(revealed, true)
    $layout.animate()
  }
)

watch(offset, (val) => {
  updateLayout("offset", val)
})

watch(
  () => props.reveal,
  (val) => {
    val === false && updateLocal(revealed, props.modelValue)
  }
)

watch(revealed, (val) => {
  $layout.animate()
  emit("reveal", val)
})

watch($layout.scroll, (scroll) => {
  props.reveal === true &&
    updateLocal(
      revealed,
      scroll.direction === "up" ||
        scroll.position <= props.revealOffset ||
        scroll.position - scroll.inflectionPoint < 100
    )
})

const instance = {}
function onInsertLayout() {
  if ($layout.instances.header !== instance) {
    if (props.modelValue === true) updateLayout("size", size.value)

    $layout.instances.header = instance
    updateLayout("space", props.modelValue)
    updateLocal(revealed, true)
    updateLayout("offset", offset.value)
  }
}
function onUnsertLayout() {
  if ($layout.instances.header === instance) {
    $layout.instances.header = undefined
    updateLayout("size", 0)
    updateLayout("offset", 0)
    // updateLayout("space", false)
  }
}

void onInsertLayout()
onActivated(onInsertLayout)
onDeactivated(onUnsertLayout)
onBeforeUnmount(onUnsertLayout)
</script>
