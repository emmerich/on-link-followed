import { attach, detach } from '../../src/aTags'

describe('A Tags', () => {

  const doc = window.document
  const emitter = { emit: sinon.stub() }

  const root = doc.createElement('div')
  const aTag = doc.createElement('a')
  aTag.href = 'http://www.google.com/'

  const stopEvent = (ev) => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    return false
  }

  beforeEach(() => {
    root.appendChild(aTag)
    doc.body.appendChild(root)

    sinon.spy(root, 'getElementsByTagName')
    sinon.spy(aTag, 'addEventListener')

    // Attach the handler to the window
    attach(window, root, emitter)

    // Stop all propagation so that if we run the tests in the browser, we don't
    // follow the link of the a tag
    aTag.addEventListener('click', stopEvent)
  })

  afterEach(() => {
    root.getElementsByTagName.restore()
    aTag.addEventListener.restore()
    emitter.emit.reset()

    root.remove()
    detach(window, root)

    aTag.removeEventListener('click', stopEvent)
  })

  describe('Attach function', () => {
    it('should attach to all A tags', () => {
      expect(root.getElementsByTagName).to.have.been.calledOnce
      expect(root.getElementsByTagName).to.have.been.calledWithExactly('a')
    })
  })

  describe('Left click on A tag', () => {
    it('should emit onLinkFollowed events when an A tag is clicked', () => {
      aTag.click()

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://www.google.com/' })
    })
  })

  describe('Right click on A tag', () => {
    it('should emit onMaybeLinkFollowed events when an A tag is right clicked', () => {
      aTag.dispatchEvent(new window.MouseEvent('mousedown', { button: '2', buttons: '2' }))

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onMaybeLinkFollowed', { destination: 'http://www.google.com/' })
    })

    it('should not emit onLinkFollowed event with an A tag is right clicked', () => {
      aTag.click()

      expect(emitter.emit).to.have.not.been.calledWithExactly('onMaybeLinkFollowed', { destination: 'http://www.google.com/' })
    })
  })

  describe('Middle click on A tag', () => {
    it('should emit onLinkFollowed events when an A tag is clicked with the middle mouse button', () => {
      aTag.dispatchEvent(new window.MouseEvent('click', { button: '2', buttons: '2' }))

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://www.google.com/' })
    })
  })
})
