const effectStack = []
let activeEffect

type EffectOption = {
  lazy?: boolean
  scheduler?: () => void
}

export function effect(fn, options: EffectOption = {}) {
  const effectFn = () => {
    try {
      activeEffect = effectFn
      effectStack.push(activeEffect)
      return fn()
    } catch (error) {
    } finally {
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1]
    }
  }
  if (!options.lazy) {
    effectFn()
  }
  effectFn.scheduler = options.scheduler
  return effectFn
}

const targetMap: WeakMap<
  any,
  Map<any, Set<Function & { scheduler: () => void }>>
> = new WeakMap()
export function track(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  if (!deps) return
  deps.forEach((effectFn) => {
    if (effectFn.scheduler) {
      effectFn.scheduler()
    } else {
      effectFn()
    }
  })
}
