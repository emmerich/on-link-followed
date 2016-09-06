import onLinkFollowed from '../../src/on-link-followed';

describe('onLinkFollowed', () => {

  describe('Initial object', () => {
    it('should not be possible to listen to the initial object', () => {
      expect(onLinkFollowed).not.to.have.ownProperty('on')
    })

    it('should be possible to init the inital object', () => {
      expect(onLinkFollowed).to.have.ownProperty('init')
      expect(onLinkFollowed.init).to.be.instanceof(Function)
    })

    it('should be possible to init the initial object with a custom window', () => {
      expect(onLinkFollowed).to.have.ownProperty('initWithWindow')
      expect(onLinkFollowed.initWithWindow).to.be.instanceof(Function)
    })
  })

  describe('InitWithWindow function', () => {
    let initObj

    beforeEach(() => {
      initObj = onLinkFollowed.initWithWindow(window, window.document)
    })

    afterEach(() => {
      onLinkFollowed.removeFromWindow(window, window.document)
    })

    it('should return an object we can listen to', () => {
      expect(initObj).to.have.ownProperty('on')
      expect(initObj.on).to.be.instanceof(Function)
    })
  })

})
