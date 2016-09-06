(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["onLinkFollowed"] = factory();
	else
		root["onLinkFollowed"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _aTags = __webpack_require__(1);
	
	var _windowOpen = __webpack_require__(2);
	
	var _historyState = __webpack_require__(3);
	
	var attachToAll = function attachToAll(win, rootNode, emitter) {
	  // Attach to A tags
	  (0, _aTags.attach)(win, rootNode, emitter);
	
	  // Overwrite window.open
	  (0, _windowOpen.attach)(win, rootNode, emitter);
	
	  // Overwrite history.pushState / history.replaceState
	  (0, _historyState.attach)(win, rootNode, emitter);
	
	  // Attach to onbeforeunload
	  // set window.location
	  // window.onpopstate?
	  // history.forward / history.back / history.go?
	  // Copy & paste url? - will do onbeforeunload
	};
	
	var detachFromAll = function detachFromAll(win, rootNode) {
	  (0, _aTags.detach)(win, rootNode);
	  (0, _windowOpen.detach)(win, rootNode);
	  (0, _historyState.detach)(win, rootNode);
	};
	
	var onLinkFollowed = function onLinkFollowed(win, rootNode) {
	  var emitter = {
	    emit: function emit(data) {
	      return console.log(data);
	    }
	  };
	
	  // internal object for storing state
	  win._emmerich_olf = {
	    listeners: []
	  };
	
	  attachToAll(win, rootNode, emitter);
	
	  return {
	    on: function on(listener) {
	      win._emmerich_olf.listeners = win._emmerich_olf.listeners.concat(listener);
	      return win._emmerich_olf.listeners.length - 1;
	    }
	  };
	};
	
	var offLinkFollowed = function offLinkFollowed(win, rootNode) {
	  detachFromAll(win, rootNode);
	  win._emmerich_olf = null;
	  delete win._emmerich_olf;
	};
	
	exports.default = {
	  initWithWindow: function initWithWindow(win, rootNode) {
	    return onLinkFollowed(win, rootNode);
	  },
	  init: function init() {
	    return this.initWithWindow(window, window.document.body);
	  },
	  removeFromWindow: function removeFromWindow(win, rootNode) {
	    return offLinkFollowed(win, rootNode);
	  },
	  remove: function remove() {
	    return this.removeFromWindow(window, window.document.body);
	  }
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var A_TAG = 'A_TAG';
	var RIGHT_CLICK = 2;
	
	var getLinkFollowedPacket = function getLinkFollowedPacket(ev) {
	  // ev.target references the element that was clicked, but ev.currentTarget
	  // references the element that we attached the event handler to, so we know
	  // its an a tag
	  return {
	    destination: ev.currentTarget.href,
	    type: A_TAG,
	    params: {
	      element: ev.currentTarget,
	      target: ev.target
	    }
	  };
	};
	
	var onMouseDown = function onMouseDown(emitter) {
	  return function (ev) {
	    if (ev.button === RIGHT_CLICK) {
	      emitter.emit('onMaybeLinkFollowed', getLinkFollowedPacket(ev));
	    }
	  };
	};
	
	var onClick = function onClick(emitter) {
	  return function (ev) {
	    emitter.emit('onLinkFollowed', getLinkFollowedPacket(ev));
	  };
	};
	
	var forEachATag = function forEachATag(rootNode, fn) {
	  var aTags = rootNode.getElementsByTagName('a');
	
	  for (var i = 0; i < aTags.length; i++) {
	    fn(aTags[i], i);
	  }
	};
	
	var attach = exports.attach = function attach(win, rootNode, emitter) {
	  win._emmerich_olf._aTagListeners = [];
	
	  forEachATag(rootNode, function (a) {
	    var clickListener = onClick(emitter);
	    var mdListener = onMouseDown(emitter);
	
	    win._emmerich_olf._aTagListeners.push([a, [['click', clickListener], ['mousedown', mdListener]]]);
	
	    a.addEventListener('click', clickListener);
	    a.addEventListener('mousedown', mdListener);
	  });
	};
	
	var detach = exports.detach = function detach(win, rootNode) {
	  win._emmerich_olf._aTagListeners.forEach(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 2);
	
	    var node = _ref2[0];
	    var listeners = _ref2[1];
	
	    listeners.forEach(function (_ref3) {
	      var _ref4 = _slicedToArray(_ref3, 2);
	
	      var name = _ref4[0];
	      var handler = _ref4[1];
	
	      node.removeEventListener(name, handler);
	    });
	  });
	
	  win._emmerich_olf._aTagListeners = [];
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var WINDOW_OPEN = 'WINDOW_OPEN';
	
	var wrappedWindowOpen = function wrappedWindowOpen(win, emitter) {
	  return function (url, target, args) {
	    emitter.emit('onLinkFollowed', { destination: url, type: WINDOW_OPEN });
	    win._emmerich_olf.winOpen.call(win, url, target, args);
	  };
	};
	
	var attach = exports.attach = function attach(win, rootNode, emitter) {
	  win._emmerich_olf.winOpen = win.open;
	  win.open = wrappedWindowOpen(win, emitter);
	};
	
	var detach = exports.detach = function detach(win, rootNode, emitter) {
	  win.open = win._emmerich_olf.winOpen;
	  win._emmerich_olf.winOpen = null;
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var HISTORY_PUSHSTATE = 'HISTORY_PUSHSTATE';
	var HISTORY_REPLACESTATE = 'HISTORY_REPLACESTATE';
	
	var wrapped = function wrapped(win, emitter, method, type) {
	  return function (state, title, url) {
	    try {
	      method.call(win.history, state, title, url);
	    } catch (err) {
	      // pushState / replaceState will throw an exception if the domain cannot
	      // be reached. If that happens we don't want to fire onLinkFollowed, we
	      // want to rethrow the exception
	      throw err;
	    }
	
	    emitter.emit('onLinkFollowed', { destination: window.location.href, type: type });
	  };
	};
	
	var attach = exports.attach = function attach(win, rootNode, emitter) {
	  win._emmerich_olf.historyPushState = win.history.pushState;
	  win._emmerich_olf.historyReplaceState = win.history.replaceState;
	
	  win.history.pushState = wrapped(win, emitter, win._emmerich_olf.historyPushState, HISTORY_PUSHSTATE);
	  win.history.replaceState = wrapped(win, emitter, win._emmerich_olf.historyReplaceState, HISTORY_REPLACESTATE);
	};
	
	var detach = exports.detach = function detach(win, rootNode) {
	  win.history.pushState = win._emmerich_olf.historyPushState;
	  win.history.replaceState = win._emmerich_olf.historyReplaceState;
	
	  win._emmerich_olf.historyPushState = null;
	  win._emmerich_olf.historyReplaceState = null;
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=on-link-followed.js.map