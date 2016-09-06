const A_TAG = 'A_TAG'
const RIGHT_CLICK = 2

const getLinkFollowedPacket = (ev) => {
  // ev.target references the element that was clicked, but ev.currentTarget
  // references the element that we attached the event handler to, so we know
  // its an a tag
  return {
    destination: ev.currentTarget.href,
    type: A_TAG,
    params: {
      element: ev.currentTarget,
      target: ev.target
    }
  }
}

const onMouseDown = (emitter) => (ev) => {
  if(ev.button === RIGHT_CLICK) {
    emitter.emit('onMaybeLinkFollowed', getLinkFollowedPacket(ev))
  }
}

const onClick = (emitter) => (ev) => {
  emitter.emit('onLinkFollowed', getLinkFollowedPacket(ev))
}

const forEachATag = (rootNode, fn) => {
  const aTags = rootNode.getElementsByTagName('a')

  for(let i = 0; i < aTags.length; i++) {
    fn(aTags[i], i)
  }
}

export const attach = (win, rootNode, emitter) => {
  win._emmerich_olf._aTagListeners = []

  forEachATag(rootNode, (a) => {
    const clickListener = onClick(emitter)
    const mdListener = onMouseDown(emitter)

    win._emmerich_olf._aTagListeners.push([a, [
      ['click', clickListener], ['mousedown', mdListener]]])

    a.addEventListener('click', clickListener)
    a.addEventListener('mousedown', mdListener)
  })
}

export const detach = (win, rootNode) => {
  win._emmerich_olf._aTagListeners.forEach(([node, listeners]) => {
    listeners.forEach(([name, handler]) => {
      node.removeEventListener(name, handler)
    })
  })

  win._emmerich_olf._aTagListeners = []
}
