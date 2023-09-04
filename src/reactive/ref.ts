import { track, trigger } from "./effect"

export function isRef(val) {
  return !!(val && val._isRef)
}

export function ref<T>(target): RefImpl<T> {
  if (isRef(target)) {
    return target
  }
  return new RefImpl(target)
}

class RefImpl<T> {
  protected _isRef: boolean
  protected _value: T
  constructor(value) {
    this._isRef = true
    this._value = value
  }
  get value() {
    track(this, "value")
    return this._value
  }
  set value(newValue) {
    this._value = newValue
    trigger(this, "value")
  }
}
