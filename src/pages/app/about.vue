<route lang="yaml">
  meta:
    hiddenHeader: $lt.md
    hiddenFooter: true
    hiddenDrawer: true
    auth: true
  </route>
  
<template>
  <div>
    <q-header v-if="$q.screen.lt.md" class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <Icon icon="fluent:chevron-left-24-filled" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Giới thiệu</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page>
      <div class="pt-12 flex items-center justify-center">
        <div class="display-inline-block rounded-1/2">
          <img src="~/assets/app_icon-white.png" class="size-80px" />
        </div>
      </div>
      <div class="text-center mt-4">
        <h1
          class="text-subtitle1 text-20px uppercase text-weight-medium text-gray-200"
        >
          Manga Raiku
        </h1>
        <small class="text-12px text-gray-400"
          >v{{ appInfo?.version ?? "__" }}-[{{ appInfo?.build }}]</small
        >
      </div>

      <q-list>
        <q-item v-for="item in buttons" :key="item.text" :href="item.href">
          <q-item-section>
            <q-item-label>{{ item.text }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <small class="text-gray-400 mt-10 text-12px text-center display-block"
        >Ứng dụng thuộc tổ chức phi lợi nhuận</small
      >
    </q-page>
  </div>
</template>

<script lang="ts" setup>
import { App } from "@capacitor/app"
import { version } from "app/package.json"

const router = useRouter()

const appInfo = computedAsync(async () => {
  try {
    return await App.getInfo()
  } catch {
    return { version, build: "web" }
  }
})

const buttons = [
  {
    text: "Mã nguồn mở giấy phép GNU v3",
    href: "https://github.com/manga-raiku/manga-raiku",
  },
  {
    text: "Điều khoản dịch vụ",
    href: "https://manga-raiku.github.io/term-of-use",
  },
  {
    text: "Chính sách bảo mật",
    href: "https://manga-raiku.github.io/privacy-police",
  },
]
</script>

<style></style>
