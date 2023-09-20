module.exports = {
  type: "bundle", // bundle or transform (see description above)
  esbuild: {
    loader: { ".png": "base64" },
  },
}
