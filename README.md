# on-link-followed

Detects when links are followed in the browser.

[![Travis build status](http://img.shields.io/travis/emmerich/on-link-followed.svg?style=flat)](https://travis-ci.org/emmerich/on-link-followed)
[![Code Climate](https://codeclimate.com/github/emmerich/on-link-followed/badges/gpa.svg)](https://codeclimate.com/github/emmerich/on-link-followed)
[![Test Coverage](https://codeclimate.com/github/emmerich/on-link-followed/badges/coverage.svg)](https://codeclimate.com/github/emmerich/on-link-followed)
[![Dependency Status](https://david-dm.org/emmerich/on-link-followed.svg)](https://david-dm.org/emmerich/on-link-followed)
[![devDependency Status](https://david-dm.org/emmerich/on-link-followed/dev-status.svg)](https://david-dm.org/emmerich/on-link-followed#info=devDependencies)

## Description
There are many ways to redirect a user to a different page in the browser. This
plugin aims to normalize all of those methods into one `onLinkFollowed` event.

### Supported Methods
* a tags
  * Left-click
  * Middle-click
  * Right-click (sends an onMaybeLinkFollowed because the user is not obligated to click open)
* window.open
* window.history.pushState
* window.history.replaceState


### Unsupported Methods
* window.history.forward / window.history.back / window.history.go (These will modify the existing state anyways, rather than create new states)
* window.location = xxx
* Manual methods like copying a URL and pasting in the address bar, or manually typing a URL

## Development
### Set up & Testing
* Clone the repository
* Run `npm install`
* Run `npm install -g gulp`
* Run `gulp test-browser`
* Go to `localhost:8080/test/runner.html`
