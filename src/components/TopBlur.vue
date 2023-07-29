<template>
  <div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
div {
  background-image: linear-gradient(
    180deg,
    rgba(10, 12, 15, 0.8) 0%,
    rgba(10, 12, 15, 0.74) 4%,
    rgba(10, 12, 15, 0.59) 17%,
    rgba(10, 12, 15, 0.4) 34%,
    rgba(10, 12, 15, 0.21) 55%,
    rgba(10, 12, 15, 0.06) 78%,
    rgba(10, 12, 15, 0) 100%
  );
  background-color: transparent;
  min-height: 60px;
  position: absolute;
  padding: {
    left: 8px;
    right: 10px;
    top: 10px;
    bottom: 40px;
  }
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;

  font-size: 14px;
  font-weight: 500;
  @media screen and (max-width: 1680px) {
    font-size: 12px;
  }
  span {
    color: rgb(255, 255, 255);
    letter-spacing: 0px;
  }
}
</style>
