function uintToString(uint: Uint8Array): string {
  return uint.reduce(
    (prev, byte) => prev + byte.toString(16).padStart(2, "0"),
    ""
  )
}
function stringToUint(str: string): number[] {
  const buffer = []
  for (let i = 0; i < str.length; i += 2) {
    buffer.push(parseInt(str[i] + str[i + 1], 16))
  }
  return buffer
}

export async function encryptText(text: string, password: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  )
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    data
  )
  return {
    iv: uintToString(iv),
    salt: uintToString(salt),
    buffer: uintToString(new Uint8Array(encryptedContent))
  }
}

export async function decryptText(
  encryptedText: {
    iv: string
    salt: string
    buffer: string
  },
  password: string
) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  )
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(stringToUint(encryptedText.salt)).buffer,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )
  const decryptedContent = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(stringToUint(encryptedText.iv)).buffer
    },
    key,
    new Uint8Array(stringToUint(encryptedText.buffer)).buffer
  )
  return decoder.decode(decryptedContent)
}
