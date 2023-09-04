import { effect, track, trigger } from "@/reactive"

export type Effect<T> =
  | Function
  | {
      get: () => T
      set?: (val) => void
    }

export function computed<T>(effect: Effect<T>) {
  let getter, setter
  if (typeof effect === "function") {
    getter = effect
    setter = () => {
      console.warn("getter is readOnly")
    }
  } else {
    getter = effect.get
    setter = effect.set
  }
  return new ComputedImpl<T>(getter, setter)
}

class ComputedImpl<T> {
  protected _dirty: boolean
  effect: Function
  protected _value: T
  protected _setter
  constructor(getter, setter) {
    this._dirty = true
    this._setter = setter
    this.effect = effect(getter, {
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true
          trigger(this, "value")
        }
      },
    })
  }

  get value() {
    if (this._dirty) {
      this._value = this.effect()
      this._dirty = false
      track(this, "value")
    }
    return this._value
  }

  set value(newValue) {
    this._setter(newValue)
  }
}
