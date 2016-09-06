const RIGHT_CLICK = 2
const listeners = {
  'click': null,
  'mousedown': null
}

const getLinkFollowedPacket = (ev) => {
  return {
    destination: ev.target.href
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
  forEachATag(rootNode, (a) => {
    listeners.click = onClick(emitter)
    listeners.mousedown = onMouseDown(emitter)

    a.addEventListener('click', listeners.click)
    a.addEventListener('mousedown', listeners.mousedown)
  })
}

export const detach = (win, rootNode) => {
  forEachATag(rootNode, (a) => {
    a.removeEventListener('click', listeners.click)
    a.removeEventListener('mousedown', listeners.mousedown)

    listeners.click = null
    listeners.mousedown = null
  })
}
