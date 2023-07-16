<template>
  <span class="quality">
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.quality {
  background-image: linear-gradient(90deg, #f27fb5 0%, #f27fb5 100%);
  border-radius: 2px 0px 0px 2px;
  padding: 0px 4px;
  margin-right: 4px;
  height: 18px;
  line-height: 18px;
}
</style>
