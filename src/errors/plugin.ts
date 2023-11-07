export enum STATUS_PLUGIN_INSTALL {
  INSTALLED = "plugin_installed",
  NOT_FOUND = "plugin_not_found",
  NOT_AVAILABLE = "plugins_not_available",
  NOT_SUPPORT_PLATFORM = "plugin_not_support_platform"
}
export class PluginError extends Error {
  name = "PluginError"
  constructor(
    public readonly sourceId: string,
    public readonly code:
      | STATUS_PLUGIN_INSTALL.NOT_FOUND
      | STATUS_PLUGIN_INSTALL.NOT_SUPPORT_PLATFORM
  ) {
    super(code)
  }
}
export class PluginsNotAvailable extends Error {
  name = "PluginNotAvailable"
  constructor() {
    super(STATUS_PLUGIN_INSTALL.NOT_AVAILABLE)
  }
}
