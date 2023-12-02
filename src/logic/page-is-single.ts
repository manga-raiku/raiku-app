export function pageIsSingle(width: number, height: number): boolean {
  return width / height > 1.2 // width > 1_200 // temporary check
}
