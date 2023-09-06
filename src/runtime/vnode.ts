import { isArray, isNumber, isString } from "@/utils"

export const enum ShapeFlags {
  ELEMENT = 1,
  TEXT = 1 << 1,
  FRAGMENT = 1 << 2,
  COMPONENT = 1 << 3,
  TEXT_CHILDREN = 1 << 4,
  ARRAY_CHILDREN = 1 << 5,
  CHILDREN = ShapeFlags.TEXT_CHILDREN | ShapeFlags.ARRAY_CHILDREN,
}

export const Text = Symbol("Text")
export const Fragment = Symbol("Fragment")

type Type = string | typeof Text | typeof Fragment

export function h(type: Type, props, children) {
  let shapeFlag: ShapeFlags
  if (isString(type)) {
    shapeFlag = ShapeFlags.ELEMENT
  } else if (type == Text) {
    shapeFlag = ShapeFlags.TEXT
  } else if (type == Fragment) {
    shapeFlag = ShapeFlags.FRAGMENT
  } else {
    shapeFlag = ShapeFlags.COMPONENT
  }

  if (isString(children) || isNumber(children)) {
    shapeFlag |= ShapeFlags.TEXT_CHILDREN
    children = children.toString()
  } else if (isArray(children)) {
    shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  return {
    type,
    props,
    children,
    shapeFlag,
  }
}

export type VNode = ReturnType<typeof h>
