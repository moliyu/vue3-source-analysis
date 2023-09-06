export function isObj(val: unknown): val is object {
  return val && val !== null && typeof val === "object"
}

export function hasChanged(oldValue, value) {
  return !Object.is(oldValue, value)
}

export const isArray = Array.isArray

export function isString(val): val is string {
  return typeof val === "string"
}
export function isNumber(val): val is number {
  return typeof val === "number"
}
export function isBoolean(val): val is boolean {
  return typeof val === "boolean"
}
