import { computed, effect, reactive } from "@/reactive"

const original = { count: 0, count1: 1 }
const obj = reactive(original)

const obj1 = reactive(obj)
console.log("obj1 == obj:", obj == obj1)

const obj2 = reactive(original)
console.log("obj2 == obj:", obj2 == obj)

obj1.count = 0
// obj1.count = 1

effect(() => {
  effect(() => {
    console.log("count1 is :", obj.count1)
  })
  console.log("count0 is :", obj.count)
})

const computedCount = computed(() => {
  console.log("重新计算")
  return obj.count
})

// @ts-ignore
window._obj = obj
// @ts-ignore
window._computedCount = computedCount
