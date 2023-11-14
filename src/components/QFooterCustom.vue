<template>
  <footer :class="classes" :style="style" @focusin="onFocusin">
    <slot name="default" />
    <q-resize-observer
      :debounce="0"
      ref="qResizeObserverRef"
      @resize="onResize"
    />
    <div
      v-if="elevated"
      class="q-layout__shadow absolute-full overflow-hidden no-pointer-events"
    />
  </footer>
</template>

<script lang="ts" setup>
const layoutKey = "_q_l_"
const isRuntimeSsrPreHydration = { value: false }

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    reveal?: boolean
    bordered?: boolean
    elevated?: boolean
    heightHint?: string | number
  }>(),
  {
    modelValue: true,
    heightHint: 50
  }
)
const emit = defineEmits<{
  (name: "reveal", value: boolean): void
  (name: "focusin", event: Event): void
}>()

const $q = useQuasar()

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyRenderFn = () => {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $layout = inject(layoutKey, emptyRenderFn) as any
if ($layout === emptyRenderFn) {
  console.error("QFooter needs to be child of QLayout")
}

const size = ref(parseInt(props.heightHint + "", 10))
const revealed = ref(true)
const windowHeight = ref(
  isRuntimeSsrPreHydration.value === true || $layout.isContainer.value === true
    ? 0
    : window.innerHeight
)

const fixed = computed(
  () =>
    props.reveal === true ||
    $layout.view.value.indexOf("F") > -1 ||
    ($q.platform.is.ios && $layout.isContainer.value === true)
)

const containerHeight = computed(() =>
  $layout.isContainer.value === true
    ? $layout.containerHeight.value
    : windowHeight.value
)

const offset = computed(() => {
  if (props.modelValue !== true) {
    return 0
  }
  if (fixed.value === true) {
    return revealed.value === true ? size.value : 0
  }
  const offset =
    $layout.scroll.value.position +
    containerHeight.value +
    size.value -
    $layout.height.value
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
    "q-footer q-layout__section--marginal " +
    (fixed.value === true ? "fixed" : "absolute") +
    "-bottom" +
    (props.bordered === true ? " q-footer--bordered" : "") +
    (hidden.value === true ? " q-footer--hidden" : "") +
    (props.modelValue !== true
      ? " q-layout--prevent-focus" + (fixed.value !== true ? " hidden" : "")
      : "")
)

const style = computed(() => {
  const view = $layout.rows.value.bottom
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
  $layout.update("footer", prop, val)
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

function updateRevealed() {
  if (props.reveal !== true) {
    return
  }

  const { direction, position, inflectionPoint } = $layout.scroll.value

  updateLocal(
    revealed,
    direction === "up" ||
      position - inflectionPoint < 100 ||
      $layout.height.value - containerHeight.value - position - size.value < 300
  )
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
    if (val) {
      $layout.instances.footer = instance
      if (val === true) updateLayout("size", size.value)

      updateLayout("offset", offset.value)
    }

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

watch([size, $layout.scroll, $layout.height], updateRevealed)

watch(
  () => $q.screen.height,
  (val) => {
    $layout.isContainer.value !== true && updateLocal(windowHeight, val)
  }
)

const instance = {}
function onInsertLayout() {
  if ($layout.instances.footer !== instance) {
    if (props.modelValue === true) updateLayout("size", size.value)

    $layout.instances.footer = instance
    updateLayout("space", props.modelValue)
    updateLocal(revealed, true)
    updateLayout("offset", offset.value)
  }
}
function onUnsertLayout() {
  if ($layout.instances.footer === instance) {
    $layout.instances.footer = undefined
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
