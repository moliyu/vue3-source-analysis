import { hasChanged, isArray, isObj } from "@/utils"
import { track, trigger } from "./effect"

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

const proxyMap = new WeakMap()

export function reactive<T = object>(target: T): T
export function reactive(target) {
  if (!isObj(target)) {
    return target
  }

  if (isReactive(target)) {
    return target
  }

  if (proxyMap.has(target)) {
    return proxyMap.get(target)
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) return true
      const res = Reflect.get(target, key, receiver)
      track(target, key)
      return isObj(res) ? reactive(res) : res
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const isArr = isArray(target)
      let oldLength = isArr && target.length
      const res = Reflect.set(target, key, value, receiver)
      if (hasChanged(oldValue, value)) {
        trigger(target, key)
        if (isArray(target) && hasChanged(oldLength, target.length)) {
          trigger(target, "length")
        }
      }
      return res
    },
  })

  proxyMap.set(target, proxy)

  return proxy
}

export function isReactive(target) {
  return !!(target && target[ReactiveFlags.IS_REACTIVE])
}
