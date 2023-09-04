import { effect, reactive } from "@/reactive"
describe("reactive", () => {
  it("代理对象", () => {
    const original = { count: 0 }
    const reactiveObj = reactive(original)
    expect(reactiveObj.count).toBe(0)
  })

  it("reactive should be once", () => {
    const original = { count: 0 }
    const reactiveObj = reactive(original)
    const reactiveObj1 = reactive(reactiveObj)
    expect(reactiveObj1).toEqual(reactiveObj)
    const reactiveObj2 = reactive(original)
    expect(reactiveObj2).toEqual(reactiveObj)
  })

  it("effect", () => {
    let dummy
    const reactiveObj = reactive({ count: 0 })
    const spyFn = vi.fn(() => console.log(reactiveObj.count))
    effect(() => (dummy = reactiveObj.count))
    effect(spyFn)
    expect(dummy).toBe(0)
    expect(spyFn).toBeCalledTimes(1)
    reactiveObj.count = 1
    expect(dummy).toBe(1)
    expect(spyFn).toBeCalledTimes(2)
    reactiveObj.count = 1
    expect(spyFn).toBeCalledTimes(2)
  })

  it("对象深度代理", () => {
    let dummy
    const obj = reactive({
      state: {
        count: 0,
      },
    })
    effect(() => (dummy = obj.state.count))
    expect(dummy).toBe(0)
    obj.state.count = 2
    expect(dummy).toBe(2)
  })

  it("数组", () => {
    const state = reactive({
      list: [1, 2, 3],
    })
    effect(() => {
      console.log(state.list[4])
      console.log(state.list.length)
    })
    expect(state.list[3]).undefined
    expect(state.list.length).toBe(3)
    state.list.push(4)
    expect(state.list[3]).toBe(4)
    expect(state.list.length).toBe(4)
    state.list.push(4)
    expect(state.list[3]).toBe(4)
    expect(state.list.length).toBe(5)
  })

  it("effect嵌套", () => {
    const state = reactive({
      count0: 0,
      count1: 1,
    })
    let dummy0, dummy1
    effect(() => {
      effect(() => {
        dummy1 = state.count1
      })
      dummy0 = state.count0
    })
    expect(dummy0).toBe(0)
    expect(dummy1).toBe(1)
    state.count1++
    expect(dummy0).toBe(0)
    expect(dummy1).toBe(2)
    state.count0++
    expect(dummy0).toBe(1)
    expect(dummy1).toBe(2)
  })
})
