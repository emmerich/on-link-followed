const HISTORY_PUSHSTATE = 'HISTORY_PUSHSTATE'
const HISTORY_REPLACESTATE = 'HISTORY_REPLACESTATE'

const wrapped = (win, emitter, method, type) => (state, title, url) => {
  try {
    method.call(win.history, state, title, url)
  } catch (err) {
    // pushState / replaceState will throw an exception if the domain cannot
    // be reached. If that happens we don't want to fire onLinkFollowed, we
    // want to rethrow the exception
    throw err
  }

  emitter.emit('onLinkFollowed', { destination: window.location.href, type })
}

export const attach = (win, rootNode, emitter) => {
  win._emmerich_olf.historyPushState = win.history.pushState
  win._emmerich_olf.historyReplaceState = win.history.replaceState

  win.history.pushState = wrapped(win, emitter, win._emmerich_olf.historyPushState, HISTORY_PUSHSTATE)
  win.history.replaceState = wrapped(win, emitter, win._emmerich_olf.historyReplaceState, HISTORY_REPLACESTATE)
}

export const detach = (win, rootNode) => {
  win.history.pushState = win._emmerich_olf.historyPushState
  win.history.replaceState = win._emmerich_olf.historyReplaceState

  win._emmerich_olf.historyPushState = null
  win._emmerich_olf.historyReplaceState = null
}
