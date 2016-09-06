import { attach, detach } from '../../src/historyState'

describe('history.pushState / history.replaceState', () => {

  const doc = window.document
  const root = doc.body
  const emitter = { emit: sinon.stub() }

  let pushState
  let replaceState
  let pathBeforeTests

  beforeEach(() => {
    pathBeforeTests = window.location.pathname
    window._emmerich_olf = {}

    window.history.pushState = pushState = sinon.spy(window.history, 'pushState')
    window.history.replaceState = replaceState = sinon.spy(window.history, 'replaceState')

    attach(window, root, emitter)
  })

  afterEach(() => {
    detach(window, root)

    window.history.pushState.restore()
    window.history.replaceState.restore()

    // reset the state
    window.history.pushState({}, '', pathBeforeTests)

    emitter.emit.reset()
  })

  describe('attach function', () => {
    it('should maintain the original functionality of history.pushState after attaching', () => {
      window.history.pushState({ foo: 'bar' }, 'test page', 'myPage.html')

      expect(pushState).to.have.been.calledOnce
      expect(pushState).to.have.been.calledWithExactly({ foo: 'bar' }, 'test page', 'myPage.html')
    })

    it('should maintain the original functionality of history.pushState after attaching', () => {
      window.history.replaceState({ foo: 'bar' }, 'test page', 'myPage.html')

      expect(replaceState).to.have.been.calledOnce
      expect(replaceState).to.have.been.calledWithExactly({ foo: 'bar' }, 'test page', 'myPage.html')
    })
  })

  describe('events', () => {
    it('should emit onLinkFollowed event for history.pushState', () => {
      window.history.pushState({ foo: 'bar' }, 'test page', 'myPage.html')

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://localhost:8080/test/myPage.html' })
    })

    it('should emit onLinkFollowed event for history.replaceState', () => {
      window.history.replaceState({ foo: 'bar' }, 'test page', 'myPage.html')

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://localhost:8080/test/myPage.html' })
    })

    it('should emit onLinkFollowed event for history.pushState without a file extension', () => {
      window.history.pushState({ foo: 'bar' }, 'test page', '/user/12345')

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://localhost:8080/user/12345' })
    })

    it('should emit onLinkFollowed event for history.replaceState without a file extension', () => {
      window.history.replaceState({ foo: 'bar' }, 'test page', '/user/12345')

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://localhost:8080/user/12345' })
    })

    it('should emit onLinkFollowed event for history.pushState if the url is absolute', () => {
      window.history.pushState({ foo: 'bar' }, 'test page', 'http://localhost:8080/hello/world')

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://localhost:8080/hello/world' })
    })

    it('should emit onLinkFollowed event for history.replaceState if the url is absolute', () => {
      window.history.replaceState({ foo: 'bar' }, 'test page', 'http://localhost:8080/hello/world')

      expect(emitter.emit).to.have.been.calledOnce
      expect(emitter.emit).to.have.been.calledWithExactly('onLinkFollowed', { destination: 'http://localhost:8080/hello/world' })
    })

    it('should not emit an event for history.pushState if the url is not on the same domain', () => {
      try {
        window.history.pushState({ foo: 'bar' }, 'test page', 'http://www.google.com')
      } catch (err) {}

      expect(emitter.emit).to.not.have.been.called
    })

    it('should not emit an event for history.replaceState if the url is not on the same domain', () => {
      try {
        window.history.replaceState({ foo: 'bar' }, 'test page', 'http://www.google.com')
      } catch (err) {}

      expect(emitter.emit).to.not.have.been.called
    })
  })

  describe('throwing exceptions for non-same domains', () => {
    it('should still throw an exception for a non-same domain state on pushState', () => {
      try {
        window.history.pushState({ foo: 'bar' }, 'test page', 'http://www.google.com')
      } catch (ex) {
        expect(ex).to.be.an.instanceof(window.DOMException)
        return
      }

      assert.fail()
    })

    it('should still throw an exception for a non-same domain state on replaceState', () => {
      try {
        window.history.replaceState({ foo: 'bar' }, 'test page', 'http://www.google.com')
      } catch (ex) {
        expect(ex).to.be.an.instanceof(window.DOMException)
        return
      }

      assert.fail()
    })

    it('should still throw an exception for a non-same subdomain on pushState', () => {
      try {
        window.history.pushState({ foo: 'bar' }, 'test page', 'http://test.localhost:8080')
      } catch (ex) {
        expect(ex).to.be.an.instanceof(window.DOMException)
        return
      }

      assert.fail()
    })

    it('should still throw an exception for a non-same subdomain on replaceState', () => {
      try {
        window.history.pushState({ foo: 'bar' }, 'test page', 'http://test.localhost:8080')
      } catch (ex) {
        expect(ex).to.be.an.instanceof(window.DOMException)
        return
      }

      assert.fail()
    })
  })
})
