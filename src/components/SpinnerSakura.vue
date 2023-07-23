<template>
  <img src="~/assets/sakura.png" class="sakura" />
</template>

<style lang="scss" scoped>
.sakura {
  animation: rotate infinite 4444ms linear;
  @keyframes rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
