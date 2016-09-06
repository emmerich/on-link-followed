import { attach, detach } from '../../src/windowOpen'

describe('window.open', () => {

  const doc = window.document
  const root = doc.body
  const emitter = { emit: sinon.stub() }
  const mockOpen = sinon.stub()

  beforeEach(() => {
    window._emmerich_olf = {}
    window.open = mockOpen
    attach(window, root, emitter)
  })

  afterEach(() => {
    detach(window, root)
    emitter.emit.reset()
  })

  describe('attach function', () => {
    it('should maintain the original functionality of window.open after attaching', () => {
      window.open('http://www.google.com')

      expect(mockOpen).to.have.been.calledOnce
    })
  })

  describe('events', () => {
    it('should emit onLinkFollowed event with the destination', () => {
      window.open('http://www.google.com')

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://www.google.com' })
    })

    it('should emit onLinkFollowed event with the destination if the target is _blank', () => {
      window.open('http://www.google.com', '_blank')

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://www.google.com' })
    })
  })
})
