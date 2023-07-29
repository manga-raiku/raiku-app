<template>
  <div class="banner-title pl-3 text-28px <sm:text-23px">
    <h3 class="flex items-center justify-between">
      <slot />
    </h3>
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
  margin-top: (10em / 32);

  &:before {
    position: absolute;
    content: "";
    width: (55em / 32);
    height: (55em / 32);
    background-image: url(/src/assets/sakura.png);
    background-size: cover;
    top: (-10em / 32);
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
    left: (56em / 32);
    bottom: 0px;
    background-color: var(--sakura);
    width: (45em / 32);
    height: (4em / 32);
    z-index: -1;
    box-shadow: (28em / 32) (5em / 32) 0px 0px var(--sakura);
  }
}
</style>
