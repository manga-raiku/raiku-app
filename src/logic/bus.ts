export class EventBus<Events extends Record<string, unknown[]>> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  private readonly events: Record<keyof Events, Set<Function> | undefined> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as unknown as any

  public on<Name extends keyof Events>(
    name: Name,
    cb: (...args: Events[Name]) => void,
    instance = getCurrentInstance()
  ) {
    if (!(name in this.events))
      this.events[name] = new Set<(...args: unknown[]) => void>()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.events[name]!.add(cb)

    if (instance) onBeforeUnmount(() => this.off(name, cb), instance)
  }

  public off<Name extends keyof Events>(
    name: Name,
    cb: (...args: Events[Name]) => void
  ) {
    this.events[name]?.delete(cb)
  }

  // eslint-disable-next-line functional/functional-parameters
  public emit<Name extends keyof Events>(name: Name, ...args: Events[Name]) {
    // eslint-disable-next-line n/no-callback-literal
    this.events[name]?.forEach((cb) => cb(...args))
  }
}
