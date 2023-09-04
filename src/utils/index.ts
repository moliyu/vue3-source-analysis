export function isObj(val: unknown): val is object {
  return val && val !== null && typeof val === "object"
}

export function hasChanged(oldValue, value) {
  return !Object.is(oldValue, value)
}

export const isArray = Array.isArray
