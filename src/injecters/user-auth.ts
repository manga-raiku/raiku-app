import { encryptText } from "src/logic/cryper"
import { copyToClipboard } from "src/logic/copy-to-clipboard"

!(async () => {
  const user_auth = localStorage.getItem("user-auth")

  try {
    if (!user_auth)
      throw new Error(
        "Auth not exists. Please goto nettruyen and login first run script!"
      )

    const text = JSON.stringify(
      await encryptText(user_auth, process.env.CRYPTO_PASSWORD)
    )
    await copyToClipboard(text)
    alert("Copied binary auth! Please go back app.")
  } catch (err) {
    alert(err.message)
  }
})()
