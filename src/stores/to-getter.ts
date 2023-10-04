export function toGetter<
  Props extends Record<string, unknown>,
  Name extends keyof Props
>(props: Props, name: Name): ComputedRef<Props[Name]> {
  return computed(() => props[name])
}
