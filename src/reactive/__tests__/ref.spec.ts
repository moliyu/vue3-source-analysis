import { effect, ref } from "@/reactive"

describe("ref", () => {
  it("基本数据类型", () => {
    let dummy
    const count = ref(0)
    effect(() => {
      dummy = count.value
    })
    expect(dummy).toBe(0)
    count.value = 10
    expect(dummy).toBe(10)
  })

  it("对象", () => {
    let dummy
    const state = ref({ count: 0 })
    effect(() => (dummy = state.value.count))
    expect(dummy).toBe(0)
    state.value.count++
    expect(dummy).toBe(1)
  })
})
