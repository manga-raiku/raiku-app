/// <reference no-default-lib="true"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

self.postMessage("load")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((self as unknown as any).__DEFINE_PACKAGE__) {
  // if exists emit config to main
  self.postMessage({
    ok: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: (self as unknown as any).__DEFINE_PACKAGE__
  })
} else {
  // not exists emit error
  self.postMessage({
    ok: false,
    data: 'The code may not contain "definePackage" or something has broken this data structure.'
  })
}

self.close()
