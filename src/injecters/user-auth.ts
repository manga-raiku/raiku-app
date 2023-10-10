/* eslint-disable camelcase */
import { copyToClipboard } from "src/logic/copy-to-clipboard"
import { encryptText } from "src/logic/cryper"

// eslint-disable-next-line no-unused-expressions
!(async () => {
  const user_auth = localStorage.getItem("user-auth")

  try {
    if (!user_auth)
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(
        "Auth not exists. Please goto nettruyen and login first run script!"
      )

    const text = JSON.stringify(
      await encryptText(user_auth, process.env.CRYPTO_PASSWORD as string)
    )
    await copyToClipboard(text)
    alert("Copied binary auth! Please go back app.")
  } catch (err) {
    alert((err as Error).message + "")
  }
})()
