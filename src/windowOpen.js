const wrappedWindowOpen = (win, emitter) => (url, target, args) => {
  emitter.emit('onLinkFollowed', { destination: url })
  win._emmerich_olf.winOpen.call(win, url, target, args)
}

export const attach = (win, rootNode, emitter) => {
  win._emmerich_olf.winOpen = win.open
  win.open = wrappedWindowOpen(win, emitter)
}

export const detach = (win, rootNode, emitter) => {
  win.open = win._emmerich_olf.winOpen
  win._emmerich_olf.winOpen = null
}
