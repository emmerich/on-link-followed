import { attach, detach } from '../../src/aTags'

describe('A Tags', () => {

  const doc = window.document
  const emitter = { emit: sinon.stub() }

  const root = doc.createElement('div')
  const aTag = doc.createElement('a')
  aTag.href = 'http://www.google.com/'

  const nestedATag = doc.createElement('a')
  nestedATag.href = 'http://www.google.com'

  const nestedSpan = doc.createElement('span')
  nestedATag.appendChild(nestedSpan)

  const twoNestedATag = doc.createElement('a')
  twoNestedATag.href = 'http://www.google.com'

  const twoNestedOuterSpan = doc.createElement('span')
  const twoNestedInnerSpan = doc.createElement('span')

  twoNestedOuterSpan.appendChild(twoNestedInnerSpan)
  twoNestedATag.appendChild(twoNestedOuterSpan)

  const stopEvent = (ev) => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    return false
  }

  beforeEach(() => {
    window._emmerich_olf = {}
    root.appendChild(aTag)
    root.appendChild(nestedATag)
    root.appendChild(twoNestedATag)
    doc.body.appendChild(root)

    sinon.spy(root, 'getElementsByTagName')
    sinon.spy(aTag, 'addEventListener')

    // Attach the handler to the window
    attach(window, root, emitter)

    // Stop all propagation so that if we run the tests in the browser, we don't
    // follow the link of the a tag
    aTag.addEventListener('click', stopEvent)
    nestedATag.addEventListener('click', stopEvent)
    twoNestedATag.addEventListener('click', stopEvent)
  })

  afterEach(() => {
    root.getElementsByTagName.restore()
    aTag.addEventListener.restore()
    emitter.emit.reset()

    root.remove()
    detach(window, root)

    aTag.removeEventListener('click', stopEvent)
    nestedATag.removeEventListener('click', stopEvent)
    twoNestedATag.removeEventListener('click', stopEvent)
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
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://www.google.com/', type: 'A_TAG', params: { element: aTag, target: aTag } })
    })
  })

  describe('Right click on A tag', () => {
    it('should emit onMaybeLinkFollowed events when an A tag is right clicked', () => {
      aTag.dispatchEvent(new window.MouseEvent('mousedown', { button: 2, buttons: 2 }))

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onMaybeLinkFollowed', { destination: 'http://www.google.com/', type: 'A_TAG', params: { element: aTag, target: aTag } })
    })

    it('should not emit onLinkFollowed event with an A tag is right clicked', () => {
      aTag.click()

      expect(emitter.emit).to.have.not.been.calledWithExactly('onMaybeLinkFollowed', { destination: 'http://www.google.com/', type: 'A_TAG', params: { element: aTag, target: aTag } })
    })
  })

  describe('Middle click on A tag', () => {
    it('should emit onLinkFollowed events when an A tag is clicked with the middle mouse button', () => {
      aTag.dispatchEvent(new window.MouseEvent('click', { button: 1, buttons: 4 }))

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://www.google.com/', type: 'A_TAG', params: { element: aTag, target: aTag } })
    })
  })

  describe('Nested elements', () => {
    it('should still emit the correct href and event if the a tag has a span nested within', () => {
      nestedSpan.click()

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://www.google.com/', type: 'A_TAG', params: { element: nestedATag, target: nestedSpan } })
    })

    it('should still emit the correct href and event when nested 2 deep', () => {
      twoNestedInnerSpan.click()

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://www.google.com/', type: 'A_TAG', params: { element: twoNestedATag, target: twoNestedInnerSpan } })
    })

  })


})
