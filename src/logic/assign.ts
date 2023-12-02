export function assign<A extends object, B extends object>(a: A, b: B): A & B {
  return Object.assign(a, b)
}
