import { isBoolean } from "@/utils"
import { ShapeFlags, VNode } from "./vnode"

export function render(vnode, container) {
  mount(vnode, container)
}

function mount(vnode: VNode, container) {
  const { shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.ELEMENT) {
    mountElement(vnode, container)
  } else if (shapeFlag & ShapeFlags.TEXT) {
    mountTextNode(vnode, container)
  } else if (shapeFlag & ShapeFlags.FRAGMENT) {
    mountFragment(vnode, container)
  } else {
    mountComponent(vnode, container)
  }
}

function mountElement(vnode: VNode, container) {
  const { type, props, children } = vnode
  const el = document.createElement(type as string)
  mountProps(props, el)
  mountChildren(vnode, el)
  container.appendChild(el)
}
function mountTextNode(vnode: VNode, container) {
  const textNode = document.createTextNode(vnode.children)
  container.appendChild(textNode)
}
function mountFragment(vnode: VNode, container) {
  mountChildren(vnode, container)
}
function mountComponent(vnode: VNode, container) {}

const domPropsRE = /[A-Z]|^(value|checked|selected|muted|disabled)$/
function mountProps(props, el: HTMLElement) {
  for (const key in props) {
    let value = props[key]
    switch (key) {
      case "class":
        el.className = value
        break
      case "style":
        Object.entries(value).forEach(([key, val]) => {
          el.style[key] = val
        })
        break
      default:
        if (/^on[^a-z]/.test(key)) {
          const eventName = key.slice(2)
          el.addEventListener(eventName, value)
        } else if (domPropsRE.test(key)) {
          if (value == "" && isBoolean(el[key])) {
            value = true
          }
          el[key] = value
        } else {
          if (value == null || value === false) {
            el.removeAttribute(key)
          } else {
            el.setAttribute(key, value)
          }
        }
        break
    }
  }
}
function mountChildren(vnode: VNode, container) {
  const { shapeFlag, children } = vnode
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    mountTextNode(vnode, container)
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    children.forEach((child) => mount(child, container))
  }
}
