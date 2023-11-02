import { spawnSync } from "child_process"
import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"
import { exit } from "process"

import { bold, green, red } from "kleur"
import prompts from "prompts"
import semver, { valid as isValidVersion, SemVer } from "semver"

const CFBundleVersion = "CURRENT_PROJECT_VERSION"
const CFBundleShortVersionString = "MARKETING_VERSION"

async function bumppiOS() {
  const iOSDir = resolve(__dirname, "../src-capacitor/ios")

  const buildGradle = readFileSync(
    resolve(iOSDir, "App/App.xcodeproj/project.pbxproj"),
    "utf8"
  )

  const indexBundleVersion = buildGradle.indexOf(
    `${CFBundleVersion} = `,
    buildGradle.indexOf(`${CFBundleVersion} = `) + 1
  )
  const indexBundleVersionString = buildGradle.indexOf(
    `${CFBundleShortVersionString} = `,
    buildGradle.indexOf(`${CFBundleShortVersionString} = `) + 1
  )

  if (indexBundleVersion === -1) {
    console.error(red("CFBundleVersion not found in build.gradle"))
    exit(1)
  }
  if (indexBundleVersionString === -1) {
    console.error(red("CFBundleShortVersionString not found in build.gradle"))
    exit(1)
  }

  const _t1 = buildGradle.slice(indexBundleVersion + CFBundleVersion.length + 3)
  const currentVersionCode = parseInt(_t1.slice(0, _t1.indexOf("\n")).trim())
  const _t2 = buildGradle.slice(
    indexBundleVersionString + CFBundleShortVersionString.length + 3
  )
  const currentVersionName = _t2.slice(0, _t2.indexOf(";\n")).trim()

  const PADDING = 13

  const options = await prompts([
    {
      type: "autocomplete",
      name: "versionCode",
      message: `Current versionCode ${green(currentVersionCode)}`,
      initial: 0,
      choices: [
        {
          value: currentVersionCode + 1,
          title: `${"next".padStart(PADDING, " ")} ${bold(
            currentVersionCode + 1
          )}`,
          selected: true
        },
        {
          value: currentVersionCode,
          title: `${"as-it".padStart(PADDING, " ")} ${bold(currentVersionCode)}`
        },
        { value: "custom", title: "custom ...".padStart(PADDING + 4, " ") }
      ]
    },
    {
      type: (prev) => (prev === "custom" ? "number" : null),
      name: "customVersionCode",
      message: "Enter the new version number:",
      initial: currentVersionCode,
      validate: (value: number) =>
        value >= currentVersionCode
          ? true
          : "Invalid version code. The new version must be higher than the old version"
    },
    {
      type: "select",
      name: "versionName",
      initial: 3,
      message: `Current versionName ${green(currentVersionName)}:`,
      choices: (
        [
          "major",
          "minor",
          "patch",

          "next",

          "prepatch",

          "preminor",
          "prerelease"
        ] as (semver.ReleaseType | "next")[]
      )
        .map((name) => {
          const value =
            name === "next"
              ? semver.parse(currentVersionName)?.prerelease?.length
                ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  semver.inc(currentVersionName, "prerelease")!
                : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  semver.inc(currentVersionName, "patch")!
              : new SemVer(currentVersionName).inc(name)

          return { title: `${name.padStart(PADDING, " ")} ${value}`, value }
        })
        .concat([
          { value: "custom", title: "custom ...".padStart(PADDING + 4, " ") }
        ])
    },
    {
      type: (prev) => (prev === "custom" ? "text" : null),
      name: "customVersionName",
      message: "Enter the new version number:",
      initial: currentVersionName,
      validate: (custom: string) => {
        return isValidVersion(custom)
          ? true
          : "That's not a valid version number"
      }
    }
  ])

  const newVersionCode =
    options.versionCode === "custom"
      ? options.customVersionCode
      : options.versionCode
  const newVersionName =
    options.versionName === "custom"
      ? options.customVersionName
      : options.versionName

  if (!newVersionCode) {
    console.error("new CFBundleVersion is not defined")
    exit(1)
  }
  if (!newVersionName) {
    console.error("new CFBundleShortVersionString is not defined")
    exit(1)
  }

  const newBuildGradle = buildGradle
    .replace(
      `${CFBundleVersion} = ${currentVersionCode}`,
      `${CFBundleVersion} = ${newVersionCode}`
    )
    .replace(
      `${CFBundleVersion} = ${currentVersionCode}`,
      `${CFBundleVersion} = ${newVersionCode}`
    )
    .replace(
      `${CFBundleShortVersionString} = ${currentVersionName}`,
      `${CFBundleShortVersionString} = ${newVersionName}`
    )
    .replace(
      `${CFBundleShortVersionString} = ${currentVersionName}`,
      `${CFBundleShortVersionString} = ${newVersionName}`
    )

  writeFileSync(
    resolve(iOSDir, "App/App.xcodeproj/project.pbxproj"),
    newBuildGradle
  )

  spawnSync(
    "git",
    ["add", `${resolve(iOSDir, "App/App.xcodeproj/project.pbxproj")}`],
    {
      stdio: "inherit"
    }
  )
  spawnSync(
    "git",
    [
      "commit",
      "-m",
      `(chore): release iOS ${newVersionName} build ${newVersionCode}`
    ],
    { stdio: "inherit" }
  )
  spawnSync("git", ["tag", `ios@${newVersionName}#${newVersionCode}`])
  spawnSync("git", ["push"], { stdio: "inherit" })
  spawnSync("git", ["push", "--tags"], { stdio: "inherit" })
}

console.log(bold(green(" === Bumpp version for Capacitor iOS === ")))
void bumppiOS()
