import { hasChanged, isObj } from "@/utils"
import { track, trigger } from "./effect"
import { reactive } from "./reactivity"

export function isRef(val) {
  return !!(val && val._isRef)
}

export function ref<T>(target: T): RefImpl<T> {
  if (isRef(target)) {
    return target as RefImpl<T>
  }
  return new RefImpl(target)
}

function convert(val) {
  return isObj(val) ? reactive(val) : val
}

class RefImpl<T> {
  protected _isRef: boolean
  protected _value: T
  constructor(value) {
    this._isRef = true
    // 如果value是基本数据类型直接返回
    // 否则需要reactive包裹
    this._value = convert(value)
  }
  get value() {
    track(this, "value")
    return this._value
  }
  set value(newValue) {
    if (hasChanged(newValue, this._value)) {
      // 此处set的值也可能是个对象
      this._value = convert(newValue)
      trigger(this, "value")
    }
  }
}
