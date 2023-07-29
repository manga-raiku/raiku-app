<template>
  <div class="dim-part relative">
    <div class="dim-part-start horizontal" />
    <div class="dim-part-end horizontal" />
    <div v-bind="attrs" class="hide-scrollbar">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const attrs = useAttrs()
</script>

<style lang="scss" scoped>
.dim-part-start,
.dim-part-end {
  content: "";
  @apply absolute top-0 w-50px h-full z-2;
  // background-color: Red;
}

.dim-part-start {
  @apply left-0;
  background-image: linear-gradient(
    rgba(17, 19, 25, 0) 0%,
    rgb(17, 19, 25) 100%
  );
  &.horizontal {
    background-image: linear-gradient(
      to left,
      rgba(17, 19, 25, 0) 0%,
      rgb(17, 19, 25) 100%
    );
  }
}
.dim-part-end {
  @apply right-0;
  background-image: linear-gradient(
    to top,
    rgba(17, 19, 25, 0) 0%,
    rgb(17, 19, 25) 100%
  );
  &.horizontal {
    background-image: linear-gradient(
      to right,
      rgba(17, 19, 25, 0) 0%,
      rgb(17, 19, 25) 100%
    );
  }
}
</style>
