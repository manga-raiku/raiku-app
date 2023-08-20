<template>
  <div>
    <q-header class="bg-dark-page">
      <q-toolbar>
        <q-btn round unelevated @click="router.back()">
          <Icon icon="fluent:chevron-left-24-filled" class="size-1.5em" />
        </q-btn>

        <q-toolbar-title>Cài đặt</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page>
      <q-list padding>
        <q-item
          v-for="item in buttons"
          :key="item.text"
          clickable
          :to="item.to"
          :href="item.href"
        >
          <q-item-section>
            <q-item-label>{{ item.text }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()

const buttons = [
  {
    text: "Ngôn ngữ",
    to: "/app/settings/language",
  },
  {
    text: "Thông báo",
    to: "/app/settings/notification",
  },
  // {
  //   text: "Clear Cache",
  // },
  {
    text: "Điều khoản dịch vụ",
    href: "https://anime-vsub.github.io/term-of-use",
  },
  {
    text: "Chính sách bảo mật",
    href: "https://anime-vsub.github.io/privacy-police",
  },
  {
    text: "Kiểm tra lỗi mạng",
    to: "/app/settings/check-network",
  },
]
</script>
