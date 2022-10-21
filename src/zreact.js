function createElement(type, props = {}, ...children) {
  return {
    type,
    props: {
      ...props,
      type,
      children: children.map((child) => (typeof child === 'object' ? child : createTextElement(child))),
    },
  }
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

let wipRoot = null
let nextUnitOfWork = null

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  }
  nextUnitOfWork = wipRoot
}

function workLoop(deadline) {
  let shouleYield = false
  if (!shouleYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouleYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot(wipRoot.child)
    wipRoot = null
  }
  window.requestIdleCallback(workLoop)
}
workLoop()

function commitRoot(fiber) {
  if (!fiber) return
  let domParent = fiber.return
  console.log('%c [ domParent ]-67', 'font-size:13px; background:pink; color:#bf2c9f;', domParent)

  while (!domParent.dom) {
    domParent = domParent.return
  }
  
  if (fiber.dom && domParent.dom) {
    domParent.dom.appendChild(fiber.dom)
  }
  commitRoot(fiber.child)
  commitRoot(fiber.sibling)
}

function createDom(fiber) {
  let dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)
      const isProperty = (p) => p !== 'children'
    Object.keys(fiber.props)
      .filter(isProperty)
      .forEach((key) => {
        dom[key] = fiber.props[key]
      })
  return dom
}

// 生成对应的fiber
function performUnitOfWork(fiberNode) {
  if (typeof fiberNode.type === 'function') {
    reconcileChild(fiberNode, [fiberNode.type(fiberNode.props)])
  } else {
    if (!fiberNode.dom) {
      fiberNode.dom = createDom(fiberNode)
    }
    reconcileChild(fiberNode, fiberNode.props.children)
  }

  if (fiberNode.child) {
    return fiberNode.child
  }

  let nextFiber = fiberNode
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.return
  }
}

function reconcileChild(fiber, children) {
  let index = 0
  let preFiber = null

  while (index < children.length) {
    let element = children[index]
    let newFiber = {
      type: element.type,
      dom: null,
      props: element.props,
      return: fiber,
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      preFiber.sibling = newFiber
    }
    preFiber = newFiber

    index++
  }
}

export default {
  createElement,
  render,
}
