import { computed, ref } from "@/reactive"

describe("computed", () => {
  it("getter", () => {
    const count = ref(2)
    const spyFn = vi.fn(() => count.value * 2)
    const computedCount = computed(spyFn)
    expect(computedCount.value).toBe(4)
    expect(spyFn).toBeCalledTimes(1)
    console.log(computedCount.value)
    expect(spyFn).toBeCalledTimes(1)
    count.value = 3
    // 依赖变化不会使函数立即执行
    expect(spyFn).toBeCalledTimes(1)
    expect(computedCount.value).toBe(6)
    expect(spyFn).toBeCalledTimes(2)
  })

  it("同时设置getter和setter", () => {
    const count = ref(2)
    const computedCount = computed({
      set(newValue) {
        count.value = newValue
      },
      get() {
        return count.value * 2
      },
    })
    expect(computedCount.value).toBe(4)
    computedCount.value = 6
    expect(computedCount.value).toBe(12)
  })
})
