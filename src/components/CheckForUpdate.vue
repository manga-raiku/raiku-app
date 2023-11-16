<template>
  <q-dialog
    :model-value="!!newVersion"
    @update:model-value="newVersion = undefined"
    full-width
  >
    <q-card class="rounded-xl">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium">
          Đã có bản cập nhật mới
        </div>

        <div class="text-grey">
          {{ latest?.tag_name }} (current: {{ data?.[1].version }})
        </div>

        <div class="overflow-y-auto">
          <p class="whitespace-pre-wrap" v-html="latest?.body" />
        </div>
      </q-card-section>

      <q-card-actions class="justify-end">
        <q-btn
          flat
          no-caps
          color="grey"
          label="Bỏ qua"
          @click="latest && ignoreUpdateVersion(latest.tag_name)"
        />
        <q-btn
          flat
          no-caps
          color="main"
          label="Cập nhật"
          target="_blank"
          href="https://github.com/manga-raiku/raiku-app"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { App } from "@capacitor/app"
import { version } from "app/package.json"
import semverGt from "semver/functions/gt"

interface Release {
  url: string
  assets_url: string
  upload_url: string
  html_url: string
  id: number
  author: {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
  }
  node_id: string
  tag_name: string
  target_commitish: string
  name: string
  draft: boolean
  prerelease: boolean
  created_at: string
  published_at: string
  assets: never[]
  tarball_url: string
  zipball_url: string
  body: string
}

const newVersion = shallowRef<Release>()

const { data } = useRequest<[Release[], { version: string }]>(() =>
  Promise.all([
    fetch("https://api.github.com/repos/manga-raiku/raiku-app/releases").then(
      (res) => res.json()
    ),
    !APP_NATIVE_MOBILE ? { version } : App.getInfo()
  ])
)

const latest = computed(() => {
  const release = data.value?.[0].find((release) => {
    if (release.tag_name.startsWith("android@")) {
      return true
    }
    return false
  })

  if (!release) return

  const version = release.tag_name.slice(release.tag_name.indexOf("@") >>> 0)

  if (
    localStorage.getItem("ignore-update-version") === data.value?.[1].version
  ) {
    return
  }

  if (!semverGt(version, version)) return

  return release
})

function ignoreUpdateVersion(version: string) {
  localStorage.setItem("ignore-update-version", version)
  newVersion.value = undefined
}
</script>
