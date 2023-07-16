<template>
  <div class="banner-title pl-3">
    <h3 class="text-32px"><slot /></h3>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.banner-title {
  position: relative;
  text-transform: uppercase;
  -webkit-text-fill-color: #ffffff;
  -webkit-text-stroke-width: 1.2px;
  color: var(--sakura);
  font-weight: 700;

  &:before {
    position: absolute;
    content: "";
    width: 55px;
    height: 55px;
    background-image: url(/src/assets/sakura.png);
    top: -10px;
    left: 0px;
    background-repeat: no-repeat;
    animation: rotate 6s linear infinite;
    z-index: -1;

    @keyframes rotate {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
  &:after {
    position: absolute;
    content: "";
    left: 56px;
    bottom: 0px;
    background-color: var(--sakura);
    width: 45px;
    height: 4px;
    z-index: -1;
    box-shadow: 28px 5px 0px 0px var(--sakura);
  }
}
</style>
