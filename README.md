# Raiku (git.shin.raiku)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmanga-raiku%2Fmanga-raiku.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmanga-raiku%2Fmanga-raiku?ref=badge_shield)
[![built with Codeium](https://codeium.com/badges/main)](https://codeium.com)

[![Netlify Status](https://api.netlify.com/api/v1/badges/79ead2b7-a29d-45a8-9c2f-3a563d8357f5/deploy-status)](https://app.netlify.com/sites/manga-raiku/deploys)
[![GitHub license](https://img.shields.io/github/license/manga-raiku/raiku-app)](https://github.com/manga-raiku/raiku-app/blob/main/LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/manga-raiku/raiku-app)](https://github.com/manga-raiku/raiku-app/issues)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/d08aea4f3b99438fb61e7a4f2024fe44)](https://app.codacy.com/gh/manga-raiku/raiku-app/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Hits-of-Code](https://hitsofcode.com/github/manga-raiku/raiku-app?branch=main)](https://hitsofcode.com/github/manga-raiku/raiku-app/view?branch=main)

[![CI](https://github.com/manga-raiku/raiku-app/actions/workflows/ci.yml/badge.svg)](https://github.com/manga-raiku/raiku-app/actions/workflows/ci.yml)
[![CodeCov](https://github.com/manga-raiku/raiku-app/actions/workflows/codecov.yml/badge.svg)](https://github.com/manga-raiku/raiku-app/actions/workflows/codecov.yml)
[![CodeQL](https://github.com/manga-raiku/raiku-app/actions/workflows/codeql.yml/badge.svg)](https://github.com/manga-raiku/raiku-app/actions/workflows/codeql.yml)
[![CodeSee](https://github.com/manga-raiku/raiku-app/actions/workflows/codesee-arch-diagram.yml/badge.svg)](https://github.com/manga-raiku/raiku-app/actions/workflows/codesee-arch-diagram.yml)
[![DevSkim](https://github.com/manga-raiku/raiku-app/actions/workflows/devskim.yml/badge.svg)](https://github.com/manga-raiku/raiku-app/actions/workflows/devskim.yml)
[![Release for Android](https://github.com/manga-raiku/raiku-app/actions/workflows/android-release.yml/badge.svg)](https://github.com/manga-raiku/raiku-app/actions/workflows/android-release.yml)
[![Release for PWA](https://github.com/manga-raiku/raiku-app/actions/workflows/pwa-release.yml/badge.svg)](https://github.com/manga-raiku/raiku-app/actions/workflows/pwa-release.yml)
[![Try build](https://github.com/manga-raiku/raiku-app/actions/workflows/try-build.yml/badge.svg)](https://github.com/manga-raiku/raiku-app/actions/workflows/try-build.yml)

「無邪気な笑顔の下の、日付は遥かなメモリー」

App reading manga, comic safe, free, private and ad-free.

> The app is in development

The app currently supports:

- Android APK (native app)
- SPA
- PWA

## Screenshot

- Android, Web Mobile:
<div style="overflow-x: scroll; white-space: nowrap">
  
<img src="https://github.com/manga-raiku/raiku-app/assets/45375496/b7fead64-654a-40d6-81ec-cdd6d8e2f5ec" width="240" />
<img src="https://github.com/manga-raiku/raiku-app/assets/45375496/ccc89acb-e341-491e-a683-4647388630cd" width="240" />
<img src="https://github.com/manga-raiku/raiku-app/assets/45375496/3c030e04-d181-4b43-9f5e-9af6f9ab6d4e" width="240" />
<img src="https://github.com/manga-raiku/raiku-app/assets/45375496/188c394a-fb17-493b-8c27-6fb47c27e667" width="240" />
<img src="https://github.com/manga-raiku/raiku-app/assets/45375496/9871c561-2c85-4932-b2ea-8d68e6762ccf" width="240" />
<img src="https://github.com/manga-raiku/raiku-app/assets/45375496/3631c6a4-440d-4cae-968a-849872d11cb7" width="240" />
<img src="https://github.com/manga-raiku/raiku-app/assets/45375496/fefcb62f-6c75-4c10-96f5-25566caa90f1" width="240" />
<img src="https://github.com/manga-raiku/raiku-app/assets/45375496/75eb168c-0302-4d56-af84-2caaac73f8e5" width="240" />
<img src="https://github.com/manga-raiku/raiku-app/assets/45375496/65b88d62-bdd5-42c0-9fb0-8cbce1ec55e8" width="240" />
<img src="https://github.com/manga-raiku/raiku-app/assets/45375496/ce9b272f-0810-44f5-abe4-17e08fe9728d" width="240" />


</div>

- Desktop
  ![image](https://github.com/manga-raiku/raiku-app/assets/45375496/b580ab92-114a-487c-a39f-690e19180248)

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### To be on

- [x] Download manager for desktop
- [x] Offline ready interface
- [ ] Infinite reader
- [x] Common API to support various sources
- [x] Localize app
- [x] meta header
- [x] update UI screen error
- [x] show error network offline
- [x] add redirect to not found page
- [x] show error if throw error
- [x] fix favicon small
- [ ] touch zoom in mobile
- [x] button next chap

- [x] multiple pre search
- [x] control plugin separate
- [ ] fix url with proxy wrong

- [ ] use QScrollArea and QVirtualScroll

- [x] bootloop in page read if plugin not install

### Customize the configuration

See [Configuring quasar.config.ts](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

### Thanks for

This project couldn't exist without other great open source (or free) projects. We (`Manga Raiku Team`) sincerely thank the open source developers and organizations that keep their amazing tools free.
| | |
| ---- | ---- |
| ![capacitorjs](https://capacitorjs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-light.6f15363c.png&w=256&q=75) | Core technology allows the app to run on Android and iOS |
| ![quasarjs](https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg) | Material UI Lite UI framework based on Vue 3 |
| ![codecov](https://about.codecov.io/wp-content/themes/codecov/assets/brand/sentry-cobranding/logos/codecov-by-sentry-logo.svg) | Code error scanner |
| ![CodeSee](https://assets-global.website-files.com/61d5fe8761f6e57c29b38c10/61fb09acbc7d710af9f03cf5_Logo.svg) | Free code mapping service |
| ![Snyk](https://res.cloudinary.com/snyk/image/upload/snyk-mktg-brandui/brand-logos/wordmark-logo-color.svg) | Find and automatically fix vulnerabilities in your code, open source dependencies, containers, and IaC — powered by Snyk’s industry-leading security intelligence and DeepCode AI. |
| ![sonar](https://sonarcloud.io/apple-touch-icon-180x180.png) | Free cloud error scanner |
| ![socket](https://socket.dev/images/logo-280x80.png) | Socket fights vulnerabilities and provides visibility, defense-in-depth, and proactive supply chain protection for JavaScript, Python, and Go dependencies. |
| ![codeium](https://codeium.com/favicon.svg) | A Free AI-Powered Toolkit for Developers. |
| ![netlify](https://www.netlify.com/favicon/icon.svg) | Netlify is the modern web development platform for Enterprises to realize the full potential of a scalable, customizable web architecture. |

---

and other free and open source services.

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmanga-raiku%2Fmanga-raiku.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmanga-raiku%2Fmanga-raiku?ref=badge_large)
