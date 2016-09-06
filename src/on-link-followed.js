import { attach as attachToATags, detach as detachFromATags } from './aTags'
import { attach as attachToWindowOpen, detach as detachFromWindowOpen } from './windowOpen'
import { attach as attachToHistoryPushAndReplaceState, detach as detachFromHistoryPushAndReplaceState } from './historyState'

const attachToAll = (win, rootNode, emitter) => {
  // Attach to A tags
  attachToATags(win, rootNode, emitter)

  // Overwrite window.open
  attachToWindowOpen(win, rootNode, emitter)

  // Overwrite history.pushState / history.replaceState
  attachToHistoryPushAndReplaceState(win, rootNode, emitter)

  // Attach to onbeforeunload
  // set window.location
  // window.onpopstate?
  // history.forward / history.back / history.go?
  // Copy & paste url? - will do onbeforeunload
}

const detachFromAll = (win, rootNode) => {
  detachFromATags(win, rootNode)
  detachFromWindowOpen(win, rootNode)
  detachFromHistoryPushAndReplaceState(win, rootNode)
}

const onLinkFollowed = (win, rootNode) => {
  const emitter = {
    emit: (data) => console.log(data)
  }

  // internal object for storing state
  win._emmerich_olf = {
    listeners: []
  }

  attachToAll(win, rootNode, emitter)

  return {
    on(listener) {
      win._emmerich_olf.listeners = win._emmerich_olf.listeners.concat(listener)
      return win._emmerich_olf.listeners.length - 1
    }
  }
};

const offLinkFollowed = (win, rootNode) => {
  detachFromAll(win, rootNode)
  win._emmerich_olf = null
  delete win._emmerich_olf
}

export default {
  initWithWindow(win, rootNode) {
    return onLinkFollowed(win, rootNode)
  },

  init() {
    return this.initWithWindow(window, window.document.body)
  },

  removeFromWindow(win, rootNode) {
    return offLinkFollowed(win, rootNode)
  },

  remove() {
    return this.removeFromWindow(window, window.document.body)
  }
};
