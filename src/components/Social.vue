<template>
  <div class="flex items-center justify-center">
    <q-btn
      v-for="social in socials"
      :key="social.href"
      :href="social.href"
      target="_blank"
      round
      unelevated
    >
      <component :is="social.icon" class="size-1.5em" />
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import LogosDiscord from "~icons/logos/discord-icon"
import LogosFacebook from "~icons/logos/facebook"
import LogosGithub from "~icons/logos/github-octocat"
import LogosTwitter from "~icons/logos/twitter"

const socials = [
  { icon: LogosTwitter, href: "https://twitter.com/tachib_shin" },
  { icon: LogosGithub, href: "https://github.com/manga-raiku" },
  { icon: LogosDiscord, href: "https://discord.gg/tachib_shin" },
  { icon: LogosFacebook, href: "https://facebook.com/manga-raiku" }
]
</script>
