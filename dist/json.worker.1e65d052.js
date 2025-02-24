// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/monaco-editor/esm/vs/base/common/winjs.base.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
var define;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PPromise = exports.TPromise = exports.Promise = void 0;

/**
 * Extracted from https://github.com/winjs/winjs
 * Version: 4.4.0(ec3258a9f3a36805a187848984e3bb938044178d)
 * Copyright (c) Microsoft Corporation.
 * All Rights Reserved.
 * Licensed under the MIT License.
 */
var __winjs_exports;

(function () {
  var _modules = Object.create(null); //{};


  _modules["WinJS/Core/_WinJS"] = {};

  var _winjs = function (moduleId, deps, factory) {
    var exports = {};
    var exportsPassedIn = false;
    var depsValues = deps.map(function (dep) {
      if (dep === 'exports') {
        exportsPassedIn = true;
        return exports;
      }

      return _modules[dep];
    });
    var result = factory.apply({}, depsValues);
    _modules[moduleId] = exportsPassedIn ? exports : result;
  };

  _winjs("WinJS/Core/_Global", [], function () {
    "use strict"; // Appease jshint

    /* global window, self, global */

    var globalObject = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : {};
    return globalObject;
  });

  _winjs("WinJS/Core/_BaseCoreUtils", ["WinJS/Core/_Global"], function baseCoreUtilsInit(_Global) {
    "use strict";

    var hasWinRT = !!_Global.Windows;

    function markSupportedForProcessing(func) {
      /// <signature helpKeyword="WinJS.Utilities.markSupportedForProcessing">
      /// <summary locid="WinJS.Utilities.markSupportedForProcessing">
      /// Marks a function as being compatible with declarative processing, such as WinJS.UI.processAll
      /// or WinJS.Binding.processAll.
      /// </summary>
      /// <param name="func" type="Function" locid="WinJS.Utilities.markSupportedForProcessing_p:func">
      /// The function to be marked as compatible with declarative processing.
      /// </param>
      /// <returns type="Function" locid="WinJS.Utilities.markSupportedForProcessing_returnValue">
      /// The input function.
      /// </returns>
      /// </signature>
      func.supportedForProcessing = true;
      return func;
    }

    var actualSetImmediate = null;
    return {
      hasWinRT: hasWinRT,
      markSupportedForProcessing: markSupportedForProcessing,
      _setImmediate: function (callback) {
        // BEGIN monaco change
        if (actualSetImmediate === null) {
          if (_Global.setImmediate) {
            actualSetImmediate = _Global.setImmediate.bind(_Global);
          } else if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
            actualSetImmediate = process.nextTick.bind(process);
          } else {
            actualSetImmediate = _Global.setTimeout.bind(_Global);
          }
        }

        actualSetImmediate(callback); // END monaco change
      }
    };
  });

  _winjs("WinJS/Core/_WriteProfilerMark", ["WinJS/Core/_Global"], function profilerInit(_Global) {
    "use strict";

    return _Global.msWriteProfilerMark || function () {};
  });

  _winjs("WinJS/Core/_Base", ["WinJS/Core/_WinJS", "WinJS/Core/_Global", "WinJS/Core/_BaseCoreUtils", "WinJS/Core/_WriteProfilerMark"], function baseInit(_WinJS, _Global, _BaseCoreUtils, _WriteProfilerMark) {
    "use strict";

    function initializeProperties(target, members, prefix) {
      var keys = Object.keys(members);
      var isArray = Array.isArray(target);
      var properties;
      var i, len;

      for (i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];
        var enumerable = key.charCodeAt(0) !==
        /*_*/
        95;
        var member = members[key];

        if (member && typeof member === 'object') {
          if (member.value !== undefined || typeof member.get === 'function' || typeof member.set === 'function') {
            if (member.enumerable === undefined) {
              member.enumerable = enumerable;
            }

            if (prefix && member.setName && typeof member.setName === 'function') {
              member.setName(prefix + "." + key);
            }

            properties = properties || {};
            properties[key] = member;
            continue;
          }
        }

        if (!enumerable) {
          properties = properties || {};
          properties[key] = {
            value: member,
            enumerable: enumerable,
            configurable: true,
            writable: true
          };
          continue;
        }

        if (isArray) {
          target.forEach(function (target) {
            target[key] = member;
          });
        } else {
          target[key] = member;
        }
      }

      if (properties) {
        if (isArray) {
          target.forEach(function (target) {
            Object.defineProperties(target, properties);
          });
        } else {
          Object.defineProperties(target, properties);
        }
      }
    }

    (function () {
      var _rootNamespace = _WinJS;

      if (!_rootNamespace.Namespace) {
        _rootNamespace.Namespace = Object.create(Object.prototype);
      }

      function createNamespace(parentNamespace, name) {
        var currentNamespace = parentNamespace || {};

        if (name) {
          var namespaceFragments = name.split(".");

          if (currentNamespace === _Global && namespaceFragments[0] === "WinJS") {
            currentNamespace = _WinJS;
            namespaceFragments.splice(0, 1);
          }

          for (var i = 0, len = namespaceFragments.length; i < len; i++) {
            var namespaceName = namespaceFragments[i];

            if (!currentNamespace[namespaceName]) {
              Object.defineProperty(currentNamespace, namespaceName, {
                value: {},
                writable: false,
                enumerable: true,
                configurable: true
              });
            }

            currentNamespace = currentNamespace[namespaceName];
          }
        }

        return currentNamespace;
      }

      function defineWithParent(parentNamespace, name, members) {
        /// <signature helpKeyword="WinJS.Namespace.defineWithParent">
        /// <summary locid="WinJS.Namespace.defineWithParent">
        /// Defines a new namespace with the specified name under the specified parent namespace.
        /// </summary>
        /// <param name="parentNamespace" type="Object" locid="WinJS.Namespace.defineWithParent_p:parentNamespace">
        /// The parent namespace.
        /// </param>
        /// <param name="name" type="String" locid="WinJS.Namespace.defineWithParent_p:name">
        /// The name of the new namespace.
        /// </param>
        /// <param name="members" type="Object" locid="WinJS.Namespace.defineWithParent_p:members">
        /// The members of the new namespace.
        /// </param>
        /// <returns type="Object" locid="WinJS.Namespace.defineWithParent_returnValue">
        /// The newly-defined namespace.
        /// </returns>
        /// </signature>
        var currentNamespace = createNamespace(parentNamespace, name);

        if (members) {
          initializeProperties(currentNamespace, members, name || "<ANONYMOUS>");
        }

        return currentNamespace;
      }

      function define(name, members) {
        /// <signature helpKeyword="WinJS.Namespace.define">
        /// <summary locid="WinJS.Namespace.define">
        /// Defines a new namespace with the specified name.
        /// </summary>
        /// <param name="name" type="String" locid="WinJS.Namespace.define_p:name">
        /// The name of the namespace. This could be a dot-separated name for nested namespaces.
        /// </param>
        /// <param name="members" type="Object" locid="WinJS.Namespace.define_p:members">
        /// The members of the new namespace.
        /// </param>
        /// <returns type="Object" locid="WinJS.Namespace.define_returnValue">
        /// The newly-defined namespace.
        /// </returns>
        /// </signature>
        return defineWithParent(_Global, name, members);
      }

      var LazyStates = {
        uninitialized: 1,
        working: 2,
        initialized: 3
      };

      function lazy(f) {
        var name;
        var state = LazyStates.uninitialized;
        var result;
        return {
          setName: function (value) {
            name = value;
          },
          get: function () {
            switch (state) {
              case LazyStates.initialized:
                return result;

              case LazyStates.uninitialized:
                state = LazyStates.working;

                try {
                  _WriteProfilerMark("WinJS.Namespace._lazy:" + name + ",StartTM");

                  result = f();
                } finally {
                  _WriteProfilerMark("WinJS.Namespace._lazy:" + name + ",StopTM");

                  state = LazyStates.uninitialized;
                }

                f = null;
                state = LazyStates.initialized;
                return result;

              case LazyStates.working:
                throw "Illegal: reentrancy on initialization";

              default:
                throw "Illegal";
            }
          },
          set: function (value) {
            switch (state) {
              case LazyStates.working:
                throw "Illegal: reentrancy on initialization";

              default:
                state = LazyStates.initialized;
                result = value;
                break;
            }
          },
          enumerable: true,
          configurable: true
        };
      } // helper for defining AMD module members


      function moduleDefine(exports, name, members) {
        var target = [exports];
        var publicNS = null;

        if (name) {
          publicNS = createNamespace(_Global, name);
          target.push(publicNS);
        }

        initializeProperties(target, members, name || "<ANONYMOUS>");
        return publicNS;
      } // Establish members of the "WinJS.Namespace" namespace


      Object.defineProperties(_rootNamespace.Namespace, {
        defineWithParent: {
          value: defineWithParent,
          writable: true,
          enumerable: true,
          configurable: true
        },
        define: {
          value: define,
          writable: true,
          enumerable: true,
          configurable: true
        },
        _lazy: {
          value: lazy,
          writable: true,
          enumerable: true,
          configurable: true
        },
        _moduleDefine: {
          value: moduleDefine,
          writable: true,
          enumerable: true,
          configurable: true
        }
      });
    })();

    (function () {
      function define(constructor, instanceMembers, staticMembers) {
        /// <signature helpKeyword="WinJS.Class.define">
        /// <summary locid="WinJS.Class.define">
        /// Defines a class using the given constructor and the specified instance members.
        /// </summary>
        /// <param name="constructor" type="Function" locid="WinJS.Class.define_p:constructor">
        /// A constructor function that is used to instantiate this class.
        /// </param>
        /// <param name="instanceMembers" type="Object" locid="WinJS.Class.define_p:instanceMembers">
        /// The set of instance fields, properties, and methods made available on the class.
        /// </param>
        /// <param name="staticMembers" type="Object" locid="WinJS.Class.define_p:staticMembers">
        /// The set of static fields, properties, and methods made available on the class.
        /// </param>
        /// <returns type="Function" locid="WinJS.Class.define_returnValue">
        /// The newly-defined class.
        /// </returns>
        /// </signature>
        constructor = constructor || function () {};

        _BaseCoreUtils.markSupportedForProcessing(constructor);

        if (instanceMembers) {
          initializeProperties(constructor.prototype, instanceMembers);
        }

        if (staticMembers) {
          initializeProperties(constructor, staticMembers);
        }

        return constructor;
      }

      function derive(baseClass, constructor, instanceMembers, staticMembers) {
        /// <signature helpKeyword="WinJS.Class.derive">
        /// <summary locid="WinJS.Class.derive">
        /// Creates a sub-class based on the supplied baseClass parameter, using prototypal inheritance.
        /// </summary>
        /// <param name="baseClass" type="Function" locid="WinJS.Class.derive_p:baseClass">
        /// The class to inherit from.
        /// </param>
        /// <param name="constructor" type="Function" locid="WinJS.Class.derive_p:constructor">
        /// A constructor function that is used to instantiate this class.
        /// </param>
        /// <param name="instanceMembers" type="Object" locid="WinJS.Class.derive_p:instanceMembers">
        /// The set of instance fields, properties, and methods to be made available on the class.
        /// </param>
        /// <param name="staticMembers" type="Object" locid="WinJS.Class.derive_p:staticMembers">
        /// The set of static fields, properties, and methods to be made available on the class.
        /// </param>
        /// <returns type="Function" locid="WinJS.Class.derive_returnValue">
        /// The newly-defined class.
        /// </returns>
        /// </signature>
        if (baseClass) {
          constructor = constructor || function () {};

          var basePrototype = baseClass.prototype;
          constructor.prototype = Object.create(basePrototype);

          _BaseCoreUtils.markSupportedForProcessing(constructor);

          Object.defineProperty(constructor.prototype, "constructor", {
            value: constructor,
            writable: true,
            configurable: true,
            enumerable: true
          });

          if (instanceMembers) {
            initializeProperties(constructor.prototype, instanceMembers);
          }

          if (staticMembers) {
            initializeProperties(constructor, staticMembers);
          }

          return constructor;
        } else {
          return define(constructor, instanceMembers, staticMembers);
        }
      }

      function mix(constructor) {
        /// <signature helpKeyword="WinJS.Class.mix">
        /// <summary locid="WinJS.Class.mix">
        /// Defines a class using the given constructor and the union of the set of instance members
        /// specified by all the mixin objects. The mixin parameter list is of variable length.
        /// </summary>
        /// <param name="constructor" locid="WinJS.Class.mix_p:constructor">
        /// A constructor function that is used to instantiate this class.
        /// </param>
        /// <returns type="Function" locid="WinJS.Class.mix_returnValue">
        /// The newly-defined class.
        /// </returns>
        /// </signature>
        constructor = constructor || function () {};

        var i, len;

        for (i = 1, len = arguments.length; i < len; i++) {
          initializeProperties(constructor.prototype, arguments[i]);
        }

        return constructor;
      } // Establish members of "WinJS.Class" namespace


      _WinJS.Namespace.define("WinJS.Class", {
        define: define,
        derive: derive,
        mix: mix
      });
    })();

    return {
      Namespace: _WinJS.Namespace,
      Class: _WinJS.Class
    };
  });

  _winjs("WinJS/Core/_ErrorFromName", ["WinJS/Core/_Base"], function errorsInit(_Base) {
    "use strict";

    var ErrorFromName = _Base.Class.derive(Error, function (name, message) {
      /// <signature helpKeyword="WinJS.ErrorFromName">
      /// <summary locid="WinJS.ErrorFromName">
      /// Creates an Error object with the specified name and message properties.
      /// </summary>
      /// <param name="name" type="String" locid="WinJS.ErrorFromName_p:name">The name of this error. The name is meant to be consumed programmatically and should not be localized.</param>
      /// <param name="message" type="String" optional="true" locid="WinJS.ErrorFromName_p:message">The message for this error. The message is meant to be consumed by humans and should be localized.</param>
      /// <returns type="Error" locid="WinJS.ErrorFromName_returnValue">Error instance with .name and .message properties populated</returns>
      /// </signature>
      this.name = name;
      this.message = message || name;
    }, {
      /* empty */
    }, {
      supportedForProcessing: false
    });

    _Base.Namespace.define("WinJS", {
      // ErrorFromName establishes a simple pattern for returning error codes.
      //
      ErrorFromName: ErrorFromName
    });

    return ErrorFromName;
  });

  _winjs("WinJS/Core/_Events", ["exports", "WinJS/Core/_Base"], function eventsInit(exports, _Base) {
    "use strict";

    function createEventProperty(name) {
      var eventPropStateName = "_on" + name + "state";
      return {
        get: function () {
          var state = this[eventPropStateName];
          return state && state.userHandler;
        },
        set: function (handler) {
          var state = this[eventPropStateName];

          if (handler) {
            if (!state) {
              state = {
                wrapper: function (evt) {
                  return state.userHandler(evt);
                },
                userHandler: handler
              };
              Object.defineProperty(this, eventPropStateName, {
                value: state,
                enumerable: false,
                writable: true,
                configurable: true
              });
              this.addEventListener(name, state.wrapper, false);
            }

            state.userHandler = handler;
          } else if (state) {
            this.removeEventListener(name, state.wrapper, false);
            this[eventPropStateName] = null;
          }
        },
        enumerable: true
      };
    }

    function createEventProperties() {
      /// <signature helpKeyword="WinJS.Utilities.createEventProperties">
      /// <summary locid="WinJS.Utilities.createEventProperties">
      /// Creates an object that has one property for each name passed to the function.
      /// </summary>
      /// <param name="events" locid="WinJS.Utilities.createEventProperties_p:events">
      /// A variable list of property names.
      /// </param>
      /// <returns type="Object" locid="WinJS.Utilities.createEventProperties_returnValue">
      /// The object with the specified properties. The names of the properties are prefixed with 'on'.
      /// </returns>
      /// </signature>
      var props = {};

      for (var i = 0, len = arguments.length; i < len; i++) {
        var name = arguments[i];
        props["on" + name] = createEventProperty(name);
      }

      return props;
    }

    var EventMixinEvent = _Base.Class.define(function EventMixinEvent_ctor(type, detail, target) {
      this.detail = detail;
      this.target = target;
      this.timeStamp = Date.now();
      this.type = type;
    }, {
      bubbles: {
        value: false,
        writable: false
      },
      cancelable: {
        value: false,
        writable: false
      },
      currentTarget: {
        get: function () {
          return this.target;
        }
      },
      defaultPrevented: {
        get: function () {
          return this._preventDefaultCalled;
        }
      },
      trusted: {
        value: false,
        writable: false
      },
      eventPhase: {
        value: 0,
        writable: false
      },
      target: null,
      timeStamp: null,
      type: null,
      preventDefault: function () {
        this._preventDefaultCalled = true;
      },
      stopImmediatePropagation: function () {
        this._stopImmediatePropagationCalled = true;
      },
      stopPropagation: function () {}
    }, {
      supportedForProcessing: false
    });

    var eventMixin = {
      _listeners: null,
      addEventListener: function (type, listener, useCapture) {
        /// <signature helpKeyword="WinJS.Utilities.eventMixin.addEventListener">
        /// <summary locid="WinJS.Utilities.eventMixin.addEventListener">
        /// Adds an event listener to the control.
        /// </summary>
        /// <param name="type" locid="WinJS.Utilities.eventMixin.addEventListener_p:type">
        /// The type (name) of the event.
        /// </param>
        /// <param name="listener" locid="WinJS.Utilities.eventMixin.addEventListener_p:listener">
        /// The listener to invoke when the event is raised.
        /// </param>
        /// <param name="useCapture" locid="WinJS.Utilities.eventMixin.addEventListener_p:useCapture">
        /// if true initiates capture, otherwise false.
        /// </param>
        /// </signature>
        useCapture = useCapture || false;
        this._listeners = this._listeners || {};
        var eventListeners = this._listeners[type] = this._listeners[type] || [];

        for (var i = 0, len = eventListeners.length; i < len; i++) {
          var l = eventListeners[i];

          if (l.useCapture === useCapture && l.listener === listener) {
            return;
          }
        }

        eventListeners.push({
          listener: listener,
          useCapture: useCapture
        });
      },
      dispatchEvent: function (type, details) {
        /// <signature helpKeyword="WinJS.Utilities.eventMixin.dispatchEvent">
        /// <summary locid="WinJS.Utilities.eventMixin.dispatchEvent">
        /// Raises an event of the specified type and with the specified additional properties.
        /// </summary>
        /// <param name="type" locid="WinJS.Utilities.eventMixin.dispatchEvent_p:type">
        /// The type (name) of the event.
        /// </param>
        /// <param name="details" locid="WinJS.Utilities.eventMixin.dispatchEvent_p:details">
        /// The set of additional properties to be attached to the event object when the event is raised.
        /// </param>
        /// <returns type="Boolean" locid="WinJS.Utilities.eventMixin.dispatchEvent_returnValue">
        /// true if preventDefault was called on the event.
        /// </returns>
        /// </signature>
        var listeners = this._listeners && this._listeners[type];

        if (listeners) {
          var eventValue = new EventMixinEvent(type, details, this); // Need to copy the array to protect against people unregistering while we are dispatching

          listeners = listeners.slice(0, listeners.length);

          for (var i = 0, len = listeners.length; i < len && !eventValue._stopImmediatePropagationCalled; i++) {
            listeners[i].listener(eventValue);
          }

          return eventValue.defaultPrevented || false;
        }

        return false;
      },
      removeEventListener: function (type, listener, useCapture) {
        /// <signature helpKeyword="WinJS.Utilities.eventMixin.removeEventListener">
        /// <summary locid="WinJS.Utilities.eventMixin.removeEventListener">
        /// Removes an event listener from the control.
        /// </summary>
        /// <param name="type" locid="WinJS.Utilities.eventMixin.removeEventListener_p:type">
        /// The type (name) of the event.
        /// </param>
        /// <param name="listener" locid="WinJS.Utilities.eventMixin.removeEventListener_p:listener">
        /// The listener to remove.
        /// </param>
        /// <param name="useCapture" locid="WinJS.Utilities.eventMixin.removeEventListener_p:useCapture">
        /// Specifies whether to initiate capture.
        /// </param>
        /// </signature>
        useCapture = useCapture || false;
        var listeners = this._listeners && this._listeners[type];

        if (listeners) {
          for (var i = 0, len = listeners.length; i < len; i++) {
            var l = listeners[i];

            if (l.listener === listener && l.useCapture === useCapture) {
              listeners.splice(i, 1);

              if (listeners.length === 0) {
                delete this._listeners[type];
              } // Only want to remove one element for each call to removeEventListener


              break;
            }
          }
        }
      }
    };

    _Base.Namespace._moduleDefine(exports, "WinJS.Utilities", {
      _createEventProperty: createEventProperty,
      createEventProperties: createEventProperties,
      eventMixin: eventMixin
    });
  });

  _winjs("WinJS/Core/_Trace", ["WinJS/Core/_Global"], function traceInit(_Global) {
    "use strict";

    function nop(v) {
      return v;
    }

    return {
      _traceAsyncOperationStarting: _Global.Debug && _Global.Debug.msTraceAsyncOperationStarting && _Global.Debug.msTraceAsyncOperationStarting.bind(_Global.Debug) || nop,
      _traceAsyncOperationCompleted: _Global.Debug && _Global.Debug.msTraceAsyncOperationCompleted && _Global.Debug.msTraceAsyncOperationCompleted.bind(_Global.Debug) || nop,
      _traceAsyncCallbackStarting: _Global.Debug && _Global.Debug.msTraceAsyncCallbackStarting && _Global.Debug.msTraceAsyncCallbackStarting.bind(_Global.Debug) || nop,
      _traceAsyncCallbackCompleted: _Global.Debug && _Global.Debug.msTraceAsyncCallbackCompleted && _Global.Debug.msTraceAsyncCallbackCompleted.bind(_Global.Debug) || nop
    };
  });

  _winjs("WinJS/Promise/_StateMachine", ["WinJS/Core/_Global", "WinJS/Core/_BaseCoreUtils", "WinJS/Core/_Base", "WinJS/Core/_ErrorFromName", "WinJS/Core/_Events", "WinJS/Core/_Trace"], function promiseStateMachineInit(_Global, _BaseCoreUtils, _Base, _ErrorFromName, _Events, _Trace) {
    "use strict";

    _Global.Debug && (_Global.Debug.setNonUserCodeExceptions = true);

    var ListenerType = _Base.Class.mix(_Base.Class.define(null, {
      /*empty*/
    }, {
      supportedForProcessing: false
    }), _Events.eventMixin);

    var promiseEventListeners = new ListenerType(); // make sure there is a listeners collection so that we can do a more trivial check below

    promiseEventListeners._listeners = {};
    var errorET = "error";
    var canceledName = "Canceled";
    var tagWithStack = false;
    var tag = {
      promise: 0x01,
      thenPromise: 0x02,
      errorPromise: 0x04,
      exceptionPromise: 0x08,
      completePromise: 0x10
    };
    tag.all = tag.promise | tag.thenPromise | tag.errorPromise | tag.exceptionPromise | tag.completePromise; //
    // Global error counter, for each error which enters the system we increment this once and then
    // the error number travels with the error as it traverses the tree of potential handlers.
    //
    // When someone has registered to be told about errors (WinJS.Promise.callonerror) promises
    // which are in error will get tagged with a ._errorId field. This tagged field is the
    // contract by which nested promises with errors will be identified as chaining for the
    // purposes of the callonerror semantics. If a nested promise in error is encountered without
    // a ._errorId it will be assumed to be foreign and treated as an interop boundary and
    // a new error id will be minted.
    //

    var error_number = 1; //
    // The state machine has a interesting hiccup in it with regards to notification, in order
    // to flatten out notification and avoid recursion for synchronous completion we have an
    // explicit set of *_notify states which are responsible for notifying their entire tree
    // of children. They can do this because they know that immediate children are always
    // ThenPromise instances and we can therefore reach into their state to access the
    // _listeners collection.
    //
    // So, what happens is that a Promise will be fulfilled through the _completed or _error
    // messages at which point it will enter a *_notify state and be responsible for to move
    // its children into an (as appropriate) success or error state and also notify that child's
    // listeners of the state transition, until leaf notes are reached.
    //

    var state_created, // -> working
    state_working, // -> error | error_notify | success | success_notify | canceled | waiting
    state_waiting, // -> error | error_notify | success | success_notify | waiting_canceled
    state_waiting_canceled, // -> error | error_notify | success | success_notify | canceling
    state_canceled, // -> error | error_notify | success | success_notify | canceling
    state_canceling, // -> error_notify
    state_success_notify, // -> success
    state_success, // -> .
    state_error_notify, // -> error
    state_error; // -> .
    // Noop function, used in the various states to indicate that they don't support a given
    // message. Named with the somewhat cute name '_' because it reads really well in the states.

    function _() {} // Initial state
    //


    state_created = {
      name: "created",
      enter: function (promise) {
        promise._setState(state_working);
      },
      cancel: _,
      done: _,
      then: _,
      _completed: _,
      _error: _,
      _notify: _,
      _progress: _,
      _setCompleteValue: _,
      _setErrorValue: _
    }; // Ready state, waiting for a message (completed/error/progress), able to be canceled
    //

    state_working = {
      name: "working",
      enter: _,
      cancel: function (promise) {
        promise._setState(state_canceled);
      },
      done: done,
      then: then,
      _completed: completed,
      _error: error,
      _notify: _,
      _progress: progress,
      _setCompleteValue: setCompleteValue,
      _setErrorValue: setErrorValue
    }; // Waiting state, if a promise is completed with a value which is itself a promise
    // (has a then() method) it signs up to be informed when that child promise is
    // fulfilled at which point it will be fulfilled with that value.
    //

    state_waiting = {
      name: "waiting",
      enter: function (promise) {
        var waitedUpon = promise._value; // We can special case our own intermediate promises which are not in a
        //  terminal state by just pushing this promise as a listener without
        //  having to create new indirection functions

        if (waitedUpon instanceof ThenPromise && waitedUpon._state !== state_error && waitedUpon._state !== state_success) {
          pushListener(waitedUpon, {
            promise: promise
          });
        } else {
          var error = function (value) {
            if (waitedUpon._errorId) {
              promise._chainedError(value, waitedUpon);
            } else {
              // Because this is an interop boundary we want to indicate that this
              //  error has been handled by the promise infrastructure before we
              //  begin a new handling chain.
              //
              callonerror(promise, value, detailsForHandledError, waitedUpon, error);

              promise._error(value);
            }
          };

          error.handlesOnError = true;
          waitedUpon.then(promise._completed.bind(promise), error, promise._progress.bind(promise));
        }
      },
      cancel: function (promise) {
        promise._setState(state_waiting_canceled);
      },
      done: done,
      then: then,
      _completed: completed,
      _error: error,
      _notify: _,
      _progress: progress,
      _setCompleteValue: setCompleteValue,
      _setErrorValue: setErrorValue
    }; // Waiting canceled state, when a promise has been in a waiting state and receives a
    // request to cancel its pending work it will forward that request to the child promise
    // and then waits to be informed of the result. This promise moves itself into the
    // canceling state but understands that the child promise may instead push it to a
    // different state.
    //

    state_waiting_canceled = {
      name: "waiting_canceled",
      enter: function (promise) {
        // Initiate a transition to canceling. Triggering a cancel on the promise
        // that we are waiting upon may result in a different state transition
        // before the state machine pump runs again.
        promise._setState(state_canceling);

        var waitedUpon = promise._value;

        if (waitedUpon.cancel) {
          waitedUpon.cancel();
        }
      },
      cancel: _,
      done: done,
      then: then,
      _completed: completed,
      _error: error,
      _notify: _,
      _progress: progress,
      _setCompleteValue: setCompleteValue,
      _setErrorValue: setErrorValue
    }; // Canceled state, moves to the canceling state and then tells the promise to do
    // whatever it might need to do on cancelation.
    //

    state_canceled = {
      name: "canceled",
      enter: function (promise) {
        // Initiate a transition to canceling. The _cancelAction may change the state
        // before the state machine pump runs again.
        promise._setState(state_canceling);

        promise._cancelAction();
      },
      cancel: _,
      done: done,
      then: then,
      _completed: completed,
      _error: error,
      _notify: _,
      _progress: progress,
      _setCompleteValue: setCompleteValue,
      _setErrorValue: setErrorValue
    }; // Canceling state, commits to the promise moving to an error state with an error
    // object whose 'name' and 'message' properties contain the string "Canceled"
    //

    state_canceling = {
      name: "canceling",
      enter: function (promise) {
        var error = new Error(canceledName);
        error.name = error.message;
        promise._value = error;

        promise._setState(state_error_notify);
      },
      cancel: _,
      done: _,
      then: _,
      _completed: _,
      _error: _,
      _notify: _,
      _progress: _,
      _setCompleteValue: _,
      _setErrorValue: _
    }; // Success notify state, moves a promise to the success state and notifies all children
    //

    state_success_notify = {
      name: "complete_notify",
      enter: function (promise) {
        promise.done = CompletePromise.prototype.done;
        promise.then = CompletePromise.prototype.then;

        if (promise._listeners) {
          var queue = [promise];
          var p;

          while (queue.length) {
            p = queue.shift();

            p._state._notify(p, queue);
          }
        }

        promise._setState(state_success);
      },
      cancel: _,
      done: null,

      /*error to get here */
      then: null,

      /*error to get here */
      _completed: _,
      _error: _,
      _notify: notifySuccess,
      _progress: _,
      _setCompleteValue: _,
      _setErrorValue: _
    }; // Success state, moves a promise to the success state and does NOT notify any children.
    // Some upstream promise is owning the notification pass.
    //

    state_success = {
      name: "success",
      enter: function (promise) {
        promise.done = CompletePromise.prototype.done;
        promise.then = CompletePromise.prototype.then;

        promise._cleanupAction();
      },
      cancel: _,
      done: null,

      /*error to get here */
      then: null,

      /*error to get here */
      _completed: _,
      _error: _,
      _notify: notifySuccess,
      _progress: _,
      _setCompleteValue: _,
      _setErrorValue: _
    }; // Error notify state, moves a promise to the error state and notifies all children
    //

    state_error_notify = {
      name: "error_notify",
      enter: function (promise) {
        promise.done = ErrorPromise.prototype.done;
        promise.then = ErrorPromise.prototype.then;

        if (promise._listeners) {
          var queue = [promise];
          var p;

          while (queue.length) {
            p = queue.shift();

            p._state._notify(p, queue);
          }
        }

        promise._setState(state_error);
      },
      cancel: _,
      done: null,

      /*error to get here*/
      then: null,

      /*error to get here*/
      _completed: _,
      _error: _,
      _notify: notifyError,
      _progress: _,
      _setCompleteValue: _,
      _setErrorValue: _
    }; // Error state, moves a promise to the error state and does NOT notify any children.
    // Some upstream promise is owning the notification pass.
    //

    state_error = {
      name: "error",
      enter: function (promise) {
        promise.done = ErrorPromise.prototype.done;
        promise.then = ErrorPromise.prototype.then;

        promise._cleanupAction();
      },
      cancel: _,
      done: null,

      /*error to get here*/
      then: null,

      /*error to get here*/
      _completed: _,
      _error: _,
      _notify: notifyError,
      _progress: _,
      _setCompleteValue: _,
      _setErrorValue: _
    }; //
    // The statemachine implementation follows a very particular pattern, the states are specified
    // as static stateless bags of functions which are then indirected through the state machine
    // instance (a Promise). As such all of the functions on each state have the promise instance
    // passed to them explicitly as a parameter and the Promise instance members do a little
    // dance where they indirect through the state and insert themselves in the argument list.
    //
    // We could instead call directly through the promise states however then every caller
    // would have to remember to do things like pumping the state machine to catch state transitions.
    //

    var PromiseStateMachine = _Base.Class.define(null, {
      _listeners: null,
      _nextState: null,
      _state: null,
      _value: null,
      cancel: function () {
        /// <signature helpKeyword="WinJS.PromiseStateMachine.cancel">
        /// <summary locid="WinJS.PromiseStateMachine.cancel">
        /// Attempts to cancel the fulfillment of a promised value. If the promise hasn't
        /// already been fulfilled and cancellation is supported, the promise enters
        /// the error state with a value of Error("Canceled").
        /// </summary>
        /// </signature>
        this._state.cancel(this);

        this._run();
      },
      done: function Promise_done(onComplete, onError, onProgress) {
        /// <signature helpKeyword="WinJS.PromiseStateMachine.done">
        /// <summary locid="WinJS.PromiseStateMachine.done">
        /// Allows you to specify the work to be done on the fulfillment of the promised value,
        /// the error handling to be performed if the promise fails to fulfill
        /// a value, and the handling of progress notifications along the way.
        ///
        /// After the handlers have finished executing, this function throws any error that would have been returned
        /// from then() as a promise in the error state.
        /// </summary>
        /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.done_p:onComplete">
        /// The function to be called if the promise is fulfilled successfully with a value.
        /// The fulfilled value is passed as the single argument. If the value is null,
        /// the fulfilled value is returned. The value returned
        /// from the function becomes the fulfilled value of the promise returned by
        /// then(). If an exception is thrown while executing the function, the promise returned
        /// by then() moves into the error state.
        /// </param>
        /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onError">
        /// The function to be called if the promise is fulfilled with an error. The error
        /// is passed as the single argument. If it is null, the error is forwarded.
        /// The value returned from the function is the fulfilled value of the promise returned by then().
        /// </param>
        /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onProgress">
        /// the function to be called if the promise reports progress. Data about the progress
        /// is passed as the single argument. Promises are not required to support
        /// progress.
        /// </param>
        /// </signature>
        this._state.done(this, onComplete, onError, onProgress);
      },
      then: function Promise_then(onComplete, onError, onProgress) {
        /// <signature helpKeyword="WinJS.PromiseStateMachine.then">
        /// <summary locid="WinJS.PromiseStateMachine.then">
        /// Allows you to specify the work to be done on the fulfillment of the promised value,
        /// the error handling to be performed if the promise fails to fulfill
        /// a value, and the handling of progress notifications along the way.
        /// </summary>
        /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.then_p:onComplete">
        /// The function to be called if the promise is fulfilled successfully with a value.
        /// The value is passed as the single argument. If the value is null, the value is returned.
        /// The value returned from the function becomes the fulfilled value of the promise returned by
        /// then(). If an exception is thrown while this function is being executed, the promise returned
        /// by then() moves into the error state.
        /// </param>
        /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onError">
        /// The function to be called if the promise is fulfilled with an error. The error
        /// is passed as the single argument. If it is null, the error is forwarded.
        /// The value returned from the function becomes the fulfilled value of the promise returned by then().
        /// </param>
        /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onProgress">
        /// The function to be called if the promise reports progress. Data about the progress
        /// is passed as the single argument. Promises are not required to support
        /// progress.
        /// </param>
        /// <returns type="WinJS.Promise" locid="WinJS.PromiseStateMachine.then_returnValue">
        /// The promise whose value is the result of executing the complete or
        /// error function.
        /// </returns>
        /// </signature>
        // BEGIN monaco change
        if (this.then !== Promise_then) {
          this.then(onComplete, onError, onProgress);
          return;
        } // END monaco change


        return this._state.then(this, onComplete, onError, onProgress);
      },
      _chainedError: function (value, context) {
        var result = this._state._error(this, value, detailsForChainedError, context);

        this._run();

        return result;
      },
      _completed: function (value) {
        var result = this._state._completed(this, value);

        this._run();

        return result;
      },
      _error: function (value) {
        var result = this._state._error(this, value, detailsForError);

        this._run();

        return result;
      },
      _progress: function (value) {
        this._state._progress(this, value);
      },
      _setState: function (state) {
        this._nextState = state;
      },
      _setCompleteValue: function (value) {
        this._state._setCompleteValue(this, value);

        this._run();
      },
      _setChainedErrorValue: function (value, context) {
        var result = this._state._setErrorValue(this, value, detailsForChainedError, context);

        this._run();

        return result;
      },
      _setExceptionValue: function (value) {
        var result = this._state._setErrorValue(this, value, detailsForException);

        this._run();

        return result;
      },
      _run: function () {
        while (this._nextState) {
          this._state = this._nextState;
          this._nextState = null;

          this._state.enter(this);
        }
      }
    }, {
      supportedForProcessing: false
    }); //
    // Implementations of shared state machine code.
    //


    function completed(promise, value) {
      var targetState;

      if (value && typeof value === "object" && typeof value.then === "function") {
        targetState = state_waiting;
      } else {
        targetState = state_success_notify;
      }

      promise._value = value;

      promise._setState(targetState);
    }

    function createErrorDetails(exception, error, promise, id, parent, handler) {
      return {
        exception: exception,
        error: error,
        promise: promise,
        handler: handler,
        id: id,
        parent: parent
      };
    }

    function detailsForHandledError(promise, errorValue, context, handler) {
      var exception = context._isException;
      var errorId = context._errorId;
      return createErrorDetails(exception ? errorValue : null, exception ? null : errorValue, promise, errorId, context, handler);
    }

    function detailsForChainedError(promise, errorValue, context) {
      var exception = context._isException;
      var errorId = context._errorId;
      setErrorInfo(promise, errorId, exception);
      return createErrorDetails(exception ? errorValue : null, exception ? null : errorValue, promise, errorId, context);
    }

    function detailsForError(promise, errorValue) {
      var errorId = ++error_number;
      setErrorInfo(promise, errorId);
      return createErrorDetails(null, errorValue, promise, errorId);
    }

    function detailsForException(promise, exceptionValue) {
      var errorId = ++error_number;
      setErrorInfo(promise, errorId, true);
      return createErrorDetails(exceptionValue, null, promise, errorId);
    }

    function done(promise, onComplete, onError, onProgress) {
      var asyncOpID = _Trace._traceAsyncOperationStarting("WinJS.Promise.done");

      pushListener(promise, {
        c: onComplete,
        e: onError,
        p: onProgress,
        asyncOpID: asyncOpID
      });
    }

    function error(promise, value, onerrorDetails, context) {
      promise._value = value;
      callonerror(promise, value, onerrorDetails, context);

      promise._setState(state_error_notify);
    }

    function notifySuccess(promise, queue) {
      var value = promise._value;
      var listeners = promise._listeners;

      if (!listeners) {
        return;
      }

      promise._listeners = null;
      var i, len;

      for (i = 0, len = Array.isArray(listeners) ? listeners.length : 1; i < len; i++) {
        var listener = len === 1 ? listeners : listeners[i];
        var onComplete = listener.c;
        var target = listener.promise;

        _Trace._traceAsyncOperationCompleted(listener.asyncOpID, _Global.Debug && _Global.Debug.MS_ASYNC_OP_STATUS_SUCCESS);

        if (target) {
          _Trace._traceAsyncCallbackStarting(listener.asyncOpID);

          try {
            target._setCompleteValue(onComplete ? onComplete(value) : value);
          } catch (ex) {
            target._setExceptionValue(ex);
          } finally {
            _Trace._traceAsyncCallbackCompleted();
          }

          if (target._state !== state_waiting && target._listeners) {
            queue.push(target);
          }
        } else {
          CompletePromise.prototype.done.call(promise, onComplete);
        }
      }
    }

    function notifyError(promise, queue) {
      var value = promise._value;
      var listeners = promise._listeners;

      if (!listeners) {
        return;
      }

      promise._listeners = null;
      var i, len;

      for (i = 0, len = Array.isArray(listeners) ? listeners.length : 1; i < len; i++) {
        var listener = len === 1 ? listeners : listeners[i];
        var onError = listener.e;
        var target = listener.promise;
        var errorID = _Global.Debug && (value && value.name === canceledName ? _Global.Debug.MS_ASYNC_OP_STATUS_CANCELED : _Global.Debug.MS_ASYNC_OP_STATUS_ERROR);

        _Trace._traceAsyncOperationCompleted(listener.asyncOpID, errorID);

        if (target) {
          var asyncCallbackStarted = false;

          try {
            if (onError) {
              _Trace._traceAsyncCallbackStarting(listener.asyncOpID);

              asyncCallbackStarted = true;

              if (!onError.handlesOnError) {
                callonerror(target, value, detailsForHandledError, promise, onError);
              }

              target._setCompleteValue(onError(value));
            } else {
              target._setChainedErrorValue(value, promise);
            }
          } catch (ex) {
            target._setExceptionValue(ex);
          } finally {
            if (asyncCallbackStarted) {
              _Trace._traceAsyncCallbackCompleted();
            }
          }

          if (target._state !== state_waiting && target._listeners) {
            queue.push(target);
          }
        } else {
          ErrorPromise.prototype.done.call(promise, null, onError);
        }
      }
    }

    function callonerror(promise, value, onerrorDetailsGenerator, context, handler) {
      if (promiseEventListeners._listeners[errorET]) {
        if (value instanceof Error && value.message === canceledName) {
          return;
        }

        promiseEventListeners.dispatchEvent(errorET, onerrorDetailsGenerator(promise, value, context, handler));
      }
    }

    function progress(promise, value) {
      var listeners = promise._listeners;

      if (listeners) {
        var i, len;

        for (i = 0, len = Array.isArray(listeners) ? listeners.length : 1; i < len; i++) {
          var listener = len === 1 ? listeners : listeners[i];
          var onProgress = listener.p;

          if (onProgress) {
            try {
              onProgress(value);
            } catch (ex) {}
          }

          if (!(listener.c || listener.e) && listener.promise) {
            listener.promise._progress(value);
          }
        }
      }
    }

    function pushListener(promise, listener) {
      var listeners = promise._listeners;

      if (listeners) {
        // We may have either a single listener (which will never be wrapped in an array)
        // or 2+ listeners (which will be wrapped). Since we are now adding one more listener
        // we may have to wrap the single listener before adding the second.
        listeners = Array.isArray(listeners) ? listeners : [listeners];
        listeners.push(listener);
      } else {
        listeners = listener;
      }

      promise._listeners = listeners;
    } // The difference beween setCompleteValue()/setErrorValue() and complete()/error() is that setXXXValue() moves
    // a promise directly to the success/error state without starting another notification pass (because one
    // is already ongoing).


    function setErrorInfo(promise, errorId, isException) {
      promise._isException = isException || false;
      promise._errorId = errorId;
    }

    function setErrorValue(promise, value, onerrorDetails, context) {
      promise._value = value;
      callonerror(promise, value, onerrorDetails, context);

      promise._setState(state_error);
    }

    function setCompleteValue(promise, value) {
      var targetState;

      if (value && typeof value === "object" && typeof value.then === "function") {
        targetState = state_waiting;
      } else {
        targetState = state_success;
      }

      promise._value = value;

      promise._setState(targetState);
    }

    function then(promise, onComplete, onError, onProgress) {
      var result = new ThenPromise(promise);

      var asyncOpID = _Trace._traceAsyncOperationStarting("WinJS.Promise.then");

      pushListener(promise, {
        promise: result,
        c: onComplete,
        e: onError,
        p: onProgress,
        asyncOpID: asyncOpID
      });
      return result;
    } //
    // Internal implementation detail promise, ThenPromise is created when a promise needs
    // to be returned from a then() method.
    //


    var ThenPromise = _Base.Class.derive(PromiseStateMachine, function (creator) {
      if (tagWithStack && (tagWithStack === true || tagWithStack & tag.thenPromise)) {
        this._stack = Promise._getStack();
      }

      this._creator = creator;

      this._setState(state_created);

      this._run();
    }, {
      _creator: null,
      _cancelAction: function () {
        if (this._creator) {
          this._creator.cancel();
        }
      },
      _cleanupAction: function () {
        this._creator = null;
      }
    }, {
      supportedForProcessing: false
    }); //
    // Slim promise implementations for already completed promises, these are created
    // under the hood on synchronous completion paths as well as by WinJS.Promise.wrap
    // and WinJS.Promise.wrapError.
    //


    var ErrorPromise = _Base.Class.define(function ErrorPromise_ctor(value) {
      if (tagWithStack && (tagWithStack === true || tagWithStack & tag.errorPromise)) {
        this._stack = Promise._getStack();
      }

      this._value = value;
      callonerror(this, value, detailsForError);
    }, {
      cancel: function () {/// <signature helpKeyword="WinJS.PromiseStateMachine.cancel">
        /// <summary locid="WinJS.PromiseStateMachine.cancel">
        /// Attempts to cancel the fulfillment of a promised value. If the promise hasn't
        /// already been fulfilled and cancellation is supported, the promise enters
        /// the error state with a value of Error("Canceled").
        /// </summary>
        /// </signature>
      },
      done: function ErrorPromise_done(unused, onError) {
        /// <signature helpKeyword="WinJS.PromiseStateMachine.done">
        /// <summary locid="WinJS.PromiseStateMachine.done">
        /// Allows you to specify the work to be done on the fulfillment of the promised value,
        /// the error handling to be performed if the promise fails to fulfill
        /// a value, and the handling of progress notifications along the way.
        ///
        /// After the handlers have finished executing, this function throws any error that would have been returned
        /// from then() as a promise in the error state.
        /// </summary>
        /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.done_p:onComplete">
        /// The function to be called if the promise is fulfilled successfully with a value.
        /// The fulfilled value is passed as the single argument. If the value is null,
        /// the fulfilled value is returned. The value returned
        /// from the function becomes the fulfilled value of the promise returned by
        /// then(). If an exception is thrown while executing the function, the promise returned
        /// by then() moves into the error state.
        /// </param>
        /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onError">
        /// The function to be called if the promise is fulfilled with an error. The error
        /// is passed as the single argument. If it is null, the error is forwarded.
        /// The value returned from the function is the fulfilled value of the promise returned by then().
        /// </param>
        /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onProgress">
        /// the function to be called if the promise reports progress. Data about the progress
        /// is passed as the single argument. Promises are not required to support
        /// progress.
        /// </param>
        /// </signature>
        var value = this._value;

        if (onError) {
          try {
            if (!onError.handlesOnError) {
              callonerror(null, value, detailsForHandledError, this, onError);
            }

            var result = onError(value);

            if (result && typeof result === "object" && typeof result.done === "function") {
              // If a promise is returned we need to wait on it.
              result.done();
            }

            return;
          } catch (ex) {
            value = ex;
          }
        }

        if (value instanceof Error && value.message === canceledName) {
          // suppress cancel
          return;
        } // force the exception to be thrown asyncronously to avoid any try/catch blocks
        //


        Promise._doneHandler(value);
      },
      then: function ErrorPromise_then(unused, onError) {
        /// <signature helpKeyword="WinJS.PromiseStateMachine.then">
        /// <summary locid="WinJS.PromiseStateMachine.then">
        /// Allows you to specify the work to be done on the fulfillment of the promised value,
        /// the error handling to be performed if the promise fails to fulfill
        /// a value, and the handling of progress notifications along the way.
        /// </summary>
        /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.then_p:onComplete">
        /// The function to be called if the promise is fulfilled successfully with a value.
        /// The value is passed as the single argument. If the value is null, the value is returned.
        /// The value returned from the function becomes the fulfilled value of the promise returned by
        /// then(). If an exception is thrown while this function is being executed, the promise returned
        /// by then() moves into the error state.
        /// </param>
        /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onError">
        /// The function to be called if the promise is fulfilled with an error. The error
        /// is passed as the single argument. If it is null, the error is forwarded.
        /// The value returned from the function becomes the fulfilled value of the promise returned by then().
        /// </param>
        /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onProgress">
        /// The function to be called if the promise reports progress. Data about the progress
        /// is passed as the single argument. Promises are not required to support
        /// progress.
        /// </param>
        /// <returns type="WinJS.Promise" locid="WinJS.PromiseStateMachine.then_returnValue">
        /// The promise whose value is the result of executing the complete or
        /// error function.
        /// </returns>
        /// </signature>
        // If the promise is already in a error state and no error handler is provided
        // we optimize by simply returning the promise instead of creating a new one.
        //
        if (!onError) {
          return this;
        }

        var result;
        var value = this._value;

        try {
          if (!onError.handlesOnError) {
            callonerror(null, value, detailsForHandledError, this, onError);
          }

          result = new CompletePromise(onError(value));
        } catch (ex) {
          // If the value throw from the error handler is the same as the value
          // provided to the error handler then there is no need for a new promise.
          //
          if (ex === value) {
            result = this;
          } else {
            result = new ExceptionPromise(ex);
          }
        }

        return result;
      }
    }, {
      supportedForProcessing: false
    });

    var ExceptionPromise = _Base.Class.derive(ErrorPromise, function ExceptionPromise_ctor(value) {
      if (tagWithStack && (tagWithStack === true || tagWithStack & tag.exceptionPromise)) {
        this._stack = Promise._getStack();
      }

      this._value = value;
      callonerror(this, value, detailsForException);
    }, {
      /* empty */
    }, {
      supportedForProcessing: false
    });

    var CompletePromise = _Base.Class.define(function CompletePromise_ctor(value) {
      if (tagWithStack && (tagWithStack === true || tagWithStack & tag.completePromise)) {
        this._stack = Promise._getStack();
      }

      if (value && typeof value === "object" && typeof value.then === "function") {
        var result = new ThenPromise(null);

        result._setCompleteValue(value);

        return result;
      }

      this._value = value;
    }, {
      cancel: function () {/// <signature helpKeyword="WinJS.PromiseStateMachine.cancel">
        /// <summary locid="WinJS.PromiseStateMachine.cancel">
        /// Attempts to cancel the fulfillment of a promised value. If the promise hasn't
        /// already been fulfilled and cancellation is supported, the promise enters
        /// the error state with a value of Error("Canceled").
        /// </summary>
        /// </signature>
      },
      done: function CompletePromise_done(onComplete) {
        /// <signature helpKeyword="WinJS.PromiseStateMachine.done">
        /// <summary locid="WinJS.PromiseStateMachine.done">
        /// Allows you to specify the work to be done on the fulfillment of the promised value,
        /// the error handling to be performed if the promise fails to fulfill
        /// a value, and the handling of progress notifications along the way.
        ///
        /// After the handlers have finished executing, this function throws any error that would have been returned
        /// from then() as a promise in the error state.
        /// </summary>
        /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.done_p:onComplete">
        /// The function to be called if the promise is fulfilled successfully with a value.
        /// The fulfilled value is passed as the single argument. If the value is null,
        /// the fulfilled value is returned. The value returned
        /// from the function becomes the fulfilled value of the promise returned by
        /// then(). If an exception is thrown while executing the function, the promise returned
        /// by then() moves into the error state.
        /// </param>
        /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onError">
        /// The function to be called if the promise is fulfilled with an error. The error
        /// is passed as the single argument. If it is null, the error is forwarded.
        /// The value returned from the function is the fulfilled value of the promise returned by then().
        /// </param>
        /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onProgress">
        /// the function to be called if the promise reports progress. Data about the progress
        /// is passed as the single argument. Promises are not required to support
        /// progress.
        /// </param>
        /// </signature>
        if (!onComplete) {
          return;
        }

        try {
          var result = onComplete(this._value);

          if (result && typeof result === "object" && typeof result.done === "function") {
            result.done();
          }
        } catch (ex) {
          // force the exception to be thrown asynchronously to avoid any try/catch blocks
          Promise._doneHandler(ex);
        }
      },
      then: function CompletePromise_then(onComplete) {
        /// <signature helpKeyword="WinJS.PromiseStateMachine.then">
        /// <summary locid="WinJS.PromiseStateMachine.then">
        /// Allows you to specify the work to be done on the fulfillment of the promised value,
        /// the error handling to be performed if the promise fails to fulfill
        /// a value, and the handling of progress notifications along the way.
        /// </summary>
        /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.then_p:onComplete">
        /// The function to be called if the promise is fulfilled successfully with a value.
        /// The value is passed as the single argument. If the value is null, the value is returned.
        /// The value returned from the function becomes the fulfilled value of the promise returned by
        /// then(). If an exception is thrown while this function is being executed, the promise returned
        /// by then() moves into the error state.
        /// </param>
        /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onError">
        /// The function to be called if the promise is fulfilled with an error. The error
        /// is passed as the single argument. If it is null, the error is forwarded.
        /// The value returned from the function becomes the fulfilled value of the promise returned by then().
        /// </param>
        /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onProgress">
        /// The function to be called if the promise reports progress. Data about the progress
        /// is passed as the single argument. Promises are not required to support
        /// progress.
        /// </param>
        /// <returns type="WinJS.Promise" locid="WinJS.PromiseStateMachine.then_returnValue">
        /// The promise whose value is the result of executing the complete or
        /// error function.
        /// </returns>
        /// </signature>
        try {
          // If the value returned from the completion handler is the same as the value
          // provided to the completion handler then there is no need for a new promise.
          //
          var newValue = onComplete ? onComplete(this._value) : this._value;
          return newValue === this._value ? this : new CompletePromise(newValue);
        } catch (ex) {
          return new ExceptionPromise(ex);
        }
      }
    }, {
      supportedForProcessing: false
    }); //
    // Promise is the user-creatable WinJS.Promise object.
    //


    function timeout(timeoutMS) {
      var id;
      return new Promise(function (c) {
        if (timeoutMS) {
          id = _Global.setTimeout(c, timeoutMS);
        } else {
          _BaseCoreUtils._setImmediate(c);
        }
      }, function () {
        if (id) {
          _Global.clearTimeout(id);
        }
      });
    }

    function timeoutWithPromise(timeout, promise) {
      var cancelPromise = function () {
        promise.cancel();
      };

      var cancelTimeout = function () {
        timeout.cancel();
      };

      timeout.then(cancelPromise);
      promise.then(cancelTimeout, cancelTimeout);
      return promise;
    }

    var staticCanceledPromise;

    var Promise = _Base.Class.derive(PromiseStateMachine, function Promise_ctor(init, oncancel) {
      /// <signature helpKeyword="WinJS.Promise">
      /// <summary locid="WinJS.Promise">
      /// A promise provides a mechanism to schedule work to be done on a value that
      /// has not yet been computed. It is a convenient abstraction for managing
      /// interactions with asynchronous APIs.
      /// </summary>
      /// <param name="init" type="Function" locid="WinJS.Promise_p:init">
      /// The function that is called during construction of the  promise. The function
      /// is given three arguments (complete, error, progress). Inside this function
      /// you should add event listeners for the notifications supported by this value.
      /// </param>
      /// <param name="oncancel" optional="true" locid="WinJS.Promise_p:oncancel">
      /// The function to call if a consumer of this promise wants
      /// to cancel its undone work. Promises are not required to
      /// support cancellation.
      /// </param>
      /// </signature>
      if (tagWithStack && (tagWithStack === true || tagWithStack & tag.promise)) {
        this._stack = Promise._getStack();
      }

      this._oncancel = oncancel;

      this._setState(state_created);

      this._run();

      try {
        var complete = this._completed.bind(this);

        var error = this._error.bind(this);

        var progress = this._progress.bind(this);

        init(complete, error, progress);
      } catch (ex) {
        this._setExceptionValue(ex);
      }
    }, {
      _oncancel: null,
      _cancelAction: function () {
        // BEGIN monaco change
        try {
          if (this._oncancel) {
            this._oncancel();
          } else {
            throw new Error('Promise did not implement oncancel');
          }
        } catch (ex) {
          // Access fields to get them created
          var msg = ex.message;
          var stack = ex.stack;
          promiseEventListeners.dispatchEvent('error', ex);
        } // END monaco change

      },
      _cleanupAction: function () {
        this._oncancel = null;
      }
    }, {
      addEventListener: function Promise_addEventListener(eventType, listener, capture) {
        /// <signature helpKeyword="WinJS.Promise.addEventListener">
        /// <summary locid="WinJS.Promise.addEventListener">
        /// Adds an event listener to the control.
        /// </summary>
        /// <param name="eventType" locid="WinJS.Promise.addEventListener_p:eventType">
        /// The type (name) of the event.
        /// </param>
        /// <param name="listener" locid="WinJS.Promise.addEventListener_p:listener">
        /// The listener to invoke when the event is raised.
        /// </param>
        /// <param name="capture" locid="WinJS.Promise.addEventListener_p:capture">
        /// Specifies whether or not to initiate capture.
        /// </param>
        /// </signature>
        promiseEventListeners.addEventListener(eventType, listener, capture);
      },
      any: function Promise_any(values) {
        /// <signature helpKeyword="WinJS.Promise.any">
        /// <summary locid="WinJS.Promise.any">
        /// Returns a promise that is fulfilled when one of the input promises
        /// has been fulfilled.
        /// </summary>
        /// <param name="values" type="Array" locid="WinJS.Promise.any_p:values">
        /// An array that contains promise objects or objects whose property
        /// values include promise objects.
        /// </param>
        /// <returns type="WinJS.Promise" locid="WinJS.Promise.any_returnValue">
        /// A promise that on fulfillment yields the value of the input (complete or error).
        /// </returns>
        /// </signature>
        return new Promise(function (complete, error) {
          var keys = Object.keys(values);

          if (keys.length === 0) {
            complete();
          }

          var canceled = 0;
          keys.forEach(function (key) {
            Promise.as(values[key]).then(function () {
              complete({
                key: key,
                value: values[key]
              });
            }, function (e) {
              if (e instanceof Error && e.name === canceledName) {
                if (++canceled === keys.length) {
                  complete(Promise.cancel);
                }

                return;
              }

              error({
                key: key,
                value: values[key]
              });
            });
          });
        }, function () {
          var keys = Object.keys(values);
          keys.forEach(function (key) {
            var promise = Promise.as(values[key]);

            if (typeof promise.cancel === "function") {
              promise.cancel();
            }
          });
        });
      },
      as: function Promise_as(value) {
        /// <signature helpKeyword="WinJS.Promise.as">
        /// <summary locid="WinJS.Promise.as">
        /// Returns a promise. If the object is already a promise it is returned;
        /// otherwise the object is wrapped in a promise.
        /// </summary>
        /// <param name="value" locid="WinJS.Promise.as_p:value">
        /// The value to be treated as a promise.
        /// </param>
        /// <returns type="WinJS.Promise" locid="WinJS.Promise.as_returnValue">
        /// A promise.
        /// </returns>
        /// </signature>
        if (value && typeof value === "object" && typeof value.then === "function") {
          return value;
        }

        return new CompletePromise(value);
      },
      /// <field type="WinJS.Promise" helpKeyword="WinJS.Promise.cancel" locid="WinJS.Promise.cancel">
      /// Canceled promise value, can be returned from a promise completion handler
      /// to indicate cancelation of the promise chain.
      /// </field>
      cancel: {
        get: function () {
          return staticCanceledPromise = staticCanceledPromise || new ErrorPromise(new _ErrorFromName(canceledName));
        }
      },
      dispatchEvent: function Promise_dispatchEvent(eventType, details) {
        /// <signature helpKeyword="WinJS.Promise.dispatchEvent">
        /// <summary locid="WinJS.Promise.dispatchEvent">
        /// Raises an event of the specified type and properties.
        /// </summary>
        /// <param name="eventType" locid="WinJS.Promise.dispatchEvent_p:eventType">
        /// The type (name) of the event.
        /// </param>
        /// <param name="details" locid="WinJS.Promise.dispatchEvent_p:details">
        /// The set of additional properties to be attached to the event object.
        /// </param>
        /// <returns type="Boolean" locid="WinJS.Promise.dispatchEvent_returnValue">
        /// Specifies whether preventDefault was called on the event.
        /// </returns>
        /// </signature>
        return promiseEventListeners.dispatchEvent(eventType, details);
      },
      is: function Promise_is(value) {
        /// <signature helpKeyword="WinJS.Promise.is">
        /// <summary locid="WinJS.Promise.is">
        /// Determines whether a value fulfills the promise contract.
        /// </summary>
        /// <param name="value" locid="WinJS.Promise.is_p:value">
        /// A value that may be a promise.
        /// </param>
        /// <returns type="Boolean" locid="WinJS.Promise.is_returnValue">
        /// true if the specified value is a promise, otherwise false.
        /// </returns>
        /// </signature>
        return value && typeof value === "object" && typeof value.then === "function";
      },
      join: function Promise_join(values) {
        /// <signature helpKeyword="WinJS.Promise.join">
        /// <summary locid="WinJS.Promise.join">
        /// Creates a promise that is fulfilled when all the values are fulfilled.
        /// </summary>
        /// <param name="values" type="Object" locid="WinJS.Promise.join_p:values">
        /// An object whose fields contain values, some of which may be promises.
        /// </param>
        /// <returns type="WinJS.Promise" locid="WinJS.Promise.join_returnValue">
        /// A promise whose value is an object with the same field names as those of the object in the values parameter, where
        /// each field value is the fulfilled value of a promise.
        /// </returns>
        /// </signature>
        return new Promise(function (complete, error, progress) {
          var keys = Object.keys(values);
          var errors = Array.isArray(values) ? [] : {};
          var results = Array.isArray(values) ? [] : {};
          var undefineds = 0;
          var pending = keys.length;

          var argDone = function (key) {
            if (--pending === 0) {
              var errorCount = Object.keys(errors).length;

              if (errorCount === 0) {
                complete(results);
              } else {
                var canceledCount = 0;
                keys.forEach(function (key) {
                  var e = errors[key];

                  if (e instanceof Error && e.name === canceledName) {
                    canceledCount++;
                  }
                });

                if (canceledCount === errorCount) {
                  complete(Promise.cancel);
                } else {
                  error(errors);
                }
              }
            } else {
              progress({
                Key: key,
                Done: true
              });
            }
          };

          keys.forEach(function (key) {
            var value = values[key];

            if (value === undefined) {
              undefineds++;
            } else {
              Promise.then(value, function (value) {
                results[key] = value;
                argDone(key);
              }, function (value) {
                errors[key] = value;
                argDone(key);
              });
            }
          });
          pending -= undefineds;

          if (pending === 0) {
            complete(results);
            return;
          }
        }, function () {
          Object.keys(values).forEach(function (key) {
            var promise = Promise.as(values[key]);

            if (typeof promise.cancel === "function") {
              promise.cancel();
            }
          });
        });
      },
      removeEventListener: function Promise_removeEventListener(eventType, listener, capture) {
        /// <signature helpKeyword="WinJS.Promise.removeEventListener">
        /// <summary locid="WinJS.Promise.removeEventListener">
        /// Removes an event listener from the control.
        /// </summary>
        /// <param name='eventType' locid="WinJS.Promise.removeEventListener_eventType">
        /// The type (name) of the event.
        /// </param>
        /// <param name='listener' locid="WinJS.Promise.removeEventListener_listener">
        /// The listener to remove.
        /// </param>
        /// <param name='capture' locid="WinJS.Promise.removeEventListener_capture">
        /// Specifies whether or not to initiate capture.
        /// </param>
        /// </signature>
        promiseEventListeners.removeEventListener(eventType, listener, capture);
      },
      supportedForProcessing: false,
      then: function Promise_then(value, onComplete, onError, onProgress) {
        /// <signature helpKeyword="WinJS.Promise.then">
        /// <summary locid="WinJS.Promise.then">
        /// A static version of the promise instance method then().
        /// </summary>
        /// <param name="value" locid="WinJS.Promise.then_p:value">
        /// the value to be treated as a promise.
        /// </param>
        /// <param name="onComplete" type="Function" locid="WinJS.Promise.then_p:complete">
        /// The function to be called if the promise is fulfilled with a value.
        /// If it is null, the promise simply
        /// returns the value. The value is passed as the single argument.
        /// </param>
        /// <param name="onError" type="Function" optional="true" locid="WinJS.Promise.then_p:error">
        /// The function to be called if the promise is fulfilled with an error. The error
        /// is passed as the single argument.
        /// </param>
        /// <param name="onProgress" type="Function" optional="true" locid="WinJS.Promise.then_p:progress">
        /// The function to be called if the promise reports progress. Data about the progress
        /// is passed as the single argument. Promises are not required to support
        /// progress.
        /// </param>
        /// <returns type="WinJS.Promise" locid="WinJS.Promise.then_returnValue">
        /// A promise whose value is the result of executing the provided complete function.
        /// </returns>
        /// </signature>
        return Promise.as(value).then(onComplete, onError, onProgress);
      },
      thenEach: function Promise_thenEach(values, onComplete, onError, onProgress) {
        /// <signature helpKeyword="WinJS.Promise.thenEach">
        /// <summary locid="WinJS.Promise.thenEach">
        /// Performs an operation on all the input promises and returns a promise
        /// that has the shape of the input and contains the result of the operation
        /// that has been performed on each input.
        /// </summary>
        /// <param name="values" locid="WinJS.Promise.thenEach_p:values">
        /// A set of values (which could be either an array or an object) of which some or all are promises.
        /// </param>
        /// <param name="onComplete" type="Function" locid="WinJS.Promise.thenEach_p:complete">
        /// The function to be called if the promise is fulfilled with a value.
        /// If the value is null, the promise returns the value.
        /// The value is passed as the single argument.
        /// </param>
        /// <param name="onError" type="Function" optional="true" locid="WinJS.Promise.thenEach_p:error">
        /// The function to be called if the promise is fulfilled with an error. The error
        /// is passed as the single argument.
        /// </param>
        /// <param name="onProgress" type="Function" optional="true" locid="WinJS.Promise.thenEach_p:progress">
        /// The function to be called if the promise reports progress. Data about the progress
        /// is passed as the single argument. Promises are not required to support
        /// progress.
        /// </param>
        /// <returns type="WinJS.Promise" locid="WinJS.Promise.thenEach_returnValue">
        /// A promise that is the result of calling Promise.join on the values parameter.
        /// </returns>
        /// </signature>
        var result = Array.isArray(values) ? [] : {};
        Object.keys(values).forEach(function (key) {
          result[key] = Promise.as(values[key]).then(onComplete, onError, onProgress);
        });
        return Promise.join(result);
      },
      timeout: function Promise_timeout(time, promise) {
        /// <signature helpKeyword="WinJS.Promise.timeout">
        /// <summary locid="WinJS.Promise.timeout">
        /// Creates a promise that is fulfilled after a timeout.
        /// </summary>
        /// <param name="timeout" type="Number" optional="true" locid="WinJS.Promise.timeout_p:timeout">
        /// The timeout period in milliseconds. If this value is zero or not specified
        /// setImmediate is called, otherwise setTimeout is called.
        /// </param>
        /// <param name="promise" type="Promise" optional="true" locid="WinJS.Promise.timeout_p:promise">
        /// A promise that will be canceled if it doesn't complete before the
        /// timeout has expired.
        /// </param>
        /// <returns type="WinJS.Promise" locid="WinJS.Promise.timeout_returnValue">
        /// A promise that is completed asynchronously after the specified timeout.
        /// </returns>
        /// </signature>
        var to = timeout(time);
        return promise ? timeoutWithPromise(to, promise) : to;
      },
      wrap: function Promise_wrap(value) {
        /// <signature helpKeyword="WinJS.Promise.wrap">
        /// <summary locid="WinJS.Promise.wrap">
        /// Wraps a non-promise value in a promise. You can use this function if you need
        /// to pass a value to a function that requires a promise.
        /// </summary>
        /// <param name="value" locid="WinJS.Promise.wrap_p:value">
        /// Some non-promise value to be wrapped in a promise.
        /// </param>
        /// <returns type="WinJS.Promise" locid="WinJS.Promise.wrap_returnValue">
        /// A promise that is successfully fulfilled with the specified value
        /// </returns>
        /// </signature>
        return new CompletePromise(value);
      },
      wrapError: function Promise_wrapError(error) {
        /// <signature helpKeyword="WinJS.Promise.wrapError">
        /// <summary locid="WinJS.Promise.wrapError">
        /// Wraps a non-promise error value in a promise. You can use this function if you need
        /// to pass an error to a function that requires a promise.
        /// </summary>
        /// <param name="error" locid="WinJS.Promise.wrapError_p:error">
        /// A non-promise error value to be wrapped in a promise.
        /// </param>
        /// <returns type="WinJS.Promise" locid="WinJS.Promise.wrapError_returnValue">
        /// A promise that is in an error state with the specified value.
        /// </returns>
        /// </signature>
        return new ErrorPromise(error);
      },
      _veryExpensiveTagWithStack: {
        get: function () {
          return tagWithStack;
        },
        set: function (value) {
          tagWithStack = value;
        }
      },
      _veryExpensiveTagWithStack_tag: tag,
      _getStack: function () {
        if (_Global.Debug && _Global.Debug.debuggerEnabled) {
          try {
            throw new Error();
          } catch (e) {
            return e.stack;
          }
        }
      },
      _cancelBlocker: function Promise__cancelBlocker(input, oncancel) {
        //
        // Returns a promise which on cancelation will still result in downstream cancelation while
        //  protecting the promise 'input' from being  canceled which has the effect of allowing
        //  'input' to be shared amoung various consumers.
        //
        if (!Promise.is(input)) {
          return Promise.wrap(input);
        }

        var complete;
        var error;
        var output = new Promise(function (c, e) {
          complete = c;
          error = e;
        }, function () {
          complete = null;
          error = null;
          oncancel && oncancel();
        });
        input.then(function (v) {
          complete && complete(v);
        }, function (e) {
          error && error(e);
        });
        return output;
      }
    });

    Object.defineProperties(Promise, _Events.createEventProperties(errorET));

    Promise._doneHandler = function (value) {
      _BaseCoreUtils._setImmediate(function Promise_done_rethrow() {
        throw value;
      });
    };

    return {
      PromiseStateMachine: PromiseStateMachine,
      Promise: Promise,
      state_created: state_created
    };
  });

  _winjs("WinJS/Promise", ["WinJS/Core/_Base", "WinJS/Promise/_StateMachine"], function promiseInit(_Base, _StateMachine) {
    "use strict";

    _Base.Namespace.define("WinJS", {
      Promise: _StateMachine.Promise
    });

    return _StateMachine.Promise;
  });

  __winjs_exports = _modules["WinJS/Core/_WinJS"];
  __winjs_exports.TPromise = __winjs_exports.Promise;
  __winjs_exports.PPromise = __winjs_exports.Promise; // ESM-comment-begin
  // if (typeof exports === 'undefined' && typeof define === 'function' && define.amd) {
  //     define([], __winjs_exports);
  // } else {
  //     module.exports = __winjs_exports;
  // }
  // ESM-comment-end
})(); // ESM-uncomment-begin


var Promise = __winjs_exports.Promise;
exports.Promise = Promise;
var TPromise = __winjs_exports.TPromise;
exports.TPromise = TPromise;
var PPromise = __winjs_exports.PPromise; // ESM-uncomment-end

exports.PPromise = PPromise;
},{"process":"node_modules/process/browser.js"}],"node_modules/monaco-editor/esm/vs/base/common/errors.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onUnexpectedError = onUnexpectedError;
exports.onUnexpectedExternalError = onUnexpectedExternalError;
exports.transformErrorForSerialization = transformErrorForSerialization;
exports.isPromiseCanceledError = isPromiseCanceledError;
exports.canceled = canceled;
exports.illegalArgument = illegalArgument;
exports.illegalState = illegalState;
exports.errorHandler = exports.ErrorHandler = void 0;

var _winjsBase = require("./winjs.base.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// ------ BEGIN Hook up error listeners to winjs promises
var outstandingPromiseErrors = {};

function promiseErrorHandler(e) {
  //
  // e.detail looks like: { exception, error, promise, handler, id, parent }
  //
  var details = e.detail;
  var id = details.id; // If the error has a parent promise then this is not the origination of the
  //  error so we check if it has a handler, and if so we mark that the error
  //  was handled by removing it from outstandingPromiseErrors
  //

  if (details.parent) {
    if (details.handler && outstandingPromiseErrors) {
      delete outstandingPromiseErrors[id];
    }

    return;
  } // Indicate that this error was originated and needs to be handled


  outstandingPromiseErrors[id] = details; // The first time the queue fills up this iteration, schedule a timeout to
  // check if any errors are still unhandled.

  if (Object.keys(outstandingPromiseErrors).length === 1) {
    setTimeout(function () {
      var errors = outstandingPromiseErrors;
      outstandingPromiseErrors = {};
      Object.keys(errors).forEach(function (errorId) {
        var error = errors[errorId];

        if (error.exception) {
          onUnexpectedError(error.exception);
        } else if (error.error) {
          onUnexpectedError(error.error);
        }

        console.log('WARNING: Promise with no error callback:' + error.id);
        console.log(error);

        if (error.exception) {
          console.log(error.exception.stack);
        }
      });
    }, 0);
  }
}

_winjsBase.TPromise.addEventListener('error', promiseErrorHandler); // Avoid circular dependency on EventEmitter by implementing a subset of the interface.


var ErrorHandler =
/** @class */
function () {
  function ErrorHandler() {
    this.listeners = [];

    this.unexpectedErrorHandler = function (e) {
      setTimeout(function () {
        if (e.stack) {
          throw new Error(e.message + '\n\n' + e.stack);
        }

        throw e;
      }, 0);
    };
  }

  ErrorHandler.prototype.emit = function (e) {
    this.listeners.forEach(function (listener) {
      listener(e);
    });
  };

  ErrorHandler.prototype.onUnexpectedError = function (e) {
    this.unexpectedErrorHandler(e);
    this.emit(e);
  }; // For external errors, we don't want the listeners to be called


  ErrorHandler.prototype.onUnexpectedExternalError = function (e) {
    this.unexpectedErrorHandler(e);
  };

  return ErrorHandler;
}();

exports.ErrorHandler = ErrorHandler;
var errorHandler = new ErrorHandler();
exports.errorHandler = errorHandler;

function onUnexpectedError(e) {
  // ignore errors from cancelled promises
  if (!isPromiseCanceledError(e)) {
    errorHandler.onUnexpectedError(e);
  }

  return undefined;
}

function onUnexpectedExternalError(e) {
  // ignore errors from cancelled promises
  if (!isPromiseCanceledError(e)) {
    errorHandler.onUnexpectedExternalError(e);
  }

  return undefined;
}

function transformErrorForSerialization(error) {
  if (error instanceof Error) {
    var name_1 = error.name,
        message = error.message;
    var stack = error.stacktrace || error.stack;
    return {
      $isError: true,
      name: name_1,
      message: message,
      stack: stack
    };
  } // return as is


  return error;
}

var canceledName = 'Canceled';
/**
 * Checks if the given error is a promise in canceled state
 */

function isPromiseCanceledError(error) {
  return error instanceof Error && error.name === canceledName && error.message === canceledName;
}
/**
 * Returns an error that signals cancellation.
 */


function canceled() {
  var error = new Error(canceledName);
  error.name = error.message;
  return error;
}

function illegalArgument(name) {
  if (name) {
    return new Error("Illegal argument: " + name);
  } else {
    return new Error('Illegal argument');
  }
}

function illegalState(name) {
  if (name) {
    return new Error("Illegal state: " + name);
  } else {
    return new Error('Illegal state');
  }
}
},{"./winjs.base.js":"node_modules/monaco-editor/esm/vs/base/common/winjs.base.js"}],"node_modules/monaco-editor/esm/vs/base/common/lifecycle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDisposable = isDisposable;
exports.dispose = dispose;
exports.combinedDisposable = combinedDisposable;
exports.toDisposable = toDisposable;
exports.ImmortalReference = exports.Disposable = void 0;

function isDisposable(thing) {
  return typeof thing.dispose === 'function' && thing.dispose.length === 0;
}

function dispose(first) {
  var rest = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    rest[_i - 1] = arguments[_i];
  }

  if (Array.isArray(first)) {
    first.forEach(function (d) {
      return d && d.dispose();
    });
    return [];
  } else if (rest.length === 0) {
    if (first) {
      first.dispose();
      return first;
    }

    return undefined;
  } else {
    dispose(first);
    dispose(rest);
    return [];
  }
}

function combinedDisposable(disposables) {
  return {
    dispose: function () {
      return dispose(disposables);
    }
  };
}

function toDisposable(fn) {
  return {
    dispose: function () {
      fn();
    }
  };
}

var Disposable =
/** @class */
function () {
  function Disposable() {
    this._toDispose = [];
  }

  Disposable.prototype.dispose = function () {
    this._toDispose = dispose(this._toDispose);
  };

  Disposable.prototype._register = function (t) {
    this._toDispose.push(t);

    return t;
  };

  Disposable.None = Object.freeze({
    dispose: function () {}
  });
  return Disposable;
}();

exports.Disposable = Disposable;

var ImmortalReference =
/** @class */
function () {
  function ImmortalReference(object) {
    this.object = object;
  }

  ImmortalReference.prototype.dispose = function () {};

  return ImmortalReference;
}();

exports.ImmortalReference = ImmortalReference;
},{}],"node_modules/monaco-editor/esm/vs/base/common/platform.js":[function(require,module,exports) {
var process = require("process");
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setImmediate = setImmediate;
exports.OS = exports.globals = exports.isWeb = exports.isNative = exports.isLinux = exports.isMacintosh = exports.isWindows = exports.LANGUAGE_DEFAULT = void 0;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var _isWindows = false;
var _isMacintosh = false;
var _isLinux = false;
var _isNative = false;
var _isWeb = false;
var _locale = undefined;
var _language = undefined;
var _translationsConfigFile = undefined;
var LANGUAGE_DEFAULT = 'en';
exports.LANGUAGE_DEFAULT = LANGUAGE_DEFAULT;
var isElectronRenderer = typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.electron !== 'undefined' && process.type === 'renderer'; // OS detection

if (typeof navigator === 'object' && !isElectronRenderer) {
  var userAgent = navigator.userAgent;
  _isWindows = userAgent.indexOf('Windows') >= 0;
  _isMacintosh = userAgent.indexOf('Macintosh') >= 0;
  _isLinux = userAgent.indexOf('Linux') >= 0;
  _isWeb = true;
  _locale = navigator.language;
  _language = _locale;
} else if (typeof process === 'object') {
  _isWindows = process.platform === 'win32';
  _isMacintosh = process.platform === 'darwin';
  _isLinux = process.platform === 'linux';
  _locale = LANGUAGE_DEFAULT;
  _language = LANGUAGE_DEFAULT;
  var rawNlsConfig = undefined;

  if (rawNlsConfig) {
    try {
      var nlsConfig = JSON.parse(rawNlsConfig);
      var resolved = nlsConfig.availableLanguages['*'];
      _locale = nlsConfig.locale; // VSCode's default language is 'en'

      _language = resolved ? resolved : LANGUAGE_DEFAULT;
      _translationsConfigFile = nlsConfig._translationsConfigFile;
    } catch (e) {}
  }

  _isNative = true;
}

var _platform = 0
/* Web */
;

if (_isNative) {
  if (_isMacintosh) {
    _platform = 1
    /* Mac */
    ;
  } else if (_isWindows) {
    _platform = 3
    /* Windows */
    ;
  } else if (_isLinux) {
    _platform = 2
    /* Linux */
    ;
  }
}

var isWindows = _isWindows;
exports.isWindows = isWindows;
var isMacintosh = _isMacintosh;
exports.isMacintosh = isMacintosh;
var isLinux = _isLinux;
exports.isLinux = isLinux;
var isNative = _isNative;
exports.isNative = isNative;
var isWeb = _isWeb;
exports.isWeb = isWeb;

var _globals = typeof self === 'object' ? self : typeof global === 'object' ? global : {};

var globals = _globals;
exports.globals = globals;
var _setImmediate = null;

function setImmediate(callback) {
  if (_setImmediate === null) {
    if (globals.setImmediate) {
      _setImmediate = globals.setImmediate.bind(globals);
    } else if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
      _setImmediate = process.nextTick.bind(process);
    } else {
      _setImmediate = globals.setTimeout.bind(globals);
    }
  }

  return _setImmediate(callback);
}

var OS = _isMacintosh ? 2
/* Macintosh */
: _isWindows ? 1
/* Windows */
: 3
/* Linux */
;
exports.OS = OS;
},{"process":"node_modules/process/browser.js"}],"node_modules/monaco-editor/esm/vs/base/common/functional.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.once = once;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function once(fn) {
  var _this = this;

  var didCall = false;
  var result;
  return function () {
    if (didCall) {
      return result;
    }

    didCall = true;
    result = fn.apply(_this, arguments);
    return result;
  };
}
},{}],"node_modules/monaco-editor/esm/vs/base/common/iterator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MappedIterator = exports.ArrayNavigator = exports.ArrayIterator = exports.Iterator = exports.FIN = void 0;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var FIN = {
  done: true,
  value: undefined
};
exports.FIN = FIN;
var Iterator;
exports.Iterator = Iterator;

(function (Iterator) {
  var _empty = {
    next: function () {
      return FIN;
    }
  };

  function empty() {
    return _empty;
  }

  Iterator.empty = empty;

  function fromArray(array, index, length) {
    if (index === void 0) {
      index = 0;
    }

    if (length === void 0) {
      length = array.length;
    }

    return {
      next: function () {
        if (index >= length) {
          return FIN;
        }

        return {
          done: false,
          value: array[index++]
        };
      }
    };
  }

  Iterator.fromArray = fromArray;

  function from(elements) {
    if (!elements) {
      return Iterator.empty();
    } else if (Array.isArray(elements)) {
      return Iterator.fromArray(elements);
    } else {
      return elements;
    }
  }

  Iterator.from = from;

  function map(iterator, fn) {
    return {
      next: function () {
        var element = iterator.next();

        if (element.done) {
          return FIN;
        } else {
          return {
            done: false,
            value: fn(element.value)
          };
        }
      }
    };
  }

  Iterator.map = map;

  function filter(iterator, fn) {
    return {
      next: function () {
        while (true) {
          var element = iterator.next();

          if (element.done) {
            return FIN;
          }

          if (fn(element.value)) {
            return {
              done: false,
              value: element.value
            };
          }
        }
      }
    };
  }

  Iterator.filter = filter;

  function forEach(iterator, fn) {
    for (var next = iterator.next(); !next.done; next = iterator.next()) {
      fn(next.value);
    }
  }

  Iterator.forEach = forEach;

  function collect(iterator) {
    var result = [];
    forEach(iterator, function (value) {
      return result.push(value);
    });
    return result;
  }

  Iterator.collect = collect;
})(Iterator || (exports.Iterator = Iterator = {}));

var ArrayIterator =
/** @class */
function () {
  function ArrayIterator(items, start, end, index) {
    if (start === void 0) {
      start = 0;
    }

    if (end === void 0) {
      end = items.length;
    }

    if (index === void 0) {
      index = start - 1;
    }

    this.items = items;
    this.start = start;
    this.end = end;
    this.index = index;
  }

  ArrayIterator.prototype.next = function () {
    this.index = Math.min(this.index + 1, this.end);
    return this.current();
  };

  ArrayIterator.prototype.current = function () {
    if (this.index === this.start - 1 || this.index === this.end) {
      return null;
    }

    return this.items[this.index];
  };

  return ArrayIterator;
}();

exports.ArrayIterator = ArrayIterator;

var ArrayNavigator =
/** @class */
function (_super) {
  __extends(ArrayNavigator, _super);

  function ArrayNavigator(items, start, end, index) {
    if (start === void 0) {
      start = 0;
    }

    if (end === void 0) {
      end = items.length;
    }

    if (index === void 0) {
      index = start - 1;
    }

    return _super.call(this, items, start, end, index) || this;
  }

  ArrayNavigator.prototype.current = function () {
    return _super.prototype.current.call(this);
  };

  ArrayNavigator.prototype.previous = function () {
    this.index = Math.max(this.index - 1, this.start - 1);
    return this.current();
  };

  ArrayNavigator.prototype.first = function () {
    this.index = this.start;
    return this.current();
  };

  ArrayNavigator.prototype.last = function () {
    this.index = this.end - 1;
    return this.current();
  };

  ArrayNavigator.prototype.parent = function () {
    return null;
  };

  return ArrayNavigator;
}(ArrayIterator);

exports.ArrayNavigator = ArrayNavigator;

var MappedIterator =
/** @class */
function () {
  function MappedIterator(iterator, fn) {
    this.iterator = iterator;
    this.fn = fn; // noop
  }

  MappedIterator.prototype.next = function () {
    return this.fn(this.iterator.next());
  };

  return MappedIterator;
}();

exports.MappedIterator = MappedIterator;
},{}],"node_modules/monaco-editor/esm/vs/base/common/linkedList.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinkedList = void 0;

var _iterator = require("./iterator.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var Node =
/** @class */
function () {
  function Node(element) {
    this.element = element;
  }

  return Node;
}();

var LinkedList =
/** @class */
function () {
  function LinkedList() {}

  LinkedList.prototype.isEmpty = function () {
    return !this._first;
  };

  LinkedList.prototype.unshift = function (element) {
    return this.insert(element, false);
  };

  LinkedList.prototype.push = function (element) {
    return this.insert(element, true);
  };

  LinkedList.prototype.insert = function (element, atTheEnd) {
    var _this = this;

    var newNode = new Node(element);

    if (!this._first) {
      this._first = newNode;
      this._last = newNode;
    } else if (atTheEnd) {
      // push
      var oldLast = this._last;
      this._last = newNode;
      newNode.prev = oldLast;
      oldLast.next = newNode;
    } else {
      // unshift
      var oldFirst = this._first;
      this._first = newNode;
      newNode.next = oldFirst;
      oldFirst.prev = newNode;
    }

    return function () {
      var candidate = _this._first;

      while (candidate instanceof Node) {
        if (candidate !== newNode) {
          candidate = candidate.next;
          continue;
        }

        if (candidate.prev && candidate.next) {
          // middle
          var anchor = candidate.prev;
          anchor.next = candidate.next;
          candidate.next.prev = anchor;
        } else if (!candidate.prev && !candidate.next) {
          // only node
          _this._first = undefined;
          _this._last = undefined;
        } else if (!candidate.next) {
          // last
          _this._last = _this._last.prev;
          _this._last.next = undefined;
        } else if (!candidate.prev) {
          // first
          _this._first = _this._first.next;
          _this._first.prev = undefined;
        } // done


        break;
      }
    };
  };

  LinkedList.prototype.iterator = function () {
    var element;
    var node = this._first;
    return {
      next: function () {
        if (!node) {
          return _iterator.FIN;
        }

        if (!element) {
          element = {
            done: false,
            value: node.element
          };
        } else {
          element.value = node.element;
        }

        node = node.next;
        return element;
      }
    };
  };

  return LinkedList;
}();

exports.LinkedList = LinkedList;
},{"./iterator.js":"node_modules/monaco-editor/esm/vs/base/common/iterator.js"}],"node_modules/monaco-editor/esm/vs/base/common/event.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.once = once;
exports.anyEvent = anyEvent;
exports.debounceEvent = debounceEvent;
exports.mapEvent = mapEvent;
exports.filterEvent = filterEvent;
exports.chain = chain;
exports.Relay = exports.EventBufferer = exports.EventMultiplexer = exports.Emitter = exports.Event = void 0;

var _errors = require("./errors.js");

var _functional = require("./functional.js");

var _lifecycle = require("./lifecycle.js");

var _linkedList = require("./linkedList.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var Event;
exports.Event = Event;

(function (Event) {
  var _disposable = {
    dispose: function () {}
  };

  Event.None = function () {
    return _disposable;
  };
})(Event || (exports.Event = Event = {}));
/**
 * The Emitter can be used to expose an Event to the public
 * to fire it from the insides.
 * Sample:
    class Document {

        private _onDidChange = new Emitter<(value:string)=>any>();

        public onDidChange = this._onDidChange.event;

        // getter-style
        // get onDidChange(): Event<(value:string)=>any> {
        // 	return this._onDidChange.event;
        // }

        private _doIt() {
            //...
            this._onDidChange.fire(value);
        }
    }
 */


var Emitter =
/** @class */
function () {
  function Emitter(_options) {
    if (_options === void 0) {
      _options = null;
    }

    this._options = _options;
    this._event = null;
    this._disposed = false;
    this._deliveryQueue = null;
    this._listeners = null;
  }

  Object.defineProperty(Emitter.prototype, "event", {
    /**
     * For the public to allow to subscribe
     * to events from this Emitter
     */
    get: function () {
      var _this = this;

      if (!this._event) {
        this._event = function (listener, thisArgs, disposables) {
          if (!_this._listeners) {
            _this._listeners = new _linkedList.LinkedList();
          }

          var firstListener = _this._listeners.isEmpty();

          if (firstListener && _this._options && _this._options.onFirstListenerAdd) {
            _this._options.onFirstListenerAdd(_this);
          }

          var remove = _this._listeners.push(!thisArgs ? listener : [listener, thisArgs]);

          if (firstListener && _this._options && _this._options.onFirstListenerDidAdd) {
            _this._options.onFirstListenerDidAdd(_this);
          }

          if (_this._options && _this._options.onListenerDidAdd) {
            _this._options.onListenerDidAdd(_this, listener, thisArgs);
          }

          var result;
          result = {
            dispose: function () {
              result.dispose = Emitter._noop;

              if (!_this._disposed) {
                remove();

                if (_this._options && _this._options.onLastListenerRemove) {
                  var hasListeners = _this._listeners && !_this._listeners.isEmpty();

                  if (!hasListeners) {
                    _this._options.onLastListenerRemove(_this);
                  }
                }
              }
            }
          };

          if (Array.isArray(disposables)) {
            disposables.push(result);
          }

          return result;
        };
      }

      return this._event;
    },
    enumerable: true,
    configurable: true
  });
  /**
   * To be kept private to fire an event to
   * subscribers
   */

  Emitter.prototype.fire = function (event) {
    if (this._listeners) {
      // put all [listener,event]-pairs into delivery queue
      // then emit all event. an inner/nested event might be
      // the driver of this
      if (!this._deliveryQueue) {
        this._deliveryQueue = [];
      }

      for (var iter = this._listeners.iterator(), e = iter.next(); !e.done; e = iter.next()) {
        this._deliveryQueue.push([e.value, event]);
      }

      while (this._deliveryQueue.length > 0) {
        var _a = this._deliveryQueue.shift(),
            listener = _a[0],
            event_1 = _a[1];

        try {
          if (typeof listener === 'function') {
            listener.call(undefined, event_1);
          } else {
            listener[0].call(listener[1], event_1);
          }
        } catch (e) {
          (0, _errors.onUnexpectedError)(e);
        }
      }
    }
  };

  Emitter.prototype.dispose = function () {
    if (this._listeners) {
      this._listeners = null;
    }

    if (this._deliveryQueue) {
      this._deliveryQueue.length = 0;
    }

    this._disposed = true;
  };

  Emitter._noop = function () {};

  return Emitter;
}();

exports.Emitter = Emitter;

var EventMultiplexer =
/** @class */
function () {
  function EventMultiplexer() {
    var _this = this;

    this.hasListeners = false;
    this.events = [];
    this.emitter = new Emitter({
      onFirstListenerAdd: function () {
        return _this.onFirstListenerAdd();
      },
      onLastListenerRemove: function () {
        return _this.onLastListenerRemove();
      }
    });
  }

  Object.defineProperty(EventMultiplexer.prototype, "event", {
    get: function () {
      return this.emitter.event;
    },
    enumerable: true,
    configurable: true
  });

  EventMultiplexer.prototype.add = function (event) {
    var _this = this;

    var e = {
      event: event,
      listener: null
    };
    this.events.push(e);

    if (this.hasListeners) {
      this.hook(e);
    }

    var dispose = function () {
      if (_this.hasListeners) {
        _this.unhook(e);
      }

      var idx = _this.events.indexOf(e);

      _this.events.splice(idx, 1);
    };

    return (0, _lifecycle.toDisposable)((0, _functional.once)(dispose));
  };

  EventMultiplexer.prototype.onFirstListenerAdd = function () {
    var _this = this;

    this.hasListeners = true;
    this.events.forEach(function (e) {
      return _this.hook(e);
    });
  };

  EventMultiplexer.prototype.onLastListenerRemove = function () {
    var _this = this;

    this.hasListeners = false;
    this.events.forEach(function (e) {
      return _this.unhook(e);
    });
  };

  EventMultiplexer.prototype.hook = function (e) {
    var _this = this;

    e.listener = e.event(function (r) {
      return _this.emitter.fire(r);
    });
  };

  EventMultiplexer.prototype.unhook = function (e) {
    if (e.listener) {
      e.listener.dispose();
    }

    e.listener = null;
  };

  EventMultiplexer.prototype.dispose = function () {
    this.emitter.dispose();
  };

  return EventMultiplexer;
}();

exports.EventMultiplexer = EventMultiplexer;

function once(event) {
  return function (listener, thisArgs, disposables) {
    if (thisArgs === void 0) {
      thisArgs = null;
    } // we need this, in case the event fires during the listener call


    var didFire = false;
    var result = event(function (e) {
      if (didFire) {
        return;
      } else if (result) {
        result.dispose();
      } else {
        didFire = true;
      }

      return listener.call(thisArgs, e);
    }, null, disposables);

    if (didFire) {
      result.dispose();
    }

    return result;
  };
}

function anyEvent() {
  var events = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    events[_i] = arguments[_i];
  }

  return function (listener, thisArgs, disposables) {
    if (thisArgs === void 0) {
      thisArgs = null;
    }

    return (0, _lifecycle.combinedDisposable)(events.map(function (event) {
      return event(function (e) {
        return listener.call(thisArgs, e);
      }, null, disposables);
    }));
  };
}

function debounceEvent(event, merger, delay, leading) {
  if (delay === void 0) {
    delay = 100;
  }

  if (leading === void 0) {
    leading = false;
  }

  var subscription;
  var output = undefined;
  var handle = undefined;
  var numDebouncedCalls = 0;
  var emitter = new Emitter({
    onFirstListenerAdd: function () {
      subscription = event(function (cur) {
        numDebouncedCalls++;
        output = merger(output, cur);

        if (leading && !handle) {
          emitter.fire(output);
        }

        clearTimeout(handle);
        handle = setTimeout(function () {
          var _output = output;
          output = undefined;
          handle = undefined;

          if (!leading || numDebouncedCalls > 1) {
            emitter.fire(_output);
          }

          numDebouncedCalls = 0;
        }, delay);
      });
    },
    onLastListenerRemove: function () {
      subscription.dispose();
    }
  });
  return emitter.event;
}
/**
 * The EventDelayer is useful in situations in which you want
 * to delay firing your events during some code.
 * You can wrap that code and be sure that the event will not
 * be fired during that wrap.
 *
 * ```
 * const emitter: Emitter;
 * const delayer = new EventDelayer();
 * const delayedEvent = delayer.wrapEvent(emitter.event);
 *
 * delayedEvent(console.log);
 *
 * delayer.bufferEvents(() => {
 *   emitter.fire(); // event will not be fired yet
 * });
 *
 * // event will only be fired at this point
 * ```
 */


var EventBufferer =
/** @class */
function () {
  function EventBufferer() {
    this.buffers = [];
  }

  EventBufferer.prototype.wrapEvent = function (event) {
    var _this = this;

    return function (listener, thisArgs, disposables) {
      return event(function (i) {
        var buffer = _this.buffers[_this.buffers.length - 1];

        if (buffer) {
          buffer.push(function () {
            return listener.call(thisArgs, i);
          });
        } else {
          listener.call(thisArgs, i);
        }
      }, void 0, disposables);
    };
  };

  EventBufferer.prototype.bufferEvents = function (fn) {
    var buffer = [];
    this.buffers.push(buffer);
    var r = fn();
    this.buffers.pop();
    buffer.forEach(function (flush) {
      return flush();
    });
    return r;
  };

  return EventBufferer;
}();

exports.EventBufferer = EventBufferer;

function mapEvent(event, map) {
  return function (listener, thisArgs, disposables) {
    if (thisArgs === void 0) {
      thisArgs = null;
    }

    return event(function (i) {
      return listener.call(thisArgs, map(i));
    }, null, disposables);
  };
}

function filterEvent(event, filter) {
  return function (listener, thisArgs, disposables) {
    if (thisArgs === void 0) {
      thisArgs = null;
    }

    return event(function (e) {
      return filter(e) && listener.call(thisArgs, e);
    }, null, disposables);
  };
}

var ChainableEvent =
/** @class */
function () {
  function ChainableEvent(_event) {
    this._event = _event;
  }

  Object.defineProperty(ChainableEvent.prototype, "event", {
    get: function () {
      return this._event;
    },
    enumerable: true,
    configurable: true
  });

  ChainableEvent.prototype.map = function (fn) {
    return new ChainableEvent(mapEvent(this._event, fn));
  };

  ChainableEvent.prototype.filter = function (fn) {
    return new ChainableEvent(filterEvent(this._event, fn));
  };

  ChainableEvent.prototype.on = function (listener, thisArgs, disposables) {
    return this._event(listener, thisArgs, disposables);
  };

  return ChainableEvent;
}();

function chain(event) {
  return new ChainableEvent(event);
}

var Relay =
/** @class */
function () {
  function Relay() {
    var _this = this;

    this.listening = false;
    this.inputEvent = Event.None;
    this.inputEventListener = _lifecycle.Disposable.None;
    this.emitter = new Emitter({
      onFirstListenerDidAdd: function () {
        _this.listening = true;
        _this.inputEventListener = _this.inputEvent(_this.emitter.fire, _this.emitter);
      },
      onLastListenerRemove: function () {
        _this.listening = false;

        _this.inputEventListener.dispose();
      }
    });
    this.event = this.emitter.event;
  }

  Object.defineProperty(Relay.prototype, "input", {
    set: function (event) {
      this.inputEvent = event;

      if (this.listening) {
        this.inputEventListener.dispose();
        this.inputEventListener = event(this.emitter.fire, this.emitter);
      }
    },
    enumerable: true,
    configurable: true
  });

  Relay.prototype.dispose = function () {
    this.inputEventListener.dispose();
    this.emitter.dispose();
  };

  return Relay;
}();

exports.Relay = Relay;
},{"./errors.js":"node_modules/monaco-editor/esm/vs/base/common/errors.js","./functional.js":"node_modules/monaco-editor/esm/vs/base/common/functional.js","./lifecycle.js":"node_modules/monaco-editor/esm/vs/base/common/lifecycle.js","./linkedList.js":"node_modules/monaco-editor/esm/vs/base/common/linkedList.js"}],"node_modules/monaco-editor/esm/vs/base/common/cancellation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CancellationTokenSource = exports.CancellationToken = void 0;

var _event = require("./event.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var shortcutEvent = Object.freeze(function (callback, context) {
  var handle = setTimeout(callback.bind(context), 0);
  return {
    dispose: function () {
      clearTimeout(handle);
    }
  };
});
var CancellationToken;
exports.CancellationToken = CancellationToken;

(function (CancellationToken) {
  function isCancellationToken(thing) {
    if (thing === CancellationToken.None || thing === CancellationToken.Cancelled) {
      return true;
    }

    if (thing instanceof MutableToken) {
      return true;
    }

    if (!thing || typeof thing !== 'object') {
      return false;
    }

    return typeof thing.isCancellationRequested === 'boolean' && typeof thing.onCancellationRequested === 'function';
  }

  CancellationToken.isCancellationToken = isCancellationToken;
  CancellationToken.None = Object.freeze({
    isCancellationRequested: false,
    onCancellationRequested: _event.Event.None
  });
  CancellationToken.Cancelled = Object.freeze({
    isCancellationRequested: true,
    onCancellationRequested: shortcutEvent
  });
})(CancellationToken || (exports.CancellationToken = CancellationToken = {}));

var MutableToken =
/** @class */
function () {
  function MutableToken() {
    this._isCancelled = false;
    this._emitter = null;
  }

  MutableToken.prototype.cancel = function () {
    if (!this._isCancelled) {
      this._isCancelled = true;

      if (this._emitter) {
        this._emitter.fire(undefined);

        this.dispose();
      }
    }
  };

  Object.defineProperty(MutableToken.prototype, "isCancellationRequested", {
    get: function () {
      return this._isCancelled;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(MutableToken.prototype, "onCancellationRequested", {
    get: function () {
      if (this._isCancelled) {
        return shortcutEvent;
      }

      if (!this._emitter) {
        this._emitter = new _event.Emitter();
      }

      return this._emitter.event;
    },
    enumerable: true,
    configurable: true
  });

  MutableToken.prototype.dispose = function () {
    if (this._emitter) {
      this._emitter.dispose();

      this._emitter = null;
    }
  };

  return MutableToken;
}();

var CancellationTokenSource =
/** @class */
function () {
  function CancellationTokenSource() {}

  Object.defineProperty(CancellationTokenSource.prototype, "token", {
    get: function () {
      if (!this._token) {
        // be lazy and create the token only when
        // actually needed
        this._token = new MutableToken();
      }

      return this._token;
    },
    enumerable: true,
    configurable: true
  });

  CancellationTokenSource.prototype.cancel = function () {
    if (!this._token) {
      // save an object by returning the default
      // cancelled token when cancellation happens
      // before someone asks for the token
      this._token = CancellationToken.Cancelled;
    } else if (this._token instanceof MutableToken) {
      // actually cancel
      this._token.cancel();
    }
  };

  CancellationTokenSource.prototype.dispose = function () {
    if (!this._token) {
      // ensure to initialize with an empty token if we had none
      this._token = CancellationToken.None;
    } else if (this._token instanceof MutableToken) {
      // actually dispose
      this._token.dispose();
    }
  };

  return CancellationTokenSource;
}();

exports.CancellationTokenSource = CancellationTokenSource;
},{"./event.js":"node_modules/monaco-editor/esm/vs/base/common/event.js"}],"node_modules/monaco-editor/esm/vs/base/common/async.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isThenable = isThenable;
exports.createCancelablePromise = createCancelablePromise;
exports.timeout = timeout;
exports.always = always;
exports.first = first;
exports.IdleValue = exports.runWhenIdle = exports.RunOnceScheduler = exports.IntervalTimer = exports.TimeoutTimer = exports.Delayer = void 0;

var _cancellation = require("./cancellation.js");

var errors = _interopRequireWildcard(require("./errors.js"));

var _lifecycle = require("./lifecycle.js");

var _winjsBase = require("./winjs.base.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

function isThenable(obj) {
  return obj && typeof obj.then === 'function';
}

function createCancelablePromise(callback) {
  var source = new _cancellation.CancellationTokenSource();
  var thenable = callback(source.token);
  var promise = new Promise(function (resolve, reject) {
    source.token.onCancellationRequested(function () {
      reject(errors.canceled());
    });
    Promise.resolve(thenable).then(function (value) {
      source.dispose();
      resolve(value);
    }, function (err) {
      source.dispose();
      reject(err);
    });
  });
  return new (
  /** @class */
  function () {
    function class_1() {}

    class_1.prototype.cancel = function () {
      source.cancel();
    };

    class_1.prototype.then = function (resolve, reject) {
      return promise.then(resolve, reject);
    };

    class_1.prototype.catch = function (reject) {
      return this.then(undefined, reject);
    };

    return class_1;
  }())();
}
/**
 * A helper to delay execution of a task that is being requested often.
 *
 * Following the throttler, now imagine the mail man wants to optimize the number of
 * trips proactively. The trip itself can be long, so he decides not to make the trip
 * as soon as a letter is submitted. Instead he waits a while, in case more
 * letters are submitted. After said waiting period, if no letters were submitted, he
 * decides to make the trip. Imagine that N more letters were submitted after the first
 * one, all within a short period of time between each other. Even though N+1
 * submissions occurred, only 1 delivery was made.
 *
 * The delayer offers this behavior via the trigger() method, into which both the task
 * to be executed and the waiting period (delay) must be passed in as arguments. Following
 * the example:
 *
 * 		const delayer = new Delayer(WAITING_PERIOD);
 * 		const letters = [];
 *
 * 		function letterReceived(l) {
 * 			letters.push(l);
 * 			delayer.trigger(() => { return makeTheTrip(); });
 * 		}
 */


var Delayer =
/** @class */
function () {
  function Delayer(defaultDelay) {
    this.defaultDelay = defaultDelay;
    this.timeout = null;
    this.completionPromise = null;
    this.doResolve = null;
    this.task = null;
  }

  Delayer.prototype.trigger = function (task, delay) {
    var _this = this;

    if (delay === void 0) {
      delay = this.defaultDelay;
    }

    this.task = task;
    this.cancelTimeout();

    if (!this.completionPromise) {
      this.completionPromise = new _winjsBase.TPromise(function (c, e) {
        _this.doResolve = c;
        _this.doReject = e;
      }).then(function () {
        _this.completionPromise = null;
        _this.doResolve = null;
        var task = _this.task;
        _this.task = null;
        return task();
      });
    }

    this.timeout = setTimeout(function () {
      _this.timeout = null;

      _this.doResolve(null);
    }, delay);
    return this.completionPromise;
  };

  Delayer.prototype.cancel = function () {
    this.cancelTimeout();

    if (this.completionPromise) {
      this.doReject(errors.canceled());
      this.completionPromise = null;
    }
  };

  Delayer.prototype.cancelTimeout = function () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  };

  Delayer.prototype.dispose = function () {
    this.cancelTimeout();
  };

  return Delayer;
}();

exports.Delayer = Delayer;

function timeout(millis, token) {
  if (!token) {
    return createCancelablePromise(function (token) {
      return timeout(millis, token);
    });
  }

  return new Promise(function (resolve, reject) {
    var handle = setTimeout(resolve, millis);
    token.onCancellationRequested(function () {
      clearTimeout(handle);
      reject(errors.canceled());
    });
  });
}
/**
 * Returns a new promise that joins the provided promise. Upon completion of
 * the provided promise the provided function will always be called. This
 * method is comparable to a try-finally code block.
 * @param promise a promise
 * @param callback a function that will be call in the success and error case.
 */


function always(promise, callback) {
  function safeCallback() {
    try {
      callback();
    } catch (err) {
      errors.onUnexpectedError(err);
    }
  }

  promise.then(function (_) {
    return safeCallback();
  }, function (_) {
    return safeCallback();
  });
  return Promise.resolve(promise);
}

function first(promiseFactories, shouldStop, defaultValue) {
  if (shouldStop === void 0) {
    shouldStop = function (t) {
      return !!t;
    };
  }

  if (defaultValue === void 0) {
    defaultValue = null;
  }

  var index = 0;
  var len = promiseFactories.length;

  var loop = function () {
    if (index >= len) {
      return Promise.resolve(defaultValue);
    }

    var factory = promiseFactories[index++];
    var promise = Promise.resolve(factory());
    return promise.then(function (result) {
      if (shouldStop(result)) {
        return Promise.resolve(result);
      }

      return loop();
    });
  };

  return loop();
}

var TimeoutTimer =
/** @class */
function (_super) {
  __extends(TimeoutTimer, _super);

  function TimeoutTimer(runner, timeout) {
    var _this = _super.call(this) || this;

    _this._token = -1;

    if (typeof runner === 'function' && typeof timeout === 'number') {
      _this.setIfNotSet(runner, timeout);
    }

    return _this;
  }

  TimeoutTimer.prototype.dispose = function () {
    this.cancel();

    _super.prototype.dispose.call(this);
  };

  TimeoutTimer.prototype.cancel = function () {
    if (this._token !== -1) {
      clearTimeout(this._token);
      this._token = -1;
    }
  };

  TimeoutTimer.prototype.cancelAndSet = function (runner, timeout) {
    var _this = this;

    this.cancel();
    this._token = setTimeout(function () {
      _this._token = -1;
      runner();
    }, timeout);
  };

  TimeoutTimer.prototype.setIfNotSet = function (runner, timeout) {
    var _this = this;

    if (this._token !== -1) {
      // timer is already set
      return;
    }

    this._token = setTimeout(function () {
      _this._token = -1;
      runner();
    }, timeout);
  };

  return TimeoutTimer;
}(_lifecycle.Disposable);

exports.TimeoutTimer = TimeoutTimer;

var IntervalTimer =
/** @class */
function (_super) {
  __extends(IntervalTimer, _super);

  function IntervalTimer() {
    var _this = _super.call(this) || this;

    _this._token = -1;
    return _this;
  }

  IntervalTimer.prototype.dispose = function () {
    this.cancel();

    _super.prototype.dispose.call(this);
  };

  IntervalTimer.prototype.cancel = function () {
    if (this._token !== -1) {
      clearInterval(this._token);
      this._token = -1;
    }
  };

  IntervalTimer.prototype.cancelAndSet = function (runner, interval) {
    this.cancel();
    this._token = setInterval(function () {
      runner();
    }, interval);
  };

  return IntervalTimer;
}(_lifecycle.Disposable);

exports.IntervalTimer = IntervalTimer;

var RunOnceScheduler =
/** @class */
function () {
  function RunOnceScheduler(runner, timeout) {
    this.timeoutToken = -1;
    this.runner = runner;
    this.timeout = timeout;
    this.timeoutHandler = this.onTimeout.bind(this);
  }
  /**
   * Dispose RunOnceScheduler
   */


  RunOnceScheduler.prototype.dispose = function () {
    this.cancel();
    this.runner = null;
  };
  /**
   * Cancel current scheduled runner (if any).
   */


  RunOnceScheduler.prototype.cancel = function () {
    if (this.isScheduled()) {
      clearTimeout(this.timeoutToken);
      this.timeoutToken = -1;
    }
  };
  /**
   * Cancel previous runner (if any) & schedule a new runner.
   */


  RunOnceScheduler.prototype.schedule = function (delay) {
    if (delay === void 0) {
      delay = this.timeout;
    }

    this.cancel();
    this.timeoutToken = setTimeout(this.timeoutHandler, delay);
  };
  /**
   * Returns true if scheduled.
   */


  RunOnceScheduler.prototype.isScheduled = function () {
    return this.timeoutToken !== -1;
  };

  RunOnceScheduler.prototype.onTimeout = function () {
    this.timeoutToken = -1;

    if (this.runner) {
      this.doRun();
    }
  };

  RunOnceScheduler.prototype.doRun = function () {
    if (this.runner) {
      this.runner();
    }
  };

  return RunOnceScheduler;
}();

exports.RunOnceScheduler = RunOnceScheduler;

/**
 * Execute the callback the next time the browser is idle
 */
var runWhenIdle;
exports.runWhenIdle = runWhenIdle;

(function () {
  if (typeof requestIdleCallback !== 'function' || typeof cancelIdleCallback !== 'function') {
    var dummyIdle_1 = Object.freeze({
      didTimeout: true,
      timeRemaining: function () {
        return 15;
      }
    });

    exports.runWhenIdle = runWhenIdle = function (runner, timeout) {
      if (timeout === void 0) {
        timeout = 0;
      }

      var handle = setTimeout(function () {
        return runner(dummyIdle_1);
      }, timeout);
      var disposed = false;
      return {
        dispose: function () {
          if (disposed) {
            return;
          }

          disposed = true;
          clearTimeout(handle);
        }
      };
    };
  } else {
    exports.runWhenIdle = runWhenIdle = function (runner, timeout) {
      var handle = requestIdleCallback(runner, typeof timeout === 'number' ? {
        timeout: timeout
      } : undefined);
      var disposed = false;
      return {
        dispose: function () {
          if (disposed) {
            return;
          }

          disposed = true;
          cancelIdleCallback(handle);
        }
      };
    };
  }
})();
/**
 * An implementation of the "idle-until-urgent"-strategy as introduced
 * here: https://philipwalton.com/articles/idle-until-urgent/
 */


var IdleValue =
/** @class */
function () {
  function IdleValue(executor) {
    var _this = this;

    this._executor = function () {
      try {
        _this._value = executor();
      } catch (err) {
        _this._error = err;
      } finally {
        _this._didRun = true;
      }
    };

    this._handle = runWhenIdle(function () {
      return _this._executor();
    });
  }

  IdleValue.prototype.dispose = function () {
    this._handle.dispose();
  };

  IdleValue.prototype.getValue = function () {
    if (!this._didRun) {
      this._handle.dispose();

      this._executor();
    }

    if (this._error) {
      throw this._error;
    }

    return this._value;
  };

  return IdleValue;
}(); //#endregion


exports.IdleValue = IdleValue;
},{"./cancellation.js":"node_modules/monaco-editor/esm/vs/base/common/cancellation.js","./errors.js":"node_modules/monaco-editor/esm/vs/base/common/errors.js","./lifecycle.js":"node_modules/monaco-editor/esm/vs/base/common/lifecycle.js","./winjs.base.js":"node_modules/monaco-editor/esm/vs/base/common/winjs.base.js"}],"node_modules/monaco-editor/esm/vs/base/common/winjs.polyfill.promise.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolyfillPromise = void 0;

var _winjsBase = require("./winjs.base.js");

var platform = _interopRequireWildcard(require("./platform.js"));

var _async = require("./async.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function isWinJSPromise(candidate) {
  return (0, _async.isThenable)(candidate) && typeof candidate.done === 'function';
}
/**
 * A polyfill for the native promises. The implementation is based on
 * WinJS promises but tries to gap differences between winjs promises
 * and native promises.
 */


var PolyfillPromise =
/** @class */
function () {
  function PolyfillPromise(initOrPromise) {
    if (isWinJSPromise(initOrPromise)) {
      this._winjsPromise = initOrPromise;
    } else {
      this._winjsPromise = new _winjsBase.Promise(function (resolve, reject) {
        var initializing = true;
        initOrPromise(function (value) {
          if (!initializing) {
            resolve(value);
          } else {
            platform.setImmediate(function () {
              return resolve(value);
            });
          }
        }, function (err) {
          if (!initializing) {
            reject(err);
          } else {
            platform.setImmediate(function () {
              return reject(err);
            });
          }
        });
        initializing = false;
      });
    }
  }

  PolyfillPromise.all = function (thenables) {
    return new PolyfillPromise(_winjsBase.Promise.join(thenables).then(null, function (values) {
      // WinJSPromise returns a sparse array whereas
      // native promises return the *first* error
      for (var key in values) {
        if (values.hasOwnProperty(key)) {
          return values[key];
        }
      }
    }));
  };

  PolyfillPromise.race = function (thenables) {
    // WinJSPromise returns `{ key: <index/key>, value: <promise> }`
    // from the `any` call and Promise.race just wants the value
    return new PolyfillPromise(_winjsBase.Promise.any(thenables).then(function (entry) {
      return entry.value;
    }, function (err) {
      return err.value;
    }));
  };

  PolyfillPromise.resolve = function (value) {
    return new PolyfillPromise(_winjsBase.Promise.wrap(value));
  };

  PolyfillPromise.reject = function (value) {
    return new PolyfillPromise(_winjsBase.Promise.wrapError(value));
  };

  PolyfillPromise.prototype.then = function (onFulfilled, onRejected) {
    var sync = true; // To support chaining, we need to return the value of the
    // onFulfilled and onRejected callback.
    // WinJSPromise supports a flat-map style #then, ie. the callbacks
    // passed to WinJSPromise#then can return a Promise.

    var promise = new PolyfillPromise(this._winjsPromise.then(onFulfilled && function (value) {
      if (!sync) {
        return onFulfilled(value);
      } else {
        return new _winjsBase.Promise(function (resolve, reject) {
          platform.setImmediate(function () {
            var result;

            try {
              result = onFulfilled(value);
            } catch (err2) {
              reject(err2);
              return;
            }

            resolve(result);
          });
        });
      }
    }, onRejected && function (err) {
      if (!sync) {
        return onRejected(err);
      } else {
        return new _winjsBase.Promise(function (resolve, reject) {
          platform.setImmediate(function () {
            var result;

            try {
              result = onRejected(err);
            } catch (err2) {
              reject(err2);
              return;
            }

            resolve(result);
          });
        });
      }
    }));
    sync = false;
    return promise;
  };

  PolyfillPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
  };

  return PolyfillPromise;
}();

exports.PolyfillPromise = PolyfillPromise;
},{"./winjs.base.js":"node_modules/monaco-editor/esm/vs/base/common/winjs.base.js","./platform.js":"node_modules/monaco-editor/esm/vs/base/common/platform.js","./async.js":"node_modules/monaco-editor/esm/vs/base/common/async.js"}],"node_modules/monaco-editor/esm/vs/base/common/worker/simpleWorker.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logOnceWebWorkerWarning = logOnceWebWorkerWarning;
exports.create = create;
exports.SimpleWorkerServer = exports.SimpleWorkerClient = void 0;

var _errors = require("../errors.js");

var _lifecycle = require("../lifecycle.js");

var _platform = require("../platform.js");

var _winjsPolyfillPromise = require("../winjs.polyfill.promise.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var global = self; // When missing, polyfill the native promise
// with our winjs-based polyfill

if (typeof global.Promise === 'undefined') {
  global.Promise = _winjsPolyfillPromise.PolyfillPromise;
}

var INITIALIZE = '$initialize';
var webWorkerWarningLogged = false;

function logOnceWebWorkerWarning(err) {
  if (!_platform.isWeb) {
    // running tests
    return;
  }

  if (!webWorkerWarningLogged) {
    webWorkerWarningLogged = true;
    console.warn('Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes. Please see https://github.com/Microsoft/monaco-editor#faq');
  }

  console.warn(err.message);
}

var SimpleWorkerProtocol =
/** @class */
function () {
  function SimpleWorkerProtocol(handler) {
    this._workerId = -1;
    this._handler = handler;
    this._lastSentReq = 0;
    this._pendingReplies = Object.create(null);
  }

  SimpleWorkerProtocol.prototype.setWorkerId = function (workerId) {
    this._workerId = workerId;
  };

  SimpleWorkerProtocol.prototype.sendMessage = function (method, args) {
    var _this = this;

    var req = String(++this._lastSentReq);
    return new Promise(function (resolve, reject) {
      _this._pendingReplies[req] = {
        resolve: resolve,
        reject: reject
      };

      _this._send({
        vsWorker: _this._workerId,
        req: req,
        method: method,
        args: args
      });
    });
  };

  SimpleWorkerProtocol.prototype.handleMessage = function (serializedMessage) {
    var message;

    try {
      message = JSON.parse(serializedMessage);
    } catch (e) {
      // nothing
      return;
    }

    if (!message || !message.vsWorker) {
      return;
    }

    if (this._workerId !== -1 && message.vsWorker !== this._workerId) {
      return;
    }

    this._handleMessage(message);
  };

  SimpleWorkerProtocol.prototype._handleMessage = function (msg) {
    var _this = this;

    if (msg.seq) {
      var replyMessage = msg;

      if (!this._pendingReplies[replyMessage.seq]) {
        console.warn('Got reply to unknown seq');
        return;
      }

      var reply = this._pendingReplies[replyMessage.seq];
      delete this._pendingReplies[replyMessage.seq];

      if (replyMessage.err) {
        var err = replyMessage.err;

        if (replyMessage.err.$isError) {
          err = new Error();
          err.name = replyMessage.err.name;
          err.message = replyMessage.err.message;
          err.stack = replyMessage.err.stack;
        }

        reply.reject(err);
        return;
      }

      reply.resolve(replyMessage.res);
      return;
    }

    var requestMessage = msg;
    var req = requestMessage.req;

    var result = this._handler.handleMessage(requestMessage.method, requestMessage.args);

    result.then(function (r) {
      _this._send({
        vsWorker: _this._workerId,
        seq: req,
        res: r,
        err: undefined
      });
    }, function (e) {
      if (e.detail instanceof Error) {
        // Loading errors have a detail property that points to the actual error
        e.detail = (0, _errors.transformErrorForSerialization)(e.detail);
      }

      _this._send({
        vsWorker: _this._workerId,
        seq: req,
        res: undefined,
        err: (0, _errors.transformErrorForSerialization)(e)
      });
    });
  };

  SimpleWorkerProtocol.prototype._send = function (msg) {
    var strMsg = JSON.stringify(msg); // console.log('SENDING: ' + strMsg);

    this._handler.sendMessage(strMsg);
  };

  return SimpleWorkerProtocol;
}();
/**
 * Main thread side
 */


var SimpleWorkerClient =
/** @class */
function (_super) {
  __extends(SimpleWorkerClient, _super);

  function SimpleWorkerClient(workerFactory, moduleId) {
    var _this = _super.call(this) || this;

    var lazyProxyReject = null;
    _this._worker = _this._register(workerFactory.create('vs/base/common/worker/simpleWorker', function (msg) {
      _this._protocol.handleMessage(msg);
    }, function (err) {
      // in Firefox, web workers fail lazily :(
      // we will reject the proxy
      if (lazyProxyReject) {
        lazyProxyReject(err);
      }
    }));
    _this._protocol = new SimpleWorkerProtocol({
      sendMessage: function (msg) {
        _this._worker.postMessage(msg);
      },
      handleMessage: function (method, args) {
        // Intentionally not supporting worker -> main requests
        return Promise.resolve(null);
      }
    });

    _this._protocol.setWorkerId(_this._worker.getId()); // Gather loader configuration


    var loaderConfiguration = null;

    if (typeof self.require !== 'undefined' && typeof self.require.getConfig === 'function') {
      // Get the configuration from the Monaco AMD Loader
      loaderConfiguration = self.require.getConfig();
    } else if (typeof self.requirejs !== 'undefined') {
      // Get the configuration from requirejs
      loaderConfiguration = self.requirejs.s.contexts._.config;
    } // Send initialize message


    _this._onModuleLoaded = _this._protocol.sendMessage(INITIALIZE, [_this._worker.getId(), moduleId, loaderConfiguration]);
    _this._lazyProxy = new Promise(function (resolve, reject) {
      lazyProxyReject = reject;

      _this._onModuleLoaded.then(function (availableMethods) {
        var proxy = {};

        for (var i = 0; i < availableMethods.length; i++) {
          proxy[availableMethods[i]] = createProxyMethod(availableMethods[i], proxyMethodRequest);
        }

        resolve(proxy);
      }, function (e) {
        reject(e);

        _this._onError('Worker failed to load ' + moduleId, e);
      });
    }); // Create proxy to loaded code

    var proxyMethodRequest = function (method, args) {
      return _this._request(method, args);
    };

    var createProxyMethod = function (method, proxyMethodRequest) {
      return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        return proxyMethodRequest(method, args);
      };
    };

    return _this;
  }

  SimpleWorkerClient.prototype.getProxyObject = function () {
    return this._lazyProxy;
  };

  SimpleWorkerClient.prototype._request = function (method, args) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      _this._onModuleLoaded.then(function () {
        _this._protocol.sendMessage(method, args).then(resolve, reject);
      }, reject);
    });
  };

  SimpleWorkerClient.prototype._onError = function (message, error) {
    console.error(message);
    console.info(error);
  };

  return SimpleWorkerClient;
}(_lifecycle.Disposable);

exports.SimpleWorkerClient = SimpleWorkerClient;

/**
 * Worker side
 */
var SimpleWorkerServer =
/** @class */
function () {
  function SimpleWorkerServer(postSerializedMessage, requestHandler) {
    var _this = this;

    this._requestHandler = requestHandler;
    this._protocol = new SimpleWorkerProtocol({
      sendMessage: function (msg) {
        postSerializedMessage(msg);
      },
      handleMessage: function (method, args) {
        return _this._handleMessage(method, args);
      }
    });
  }

  SimpleWorkerServer.prototype.onmessage = function (msg) {
    this._protocol.handleMessage(msg);
  };

  SimpleWorkerServer.prototype._handleMessage = function (method, args) {
    if (method === INITIALIZE) {
      return this.initialize(args[0], args[1], args[2]);
    }

    if (!this._requestHandler || typeof this._requestHandler[method] !== 'function') {
      return Promise.reject(new Error('Missing requestHandler or method: ' + method));
    }

    try {
      return Promise.resolve(this._requestHandler[method].apply(this._requestHandler, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  SimpleWorkerServer.prototype.initialize = function (workerId, moduleId, loaderConfig) {
    var _this = this;

    this._protocol.setWorkerId(workerId);

    if (this._requestHandler) {
      // static request handler
      var methods = [];

      for (var prop in this._requestHandler) {
        if (typeof this._requestHandler[prop] === 'function') {
          methods.push(prop);
        }
      }

      return Promise.resolve(methods);
    }

    if (loaderConfig) {
      // Remove 'baseUrl', handling it is beyond scope for now
      if (typeof loaderConfig.baseUrl !== 'undefined') {
        delete loaderConfig['baseUrl'];
      }

      if (typeof loaderConfig.paths !== 'undefined') {
        if (typeof loaderConfig.paths.vs !== 'undefined') {
          delete loaderConfig.paths['vs'];
        }
      } // Since this is in a web worker, enable catching errors


      loaderConfig.catchError = true;

      self.require.config(loaderConfig);
    }

    return new Promise(function (resolve, reject) {
      // Use the global require to be sure to get the global config
      self.require([moduleId], function () {
        var result = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          result[_i] = arguments[_i];
        }

        var handlerModule = result[0];
        _this._requestHandler = handlerModule.create();

        if (!_this._requestHandler) {
          reject(new Error("No RequestHandler!"));
          return;
        }

        var methods = [];

        for (var prop in _this._requestHandler) {
          if (typeof _this._requestHandler[prop] === 'function') {
            methods.push(prop);
          }
        }

        resolve(methods);
      }, reject);
    });
  };

  return SimpleWorkerServer;
}();

exports.SimpleWorkerServer = SimpleWorkerServer;

/**
 * Called on the worker side
 */
function create(postMessage) {
  return new SimpleWorkerServer(postMessage, null);
}
},{"../errors.js":"node_modules/monaco-editor/esm/vs/base/common/errors.js","../lifecycle.js":"node_modules/monaco-editor/esm/vs/base/common/lifecycle.js","../platform.js":"node_modules/monaco-editor/esm/vs/base/common/platform.js","../winjs.polyfill.promise.js":"node_modules/monaco-editor/esm/vs/base/common/winjs.polyfill.promise.js"}],"node_modules/monaco-editor/esm/vs/base/common/arrays.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tail = tail;
exports.tail2 = tail2;
exports.equals = equals;
exports.binarySearch = binarySearch;
exports.findFirstInSorted = findFirstInSorted;
exports.mergeSort = mergeSort;
exports.groupBy = groupBy;
exports.coalesce = coalesce;
exports.isFalsyOrEmpty = isFalsyOrEmpty;
exports.distinct = distinct;
exports.firstIndex = firstIndex;
exports.first = first;
exports.flatten = flatten;
exports.range = range;
exports.arrayInsert = arrayInsert;

/**
 * Returns the last element of an array.
 * @param array The array.
 * @param n Which element from the end (default is zero).
 */
function tail(array, n) {
  if (n === void 0) {
    n = 0;
  }

  return array[array.length - (1 + n)];
}

function tail2(arr) {
  if (arr.length === 0) {
    throw new Error('Invalid tail call');
  }

  return [arr.slice(0, arr.length - 1), arr[arr.length - 1]];
}

function equals(one, other, itemEquals) {
  if (itemEquals === void 0) {
    itemEquals = function (a, b) {
      return a === b;
    };
  }

  if (one === other) {
    return true;
  }

  if (!one || !other) {
    return false;
  }

  if (one.length !== other.length) {
    return false;
  }

  for (var i = 0, len = one.length; i < len; i++) {
    if (!itemEquals(one[i], other[i])) {
      return false;
    }
  }

  return true;
}

function binarySearch(array, key, comparator) {
  var low = 0,
      high = array.length - 1;

  while (low <= high) {
    var mid = (low + high) / 2 | 0;
    var comp = comparator(array[mid], key);

    if (comp < 0) {
      low = mid + 1;
    } else if (comp > 0) {
      high = mid - 1;
    } else {
      return mid;
    }
  }

  return -(low + 1);
}
/**
 * Takes a sorted array and a function p. The array is sorted in such a way that all elements where p(x) is false
 * are located before all elements where p(x) is true.
 * @returns the least x for which p(x) is true or array.length if no element fullfills the given function.
 */


function findFirstInSorted(array, p) {
  var low = 0,
      high = array.length;

  if (high === 0) {
    return 0; // no children
  }

  while (low < high) {
    var mid = Math.floor((low + high) / 2);

    if (p(array[mid])) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  return low;
}
/**
 * Like `Array#sort` but always stable. Usually runs a little slower `than Array#sort`
 * so only use this when actually needing stable sort.
 */


function mergeSort(data, compare) {
  _sort(data, compare, 0, data.length - 1, []);

  return data;
}

function _merge(a, compare, lo, mid, hi, aux) {
  var leftIdx = lo,
      rightIdx = mid + 1;

  for (var i = lo; i <= hi; i++) {
    aux[i] = a[i];
  }

  for (var i = lo; i <= hi; i++) {
    if (leftIdx > mid) {
      // left side consumed
      a[i] = aux[rightIdx++];
    } else if (rightIdx > hi) {
      // right side consumed
      a[i] = aux[leftIdx++];
    } else if (compare(aux[rightIdx], aux[leftIdx]) < 0) {
      // right element is less -> comes first
      a[i] = aux[rightIdx++];
    } else {
      // left element comes first (less or equal)
      a[i] = aux[leftIdx++];
    }
  }
}

function _sort(a, compare, lo, hi, aux) {
  if (hi <= lo) {
    return;
  }

  var mid = lo + (hi - lo) / 2 | 0;

  _sort(a, compare, lo, mid, aux);

  _sort(a, compare, mid + 1, hi, aux);

  if (compare(a[mid], a[mid + 1]) <= 0) {
    // left and right are sorted and if the last-left element is less
    // or equals than the first-right element there is nothing else
    // to do
    return;
  }

  _merge(a, compare, lo, mid, hi, aux);
}

function groupBy(data, compare) {
  var result = [];
  var currentGroup = undefined;

  for (var _i = 0, _a = mergeSort(data.slice(0), compare); _i < _a.length; _i++) {
    var element = _a[_i];

    if (!currentGroup || compare(currentGroup[0], element) !== 0) {
      currentGroup = [element];
      result.push(currentGroup);
    } else {
      currentGroup.push(element);
    }
  }

  return result;
}
/**
 * @returns a new array with all falsy values removed. The original array IS NOT modified.
 */


function coalesce(array) {
  if (!array) {
    return array;
  }

  return array.filter(function (e) {
    return !!e;
  });
}
/**
 * @returns {{false}} if the provided object is an array
 * 	and not empty.
 */


function isFalsyOrEmpty(obj) {
  return !Array.isArray(obj) || obj.length === 0;
}
/**
 * Removes duplicates from the given array. The optional keyFn allows to specify
 * how elements are checked for equalness by returning a unique string for each.
 */


function distinct(array, keyFn) {
  if (!keyFn) {
    return array.filter(function (element, position) {
      return array.indexOf(element) === position;
    });
  }

  var seen = Object.create(null);
  return array.filter(function (elem) {
    var key = keyFn(elem);

    if (seen[key]) {
      return false;
    }

    seen[key] = true;
    return true;
  });
}

function firstIndex(array, fn) {
  for (var i = 0; i < array.length; i++) {
    var element = array[i];

    if (fn(element)) {
      return i;
    }
  }

  return -1;
}

function first(array, fn, notFoundValue) {
  if (notFoundValue === void 0) {
    notFoundValue = null;
  }

  var index = firstIndex(array, fn);
  return index < 0 ? notFoundValue : array[index];
}

function flatten(arr) {
  var _a;

  return (_a = []).concat.apply(_a, arr);
}

function range(arg, to) {
  var from = typeof to === 'number' ? arg : 0;

  if (typeof to === 'number') {
    from = arg;
  } else {
    from = 0;
    to = arg;
  }

  var result = [];

  if (from <= to) {
    for (var i = from; i < to; i++) {
      result.push(i);
    }
  } else {
    for (var i = from; i > to; i--) {
      result.push(i);
    }
  }

  return result;
}
/**
 * Insert `insertArr` inside `target` at `insertIndex`.
 * Please don't touch unless you understand https://jsperf.com/inserting-an-array-within-an-array
 */


function arrayInsert(target, insertIndex, insertArr) {
  var before = target.slice(0, insertIndex);
  var after = target.slice(insertIndex);
  return before.concat(insertArr, after);
}
},{}],"node_modules/monaco-editor/esm/vs/base/common/diff/diffChange.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiffChange = void 0;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Represents information about a specific difference between two sequences.
 */
var DiffChange =
/** @class */
function () {
  /**
   * Constructs a new DiffChange with the given sequence information
   * and content.
   */
  function DiffChange(originalStart, originalLength, modifiedStart, modifiedLength) {
    //Debug.Assert(originalLength > 0 || modifiedLength > 0, "originalLength and modifiedLength cannot both be <= 0");
    this.originalStart = originalStart;
    this.originalLength = originalLength;
    this.modifiedStart = modifiedStart;
    this.modifiedLength = modifiedLength;
  }
  /**
   * The end point (exclusive) of the change in the original sequence.
   */


  DiffChange.prototype.getOriginalEnd = function () {
    return this.originalStart + this.originalLength;
  };
  /**
   * The end point (exclusive) of the change in the modified sequence.
   */


  DiffChange.prototype.getModifiedEnd = function () {
    return this.modifiedStart + this.modifiedLength;
  };

  return DiffChange;
}();

exports.DiffChange = DiffChange;
},{}],"node_modules/monaco-editor/esm/vs/base/common/diff/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringDiff = stringDiff;
exports.LcsDiff = exports.MyArray = exports.Debug = void 0;

var _diffChange = require("./diffChange.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function createStringSequence(a) {
  return {
    getLength: function () {
      return a.length;
    },
    getElementAtIndex: function (pos) {
      return a.charCodeAt(pos);
    }
  };
}

function stringDiff(original, modified, pretty) {
  return new LcsDiff(createStringSequence(original), createStringSequence(modified)).ComputeDiff(pretty);
} //
// The code below has been ported from a C# implementation in VS
//


var Debug =
/** @class */
function () {
  function Debug() {}

  Debug.Assert = function (condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  };

  return Debug;
}();

exports.Debug = Debug;

var MyArray =
/** @class */
function () {
  function MyArray() {}
  /**
   * Copies a range of elements from an Array starting at the specified source index and pastes
   * them to another Array starting at the specified destination index. The length and the indexes
   * are specified as 64-bit integers.
   * sourceArray:
   *		The Array that contains the data to copy.
   * sourceIndex:
   *		A 64-bit integer that represents the index in the sourceArray at which copying begins.
   * destinationArray:
   *		The Array that receives the data.
   * destinationIndex:
   *		A 64-bit integer that represents the index in the destinationArray at which storing begins.
   * length:
   *		A 64-bit integer that represents the number of elements to copy.
   */


  MyArray.Copy = function (sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
    for (var i = 0; i < length; i++) {
      destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
    }
  };

  return MyArray;
}();

exports.MyArray = MyArray;
//*****************************************************************************
// LcsDiff.cs
//
// An implementation of the difference algorithm described in
// "An O(ND) Difference Algorithm and its variations" by Eugene W. Myers
//
// Copyright (C) 2008 Microsoft Corporation @minifier_do_not_preserve
//*****************************************************************************
// Our total memory usage for storing history is (worst-case):
// 2 * [(MaxDifferencesHistory + 1) * (MaxDifferencesHistory + 1) - 1] * sizeof(int)
// 2 * [1448*1448 - 1] * 4 = 16773624 = 16MB
var MaxDifferencesHistory = 1447; //let MaxDifferencesHistory = 100;

/**
 * A utility class which helps to create the set of DiffChanges from
 * a difference operation. This class accepts original DiffElements and
 * modified DiffElements that are involved in a particular change. The
 * MarktNextChange() method can be called to mark the separation between
 * distinct changes. At the end, the Changes property can be called to retrieve
 * the constructed changes.
 */

var DiffChangeHelper =
/** @class */
function () {
  /**
   * Constructs a new DiffChangeHelper for the given DiffSequences.
   */
  function DiffChangeHelper() {
    this.m_changes = [];
    this.m_originalStart = Number.MAX_VALUE;
    this.m_modifiedStart = Number.MAX_VALUE;
    this.m_originalCount = 0;
    this.m_modifiedCount = 0;
  }
  /**
   * Marks the beginning of the next change in the set of differences.
   */


  DiffChangeHelper.prototype.MarkNextChange = function () {
    // Only add to the list if there is something to add
    if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
      // Add the new change to our list
      this.m_changes.push(new _diffChange.DiffChange(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount));
    } // Reset for the next change


    this.m_originalCount = 0;
    this.m_modifiedCount = 0;
    this.m_originalStart = Number.MAX_VALUE;
    this.m_modifiedStart = Number.MAX_VALUE;
  };
  /**
   * Adds the original element at the given position to the elements
   * affected by the current change. The modified index gives context
   * to the change position with respect to the original sequence.
   * @param originalIndex The index of the original element to add.
   * @param modifiedIndex The index of the modified element that provides corresponding position in the modified sequence.
   */


  DiffChangeHelper.prototype.AddOriginalElement = function (originalIndex, modifiedIndex) {
    // The 'true' start index is the smallest of the ones we've seen
    this.m_originalStart = Math.min(this.m_originalStart, originalIndex);
    this.m_modifiedStart = Math.min(this.m_modifiedStart, modifiedIndex);
    this.m_originalCount++;
  };
  /**
   * Adds the modified element at the given position to the elements
   * affected by the current change. The original index gives context
   * to the change position with respect to the modified sequence.
   * @param originalIndex The index of the original element that provides corresponding position in the original sequence.
   * @param modifiedIndex The index of the modified element to add.
   */


  DiffChangeHelper.prototype.AddModifiedElement = function (originalIndex, modifiedIndex) {
    // The 'true' start index is the smallest of the ones we've seen
    this.m_originalStart = Math.min(this.m_originalStart, originalIndex);
    this.m_modifiedStart = Math.min(this.m_modifiedStart, modifiedIndex);
    this.m_modifiedCount++;
  };
  /**
   * Retrieves all of the changes marked by the class.
   */


  DiffChangeHelper.prototype.getChanges = function () {
    if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
      // Finish up on whatever is left
      this.MarkNextChange();
    }

    return this.m_changes;
  };
  /**
   * Retrieves all of the changes marked by the class in the reverse order
   */


  DiffChangeHelper.prototype.getReverseChanges = function () {
    if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
      // Finish up on whatever is left
      this.MarkNextChange();
    }

    this.m_changes.reverse();
    return this.m_changes;
  };

  return DiffChangeHelper;
}();
/**
 * An implementation of the difference algorithm described in
 * "An O(ND) Difference Algorithm and its variations" by Eugene W. Myers
 */


var LcsDiff =
/** @class */
function () {
  /**
   * Constructs the DiffFinder
   */
  function LcsDiff(originalSequence, newSequence, continueProcessingPredicate) {
    if (continueProcessingPredicate === void 0) {
      continueProcessingPredicate = null;
    }

    this.OriginalSequence = originalSequence;
    this.ModifiedSequence = newSequence;
    this.ContinueProcessingPredicate = continueProcessingPredicate;
    this.m_forwardHistory = [];
    this.m_reverseHistory = [];
  }

  LcsDiff.prototype.ElementsAreEqual = function (originalIndex, newIndex) {
    return this.OriginalSequence.getElementAtIndex(originalIndex) === this.ModifiedSequence.getElementAtIndex(newIndex);
  };

  LcsDiff.prototype.OriginalElementsAreEqual = function (index1, index2) {
    return this.OriginalSequence.getElementAtIndex(index1) === this.OriginalSequence.getElementAtIndex(index2);
  };

  LcsDiff.prototype.ModifiedElementsAreEqual = function (index1, index2) {
    return this.ModifiedSequence.getElementAtIndex(index1) === this.ModifiedSequence.getElementAtIndex(index2);
  };

  LcsDiff.prototype.ComputeDiff = function (pretty) {
    return this._ComputeDiff(0, this.OriginalSequence.getLength() - 1, 0, this.ModifiedSequence.getLength() - 1, pretty);
  };
  /**
   * Computes the differences between the original and modified input
   * sequences on the bounded range.
   * @returns An array of the differences between the two input sequences.
   */


  LcsDiff.prototype._ComputeDiff = function (originalStart, originalEnd, modifiedStart, modifiedEnd, pretty) {
    var quitEarlyArr = [false];
    var changes = this.ComputeDiffRecursive(originalStart, originalEnd, modifiedStart, modifiedEnd, quitEarlyArr);

    if (pretty) {
      // We have to clean up the computed diff to be more intuitive
      // but it turns out this cannot be done correctly until the entire set
      // of diffs have been computed
      return this.PrettifyChanges(changes);
    }

    return changes;
  };
  /**
   * Private helper method which computes the differences on the bounded range
   * recursively.
   * @returns An array of the differences between the two input sequences.
   */


  LcsDiff.prototype.ComputeDiffRecursive = function (originalStart, originalEnd, modifiedStart, modifiedEnd, quitEarlyArr) {
    quitEarlyArr[0] = false; // Find the start of the differences

    while (originalStart <= originalEnd && modifiedStart <= modifiedEnd && this.ElementsAreEqual(originalStart, modifiedStart)) {
      originalStart++;
      modifiedStart++;
    } // Find the end of the differences


    while (originalEnd >= originalStart && modifiedEnd >= modifiedStart && this.ElementsAreEqual(originalEnd, modifiedEnd)) {
      originalEnd--;
      modifiedEnd--;
    } // In the special case where we either have all insertions or all deletions or the sequences are identical


    if (originalStart > originalEnd || modifiedStart > modifiedEnd) {
      var changes = void 0;

      if (modifiedStart <= modifiedEnd) {
        Debug.Assert(originalStart === originalEnd + 1, 'originalStart should only be one more than originalEnd'); // All insertions

        changes = [new _diffChange.DiffChange(originalStart, 0, modifiedStart, modifiedEnd - modifiedStart + 1)];
      } else if (originalStart <= originalEnd) {
        Debug.Assert(modifiedStart === modifiedEnd + 1, 'modifiedStart should only be one more than modifiedEnd'); // All deletions

        changes = [new _diffChange.DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, 0)];
      } else {
        Debug.Assert(originalStart === originalEnd + 1, 'originalStart should only be one more than originalEnd');
        Debug.Assert(modifiedStart === modifiedEnd + 1, 'modifiedStart should only be one more than modifiedEnd'); // Identical sequences - No differences

        changes = [];
      }

      return changes;
    } // This problem can be solved using the Divide-And-Conquer technique.


    var midOriginalArr = [0],
        midModifiedArr = [0];
    var result = this.ComputeRecursionPoint(originalStart, originalEnd, modifiedStart, modifiedEnd, midOriginalArr, midModifiedArr, quitEarlyArr);
    var midOriginal = midOriginalArr[0];
    var midModified = midModifiedArr[0];

    if (result !== null) {
      // Result is not-null when there was enough memory to compute the changes while
      // searching for the recursion point
      return result;
    } else if (!quitEarlyArr[0]) {
      // We can break the problem down recursively by finding the changes in the
      // First Half:   (originalStart, modifiedStart) to (midOriginal, midModified)
      // Second Half:  (midOriginal + 1, minModified + 1) to (originalEnd, modifiedEnd)
      // NOTE: ComputeDiff() is inclusive, therefore the second range starts on the next point
      var leftChanges = this.ComputeDiffRecursive(originalStart, midOriginal, modifiedStart, midModified, quitEarlyArr);
      var rightChanges = [];

      if (!quitEarlyArr[0]) {
        rightChanges = this.ComputeDiffRecursive(midOriginal + 1, originalEnd, midModified + 1, modifiedEnd, quitEarlyArr);
      } else {
        // We did't have time to finish the first half, so we don't have time to compute this half.
        // Consider the entire rest of the sequence different.
        rightChanges = [new _diffChange.DiffChange(midOriginal + 1, originalEnd - (midOriginal + 1) + 1, midModified + 1, modifiedEnd - (midModified + 1) + 1)];
      }

      return this.ConcatenateChanges(leftChanges, rightChanges);
    } // If we hit here, we quit early, and so can't return anything meaningful


    return [new _diffChange.DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, modifiedEnd - modifiedStart + 1)];
  };

  LcsDiff.prototype.WALKTRACE = function (diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr) {
    var forwardChanges = null,
        reverseChanges = null; // First, walk backward through the forward diagonals history

    var changeHelper = new DiffChangeHelper();
    var diagonalMin = diagonalForwardStart;
    var diagonalMax = diagonalForwardEnd;
    var diagonalRelative = midOriginalArr[0] - midModifiedArr[0] - diagonalForwardOffset;
    var lastOriginalIndex = Number.MIN_VALUE;
    var historyIndex = this.m_forwardHistory.length - 1;
    var diagonal;

    do {
      // Get the diagonal index from the relative diagonal number
      diagonal = diagonalRelative + diagonalForwardBase; // Figure out where we came from

      if (diagonal === diagonalMin || diagonal < diagonalMax && forwardPoints[diagonal - 1] < forwardPoints[diagonal + 1]) {
        // Vertical line (the element is an insert)
        originalIndex = forwardPoints[diagonal + 1];
        modifiedIndex = originalIndex - diagonalRelative - diagonalForwardOffset;

        if (originalIndex < lastOriginalIndex) {
          changeHelper.MarkNextChange();
        }

        lastOriginalIndex = originalIndex;
        changeHelper.AddModifiedElement(originalIndex + 1, modifiedIndex);
        diagonalRelative = diagonal + 1 - diagonalForwardBase; //Setup for the next iteration
      } else {
        // Horizontal line (the element is a deletion)
        originalIndex = forwardPoints[diagonal - 1] + 1;
        modifiedIndex = originalIndex - diagonalRelative - diagonalForwardOffset;

        if (originalIndex < lastOriginalIndex) {
          changeHelper.MarkNextChange();
        }

        lastOriginalIndex = originalIndex - 1;
        changeHelper.AddOriginalElement(originalIndex, modifiedIndex + 1);
        diagonalRelative = diagonal - 1 - diagonalForwardBase; //Setup for the next iteration
      }

      if (historyIndex >= 0) {
        forwardPoints = this.m_forwardHistory[historyIndex];
        diagonalForwardBase = forwardPoints[0]; //We stored this in the first spot

        diagonalMin = 1;
        diagonalMax = forwardPoints.length - 1;
      }
    } while (--historyIndex >= -1); // Ironically, we get the forward changes as the reverse of the
    // order we added them since we technically added them backwards


    forwardChanges = changeHelper.getReverseChanges();

    if (quitEarlyArr[0]) {
      // TODO: Calculate a partial from the reverse diagonals.
      //       For now, just assume everything after the midOriginal/midModified point is a diff
      var originalStartPoint = midOriginalArr[0] + 1;
      var modifiedStartPoint = midModifiedArr[0] + 1;

      if (forwardChanges !== null && forwardChanges.length > 0) {
        var lastForwardChange = forwardChanges[forwardChanges.length - 1];
        originalStartPoint = Math.max(originalStartPoint, lastForwardChange.getOriginalEnd());
        modifiedStartPoint = Math.max(modifiedStartPoint, lastForwardChange.getModifiedEnd());
      }

      reverseChanges = [new _diffChange.DiffChange(originalStartPoint, originalEnd - originalStartPoint + 1, modifiedStartPoint, modifiedEnd - modifiedStartPoint + 1)];
    } else {
      // Now walk backward through the reverse diagonals history
      changeHelper = new DiffChangeHelper();
      diagonalMin = diagonalReverseStart;
      diagonalMax = diagonalReverseEnd;
      diagonalRelative = midOriginalArr[0] - midModifiedArr[0] - diagonalReverseOffset;
      lastOriginalIndex = Number.MAX_VALUE;
      historyIndex = deltaIsEven ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;

      do {
        // Get the diagonal index from the relative diagonal number
        diagonal = diagonalRelative + diagonalReverseBase; // Figure out where we came from

        if (diagonal === diagonalMin || diagonal < diagonalMax && reversePoints[diagonal - 1] >= reversePoints[diagonal + 1]) {
          // Horizontal line (the element is a deletion))
          originalIndex = reversePoints[diagonal + 1] - 1;
          modifiedIndex = originalIndex - diagonalRelative - diagonalReverseOffset;

          if (originalIndex > lastOriginalIndex) {
            changeHelper.MarkNextChange();
          }

          lastOriginalIndex = originalIndex + 1;
          changeHelper.AddOriginalElement(originalIndex + 1, modifiedIndex + 1);
          diagonalRelative = diagonal + 1 - diagonalReverseBase; //Setup for the next iteration
        } else {
          // Vertical line (the element is an insertion)
          originalIndex = reversePoints[diagonal - 1];
          modifiedIndex = originalIndex - diagonalRelative - diagonalReverseOffset;

          if (originalIndex > lastOriginalIndex) {
            changeHelper.MarkNextChange();
          }

          lastOriginalIndex = originalIndex;
          changeHelper.AddModifiedElement(originalIndex + 1, modifiedIndex + 1);
          diagonalRelative = diagonal - 1 - diagonalReverseBase; //Setup for the next iteration
        }

        if (historyIndex >= 0) {
          reversePoints = this.m_reverseHistory[historyIndex];
          diagonalReverseBase = reversePoints[0]; //We stored this in the first spot

          diagonalMin = 1;
          diagonalMax = reversePoints.length - 1;
        }
      } while (--historyIndex >= -1); // There are cases where the reverse history will find diffs that
      // are correct, but not intuitive, so we need shift them.


      reverseChanges = changeHelper.getChanges();
    }

    return this.ConcatenateChanges(forwardChanges, reverseChanges);
  };
  /**
   * Given the range to compute the diff on, this method finds the point:
   * (midOriginal, midModified)
   * that exists in the middle of the LCS of the two sequences and
   * is the point at which the LCS problem may be broken down recursively.
   * This method will try to keep the LCS trace in memory. If the LCS recursion
   * point is calculated and the full trace is available in memory, then this method
   * will return the change list.
   * @param originalStart The start bound of the original sequence range
   * @param originalEnd The end bound of the original sequence range
   * @param modifiedStart The start bound of the modified sequence range
   * @param modifiedEnd The end bound of the modified sequence range
   * @param midOriginal The middle point of the original sequence range
   * @param midModified The middle point of the modified sequence range
   * @returns The diff changes, if available, otherwise null
   */


  LcsDiff.prototype.ComputeRecursionPoint = function (originalStart, originalEnd, modifiedStart, modifiedEnd, midOriginalArr, midModifiedArr, quitEarlyArr) {
    var originalIndex = 0,
        modifiedIndex = 0;
    var diagonalForwardStart = 0,
        diagonalForwardEnd = 0;
    var diagonalReverseStart = 0,
        diagonalReverseEnd = 0;
    var numDifferences; // To traverse the edit graph and produce the proper LCS, our actual
    // start position is just outside the given boundary

    originalStart--;
    modifiedStart--; // We set these up to make the compiler happy, but they will
    // be replaced before we return with the actual recursion point

    midOriginalArr[0] = 0;
    midModifiedArr[0] = 0; // Clear out the history

    this.m_forwardHistory = [];
    this.m_reverseHistory = []; // Each cell in the two arrays corresponds to a diagonal in the edit graph.
    // The integer value in the cell represents the originalIndex of the furthest
    // reaching point found so far that ends in that diagonal.
    // The modifiedIndex can be computed mathematically from the originalIndex and the diagonal number.

    var maxDifferences = originalEnd - originalStart + (modifiedEnd - modifiedStart);
    var numDiagonals = maxDifferences + 1;
    var forwardPoints = new Array(numDiagonals);
    var reversePoints = new Array(numDiagonals); // diagonalForwardBase: Index into forwardPoints of the diagonal which passes through (originalStart, modifiedStart)
    // diagonalReverseBase: Index into reversePoints of the diagonal which passes through (originalEnd, modifiedEnd)

    var diagonalForwardBase = modifiedEnd - modifiedStart;
    var diagonalReverseBase = originalEnd - originalStart; // diagonalForwardOffset: Geometric offset which allows modifiedIndex to be computed from originalIndex and the
    //    diagonal number (relative to diagonalForwardBase)
    // diagonalReverseOffset: Geometric offset which allows modifiedIndex to be computed from originalIndex and the
    //    diagonal number (relative to diagonalReverseBase)

    var diagonalForwardOffset = originalStart - modifiedStart;
    var diagonalReverseOffset = originalEnd - modifiedEnd; // delta: The difference between the end diagonal and the start diagonal. This is used to relate diagonal numbers
    //   relative to the start diagonal with diagonal numbers relative to the end diagonal.
    // The Even/Oddn-ness of this delta is important for determining when we should check for overlap

    var delta = diagonalReverseBase - diagonalForwardBase;
    var deltaIsEven = delta % 2 === 0; // Here we set up the start and end points as the furthest points found so far
    // in both the forward and reverse directions, respectively

    forwardPoints[diagonalForwardBase] = originalStart;
    reversePoints[diagonalReverseBase] = originalEnd; // Remember if we quit early, and thus need to do a best-effort result instead of a real result.

    quitEarlyArr[0] = false; // A couple of points:
    // --With this method, we iterate on the number of differences between the two sequences.
    //   The more differences there actually are, the longer this will take.
    // --Also, as the number of differences increases, we have to search on diagonals further
    //   away from the reference diagonal (which is diagonalForwardBase for forward, diagonalReverseBase for reverse).
    // --We extend on even diagonals (relative to the reference diagonal) only when numDifferences
    //   is even and odd diagonals only when numDifferences is odd.

    var diagonal, tempOriginalIndex;

    for (numDifferences = 1; numDifferences <= maxDifferences / 2 + 1; numDifferences++) {
      var furthestOriginalIndex = 0;
      var furthestModifiedIndex = 0; // Run the algorithm in the forward direction

      diagonalForwardStart = this.ClipDiagonalBound(diagonalForwardBase - numDifferences, numDifferences, diagonalForwardBase, numDiagonals);
      diagonalForwardEnd = this.ClipDiagonalBound(diagonalForwardBase + numDifferences, numDifferences, diagonalForwardBase, numDiagonals);

      for (diagonal = diagonalForwardStart; diagonal <= diagonalForwardEnd; diagonal += 2) {
        // STEP 1: We extend the furthest reaching point in the present diagonal
        // by looking at the diagonals above and below and picking the one whose point
        // is further away from the start point (originalStart, modifiedStart)
        if (diagonal === diagonalForwardStart || diagonal < diagonalForwardEnd && forwardPoints[diagonal - 1] < forwardPoints[diagonal + 1]) {
          originalIndex = forwardPoints[diagonal + 1];
        } else {
          originalIndex = forwardPoints[diagonal - 1] + 1;
        }

        modifiedIndex = originalIndex - (diagonal - diagonalForwardBase) - diagonalForwardOffset; // Save the current originalIndex so we can test for false overlap in step 3

        tempOriginalIndex = originalIndex; // STEP 2: We can continue to extend the furthest reaching point in the present diagonal
        // so long as the elements are equal.

        while (originalIndex < originalEnd && modifiedIndex < modifiedEnd && this.ElementsAreEqual(originalIndex + 1, modifiedIndex + 1)) {
          originalIndex++;
          modifiedIndex++;
        }

        forwardPoints[diagonal] = originalIndex;

        if (originalIndex + modifiedIndex > furthestOriginalIndex + furthestModifiedIndex) {
          furthestOriginalIndex = originalIndex;
          furthestModifiedIndex = modifiedIndex;
        } // STEP 3: If delta is odd (overlap first happens on forward when delta is odd)
        // and diagonal is in the range of reverse diagonals computed for numDifferences-1
        // (the previous iteration; we haven't computed reverse diagonals for numDifferences yet)
        // then check for overlap.


        if (!deltaIsEven && Math.abs(diagonal - diagonalReverseBase) <= numDifferences - 1) {
          if (originalIndex >= reversePoints[diagonal]) {
            midOriginalArr[0] = originalIndex;
            midModifiedArr[0] = modifiedIndex;

            if (tempOriginalIndex <= reversePoints[diagonal] && MaxDifferencesHistory > 0 && numDifferences <= MaxDifferencesHistory + 1) {
              // BINGO! We overlapped, and we have the full trace in memory!
              return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
            } else {
              // Either false overlap, or we didn't have enough memory for the full trace
              // Just return the recursion point
              return null;
            }
          }
        }
      } // Check to see if we should be quitting early, before moving on to the next iteration.


      var matchLengthOfLongest = (furthestOriginalIndex - originalStart + (furthestModifiedIndex - modifiedStart) - numDifferences) / 2;

      if (this.ContinueProcessingPredicate !== null && !this.ContinueProcessingPredicate(furthestOriginalIndex, this.OriginalSequence, matchLengthOfLongest)) {
        // We can't finish, so skip ahead to generating a result from what we have.
        quitEarlyArr[0] = true; // Use the furthest distance we got in the forward direction.

        midOriginalArr[0] = furthestOriginalIndex;
        midModifiedArr[0] = furthestModifiedIndex;

        if (matchLengthOfLongest > 0 && MaxDifferencesHistory > 0 && numDifferences <= MaxDifferencesHistory + 1) {
          // Enough of the history is in memory to walk it backwards
          return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
        } else {
          // We didn't actually remember enough of the history.
          //Since we are quiting the diff early, we need to shift back the originalStart and modified start
          //back into the boundary limits since we decremented their value above beyond the boundary limit.
          originalStart++;
          modifiedStart++;
          return [new _diffChange.DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, modifiedEnd - modifiedStart + 1)];
        }
      } // Run the algorithm in the reverse direction


      diagonalReverseStart = this.ClipDiagonalBound(diagonalReverseBase - numDifferences, numDifferences, diagonalReverseBase, numDiagonals);
      diagonalReverseEnd = this.ClipDiagonalBound(diagonalReverseBase + numDifferences, numDifferences, diagonalReverseBase, numDiagonals);

      for (diagonal = diagonalReverseStart; diagonal <= diagonalReverseEnd; diagonal += 2) {
        // STEP 1: We extend the furthest reaching point in the present diagonal
        // by looking at the diagonals above and below and picking the one whose point
        // is further away from the start point (originalEnd, modifiedEnd)
        if (diagonal === diagonalReverseStart || diagonal < diagonalReverseEnd && reversePoints[diagonal - 1] >= reversePoints[diagonal + 1]) {
          originalIndex = reversePoints[diagonal + 1] - 1;
        } else {
          originalIndex = reversePoints[diagonal - 1];
        }

        modifiedIndex = originalIndex - (diagonal - diagonalReverseBase) - diagonalReverseOffset; // Save the current originalIndex so we can test for false overlap

        tempOriginalIndex = originalIndex; // STEP 2: We can continue to extend the furthest reaching point in the present diagonal
        // as long as the elements are equal.

        while (originalIndex > originalStart && modifiedIndex > modifiedStart && this.ElementsAreEqual(originalIndex, modifiedIndex)) {
          originalIndex--;
          modifiedIndex--;
        }

        reversePoints[diagonal] = originalIndex; // STEP 4: If delta is even (overlap first happens on reverse when delta is even)
        // and diagonal is in the range of forward diagonals computed for numDifferences
        // then check for overlap.

        if (deltaIsEven && Math.abs(diagonal - diagonalForwardBase) <= numDifferences) {
          if (originalIndex <= forwardPoints[diagonal]) {
            midOriginalArr[0] = originalIndex;
            midModifiedArr[0] = modifiedIndex;

            if (tempOriginalIndex >= forwardPoints[diagonal] && MaxDifferencesHistory > 0 && numDifferences <= MaxDifferencesHistory + 1) {
              // BINGO! We overlapped, and we have the full trace in memory!
              return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
            } else {
              // Either false overlap, or we didn't have enough memory for the full trace
              // Just return the recursion point
              return null;
            }
          }
        }
      } // Save current vectors to history before the next iteration


      if (numDifferences <= MaxDifferencesHistory) {
        // We are allocating space for one extra int, which we fill with
        // the index of the diagonal base index
        var temp = new Array(diagonalForwardEnd - diagonalForwardStart + 2);
        temp[0] = diagonalForwardBase - diagonalForwardStart + 1;
        MyArray.Copy(forwardPoints, diagonalForwardStart, temp, 1, diagonalForwardEnd - diagonalForwardStart + 1);
        this.m_forwardHistory.push(temp);
        temp = new Array(diagonalReverseEnd - diagonalReverseStart + 2);
        temp[0] = diagonalReverseBase - diagonalReverseStart + 1;
        MyArray.Copy(reversePoints, diagonalReverseStart, temp, 1, diagonalReverseEnd - diagonalReverseStart + 1);
        this.m_reverseHistory.push(temp);
      }
    } // If we got here, then we have the full trace in history. We just have to convert it to a change list
    // NOTE: This part is a bit messy


    return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
  };
  /**
   * Shifts the given changes to provide a more intuitive diff.
   * While the first element in a diff matches the first element after the diff,
   * we shift the diff down.
   *
   * @param changes The list of changes to shift
   * @returns The shifted changes
   */


  LcsDiff.prototype.PrettifyChanges = function (changes) {
    // Shift all the changes down first
    for (var i = 0; i < changes.length; i++) {
      var change = changes[i];
      var originalStop = i < changes.length - 1 ? changes[i + 1].originalStart : this.OriginalSequence.getLength();
      var modifiedStop = i < changes.length - 1 ? changes[i + 1].modifiedStart : this.ModifiedSequence.getLength();
      var checkOriginal = change.originalLength > 0;
      var checkModified = change.modifiedLength > 0;

      while (change.originalStart + change.originalLength < originalStop && change.modifiedStart + change.modifiedLength < modifiedStop && (!checkOriginal || this.OriginalElementsAreEqual(change.originalStart, change.originalStart + change.originalLength)) && (!checkModified || this.ModifiedElementsAreEqual(change.modifiedStart, change.modifiedStart + change.modifiedLength))) {
        change.originalStart++;
        change.modifiedStart++;
      }

      var mergedChangeArr = [null];

      if (i < changes.length - 1 && this.ChangesOverlap(changes[i], changes[i + 1], mergedChangeArr)) {
        changes[i] = mergedChangeArr[0];
        changes.splice(i + 1, 1);
        i--;
        continue;
      }
    } // Shift changes back up until we hit empty or whitespace-only lines


    for (var i = changes.length - 1; i >= 0; i--) {
      var change = changes[i];
      var originalStop = 0;
      var modifiedStop = 0;

      if (i > 0) {
        var prevChange = changes[i - 1];

        if (prevChange.originalLength > 0) {
          originalStop = prevChange.originalStart + prevChange.originalLength;
        }

        if (prevChange.modifiedLength > 0) {
          modifiedStop = prevChange.modifiedStart + prevChange.modifiedLength;
        }
      }

      var checkOriginal = change.originalLength > 0;
      var checkModified = change.modifiedLength > 0;
      var bestDelta = 0;

      var bestScore = this._boundaryScore(change.originalStart, change.originalLength, change.modifiedStart, change.modifiedLength);

      for (var delta = 1;; delta++) {
        var originalStart = change.originalStart - delta;
        var modifiedStart = change.modifiedStart - delta;

        if (originalStart < originalStop || modifiedStart < modifiedStop) {
          break;
        }

        if (checkOriginal && !this.OriginalElementsAreEqual(originalStart, originalStart + change.originalLength)) {
          break;
        }

        if (checkModified && !this.ModifiedElementsAreEqual(modifiedStart, modifiedStart + change.modifiedLength)) {
          break;
        }

        var score = this._boundaryScore(originalStart, change.originalLength, modifiedStart, change.modifiedLength);

        if (score > bestScore) {
          bestScore = score;
          bestDelta = delta;
        }
      }

      change.originalStart -= bestDelta;
      change.modifiedStart -= bestDelta;
    }

    return changes;
  };

  LcsDiff.prototype._OriginalIsBoundary = function (index) {
    if (index <= 0 || index >= this.OriginalSequence.getLength() - 1) {
      return true;
    }

    var element = this.OriginalSequence.getElementAtIndex(index);
    return typeof element === 'string' && /^\s*$/.test(element);
  };

  LcsDiff.prototype._OriginalRegionIsBoundary = function (originalStart, originalLength) {
    if (this._OriginalIsBoundary(originalStart) || this._OriginalIsBoundary(originalStart - 1)) {
      return true;
    }

    if (originalLength > 0) {
      var originalEnd = originalStart + originalLength;

      if (this._OriginalIsBoundary(originalEnd - 1) || this._OriginalIsBoundary(originalEnd)) {
        return true;
      }
    }

    return false;
  };

  LcsDiff.prototype._ModifiedIsBoundary = function (index) {
    if (index <= 0 || index >= this.ModifiedSequence.getLength() - 1) {
      return true;
    }

    var element = this.ModifiedSequence.getElementAtIndex(index);
    return typeof element === 'string' && /^\s*$/.test(element);
  };

  LcsDiff.prototype._ModifiedRegionIsBoundary = function (modifiedStart, modifiedLength) {
    if (this._ModifiedIsBoundary(modifiedStart) || this._ModifiedIsBoundary(modifiedStart - 1)) {
      return true;
    }

    if (modifiedLength > 0) {
      var modifiedEnd = modifiedStart + modifiedLength;

      if (this._ModifiedIsBoundary(modifiedEnd - 1) || this._ModifiedIsBoundary(modifiedEnd)) {
        return true;
      }
    }

    return false;
  };

  LcsDiff.prototype._boundaryScore = function (originalStart, originalLength, modifiedStart, modifiedLength) {
    var originalScore = this._OriginalRegionIsBoundary(originalStart, originalLength) ? 1 : 0;
    var modifiedScore = this._ModifiedRegionIsBoundary(modifiedStart, modifiedLength) ? 1 : 0;
    return originalScore + modifiedScore;
  };
  /**
   * Concatenates the two input DiffChange lists and returns the resulting
   * list.
   * @param The left changes
   * @param The right changes
   * @returns The concatenated list
   */


  LcsDiff.prototype.ConcatenateChanges = function (left, right) {
    var mergedChangeArr = [];

    if (left.length === 0 || right.length === 0) {
      return right.length > 0 ? right : left;
    } else if (this.ChangesOverlap(left[left.length - 1], right[0], mergedChangeArr)) {
      // Since we break the problem down recursively, it is possible that we
      // might recurse in the middle of a change thereby splitting it into
      // two changes. Here in the combining stage, we detect and fuse those
      // changes back together
      var result = new Array(left.length + right.length - 1);
      MyArray.Copy(left, 0, result, 0, left.length - 1);
      result[left.length - 1] = mergedChangeArr[0];
      MyArray.Copy(right, 1, result, left.length, right.length - 1);
      return result;
    } else {
      var result = new Array(left.length + right.length);
      MyArray.Copy(left, 0, result, 0, left.length);
      MyArray.Copy(right, 0, result, left.length, right.length);
      return result;
    }
  };
  /**
   * Returns true if the two changes overlap and can be merged into a single
   * change
   * @param left The left change
   * @param right The right change
   * @param mergedChange The merged change if the two overlap, null otherwise
   * @returns True if the two changes overlap
   */


  LcsDiff.prototype.ChangesOverlap = function (left, right, mergedChangeArr) {
    Debug.Assert(left.originalStart <= right.originalStart, 'Left change is not less than or equal to right change');
    Debug.Assert(left.modifiedStart <= right.modifiedStart, 'Left change is not less than or equal to right change');

    if (left.originalStart + left.originalLength >= right.originalStart || left.modifiedStart + left.modifiedLength >= right.modifiedStart) {
      var originalStart = left.originalStart;
      var originalLength = left.originalLength;
      var modifiedStart = left.modifiedStart;
      var modifiedLength = left.modifiedLength;

      if (left.originalStart + left.originalLength >= right.originalStart) {
        originalLength = right.originalStart + right.originalLength - left.originalStart;
      }

      if (left.modifiedStart + left.modifiedLength >= right.modifiedStart) {
        modifiedLength = right.modifiedStart + right.modifiedLength - left.modifiedStart;
      }

      mergedChangeArr[0] = new _diffChange.DiffChange(originalStart, originalLength, modifiedStart, modifiedLength);
      return true;
    } else {
      mergedChangeArr[0] = null;
      return false;
    }
  };
  /**
   * Helper method used to clip a diagonal index to the range of valid
   * diagonals. This also decides whether or not the diagonal index,
   * if it exceeds the boundary, should be clipped to the boundary or clipped
   * one inside the boundary depending on the Even/Odd status of the boundary
   * and numDifferences.
   * @param diagonal The index of the diagonal to clip.
   * @param numDifferences The current number of differences being iterated upon.
   * @param diagonalBaseIndex The base reference diagonal.
   * @param numDiagonals The total number of diagonals.
   * @returns The clipped diagonal index.
   */


  LcsDiff.prototype.ClipDiagonalBound = function (diagonal, numDifferences, diagonalBaseIndex, numDiagonals) {
    if (diagonal >= 0 && diagonal < numDiagonals) {
      // Nothing to clip, its in range
      return diagonal;
    } // diagonalsBelow: The number of diagonals below the reference diagonal
    // diagonalsAbove: The number of diagonals above the reference diagonal


    var diagonalsBelow = diagonalBaseIndex;
    var diagonalsAbove = numDiagonals - diagonalBaseIndex - 1;
    var diffEven = numDifferences % 2 === 0;

    if (diagonal < 0) {
      var lowerBoundEven = diagonalsBelow % 2 === 0;
      return diffEven === lowerBoundEven ? 0 : 1;
    } else {
      var upperBoundEven = diagonalsAbove % 2 === 0;
      return diffEven === upperBoundEven ? numDiagonals - 1 : numDiagonals - 2;
    }
  };

  return LcsDiff;
}();

exports.LcsDiff = LcsDiff;
},{"./diffChange.js":"node_modules/monaco-editor/esm/vs/base/common/diff/diffChange.js"}],"node_modules/monaco-editor/esm/vs/base/common/uri.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.URI = void 0;

var _platform = require("./platform.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var _a;

var _schemePattern = /^\w[\w\d+.-]*$/;
var _singleSlashStart = /^\//;
var _doubleSlashStart = /^\/\//;
var _throwOnMissingSchema = true;

function _validateUri(ret) {
  // scheme, must be set
  if (!ret.scheme) {
    if (_throwOnMissingSchema) {
      throw new Error("[UriError]: Scheme is missing: {scheme: \"\", authority: \"" + ret.authority + "\", path: \"" + ret.path + "\", query: \"" + ret.query + "\", fragment: \"" + ret.fragment + "\"}");
    } else {
      console.warn("[UriError]: Scheme is missing: {scheme: \"\", authority: \"" + ret.authority + "\", path: \"" + ret.path + "\", query: \"" + ret.query + "\", fragment: \"" + ret.fragment + "\"}");
    }
  } // scheme, https://tools.ietf.org/html/rfc3986#section-3.1
  // ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )


  if (ret.scheme && !_schemePattern.test(ret.scheme)) {
    throw new Error('[UriError]: Scheme contains illegal characters.');
  } // path, http://tools.ietf.org/html/rfc3986#section-3.3
  // If a URI contains an authority component, then the path component
  // must either be empty or begin with a slash ("/") character.  If a URI
  // does not contain an authority component, then the path cannot begin
  // with two slash characters ("//").


  if (ret.path) {
    if (ret.authority) {
      if (!_singleSlashStart.test(ret.path)) {
        throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
      }
    } else {
      if (_doubleSlashStart.test(ret.path)) {
        throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
      }
    }
  }
} // implements a bit of https://tools.ietf.org/html/rfc3986#section-5


function _referenceResolution(scheme, path) {
  // the slash-character is our 'default base' as we don't
  // support constructing URIs relative to other URIs. This
  // also means that we alter and potentially break paths.
  // see https://tools.ietf.org/html/rfc3986#section-5.1.4
  switch (scheme) {
    case 'https':
    case 'http':
    case 'file':
      if (!path) {
        path = _slash;
      } else if (path[0] !== _slash) {
        path = _slash + path;
      }

      break;
  }

  return path;
}

var _empty = '';
var _slash = '/';
var _regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
/**
 * Uniform Resource Identifier (URI) http://tools.ietf.org/html/rfc3986.
 * This class is a simple parser which creates the basic component parts
 * (http://tools.ietf.org/html/rfc3986#section-3) with minimal validation
 * and encoding.
 *
 *       foo://example.com:8042/over/there?name=ferret#nose
 *       \_/   \______________/\_________/ \_________/ \__/
 *        |           |            |            |        |
 *     scheme     authority       path        query   fragment
 *        |   _____________________|__
 *       / \ /                        \
 *       urn:example:animal:ferret:nose
 */

var URI =
/** @class */
function () {
  /**
   * @internal
   */
  function URI(schemeOrData, authority, path, query, fragment) {
    if (typeof schemeOrData === 'object') {
      this.scheme = schemeOrData.scheme || _empty;
      this.authority = schemeOrData.authority || _empty;
      this.path = schemeOrData.path || _empty;
      this.query = schemeOrData.query || _empty;
      this.fragment = schemeOrData.fragment || _empty; // no validation because it's this URI
      // that creates uri components.
      // _validateUri(this);
    } else {
      this.scheme = schemeOrData || _empty;
      this.authority = authority || _empty;
      this.path = _referenceResolution(this.scheme, path || _empty);
      this.query = query || _empty;
      this.fragment = fragment || _empty;

      _validateUri(this);
    }
  }

  URI.isUri = function (thing) {
    if (thing instanceof URI) {
      return true;
    }

    if (!thing) {
      return false;
    }

    return typeof thing.authority === 'string' && typeof thing.fragment === 'string' && typeof thing.path === 'string' && typeof thing.query === 'string' && typeof thing.scheme === 'string';
  };

  Object.defineProperty(URI.prototype, "fsPath", {
    // ---- filesystem path -----------------------

    /**
     * Returns a string representing the corresponding file system path of this URI.
     * Will handle UNC paths, normalizes windows drive letters to lower-case, and uses the
     * platform specific path separator.
     *
     * * Will *not* validate the path for invalid characters and semantics.
     * * Will *not* look at the scheme of this URI.
     * * The result shall *not* be used for display purposes but for accessing a file on disk.
     *
     *
     * The *difference* to `URI#path` is the use of the platform specific separator and the handling
     * of UNC paths. See the below sample of a file-uri with an authority (UNC path).
     *
     * ```ts
        const u = URI.parse('file://server/c$/folder/file.txt')
        u.authority === 'server'
        u.path === '/shares/c$/file.txt'
        u.fsPath === '\\server\c$\folder\file.txt'
    ```
     *
     * Using `URI#path` to read a file (using fs-apis) would not be enough because parts of the path,
     * namely the server name, would be missing. Therefore `URI#fsPath` exists - it's sugar to ease working
     * with URIs that represent files on disk (`file` scheme).
     */
    get: function () {
      // if (this.scheme !== 'file') {
      // 	console.warn(`[UriError] calling fsPath with scheme ${this.scheme}`);
      // }
      return _makeFsPath(this);
    },
    enumerable: true,
    configurable: true
  }); // ---- modify to new -------------------------

  URI.prototype.with = function (change) {
    if (!change) {
      return this;
    }

    var scheme = change.scheme,
        authority = change.authority,
        path = change.path,
        query = change.query,
        fragment = change.fragment;

    if (scheme === void 0) {
      scheme = this.scheme;
    } else if (scheme === null) {
      scheme = _empty;
    }

    if (authority === void 0) {
      authority = this.authority;
    } else if (authority === null) {
      authority = _empty;
    }

    if (path === void 0) {
      path = this.path;
    } else if (path === null) {
      path = _empty;
    }

    if (query === void 0) {
      query = this.query;
    } else if (query === null) {
      query = _empty;
    }

    if (fragment === void 0) {
      fragment = this.fragment;
    } else if (fragment === null) {
      fragment = _empty;
    }

    if (scheme === this.scheme && authority === this.authority && path === this.path && query === this.query && fragment === this.fragment) {
      return this;
    }

    return new _URI(scheme, authority, path, query, fragment);
  }; // ---- parse & validate ------------------------

  /**
   * Creates a new URI from a string, e.g. `http://www.msft.com/some/path`,
   * `file:///usr/home`, or `scheme:with/path`.
   *
   * @param value A string which represents an URI (see `URI#toString`).
   */


  URI.parse = function (value) {
    var match = _regexp.exec(value);

    if (!match) {
      return new _URI(_empty, _empty, _empty, _empty, _empty);
    }

    return new _URI(match[2] || _empty, decodeURIComponent(match[4] || _empty), decodeURIComponent(match[5] || _empty), decodeURIComponent(match[7] || _empty), decodeURIComponent(match[9] || _empty));
  };
  /**
   * Creates a new URI from a file system path, e.g. `c:\my\files`,
   * `/usr/home`, or `\\server\share\some\path`.
   *
   * The *difference* between `URI#parse` and `URI#file` is that the latter treats the argument
   * as path, not as stringified-uri. E.g. `URI.file(path)` is **not the same as**
   * `URI.parse('file://' + path)` because the path might contain characters that are
   * interpreted (# and ?). See the following sample:
   * ```ts
  const good = URI.file('/coding/c#/project1');
  good.scheme === 'file';
  good.path === '/coding/c#/project1';
  good.fragment === '';
  const bad = URI.parse('file://' + '/coding/c#/project1');
  bad.scheme === 'file';
  bad.path === '/coding/c'; // path is now broken
  bad.fragment === '/project1';
  ```
   *
   * @param path A file system path (see `URI#fsPath`)
   */


  URI.file = function (path) {
    var authority = _empty; // normalize to fwd-slashes on windows,
    // on other systems bwd-slashes are valid
    // filename character, eg /f\oo/ba\r.txt

    if (_platform.isWindows) {
      path = path.replace(/\\/g, _slash);
    } // check for authority as used in UNC shares
    // or use the path as given


    if (path[0] === _slash && path[1] === _slash) {
      var idx = path.indexOf(_slash, 2);

      if (idx === -1) {
        authority = path.substring(2);
        path = _slash;
      } else {
        authority = path.substring(2, idx);
        path = path.substring(idx) || _slash;
      }
    }

    return new _URI('file', authority, path, _empty, _empty);
  };

  URI.from = function (components) {
    return new _URI(components.scheme, components.authority, components.path, components.query, components.fragment);
  }; // ---- printing/externalize ---------------------------

  /**
   * Creates a string presentation for this URI. It's guaranteed that calling
   * `URI.parse` with the result of this function creates an URI which is equal
   * to this URI.
   *
   * * The result shall *not* be used for display purposes but for externalization or transport.
   * * The result will be encoded using the percentage encoding and encoding happens mostly
   * ignore the scheme-specific encoding rules.
   *
   * @param skipEncoding Do not encode the result, default is `false`
   */


  URI.prototype.toString = function (skipEncoding) {
    if (skipEncoding === void 0) {
      skipEncoding = false;
    }

    return _asFormatted(this, skipEncoding);
  };

  URI.prototype.toJSON = function () {
    return this;
  };

  URI.revive = function (data) {
    if (!data) {
      return data;
    } else if (data instanceof URI) {
      return data;
    } else {
      var result = new _URI(data);
      result._fsPath = data.fsPath;
      result._formatted = data.external;
      return result;
    }
  };

  return URI;
}();

exports.URI = URI;

// tslint:disable-next-line:class-name
var _URI =
/** @class */
function (_super) {
  __extends(_URI, _super);

  function _URI() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this._formatted = null;
    _this._fsPath = null;
    return _this;
  }

  Object.defineProperty(_URI.prototype, "fsPath", {
    get: function () {
      if (!this._fsPath) {
        this._fsPath = _makeFsPath(this);
      }

      return this._fsPath;
    },
    enumerable: true,
    configurable: true
  });

  _URI.prototype.toString = function (skipEncoding) {
    if (skipEncoding === void 0) {
      skipEncoding = false;
    }

    if (!skipEncoding) {
      if (!this._formatted) {
        this._formatted = _asFormatted(this, false);
      }

      return this._formatted;
    } else {
      // we don't cache that
      return _asFormatted(this, true);
    }
  };

  _URI.prototype.toJSON = function () {
    var res = {
      $mid: 1
    }; // cached state

    if (this._fsPath) {
      res.fsPath = this._fsPath;
    }

    if (this._formatted) {
      res.external = this._formatted;
    } // uri components


    if (this.path) {
      res.path = this.path;
    }

    if (this.scheme) {
      res.scheme = this.scheme;
    }

    if (this.authority) {
      res.authority = this.authority;
    }

    if (this.query) {
      res.query = this.query;
    }

    if (this.fragment) {
      res.fragment = this.fragment;
    }

    return res;
  };

  return _URI;
}(URI); // reserved characters: https://tools.ietf.org/html/rfc3986#section-2.2


var encodeTable = (_a = {}, _a[58
/* Colon */
] = '%3A', _a[47
/* Slash */
] = '%2F', _a[63
/* QuestionMark */
] = '%3F', _a[35
/* Hash */
] = '%23', _a[91
/* OpenSquareBracket */
] = '%5B', _a[93
/* CloseSquareBracket */
] = '%5D', _a[64
/* AtSign */
] = '%40', _a[33
/* ExclamationMark */
] = '%21', _a[36
/* DollarSign */
] = '%24', _a[38
/* Ampersand */
] = '%26', _a[39
/* SingleQuote */
] = '%27', _a[40
/* OpenParen */
] = '%28', _a[41
/* CloseParen */
] = '%29', _a[42
/* Asterisk */
] = '%2A', _a[43
/* Plus */
] = '%2B', _a[44
/* Comma */
] = '%2C', _a[59
/* Semicolon */
] = '%3B', _a[61
/* Equals */
] = '%3D', _a[32
/* Space */
] = '%20', _a);

function encodeURIComponentFast(uriComponent, allowSlash) {
  var res = undefined;
  var nativeEncodePos = -1;

  for (var pos = 0; pos < uriComponent.length; pos++) {
    var code = uriComponent.charCodeAt(pos); // unreserved characters: https://tools.ietf.org/html/rfc3986#section-2.3

    if (code >= 97
    /* a */
    && code <= 122
    /* z */
    || code >= 65
    /* A */
    && code <= 90
    /* Z */
    || code >= 48
    /* Digit0 */
    && code <= 57
    /* Digit9 */
    || code === 45
    /* Dash */
    || code === 46
    /* Period */
    || code === 95
    /* Underline */
    || code === 126
    /* Tilde */
    || allowSlash && code === 47
    /* Slash */
    ) {
      // check if we are delaying native encode
      if (nativeEncodePos !== -1) {
        res += encodeURIComponent(uriComponent.substring(nativeEncodePos, pos));
        nativeEncodePos = -1;
      } // check if we write into a new string (by default we try to return the param)


      if (res !== undefined) {
        res += uriComponent.charAt(pos);
      }
    } else {
      // encoding needed, we need to allocate a new string
      if (res === undefined) {
        res = uriComponent.substr(0, pos);
      } // check with default table first


      var escaped = encodeTable[code];

      if (escaped !== undefined) {
        // check if we are delaying native encode
        if (nativeEncodePos !== -1) {
          res += encodeURIComponent(uriComponent.substring(nativeEncodePos, pos));
          nativeEncodePos = -1;
        } // append escaped variant to result


        res += escaped;
      } else if (nativeEncodePos === -1) {
        // use native encode only when needed
        nativeEncodePos = pos;
      }
    }
  }

  if (nativeEncodePos !== -1) {
    res += encodeURIComponent(uriComponent.substring(nativeEncodePos));
  }

  return res !== undefined ? res : uriComponent;
}

function encodeURIComponentMinimal(path) {
  var res = undefined;

  for (var pos = 0; pos < path.length; pos++) {
    var code = path.charCodeAt(pos);

    if (code === 35
    /* Hash */
    || code === 63
    /* QuestionMark */
    ) {
        if (res === undefined) {
          res = path.substr(0, pos);
        }

        res += encodeTable[code];
      } else {
      if (res !== undefined) {
        res += path[pos];
      }
    }
  }

  return res !== undefined ? res : path;
}
/**
 * Compute `fsPath` for the given uri
 * @param uri
 */


function _makeFsPath(uri) {
  var value;

  if (uri.authority && uri.path.length > 1 && uri.scheme === 'file') {
    // unc path: file://shares/c$/far/boo
    value = "//" + uri.authority + uri.path;
  } else if (uri.path.charCodeAt(0) === 47
  /* Slash */
  && (uri.path.charCodeAt(1) >= 65
  /* A */
  && uri.path.charCodeAt(1) <= 90
  /* Z */
  || uri.path.charCodeAt(1) >= 97
  /* a */
  && uri.path.charCodeAt(1) <= 122
  /* z */
  ) && uri.path.charCodeAt(2) === 58
  /* Colon */
  ) {
      // windows drive letter: file:///c:/far/boo
      value = uri.path[1].toLowerCase() + uri.path.substr(2);
    } else {
    // other path
    value = uri.path;
  }

  if (_platform.isWindows) {
    value = value.replace(/\//g, '\\');
  }

  return value;
}
/**
 * Create the external version of a uri
 */


function _asFormatted(uri, skipEncoding) {
  var encoder = !skipEncoding ? encodeURIComponentFast : encodeURIComponentMinimal;
  var res = '';
  var scheme = uri.scheme,
      authority = uri.authority,
      path = uri.path,
      query = uri.query,
      fragment = uri.fragment;

  if (scheme) {
    res += scheme;
    res += ':';
  }

  if (authority || scheme === 'file') {
    res += _slash;
    res += _slash;
  }

  if (authority) {
    var idx = authority.indexOf('@');

    if (idx !== -1) {
      // <user>@<auth>
      var userinfo = authority.substr(0, idx);
      authority = authority.substr(idx + 1);
      idx = userinfo.indexOf(':');

      if (idx === -1) {
        res += encoder(userinfo, false);
      } else {
        // <user>:<pass>@<auth>
        res += encoder(userinfo.substr(0, idx), false);
        res += ':';
        res += encoder(userinfo.substr(idx + 1), false);
      }

      res += '@';
    }

    authority = authority.toLowerCase();
    idx = authority.indexOf(':');

    if (idx === -1) {
      res += encoder(authority, false);
    } else {
      // <auth>:<port>
      res += encoder(authority.substr(0, idx), false);
      res += authority.substr(idx);
    }
  }

  if (path) {
    // lower-case windows drive letters in /C:/fff or C:/fff
    if (path.length >= 3 && path.charCodeAt(0) === 47
    /* Slash */
    && path.charCodeAt(2) === 58
    /* Colon */
    ) {
        var code = path.charCodeAt(1);

        if (code >= 65
        /* A */
        && code <= 90
        /* Z */
        ) {
            path = "/" + String.fromCharCode(code + 32) + ":" + path.substr(3); // "/c:".length === 3
          }
      } else if (path.length >= 2 && path.charCodeAt(1) === 58
    /* Colon */
    ) {
        var code = path.charCodeAt(0);

        if (code >= 65
        /* A */
        && code <= 90
        /* Z */
        ) {
            path = String.fromCharCode(code + 32) + ":" + path.substr(2); // "/c:".length === 3
          }
      } // encode the rest of the path


    res += encoder(path, true);
  }

  if (query) {
    res += '?';
    res += encoder(query, false);
  }

  if (fragment) {
    res += '#';
    res += !skipEncoding ? encodeURIComponentFast(fragment, false) : fragment;
  }

  return res;
}
},{"./platform.js":"node_modules/monaco-editor/esm/vs/base/common/platform.js"}],"node_modules/monaco-editor/esm/vs/editor/common/core/position.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Position = void 0;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * A position in the editor.
 */
var Position =
/** @class */
function () {
  function Position(lineNumber, column) {
    this.lineNumber = lineNumber;
    this.column = column;
  }
  /**
   * Create a new postion from this position.
   *
   * @param newLineNumber new line number
   * @param newColumn new column
   */


  Position.prototype.with = function (newLineNumber, newColumn) {
    if (newLineNumber === void 0) {
      newLineNumber = this.lineNumber;
    }

    if (newColumn === void 0) {
      newColumn = this.column;
    }

    if (newLineNumber === this.lineNumber && newColumn === this.column) {
      return this;
    } else {
      return new Position(newLineNumber, newColumn);
    }
  };
  /**
   * Derive a new position from this position.
   *
   * @param deltaLineNumber line number delta
   * @param deltaColumn column delta
   */


  Position.prototype.delta = function (deltaLineNumber, deltaColumn) {
    if (deltaLineNumber === void 0) {
      deltaLineNumber = 0;
    }

    if (deltaColumn === void 0) {
      deltaColumn = 0;
    }

    return this.with(this.lineNumber + deltaLineNumber, this.column + deltaColumn);
  };
  /**
   * Test if this position equals other position
   */


  Position.prototype.equals = function (other) {
    return Position.equals(this, other);
  };
  /**
   * Test if position `a` equals position `b`
   */


  Position.equals = function (a, b) {
    if (!a && !b) {
      return true;
    }

    return !!a && !!b && a.lineNumber === b.lineNumber && a.column === b.column;
  };
  /**
   * Test if this position is before other position.
   * If the two positions are equal, the result will be false.
   */


  Position.prototype.isBefore = function (other) {
    return Position.isBefore(this, other);
  };
  /**
   * Test if position `a` is before position `b`.
   * If the two positions are equal, the result will be false.
   */


  Position.isBefore = function (a, b) {
    if (a.lineNumber < b.lineNumber) {
      return true;
    }

    if (b.lineNumber < a.lineNumber) {
      return false;
    }

    return a.column < b.column;
  };
  /**
   * Test if this position is before other position.
   * If the two positions are equal, the result will be true.
   */


  Position.prototype.isBeforeOrEqual = function (other) {
    return Position.isBeforeOrEqual(this, other);
  };
  /**
   * Test if position `a` is before position `b`.
   * If the two positions are equal, the result will be true.
   */


  Position.isBeforeOrEqual = function (a, b) {
    if (a.lineNumber < b.lineNumber) {
      return true;
    }

    if (b.lineNumber < a.lineNumber) {
      return false;
    }

    return a.column <= b.column;
  };
  /**
   * A function that compares positions, useful for sorting
   */


  Position.compare = function (a, b) {
    var aLineNumber = a.lineNumber | 0;
    var bLineNumber = b.lineNumber | 0;

    if (aLineNumber === bLineNumber) {
      var aColumn = a.column | 0;
      var bColumn = b.column | 0;
      return aColumn - bColumn;
    }

    return aLineNumber - bLineNumber;
  };
  /**
   * Clone this position.
   */


  Position.prototype.clone = function () {
    return new Position(this.lineNumber, this.column);
  };
  /**
   * Convert to a human-readable representation.
   */


  Position.prototype.toString = function () {
    return '(' + this.lineNumber + ',' + this.column + ')';
  }; // ---

  /**
   * Create a `Position` from an `IPosition`.
   */


  Position.lift = function (pos) {
    return new Position(pos.lineNumber, pos.column);
  };
  /**
   * Test if `obj` is an `IPosition`.
   */


  Position.isIPosition = function (obj) {
    return obj && typeof obj.lineNumber === 'number' && typeof obj.column === 'number';
  };

  return Position;
}();

exports.Position = Position;
},{}],"node_modules/monaco-editor/esm/vs/editor/common/core/range.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Range = void 0;

var _position = require("./position.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * A range in the editor. (startLineNumber,startColumn) is <= (endLineNumber,endColumn)
 */
var Range =
/** @class */
function () {
  function Range(startLineNumber, startColumn, endLineNumber, endColumn) {
    if (startLineNumber > endLineNumber || startLineNumber === endLineNumber && startColumn > endColumn) {
      this.startLineNumber = endLineNumber;
      this.startColumn = endColumn;
      this.endLineNumber = startLineNumber;
      this.endColumn = startColumn;
    } else {
      this.startLineNumber = startLineNumber;
      this.startColumn = startColumn;
      this.endLineNumber = endLineNumber;
      this.endColumn = endColumn;
    }
  }
  /**
   * Test if this range is empty.
   */


  Range.prototype.isEmpty = function () {
    return Range.isEmpty(this);
  };
  /**
   * Test if `range` is empty.
   */


  Range.isEmpty = function (range) {
    return range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn;
  };
  /**
   * Test if position is in this range. If the position is at the edges, will return true.
   */


  Range.prototype.containsPosition = function (position) {
    return Range.containsPosition(this, position);
  };
  /**
   * Test if `position` is in `range`. If the position is at the edges, will return true.
   */


  Range.containsPosition = function (range, position) {
    if (position.lineNumber < range.startLineNumber || position.lineNumber > range.endLineNumber) {
      return false;
    }

    if (position.lineNumber === range.startLineNumber && position.column < range.startColumn) {
      return false;
    }

    if (position.lineNumber === range.endLineNumber && position.column > range.endColumn) {
      return false;
    }

    return true;
  };
  /**
   * Test if range is in this range. If the range is equal to this range, will return true.
   */


  Range.prototype.containsRange = function (range) {
    return Range.containsRange(this, range);
  };
  /**
   * Test if `otherRange` is in `range`. If the ranges are equal, will return true.
   */


  Range.containsRange = function (range, otherRange) {
    if (otherRange.startLineNumber < range.startLineNumber || otherRange.endLineNumber < range.startLineNumber) {
      return false;
    }

    if (otherRange.startLineNumber > range.endLineNumber || otherRange.endLineNumber > range.endLineNumber) {
      return false;
    }

    if (otherRange.startLineNumber === range.startLineNumber && otherRange.startColumn < range.startColumn) {
      return false;
    }

    if (otherRange.endLineNumber === range.endLineNumber && otherRange.endColumn > range.endColumn) {
      return false;
    }

    return true;
  };
  /**
   * A reunion of the two ranges.
   * The smallest position will be used as the start point, and the largest one as the end point.
   */


  Range.prototype.plusRange = function (range) {
    return Range.plusRange(this, range);
  };
  /**
   * A reunion of the two ranges.
   * The smallest position will be used as the start point, and the largest one as the end point.
   */


  Range.plusRange = function (a, b) {
    var startLineNumber;
    var startColumn;
    var endLineNumber;
    var endColumn;

    if (b.startLineNumber < a.startLineNumber) {
      startLineNumber = b.startLineNumber;
      startColumn = b.startColumn;
    } else if (b.startLineNumber === a.startLineNumber) {
      startLineNumber = b.startLineNumber;
      startColumn = Math.min(b.startColumn, a.startColumn);
    } else {
      startLineNumber = a.startLineNumber;
      startColumn = a.startColumn;
    }

    if (b.endLineNumber > a.endLineNumber) {
      endLineNumber = b.endLineNumber;
      endColumn = b.endColumn;
    } else if (b.endLineNumber === a.endLineNumber) {
      endLineNumber = b.endLineNumber;
      endColumn = Math.max(b.endColumn, a.endColumn);
    } else {
      endLineNumber = a.endLineNumber;
      endColumn = a.endColumn;
    }

    return new Range(startLineNumber, startColumn, endLineNumber, endColumn);
  };
  /**
   * A intersection of the two ranges.
   */


  Range.prototype.intersectRanges = function (range) {
    return Range.intersectRanges(this, range);
  };
  /**
   * A intersection of the two ranges.
   */


  Range.intersectRanges = function (a, b) {
    var resultStartLineNumber = a.startLineNumber;
    var resultStartColumn = a.startColumn;
    var resultEndLineNumber = a.endLineNumber;
    var resultEndColumn = a.endColumn;
    var otherStartLineNumber = b.startLineNumber;
    var otherStartColumn = b.startColumn;
    var otherEndLineNumber = b.endLineNumber;
    var otherEndColumn = b.endColumn;

    if (resultStartLineNumber < otherStartLineNumber) {
      resultStartLineNumber = otherStartLineNumber;
      resultStartColumn = otherStartColumn;
    } else if (resultStartLineNumber === otherStartLineNumber) {
      resultStartColumn = Math.max(resultStartColumn, otherStartColumn);
    }

    if (resultEndLineNumber > otherEndLineNumber) {
      resultEndLineNumber = otherEndLineNumber;
      resultEndColumn = otherEndColumn;
    } else if (resultEndLineNumber === otherEndLineNumber) {
      resultEndColumn = Math.min(resultEndColumn, otherEndColumn);
    } // Check if selection is now empty


    if (resultStartLineNumber > resultEndLineNumber) {
      return null;
    }

    if (resultStartLineNumber === resultEndLineNumber && resultStartColumn > resultEndColumn) {
      return null;
    }

    return new Range(resultStartLineNumber, resultStartColumn, resultEndLineNumber, resultEndColumn);
  };
  /**
   * Test if this range equals other.
   */


  Range.prototype.equalsRange = function (other) {
    return Range.equalsRange(this, other);
  };
  /**
   * Test if range `a` equals `b`.
   */


  Range.equalsRange = function (a, b) {
    return !!a && !!b && a.startLineNumber === b.startLineNumber && a.startColumn === b.startColumn && a.endLineNumber === b.endLineNumber && a.endColumn === b.endColumn;
  };
  /**
   * Return the end position (which will be after or equal to the start position)
   */


  Range.prototype.getEndPosition = function () {
    return new _position.Position(this.endLineNumber, this.endColumn);
  };
  /**
   * Return the start position (which will be before or equal to the end position)
   */


  Range.prototype.getStartPosition = function () {
    return new _position.Position(this.startLineNumber, this.startColumn);
  };
  /**
   * Transform to a user presentable string representation.
   */


  Range.prototype.toString = function () {
    return '[' + this.startLineNumber + ',' + this.startColumn + ' -> ' + this.endLineNumber + ',' + this.endColumn + ']';
  };
  /**
   * Create a new range using this range's start position, and using endLineNumber and endColumn as the end position.
   */


  Range.prototype.setEndPosition = function (endLineNumber, endColumn) {
    return new Range(this.startLineNumber, this.startColumn, endLineNumber, endColumn);
  };
  /**
   * Create a new range using this range's end position, and using startLineNumber and startColumn as the start position.
   */


  Range.prototype.setStartPosition = function (startLineNumber, startColumn) {
    return new Range(startLineNumber, startColumn, this.endLineNumber, this.endColumn);
  };
  /**
   * Create a new empty range using this range's start position.
   */


  Range.prototype.collapseToStart = function () {
    return Range.collapseToStart(this);
  };
  /**
   * Create a new empty range using this range's start position.
   */


  Range.collapseToStart = function (range) {
    return new Range(range.startLineNumber, range.startColumn, range.startLineNumber, range.startColumn);
  }; // ---


  Range.fromPositions = function (start, end) {
    if (end === void 0) {
      end = start;
    }

    return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
  };

  Range.lift = function (range) {
    if (!range) {
      return null;
    }

    return new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
  };
  /**
   * Test if `obj` is an `IRange`.
   */


  Range.isIRange = function (obj) {
    return obj && typeof obj.startLineNumber === 'number' && typeof obj.startColumn === 'number' && typeof obj.endLineNumber === 'number' && typeof obj.endColumn === 'number';
  };
  /**
   * Test if the two ranges are touching in any way.
   */


  Range.areIntersectingOrTouching = function (a, b) {
    // Check if `a` is before `b`
    if (a.endLineNumber < b.startLineNumber || a.endLineNumber === b.startLineNumber && a.endColumn < b.startColumn) {
      return false;
    } // Check if `b` is before `a`


    if (b.endLineNumber < a.startLineNumber || b.endLineNumber === a.startLineNumber && b.endColumn < a.startColumn) {
      return false;
    } // These ranges must intersect


    return true;
  };
  /**
   * Test if the two ranges are intersecting. If the ranges are touching it returns true.
   */


  Range.areIntersecting = function (a, b) {
    // Check if `a` is before `b`
    if (a.endLineNumber < b.startLineNumber || a.endLineNumber === b.startLineNumber && a.endColumn <= b.startColumn) {
      return false;
    } // Check if `b` is before `a`


    if (b.endLineNumber < a.startLineNumber || b.endLineNumber === a.startLineNumber && b.endColumn <= a.startColumn) {
      return false;
    } // These ranges must intersect


    return true;
  };
  /**
   * A function that compares ranges, useful for sorting ranges
   * It will first compare ranges on the startPosition and then on the endPosition
   */


  Range.compareRangesUsingStarts = function (a, b) {
    if (a && b) {
      var aStartLineNumber = a.startLineNumber | 0;
      var bStartLineNumber = b.startLineNumber | 0;

      if (aStartLineNumber === bStartLineNumber) {
        var aStartColumn = a.startColumn | 0;
        var bStartColumn = b.startColumn | 0;

        if (aStartColumn === bStartColumn) {
          var aEndLineNumber = a.endLineNumber | 0;
          var bEndLineNumber = b.endLineNumber | 0;

          if (aEndLineNumber === bEndLineNumber) {
            var aEndColumn = a.endColumn | 0;
            var bEndColumn = b.endColumn | 0;
            return aEndColumn - bEndColumn;
          }

          return aEndLineNumber - bEndLineNumber;
        }

        return aStartColumn - bStartColumn;
      }

      return aStartLineNumber - bStartLineNumber;
    }

    var aExists = a ? 1 : 0;
    var bExists = b ? 1 : 0;
    return aExists - bExists;
  };
  /**
   * A function that compares ranges, useful for sorting ranges
   * It will first compare ranges on the endPosition and then on the startPosition
   */


  Range.compareRangesUsingEnds = function (a, b) {
    if (a.endLineNumber === b.endLineNumber) {
      if (a.endColumn === b.endColumn) {
        if (a.startLineNumber === b.startLineNumber) {
          return a.startColumn - b.startColumn;
        }

        return a.startLineNumber - b.startLineNumber;
      }

      return a.endColumn - b.endColumn;
    }

    return a.endLineNumber - b.endLineNumber;
  };
  /**
   * Test if the range spans multiple lines.
   */


  Range.spansMultipleLines = function (range) {
    return range.endLineNumber > range.startLineNumber;
  };

  return Range;
}();

exports.Range = Range;
},{"./position.js":"node_modules/monaco-editor/esm/vs/editor/common/core/position.js"}],"node_modules/monaco-editor/esm/vs/base/common/strings.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFalsyOrWhitespace = isFalsyOrWhitespace;
exports.pad = pad;
exports.format = format;
exports.escape = escape;
exports.escapeRegExpCharacters = escapeRegExpCharacters;
exports.trim = trim;
exports.ltrim = ltrim;
exports.rtrim = rtrim;
exports.convertSimple2RegExpPattern = convertSimple2RegExpPattern;
exports.startsWith = startsWith;
exports.endsWith = endsWith;
exports.createRegExp = createRegExp;
exports.regExpLeadsToEndlessLoop = regExpLeadsToEndlessLoop;
exports.firstNonWhitespaceIndex = firstNonWhitespaceIndex;
exports.getLeadingWhitespace = getLeadingWhitespace;
exports.lastNonWhitespaceIndex = lastNonWhitespaceIndex;
exports.compare = compare;
exports.isLowerAsciiLetter = isLowerAsciiLetter;
exports.isUpperAsciiLetter = isUpperAsciiLetter;
exports.equalsIgnoreCase = equalsIgnoreCase;
exports.startsWithIgnoreCase = startsWithIgnoreCase;
exports.commonPrefixLength = commonPrefixLength;
exports.commonSuffixLength = commonSuffixLength;
exports.isHighSurrogate = isHighSurrogate;
exports.isLowSurrogate = isLowSurrogate;
exports.containsRTL = containsRTL;
exports.containsEmoji = containsEmoji;
exports.isBasicASCII = isBasicASCII;
exports.containsFullWidthCharacter = containsFullWidthCharacter;
exports.isFullWidthCharacter = isFullWidthCharacter;
exports.startsWithUTF8BOM = startsWithUTF8BOM;
exports.safeBtoa = safeBtoa;
exports.repeat = repeat;
exports.UTF8_BOM_CHARACTER = exports.empty = void 0;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * The empty string.
 */
var empty = '';
exports.empty = empty;

function isFalsyOrWhitespace(str) {
  if (!str || typeof str !== 'string') {
    return true;
  }

  return str.trim().length === 0;
}
/**
 * @returns the provided number with the given number of preceding zeros.
 */


function pad(n, l, char) {
  if (char === void 0) {
    char = '0';
  }

  var str = '' + n;
  var r = [str];

  for (var i = str.length; i < l; i++) {
    r.push(char);
  }

  return r.reverse().join('');
}

var _formatRegexp = /{(\d+)}/g;
/**
 * Helper to produce a string with a variable number of arguments. Insert variable segments
 * into the string using the {n} notation where N is the index of the argument following the string.
 * @param value string to which formatting is applied
 * @param args replacements for {n}-entries
 */

function format(value) {
  var args = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }

  if (args.length === 0) {
    return value;
  }

  return value.replace(_formatRegexp, function (match, group) {
    var idx = parseInt(group, 10);
    return isNaN(idx) || idx < 0 || idx >= args.length ? match : args[idx];
  });
}
/**
 * Converts HTML characters inside the string to use entities instead. Makes the string safe from
 * being used e.g. in HTMLElement.innerHTML.
 */


function escape(html) {
  return html.replace(/[<|>|&]/g, function (match) {
    switch (match) {
      case '<':
        return '&lt;';

      case '>':
        return '&gt;';

      case '&':
        return '&amp;';

      default:
        return match;
    }
  });
}
/**
 * Escapes regular expression characters in a given string
 */


function escapeRegExpCharacters(value) {
  return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\[\]\(\)\#]/g, '\\$&');
}
/**
 * Removes all occurrences of needle from the beginning and end of haystack.
 * @param haystack string to trim
 * @param needle the thing to trim (default is a blank)
 */


function trim(haystack, needle) {
  if (needle === void 0) {
    needle = ' ';
  }

  var trimmed = ltrim(haystack, needle);
  return rtrim(trimmed, needle);
}
/**
 * Removes all occurrences of needle from the beginning of haystack.
 * @param haystack string to trim
 * @param needle the thing to trim
 */


function ltrim(haystack, needle) {
  if (!haystack || !needle) {
    return haystack;
  }

  var needleLen = needle.length;

  if (needleLen === 0 || haystack.length === 0) {
    return haystack;
  }

  var offset = 0;

  while (haystack.indexOf(needle, offset) === offset) {
    offset = offset + needleLen;
  }

  return haystack.substring(offset);
}
/**
 * Removes all occurrences of needle from the end of haystack.
 * @param haystack string to trim
 * @param needle the thing to trim
 */


function rtrim(haystack, needle) {
  if (!haystack || !needle) {
    return haystack;
  }

  var needleLen = needle.length,
      haystackLen = haystack.length;

  if (needleLen === 0 || haystackLen === 0) {
    return haystack;
  }

  var offset = haystackLen,
      idx = -1;

  while (true) {
    idx = haystack.lastIndexOf(needle, offset - 1);

    if (idx === -1 || idx + needleLen !== offset) {
      break;
    }

    if (idx === 0) {
      return '';
    }

    offset = idx;
  }

  return haystack.substring(0, offset);
}

function convertSimple2RegExpPattern(pattern) {
  return pattern.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&').replace(/[\*]/g, '.*');
}
/**
 * Determines if haystack starts with needle.
 */


function startsWith(haystack, needle) {
  if (haystack.length < needle.length) {
    return false;
  }

  if (haystack === needle) {
    return true;
  }

  for (var i = 0; i < needle.length; i++) {
    if (haystack[i] !== needle[i]) {
      return false;
    }
  }

  return true;
}
/**
 * Determines if haystack ends with needle.
 */


function endsWith(haystack, needle) {
  var diff = haystack.length - needle.length;

  if (diff > 0) {
    return haystack.indexOf(needle, diff) === diff;
  } else if (diff === 0) {
    return haystack === needle;
  } else {
    return false;
  }
}

function createRegExp(searchString, isRegex, options) {
  if (options === void 0) {
    options = {};
  }

  if (!searchString) {
    throw new Error('Cannot create regex from empty string');
  }

  if (!isRegex) {
    searchString = escapeRegExpCharacters(searchString);
  }

  if (options.wholeWord) {
    if (!/\B/.test(searchString.charAt(0))) {
      searchString = '\\b' + searchString;
    }

    if (!/\B/.test(searchString.charAt(searchString.length - 1))) {
      searchString = searchString + '\\b';
    }
  }

  var modifiers = '';

  if (options.global) {
    modifiers += 'g';
  }

  if (!options.matchCase) {
    modifiers += 'i';
  }

  if (options.multiline) {
    modifiers += 'm';
  }

  return new RegExp(searchString, modifiers);
}

function regExpLeadsToEndlessLoop(regexp) {
  // Exit early if it's one of these special cases which are meant to match
  // against an empty string
  if (regexp.source === '^' || regexp.source === '^$' || regexp.source === '$' || regexp.source === '^\\s*$') {
    return false;
  } // We check against an empty string. If the regular expression doesn't advance
  // (e.g. ends in an endless loop) it will match an empty string.


  var match = regexp.exec('');
  return !!(match && regexp.lastIndex === 0);
}
/**
 * Returns first index of the string that is not whitespace.
 * If string is empty or contains only whitespaces, returns -1
 */


function firstNonWhitespaceIndex(str) {
  for (var i = 0, len = str.length; i < len; i++) {
    var chCode = str.charCodeAt(i);

    if (chCode !== 32
    /* Space */
    && chCode !== 9
    /* Tab */
    ) {
        return i;
      }
  }

  return -1;
}
/**
 * Returns the leading whitespace of the string.
 * If the string contains only whitespaces, returns entire string
 */


function getLeadingWhitespace(str, start, end) {
  if (start === void 0) {
    start = 0;
  }

  if (end === void 0) {
    end = str.length;
  }

  for (var i = start; i < end; i++) {
    var chCode = str.charCodeAt(i);

    if (chCode !== 32
    /* Space */
    && chCode !== 9
    /* Tab */
    ) {
        return str.substring(start, i);
      }
  }

  return str.substring(start, end);
}
/**
 * Returns last index of the string that is not whitespace.
 * If string is empty or contains only whitespaces, returns -1
 */


function lastNonWhitespaceIndex(str, startIndex) {
  if (startIndex === void 0) {
    startIndex = str.length - 1;
  }

  for (var i = startIndex; i >= 0; i--) {
    var chCode = str.charCodeAt(i);

    if (chCode !== 32
    /* Space */
    && chCode !== 9
    /* Tab */
    ) {
        return i;
      }
  }

  return -1;
}

function compare(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}

function isLowerAsciiLetter(code) {
  return code >= 97
  /* a */
  && code <= 122
  /* z */
  ;
}

function isUpperAsciiLetter(code) {
  return code >= 65
  /* A */
  && code <= 90
  /* Z */
  ;
}

function isAsciiLetter(code) {
  return isLowerAsciiLetter(code) || isUpperAsciiLetter(code);
}

function equalsIgnoreCase(a, b) {
  var len1 = a ? a.length : 0;
  var len2 = b ? b.length : 0;

  if (len1 !== len2) {
    return false;
  }

  return doEqualsIgnoreCase(a, b);
}

function doEqualsIgnoreCase(a, b, stopAt) {
  if (stopAt === void 0) {
    stopAt = a.length;
  }

  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  for (var i = 0; i < stopAt; i++) {
    var codeA = a.charCodeAt(i);
    var codeB = b.charCodeAt(i);

    if (codeA === codeB) {
      continue;
    } // a-z A-Z


    if (isAsciiLetter(codeA) && isAsciiLetter(codeB)) {
      var diff = Math.abs(codeA - codeB);

      if (diff !== 0 && diff !== 32) {
        return false;
      }
    } // Any other charcode
    else {
        if (String.fromCharCode(codeA).toLowerCase() !== String.fromCharCode(codeB).toLowerCase()) {
          return false;
        }
      }
  }

  return true;
}

function startsWithIgnoreCase(str, candidate) {
  var candidateLength = candidate.length;

  if (candidate.length > str.length) {
    return false;
  }

  return doEqualsIgnoreCase(str, candidate, candidateLength);
}
/**
 * @returns the length of the common prefix of the two strings.
 */


function commonPrefixLength(a, b) {
  var i,
      len = Math.min(a.length, b.length);

  for (i = 0; i < len; i++) {
    if (a.charCodeAt(i) !== b.charCodeAt(i)) {
      return i;
    }
  }

  return len;
}
/**
 * @returns the length of the common suffix of the two strings.
 */


function commonSuffixLength(a, b) {
  var i,
      len = Math.min(a.length, b.length);
  var aLastIndex = a.length - 1;
  var bLastIndex = b.length - 1;

  for (i = 0; i < len; i++) {
    if (a.charCodeAt(aLastIndex - i) !== b.charCodeAt(bLastIndex - i)) {
      return i;
    }
  }

  return len;
} // --- unicode
// http://en.wikipedia.org/wiki/Surrogate_pair
// Returns the code point starting at a specified index in a string
// Code points U+0000 to U+D7FF and U+E000 to U+FFFF are represented on a single character
// Code points U+10000 to U+10FFFF are represented on two consecutive characters
//export function getUnicodePoint(str:string, index:number, len:number):number {
//	let chrCode = str.charCodeAt(index);
//	if (0xD800 <= chrCode && chrCode <= 0xDBFF && index + 1 < len) {
//		let nextChrCode = str.charCodeAt(index + 1);
//		if (0xDC00 <= nextChrCode && nextChrCode <= 0xDFFF) {
//			return (chrCode - 0xD800) << 10 + (nextChrCode - 0xDC00) + 0x10000;
//		}
//	}
//	return chrCode;
//}


function isHighSurrogate(charCode) {
  return 0xD800 <= charCode && charCode <= 0xDBFF;
}

function isLowSurrogate(charCode) {
  return 0xDC00 <= charCode && charCode <= 0xDFFF;
}
/**
 * Generated using https://github.com/alexandrudima/unicode-utils/blob/master/generate-rtl-test.js
 */


var CONTAINS_RTL = /(?:[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05F4\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u0710\u0712-\u072F\u074D-\u07A5\u07B1-\u07EA\u07F4\u07F5\u07FA-\u0815\u081A\u0824\u0828\u0830-\u0858\u085E-\u08BD\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFD3D\uFD50-\uFDFC\uFE70-\uFEFC]|\uD802[\uDC00-\uDD1B\uDD20-\uDE00\uDE10-\uDE33\uDE40-\uDEE4\uDEEB-\uDF35\uDF40-\uDFFF]|\uD803[\uDC00-\uDCFF]|\uD83A[\uDC00-\uDCCF\uDD00-\uDD43\uDD50-\uDFFF]|\uD83B[\uDC00-\uDEBB])/;
/**
 * Returns true if `str` contains any Unicode character that is classified as "R" or "AL".
 */

function containsRTL(str) {
  return CONTAINS_RTL.test(str);
}
/**
 * Generated using https://github.com/alexandrudima/unicode-utils/blob/master/generate-emoji-test.js
 */


var CONTAINS_EMOJI = /(?:[\u231A\u231B\u23F0\u23F3\u2600-\u27BF\u2B50\u2B55]|\uD83C[\uDDE6-\uDDFF\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEF8]|\uD83E[\uDD00-\uDDE6])/;

function containsEmoji(str) {
  return CONTAINS_EMOJI.test(str);
}

var IS_BASIC_ASCII = /^[\t\n\r\x20-\x7E]*$/;
/**
 * Returns true if `str` contains only basic ASCII characters in the range 32 - 126 (including 32 and 126) or \n, \r, \t
 */

function isBasicASCII(str) {
  return IS_BASIC_ASCII.test(str);
}

function containsFullWidthCharacter(str) {
  for (var i = 0, len = str.length; i < len; i++) {
    if (isFullWidthCharacter(str.charCodeAt(i))) {
      return true;
    }
  }

  return false;
}

function isFullWidthCharacter(charCode) {
  // Do a cheap trick to better support wrapping of wide characters, treat them as 2 columns
  // http://jrgraphix.net/research/unicode_blocks.php
  //          2E80 — 2EFF   CJK Radicals Supplement
  //          2F00 — 2FDF   Kangxi Radicals
  //          2FF0 — 2FFF   Ideographic Description Characters
  //          3000 — 303F   CJK Symbols and Punctuation
  //          3040 — 309F   Hiragana
  //          30A0 — 30FF   Katakana
  //          3100 — 312F   Bopomofo
  //          3130 — 318F   Hangul Compatibility Jamo
  //          3190 — 319F   Kanbun
  //          31A0 — 31BF   Bopomofo Extended
  //          31F0 — 31FF   Katakana Phonetic Extensions
  //          3200 — 32FF   Enclosed CJK Letters and Months
  //          3300 — 33FF   CJK Compatibility
  //          3400 — 4DBF   CJK Unified Ideographs Extension A
  //          4DC0 — 4DFF   Yijing Hexagram Symbols
  //          4E00 — 9FFF   CJK Unified Ideographs
  //          A000 — A48F   Yi Syllables
  //          A490 — A4CF   Yi Radicals
  //          AC00 — D7AF   Hangul Syllables
  // [IGNORE] D800 — DB7F   High Surrogates
  // [IGNORE] DB80 — DBFF   High Private Use Surrogates
  // [IGNORE] DC00 — DFFF   Low Surrogates
  // [IGNORE] E000 — F8FF   Private Use Area
  //          F900 — FAFF   CJK Compatibility Ideographs
  // [IGNORE] FB00 — FB4F   Alphabetic Presentation Forms
  // [IGNORE] FB50 — FDFF   Arabic Presentation Forms-A
  // [IGNORE] FE00 — FE0F   Variation Selectors
  // [IGNORE] FE20 — FE2F   Combining Half Marks
  // [IGNORE] FE30 — FE4F   CJK Compatibility Forms
  // [IGNORE] FE50 — FE6F   Small Form Variants
  // [IGNORE] FE70 — FEFF   Arabic Presentation Forms-B
  //          FF00 — FFEF   Halfwidth and Fullwidth Forms
  //               [https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms]
  //               of which FF01 - FF5E fullwidth ASCII of 21 to 7E
  // [IGNORE]    and FF65 - FFDC halfwidth of Katakana and Hangul
  // [IGNORE] FFF0 — FFFF   Specials
  charCode = +charCode; // @perf

  return charCode >= 0x2E80 && charCode <= 0xD7AF || charCode >= 0xF900 && charCode <= 0xFAFF || charCode >= 0xFF01 && charCode <= 0xFF5E;
} // -- UTF-8 BOM


var UTF8_BOM_CHARACTER = String.fromCharCode(65279
/* UTF8_BOM */
);
exports.UTF8_BOM_CHARACTER = UTF8_BOM_CHARACTER;

function startsWithUTF8BOM(str) {
  return !!(str && str.length > 0 && str.charCodeAt(0) === 65279
  /* UTF8_BOM */
  );
}

function safeBtoa(str) {
  return btoa(encodeURIComponent(str)); // we use encodeURIComponent because btoa fails for non Latin 1 values
}

function repeat(s, count) {
  var result = '';

  for (var i = 0; i < count; i++) {
    result += s;
  }

  return result;
}
},{}],"node_modules/monaco-editor/esm/vs/editor/common/diff/diffComputer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiffComputer = void 0;

var _diff = require("../../../base/common/diff/diff.js");

var strings = _interopRequireWildcard(require("../../../base/common/strings.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var MAXIMUM_RUN_TIME = 5000; // 5 seconds

var MINIMUM_MATCHING_CHARACTER_LENGTH = 3;

function computeDiff(originalSequence, modifiedSequence, continueProcessingPredicate, pretty) {
  var diffAlgo = new _diff.LcsDiff(originalSequence, modifiedSequence, continueProcessingPredicate);
  return diffAlgo.ComputeDiff(pretty);
}

var LineMarkerSequence =
/** @class */
function () {
  function LineMarkerSequence(lines) {
    var startColumns = [];
    var endColumns = [];

    for (var i = 0, length_1 = lines.length; i < length_1; i++) {
      startColumns[i] = LineMarkerSequence._getFirstNonBlankColumn(lines[i], 1);
      endColumns[i] = LineMarkerSequence._getLastNonBlankColumn(lines[i], 1);
    }

    this._lines = lines;
    this._startColumns = startColumns;
    this._endColumns = endColumns;
  }

  LineMarkerSequence.prototype.getLength = function () {
    return this._lines.length;
  };

  LineMarkerSequence.prototype.getElementAtIndex = function (i) {
    return this._lines[i].substring(this._startColumns[i] - 1, this._endColumns[i] - 1);
  };

  LineMarkerSequence.prototype.getStartLineNumber = function (i) {
    return i + 1;
  };

  LineMarkerSequence.prototype.getEndLineNumber = function (i) {
    return i + 1;
  };

  LineMarkerSequence._getFirstNonBlankColumn = function (txt, defaultValue) {
    var r = strings.firstNonWhitespaceIndex(txt);

    if (r === -1) {
      return defaultValue;
    }

    return r + 1;
  };

  LineMarkerSequence._getLastNonBlankColumn = function (txt, defaultValue) {
    var r = strings.lastNonWhitespaceIndex(txt);

    if (r === -1) {
      return defaultValue;
    }

    return r + 2;
  };

  LineMarkerSequence.prototype.getCharSequence = function (shouldIgnoreTrimWhitespace, startIndex, endIndex) {
    var charCodes = [];
    var lineNumbers = [];
    var columns = [];
    var len = 0;

    for (var index = startIndex; index <= endIndex; index++) {
      var lineContent = this._lines[index];
      var startColumn = shouldIgnoreTrimWhitespace ? this._startColumns[index] : 1;
      var endColumn = shouldIgnoreTrimWhitespace ? this._endColumns[index] : lineContent.length + 1;

      for (var col = startColumn; col < endColumn; col++) {
        charCodes[len] = lineContent.charCodeAt(col - 1);
        lineNumbers[len] = index + 1;
        columns[len] = col;
        len++;
      }
    }

    return new CharSequence(charCodes, lineNumbers, columns);
  };

  return LineMarkerSequence;
}();

var CharSequence =
/** @class */
function () {
  function CharSequence(charCodes, lineNumbers, columns) {
    this._charCodes = charCodes;
    this._lineNumbers = lineNumbers;
    this._columns = columns;
  }

  CharSequence.prototype.getLength = function () {
    return this._charCodes.length;
  };

  CharSequence.prototype.getElementAtIndex = function (i) {
    return this._charCodes[i];
  };

  CharSequence.prototype.getStartLineNumber = function (i) {
    return this._lineNumbers[i];
  };

  CharSequence.prototype.getStartColumn = function (i) {
    return this._columns[i];
  };

  CharSequence.prototype.getEndLineNumber = function (i) {
    return this._lineNumbers[i];
  };

  CharSequence.prototype.getEndColumn = function (i) {
    return this._columns[i] + 1;
  };

  return CharSequence;
}();

var CharChange =
/** @class */
function () {
  function CharChange(originalStartLineNumber, originalStartColumn, originalEndLineNumber, originalEndColumn, modifiedStartLineNumber, modifiedStartColumn, modifiedEndLineNumber, modifiedEndColumn) {
    this.originalStartLineNumber = originalStartLineNumber;
    this.originalStartColumn = originalStartColumn;
    this.originalEndLineNumber = originalEndLineNumber;
    this.originalEndColumn = originalEndColumn;
    this.modifiedStartLineNumber = modifiedStartLineNumber;
    this.modifiedStartColumn = modifiedStartColumn;
    this.modifiedEndLineNumber = modifiedEndLineNumber;
    this.modifiedEndColumn = modifiedEndColumn;
  }

  CharChange.createFromDiffChange = function (diffChange, originalCharSequence, modifiedCharSequence) {
    var originalStartLineNumber;
    var originalStartColumn;
    var originalEndLineNumber;
    var originalEndColumn;
    var modifiedStartLineNumber;
    var modifiedStartColumn;
    var modifiedEndLineNumber;
    var modifiedEndColumn;

    if (diffChange.originalLength === 0) {
      originalStartLineNumber = 0;
      originalStartColumn = 0;
      originalEndLineNumber = 0;
      originalEndColumn = 0;
    } else {
      originalStartLineNumber = originalCharSequence.getStartLineNumber(diffChange.originalStart);
      originalStartColumn = originalCharSequence.getStartColumn(diffChange.originalStart);
      originalEndLineNumber = originalCharSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
      originalEndColumn = originalCharSequence.getEndColumn(diffChange.originalStart + diffChange.originalLength - 1);
    }

    if (diffChange.modifiedLength === 0) {
      modifiedStartLineNumber = 0;
      modifiedStartColumn = 0;
      modifiedEndLineNumber = 0;
      modifiedEndColumn = 0;
    } else {
      modifiedStartLineNumber = modifiedCharSequence.getStartLineNumber(diffChange.modifiedStart);
      modifiedStartColumn = modifiedCharSequence.getStartColumn(diffChange.modifiedStart);
      modifiedEndLineNumber = modifiedCharSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
      modifiedEndColumn = modifiedCharSequence.getEndColumn(diffChange.modifiedStart + diffChange.modifiedLength - 1);
    }

    return new CharChange(originalStartLineNumber, originalStartColumn, originalEndLineNumber, originalEndColumn, modifiedStartLineNumber, modifiedStartColumn, modifiedEndLineNumber, modifiedEndColumn);
  };

  return CharChange;
}();

function postProcessCharChanges(rawChanges) {
  if (rawChanges.length <= 1) {
    return rawChanges;
  }

  var result = [rawChanges[0]];
  var prevChange = result[0];

  for (var i = 1, len = rawChanges.length; i < len; i++) {
    var currChange = rawChanges[i];
    var originalMatchingLength = currChange.originalStart - (prevChange.originalStart + prevChange.originalLength);
    var modifiedMatchingLength = currChange.modifiedStart - (prevChange.modifiedStart + prevChange.modifiedLength); // Both of the above should be equal, but the continueProcessingPredicate may prevent this from being true

    var matchingLength = Math.min(originalMatchingLength, modifiedMatchingLength);

    if (matchingLength < MINIMUM_MATCHING_CHARACTER_LENGTH) {
      // Merge the current change into the previous one
      prevChange.originalLength = currChange.originalStart + currChange.originalLength - prevChange.originalStart;
      prevChange.modifiedLength = currChange.modifiedStart + currChange.modifiedLength - prevChange.modifiedStart;
    } else {
      // Add the current change
      result.push(currChange);
      prevChange = currChange;
    }
  }

  return result;
}

var LineChange =
/** @class */
function () {
  function LineChange(originalStartLineNumber, originalEndLineNumber, modifiedStartLineNumber, modifiedEndLineNumber, charChanges) {
    this.originalStartLineNumber = originalStartLineNumber;
    this.originalEndLineNumber = originalEndLineNumber;
    this.modifiedStartLineNumber = modifiedStartLineNumber;
    this.modifiedEndLineNumber = modifiedEndLineNumber;
    this.charChanges = charChanges;
  }

  LineChange.createFromDiffResult = function (shouldIgnoreTrimWhitespace, diffChange, originalLineSequence, modifiedLineSequence, continueProcessingPredicate, shouldComputeCharChanges, shouldPostProcessCharChanges) {
    var originalStartLineNumber;
    var originalEndLineNumber;
    var modifiedStartLineNumber;
    var modifiedEndLineNumber;
    var charChanges = undefined;

    if (diffChange.originalLength === 0) {
      originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart) - 1;
      originalEndLineNumber = 0;
    } else {
      originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart);
      originalEndLineNumber = originalLineSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
    }

    if (diffChange.modifiedLength === 0) {
      modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart) - 1;
      modifiedEndLineNumber = 0;
    } else {
      modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart);
      modifiedEndLineNumber = modifiedLineSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
    }

    if (shouldComputeCharChanges && diffChange.originalLength !== 0 && diffChange.modifiedLength !== 0 && continueProcessingPredicate()) {
      var originalCharSequence = originalLineSequence.getCharSequence(shouldIgnoreTrimWhitespace, diffChange.originalStart, diffChange.originalStart + diffChange.originalLength - 1);
      var modifiedCharSequence = modifiedLineSequence.getCharSequence(shouldIgnoreTrimWhitespace, diffChange.modifiedStart, diffChange.modifiedStart + diffChange.modifiedLength - 1);
      var rawChanges = computeDiff(originalCharSequence, modifiedCharSequence, continueProcessingPredicate, true);

      if (shouldPostProcessCharChanges) {
        rawChanges = postProcessCharChanges(rawChanges);
      }

      charChanges = [];

      for (var i = 0, length_2 = rawChanges.length; i < length_2; i++) {
        charChanges.push(CharChange.createFromDiffChange(rawChanges[i], originalCharSequence, modifiedCharSequence));
      }
    }

    return new LineChange(originalStartLineNumber, originalEndLineNumber, modifiedStartLineNumber, modifiedEndLineNumber, charChanges);
  };

  return LineChange;
}();

var DiffComputer =
/** @class */
function () {
  function DiffComputer(originalLines, modifiedLines, opts) {
    this.shouldComputeCharChanges = opts.shouldComputeCharChanges;
    this.shouldPostProcessCharChanges = opts.shouldPostProcessCharChanges;
    this.shouldIgnoreTrimWhitespace = opts.shouldIgnoreTrimWhitespace;
    this.shouldMakePrettyDiff = opts.shouldMakePrettyDiff;
    this.maximumRunTimeMs = MAXIMUM_RUN_TIME;
    this.originalLines = originalLines;
    this.modifiedLines = modifiedLines;
    this.original = new LineMarkerSequence(originalLines);
    this.modified = new LineMarkerSequence(modifiedLines);
  }

  DiffComputer.prototype.computeDiff = function () {
    if (this.original.getLength() === 1 && this.original.getElementAtIndex(0).length === 0) {
      // empty original => fast path
      return [{
        originalStartLineNumber: 1,
        originalEndLineNumber: 1,
        modifiedStartLineNumber: 1,
        modifiedEndLineNumber: this.modified.getLength(),
        charChanges: [{
          modifiedEndColumn: 0,
          modifiedEndLineNumber: 0,
          modifiedStartColumn: 0,
          modifiedStartLineNumber: 0,
          originalEndColumn: 0,
          originalEndLineNumber: 0,
          originalStartColumn: 0,
          originalStartLineNumber: 0
        }]
      }];
    }

    if (this.modified.getLength() === 1 && this.modified.getElementAtIndex(0).length === 0) {
      // empty modified => fast path
      return [{
        originalStartLineNumber: 1,
        originalEndLineNumber: this.original.getLength(),
        modifiedStartLineNumber: 1,
        modifiedEndLineNumber: 1,
        charChanges: [{
          modifiedEndColumn: 0,
          modifiedEndLineNumber: 0,
          modifiedStartColumn: 0,
          modifiedStartLineNumber: 0,
          originalEndColumn: 0,
          originalEndLineNumber: 0,
          originalStartColumn: 0,
          originalStartLineNumber: 0
        }]
      }];
    }

    this.computationStartTime = new Date().getTime();
    var rawChanges = computeDiff(this.original, this.modified, this._continueProcessingPredicate.bind(this), this.shouldMakePrettyDiff); // The diff is always computed with ignoring trim whitespace
    // This ensures we get the prettiest diff

    if (this.shouldIgnoreTrimWhitespace) {
      var lineChanges = [];

      for (var i = 0, length_3 = rawChanges.length; i < length_3; i++) {
        lineChanges.push(LineChange.createFromDiffResult(this.shouldIgnoreTrimWhitespace, rawChanges[i], this.original, this.modified, this._continueProcessingPredicate.bind(this), this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
      }

      return lineChanges;
    } // Need to post-process and introduce changes where the trim whitespace is different
    // Note that we are looping starting at -1 to also cover the lines before the first change


    var result = [];
    var originalLineIndex = 0;
    var modifiedLineIndex = 0;

    for (var i = -1
    /* !!!! */
    , len = rawChanges.length; i < len; i++) {
      var nextChange = i + 1 < len ? rawChanges[i + 1] : null;
      var originalStop = nextChange ? nextChange.originalStart : this.originalLines.length;
      var modifiedStop = nextChange ? nextChange.modifiedStart : this.modifiedLines.length;

      while (originalLineIndex < originalStop && modifiedLineIndex < modifiedStop) {
        var originalLine = this.originalLines[originalLineIndex];
        var modifiedLine = this.modifiedLines[modifiedLineIndex];

        if (originalLine !== modifiedLine) {
          // These lines differ only in trim whitespace
          // Check the leading whitespace
          {
            var originalStartColumn = LineMarkerSequence._getFirstNonBlankColumn(originalLine, 1);

            var modifiedStartColumn = LineMarkerSequence._getFirstNonBlankColumn(modifiedLine, 1);

            while (originalStartColumn > 1 && modifiedStartColumn > 1) {
              var originalChar = originalLine.charCodeAt(originalStartColumn - 2);
              var modifiedChar = modifiedLine.charCodeAt(modifiedStartColumn - 2);

              if (originalChar !== modifiedChar) {
                break;
              }

              originalStartColumn--;
              modifiedStartColumn--;
            }

            if (originalStartColumn > 1 || modifiedStartColumn > 1) {
              this._pushTrimWhitespaceCharChange(result, originalLineIndex + 1, 1, originalStartColumn, modifiedLineIndex + 1, 1, modifiedStartColumn);
            }
          } // Check the trailing whitespace

          {
            var originalEndColumn = LineMarkerSequence._getLastNonBlankColumn(originalLine, 1);

            var modifiedEndColumn = LineMarkerSequence._getLastNonBlankColumn(modifiedLine, 1);

            var originalMaxColumn = originalLine.length + 1;
            var modifiedMaxColumn = modifiedLine.length + 1;

            while (originalEndColumn < originalMaxColumn && modifiedEndColumn < modifiedMaxColumn) {
              var originalChar = originalLine.charCodeAt(originalEndColumn - 1);
              var modifiedChar = originalLine.charCodeAt(modifiedEndColumn - 1);

              if (originalChar !== modifiedChar) {
                break;
              }

              originalEndColumn++;
              modifiedEndColumn++;
            }

            if (originalEndColumn < originalMaxColumn || modifiedEndColumn < modifiedMaxColumn) {
              this._pushTrimWhitespaceCharChange(result, originalLineIndex + 1, originalEndColumn, originalMaxColumn, modifiedLineIndex + 1, modifiedEndColumn, modifiedMaxColumn);
            }
          }
        }

        originalLineIndex++;
        modifiedLineIndex++;
      }

      if (nextChange) {
        // Emit the actual change
        result.push(LineChange.createFromDiffResult(this.shouldIgnoreTrimWhitespace, nextChange, this.original, this.modified, this._continueProcessingPredicate.bind(this), this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
        originalLineIndex += nextChange.originalLength;
        modifiedLineIndex += nextChange.modifiedLength;
      }
    }

    return result;
  };

  DiffComputer.prototype._pushTrimWhitespaceCharChange = function (result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn) {
    if (this._mergeTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn)) {
      // Merged into previous
      return;
    }

    var charChanges = undefined;

    if (this.shouldComputeCharChanges) {
      charChanges = [new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn)];
    }

    result.push(new LineChange(originalLineNumber, originalLineNumber, modifiedLineNumber, modifiedLineNumber, charChanges));
  };

  DiffComputer.prototype._mergeTrimWhitespaceCharChange = function (result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn) {
    var len = result.length;

    if (len === 0) {
      return false;
    }

    var prevChange = result[len - 1];

    if (prevChange.originalEndLineNumber === 0 || prevChange.modifiedEndLineNumber === 0) {
      // Don't merge with inserts/deletes
      return false;
    }

    if (prevChange.originalEndLineNumber + 1 === originalLineNumber && prevChange.modifiedEndLineNumber + 1 === modifiedLineNumber) {
      prevChange.originalEndLineNumber = originalLineNumber;
      prevChange.modifiedEndLineNumber = modifiedLineNumber;

      if (this.shouldComputeCharChanges) {
        prevChange.charChanges.push(new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn));
      }

      return true;
    }

    return false;
  };

  DiffComputer.prototype._continueProcessingPredicate = function () {
    if (this.maximumRunTimeMs === 0) {
      return true;
    }

    var now = new Date().getTime();
    return now - this.computationStartTime < this.maximumRunTimeMs;
  };

  return DiffComputer;
}();

exports.DiffComputer = DiffComputer;
},{"../../../base/common/diff/diff.js":"node_modules/monaco-editor/esm/vs/base/common/diff/diff.js","../../../base/common/strings.js":"node_modules/monaco-editor/esm/vs/base/common/strings.js"}],"node_modules/monaco-editor/esm/vs/editor/common/core/uint.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toUint8 = toUint8;
exports.toUint32 = toUint32;
exports.toUint32Array = toUint32Array;
exports.Uint8Matrix = void 0;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var Uint8Matrix =
/** @class */
function () {
  function Uint8Matrix(rows, cols, defaultValue) {
    var data = new Uint8Array(rows * cols);

    for (var i = 0, len = rows * cols; i < len; i++) {
      data[i] = defaultValue;
    }

    this._data = data;
    this.rows = rows;
    this.cols = cols;
  }

  Uint8Matrix.prototype.get = function (row, col) {
    return this._data[row * this.cols + col];
  };

  Uint8Matrix.prototype.set = function (row, col, value) {
    this._data[row * this.cols + col] = value;
  };

  return Uint8Matrix;
}();

exports.Uint8Matrix = Uint8Matrix;

function toUint8(v) {
  if (v < 0) {
    return 0;
  }

  if (v > 255
  /* MAX_UINT_8 */
  ) {
      return 255
      /* MAX_UINT_8 */
      ;
    }

  return v | 0;
}

function toUint32(v) {
  if (v < 0) {
    return 0;
  }

  if (v > 4294967295
  /* MAX_UINT_32 */
  ) {
      return 4294967295
      /* MAX_UINT_32 */
      ;
    }

  return v | 0;
}

function toUint32Array(arr) {
  var len = arr.length;
  var r = new Uint32Array(len);

  for (var i = 0; i < len; i++) {
    r[i] = toUint32(arr[i]);
  }

  return r;
}
},{}],"node_modules/monaco-editor/esm/vs/editor/common/viewModel/prefixSumComputer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrefixSumComputerWithCache = exports.PrefixSumComputer = exports.PrefixSumIndexOfResult = void 0;

var _uint = require("../core/uint.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var PrefixSumIndexOfResult =
/** @class */
function () {
  function PrefixSumIndexOfResult(index, remainder) {
    this.index = index;
    this.remainder = remainder;
  }

  return PrefixSumIndexOfResult;
}();

exports.PrefixSumIndexOfResult = PrefixSumIndexOfResult;

var PrefixSumComputer =
/** @class */
function () {
  function PrefixSumComputer(values) {
    this.values = values;
    this.prefixSum = new Uint32Array(values.length);
    this.prefixSumValidIndex = new Int32Array(1);
    this.prefixSumValidIndex[0] = -1;
  }

  PrefixSumComputer.prototype.getCount = function () {
    return this.values.length;
  };

  PrefixSumComputer.prototype.insertValues = function (insertIndex, insertValues) {
    insertIndex = (0, _uint.toUint32)(insertIndex);
    var oldValues = this.values;
    var oldPrefixSum = this.prefixSum;
    var insertValuesLen = insertValues.length;

    if (insertValuesLen === 0) {
      return false;
    }

    this.values = new Uint32Array(oldValues.length + insertValuesLen);
    this.values.set(oldValues.subarray(0, insertIndex), 0);
    this.values.set(oldValues.subarray(insertIndex), insertIndex + insertValuesLen);
    this.values.set(insertValues, insertIndex);

    if (insertIndex - 1 < this.prefixSumValidIndex[0]) {
      this.prefixSumValidIndex[0] = insertIndex - 1;
    }

    this.prefixSum = new Uint32Array(this.values.length);

    if (this.prefixSumValidIndex[0] >= 0) {
      this.prefixSum.set(oldPrefixSum.subarray(0, this.prefixSumValidIndex[0] + 1));
    }

    return true;
  };

  PrefixSumComputer.prototype.changeValue = function (index, value) {
    index = (0, _uint.toUint32)(index);
    value = (0, _uint.toUint32)(value);

    if (this.values[index] === value) {
      return false;
    }

    this.values[index] = value;

    if (index - 1 < this.prefixSumValidIndex[0]) {
      this.prefixSumValidIndex[0] = index - 1;
    }

    return true;
  };

  PrefixSumComputer.prototype.removeValues = function (startIndex, cnt) {
    startIndex = (0, _uint.toUint32)(startIndex);
    cnt = (0, _uint.toUint32)(cnt);
    var oldValues = this.values;
    var oldPrefixSum = this.prefixSum;

    if (startIndex >= oldValues.length) {
      return false;
    }

    var maxCnt = oldValues.length - startIndex;

    if (cnt >= maxCnt) {
      cnt = maxCnt;
    }

    if (cnt === 0) {
      return false;
    }

    this.values = new Uint32Array(oldValues.length - cnt);
    this.values.set(oldValues.subarray(0, startIndex), 0);
    this.values.set(oldValues.subarray(startIndex + cnt), startIndex);
    this.prefixSum = new Uint32Array(this.values.length);

    if (startIndex - 1 < this.prefixSumValidIndex[0]) {
      this.prefixSumValidIndex[0] = startIndex - 1;
    }

    if (this.prefixSumValidIndex[0] >= 0) {
      this.prefixSum.set(oldPrefixSum.subarray(0, this.prefixSumValidIndex[0] + 1));
    }

    return true;
  };

  PrefixSumComputer.prototype.getTotalValue = function () {
    if (this.values.length === 0) {
      return 0;
    }

    return this._getAccumulatedValue(this.values.length - 1);
  };

  PrefixSumComputer.prototype.getAccumulatedValue = function (index) {
    if (index < 0) {
      return 0;
    }

    index = (0, _uint.toUint32)(index);
    return this._getAccumulatedValue(index);
  };

  PrefixSumComputer.prototype._getAccumulatedValue = function (index) {
    if (index <= this.prefixSumValidIndex[0]) {
      return this.prefixSum[index];
    }

    var startIndex = this.prefixSumValidIndex[0] + 1;

    if (startIndex === 0) {
      this.prefixSum[0] = this.values[0];
      startIndex++;
    }

    if (index >= this.values.length) {
      index = this.values.length - 1;
    }

    for (var i = startIndex; i <= index; i++) {
      this.prefixSum[i] = this.prefixSum[i - 1] + this.values[i];
    }

    this.prefixSumValidIndex[0] = Math.max(this.prefixSumValidIndex[0], index);
    return this.prefixSum[index];
  };

  PrefixSumComputer.prototype.getIndexOf = function (accumulatedValue) {
    accumulatedValue = Math.floor(accumulatedValue); //@perf
    // Compute all sums (to get a fully valid prefixSum)

    this.getTotalValue();
    var low = 0;
    var high = this.values.length - 1;
    var mid = 0;
    var midStop = 0;
    var midStart = 0;

    while (low <= high) {
      mid = low + (high - low) / 2 | 0;
      midStop = this.prefixSum[mid];
      midStart = midStop - this.values[mid];

      if (accumulatedValue < midStart) {
        high = mid - 1;
      } else if (accumulatedValue >= midStop) {
        low = mid + 1;
      } else {
        break;
      }
    }

    return new PrefixSumIndexOfResult(mid, accumulatedValue - midStart);
  };

  return PrefixSumComputer;
}();

exports.PrefixSumComputer = PrefixSumComputer;

var PrefixSumComputerWithCache =
/** @class */
function () {
  function PrefixSumComputerWithCache(values) {
    this._cacheAccumulatedValueStart = 0;
    this._cache = null;
    this._actual = new PrefixSumComputer(values);

    this._bustCache();
  }

  PrefixSumComputerWithCache.prototype._bustCache = function () {
    this._cacheAccumulatedValueStart = 0;
    this._cache = null;
  };

  PrefixSumComputerWithCache.prototype.insertValues = function (insertIndex, insertValues) {
    if (this._actual.insertValues(insertIndex, insertValues)) {
      this._bustCache();
    }
  };

  PrefixSumComputerWithCache.prototype.changeValue = function (index, value) {
    if (this._actual.changeValue(index, value)) {
      this._bustCache();
    }
  };

  PrefixSumComputerWithCache.prototype.removeValues = function (startIndex, cnt) {
    if (this._actual.removeValues(startIndex, cnt)) {
      this._bustCache();
    }
  };

  PrefixSumComputerWithCache.prototype.getTotalValue = function () {
    return this._actual.getTotalValue();
  };

  PrefixSumComputerWithCache.prototype.getAccumulatedValue = function (index) {
    return this._actual.getAccumulatedValue(index);
  };

  PrefixSumComputerWithCache.prototype.getIndexOf = function (accumulatedValue) {
    accumulatedValue = Math.floor(accumulatedValue); //@perf

    if (this._cache !== null) {
      var cacheIndex = accumulatedValue - this._cacheAccumulatedValueStart;

      if (cacheIndex >= 0 && cacheIndex < this._cache.length) {
        // Cache hit!
        return this._cache[cacheIndex];
      }
    } // Cache miss!


    return this._actual.getIndexOf(accumulatedValue);
  };
  /**
   * Gives a hint that a lot of requests are about to come in for these accumulated values.
   */


  PrefixSumComputerWithCache.prototype.warmUpCache = function (accumulatedValueStart, accumulatedValueEnd) {
    var newCache = [];

    for (var accumulatedValue = accumulatedValueStart; accumulatedValue <= accumulatedValueEnd; accumulatedValue++) {
      newCache[accumulatedValue - accumulatedValueStart] = this.getIndexOf(accumulatedValue);
    }

    this._cache = newCache;
    this._cacheAccumulatedValueStart = accumulatedValueStart;
  };

  return PrefixSumComputerWithCache;
}();

exports.PrefixSumComputerWithCache = PrefixSumComputerWithCache;
},{"../core/uint.js":"node_modules/monaco-editor/esm/vs/editor/common/core/uint.js"}],"node_modules/monaco-editor/esm/vs/editor/common/model/mirrorTextModel.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MirrorTextModel = void 0;

var _position = require("../core/position.js");

var _prefixSumComputer = require("../viewModel/prefixSumComputer.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var MirrorTextModel =
/** @class */
function () {
  function MirrorTextModel(uri, lines, eol, versionId) {
    this._uri = uri;
    this._lines = lines;
    this._eol = eol;
    this._versionId = versionId;
    this._lineStarts = null;
  }

  MirrorTextModel.prototype.dispose = function () {
    this._lines.length = 0;
  };

  MirrorTextModel.prototype.getText = function () {
    return this._lines.join(this._eol);
  };

  MirrorTextModel.prototype.onEvents = function (e) {
    if (e.eol && e.eol !== this._eol) {
      this._eol = e.eol;
      this._lineStarts = null;
    } // Update my lines


    var changes = e.changes;

    for (var i = 0, len = changes.length; i < len; i++) {
      var change = changes[i];

      this._acceptDeleteRange(change.range);

      this._acceptInsertText(new _position.Position(change.range.startLineNumber, change.range.startColumn), change.text);
    }

    this._versionId = e.versionId;
  };

  MirrorTextModel.prototype._ensureLineStarts = function () {
    if (!this._lineStarts) {
      var eolLength = this._eol.length;
      var linesLength = this._lines.length;
      var lineStartValues = new Uint32Array(linesLength);

      for (var i = 0; i < linesLength; i++) {
        lineStartValues[i] = this._lines[i].length + eolLength;
      }

      this._lineStarts = new _prefixSumComputer.PrefixSumComputer(lineStartValues);
    }
  };
  /**
   * All changes to a line's text go through this method
   */


  MirrorTextModel.prototype._setLineText = function (lineIndex, newValue) {
    this._lines[lineIndex] = newValue;

    if (this._lineStarts) {
      // update prefix sum
      this._lineStarts.changeValue(lineIndex, this._lines[lineIndex].length + this._eol.length);
    }
  };

  MirrorTextModel.prototype._acceptDeleteRange = function (range) {
    if (range.startLineNumber === range.endLineNumber) {
      if (range.startColumn === range.endColumn) {
        // Nothing to delete
        return;
      } // Delete text on the affected line


      this._setLineText(range.startLineNumber - 1, this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1) + this._lines[range.startLineNumber - 1].substring(range.endColumn - 1));

      return;
    } // Take remaining text on last line and append it to remaining text on first line


    this._setLineText(range.startLineNumber - 1, this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1) + this._lines[range.endLineNumber - 1].substring(range.endColumn - 1)); // Delete middle lines


    this._lines.splice(range.startLineNumber, range.endLineNumber - range.startLineNumber);

    if (this._lineStarts) {
      // update prefix sum
      this._lineStarts.removeValues(range.startLineNumber, range.endLineNumber - range.startLineNumber);
    }
  };

  MirrorTextModel.prototype._acceptInsertText = function (position, insertText) {
    if (insertText.length === 0) {
      // Nothing to insert
      return;
    }

    var insertLines = insertText.split(/\r\n|\r|\n/);

    if (insertLines.length === 1) {
      // Inserting text on one line
      this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1) + insertLines[0] + this._lines[position.lineNumber - 1].substring(position.column - 1));

      return;
    } // Append overflowing text from first line to the end of text to insert


    insertLines[insertLines.length - 1] += this._lines[position.lineNumber - 1].substring(position.column - 1); // Delete overflowing text from first line and insert text on first line

    this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1) + insertLines[0]); // Insert new lines & store lengths


    var newLengths = new Uint32Array(insertLines.length - 1);

    for (var i = 1; i < insertLines.length; i++) {
      this._lines.splice(position.lineNumber + i - 1, 0, insertLines[i]);

      newLengths[i - 1] = insertLines[i].length + this._eol.length;
    }

    if (this._lineStarts) {
      // update prefix sum
      this._lineStarts.insertValues(position.lineNumber, newLengths);
    }
  };

  return MirrorTextModel;
}();

exports.MirrorTextModel = MirrorTextModel;
},{"../core/position.js":"node_modules/monaco-editor/esm/vs/editor/common/core/position.js","../viewModel/prefixSumComputer.js":"node_modules/monaco-editor/esm/vs/editor/common/viewModel/prefixSumComputer.js"}],"node_modules/monaco-editor/esm/vs/editor/common/model/wordHelper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureValidWordDefinition = ensureValidWordDefinition;
exports.getWordAtText = getWordAtText;
exports.DEFAULT_WORD_REGEXP = exports.USUAL_WORD_SEPARATORS = void 0;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var USUAL_WORD_SEPARATORS = '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?';
/**
 * Create a word definition regular expression based on default word separators.
 * Optionally provide allowed separators that should be included in words.
 *
 * The default would look like this:
 * /(-?\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g
 */

exports.USUAL_WORD_SEPARATORS = USUAL_WORD_SEPARATORS;

function createWordRegExp(allowInWords) {
  if (allowInWords === void 0) {
    allowInWords = '';
  }

  var source = '(-?\\d*\\.\\d\\w*)|([^';

  for (var i = 0; i < USUAL_WORD_SEPARATORS.length; i++) {
    if (allowInWords.indexOf(USUAL_WORD_SEPARATORS[i]) >= 0) {
      continue;
    }

    source += '\\' + USUAL_WORD_SEPARATORS[i];
  }

  source += '\\s]+)';
  return new RegExp(source, 'g');
} // catches numbers (including floating numbers) in the first group, and alphanum in the second


var DEFAULT_WORD_REGEXP = createWordRegExp();
exports.DEFAULT_WORD_REGEXP = DEFAULT_WORD_REGEXP;

function ensureValidWordDefinition(wordDefinition) {
  var result = DEFAULT_WORD_REGEXP;

  if (wordDefinition && wordDefinition instanceof RegExp) {
    if (!wordDefinition.global) {
      var flags = 'g';

      if (wordDefinition.ignoreCase) {
        flags += 'i';
      }

      if (wordDefinition.multiline) {
        flags += 'm';
      }

      result = new RegExp(wordDefinition.source, flags);
    } else {
      result = wordDefinition;
    }
  }

  result.lastIndex = 0;
  return result;
}

function getWordAtPosFast(column, wordDefinition, text, textOffset) {
  // find whitespace enclosed text around column and match from there
  var pos = column - 1 - textOffset;
  var start = text.lastIndexOf(' ', pos - 1) + 1;
  var end = text.indexOf(' ', pos);

  if (end === -1) {
    end = text.length;
  }

  wordDefinition.lastIndex = start;
  var match;

  while (match = wordDefinition.exec(text)) {
    var matchIndex = match.index || 0;

    if (matchIndex <= pos && wordDefinition.lastIndex >= pos) {
      return {
        word: match[0],
        startColumn: textOffset + 1 + matchIndex,
        endColumn: textOffset + 1 + wordDefinition.lastIndex
      };
    }
  }

  return null;
}

function getWordAtPosSlow(column, wordDefinition, text, textOffset) {
  // matches all words starting at the beginning
  // of the input until it finds a match that encloses
  // the desired column. slow but correct
  var pos = column - 1 - textOffset;
  wordDefinition.lastIndex = 0;
  var match;

  while (match = wordDefinition.exec(text)) {
    var matchIndex = match.index || 0;

    if (matchIndex > pos) {
      // |nW -> matched only after the pos
      return null;
    } else if (wordDefinition.lastIndex >= pos) {
      // W|W -> match encloses pos
      return {
        word: match[0],
        startColumn: textOffset + 1 + matchIndex,
        endColumn: textOffset + 1 + wordDefinition.lastIndex
      };
    }
  }

  return null;
}

function getWordAtText(column, wordDefinition, text, textOffset) {
  // if `words` can contain whitespace character we have to use the slow variant
  // otherwise we use the fast variant of finding a word
  wordDefinition.lastIndex = 0;
  var match = wordDefinition.exec(text);

  if (!match) {
    return null;
  } // todo@joh the `match` could already be the (first) word


  var ret = match[0].indexOf(' ') >= 0 // did match a word which contains a space character -> use slow word find
  ? getWordAtPosSlow(column, wordDefinition, text, textOffset) // sane word definition -> use fast word find
  : getWordAtPosFast(column, wordDefinition, text, textOffset); // both (getWordAtPosFast and getWordAtPosSlow) leave the wordDefinition-RegExp
  // in an undefined state and to not confuse other users of the wordDefinition
  // we reset the lastIndex

  wordDefinition.lastIndex = 0;
  return ret;
}
},{}],"node_modules/monaco-editor/esm/vs/editor/common/core/characterClassifier.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CharacterSet = exports.CharacterClassifier = void 0;

var _uint = require("./uint.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * A fast character classifier that uses a compact array for ASCII values.
 */
var CharacterClassifier =
/** @class */
function () {
  function CharacterClassifier(_defaultValue) {
    var defaultValue = (0, _uint.toUint8)(_defaultValue);
    this._defaultValue = defaultValue;
    this._asciiMap = CharacterClassifier._createAsciiMap(defaultValue);
    this._map = new Map();
  }

  CharacterClassifier._createAsciiMap = function (defaultValue) {
    var asciiMap = new Uint8Array(256);

    for (var i = 0; i < 256; i++) {
      asciiMap[i] = defaultValue;
    }

    return asciiMap;
  };

  CharacterClassifier.prototype.set = function (charCode, _value) {
    var value = (0, _uint.toUint8)(_value);

    if (charCode >= 0 && charCode < 256) {
      this._asciiMap[charCode] = value;
    } else {
      this._map.set(charCode, value);
    }
  };

  CharacterClassifier.prototype.get = function (charCode) {
    if (charCode >= 0 && charCode < 256) {
      return this._asciiMap[charCode];
    } else {
      return this._map.get(charCode) || this._defaultValue;
    }
  };

  return CharacterClassifier;
}();

exports.CharacterClassifier = CharacterClassifier;

var CharacterSet =
/** @class */
function () {
  function CharacterSet() {
    this._actual = new CharacterClassifier(0
    /* False */
    );
  }

  CharacterSet.prototype.add = function (charCode) {
    this._actual.set(charCode, 1
    /* True */
    );
  };

  CharacterSet.prototype.has = function (charCode) {
    return this._actual.get(charCode) === 1
    /* True */
    ;
  };

  return CharacterSet;
}();

exports.CharacterSet = CharacterSet;
},{"./uint.js":"node_modules/monaco-editor/esm/vs/editor/common/core/uint.js"}],"node_modules/monaco-editor/esm/vs/editor/common/modes/linkComputer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeLinks = computeLinks;

var _characterClassifier = require("../core/characterClassifier.js");

var _uint = require("../core/uint.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var StateMachine =
/** @class */
function () {
  function StateMachine(edges) {
    var maxCharCode = 0;
    var maxState = 0
    /* Invalid */
    ;

    for (var i = 0, len = edges.length; i < len; i++) {
      var _a = edges[i],
          from = _a[0],
          chCode = _a[1],
          to = _a[2];

      if (chCode > maxCharCode) {
        maxCharCode = chCode;
      }

      if (from > maxState) {
        maxState = from;
      }

      if (to > maxState) {
        maxState = to;
      }
    }

    maxCharCode++;
    maxState++;
    var states = new _uint.Uint8Matrix(maxState, maxCharCode, 0
    /* Invalid */
    );

    for (var i = 0, len = edges.length; i < len; i++) {
      var _b = edges[i],
          from = _b[0],
          chCode = _b[1],
          to = _b[2];
      states.set(from, chCode, to);
    }

    this._states = states;
    this._maxCharCode = maxCharCode;
  }

  StateMachine.prototype.nextState = function (currentState, chCode) {
    if (chCode < 0 || chCode >= this._maxCharCode) {
      return 0
      /* Invalid */
      ;
    }

    return this._states.get(currentState, chCode);
  };

  return StateMachine;
}(); // State machine for http:// or https:// or file://


var _stateMachine = null;

function getStateMachine() {
  if (_stateMachine === null) {
    _stateMachine = new StateMachine([[1
    /* Start */
    , 104
    /* h */
    , 2
    /* H */
    ], [1
    /* Start */
    , 72
    /* H */
    , 2
    /* H */
    ], [1
    /* Start */
    , 102
    /* f */
    , 6
    /* F */
    ], [1
    /* Start */
    , 70
    /* F */
    , 6
    /* F */
    ], [2
    /* H */
    , 116
    /* t */
    , 3
    /* HT */
    ], [2
    /* H */
    , 84
    /* T */
    , 3
    /* HT */
    ], [3
    /* HT */
    , 116
    /* t */
    , 4
    /* HTT */
    ], [3
    /* HT */
    , 84
    /* T */
    , 4
    /* HTT */
    ], [4
    /* HTT */
    , 112
    /* p */
    , 5
    /* HTTP */
    ], [4
    /* HTT */
    , 80
    /* P */
    , 5
    /* HTTP */
    ], [5
    /* HTTP */
    , 115
    /* s */
    , 9
    /* BeforeColon */
    ], [5
    /* HTTP */
    , 83
    /* S */
    , 9
    /* BeforeColon */
    ], [5
    /* HTTP */
    , 58
    /* Colon */
    , 10
    /* AfterColon */
    ], [6
    /* F */
    , 105
    /* i */
    , 7
    /* FI */
    ], [6
    /* F */
    , 73
    /* I */
    , 7
    /* FI */
    ], [7
    /* FI */
    , 108
    /* l */
    , 8
    /* FIL */
    ], [7
    /* FI */
    , 76
    /* L */
    , 8
    /* FIL */
    ], [8
    /* FIL */
    , 101
    /* e */
    , 9
    /* BeforeColon */
    ], [8
    /* FIL */
    , 69
    /* E */
    , 9
    /* BeforeColon */
    ], [9
    /* BeforeColon */
    , 58
    /* Colon */
    , 10
    /* AfterColon */
    ], [10
    /* AfterColon */
    , 47
    /* Slash */
    , 11
    /* AlmostThere */
    ], [11
    /* AlmostThere */
    , 47
    /* Slash */
    , 12
    /* End */
    ]]);
  }

  return _stateMachine;
}

var _classifier = null;

function getClassifier() {
  if (_classifier === null) {
    _classifier = new _characterClassifier.CharacterClassifier(0
    /* None */
    );
    var FORCE_TERMINATION_CHARACTERS = ' \t<>\'\"、。｡､，．：；？！＠＃＄％＆＊‘“〈《「『【〔（［｛｢｣｝］）〕】』」》〉”’｀～…';

    for (var i = 0; i < FORCE_TERMINATION_CHARACTERS.length; i++) {
      _classifier.set(FORCE_TERMINATION_CHARACTERS.charCodeAt(i), 1
      /* ForceTermination */
      );
    }

    var CANNOT_END_WITH_CHARACTERS = '.,;';

    for (var i = 0; i < CANNOT_END_WITH_CHARACTERS.length; i++) {
      _classifier.set(CANNOT_END_WITH_CHARACTERS.charCodeAt(i), 2
      /* CannotEndIn */
      );
    }
  }

  return _classifier;
}

var LinkComputer =
/** @class */
function () {
  function LinkComputer() {}

  LinkComputer._createLink = function (classifier, line, lineNumber, linkBeginIndex, linkEndIndex) {
    // Do not allow to end link in certain characters...
    var lastIncludedCharIndex = linkEndIndex - 1;

    do {
      var chCode = line.charCodeAt(lastIncludedCharIndex);
      var chClass = classifier.get(chCode);

      if (chClass !== 2
      /* CannotEndIn */
      ) {
          break;
        }

      lastIncludedCharIndex--;
    } while (lastIncludedCharIndex > linkBeginIndex); // Handle links enclosed in parens, square brackets and curlys.


    if (linkBeginIndex > 0) {
      var charCodeBeforeLink = line.charCodeAt(linkBeginIndex - 1);
      var lastCharCodeInLink = line.charCodeAt(lastIncludedCharIndex);

      if (charCodeBeforeLink === 40
      /* OpenParen */
      && lastCharCodeInLink === 41
      /* CloseParen */
      || charCodeBeforeLink === 91
      /* OpenSquareBracket */
      && lastCharCodeInLink === 93
      /* CloseSquareBracket */
      || charCodeBeforeLink === 123
      /* OpenCurlyBrace */
      && lastCharCodeInLink === 125
      /* CloseCurlyBrace */
      ) {
        // Do not end in ) if ( is before the link start
        // Do not end in ] if [ is before the link start
        // Do not end in } if { is before the link start
        lastIncludedCharIndex--;
      }
    }

    return {
      range: {
        startLineNumber: lineNumber,
        startColumn: linkBeginIndex + 1,
        endLineNumber: lineNumber,
        endColumn: lastIncludedCharIndex + 2
      },
      url: line.substring(linkBeginIndex, lastIncludedCharIndex + 1)
    };
  };

  LinkComputer.computeLinks = function (model) {
    var stateMachine = getStateMachine();
    var classifier = getClassifier();
    var result = [];

    for (var i = 1, lineCount = model.getLineCount(); i <= lineCount; i++) {
      var line = model.getLineContent(i);
      var len = line.length;
      var j = 0;
      var linkBeginIndex = 0;
      var linkBeginChCode = 0;
      var state = 1
      /* Start */
      ;
      var hasOpenParens = false;
      var hasOpenSquareBracket = false;
      var hasOpenCurlyBracket = false;

      while (j < len) {
        var resetStateMachine = false;
        var chCode = line.charCodeAt(j);

        if (state === 13
        /* Accept */
        ) {
            var chClass = void 0;

            switch (chCode) {
              case 40
              /* OpenParen */
              :
                hasOpenParens = true;
                chClass = 0
                /* None */
                ;
                break;

              case 41
              /* CloseParen */
              :
                chClass = hasOpenParens ? 0
                /* None */
                : 1
                /* ForceTermination */
                ;
                break;

              case 91
              /* OpenSquareBracket */
              :
                hasOpenSquareBracket = true;
                chClass = 0
                /* None */
                ;
                break;

              case 93
              /* CloseSquareBracket */
              :
                chClass = hasOpenSquareBracket ? 0
                /* None */
                : 1
                /* ForceTermination */
                ;
                break;

              case 123
              /* OpenCurlyBrace */
              :
                hasOpenCurlyBracket = true;
                chClass = 0
                /* None */
                ;
                break;

              case 125
              /* CloseCurlyBrace */
              :
                chClass = hasOpenCurlyBracket ? 0
                /* None */
                : 1
                /* ForceTermination */
                ;
                break;

              /* The following three rules make it that ' or " or ` are allowed inside links if the link began with a different one */

              case 39
              /* SingleQuote */
              :
                chClass = linkBeginChCode === 34
                /* DoubleQuote */
                || linkBeginChCode === 96
                /* BackTick */
                ? 0
                /* None */
                : 1
                /* ForceTermination */
                ;
                break;

              case 34
              /* DoubleQuote */
              :
                chClass = linkBeginChCode === 39
                /* SingleQuote */
                || linkBeginChCode === 96
                /* BackTick */
                ? 0
                /* None */
                : 1
                /* ForceTermination */
                ;
                break;

              case 96
              /* BackTick */
              :
                chClass = linkBeginChCode === 39
                /* SingleQuote */
                || linkBeginChCode === 34
                /* DoubleQuote */
                ? 0
                /* None */
                : 1
                /* ForceTermination */
                ;
                break;

              default:
                chClass = classifier.get(chCode);
            } // Check if character terminates link


            if (chClass === 1
            /* ForceTermination */
            ) {
                result.push(LinkComputer._createLink(classifier, line, i, linkBeginIndex, j));
                resetStateMachine = true;
              }
          } else if (state === 12
        /* End */
        ) {
            var chClass = classifier.get(chCode); // Check if character terminates link

            if (chClass === 1
            /* ForceTermination */
            ) {
                resetStateMachine = true;
              } else {
              state = 13
              /* Accept */
              ;
            }
          } else {
          state = stateMachine.nextState(state, chCode);

          if (state === 0
          /* Invalid */
          ) {
              resetStateMachine = true;
            }
        }

        if (resetStateMachine) {
          state = 1
          /* Start */
          ;
          hasOpenParens = false;
          hasOpenSquareBracket = false;
          hasOpenCurlyBracket = false; // Record where the link started

          linkBeginIndex = j + 1;
          linkBeginChCode = chCode;
        }

        j++;
      }

      if (state === 13
      /* Accept */
      ) {
          result.push(LinkComputer._createLink(classifier, line, i, linkBeginIndex, len));
        }
    }

    return result;
  };

  return LinkComputer;
}();
/**
 * Returns an array of all links contains in the provided
 * document. *Note* that this operation is computational
 * expensive and should not run in the UI thread.
 */


function computeLinks(model) {
  if (!model || typeof model.getLineCount !== 'function' || typeof model.getLineContent !== 'function') {
    // Unknown caller!
    return [];
  }

  return LinkComputer.computeLinks(model);
}
},{"../core/characterClassifier.js":"node_modules/monaco-editor/esm/vs/editor/common/core/characterClassifier.js","../core/uint.js":"node_modules/monaco-editor/esm/vs/editor/common/core/uint.js"}],"node_modules/monaco-editor/esm/vs/editor/common/modes/supports/inplaceReplaceSupport.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicInplaceReplace = void 0;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var BasicInplaceReplace =
/** @class */
function () {
  function BasicInplaceReplace() {
    this._defaultValueSet = [['true', 'false'], ['True', 'False'], ['Private', 'Public', 'Friend', 'ReadOnly', 'Partial', 'Protected', 'WriteOnly'], ['public', 'protected', 'private']];
  }

  BasicInplaceReplace.prototype.navigateValueSet = function (range1, text1, range2, text2, up) {
    if (range1 && text1) {
      var result = this.doNavigateValueSet(text1, up);

      if (result) {
        return {
          range: range1,
          value: result
        };
      }
    }

    if (range2 && text2) {
      var result = this.doNavigateValueSet(text2, up);

      if (result) {
        return {
          range: range2,
          value: result
        };
      }
    }

    return null;
  };

  BasicInplaceReplace.prototype.doNavigateValueSet = function (text, up) {
    var numberResult = this.numberReplace(text, up);

    if (numberResult !== null) {
      return numberResult;
    }

    return this.textReplace(text, up);
  };

  BasicInplaceReplace.prototype.numberReplace = function (value, up) {
    var precision = Math.pow(10, value.length - (value.lastIndexOf('.') + 1));
    var n1 = Number(value);
    var n2 = parseFloat(value);

    if (!isNaN(n1) && !isNaN(n2) && n1 === n2) {
      if (n1 === 0 && !up) {
        return null; // don't do negative
        //			} else if(n1 === 9 && up) {
        //				return null; // don't insert 10 into a number
      } else {
        n1 = Math.floor(n1 * precision);
        n1 += up ? precision : -precision;
        return String(n1 / precision);
      }
    }

    return null;
  };

  BasicInplaceReplace.prototype.textReplace = function (value, up) {
    return this.valueSetsReplace(this._defaultValueSet, value, up);
  };

  BasicInplaceReplace.prototype.valueSetsReplace = function (valueSets, value, up) {
    var result = null;

    for (var i = 0, len = valueSets.length; result === null && i < len; i++) {
      result = this.valueSetReplace(valueSets[i], value, up);
    }

    return result;
  };

  BasicInplaceReplace.prototype.valueSetReplace = function (valueSet, value, up) {
    var idx = valueSet.indexOf(value);

    if (idx >= 0) {
      idx += up ? +1 : -1;

      if (idx < 0) {
        idx = valueSet.length - 1;
      } else {
        idx %= valueSet.length;
      }

      return valueSet[idx];
    }

    return null;
  };

  BasicInplaceReplace.INSTANCE = new BasicInplaceReplace();
  return BasicInplaceReplace;
}();

exports.BasicInplaceReplace = BasicInplaceReplace;
},{}],"node_modules/monaco-editor/esm/vs/base/common/keyCodes.js":[function(require,module,exports) {
var define;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeyChord = KeyChord;
exports.createKeybinding = createKeybinding;
exports.createSimpleKeybinding = createSimpleKeybinding;
exports.ResolvedKeybinding = exports.ResolvedKeybindingPart = exports.ChordKeybinding = exports.SimpleKeybinding = exports.KeyCodeUtils = void 0;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var KeyCodeStrMap =
/** @class */
function () {
  function KeyCodeStrMap() {
    this._keyCodeToStr = [];
    this._strToKeyCode = Object.create(null);
  }

  KeyCodeStrMap.prototype.define = function (keyCode, str) {
    this._keyCodeToStr[keyCode] = str;
    this._strToKeyCode[str.toLowerCase()] = keyCode;
  };

  KeyCodeStrMap.prototype.keyCodeToStr = function (keyCode) {
    return this._keyCodeToStr[keyCode];
  };

  KeyCodeStrMap.prototype.strToKeyCode = function (str) {
    return this._strToKeyCode[str.toLowerCase()] || 0
    /* Unknown */
    ;
  };

  return KeyCodeStrMap;
}();

var uiMap = new KeyCodeStrMap();
var userSettingsUSMap = new KeyCodeStrMap();
var userSettingsGeneralMap = new KeyCodeStrMap();

(function () {
  function define(keyCode, uiLabel, usUserSettingsLabel, generalUserSettingsLabel) {
    if (usUserSettingsLabel === void 0) {
      usUserSettingsLabel = uiLabel;
    }

    if (generalUserSettingsLabel === void 0) {
      generalUserSettingsLabel = usUserSettingsLabel;
    }

    uiMap.define(keyCode, uiLabel);
    userSettingsUSMap.define(keyCode, usUserSettingsLabel);
    userSettingsGeneralMap.define(keyCode, generalUserSettingsLabel);
  }

  define(0
  /* Unknown */
  , 'unknown');
  define(1
  /* Backspace */
  , 'Backspace');
  define(2
  /* Tab */
  , 'Tab');
  define(3
  /* Enter */
  , 'Enter');
  define(4
  /* Shift */
  , 'Shift');
  define(5
  /* Ctrl */
  , 'Ctrl');
  define(6
  /* Alt */
  , 'Alt');
  define(7
  /* PauseBreak */
  , 'PauseBreak');
  define(8
  /* CapsLock */
  , 'CapsLock');
  define(9
  /* Escape */
  , 'Escape');
  define(10
  /* Space */
  , 'Space');
  define(11
  /* PageUp */
  , 'PageUp');
  define(12
  /* PageDown */
  , 'PageDown');
  define(13
  /* End */
  , 'End');
  define(14
  /* Home */
  , 'Home');
  define(15
  /* LeftArrow */
  , 'LeftArrow', 'Left');
  define(16
  /* UpArrow */
  , 'UpArrow', 'Up');
  define(17
  /* RightArrow */
  , 'RightArrow', 'Right');
  define(18
  /* DownArrow */
  , 'DownArrow', 'Down');
  define(19
  /* Insert */
  , 'Insert');
  define(20
  /* Delete */
  , 'Delete');
  define(21
  /* KEY_0 */
  , '0');
  define(22
  /* KEY_1 */
  , '1');
  define(23
  /* KEY_2 */
  , '2');
  define(24
  /* KEY_3 */
  , '3');
  define(25
  /* KEY_4 */
  , '4');
  define(26
  /* KEY_5 */
  , '5');
  define(27
  /* KEY_6 */
  , '6');
  define(28
  /* KEY_7 */
  , '7');
  define(29
  /* KEY_8 */
  , '8');
  define(30
  /* KEY_9 */
  , '9');
  define(31
  /* KEY_A */
  , 'A');
  define(32
  /* KEY_B */
  , 'B');
  define(33
  /* KEY_C */
  , 'C');
  define(34
  /* KEY_D */
  , 'D');
  define(35
  /* KEY_E */
  , 'E');
  define(36
  /* KEY_F */
  , 'F');
  define(37
  /* KEY_G */
  , 'G');
  define(38
  /* KEY_H */
  , 'H');
  define(39
  /* KEY_I */
  , 'I');
  define(40
  /* KEY_J */
  , 'J');
  define(41
  /* KEY_K */
  , 'K');
  define(42
  /* KEY_L */
  , 'L');
  define(43
  /* KEY_M */
  , 'M');
  define(44
  /* KEY_N */
  , 'N');
  define(45
  /* KEY_O */
  , 'O');
  define(46
  /* KEY_P */
  , 'P');
  define(47
  /* KEY_Q */
  , 'Q');
  define(48
  /* KEY_R */
  , 'R');
  define(49
  /* KEY_S */
  , 'S');
  define(50
  /* KEY_T */
  , 'T');
  define(51
  /* KEY_U */
  , 'U');
  define(52
  /* KEY_V */
  , 'V');
  define(53
  /* KEY_W */
  , 'W');
  define(54
  /* KEY_X */
  , 'X');
  define(55
  /* KEY_Y */
  , 'Y');
  define(56
  /* KEY_Z */
  , 'Z');
  define(57
  /* Meta */
  , 'Meta');
  define(58
  /* ContextMenu */
  , 'ContextMenu');
  define(59
  /* F1 */
  , 'F1');
  define(60
  /* F2 */
  , 'F2');
  define(61
  /* F3 */
  , 'F3');
  define(62
  /* F4 */
  , 'F4');
  define(63
  /* F5 */
  , 'F5');
  define(64
  /* F6 */
  , 'F6');
  define(65
  /* F7 */
  , 'F7');
  define(66
  /* F8 */
  , 'F8');
  define(67
  /* F9 */
  , 'F9');
  define(68
  /* F10 */
  , 'F10');
  define(69
  /* F11 */
  , 'F11');
  define(70
  /* F12 */
  , 'F12');
  define(71
  /* F13 */
  , 'F13');
  define(72
  /* F14 */
  , 'F14');
  define(73
  /* F15 */
  , 'F15');
  define(74
  /* F16 */
  , 'F16');
  define(75
  /* F17 */
  , 'F17');
  define(76
  /* F18 */
  , 'F18');
  define(77
  /* F19 */
  , 'F19');
  define(78
  /* NumLock */
  , 'NumLock');
  define(79
  /* ScrollLock */
  , 'ScrollLock');
  define(80
  /* US_SEMICOLON */
  , ';', ';', 'OEM_1');
  define(81
  /* US_EQUAL */
  , '=', '=', 'OEM_PLUS');
  define(82
  /* US_COMMA */
  , ',', ',', 'OEM_COMMA');
  define(83
  /* US_MINUS */
  , '-', '-', 'OEM_MINUS');
  define(84
  /* US_DOT */
  , '.', '.', 'OEM_PERIOD');
  define(85
  /* US_SLASH */
  , '/', '/', 'OEM_2');
  define(86
  /* US_BACKTICK */
  , '`', '`', 'OEM_3');
  define(110
  /* ABNT_C1 */
  , 'ABNT_C1');
  define(111
  /* ABNT_C2 */
  , 'ABNT_C2');
  define(87
  /* US_OPEN_SQUARE_BRACKET */
  , '[', '[', 'OEM_4');
  define(88
  /* US_BACKSLASH */
  , '\\', '\\', 'OEM_5');
  define(89
  /* US_CLOSE_SQUARE_BRACKET */
  , ']', ']', 'OEM_6');
  define(90
  /* US_QUOTE */
  , '\'', '\'', 'OEM_7');
  define(91
  /* OEM_8 */
  , 'OEM_8');
  define(92
  /* OEM_102 */
  , 'OEM_102');
  define(93
  /* NUMPAD_0 */
  , 'NumPad0');
  define(94
  /* NUMPAD_1 */
  , 'NumPad1');
  define(95
  /* NUMPAD_2 */
  , 'NumPad2');
  define(96
  /* NUMPAD_3 */
  , 'NumPad3');
  define(97
  /* NUMPAD_4 */
  , 'NumPad4');
  define(98
  /* NUMPAD_5 */
  , 'NumPad5');
  define(99
  /* NUMPAD_6 */
  , 'NumPad6');
  define(100
  /* NUMPAD_7 */
  , 'NumPad7');
  define(101
  /* NUMPAD_8 */
  , 'NumPad8');
  define(102
  /* NUMPAD_9 */
  , 'NumPad9');
  define(103
  /* NUMPAD_MULTIPLY */
  , 'NumPad_Multiply');
  define(104
  /* NUMPAD_ADD */
  , 'NumPad_Add');
  define(105
  /* NUMPAD_SEPARATOR */
  , 'NumPad_Separator');
  define(106
  /* NUMPAD_SUBTRACT */
  , 'NumPad_Subtract');
  define(107
  /* NUMPAD_DECIMAL */
  , 'NumPad_Decimal');
  define(108
  /* NUMPAD_DIVIDE */
  , 'NumPad_Divide');
})();

var KeyCodeUtils;
exports.KeyCodeUtils = KeyCodeUtils;

(function (KeyCodeUtils) {
  function toString(keyCode) {
    return uiMap.keyCodeToStr(keyCode);
  }

  KeyCodeUtils.toString = toString;

  function fromString(key) {
    return uiMap.strToKeyCode(key);
  }

  KeyCodeUtils.fromString = fromString;

  function toUserSettingsUS(keyCode) {
    return userSettingsUSMap.keyCodeToStr(keyCode);
  }

  KeyCodeUtils.toUserSettingsUS = toUserSettingsUS;

  function toUserSettingsGeneral(keyCode) {
    return userSettingsGeneralMap.keyCodeToStr(keyCode);
  }

  KeyCodeUtils.toUserSettingsGeneral = toUserSettingsGeneral;

  function fromUserSettings(key) {
    return userSettingsUSMap.strToKeyCode(key) || userSettingsGeneralMap.strToKeyCode(key);
  }

  KeyCodeUtils.fromUserSettings = fromUserSettings;
})(KeyCodeUtils || (exports.KeyCodeUtils = KeyCodeUtils = {}));

function KeyChord(firstPart, secondPart) {
  var chordPart = (secondPart & 0x0000ffff) << 16 >>> 0;
  return (firstPart | chordPart) >>> 0;
}

function createKeybinding(keybinding, OS) {
  if (keybinding === 0) {
    return null;
  }

  var firstPart = (keybinding & 0x0000ffff) >>> 0;
  var chordPart = (keybinding & 0xffff0000) >>> 16;

  if (chordPart !== 0) {
    return new ChordKeybinding(createSimpleKeybinding(firstPart, OS), createSimpleKeybinding(chordPart, OS));
  }

  return createSimpleKeybinding(firstPart, OS);
}

function createSimpleKeybinding(keybinding, OS) {
  var ctrlCmd = keybinding & 2048
  /* CtrlCmd */
  ? true : false;
  var winCtrl = keybinding & 256
  /* WinCtrl */
  ? true : false;
  var ctrlKey = OS === 2
  /* Macintosh */
  ? winCtrl : ctrlCmd;
  var shiftKey = keybinding & 1024
  /* Shift */
  ? true : false;
  var altKey = keybinding & 512
  /* Alt */
  ? true : false;
  var metaKey = OS === 2
  /* Macintosh */
  ? ctrlCmd : winCtrl;
  var keyCode = keybinding & 255
  /* KeyCode */
  ;
  return new SimpleKeybinding(ctrlKey, shiftKey, altKey, metaKey, keyCode);
}

var SimpleKeybinding =
/** @class */
function () {
  function SimpleKeybinding(ctrlKey, shiftKey, altKey, metaKey, keyCode) {
    this.type = 1
    /* Simple */
    ;
    this.ctrlKey = ctrlKey;
    this.shiftKey = shiftKey;
    this.altKey = altKey;
    this.metaKey = metaKey;
    this.keyCode = keyCode;
  }

  SimpleKeybinding.prototype.equals = function (other) {
    if (other.type !== 1
    /* Simple */
    ) {
        return false;
      }

    return this.ctrlKey === other.ctrlKey && this.shiftKey === other.shiftKey && this.altKey === other.altKey && this.metaKey === other.metaKey && this.keyCode === other.keyCode;
  };

  SimpleKeybinding.prototype.isModifierKey = function () {
    return this.keyCode === 0
    /* Unknown */
    || this.keyCode === 5
    /* Ctrl */
    || this.keyCode === 57
    /* Meta */
    || this.keyCode === 6
    /* Alt */
    || this.keyCode === 4
    /* Shift */
    ;
  };
  /**
   * Does this keybinding refer to the key code of a modifier and it also has the modifier flag?
   */


  SimpleKeybinding.prototype.isDuplicateModifierCase = function () {
    return this.ctrlKey && this.keyCode === 5
    /* Ctrl */
    || this.shiftKey && this.keyCode === 4
    /* Shift */
    || this.altKey && this.keyCode === 6
    /* Alt */
    || this.metaKey && this.keyCode === 57
    /* Meta */
    ;
  };

  return SimpleKeybinding;
}();

exports.SimpleKeybinding = SimpleKeybinding;

var ChordKeybinding =
/** @class */
function () {
  function ChordKeybinding(firstPart, chordPart) {
    this.type = 2
    /* Chord */
    ;
    this.firstPart = firstPart;
    this.chordPart = chordPart;
  }

  return ChordKeybinding;
}();

exports.ChordKeybinding = ChordKeybinding;

var ResolvedKeybindingPart =
/** @class */
function () {
  function ResolvedKeybindingPart(ctrlKey, shiftKey, altKey, metaKey, kbLabel, kbAriaLabel) {
    this.ctrlKey = ctrlKey;
    this.shiftKey = shiftKey;
    this.altKey = altKey;
    this.metaKey = metaKey;
    this.keyLabel = kbLabel;
    this.keyAriaLabel = kbAriaLabel;
  }

  return ResolvedKeybindingPart;
}();

exports.ResolvedKeybindingPart = ResolvedKeybindingPart;

/**
 * A resolved keybinding. Can be a simple keybinding or a chord keybinding.
 */
var ResolvedKeybinding =
/** @class */
function () {
  function ResolvedKeybinding() {}

  return ResolvedKeybinding;
}();

exports.ResolvedKeybinding = ResolvedKeybinding;
},{}],"node_modules/monaco-editor/esm/vs/editor/common/core/selection.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Selection = void 0;

var _position = require("./position.js");

var _range = require("./range.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

/**
 * A selection in the editor.
 * The selection is a range that has an orientation.
 */
var Selection =
/** @class */
function (_super) {
  __extends(Selection, _super);

  function Selection(selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn) {
    var _this = _super.call(this, selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn) || this;

    _this.selectionStartLineNumber = selectionStartLineNumber;
    _this.selectionStartColumn = selectionStartColumn;
    _this.positionLineNumber = positionLineNumber;
    _this.positionColumn = positionColumn;
    return _this;
  }
  /**
   * Clone this selection.
   */


  Selection.prototype.clone = function () {
    return new Selection(this.selectionStartLineNumber, this.selectionStartColumn, this.positionLineNumber, this.positionColumn);
  };
  /**
   * Transform to a human-readable representation.
   */


  Selection.prototype.toString = function () {
    return '[' + this.selectionStartLineNumber + ',' + this.selectionStartColumn + ' -> ' + this.positionLineNumber + ',' + this.positionColumn + ']';
  };
  /**
   * Test if equals other selection.
   */


  Selection.prototype.equalsSelection = function (other) {
    return Selection.selectionsEqual(this, other);
  };
  /**
   * Test if the two selections are equal.
   */


  Selection.selectionsEqual = function (a, b) {
    return a.selectionStartLineNumber === b.selectionStartLineNumber && a.selectionStartColumn === b.selectionStartColumn && a.positionLineNumber === b.positionLineNumber && a.positionColumn === b.positionColumn;
  };
  /**
   * Get directions (LTR or RTL).
   */


  Selection.prototype.getDirection = function () {
    if (this.selectionStartLineNumber === this.startLineNumber && this.selectionStartColumn === this.startColumn) {
      return 0
      /* LTR */
      ;
    }

    return 1
    /* RTL */
    ;
  };
  /**
   * Create a new selection with a different `positionLineNumber` and `positionColumn`.
   */


  Selection.prototype.setEndPosition = function (endLineNumber, endColumn) {
    if (this.getDirection() === 0
    /* LTR */
    ) {
        return new Selection(this.startLineNumber, this.startColumn, endLineNumber, endColumn);
      }

    return new Selection(endLineNumber, endColumn, this.startLineNumber, this.startColumn);
  };
  /**
   * Get the position at `positionLineNumber` and `positionColumn`.
   */


  Selection.prototype.getPosition = function () {
    return new _position.Position(this.positionLineNumber, this.positionColumn);
  };
  /**
   * Create a new selection with a different `selectionStartLineNumber` and `selectionStartColumn`.
   */


  Selection.prototype.setStartPosition = function (startLineNumber, startColumn) {
    if (this.getDirection() === 0
    /* LTR */
    ) {
        return new Selection(startLineNumber, startColumn, this.endLineNumber, this.endColumn);
      }

    return new Selection(this.endLineNumber, this.endColumn, startLineNumber, startColumn);
  }; // ----

  /**
   * Create a `Selection` from one or two positions
   */


  Selection.fromPositions = function (start, end) {
    if (end === void 0) {
      end = start;
    }

    return new Selection(start.lineNumber, start.column, end.lineNumber, end.column);
  };
  /**
   * Create a `Selection` from an `ISelection`.
   */


  Selection.liftSelection = function (sel) {
    return new Selection(sel.selectionStartLineNumber, sel.selectionStartColumn, sel.positionLineNumber, sel.positionColumn);
  };
  /**
   * `a` equals `b`.
   */


  Selection.selectionsArrEqual = function (a, b) {
    if (a && !b || !a && b) {
      return false;
    }

    if (!a && !b) {
      return true;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (var i = 0, len = a.length; i < len; i++) {
      if (!this.selectionsEqual(a[i], b[i])) {
        return false;
      }
    }

    return true;
  };
  /**
   * Test if `obj` is an `ISelection`.
   */


  Selection.isISelection = function (obj) {
    return obj && typeof obj.selectionStartLineNumber === 'number' && typeof obj.selectionStartColumn === 'number' && typeof obj.positionLineNumber === 'number' && typeof obj.positionColumn === 'number';
  };
  /**
   * Create with a direction.
   */


  Selection.createWithDirection = function (startLineNumber, startColumn, endLineNumber, endColumn, direction) {
    if (direction === 0
    /* LTR */
    ) {
        return new Selection(startLineNumber, startColumn, endLineNumber, endColumn);
      }

    return new Selection(endLineNumber, endColumn, startLineNumber, startColumn);
  };

  return Selection;
}(_range.Range);

exports.Selection = Selection;
},{"./position.js":"node_modules/monaco-editor/esm/vs/editor/common/core/position.js","./range.js":"node_modules/monaco-editor/esm/vs/editor/common/core/range.js"}],"node_modules/monaco-editor/esm/vs/editor/common/core/token.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenizationResult2 = exports.TokenizationResult = exports.Token = void 0;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var Token =
/** @class */
function () {
  function Token(offset, type, language) {
    this.offset = offset | 0; // @perf

    this.type = type;
    this.language = language;
  }

  Token.prototype.toString = function () {
    return '(' + this.offset + ', ' + this.type + ')';
  };

  return Token;
}();

exports.Token = Token;

var TokenizationResult =
/** @class */
function () {
  function TokenizationResult(tokens, endState) {
    this.tokens = tokens;
    this.endState = endState;
  }

  return TokenizationResult;
}();

exports.TokenizationResult = TokenizationResult;

var TokenizationResult2 =
/** @class */
function () {
  function TokenizationResult2(tokens, endState) {
    this.tokens = tokens;
    this.endState = endState;
  }

  return TokenizationResult2;
}();

exports.TokenizationResult2 = TokenizationResult2;
},{}],"node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneEnums.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SymbolKind = exports.DocumentHighlightKind = exports.SignatureHelpTriggerReason = exports.CompletionTriggerKind = exports.CompletionItemInsertTextRule = exports.CompletionItemKind = exports.IndentAction = exports.MouseTargetType = exports.OverlayWidgetPositionPreference = exports.ContentWidgetPositionPreference = exports.RenderLineNumbersType = exports.TextEditorCursorStyle = exports.TextEditorCursorBlinkingStyle = exports.WrappingIndent = exports.RenderMinimap = exports.CursorChangeReason = exports.ScrollType = exports.TrackedRangeStickiness = exports.EndOfLineSequence = exports.DefaultEndOfLine = exports.EndOfLinePreference = exports.OverviewRulerLane = exports.ScrollbarVisibility = exports.SelectionDirection = exports.KeyCode = exports.MarkerSeverity = exports.MarkerTag = void 0;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY.
var MarkerTag;
exports.MarkerTag = MarkerTag;

(function (MarkerTag) {
  MarkerTag[MarkerTag["Unnecessary"] = 1] = "Unnecessary";
})(MarkerTag || (exports.MarkerTag = MarkerTag = {}));

var MarkerSeverity;
exports.MarkerSeverity = MarkerSeverity;

(function (MarkerSeverity) {
  MarkerSeverity[MarkerSeverity["Hint"] = 1] = "Hint";
  MarkerSeverity[MarkerSeverity["Info"] = 2] = "Info";
  MarkerSeverity[MarkerSeverity["Warning"] = 4] = "Warning";
  MarkerSeverity[MarkerSeverity["Error"] = 8] = "Error";
})(MarkerSeverity || (exports.MarkerSeverity = MarkerSeverity = {}));
/**
 * Virtual Key Codes, the value does not hold any inherent meaning.
 * Inspired somewhat from https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
 * But these are "more general", as they should work across browsers & OS`s.
 */


var KeyCode;
exports.KeyCode = KeyCode;

(function (KeyCode) {
  /**
   * Placed first to cover the 0 value of the enum.
   */
  KeyCode[KeyCode["Unknown"] = 0] = "Unknown";
  KeyCode[KeyCode["Backspace"] = 1] = "Backspace";
  KeyCode[KeyCode["Tab"] = 2] = "Tab";
  KeyCode[KeyCode["Enter"] = 3] = "Enter";
  KeyCode[KeyCode["Shift"] = 4] = "Shift";
  KeyCode[KeyCode["Ctrl"] = 5] = "Ctrl";
  KeyCode[KeyCode["Alt"] = 6] = "Alt";
  KeyCode[KeyCode["PauseBreak"] = 7] = "PauseBreak";
  KeyCode[KeyCode["CapsLock"] = 8] = "CapsLock";
  KeyCode[KeyCode["Escape"] = 9] = "Escape";
  KeyCode[KeyCode["Space"] = 10] = "Space";
  KeyCode[KeyCode["PageUp"] = 11] = "PageUp";
  KeyCode[KeyCode["PageDown"] = 12] = "PageDown";
  KeyCode[KeyCode["End"] = 13] = "End";
  KeyCode[KeyCode["Home"] = 14] = "Home";
  KeyCode[KeyCode["LeftArrow"] = 15] = "LeftArrow";
  KeyCode[KeyCode["UpArrow"] = 16] = "UpArrow";
  KeyCode[KeyCode["RightArrow"] = 17] = "RightArrow";
  KeyCode[KeyCode["DownArrow"] = 18] = "DownArrow";
  KeyCode[KeyCode["Insert"] = 19] = "Insert";
  KeyCode[KeyCode["Delete"] = 20] = "Delete";
  KeyCode[KeyCode["KEY_0"] = 21] = "KEY_0";
  KeyCode[KeyCode["KEY_1"] = 22] = "KEY_1";
  KeyCode[KeyCode["KEY_2"] = 23] = "KEY_2";
  KeyCode[KeyCode["KEY_3"] = 24] = "KEY_3";
  KeyCode[KeyCode["KEY_4"] = 25] = "KEY_4";
  KeyCode[KeyCode["KEY_5"] = 26] = "KEY_5";
  KeyCode[KeyCode["KEY_6"] = 27] = "KEY_6";
  KeyCode[KeyCode["KEY_7"] = 28] = "KEY_7";
  KeyCode[KeyCode["KEY_8"] = 29] = "KEY_8";
  KeyCode[KeyCode["KEY_9"] = 30] = "KEY_9";
  KeyCode[KeyCode["KEY_A"] = 31] = "KEY_A";
  KeyCode[KeyCode["KEY_B"] = 32] = "KEY_B";
  KeyCode[KeyCode["KEY_C"] = 33] = "KEY_C";
  KeyCode[KeyCode["KEY_D"] = 34] = "KEY_D";
  KeyCode[KeyCode["KEY_E"] = 35] = "KEY_E";
  KeyCode[KeyCode["KEY_F"] = 36] = "KEY_F";
  KeyCode[KeyCode["KEY_G"] = 37] = "KEY_G";
  KeyCode[KeyCode["KEY_H"] = 38] = "KEY_H";
  KeyCode[KeyCode["KEY_I"] = 39] = "KEY_I";
  KeyCode[KeyCode["KEY_J"] = 40] = "KEY_J";
  KeyCode[KeyCode["KEY_K"] = 41] = "KEY_K";
  KeyCode[KeyCode["KEY_L"] = 42] = "KEY_L";
  KeyCode[KeyCode["KEY_M"] = 43] = "KEY_M";
  KeyCode[KeyCode["KEY_N"] = 44] = "KEY_N";
  KeyCode[KeyCode["KEY_O"] = 45] = "KEY_O";
  KeyCode[KeyCode["KEY_P"] = 46] = "KEY_P";
  KeyCode[KeyCode["KEY_Q"] = 47] = "KEY_Q";
  KeyCode[KeyCode["KEY_R"] = 48] = "KEY_R";
  KeyCode[KeyCode["KEY_S"] = 49] = "KEY_S";
  KeyCode[KeyCode["KEY_T"] = 50] = "KEY_T";
  KeyCode[KeyCode["KEY_U"] = 51] = "KEY_U";
  KeyCode[KeyCode["KEY_V"] = 52] = "KEY_V";
  KeyCode[KeyCode["KEY_W"] = 53] = "KEY_W";
  KeyCode[KeyCode["KEY_X"] = 54] = "KEY_X";
  KeyCode[KeyCode["KEY_Y"] = 55] = "KEY_Y";
  KeyCode[KeyCode["KEY_Z"] = 56] = "KEY_Z";
  KeyCode[KeyCode["Meta"] = 57] = "Meta";
  KeyCode[KeyCode["ContextMenu"] = 58] = "ContextMenu";
  KeyCode[KeyCode["F1"] = 59] = "F1";
  KeyCode[KeyCode["F2"] = 60] = "F2";
  KeyCode[KeyCode["F3"] = 61] = "F3";
  KeyCode[KeyCode["F4"] = 62] = "F4";
  KeyCode[KeyCode["F5"] = 63] = "F5";
  KeyCode[KeyCode["F6"] = 64] = "F6";
  KeyCode[KeyCode["F7"] = 65] = "F7";
  KeyCode[KeyCode["F8"] = 66] = "F8";
  KeyCode[KeyCode["F9"] = 67] = "F9";
  KeyCode[KeyCode["F10"] = 68] = "F10";
  KeyCode[KeyCode["F11"] = 69] = "F11";
  KeyCode[KeyCode["F12"] = 70] = "F12";
  KeyCode[KeyCode["F13"] = 71] = "F13";
  KeyCode[KeyCode["F14"] = 72] = "F14";
  KeyCode[KeyCode["F15"] = 73] = "F15";
  KeyCode[KeyCode["F16"] = 74] = "F16";
  KeyCode[KeyCode["F17"] = 75] = "F17";
  KeyCode[KeyCode["F18"] = 76] = "F18";
  KeyCode[KeyCode["F19"] = 77] = "F19";
  KeyCode[KeyCode["NumLock"] = 78] = "NumLock";
  KeyCode[KeyCode["ScrollLock"] = 79] = "ScrollLock";
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the ';:' key
   */

  KeyCode[KeyCode["US_SEMICOLON"] = 80] = "US_SEMICOLON";
  /**
   * For any country/region, the '+' key
   * For the US standard keyboard, the '=+' key
   */

  KeyCode[KeyCode["US_EQUAL"] = 81] = "US_EQUAL";
  /**
   * For any country/region, the ',' key
   * For the US standard keyboard, the ',<' key
   */

  KeyCode[KeyCode["US_COMMA"] = 82] = "US_COMMA";
  /**
   * For any country/region, the '-' key
   * For the US standard keyboard, the '-_' key
   */

  KeyCode[KeyCode["US_MINUS"] = 83] = "US_MINUS";
  /**
   * For any country/region, the '.' key
   * For the US standard keyboard, the '.>' key
   */

  KeyCode[KeyCode["US_DOT"] = 84] = "US_DOT";
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the '/?' key
   */

  KeyCode[KeyCode["US_SLASH"] = 85] = "US_SLASH";
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the '`~' key
   */

  KeyCode[KeyCode["US_BACKTICK"] = 86] = "US_BACKTICK";
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the '[{' key
   */

  KeyCode[KeyCode["US_OPEN_SQUARE_BRACKET"] = 87] = "US_OPEN_SQUARE_BRACKET";
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the '\|' key
   */

  KeyCode[KeyCode["US_BACKSLASH"] = 88] = "US_BACKSLASH";
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the ']}' key
   */

  KeyCode[KeyCode["US_CLOSE_SQUARE_BRACKET"] = 89] = "US_CLOSE_SQUARE_BRACKET";
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the ''"' key
   */

  KeyCode[KeyCode["US_QUOTE"] = 90] = "US_QUOTE";
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   */

  KeyCode[KeyCode["OEM_8"] = 91] = "OEM_8";
  /**
   * Either the angle bracket key or the backslash key on the RT 102-key keyboard.
   */

  KeyCode[KeyCode["OEM_102"] = 92] = "OEM_102";
  KeyCode[KeyCode["NUMPAD_0"] = 93] = "NUMPAD_0";
  KeyCode[KeyCode["NUMPAD_1"] = 94] = "NUMPAD_1";
  KeyCode[KeyCode["NUMPAD_2"] = 95] = "NUMPAD_2";
  KeyCode[KeyCode["NUMPAD_3"] = 96] = "NUMPAD_3";
  KeyCode[KeyCode["NUMPAD_4"] = 97] = "NUMPAD_4";
  KeyCode[KeyCode["NUMPAD_5"] = 98] = "NUMPAD_5";
  KeyCode[KeyCode["NUMPAD_6"] = 99] = "NUMPAD_6";
  KeyCode[KeyCode["NUMPAD_7"] = 100] = "NUMPAD_7";
  KeyCode[KeyCode["NUMPAD_8"] = 101] = "NUMPAD_8";
  KeyCode[KeyCode["NUMPAD_9"] = 102] = "NUMPAD_9";
  KeyCode[KeyCode["NUMPAD_MULTIPLY"] = 103] = "NUMPAD_MULTIPLY";
  KeyCode[KeyCode["NUMPAD_ADD"] = 104] = "NUMPAD_ADD";
  KeyCode[KeyCode["NUMPAD_SEPARATOR"] = 105] = "NUMPAD_SEPARATOR";
  KeyCode[KeyCode["NUMPAD_SUBTRACT"] = 106] = "NUMPAD_SUBTRACT";
  KeyCode[KeyCode["NUMPAD_DECIMAL"] = 107] = "NUMPAD_DECIMAL";
  KeyCode[KeyCode["NUMPAD_DIVIDE"] = 108] = "NUMPAD_DIVIDE";
  /**
   * Cover all key codes when IME is processing input.
   */

  KeyCode[KeyCode["KEY_IN_COMPOSITION"] = 109] = "KEY_IN_COMPOSITION";
  KeyCode[KeyCode["ABNT_C1"] = 110] = "ABNT_C1";
  KeyCode[KeyCode["ABNT_C2"] = 111] = "ABNT_C2";
  /**
   * Placed last to cover the length of the enum.
   * Please do not depend on this value!
   */

  KeyCode[KeyCode["MAX_VALUE"] = 112] = "MAX_VALUE";
})(KeyCode || (exports.KeyCode = KeyCode = {}));
/**
 * The direction of a selection.
 */


var SelectionDirection;
exports.SelectionDirection = SelectionDirection;

(function (SelectionDirection) {
  /**
   * The selection starts above where it ends.
   */
  SelectionDirection[SelectionDirection["LTR"] = 0] = "LTR";
  /**
   * The selection starts below where it ends.
   */

  SelectionDirection[SelectionDirection["RTL"] = 1] = "RTL";
})(SelectionDirection || (exports.SelectionDirection = SelectionDirection = {}));

var ScrollbarVisibility;
exports.ScrollbarVisibility = ScrollbarVisibility;

(function (ScrollbarVisibility) {
  ScrollbarVisibility[ScrollbarVisibility["Auto"] = 1] = "Auto";
  ScrollbarVisibility[ScrollbarVisibility["Hidden"] = 2] = "Hidden";
  ScrollbarVisibility[ScrollbarVisibility["Visible"] = 3] = "Visible";
})(ScrollbarVisibility || (exports.ScrollbarVisibility = ScrollbarVisibility = {}));
/**
 * Vertical Lane in the overview ruler of the editor.
 */


var OverviewRulerLane;
exports.OverviewRulerLane = OverviewRulerLane;

(function (OverviewRulerLane) {
  OverviewRulerLane[OverviewRulerLane["Left"] = 1] = "Left";
  OverviewRulerLane[OverviewRulerLane["Center"] = 2] = "Center";
  OverviewRulerLane[OverviewRulerLane["Right"] = 4] = "Right";
  OverviewRulerLane[OverviewRulerLane["Full"] = 7] = "Full";
})(OverviewRulerLane || (exports.OverviewRulerLane = OverviewRulerLane = {}));
/**
 * End of line character preference.
 */


var EndOfLinePreference;
exports.EndOfLinePreference = EndOfLinePreference;

(function (EndOfLinePreference) {
  /**
   * Use the end of line character identified in the text buffer.
   */
  EndOfLinePreference[EndOfLinePreference["TextDefined"] = 0] = "TextDefined";
  /**
   * Use line feed (\n) as the end of line character.
   */

  EndOfLinePreference[EndOfLinePreference["LF"] = 1] = "LF";
  /**
   * Use carriage return and line feed (\r\n) as the end of line character.
   */

  EndOfLinePreference[EndOfLinePreference["CRLF"] = 2] = "CRLF";
})(EndOfLinePreference || (exports.EndOfLinePreference = EndOfLinePreference = {}));
/**
 * The default end of line to use when instantiating models.
 */


var DefaultEndOfLine;
exports.DefaultEndOfLine = DefaultEndOfLine;

(function (DefaultEndOfLine) {
  /**
   * Use line feed (\n) as the end of line character.
   */
  DefaultEndOfLine[DefaultEndOfLine["LF"] = 1] = "LF";
  /**
   * Use carriage return and line feed (\r\n) as the end of line character.
   */

  DefaultEndOfLine[DefaultEndOfLine["CRLF"] = 2] = "CRLF";
})(DefaultEndOfLine || (exports.DefaultEndOfLine = DefaultEndOfLine = {}));
/**
 * End of line character preference.
 */


var EndOfLineSequence;
exports.EndOfLineSequence = EndOfLineSequence;

(function (EndOfLineSequence) {
  /**
   * Use line feed (\n) as the end of line character.
   */
  EndOfLineSequence[EndOfLineSequence["LF"] = 0] = "LF";
  /**
   * Use carriage return and line feed (\r\n) as the end of line character.
   */

  EndOfLineSequence[EndOfLineSequence["CRLF"] = 1] = "CRLF";
})(EndOfLineSequence || (exports.EndOfLineSequence = EndOfLineSequence = {}));
/**
 * Describes the behavior of decorations when typing/editing near their edges.
 * Note: Please do not edit the values, as they very carefully match `DecorationRangeBehavior`
 */


var TrackedRangeStickiness;
exports.TrackedRangeStickiness = TrackedRangeStickiness;

(function (TrackedRangeStickiness) {
  TrackedRangeStickiness[TrackedRangeStickiness["AlwaysGrowsWhenTypingAtEdges"] = 0] = "AlwaysGrowsWhenTypingAtEdges";
  TrackedRangeStickiness[TrackedRangeStickiness["NeverGrowsWhenTypingAtEdges"] = 1] = "NeverGrowsWhenTypingAtEdges";
  TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingBefore"] = 2] = "GrowsOnlyWhenTypingBefore";
  TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingAfter"] = 3] = "GrowsOnlyWhenTypingAfter";
})(TrackedRangeStickiness || (exports.TrackedRangeStickiness = TrackedRangeStickiness = {}));

var ScrollType;
exports.ScrollType = ScrollType;

(function (ScrollType) {
  ScrollType[ScrollType["Smooth"] = 0] = "Smooth";
  ScrollType[ScrollType["Immediate"] = 1] = "Immediate";
})(ScrollType || (exports.ScrollType = ScrollType = {}));
/**
 * Describes the reason the cursor has changed its position.
 */


var CursorChangeReason;
exports.CursorChangeReason = CursorChangeReason;

(function (CursorChangeReason) {
  /**
   * Unknown or not set.
   */
  CursorChangeReason[CursorChangeReason["NotSet"] = 0] = "NotSet";
  /**
   * A `model.setValue()` was called.
   */

  CursorChangeReason[CursorChangeReason["ContentFlush"] = 1] = "ContentFlush";
  /**
   * The `model` has been changed outside of this cursor and the cursor recovers its position from associated markers.
   */

  CursorChangeReason[CursorChangeReason["RecoverFromMarkers"] = 2] = "RecoverFromMarkers";
  /**
   * There was an explicit user gesture.
   */

  CursorChangeReason[CursorChangeReason["Explicit"] = 3] = "Explicit";
  /**
   * There was a Paste.
   */

  CursorChangeReason[CursorChangeReason["Paste"] = 4] = "Paste";
  /**
   * There was an Undo.
   */

  CursorChangeReason[CursorChangeReason["Undo"] = 5] = "Undo";
  /**
   * There was a Redo.
   */

  CursorChangeReason[CursorChangeReason["Redo"] = 6] = "Redo";
})(CursorChangeReason || (exports.CursorChangeReason = CursorChangeReason = {}));

var RenderMinimap;
exports.RenderMinimap = RenderMinimap;

(function (RenderMinimap) {
  RenderMinimap[RenderMinimap["None"] = 0] = "None";
  RenderMinimap[RenderMinimap["Small"] = 1] = "Small";
  RenderMinimap[RenderMinimap["Large"] = 2] = "Large";
  RenderMinimap[RenderMinimap["SmallBlocks"] = 3] = "SmallBlocks";
  RenderMinimap[RenderMinimap["LargeBlocks"] = 4] = "LargeBlocks";
})(RenderMinimap || (exports.RenderMinimap = RenderMinimap = {}));
/**
 * Describes how to indent wrapped lines.
 */


var WrappingIndent;
exports.WrappingIndent = WrappingIndent;

(function (WrappingIndent) {
  /**
   * No indentation => wrapped lines begin at column 1.
   */
  WrappingIndent[WrappingIndent["None"] = 0] = "None";
  /**
   * Same => wrapped lines get the same indentation as the parent.
   */

  WrappingIndent[WrappingIndent["Same"] = 1] = "Same";
  /**
   * Indent => wrapped lines get +1 indentation toward the parent.
   */

  WrappingIndent[WrappingIndent["Indent"] = 2] = "Indent";
  /**
   * DeepIndent => wrapped lines get +2 indentation toward the parent.
   */

  WrappingIndent[WrappingIndent["DeepIndent"] = 3] = "DeepIndent";
})(WrappingIndent || (exports.WrappingIndent = WrappingIndent = {}));
/**
 * The kind of animation in which the editor's cursor should be rendered.
 */


var TextEditorCursorBlinkingStyle;
exports.TextEditorCursorBlinkingStyle = TextEditorCursorBlinkingStyle;

(function (TextEditorCursorBlinkingStyle) {
  /**
   * Hidden
   */
  TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Hidden"] = 0] = "Hidden";
  /**
   * Blinking
   */

  TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Blink"] = 1] = "Blink";
  /**
   * Blinking with smooth fading
   */

  TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Smooth"] = 2] = "Smooth";
  /**
   * Blinking with prolonged filled state and smooth fading
   */

  TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Phase"] = 3] = "Phase";
  /**
   * Expand collapse animation on the y axis
   */

  TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Expand"] = 4] = "Expand";
  /**
   * No-Blinking
   */

  TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Solid"] = 5] = "Solid";
})(TextEditorCursorBlinkingStyle || (exports.TextEditorCursorBlinkingStyle = TextEditorCursorBlinkingStyle = {}));
/**
 * The style in which the editor's cursor should be rendered.
 */


var TextEditorCursorStyle;
exports.TextEditorCursorStyle = TextEditorCursorStyle;

(function (TextEditorCursorStyle) {
  /**
   * As a vertical line (sitting between two characters).
   */
  TextEditorCursorStyle[TextEditorCursorStyle["Line"] = 1] = "Line";
  /**
   * As a block (sitting on top of a character).
   */

  TextEditorCursorStyle[TextEditorCursorStyle["Block"] = 2] = "Block";
  /**
   * As a horizontal line (sitting under a character).
   */

  TextEditorCursorStyle[TextEditorCursorStyle["Underline"] = 3] = "Underline";
  /**
   * As a thin vertical line (sitting between two characters).
   */

  TextEditorCursorStyle[TextEditorCursorStyle["LineThin"] = 4] = "LineThin";
  /**
   * As an outlined block (sitting on top of a character).
   */

  TextEditorCursorStyle[TextEditorCursorStyle["BlockOutline"] = 5] = "BlockOutline";
  /**
   * As a thin horizontal line (sitting under a character).
   */

  TextEditorCursorStyle[TextEditorCursorStyle["UnderlineThin"] = 6] = "UnderlineThin";
})(TextEditorCursorStyle || (exports.TextEditorCursorStyle = TextEditorCursorStyle = {}));

var RenderLineNumbersType;
exports.RenderLineNumbersType = RenderLineNumbersType;

(function (RenderLineNumbersType) {
  RenderLineNumbersType[RenderLineNumbersType["Off"] = 0] = "Off";
  RenderLineNumbersType[RenderLineNumbersType["On"] = 1] = "On";
  RenderLineNumbersType[RenderLineNumbersType["Relative"] = 2] = "Relative";
  RenderLineNumbersType[RenderLineNumbersType["Interval"] = 3] = "Interval";
  RenderLineNumbersType[RenderLineNumbersType["Custom"] = 4] = "Custom";
})(RenderLineNumbersType || (exports.RenderLineNumbersType = RenderLineNumbersType = {}));
/**
 * A positioning preference for rendering content widgets.
 */


var ContentWidgetPositionPreference;
exports.ContentWidgetPositionPreference = ContentWidgetPositionPreference;

(function (ContentWidgetPositionPreference) {
  /**
   * Place the content widget exactly at a position
   */
  ContentWidgetPositionPreference[ContentWidgetPositionPreference["EXACT"] = 0] = "EXACT";
  /**
   * Place the content widget above a position
   */

  ContentWidgetPositionPreference[ContentWidgetPositionPreference["ABOVE"] = 1] = "ABOVE";
  /**
   * Place the content widget below a position
   */

  ContentWidgetPositionPreference[ContentWidgetPositionPreference["BELOW"] = 2] = "BELOW";
})(ContentWidgetPositionPreference || (exports.ContentWidgetPositionPreference = ContentWidgetPositionPreference = {}));
/**
 * A positioning preference for rendering overlay widgets.
 */


var OverlayWidgetPositionPreference;
exports.OverlayWidgetPositionPreference = OverlayWidgetPositionPreference;

(function (OverlayWidgetPositionPreference) {
  /**
   * Position the overlay widget in the top right corner
   */
  OverlayWidgetPositionPreference[OverlayWidgetPositionPreference["TOP_RIGHT_CORNER"] = 0] = "TOP_RIGHT_CORNER";
  /**
   * Position the overlay widget in the bottom right corner
   */

  OverlayWidgetPositionPreference[OverlayWidgetPositionPreference["BOTTOM_RIGHT_CORNER"] = 1] = "BOTTOM_RIGHT_CORNER";
  /**
   * Position the overlay widget in the top center
   */

  OverlayWidgetPositionPreference[OverlayWidgetPositionPreference["TOP_CENTER"] = 2] = "TOP_CENTER";
})(OverlayWidgetPositionPreference || (exports.OverlayWidgetPositionPreference = OverlayWidgetPositionPreference = {}));
/**
 * Type of hit element with the mouse in the editor.
 */


var MouseTargetType;
exports.MouseTargetType = MouseTargetType;

(function (MouseTargetType) {
  /**
   * Mouse is on top of an unknown element.
   */
  MouseTargetType[MouseTargetType["UNKNOWN"] = 0] = "UNKNOWN";
  /**
   * Mouse is on top of the textarea used for input.
   */

  MouseTargetType[MouseTargetType["TEXTAREA"] = 1] = "TEXTAREA";
  /**
   * Mouse is on top of the glyph margin
   */

  MouseTargetType[MouseTargetType["GUTTER_GLYPH_MARGIN"] = 2] = "GUTTER_GLYPH_MARGIN";
  /**
   * Mouse is on top of the line numbers
   */

  MouseTargetType[MouseTargetType["GUTTER_LINE_NUMBERS"] = 3] = "GUTTER_LINE_NUMBERS";
  /**
   * Mouse is on top of the line decorations
   */

  MouseTargetType[MouseTargetType["GUTTER_LINE_DECORATIONS"] = 4] = "GUTTER_LINE_DECORATIONS";
  /**
   * Mouse is on top of the whitespace left in the gutter by a view zone.
   */

  MouseTargetType[MouseTargetType["GUTTER_VIEW_ZONE"] = 5] = "GUTTER_VIEW_ZONE";
  /**
   * Mouse is on top of text in the content.
   */

  MouseTargetType[MouseTargetType["CONTENT_TEXT"] = 6] = "CONTENT_TEXT";
  /**
   * Mouse is on top of empty space in the content (e.g. after line text or below last line)
   */

  MouseTargetType[MouseTargetType["CONTENT_EMPTY"] = 7] = "CONTENT_EMPTY";
  /**
   * Mouse is on top of a view zone in the content.
   */

  MouseTargetType[MouseTargetType["CONTENT_VIEW_ZONE"] = 8] = "CONTENT_VIEW_ZONE";
  /**
   * Mouse is on top of a content widget.
   */

  MouseTargetType[MouseTargetType["CONTENT_WIDGET"] = 9] = "CONTENT_WIDGET";
  /**
   * Mouse is on top of the decorations overview ruler.
   */

  MouseTargetType[MouseTargetType["OVERVIEW_RULER"] = 10] = "OVERVIEW_RULER";
  /**
   * Mouse is on top of a scrollbar.
   */

  MouseTargetType[MouseTargetType["SCROLLBAR"] = 11] = "SCROLLBAR";
  /**
   * Mouse is on top of an overlay widget.
   */

  MouseTargetType[MouseTargetType["OVERLAY_WIDGET"] = 12] = "OVERLAY_WIDGET";
  /**
   * Mouse is outside of the editor.
   */

  MouseTargetType[MouseTargetType["OUTSIDE_EDITOR"] = 13] = "OUTSIDE_EDITOR";
})(MouseTargetType || (exports.MouseTargetType = MouseTargetType = {}));
/**
 * Describes what to do with the indentation when pressing Enter.
 */


var IndentAction;
exports.IndentAction = IndentAction;

(function (IndentAction) {
  /**
   * Insert new line and copy the previous line's indentation.
   */
  IndentAction[IndentAction["None"] = 0] = "None";
  /**
   * Insert new line and indent once (relative to the previous line's indentation).
   */

  IndentAction[IndentAction["Indent"] = 1] = "Indent";
  /**
   * Insert two new lines:
   *  - the first one indented which will hold the cursor
   *  - the second one at the same indentation level
   */

  IndentAction[IndentAction["IndentOutdent"] = 2] = "IndentOutdent";
  /**
   * Insert new line and outdent once (relative to the previous line's indentation).
   */

  IndentAction[IndentAction["Outdent"] = 3] = "Outdent";
})(IndentAction || (exports.IndentAction = IndentAction = {}));

var CompletionItemKind;
exports.CompletionItemKind = CompletionItemKind;

(function (CompletionItemKind) {
  CompletionItemKind[CompletionItemKind["Method"] = 0] = "Method";
  CompletionItemKind[CompletionItemKind["Function"] = 1] = "Function";
  CompletionItemKind[CompletionItemKind["Constructor"] = 2] = "Constructor";
  CompletionItemKind[CompletionItemKind["Field"] = 3] = "Field";
  CompletionItemKind[CompletionItemKind["Variable"] = 4] = "Variable";
  CompletionItemKind[CompletionItemKind["Class"] = 5] = "Class";
  CompletionItemKind[CompletionItemKind["Struct"] = 6] = "Struct";
  CompletionItemKind[CompletionItemKind["Interface"] = 7] = "Interface";
  CompletionItemKind[CompletionItemKind["Module"] = 8] = "Module";
  CompletionItemKind[CompletionItemKind["Property"] = 9] = "Property";
  CompletionItemKind[CompletionItemKind["Event"] = 10] = "Event";
  CompletionItemKind[CompletionItemKind["Operator"] = 11] = "Operator";
  CompletionItemKind[CompletionItemKind["Unit"] = 12] = "Unit";
  CompletionItemKind[CompletionItemKind["Value"] = 13] = "Value";
  CompletionItemKind[CompletionItemKind["Constant"] = 14] = "Constant";
  CompletionItemKind[CompletionItemKind["Enum"] = 15] = "Enum";
  CompletionItemKind[CompletionItemKind["EnumMember"] = 16] = "EnumMember";
  CompletionItemKind[CompletionItemKind["Keyword"] = 17] = "Keyword";
  CompletionItemKind[CompletionItemKind["Text"] = 18] = "Text";
  CompletionItemKind[CompletionItemKind["Color"] = 19] = "Color";
  CompletionItemKind[CompletionItemKind["File"] = 20] = "File";
  CompletionItemKind[CompletionItemKind["Reference"] = 21] = "Reference";
  CompletionItemKind[CompletionItemKind["Customcolor"] = 22] = "Customcolor";
  CompletionItemKind[CompletionItemKind["Folder"] = 23] = "Folder";
  CompletionItemKind[CompletionItemKind["TypeParameter"] = 24] = "TypeParameter";
  CompletionItemKind[CompletionItemKind["Snippet"] = 25] = "Snippet";
})(CompletionItemKind || (exports.CompletionItemKind = CompletionItemKind = {}));

var CompletionItemInsertTextRule;
exports.CompletionItemInsertTextRule = CompletionItemInsertTextRule;

(function (CompletionItemInsertTextRule) {
  /**
   * Adjust whitespace/indentation of multiline insert texts to
   * match the current line indentation.
   */
  CompletionItemInsertTextRule[CompletionItemInsertTextRule["KeepWhitespace"] = 1] = "KeepWhitespace";
  /**
   * `insertText` is a snippet.
   */

  CompletionItemInsertTextRule[CompletionItemInsertTextRule["InsertAsSnippet"] = 4] = "InsertAsSnippet";
})(CompletionItemInsertTextRule || (exports.CompletionItemInsertTextRule = CompletionItemInsertTextRule = {}));
/**
 * How a suggest provider was triggered.
 */


var CompletionTriggerKind;
exports.CompletionTriggerKind = CompletionTriggerKind;

(function (CompletionTriggerKind) {
  CompletionTriggerKind[CompletionTriggerKind["Invoke"] = 0] = "Invoke";
  CompletionTriggerKind[CompletionTriggerKind["TriggerCharacter"] = 1] = "TriggerCharacter";
  CompletionTriggerKind[CompletionTriggerKind["TriggerForIncompleteCompletions"] = 2] = "TriggerForIncompleteCompletions";
})(CompletionTriggerKind || (exports.CompletionTriggerKind = CompletionTriggerKind = {}));

var SignatureHelpTriggerReason;
exports.SignatureHelpTriggerReason = SignatureHelpTriggerReason;

(function (SignatureHelpTriggerReason) {
  SignatureHelpTriggerReason[SignatureHelpTriggerReason["Invoke"] = 1] = "Invoke";
  SignatureHelpTriggerReason[SignatureHelpTriggerReason["TriggerCharacter"] = 2] = "TriggerCharacter";
  SignatureHelpTriggerReason[SignatureHelpTriggerReason["ContentChange"] = 3] = "ContentChange";
})(SignatureHelpTriggerReason || (exports.SignatureHelpTriggerReason = SignatureHelpTriggerReason = {}));
/**
 * A document highlight kind.
 */


var DocumentHighlightKind;
exports.DocumentHighlightKind = DocumentHighlightKind;

(function (DocumentHighlightKind) {
  /**
   * A textual occurrence.
   */
  DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
  /**
   * Read-access of a symbol, like reading a variable.
   */

  DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
  /**
   * Write-access of a symbol, like writing to a variable.
   */

  DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
})(DocumentHighlightKind || (exports.DocumentHighlightKind = DocumentHighlightKind = {}));
/**
 * A symbol kind.
 */


var SymbolKind;
exports.SymbolKind = SymbolKind;

(function (SymbolKind) {
  SymbolKind[SymbolKind["File"] = 0] = "File";
  SymbolKind[SymbolKind["Module"] = 1] = "Module";
  SymbolKind[SymbolKind["Namespace"] = 2] = "Namespace";
  SymbolKind[SymbolKind["Package"] = 3] = "Package";
  SymbolKind[SymbolKind["Class"] = 4] = "Class";
  SymbolKind[SymbolKind["Method"] = 5] = "Method";
  SymbolKind[SymbolKind["Property"] = 6] = "Property";
  SymbolKind[SymbolKind["Field"] = 7] = "Field";
  SymbolKind[SymbolKind["Constructor"] = 8] = "Constructor";
  SymbolKind[SymbolKind["Enum"] = 9] = "Enum";
  SymbolKind[SymbolKind["Interface"] = 10] = "Interface";
  SymbolKind[SymbolKind["Function"] = 11] = "Function";
  SymbolKind[SymbolKind["Variable"] = 12] = "Variable";
  SymbolKind[SymbolKind["Constant"] = 13] = "Constant";
  SymbolKind[SymbolKind["String"] = 14] = "String";
  SymbolKind[SymbolKind["Number"] = 15] = "Number";
  SymbolKind[SymbolKind["Boolean"] = 16] = "Boolean";
  SymbolKind[SymbolKind["Array"] = 17] = "Array";
  SymbolKind[SymbolKind["Object"] = 18] = "Object";
  SymbolKind[SymbolKind["Key"] = 19] = "Key";
  SymbolKind[SymbolKind["Null"] = 20] = "Null";
  SymbolKind[SymbolKind["EnumMember"] = 21] = "EnumMember";
  SymbolKind[SymbolKind["Struct"] = 22] = "Struct";
  SymbolKind[SymbolKind["Event"] = 23] = "Event";
  SymbolKind[SymbolKind["Operator"] = 24] = "Operator";
  SymbolKind[SymbolKind["TypeParameter"] = 25] = "TypeParameter";
})(SymbolKind || (exports.SymbolKind = SymbolKind = {}));
},{}],"node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneBase.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonacoBaseAPI = createMonacoBaseAPI;
exports.KeyMod = void 0;

var _cancellation = require("../../../base/common/cancellation.js");

var _event = require("../../../base/common/event.js");

var _keyCodes = require("../../../base/common/keyCodes.js");

var _uri = require("../../../base/common/uri.js");

var _winjsBase = require("../../../base/common/winjs.base.js");

var _position = require("../core/position.js");

var _range = require("../core/range.js");

var _selection = require("../core/selection.js");

var _token = require("../core/token.js");

var standaloneEnums = _interopRequireWildcard(require("./standaloneEnums.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var KeyMod =
/** @class */
function () {
  function KeyMod() {}

  KeyMod.chord = function (firstPart, secondPart) {
    return (0, _keyCodes.KeyChord)(firstPart, secondPart);
  };

  KeyMod.CtrlCmd = 2048
  /* CtrlCmd */
  ;
  KeyMod.Shift = 1024
  /* Shift */
  ;
  KeyMod.Alt = 512
  /* Alt */
  ;
  KeyMod.WinCtrl = 256
  /* WinCtrl */
  ;
  return KeyMod;
}();

exports.KeyMod = KeyMod;

function createMonacoBaseAPI() {
  return {
    editor: undefined,
    languages: undefined,
    CancellationTokenSource: _cancellation.CancellationTokenSource,
    Emitter: _event.Emitter,
    KeyCode: standaloneEnums.KeyCode,
    KeyMod: KeyMod,
    Position: _position.Position,
    Range: _range.Range,
    Selection: _selection.Selection,
    SelectionDirection: standaloneEnums.SelectionDirection,
    MarkerSeverity: standaloneEnums.MarkerSeverity,
    MarkerTag: standaloneEnums.MarkerTag,
    Promise: _winjsBase.TPromise,
    Uri: _uri.URI,
    Token: _token.Token
  };
}
},{"../../../base/common/cancellation.js":"node_modules/monaco-editor/esm/vs/base/common/cancellation.js","../../../base/common/event.js":"node_modules/monaco-editor/esm/vs/base/common/event.js","../../../base/common/keyCodes.js":"node_modules/monaco-editor/esm/vs/base/common/keyCodes.js","../../../base/common/uri.js":"node_modules/monaco-editor/esm/vs/base/common/uri.js","../../../base/common/winjs.base.js":"node_modules/monaco-editor/esm/vs/base/common/winjs.base.js","../core/position.js":"node_modules/monaco-editor/esm/vs/editor/common/core/position.js","../core/range.js":"node_modules/monaco-editor/esm/vs/editor/common/core/range.js","../core/selection.js":"node_modules/monaco-editor/esm/vs/editor/common/core/selection.js","../core/token.js":"node_modules/monaco-editor/esm/vs/editor/common/core/token.js","./standaloneEnums.js":"node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneEnums.js"}],"node_modules/monaco-editor/esm/vs/editor/common/services/editorSimpleWorker.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.EditorSimpleWorkerImpl = exports.BaseEditorSimpleWorker = void 0;

var _arrays = require("../../../base/common/arrays.js");

var _diff = require("../../../base/common/diff/diff.js");

var _iterator = require("../../../base/common/iterator.js");

var _platform = require("../../../base/common/platform.js");

var _uri = require("../../../base/common/uri.js");

var _position = require("../core/position.js");

var _range = require("../core/range.js");

var _diffComputer = require("../diff/diffComputer.js");

var _mirrorTextModel = require("../model/mirrorTextModel.js");

var _wordHelper = require("../model/wordHelper.js");

var _linkComputer = require("../modes/linkComputer.js");

var _inplaceReplaceSupport = require("../modes/supports/inplaceReplaceSupport.js");

var _standaloneBase = require("../standalone/standaloneBase.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

/**
 * @internal
 */
var MirrorModel =
/** @class */
function (_super) {
  __extends(MirrorModel, _super);

  function MirrorModel() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(MirrorModel.prototype, "uri", {
    get: function () {
      return this._uri;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(MirrorModel.prototype, "version", {
    get: function () {
      return this._versionId;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(MirrorModel.prototype, "eol", {
    get: function () {
      return this._eol;
    },
    enumerable: true,
    configurable: true
  });

  MirrorModel.prototype.getValue = function () {
    return this.getText();
  };

  MirrorModel.prototype.getLinesContent = function () {
    return this._lines.slice(0);
  };

  MirrorModel.prototype.getLineCount = function () {
    return this._lines.length;
  };

  MirrorModel.prototype.getLineContent = function (lineNumber) {
    return this._lines[lineNumber - 1];
  };

  MirrorModel.prototype.getWordAtPosition = function (position, wordDefinition) {
    var wordAtText = (0, _wordHelper.getWordAtText)(position.column, (0, _wordHelper.ensureValidWordDefinition)(wordDefinition), this._lines[position.lineNumber - 1], 0);

    if (wordAtText) {
      return new _range.Range(position.lineNumber, wordAtText.startColumn, position.lineNumber, wordAtText.endColumn);
    }

    return null;
  };

  MirrorModel.prototype.getWordUntilPosition = function (position, wordDefinition) {
    var wordAtPosition = this.getWordAtPosition(position, wordDefinition);

    if (!wordAtPosition) {
      return {
        word: '',
        startColumn: position.column,
        endColumn: position.column
      };
    }

    return {
      word: this._lines[position.lineNumber - 1].substring(wordAtPosition.startColumn - 1, position.column - 1),
      startColumn: wordAtPosition.startColumn,
      endColumn: position.column
    };
  };

  MirrorModel.prototype.createWordIterator = function (wordDefinition) {
    var _this = this;

    var obj;
    var lineNumber = 0;
    var lineText;
    var wordRangesIdx = 0;
    var wordRanges = [];

    var next = function () {
      if (wordRangesIdx < wordRanges.length) {
        var value = lineText.substring(wordRanges[wordRangesIdx].start, wordRanges[wordRangesIdx].end);
        wordRangesIdx += 1;

        if (!obj) {
          obj = {
            done: false,
            value: value
          };
        } else {
          obj.value = value;
        }

        return obj;
      } else if (lineNumber >= _this._lines.length) {
        return _iterator.FIN;
      } else {
        lineText = _this._lines[lineNumber];
        wordRanges = _this._wordenize(lineText, wordDefinition);
        wordRangesIdx = 0;
        lineNumber += 1;
        return next();
      }
    };

    return {
      next: next
    };
  };

  MirrorModel.prototype.getLineWords = function (lineNumber, wordDefinition) {
    var content = this._lines[lineNumber - 1];

    var ranges = this._wordenize(content, wordDefinition);

    var words = [];

    for (var _i = 0, ranges_1 = ranges; _i < ranges_1.length; _i++) {
      var range = ranges_1[_i];
      words.push({
        word: content.substring(range.start, range.end),
        startColumn: range.start + 1,
        endColumn: range.end + 1
      });
    }

    return words;
  };

  MirrorModel.prototype._wordenize = function (content, wordDefinition) {
    var result = [];
    var match;
    wordDefinition.lastIndex = 0; // reset lastIndex just to be sure

    while (match = wordDefinition.exec(content)) {
      if (match[0].length === 0) {
        // it did match the empty string
        break;
      }

      result.push({
        start: match.index,
        end: match.index + match[0].length
      });
    }

    return result;
  };

  MirrorModel.prototype.getValueInRange = function (range) {
    range = this._validateRange(range);

    if (range.startLineNumber === range.endLineNumber) {
      return this._lines[range.startLineNumber - 1].substring(range.startColumn - 1, range.endColumn - 1);
    }

    var lineEnding = this._eol;
    var startLineIndex = range.startLineNumber - 1;
    var endLineIndex = range.endLineNumber - 1;
    var resultLines = [];
    resultLines.push(this._lines[startLineIndex].substring(range.startColumn - 1));

    for (var i = startLineIndex + 1; i < endLineIndex; i++) {
      resultLines.push(this._lines[i]);
    }

    resultLines.push(this._lines[endLineIndex].substring(0, range.endColumn - 1));
    return resultLines.join(lineEnding);
  };

  MirrorModel.prototype.offsetAt = function (position) {
    position = this._validatePosition(position);

    this._ensureLineStarts();

    return this._lineStarts.getAccumulatedValue(position.lineNumber - 2) + (position.column - 1);
  };

  MirrorModel.prototype.positionAt = function (offset) {
    offset = Math.floor(offset);
    offset = Math.max(0, offset);

    this._ensureLineStarts();

    var out = this._lineStarts.getIndexOf(offset);

    var lineLength = this._lines[out.index].length; // Ensure we return a valid position

    return {
      lineNumber: 1 + out.index,
      column: 1 + Math.min(out.remainder, lineLength)
    };
  };

  MirrorModel.prototype._validateRange = function (range) {
    var start = this._validatePosition({
      lineNumber: range.startLineNumber,
      column: range.startColumn
    });

    var end = this._validatePosition({
      lineNumber: range.endLineNumber,
      column: range.endColumn
    });

    if (start.lineNumber !== range.startLineNumber || start.column !== range.startColumn || end.lineNumber !== range.endLineNumber || end.column !== range.endColumn) {
      return {
        startLineNumber: start.lineNumber,
        startColumn: start.column,
        endLineNumber: end.lineNumber,
        endColumn: end.column
      };
    }

    return range;
  };

  MirrorModel.prototype._validatePosition = function (position) {
    if (!_position.Position.isIPosition(position)) {
      throw new Error('bad position');
    }

    var lineNumber = position.lineNumber,
        column = position.column;
    var hasChanged = false;

    if (lineNumber < 1) {
      lineNumber = 1;
      column = 1;
      hasChanged = true;
    } else if (lineNumber > this._lines.length) {
      lineNumber = this._lines.length;
      column = this._lines[lineNumber - 1].length + 1;
      hasChanged = true;
    } else {
      var maxCharacter = this._lines[lineNumber - 1].length + 1;

      if (column < 1) {
        column = 1;
        hasChanged = true;
      } else if (column > maxCharacter) {
        column = maxCharacter;
        hasChanged = true;
      }
    }

    if (!hasChanged) {
      return position;
    } else {
      return {
        lineNumber: lineNumber,
        column: column
      };
    }
  };

  return MirrorModel;
}(_mirrorTextModel.MirrorTextModel);
/**
 * @internal
 */


var BaseEditorSimpleWorker =
/** @class */
function () {
  function BaseEditorSimpleWorker(foreignModuleFactory) {
    this._foreignModuleFactory = foreignModuleFactory;
    this._foreignModule = null;
  } // ---- BEGIN diff --------------------------------------------------------------------------


  BaseEditorSimpleWorker.prototype.computeDiff = function (originalUrl, modifiedUrl, ignoreTrimWhitespace) {
    var original = this._getModel(originalUrl);

    var modified = this._getModel(modifiedUrl);

    if (!original || !modified) {
      return Promise.resolve(null);
    }

    var originalLines = original.getLinesContent();
    var modifiedLines = modified.getLinesContent();
    var diffComputer = new _diffComputer.DiffComputer(originalLines, modifiedLines, {
      shouldComputeCharChanges: true,
      shouldPostProcessCharChanges: true,
      shouldIgnoreTrimWhitespace: ignoreTrimWhitespace,
      shouldMakePrettyDiff: true
    });
    var changes = diffComputer.computeDiff();
    var identical = changes.length > 0 ? false : this._modelsAreIdentical(original, modified);
    return Promise.resolve({
      identical: identical,
      changes: changes
    });
  };

  BaseEditorSimpleWorker.prototype._modelsAreIdentical = function (original, modified) {
    var originalLineCount = original.getLineCount();
    var modifiedLineCount = modified.getLineCount();

    if (originalLineCount !== modifiedLineCount) {
      return false;
    }

    for (var line = 1; line <= originalLineCount; line++) {
      var originalLine = original.getLineContent(line);
      var modifiedLine = modified.getLineContent(line);

      if (originalLine !== modifiedLine) {
        return false;
      }
    }

    return true;
  };

  BaseEditorSimpleWorker.prototype.computeMoreMinimalEdits = function (modelUrl, edits) {
    var model = this._getModel(modelUrl);

    if (!model) {
      return Promise.resolve(edits);
    }

    var result = [];
    var lastEol = undefined;
    edits = (0, _arrays.mergeSort)(edits, function (a, b) {
      if (a.range && b.range) {
        return _range.Range.compareRangesUsingStarts(a.range, b.range);
      } // eol only changes should go to the end


      var aRng = a.range ? 0 : 1;
      var bRng = b.range ? 0 : 1;
      return aRng - bRng;
    });

    for (var _i = 0, edits_1 = edits; _i < edits_1.length; _i++) {
      var _a = edits_1[_i],
          range = _a.range,
          text = _a.text,
          eol = _a.eol;

      if (typeof eol === 'number') {
        lastEol = eol;
      }

      if (!range) {
        // eol-change only
        continue;
      }

      var original = model.getValueInRange(range);
      text = text.replace(/\r\n|\n|\r/g, model.eol);

      if (original === text) {
        // noop
        continue;
      } // make sure diff won't take too long


      if (Math.max(text.length, original.length) > BaseEditorSimpleWorker._diffLimit) {
        result.push({
          range: range,
          text: text
        });
        continue;
      } // compute diff between original and edit.text


      var changes = (0, _diff.stringDiff)(original, text, false);
      var editOffset = model.offsetAt(_range.Range.lift(range).getStartPosition());

      for (var _b = 0, changes_1 = changes; _b < changes_1.length; _b++) {
        var change = changes_1[_b];
        var start = model.positionAt(editOffset + change.originalStart);
        var end = model.positionAt(editOffset + change.originalStart + change.originalLength);
        var newEdit = {
          text: text.substr(change.modifiedStart, change.modifiedLength),
          range: {
            startLineNumber: start.lineNumber,
            startColumn: start.column,
            endLineNumber: end.lineNumber,
            endColumn: end.column
          }
        };

        if (model.getValueInRange(newEdit.range) !== newEdit.text) {
          result.push(newEdit);
        }
      }
    }

    if (typeof lastEol === 'number') {
      result.push({
        eol: lastEol,
        text: undefined,
        range: undefined
      });
    }

    return Promise.resolve(result);
  }; // ---- END minimal edits ---------------------------------------------------------------


  BaseEditorSimpleWorker.prototype.computeLinks = function (modelUrl) {
    var model = this._getModel(modelUrl);

    if (!model) {
      return Promise.resolve(null);
    }

    return Promise.resolve((0, _linkComputer.computeLinks)(model));
  };

  BaseEditorSimpleWorker.prototype.textualSuggest = function (modelUrl, position, wordDef, wordDefFlags) {
    var model = this._getModel(modelUrl);

    if (!model) {
      return Promise.resolve(null);
    }

    var suggestions = [];
    var wordDefRegExp = new RegExp(wordDef, wordDefFlags);
    var currentWord = model.getWordUntilPosition(position, wordDefRegExp);
    var seen = Object.create(null);
    seen[currentWord.word] = true;

    for (var iter = model.createWordIterator(wordDefRegExp), e = iter.next(); !e.done && suggestions.length <= BaseEditorSimpleWorker._suggestionsLimit; e = iter.next()) {
      var word = e.value;

      if (seen[word]) {
        continue;
      }

      seen[word] = true;

      if (!isNaN(Number(word))) {
        continue;
      }

      suggestions.push({
        kind: 18
        /* Text */
        ,
        label: word,
        insertText: word,
        range: {
          startLineNumber: position.lineNumber,
          startColumn: currentWord.startColumn,
          endLineNumber: position.lineNumber,
          endColumn: currentWord.endColumn
        }
      });
    }

    return Promise.resolve({
      suggestions: suggestions
    });
  }; // ---- END suggest --------------------------------------------------------------------------
  //#region -- word ranges --


  BaseEditorSimpleWorker.prototype.computeWordRanges = function (modelUrl, range, wordDef, wordDefFlags) {
    var model = this._getModel(modelUrl);

    if (!model) {
      return Promise.resolve(Object.create(null));
    }

    var wordDefRegExp = new RegExp(wordDef, wordDefFlags);
    var result = Object.create(null);

    for (var line = range.startLineNumber; line < range.endLineNumber; line++) {
      var words = model.getLineWords(line, wordDefRegExp);

      for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];

        if (!isNaN(Number(word.word))) {
          continue;
        }

        var array = result[word.word];

        if (!array) {
          array = [];
          result[word.word] = array;
        }

        array.push({
          startLineNumber: line,
          startColumn: word.startColumn,
          endLineNumber: line,
          endColumn: word.endColumn
        });
      }
    }

    return Promise.resolve(result);
  }; //#endregion


  BaseEditorSimpleWorker.prototype.navigateValueSet = function (modelUrl, range, up, wordDef, wordDefFlags) {
    var model = this._getModel(modelUrl);

    if (!model) {
      return Promise.resolve(null);
    }

    var wordDefRegExp = new RegExp(wordDef, wordDefFlags);

    if (range.startColumn === range.endColumn) {
      range = {
        startLineNumber: range.startLineNumber,
        startColumn: range.startColumn,
        endLineNumber: range.endLineNumber,
        endColumn: range.endColumn + 1
      };
    }

    var selectionText = model.getValueInRange(range);
    var wordRange = model.getWordAtPosition({
      lineNumber: range.startLineNumber,
      column: range.startColumn
    }, wordDefRegExp);

    if (!wordRange) {
      return Promise.resolve(null);
    }

    var word = model.getValueInRange(wordRange);

    var result = _inplaceReplaceSupport.BasicInplaceReplace.INSTANCE.navigateValueSet(range, selectionText, wordRange, word, up);

    return Promise.resolve(result);
  }; // ---- BEGIN foreign module support --------------------------------------------------------------------------


  BaseEditorSimpleWorker.prototype.loadForeignModule = function (moduleId, createData) {
    var _this = this;

    var ctx = {
      getMirrorModels: function () {
        return _this._getModels();
      }
    };

    if (this._foreignModuleFactory) {
      this._foreignModule = this._foreignModuleFactory(ctx, createData); // static foreing module

      var methods = [];

      for (var prop in this._foreignModule) {
        if (typeof this._foreignModule[prop] === 'function') {
          methods.push(prop);
        }
      }

      return Promise.resolve(methods);
    } // ESM-comment-begin
    // 		return new Promise<any>((resolve, reject) => {
    // 			require([moduleId], (foreignModule: { create: IForeignModuleFactory }) => {
    // 				this._foreignModule = foreignModule.create(ctx, createData);
    // 
    // 				let methods: string[] = [];
    // 				for (let prop in this._foreignModule) {
    // 					if (typeof this._foreignModule[prop] === 'function') {
    // 						methods.push(prop);
    // 					}
    // 				}
    // 
    // 				resolve(methods);
    // 
    // 			}, reject);
    // 		});
    // ESM-comment-end
    // ESM-uncomment-begin


    return Promise.reject(new Error("Unexpected usage")); // ESM-uncomment-end
  }; // foreign method request


  BaseEditorSimpleWorker.prototype.fmr = function (method, args) {
    if (!this._foreignModule || typeof this._foreignModule[method] !== 'function') {
      return Promise.reject(new Error('Missing requestHandler or method: ' + method));
    }

    try {
      return Promise.resolve(this._foreignModule[method].apply(this._foreignModule, args));
    } catch (e) {
      return Promise.reject(e);
    }
  }; // ---- END diff --------------------------------------------------------------------------
  // ---- BEGIN minimal edits ---------------------------------------------------------------


  BaseEditorSimpleWorker._diffLimit = 10000; // ---- BEGIN suggest --------------------------------------------------------------------------

  BaseEditorSimpleWorker._suggestionsLimit = 10000;
  return BaseEditorSimpleWorker;
}();

exports.BaseEditorSimpleWorker = BaseEditorSimpleWorker;

/**
 * @internal
 */
var EditorSimpleWorkerImpl =
/** @class */
function (_super) {
  __extends(EditorSimpleWorkerImpl, _super);

  function EditorSimpleWorkerImpl(foreignModuleFactory) {
    var _this = _super.call(this, foreignModuleFactory) || this;

    _this._models = Object.create(null);
    return _this;
  }

  EditorSimpleWorkerImpl.prototype.dispose = function () {
    this._models = Object.create(null);
  };

  EditorSimpleWorkerImpl.prototype._getModel = function (uri) {
    return this._models[uri];
  };

  EditorSimpleWorkerImpl.prototype._getModels = function () {
    var _this = this;

    var all = [];
    Object.keys(this._models).forEach(function (key) {
      return all.push(_this._models[key]);
    });
    return all;
  };

  EditorSimpleWorkerImpl.prototype.acceptNewModel = function (data) {
    this._models[data.url] = new MirrorModel(_uri.URI.parse(data.url), data.lines, data.EOL, data.versionId);
  };

  EditorSimpleWorkerImpl.prototype.acceptModelChanged = function (strURL, e) {
    if (!this._models[strURL]) {
      return;
    }

    var model = this._models[strURL];
    model.onEvents(e);
  };

  EditorSimpleWorkerImpl.prototype.acceptRemovedModel = function (strURL) {
    if (!this._models[strURL]) {
      return;
    }

    delete this._models[strURL];
  };

  return EditorSimpleWorkerImpl;
}(BaseEditorSimpleWorker);

exports.EditorSimpleWorkerImpl = EditorSimpleWorkerImpl;

/**
 * Called on the worker side
 * @internal
 */
function create() {
  return new EditorSimpleWorkerImpl(null);
}

if (typeof importScripts === 'function') {
  // Running in a web worker
  _platform.globals.monaco = (0, _standaloneBase.createMonacoBaseAPI)();
}
},{"../../../base/common/arrays.js":"node_modules/monaco-editor/esm/vs/base/common/arrays.js","../../../base/common/diff/diff.js":"node_modules/monaco-editor/esm/vs/base/common/diff/diff.js","../../../base/common/iterator.js":"node_modules/monaco-editor/esm/vs/base/common/iterator.js","../../../base/common/platform.js":"node_modules/monaco-editor/esm/vs/base/common/platform.js","../../../base/common/uri.js":"node_modules/monaco-editor/esm/vs/base/common/uri.js","../core/position.js":"node_modules/monaco-editor/esm/vs/editor/common/core/position.js","../core/range.js":"node_modules/monaco-editor/esm/vs/editor/common/core/range.js","../diff/diffComputer.js":"node_modules/monaco-editor/esm/vs/editor/common/diff/diffComputer.js","../model/mirrorTextModel.js":"node_modules/monaco-editor/esm/vs/editor/common/model/mirrorTextModel.js","../model/wordHelper.js":"node_modules/monaco-editor/esm/vs/editor/common/model/wordHelper.js","../modes/linkComputer.js":"node_modules/monaco-editor/esm/vs/editor/common/modes/linkComputer.js","../modes/supports/inplaceReplaceSupport.js":"node_modules/monaco-editor/esm/vs/editor/common/modes/supports/inplaceReplaceSupport.js","../standalone/standaloneBase.js":"node_modules/monaco-editor/esm/vs/editor/common/standalone/standaloneBase.js"}],"node_modules/monaco-editor/esm/vs/editor/editor.worker.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialize = initialize;

var _simpleWorker = require("../base/common/worker/simpleWorker.js");

var _editorSimpleWorker = require("./common/services/editorSimpleWorker.js");

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var initialized = false;

function initialize(foreignModule) {
  if (initialized) {
    return;
  }

  initialized = true;
  var editorWorker = new _editorSimpleWorker.EditorSimpleWorkerImpl(foreignModule);
  var simpleWorker = new _simpleWorker.SimpleWorkerServer(function (msg) {
    self.postMessage(msg);
  }, editorWorker);

  self.onmessage = function (e) {
    simpleWorker.onmessage(e.data);
  };
}

self.onmessage = function (e) {
  // Ignore first message in this case and initialize if not yet initialized
  if (!initialized) {
    initialize(null);
  }
};
},{"../base/common/worker/simpleWorker.js":"node_modules/monaco-editor/esm/vs/base/common/worker/simpleWorker.js","./common/services/editorSimpleWorker.js":"node_modules/monaco-editor/esm/vs/editor/common/services/editorSimpleWorker.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-languageserver-types/main.js":[function(require,module,exports) {
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
/**
 * The Position namespace provides helper functions to work with
 * [Position](#Position) literals.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextDocumentSaveReason = exports.TextDocument = exports.EOL = exports.DocumentLink = exports.FormattingOptions = exports.CodeLens = exports.CodeAction = exports.CodeActionContext = exports.CodeActionKind = exports.DocumentSymbol = exports.SymbolInformation = exports.SymbolKind = exports.DocumentHighlight = exports.DocumentHighlightKind = exports.SignatureInformation = exports.ParameterInformation = exports.Hover = exports.MarkedString = exports.CompletionList = exports.CompletionItem = exports.InsertTextFormat = exports.CompletionItemKind = exports.MarkupContent = exports.MarkupKind = exports.TextDocumentItem = exports.VersionedTextDocumentIdentifier = exports.TextDocumentIdentifier = exports.WorkspaceChange = exports.WorkspaceEdit = exports.TextDocumentEdit = exports.TextEdit = exports.Command = exports.Diagnostic = exports.DiagnosticSeverity = exports.DiagnosticRelatedInformation = exports.FoldingRange = exports.FoldingRangeKind = exports.ColorPresentation = exports.ColorInformation = exports.Color = exports.Location = exports.Range = exports.Position = void 0;
var Position;
exports.Position = Position;

(function (Position) {
  /**
   * Creates a new Position literal from the given line and character.
   * @param line The position's line.
   * @param character The position's character.
   */
  function create(line, character) {
    return {
      line: line,
      character: character
    };
  }

  Position.create = create;
  /**
   * Checks whether the given liternal conforms to the [Position](#Position) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.objectLiteral(candidate) && Is.number(candidate.line) && Is.number(candidate.character);
  }

  Position.is = is;
})(Position || (exports.Position = Position = {}));
/**
 * The Range namespace provides helper functions to work with
 * [Range](#Range) literals.
 */


var Range;
exports.Range = Range;

(function (Range) {
  function create(one, two, three, four) {
    if (Is.number(one) && Is.number(two) && Is.number(three) && Is.number(four)) {
      return {
        start: Position.create(one, two),
        end: Position.create(three, four)
      };
    } else if (Position.is(one) && Position.is(two)) {
      return {
        start: one,
        end: two
      };
    } else {
      throw new Error("Range#create called with invalid arguments[" + one + ", " + two + ", " + three + ", " + four + "]");
    }
  }

  Range.create = create;
  /**
   * Checks whether the given literal conforms to the [Range](#Range) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.objectLiteral(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
  }

  Range.is = is;
})(Range || (exports.Range = Range = {}));
/**
 * The Location namespace provides helper functions to work with
 * [Location](#Location) literals.
 */


var Location;
exports.Location = Location;

(function (Location) {
  /**
   * Creates a Location literal.
   * @param uri The location's uri.
   * @param range The location's range.
   */
  function create(uri, range) {
    return {
      uri: uri,
      range: range
    };
  }

  Location.create = create;
  /**
   * Checks whether the given literal conforms to the [Location](#Location) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Range.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
  }

  Location.is = is;
})(Location || (exports.Location = Location = {}));
/**
 * The Color namespace provides helper functions to work with
 * [Color](#Color) literals.
 */


var Color;
exports.Color = Color;

(function (Color) {
  /**
   * Creates a new Color literal.
   */
  function create(red, green, blue, alpha) {
    return {
      red: red,
      green: green,
      blue: blue,
      alpha: alpha
    };
  }

  Color.create = create;
  /**
   * Checks whether the given literal conforms to the [Color](#Color) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.number(candidate.red) && Is.number(candidate.green) && Is.number(candidate.blue) && Is.number(candidate.alpha);
  }

  Color.is = is;
})(Color || (exports.Color = Color = {}));
/**
 * The ColorInformation namespace provides helper functions to work with
 * [ColorInformation](#ColorInformation) literals.
 */


var ColorInformation;
exports.ColorInformation = ColorInformation;

(function (ColorInformation) {
  /**
   * Creates a new ColorInformation literal.
   */
  function create(range, color) {
    return {
      range: range,
      color: color
    };
  }

  ColorInformation.create = create;
  /**
   * Checks whether the given literal conforms to the [ColorInformation](#ColorInformation) interface.
   */

  function is(value) {
    var candidate = value;
    return Range.is(candidate.range) && Color.is(candidate.color);
  }

  ColorInformation.is = is;
})(ColorInformation || (exports.ColorInformation = ColorInformation = {}));
/**
 * The Color namespace provides helper functions to work with
 * [ColorPresentation](#ColorPresentation) literals.
 */


var ColorPresentation;
exports.ColorPresentation = ColorPresentation;

(function (ColorPresentation) {
  /**
   * Creates a new ColorInformation literal.
   */
  function create(label, textEdit, additionalTextEdits) {
    return {
      label: label,
      textEdit: textEdit,
      additionalTextEdits: additionalTextEdits
    };
  }

  ColorPresentation.create = create;
  /**
   * Checks whether the given literal conforms to the [ColorInformation](#ColorInformation) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.string(candidate.label) && (Is.undefined(candidate.textEdit) || TextEdit.is(candidate)) && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit.is));
  }

  ColorPresentation.is = is;
})(ColorPresentation || (exports.ColorPresentation = ColorPresentation = {}));
/**
 * Enum of known range kinds
 */


var FoldingRangeKind;
exports.FoldingRangeKind = FoldingRangeKind;

(function (FoldingRangeKind) {
  /**
   * Folding range for a comment
   */
  FoldingRangeKind["Comment"] = "comment";
  /**
   * Folding range for a imports or includes
   */

  FoldingRangeKind["Imports"] = "imports";
  /**
   * Folding range for a region (e.g. `#region`)
   */

  FoldingRangeKind["Region"] = "region";
})(FoldingRangeKind || (exports.FoldingRangeKind = FoldingRangeKind = {}));
/**
 * The folding range namespace provides helper functions to work with
 * [FoldingRange](#FoldingRange) literals.
 */


var FoldingRange;
exports.FoldingRange = FoldingRange;

(function (FoldingRange) {
  /**
   * Creates a new FoldingRange literal.
   */
  function create(startLine, endLine, startCharacter, endCharacter, kind) {
    var result = {
      startLine: startLine,
      endLine: endLine
    };

    if (Is.defined(startCharacter)) {
      result.startCharacter = startCharacter;
    }

    if (Is.defined(endCharacter)) {
      result.endCharacter = endCharacter;
    }

    if (Is.defined(kind)) {
      result.kind = kind;
    }

    return result;
  }

  FoldingRange.create = create;
  /**
   * Checks whether the given literal conforms to the [FoldingRange](#FoldingRange) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.number(candidate.startLine) && Is.number(candidate.startLine) && (Is.undefined(candidate.startCharacter) || Is.number(candidate.startCharacter)) && (Is.undefined(candidate.endCharacter) || Is.number(candidate.endCharacter)) && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
  }

  FoldingRange.is = is;
})(FoldingRange || (exports.FoldingRange = FoldingRange = {}));
/**
 * The DiagnosticRelatedInformation namespace provides helper functions to work with
 * [DiagnosticRelatedInformation](#DiagnosticRelatedInformation) literals.
 */


var DiagnosticRelatedInformation;
exports.DiagnosticRelatedInformation = DiagnosticRelatedInformation;

(function (DiagnosticRelatedInformation) {
  /**
   * Creates a new DiagnosticRelatedInformation literal.
   */
  function create(location, message) {
    return {
      location: location,
      message: message
    };
  }

  DiagnosticRelatedInformation.create = create;
  /**
   * Checks whether the given literal conforms to the [DiagnosticRelatedInformation](#DiagnosticRelatedInformation) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
  }

  DiagnosticRelatedInformation.is = is;
})(DiagnosticRelatedInformation || (exports.DiagnosticRelatedInformation = DiagnosticRelatedInformation = {}));
/**
 * The diagnostic's severity.
 */


var DiagnosticSeverity;
exports.DiagnosticSeverity = DiagnosticSeverity;

(function (DiagnosticSeverity) {
  /**
   * Reports an error.
   */
  DiagnosticSeverity.Error = 1;
  /**
   * Reports a warning.
   */

  DiagnosticSeverity.Warning = 2;
  /**
   * Reports an information.
   */

  DiagnosticSeverity.Information = 3;
  /**
   * Reports a hint.
   */

  DiagnosticSeverity.Hint = 4;
})(DiagnosticSeverity || (exports.DiagnosticSeverity = DiagnosticSeverity = {}));
/**
 * The Diagnostic namespace provides helper functions to work with
 * [Diagnostic](#Diagnostic) literals.
 */


var Diagnostic;
exports.Diagnostic = Diagnostic;

(function (Diagnostic) {
  /**
   * Creates a new Diagnostic literal.
   */
  function create(range, message, severity, code, source, relatedInformation) {
    var result = {
      range: range,
      message: message
    };

    if (Is.defined(severity)) {
      result.severity = severity;
    }

    if (Is.defined(code)) {
      result.code = code;
    }

    if (Is.defined(source)) {
      result.source = source;
    }

    if (Is.defined(relatedInformation)) {
      result.relatedInformation = relatedInformation;
    }

    return result;
  }

  Diagnostic.create = create;
  /**
   * Checks whether the given literal conforms to the [Diagnostic](#Diagnostic) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Range.is(candidate.range) && Is.string(candidate.message) && (Is.number(candidate.severity) || Is.undefined(candidate.severity)) && (Is.number(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code)) && (Is.string(candidate.source) || Is.undefined(candidate.source)) && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
  }

  Diagnostic.is = is;
})(Diagnostic || (exports.Diagnostic = Diagnostic = {}));
/**
 * The Command namespace provides helper functions to work with
 * [Command](#Command) literals.
 */


var Command;
exports.Command = Command;

(function (Command) {
  /**
   * Creates a new Command literal.
   */
  function create(title, command) {
    var args = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }

    var result = {
      title: title,
      command: command
    };

    if (Is.defined(args) && args.length > 0) {
      result.arguments = args;
    }

    return result;
  }

  Command.create = create;
  /**
   * Checks whether the given literal conforms to the [Command](#Command) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
  }

  Command.is = is;
})(Command || (exports.Command = Command = {}));
/**
 * The TextEdit namespace provides helper function to create replace,
 * insert and delete edits more easily.
 */


var TextEdit;
exports.TextEdit = TextEdit;

(function (TextEdit) {
  /**
   * Creates a replace text edit.
   * @param range The range of text to be replaced.
   * @param newText The new text.
   */
  function replace(range, newText) {
    return {
      range: range,
      newText: newText
    };
  }

  TextEdit.replace = replace;
  /**
   * Creates a insert text edit.
   * @param position The position to insert the text at.
   * @param newText The text to be inserted.
   */

  function insert(position, newText) {
    return {
      range: {
        start: position,
        end: position
      },
      newText: newText
    };
  }

  TextEdit.insert = insert;
  /**
   * Creates a delete text edit.
   * @param range The range of text to be deleted.
   */

  function del(range) {
    return {
      range: range,
      newText: ''
    };
  }

  TextEdit.del = del;

  function is(value) {
    var candidate = value;
    return Is.objectLiteral(candidate) && Is.string(candidate.newText) && Range.is(candidate.range);
  }

  TextEdit.is = is;
})(TextEdit || (exports.TextEdit = TextEdit = {}));
/**
 * The TextDocumentEdit namespace provides helper function to create
 * an edit that manipulates a text document.
 */


var TextDocumentEdit;
exports.TextDocumentEdit = TextDocumentEdit;

(function (TextDocumentEdit) {
  /**
   * Creates a new `TextDocumentEdit`
   */
  function create(textDocument, edits) {
    return {
      textDocument: textDocument,
      edits: edits
    };
  }

  TextDocumentEdit.create = create;

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && VersionedTextDocumentIdentifier.is(candidate.textDocument) && Array.isArray(candidate.edits);
  }

  TextDocumentEdit.is = is;
})(TextDocumentEdit || (exports.TextDocumentEdit = TextDocumentEdit = {}));

var WorkspaceEdit;
exports.WorkspaceEdit = WorkspaceEdit;

(function (WorkspaceEdit) {
  function is(value) {
    var candidate = value;
    return candidate && (candidate.changes !== void 0 || candidate.documentChanges !== void 0) && (candidate.documentChanges === void 0 || Is.typedArray(candidate.documentChanges, TextDocumentEdit.is));
  }

  WorkspaceEdit.is = is;
})(WorkspaceEdit || (exports.WorkspaceEdit = WorkspaceEdit = {}));

var TextEditChangeImpl =
/** @class */
function () {
  function TextEditChangeImpl(edits) {
    this.edits = edits;
  }

  TextEditChangeImpl.prototype.insert = function (position, newText) {
    this.edits.push(TextEdit.insert(position, newText));
  };

  TextEditChangeImpl.prototype.replace = function (range, newText) {
    this.edits.push(TextEdit.replace(range, newText));
  };

  TextEditChangeImpl.prototype.delete = function (range) {
    this.edits.push(TextEdit.del(range));
  };

  TextEditChangeImpl.prototype.add = function (edit) {
    this.edits.push(edit);
  };

  TextEditChangeImpl.prototype.all = function () {
    return this.edits;
  };

  TextEditChangeImpl.prototype.clear = function () {
    this.edits.splice(0, this.edits.length);
  };

  return TextEditChangeImpl;
}();
/**
 * A workspace change helps constructing changes to a workspace.
 */


var WorkspaceChange =
/** @class */
function () {
  function WorkspaceChange(workspaceEdit) {
    var _this = this;

    this._textEditChanges = Object.create(null);

    if (workspaceEdit) {
      this._workspaceEdit = workspaceEdit;

      if (workspaceEdit.documentChanges) {
        workspaceEdit.documentChanges.forEach(function (textDocumentEdit) {
          var textEditChange = new TextEditChangeImpl(textDocumentEdit.edits);
          _this._textEditChanges[textDocumentEdit.textDocument.uri] = textEditChange;
        });
      } else if (workspaceEdit.changes) {
        Object.keys(workspaceEdit.changes).forEach(function (key) {
          var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
          _this._textEditChanges[key] = textEditChange;
        });
      }
    }
  }

  Object.defineProperty(WorkspaceChange.prototype, "edit", {
    /**
     * Returns the underlying [WorkspaceEdit](#WorkspaceEdit) literal
     * use to be returned from a workspace edit operation like rename.
     */
    get: function () {
      return this._workspaceEdit;
    },
    enumerable: true,
    configurable: true
  });

  WorkspaceChange.prototype.getTextEditChange = function (key) {
    if (VersionedTextDocumentIdentifier.is(key)) {
      if (!this._workspaceEdit) {
        this._workspaceEdit = {
          documentChanges: []
        };
      }

      if (!this._workspaceEdit.documentChanges) {
        throw new Error('Workspace edit is not configured for versioned document changes.');
      }

      var textDocument = key;
      var result = this._textEditChanges[textDocument.uri];

      if (!result) {
        var edits = [];
        var textDocumentEdit = {
          textDocument: textDocument,
          edits: edits
        };

        this._workspaceEdit.documentChanges.push(textDocumentEdit);

        result = new TextEditChangeImpl(edits);
        this._textEditChanges[textDocument.uri] = result;
      }

      return result;
    } else {
      if (!this._workspaceEdit) {
        this._workspaceEdit = {
          changes: Object.create(null)
        };
      }

      if (!this._workspaceEdit.changes) {
        throw new Error('Workspace edit is not configured for normal text edit changes.');
      }

      var result = this._textEditChanges[key];

      if (!result) {
        var edits = [];
        this._workspaceEdit.changes[key] = edits;
        result = new TextEditChangeImpl(edits);
        this._textEditChanges[key] = result;
      }

      return result;
    }
  };

  return WorkspaceChange;
}();

exports.WorkspaceChange = WorkspaceChange;

/**
 * The TextDocumentIdentifier namespace provides helper functions to work with
 * [TextDocumentIdentifier](#TextDocumentIdentifier) literals.
 */
var TextDocumentIdentifier;
exports.TextDocumentIdentifier = TextDocumentIdentifier;

(function (TextDocumentIdentifier) {
  /**
   * Creates a new TextDocumentIdentifier literal.
   * @param uri The document's uri.
   */
  function create(uri) {
    return {
      uri: uri
    };
  }

  TextDocumentIdentifier.create = create;
  /**
   * Checks whether the given literal conforms to the [TextDocumentIdentifier](#TextDocumentIdentifier) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri);
  }

  TextDocumentIdentifier.is = is;
})(TextDocumentIdentifier || (exports.TextDocumentIdentifier = TextDocumentIdentifier = {}));
/**
 * The VersionedTextDocumentIdentifier namespace provides helper functions to work with
 * [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) literals.
 */


var VersionedTextDocumentIdentifier;
exports.VersionedTextDocumentIdentifier = VersionedTextDocumentIdentifier;

(function (VersionedTextDocumentIdentifier) {
  /**
   * Creates a new VersionedTextDocumentIdentifier literal.
   * @param uri The document's uri.
   * @param uri The document's text.
   */
  function create(uri, version) {
    return {
      uri: uri,
      version: version
    };
  }

  VersionedTextDocumentIdentifier.create = create;
  /**
   * Checks whether the given literal conforms to the [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && Is.number(candidate.version);
  }

  VersionedTextDocumentIdentifier.is = is;
})(VersionedTextDocumentIdentifier || (exports.VersionedTextDocumentIdentifier = VersionedTextDocumentIdentifier = {}));
/**
 * The TextDocumentItem namespace provides helper functions to work with
 * [TextDocumentItem](#TextDocumentItem) literals.
 */


var TextDocumentItem;
exports.TextDocumentItem = TextDocumentItem;

(function (TextDocumentItem) {
  /**
   * Creates a new TextDocumentItem literal.
   * @param uri The document's uri.
   * @param languageId The document's language identifier.
   * @param version The document's version number.
   * @param text The document's text.
   */
  function create(uri, languageId, version, text) {
    return {
      uri: uri,
      languageId: languageId,
      version: version,
      text: text
    };
  }

  TextDocumentItem.create = create;
  /**
   * Checks whether the given literal conforms to the [TextDocumentItem](#TextDocumentItem) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.number(candidate.version) && Is.string(candidate.text);
  }

  TextDocumentItem.is = is;
})(TextDocumentItem || (exports.TextDocumentItem = TextDocumentItem = {}));
/**
 * Describes the content type that a client supports in various
 * result literals like `Hover`, `ParameterInfo` or `CompletionItem`.
 *
 * Please note that `MarkupKinds` must not start with a `$`. This kinds
 * are reserved for internal usage.
 */


var MarkupKind;
exports.MarkupKind = MarkupKind;

(function (MarkupKind) {
  /**
   * Plain text is supported as a content format
   */
  MarkupKind.PlainText = 'plaintext';
  /**
   * Markdown is supported as a content format
   */

  MarkupKind.Markdown = 'markdown';
})(MarkupKind || (exports.MarkupKind = MarkupKind = {}));

(function (MarkupKind) {
  /**
   * Checks whether the given value is a value of the [MarkupKind](#MarkupKind) type.
   */
  function is(value) {
    var candidate = value;
    return candidate === MarkupKind.PlainText || candidate === MarkupKind.Markdown;
  }

  MarkupKind.is = is;
})(MarkupKind || (exports.MarkupKind = MarkupKind = {}));

var MarkupContent;
exports.MarkupContent = MarkupContent;

(function (MarkupContent) {
  /**
   * Checks whether the given value conforms to the [MarkupContent](#MarkupContent) interface.
   */
  function is(value) {
    var candidate = value;
    return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
  }

  MarkupContent.is = is;
})(MarkupContent || (exports.MarkupContent = MarkupContent = {}));
/**
 * The kind of a completion entry.
 */


var CompletionItemKind;
exports.CompletionItemKind = CompletionItemKind;

(function (CompletionItemKind) {
  CompletionItemKind.Text = 1;
  CompletionItemKind.Method = 2;
  CompletionItemKind.Function = 3;
  CompletionItemKind.Constructor = 4;
  CompletionItemKind.Field = 5;
  CompletionItemKind.Variable = 6;
  CompletionItemKind.Class = 7;
  CompletionItemKind.Interface = 8;
  CompletionItemKind.Module = 9;
  CompletionItemKind.Property = 10;
  CompletionItemKind.Unit = 11;
  CompletionItemKind.Value = 12;
  CompletionItemKind.Enum = 13;
  CompletionItemKind.Keyword = 14;
  CompletionItemKind.Snippet = 15;
  CompletionItemKind.Color = 16;
  CompletionItemKind.File = 17;
  CompletionItemKind.Reference = 18;
  CompletionItemKind.Folder = 19;
  CompletionItemKind.EnumMember = 20;
  CompletionItemKind.Constant = 21;
  CompletionItemKind.Struct = 22;
  CompletionItemKind.Event = 23;
  CompletionItemKind.Operator = 24;
  CompletionItemKind.TypeParameter = 25;
})(CompletionItemKind || (exports.CompletionItemKind = CompletionItemKind = {}));
/**
 * Defines whether the insert text in a completion item should be interpreted as
 * plain text or a snippet.
 */


var InsertTextFormat;
exports.InsertTextFormat = InsertTextFormat;

(function (InsertTextFormat) {
  /**
   * The primary text to be inserted is treated as a plain string.
   */
  InsertTextFormat.PlainText = 1;
  /**
   * The primary text to be inserted is treated as a snippet.
   *
   * A snippet can define tab stops and placeholders with `$1`, `$2`
   * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
   * the end of the snippet. Placeholders with equal identifiers are linked,
   * that is typing in one will update others too.
   *
   * See also: https://github.com/Microsoft/vscode/blob/master/src/vs/editor/contrib/snippet/common/snippet.md
   */

  InsertTextFormat.Snippet = 2;
})(InsertTextFormat || (exports.InsertTextFormat = InsertTextFormat = {}));
/**
 * The CompletionItem namespace provides functions to deal with
 * completion items.
 */


var CompletionItem;
exports.CompletionItem = CompletionItem;

(function (CompletionItem) {
  /**
   * Create a completion item and seed it with a label.
   * @param label The completion item's label
   */
  function create(label) {
    return {
      label: label
    };
  }

  CompletionItem.create = create;
})(CompletionItem || (exports.CompletionItem = CompletionItem = {}));
/**
 * The CompletionList namespace provides functions to deal with
 * completion lists.
 */


var CompletionList;
exports.CompletionList = CompletionList;

(function (CompletionList) {
  /**
   * Creates a new completion list.
   *
   * @param items The completion items.
   * @param isIncomplete The list is not complete.
   */
  function create(items, isIncomplete) {
    return {
      items: items ? items : [],
      isIncomplete: !!isIncomplete
    };
  }

  CompletionList.create = create;
})(CompletionList || (exports.CompletionList = CompletionList = {}));

var MarkedString;
exports.MarkedString = MarkedString;

(function (MarkedString) {
  /**
   * Creates a marked string from plain text.
   *
   * @param plainText The plain text.
   */
  function fromPlainText(plainText) {
    return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&"); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
  }

  MarkedString.fromPlainText = fromPlainText;
  /**
   * Checks whether the given value conforms to the [MarkedString](#MarkedString) type.
   */

  function is(value) {
    var candidate = value;
    return Is.string(candidate) || Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value);
  }

  MarkedString.is = is;
})(MarkedString || (exports.MarkedString = MarkedString = {}));

var Hover;
exports.Hover = Hover;

(function (Hover) {
  /**
   * Checks whether the given value conforms to the [Hover](#Hover) interface.
   */
  function is(value) {
    var candidate = value;
    return Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) || MarkedString.is(candidate.contents) || Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === void 0 || Range.is(value.range));
  }

  Hover.is = is;
})(Hover || (exports.Hover = Hover = {}));
/**
 * The ParameterInformation namespace provides helper functions to work with
 * [ParameterInformation](#ParameterInformation) literals.
 */


var ParameterInformation;
exports.ParameterInformation = ParameterInformation;

(function (ParameterInformation) {
  /**
   * Creates a new parameter information literal.
   *
   * @param label A label string.
   * @param documentation A doc string.
   */
  function create(label, documentation) {
    return documentation ? {
      label: label,
      documentation: documentation
    } : {
      label: label
    };
  }

  ParameterInformation.create = create;
  ;
})(ParameterInformation || (exports.ParameterInformation = ParameterInformation = {}));
/**
 * The SignatureInformation namespace provides helper functions to work with
 * [SignatureInformation](#SignatureInformation) literals.
 */


var SignatureInformation;
exports.SignatureInformation = SignatureInformation;

(function (SignatureInformation) {
  function create(label, documentation) {
    var parameters = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      parameters[_i - 2] = arguments[_i];
    }

    var result = {
      label: label
    };

    if (Is.defined(documentation)) {
      result.documentation = documentation;
    }

    if (Is.defined(parameters)) {
      result.parameters = parameters;
    } else {
      result.parameters = [];
    }

    return result;
  }

  SignatureInformation.create = create;
})(SignatureInformation || (exports.SignatureInformation = SignatureInformation = {}));
/**
 * A document highlight kind.
 */


var DocumentHighlightKind;
exports.DocumentHighlightKind = DocumentHighlightKind;

(function (DocumentHighlightKind) {
  /**
   * A textual occurrence.
   */
  DocumentHighlightKind.Text = 1;
  /**
   * Read-access of a symbol, like reading a variable.
   */

  DocumentHighlightKind.Read = 2;
  /**
   * Write-access of a symbol, like writing to a variable.
   */

  DocumentHighlightKind.Write = 3;
})(DocumentHighlightKind || (exports.DocumentHighlightKind = DocumentHighlightKind = {}));
/**
 * DocumentHighlight namespace to provide helper functions to work with
 * [DocumentHighlight](#DocumentHighlight) literals.
 */


var DocumentHighlight;
exports.DocumentHighlight = DocumentHighlight;

(function (DocumentHighlight) {
  /**
   * Create a DocumentHighlight object.
   * @param range The range the highlight applies to.
   */
  function create(range, kind) {
    var result = {
      range: range
    };

    if (Is.number(kind)) {
      result.kind = kind;
    }

    return result;
  }

  DocumentHighlight.create = create;
})(DocumentHighlight || (exports.DocumentHighlight = DocumentHighlight = {}));
/**
 * A symbol kind.
 */


var SymbolKind;
exports.SymbolKind = SymbolKind;

(function (SymbolKind) {
  SymbolKind.File = 1;
  SymbolKind.Module = 2;
  SymbolKind.Namespace = 3;
  SymbolKind.Package = 4;
  SymbolKind.Class = 5;
  SymbolKind.Method = 6;
  SymbolKind.Property = 7;
  SymbolKind.Field = 8;
  SymbolKind.Constructor = 9;
  SymbolKind.Enum = 10;
  SymbolKind.Interface = 11;
  SymbolKind.Function = 12;
  SymbolKind.Variable = 13;
  SymbolKind.Constant = 14;
  SymbolKind.String = 15;
  SymbolKind.Number = 16;
  SymbolKind.Boolean = 17;
  SymbolKind.Array = 18;
  SymbolKind.Object = 19;
  SymbolKind.Key = 20;
  SymbolKind.Null = 21;
  SymbolKind.EnumMember = 22;
  SymbolKind.Struct = 23;
  SymbolKind.Event = 24;
  SymbolKind.Operator = 25;
  SymbolKind.TypeParameter = 26;
})(SymbolKind || (exports.SymbolKind = SymbolKind = {}));

var SymbolInformation;
exports.SymbolInformation = SymbolInformation;

(function (SymbolInformation) {
  /**
   * Creates a new symbol information literal.
   *
   * @param name The name of the symbol.
   * @param kind The kind of the symbol.
   * @param range The range of the location of the symbol.
   * @param uri The resource of the location of symbol, defaults to the current document.
   * @param containerName The name of the symbol containing the symbol.
   */
  function create(name, kind, range, uri, containerName) {
    var result = {
      name: name,
      kind: kind,
      location: {
        uri: uri,
        range: range
      }
    };

    if (containerName) {
      result.containerName = containerName;
    }

    return result;
  }

  SymbolInformation.create = create;
})(SymbolInformation || (exports.SymbolInformation = SymbolInformation = {}));
/**
 * Represents programming constructs like variables, classes, interfaces etc.
 * that appear in a document. Document symbols can be hierarchical and they
 * have two ranges: one that encloses its definition and one that points to
 * its most interesting range, e.g. the range of an identifier.
 */


var DocumentSymbol =
/** @class */
function () {
  function DocumentSymbol() {}

  return DocumentSymbol;
}();

exports.DocumentSymbol = DocumentSymbol;

(function (DocumentSymbol) {
  /**
   * Creates a new symbol information literal.
   *
   * @param name The name of the symbol.
   * @param detail The detail of the symbol.
   * @param kind The kind of the symbol.
   * @param range The range of the symbol.
   * @param selectionRange The selectionRange of the symbol.
   * @param children Children of the symbol.
   */
  function create(name, detail, kind, range, selectionRange, children) {
    var result = {
      name: name,
      detail: detail,
      kind: kind,
      range: range,
      selectionRange: selectionRange
    };

    if (children !== void 0) {
      result.children = children;
    }

    return result;
  }

  DocumentSymbol.create = create;
  /**
   * Checks whether the given literal conforms to the [DocumentSymbol](#DocumentSymbol) interface.
   */

  function is(value) {
    var candidate = value;
    return candidate && Is.string(candidate.name) && Is.number(candidate.kind) && Range.is(candidate.range) && Range.is(candidate.selectionRange) && (candidate.detail === void 0 || Is.string(candidate.detail)) && (candidate.deprecated === void 0 || Is.boolean(candidate.deprecated)) && (candidate.children === void 0 || Array.isArray(candidate.children));
  }

  DocumentSymbol.is = is;
})(DocumentSymbol || (exports.DocumentSymbol = DocumentSymbol = {}));
/**
 * A set of predefined code action kinds
 */


var CodeActionKind;
exports.CodeActionKind = CodeActionKind;

(function (CodeActionKind) {
  /**
   * Base kind for quickfix actions: 'quickfix'
   */
  CodeActionKind.QuickFix = 'quickfix';
  /**
   * Base kind for refactoring actions: 'refactor'
   */

  CodeActionKind.Refactor = 'refactor';
  /**
   * Base kind for refactoring extraction actions: 'refactor.extract'
   *
   * Example extract actions:
   *
   * - Extract method
   * - Extract function
   * - Extract variable
   * - Extract interface from class
   * - ...
   */

  CodeActionKind.RefactorExtract = 'refactor.extract';
  /**
   * Base kind for refactoring inline actions: 'refactor.inline'
   *
   * Example inline actions:
   *
   * - Inline function
   * - Inline variable
   * - Inline constant
   * - ...
   */

  CodeActionKind.RefactorInline = 'refactor.inline';
  /**
   * Base kind for refactoring rewrite actions: 'refactor.rewrite'
   *
   * Example rewrite actions:
   *
   * - Convert JavaScript function to class
   * - Add or remove parameter
   * - Encapsulate field
   * - Make method static
   * - Move method to base class
   * - ...
   */

  CodeActionKind.RefactorRewrite = 'refactor.rewrite';
  /**
   * Base kind for source actions: `source`
   *
   * Source code actions apply to the entire file.
   */

  CodeActionKind.Source = 'source';
  /**
   * Base kind for an organize imports source action: `source.organizeImports`
   */

  CodeActionKind.SourceOrganizeImports = 'source.organizeImports';
})(CodeActionKind || (exports.CodeActionKind = CodeActionKind = {}));
/**
 * The CodeActionContext namespace provides helper functions to work with
 * [CodeActionContext](#CodeActionContext) literals.
 */


var CodeActionContext;
exports.CodeActionContext = CodeActionContext;

(function (CodeActionContext) {
  /**
   * Creates a new CodeActionContext literal.
   */
  function create(diagnostics, only) {
    var result = {
      diagnostics: diagnostics
    };

    if (only !== void 0 && only !== null) {
      result.only = only;
    }

    return result;
  }

  CodeActionContext.create = create;
  /**
   * Checks whether the given literal conforms to the [CodeActionContext](#CodeActionContext) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is) && (candidate.only === void 0 || Is.typedArray(candidate.only, Is.string));
  }

  CodeActionContext.is = is;
})(CodeActionContext || (exports.CodeActionContext = CodeActionContext = {}));

var CodeAction;
exports.CodeAction = CodeAction;

(function (CodeAction) {
  function create(title, commandOrEdit, kind) {
    var result = {
      title: title
    };

    if (Command.is(commandOrEdit)) {
      result.command = commandOrEdit;
    } else {
      result.edit = commandOrEdit;
    }

    if (kind !== void null) {
      result.kind = kind;
    }

    return result;
  }

  CodeAction.create = create;

  function is(value) {
    var candidate = value;
    return candidate && Is.string(candidate.title) && (candidate.diagnostics === void 0 || Is.typedArray(candidate.diagnostics, Diagnostic.is)) && (candidate.kind === void 0 || Is.string(candidate.kind)) && (candidate.edit !== void 0 || candidate.command !== void 0) && (candidate.command === void 0 || Command.is(candidate.command)) && (candidate.edit === void 0 || WorkspaceEdit.is(candidate.edit));
  }

  CodeAction.is = is;
})(CodeAction || (exports.CodeAction = CodeAction = {}));
/**
 * The CodeLens namespace provides helper functions to work with
 * [CodeLens](#CodeLens) literals.
 */


var CodeLens;
exports.CodeLens = CodeLens;

(function (CodeLens) {
  /**
   * Creates a new CodeLens literal.
   */
  function create(range, data) {
    var result = {
      range: range
    };
    if (Is.defined(data)) result.data = data;
    return result;
  }

  CodeLens.create = create;
  /**
   * Checks whether the given literal conforms to the [CodeLens](#CodeLens) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
  }

  CodeLens.is = is;
})(CodeLens || (exports.CodeLens = CodeLens = {}));
/**
 * The FormattingOptions namespace provides helper functions to work with
 * [FormattingOptions](#FormattingOptions) literals.
 */


var FormattingOptions;
exports.FormattingOptions = FormattingOptions;

(function (FormattingOptions) {
  /**
   * Creates a new FormattingOptions literal.
   */
  function create(tabSize, insertSpaces) {
    return {
      tabSize: tabSize,
      insertSpaces: insertSpaces
    };
  }

  FormattingOptions.create = create;
  /**
   * Checks whether the given literal conforms to the [FormattingOptions](#FormattingOptions) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.number(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
  }

  FormattingOptions.is = is;
})(FormattingOptions || (exports.FormattingOptions = FormattingOptions = {}));
/**
 * A document link is a range in a text document that links to an internal or external resource, like another
 * text document or a web site.
 */


var DocumentLink =
/** @class */
function () {
  function DocumentLink() {}

  return DocumentLink;
}();

exports.DocumentLink = DocumentLink;

/**
 * The DocumentLink namespace provides helper functions to work with
 * [DocumentLink](#DocumentLink) literals.
 */
(function (DocumentLink) {
  /**
   * Creates a new DocumentLink literal.
   */
  function create(range, target, data) {
    return {
      range: range,
      target: target,
      data: data
    };
  }

  DocumentLink.create = create;
  /**
   * Checks whether the given literal conforms to the [DocumentLink](#DocumentLink) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
  }

  DocumentLink.is = is;
})(DocumentLink || (exports.DocumentLink = DocumentLink = {}));

var EOL = ['\n', '\r\n', '\r'];
exports.EOL = EOL;
var TextDocument;
exports.TextDocument = TextDocument;

(function (TextDocument) {
  /**
   * Creates a new ITextDocument literal from the given uri and content.
   * @param uri The document's uri.
   * @param languageId  The document's language Id.
   * @param content The document's content.
   */
  function create(uri, languageId, version, content) {
    return new FullTextDocument(uri, languageId, version, content);
  }

  TextDocument.create = create;
  /**
   * Checks whether the given literal conforms to the [ITextDocument](#ITextDocument) interface.
   */

  function is(value) {
    var candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.number(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
  }

  TextDocument.is = is;

  function applyEdits(document, edits) {
    var text = document.getText();
    var sortedEdits = mergeSort(edits, function (a, b) {
      var diff = a.range.start.line - b.range.start.line;

      if (diff === 0) {
        return a.range.start.character - b.range.start.character;
      }

      return diff;
    });
    var lastModifiedOffset = text.length;

    for (var i = sortedEdits.length - 1; i >= 0; i--) {
      var e = sortedEdits[i];
      var startOffset = document.offsetAt(e.range.start);
      var endOffset = document.offsetAt(e.range.end);

      if (endOffset <= lastModifiedOffset) {
        text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
      } else {
        throw new Error('Ovelapping edit');
      }

      lastModifiedOffset = startOffset;
    }

    return text;
  }

  TextDocument.applyEdits = applyEdits;

  function mergeSort(data, compare) {
    if (data.length <= 1) {
      // sorted
      return data;
    }

    var p = data.length / 2 | 0;
    var left = data.slice(0, p);
    var right = data.slice(p);
    mergeSort(left, compare);
    mergeSort(right, compare);
    var leftIdx = 0;
    var rightIdx = 0;
    var i = 0;

    while (leftIdx < left.length && rightIdx < right.length) {
      var ret = compare(left[leftIdx], right[rightIdx]);

      if (ret <= 0) {
        // smaller_equal -> take left to preserve order
        data[i++] = left[leftIdx++];
      } else {
        // greater -> take right
        data[i++] = right[rightIdx++];
      }
    }

    while (leftIdx < left.length) {
      data[i++] = left[leftIdx++];
    }

    while (rightIdx < right.length) {
      data[i++] = right[rightIdx++];
    }

    return data;
  }
})(TextDocument || (exports.TextDocument = TextDocument = {}));
/**
 * Represents reasons why a text document is saved.
 */


var TextDocumentSaveReason;
exports.TextDocumentSaveReason = TextDocumentSaveReason;

(function (TextDocumentSaveReason) {
  /**
   * Manually triggered, e.g. by the user pressing save, by starting debugging,
   * or by an API call.
   */
  TextDocumentSaveReason.Manual = 1;
  /**
   * Automatic after a delay.
   */

  TextDocumentSaveReason.AfterDelay = 2;
  /**
   * When the editor lost focus.
   */

  TextDocumentSaveReason.FocusOut = 3;
})(TextDocumentSaveReason || (exports.TextDocumentSaveReason = TextDocumentSaveReason = {}));

var FullTextDocument =
/** @class */
function () {
  function FullTextDocument(uri, languageId, version, content) {
    this._uri = uri;
    this._languageId = languageId;
    this._version = version;
    this._content = content;
    this._lineOffsets = null;
  }

  Object.defineProperty(FullTextDocument.prototype, "uri", {
    get: function () {
      return this._uri;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(FullTextDocument.prototype, "languageId", {
    get: function () {
      return this._languageId;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(FullTextDocument.prototype, "version", {
    get: function () {
      return this._version;
    },
    enumerable: true,
    configurable: true
  });

  FullTextDocument.prototype.getText = function (range) {
    if (range) {
      var start = this.offsetAt(range.start);
      var end = this.offsetAt(range.end);
      return this._content.substring(start, end);
    }

    return this._content;
  };

  FullTextDocument.prototype.update = function (event, version) {
    this._content = event.text;
    this._version = version;
    this._lineOffsets = null;
  };

  FullTextDocument.prototype.getLineOffsets = function () {
    if (this._lineOffsets === null) {
      var lineOffsets = [];
      var text = this._content;
      var isLineStart = true;

      for (var i = 0; i < text.length; i++) {
        if (isLineStart) {
          lineOffsets.push(i);
          isLineStart = false;
        }

        var ch = text.charAt(i);
        isLineStart = ch === '\r' || ch === '\n';

        if (ch === '\r' && i + 1 < text.length && text.charAt(i + 1) === '\n') {
          i++;
        }
      }

      if (isLineStart && text.length > 0) {
        lineOffsets.push(text.length);
      }

      this._lineOffsets = lineOffsets;
    }

    return this._lineOffsets;
  };

  FullTextDocument.prototype.positionAt = function (offset) {
    offset = Math.max(Math.min(offset, this._content.length), 0);
    var lineOffsets = this.getLineOffsets();
    var low = 0,
        high = lineOffsets.length;

    if (high === 0) {
      return Position.create(0, offset);
    }

    while (low < high) {
      var mid = Math.floor((low + high) / 2);

      if (lineOffsets[mid] > offset) {
        high = mid;
      } else {
        low = mid + 1;
      }
    } // low is the least x for which the line offset is larger than the current offset
    // or array.length if no line offset is larger than the current offset


    var line = low - 1;
    return Position.create(line, offset - lineOffsets[line]);
  };

  FullTextDocument.prototype.offsetAt = function (position) {
    var lineOffsets = this.getLineOffsets();

    if (position.line >= lineOffsets.length) {
      return this._content.length;
    } else if (position.line < 0) {
      return 0;
    }

    var lineOffset = lineOffsets[position.line];
    var nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
    return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
  };

  Object.defineProperty(FullTextDocument.prototype, "lineCount", {
    get: function () {
      return this.getLineOffsets().length;
    },
    enumerable: true,
    configurable: true
  });
  return FullTextDocument;
}();

var Is;

(function (Is) {
  var toString = Object.prototype.toString;

  function defined(value) {
    return typeof value !== 'undefined';
  }

  Is.defined = defined;

  function undefined(value) {
    return typeof value === 'undefined';
  }

  Is.undefined = undefined;

  function boolean(value) {
    return value === true || value === false;
  }

  Is.boolean = boolean;

  function string(value) {
    return toString.call(value) === '[object String]';
  }

  Is.string = string;

  function number(value) {
    return toString.call(value) === '[object Number]';
  }

  Is.number = number;

  function func(value) {
    return toString.call(value) === '[object Function]';
  }

  Is.func = func;

  function objectLiteral(value) {
    // Strictly speaking class instances pass this check as well. Since the LSP
    // doesn't use classes we ignore this for now. If we do we need to add something
    // like this: `Object.getPrototypeOf(Object.getPrototypeOf(x)) === null`
    return value !== null && typeof value === 'object';
  }

  Is.objectLiteral = objectLiteral;

  function typedArray(value, check) {
    return Array.isArray(value) && value.every(check);
  }

  Is.typedArray = typedArray;
})(Is || (Is = {}));
},{}],"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/scanner.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
/**
 * Creates a JSON scanner on the given text.
 * If ignoreTrivia is set, whitespaces or comments are ignored.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createScanner = createScanner;

function createScanner(text, ignoreTrivia) {
  if (ignoreTrivia === void 0) {
    ignoreTrivia = false;
  }

  var pos = 0,
      len = text.length,
      value = '',
      tokenOffset = 0,
      token = 16
  /* Unknown */
  ,
      scanError = 0
  /* None */
  ;

  function scanHexDigits(count, exact) {
    var digits = 0;
    var value = 0;

    while (digits < count || !exact) {
      var ch = text.charCodeAt(pos);

      if (ch >= 48
      /* _0 */
      && ch <= 57
      /* _9 */
      ) {
          value = value * 16 + ch - 48
          /* _0 */
          ;
        } else if (ch >= 65
      /* A */
      && ch <= 70
      /* F */
      ) {
          value = value * 16 + ch - 65
          /* A */
          + 10;
        } else if (ch >= 97
      /* a */
      && ch <= 102
      /* f */
      ) {
          value = value * 16 + ch - 97
          /* a */
          + 10;
        } else {
        break;
      }

      pos++;
      digits++;
    }

    if (digits < count) {
      value = -1;
    }

    return value;
  }

  function setPosition(newPosition) {
    pos = newPosition;
    value = '';
    tokenOffset = 0;
    token = 16
    /* Unknown */
    ;
    scanError = 0
    /* None */
    ;
  }

  function scanNumber() {
    var start = pos;

    if (text.charCodeAt(pos) === 48
    /* _0 */
    ) {
        pos++;
      } else {
      pos++;

      while (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
      }
    }

    if (pos < text.length && text.charCodeAt(pos) === 46
    /* dot */
    ) {
        pos++;

        if (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;

          while (pos < text.length && isDigit(text.charCodeAt(pos))) {
            pos++;
          }
        } else {
          scanError = 3
          /* UnexpectedEndOfNumber */
          ;
          return text.substring(start, pos);
        }
      }

    var end = pos;

    if (pos < text.length && (text.charCodeAt(pos) === 69
    /* E */
    || text.charCodeAt(pos) === 101
    /* e */
    )) {
      pos++;

      if (pos < text.length && text.charCodeAt(pos) === 43
      /* plus */
      || text.charCodeAt(pos) === 45
      /* minus */
      ) {
          pos++;
        }

      if (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;

        while (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
        }

        end = pos;
      } else {
        scanError = 3
        /* UnexpectedEndOfNumber */
        ;
      }
    }

    return text.substring(start, end);
  }

  function scanString() {
    var result = '',
        start = pos;

    while (true) {
      if (pos >= len) {
        result += text.substring(start, pos);
        scanError = 2
        /* UnexpectedEndOfString */
        ;
        break;
      }

      var ch = text.charCodeAt(pos);

      if (ch === 34
      /* doubleQuote */
      ) {
          result += text.substring(start, pos);
          pos++;
          break;
        }

      if (ch === 92
      /* backslash */
      ) {
          result += text.substring(start, pos);
          pos++;

          if (pos >= len) {
            scanError = 2
            /* UnexpectedEndOfString */
            ;
            break;
          }

          ch = text.charCodeAt(pos++);

          switch (ch) {
            case 34
            /* doubleQuote */
            :
              result += '\"';
              break;

            case 92
            /* backslash */
            :
              result += '\\';
              break;

            case 47
            /* slash */
            :
              result += '/';
              break;

            case 98
            /* b */
            :
              result += '\b';
              break;

            case 102
            /* f */
            :
              result += '\f';
              break;

            case 110
            /* n */
            :
              result += '\n';
              break;

            case 114
            /* r */
            :
              result += '\r';
              break;

            case 116
            /* t */
            :
              result += '\t';
              break;

            case 117
            /* u */
            :
              var ch_1 = scanHexDigits(4, true);

              if (ch_1 >= 0) {
                result += String.fromCharCode(ch_1);
              } else {
                scanError = 4
                /* InvalidUnicode */
                ;
              }

              break;

            default:
              scanError = 5
              /* InvalidEscapeCharacter */
              ;
          }

          start = pos;
          continue;
        }

      if (ch >= 0 && ch <= 0x1f) {
        if (isLineBreak(ch)) {
          result += text.substring(start, pos);
          scanError = 2
          /* UnexpectedEndOfString */
          ;
          break;
        } else {
          scanError = 6
          /* InvalidCharacter */
          ; // mark as error but continue with string
        }
      }

      pos++;
    }

    return result;
  }

  function scanNext() {
    value = '';
    scanError = 0
    /* None */
    ;
    tokenOffset = pos;

    if (pos >= len) {
      // at the end
      tokenOffset = len;
      return token = 17
      /* EOF */
      ;
    }

    var code = text.charCodeAt(pos); // trivia: whitespace

    if (isWhiteSpace(code)) {
      do {
        pos++;
        value += String.fromCharCode(code);
        code = text.charCodeAt(pos);
      } while (isWhiteSpace(code));

      return token = 15
      /* Trivia */
      ;
    } // trivia: newlines


    if (isLineBreak(code)) {
      pos++;
      value += String.fromCharCode(code);

      if (code === 13
      /* carriageReturn */
      && text.charCodeAt(pos) === 10
      /* lineFeed */
      ) {
          pos++;
          value += '\n';
        }

      return token = 14
      /* LineBreakTrivia */
      ;
    }

    switch (code) {
      // tokens: []{}:,
      case 123
      /* openBrace */
      :
        pos++;
        return token = 1
        /* OpenBraceToken */
        ;

      case 125
      /* closeBrace */
      :
        pos++;
        return token = 2
        /* CloseBraceToken */
        ;

      case 91
      /* openBracket */
      :
        pos++;
        return token = 3
        /* OpenBracketToken */
        ;

      case 93
      /* closeBracket */
      :
        pos++;
        return token = 4
        /* CloseBracketToken */
        ;

      case 58
      /* colon */
      :
        pos++;
        return token = 6
        /* ColonToken */
        ;

      case 44
      /* comma */
      :
        pos++;
        return token = 5
        /* CommaToken */
        ;
      // strings

      case 34
      /* doubleQuote */
      :
        pos++;
        value = scanString();
        return token = 10
        /* StringLiteral */
        ;
      // comments

      case 47
      /* slash */
      :
        var start = pos - 1; // Single-line comment

        if (text.charCodeAt(pos + 1) === 47
        /* slash */
        ) {
            pos += 2;

            while (pos < len) {
              if (isLineBreak(text.charCodeAt(pos))) {
                break;
              }

              pos++;
            }

            value = text.substring(start, pos);
            return token = 12
            /* LineCommentTrivia */
            ;
          } // Multi-line comment


        if (text.charCodeAt(pos + 1) === 42
        /* asterisk */
        ) {
            pos += 2;
            var commentClosed = false;

            while (pos < len) {
              var ch = text.charCodeAt(pos);

              if (ch === 42
              /* asterisk */
              && pos + 1 < len && text.charCodeAt(pos + 1) === 47
              /* slash */
              ) {
                  pos += 2;
                  commentClosed = true;
                  break;
                }

              pos++;
            }

            if (!commentClosed) {
              pos++;
              scanError = 1
              /* UnexpectedEndOfComment */
              ;
            }

            value = text.substring(start, pos);
            return token = 13
            /* BlockCommentTrivia */
            ;
          } // just a single slash


        value += String.fromCharCode(code);
        pos++;
        return token = 16
        /* Unknown */
        ;
      // numbers

      case 45
      /* minus */
      :
        value += String.fromCharCode(code);
        pos++;

        if (pos === len || !isDigit(text.charCodeAt(pos))) {
          return token = 16
          /* Unknown */
          ;
        }

      // found a minus, followed by a number so
      // we fall through to proceed with scanning
      // numbers

      case 48
      /* _0 */
      :
      case 49
      /* _1 */
      :
      case 50
      /* _2 */
      :
      case 51
      /* _3 */
      :
      case 52
      /* _4 */
      :
      case 53
      /* _5 */
      :
      case 54
      /* _6 */
      :
      case 55
      /* _7 */
      :
      case 56
      /* _8 */
      :
      case 57
      /* _9 */
      :
        value += scanNumber();
        return token = 11
        /* NumericLiteral */
        ;
      // literals and unknown symbols

      default:
        // is a literal? Read the full word.
        while (pos < len && isUnknownContentCharacter(code)) {
          pos++;
          code = text.charCodeAt(pos);
        }

        if (tokenOffset !== pos) {
          value = text.substring(tokenOffset, pos); // keywords: true, false, null

          switch (value) {
            case 'true':
              return token = 8
              /* TrueKeyword */
              ;

            case 'false':
              return token = 9
              /* FalseKeyword */
              ;

            case 'null':
              return token = 7
              /* NullKeyword */
              ;
          }

          return token = 16
          /* Unknown */
          ;
        } // some


        value += String.fromCharCode(code);
        pos++;
        return token = 16
        /* Unknown */
        ;
    }
  }

  function isUnknownContentCharacter(code) {
    if (isWhiteSpace(code) || isLineBreak(code)) {
      return false;
    }

    switch (code) {
      case 125
      /* closeBrace */
      :
      case 93
      /* closeBracket */
      :
      case 123
      /* openBrace */
      :
      case 91
      /* openBracket */
      :
      case 34
      /* doubleQuote */
      :
      case 58
      /* colon */
      :
      case 44
      /* comma */
      :
      case 47
      /* slash */
      :
        return false;
    }

    return true;
  }

  function scanNextNonTrivia() {
    var result;

    do {
      result = scanNext();
    } while (result >= 12
    /* LineCommentTrivia */
    && result <= 15
    /* Trivia */
    );

    return result;
  }

  return {
    setPosition: setPosition,
    getPosition: function () {
      return pos;
    },
    scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
    getToken: function () {
      return token;
    },
    getTokenValue: function () {
      return value;
    },
    getTokenOffset: function () {
      return tokenOffset;
    },
    getTokenLength: function () {
      return pos - tokenOffset;
    },
    getTokenError: function () {
      return scanError;
    }
  };
}

function isWhiteSpace(ch) {
  return ch === 32
  /* space */
  || ch === 9
  /* tab */
  || ch === 11
  /* verticalTab */
  || ch === 12
  /* formFeed */
  || ch === 160
  /* nonBreakingSpace */
  || ch === 5760
  /* ogham */
  || ch >= 8192
  /* enQuad */
  && ch <= 8203
  /* zeroWidthSpace */
  || ch === 8239
  /* narrowNoBreakSpace */
  || ch === 8287
  /* mathematicalSpace */
  || ch === 12288
  /* ideographicSpace */
  || ch === 65279
  /* byteOrderMark */
  ;
}

function isLineBreak(ch) {
  return ch === 10
  /* lineFeed */
  || ch === 13
  /* carriageReturn */
  || ch === 8232
  /* lineSeparator */
  || ch === 8233
  /* paragraphSeparator */
  ;
}

function isDigit(ch) {
  return ch >= 48
  /* _0 */
  && ch <= 57
  /* _9 */
  ;
}
},{}],"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/format.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.isEOL = isEOL;

var _scanner = require("./scanner.js");

function format(documentText, range, options) {
  var initialIndentLevel;
  var formatText;
  var formatTextStart;
  var rangeStart;
  var rangeEnd;

  if (range) {
    rangeStart = range.offset;
    rangeEnd = rangeStart + range.length;
    formatTextStart = rangeStart;

    while (formatTextStart > 0 && !isEOL(documentText, formatTextStart - 1)) {
      formatTextStart--;
    }

    var endOffset = rangeEnd;

    while (endOffset < documentText.length && !isEOL(documentText, endOffset)) {
      endOffset++;
    }

    formatText = documentText.substring(formatTextStart, endOffset);
    initialIndentLevel = computeIndentLevel(formatText, options);
  } else {
    formatText = documentText;
    initialIndentLevel = 0;
    formatTextStart = 0;
    rangeStart = 0;
    rangeEnd = documentText.length;
  }

  var eol = getEOL(options, documentText);
  var lineBreak = false;
  var indentLevel = 0;
  var indentValue;

  if (options.insertSpaces) {
    indentValue = repeat(' ', options.tabSize || 4);
  } else {
    indentValue = '\t';
  }

  var scanner = (0, _scanner.createScanner)(formatText, false);
  var hasError = false;

  function newLineAndIndent() {
    return eol + repeat(indentValue, initialIndentLevel + indentLevel);
  }

  function scanNext() {
    var token = scanner.scan();
    lineBreak = false;

    while (token === 15
    /* Trivia */
    || token === 14
    /* LineBreakTrivia */
    ) {
      lineBreak = lineBreak || token === 14
      /* LineBreakTrivia */
      ;
      token = scanner.scan();
    }

    hasError = token === 16
    /* Unknown */
    || scanner.getTokenError() !== 0
    /* None */
    ;
    return token;
  }

  var editOperations = [];

  function addEdit(text, startOffset, endOffset) {
    if (!hasError && startOffset < rangeEnd && endOffset > rangeStart && documentText.substring(startOffset, endOffset) !== text) {
      editOperations.push({
        offset: startOffset,
        length: endOffset - startOffset,
        content: text
      });
    }
  }

  var firstToken = scanNext();

  if (firstToken !== 17
  /* EOF */
  ) {
      var firstTokenStart = scanner.getTokenOffset() + formatTextStart;
      var initialIndent = repeat(indentValue, initialIndentLevel);
      addEdit(initialIndent, formatTextStart, firstTokenStart);
    }

  while (firstToken !== 17
  /* EOF */
  ) {
    var firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
    var secondToken = scanNext();
    var replaceContent = '';

    while (!lineBreak && (secondToken === 12
    /* LineCommentTrivia */
    || secondToken === 13
    /* BlockCommentTrivia */
    )) {
      // comments on the same line: keep them on the same line, but ignore them otherwise
      var commentTokenStart = scanner.getTokenOffset() + formatTextStart;
      addEdit(' ', firstTokenEnd, commentTokenStart);
      firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
      replaceContent = secondToken === 12
      /* LineCommentTrivia */
      ? newLineAndIndent() : '';
      secondToken = scanNext();
    }

    if (secondToken === 2
    /* CloseBraceToken */
    ) {
        if (firstToken !== 1
        /* OpenBraceToken */
        ) {
            indentLevel--;
            replaceContent = newLineAndIndent();
          }
      } else if (secondToken === 4
    /* CloseBracketToken */
    ) {
        if (firstToken !== 3
        /* OpenBracketToken */
        ) {
            indentLevel--;
            replaceContent = newLineAndIndent();
          }
      } else {
      switch (firstToken) {
        case 3
        /* OpenBracketToken */
        :
        case 1
        /* OpenBraceToken */
        :
          indentLevel++;
          replaceContent = newLineAndIndent();
          break;

        case 5
        /* CommaToken */
        :
        case 12
        /* LineCommentTrivia */
        :
          replaceContent = newLineAndIndent();
          break;

        case 13
        /* BlockCommentTrivia */
        :
          if (lineBreak) {
            replaceContent = newLineAndIndent();
          } else {
            // symbol following comment on the same line: keep on same line, separate with ' '
            replaceContent = ' ';
          }

          break;

        case 6
        /* ColonToken */
        :
          replaceContent = ' ';
          break;

        case 10
        /* StringLiteral */
        :
          if (secondToken === 6
          /* ColonToken */
          ) {
              replaceContent = '';
              break;
            }

        // fall through

        case 7
        /* NullKeyword */
        :
        case 8
        /* TrueKeyword */
        :
        case 9
        /* FalseKeyword */
        :
        case 11
        /* NumericLiteral */
        :
        case 2
        /* CloseBraceToken */
        :
        case 4
        /* CloseBracketToken */
        :
          if (secondToken === 12
          /* LineCommentTrivia */
          || secondToken === 13
          /* BlockCommentTrivia */
          ) {
              replaceContent = ' ';
            } else if (secondToken !== 5
          /* CommaToken */
          && secondToken !== 17
          /* EOF */
          ) {
              hasError = true;
            }

          break;

        case 16
        /* Unknown */
        :
          hasError = true;
          break;
      }

      if (lineBreak && (secondToken === 12
      /* LineCommentTrivia */
      || secondToken === 13
      /* BlockCommentTrivia */
      )) {
        replaceContent = newLineAndIndent();
      }
    }

    var secondTokenStart = scanner.getTokenOffset() + formatTextStart;
    addEdit(replaceContent, firstTokenEnd, secondTokenStart);
    firstToken = secondToken;
  }

  return editOperations;
}

function repeat(s, count) {
  var result = '';

  for (var i = 0; i < count; i++) {
    result += s;
  }

  return result;
}

function computeIndentLevel(content, options) {
  var i = 0;
  var nChars = 0;
  var tabSize = options.tabSize || 4;

  while (i < content.length) {
    var ch = content.charAt(i);

    if (ch === ' ') {
      nChars++;
    } else if (ch === '\t') {
      nChars += tabSize;
    } else {
      break;
    }

    i++;
  }

  return Math.floor(nChars / tabSize);
}

function getEOL(options, text) {
  for (var i = 0; i < text.length; i++) {
    var ch = text.charAt(i);

    if (ch === '\r') {
      if (i + 1 < text.length && text.charAt(i + 1) === '\n') {
        return '\r\n';
      }

      return '\r';
    } else if (ch === '\n') {
      return '\n';
    }
  }

  return options && options.eol || '\n';
}

function isEOL(text, offset) {
  return '\r\n'.indexOf(text.charAt(offset)) !== -1;
}
},{"./scanner.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/scanner.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/parser.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocation = getLocation;
exports.parse = parse;
exports.parseTree = parseTree;
exports.findNodeAtLocation = findNodeAtLocation;
exports.getNodePath = getNodePath;
exports.getNodeValue = getNodeValue;
exports.contains = contains;
exports.findNodeAtOffset = findNodeAtOffset;
exports.visit = visit;
exports.stripComments = stripComments;

var _scanner2 = require("./scanner.js");

/**
 * For a given offset, evaluate the location in the JSON document. Each segment in the location path is either a property name or an array index.
 */
function getLocation(text, position) {
  var segments = []; // strings or numbers

  var earlyReturnException = new Object();
  var previousNode = void 0;
  var previousNodeInst = {
    value: {},
    offset: 0,
    length: 0,
    type: 'object',
    parent: void 0
  };
  var isAtPropertyKey = false;

  function setPreviousNode(value, offset, length, type) {
    previousNodeInst.value = value;
    previousNodeInst.offset = offset;
    previousNodeInst.length = length;
    previousNodeInst.type = type;
    previousNodeInst.colonOffset = void 0;
    previousNode = previousNodeInst;
  }

  try {
    visit(text, {
      onObjectBegin: function (offset, length) {
        if (position <= offset) {
          throw earlyReturnException;
        }

        previousNode = void 0;
        isAtPropertyKey = position > offset;
        segments.push(''); // push a placeholder (will be replaced)
      },
      onObjectProperty: function (name, offset, length) {
        if (position < offset) {
          throw earlyReturnException;
        }

        setPreviousNode(name, offset, length, 'property');
        segments[segments.length - 1] = name;

        if (position <= offset + length) {
          throw earlyReturnException;
        }
      },
      onObjectEnd: function (offset, length) {
        if (position <= offset) {
          throw earlyReturnException;
        }

        previousNode = void 0;
        segments.pop();
      },
      onArrayBegin: function (offset, length) {
        if (position <= offset) {
          throw earlyReturnException;
        }

        previousNode = void 0;
        segments.push(0);
      },
      onArrayEnd: function (offset, length) {
        if (position <= offset) {
          throw earlyReturnException;
        }

        previousNode = void 0;
        segments.pop();
      },
      onLiteralValue: function (value, offset, length) {
        if (position < offset) {
          throw earlyReturnException;
        }

        setPreviousNode(value, offset, length, getLiteralNodeType(value));

        if (position <= offset + length) {
          throw earlyReturnException;
        }
      },
      onSeparator: function (sep, offset, length) {
        if (position <= offset) {
          throw earlyReturnException;
        }

        if (sep === ':' && previousNode && previousNode.type === 'property') {
          previousNode.colonOffset = offset;
          isAtPropertyKey = false;
          previousNode = void 0;
        } else if (sep === ',') {
          var last = segments[segments.length - 1];

          if (typeof last === 'number') {
            segments[segments.length - 1] = last + 1;
          } else {
            isAtPropertyKey = true;
            segments[segments.length - 1] = '';
          }

          previousNode = void 0;
        }
      }
    });
  } catch (e) {
    if (e !== earlyReturnException) {
      throw e;
    }
  }

  return {
    path: segments,
    previousNode: previousNode,
    isAtPropertyKey: isAtPropertyKey,
    matches: function (pattern) {
      var k = 0;

      for (var i = 0; k < pattern.length && i < segments.length; i++) {
        if (pattern[k] === segments[i] || pattern[k] === '*') {
          k++;
        } else if (pattern[k] !== '**') {
          return false;
        }
      }

      return k === pattern.length;
    }
  };
}
/**
 * Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 * Therefore always check the errors list to find out if the input was valid.
 */


function parse(text, errors, options) {
  if (errors === void 0) {
    errors = [];
  }

  var currentProperty = null;
  var currentParent = [];
  var previousParents = [];

  function onValue(value) {
    if (Array.isArray(currentParent)) {
      currentParent.push(value);
    } else if (currentProperty) {
      currentParent[currentProperty] = value;
    }
  }

  var visitor = {
    onObjectBegin: function () {
      var object = {};
      onValue(object);
      previousParents.push(currentParent);
      currentParent = object;
      currentProperty = null;
    },
    onObjectProperty: function (name) {
      currentProperty = name;
    },
    onObjectEnd: function () {
      currentParent = previousParents.pop();
    },
    onArrayBegin: function () {
      var array = [];
      onValue(array);
      previousParents.push(currentParent);
      currentParent = array;
      currentProperty = null;
    },
    onArrayEnd: function () {
      currentParent = previousParents.pop();
    },
    onLiteralValue: onValue,
    onError: function (error, offset, length) {
      errors.push({
        error: error,
        offset: offset,
        length: length
      });
    }
  };
  visit(text, visitor, options);
  return currentParent[0];
}
/**
 * Parses the given text and returns a tree representation the JSON content. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 */


function parseTree(text, errors, options) {
  if (errors === void 0) {
    errors = [];
  }

  var currentParent = {
    type: 'array',
    offset: -1,
    length: -1,
    children: [],
    parent: void 0
  }; // artificial root

  function ensurePropertyComplete(endOffset) {
    if (currentParent.type === 'property') {
      currentParent.length = endOffset - currentParent.offset;
      currentParent = currentParent.parent;
    }
  }

  function onValue(valueNode) {
    currentParent.children.push(valueNode);
    return valueNode;
  }

  var visitor = {
    onObjectBegin: function (offset) {
      currentParent = onValue({
        type: 'object',
        offset: offset,
        length: -1,
        parent: currentParent,
        children: []
      });
    },
    onObjectProperty: function (name, offset, length) {
      currentParent = onValue({
        type: 'property',
        offset: offset,
        length: -1,
        parent: currentParent,
        children: []
      });
      currentParent.children.push({
        type: 'string',
        value: name,
        offset: offset,
        length: length,
        parent: currentParent
      });
    },
    onObjectEnd: function (offset, length) {
      currentParent.length = offset + length - currentParent.offset;
      currentParent = currentParent.parent;
      ensurePropertyComplete(offset + length);
    },
    onArrayBegin: function (offset, length) {
      currentParent = onValue({
        type: 'array',
        offset: offset,
        length: -1,
        parent: currentParent,
        children: []
      });
    },
    onArrayEnd: function (offset, length) {
      currentParent.length = offset + length - currentParent.offset;
      currentParent = currentParent.parent;
      ensurePropertyComplete(offset + length);
    },
    onLiteralValue: function (value, offset, length) {
      onValue({
        type: getLiteralNodeType(value),
        offset: offset,
        length: length,
        parent: currentParent,
        value: value
      });
      ensurePropertyComplete(offset + length);
    },
    onSeparator: function (sep, offset, length) {
      if (currentParent.type === 'property') {
        if (sep === ':') {
          currentParent.colonOffset = offset;
        } else if (sep === ',') {
          ensurePropertyComplete(offset);
        }
      }
    },
    onError: function (error, offset, length) {
      errors.push({
        error: error,
        offset: offset,
        length: length
      });
    }
  };
  visit(text, visitor, options);
  var result = currentParent.children[0];

  if (result) {
    delete result.parent;
  }

  return result;
}
/**
 * Finds the node at the given path in a JSON DOM.
 */


function findNodeAtLocation(root, path) {
  if (!root) {
    return void 0;
  }

  var node = root;

  for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
    var segment = path_1[_i];

    if (typeof segment === 'string') {
      if (node.type !== 'object' || !Array.isArray(node.children)) {
        return void 0;
      }

      var found = false;

      for (var _a = 0, _b = node.children; _a < _b.length; _a++) {
        var propertyNode = _b[_a];

        if (Array.isArray(propertyNode.children) && propertyNode.children[0].value === segment) {
          node = propertyNode.children[1];
          found = true;
          break;
        }
      }

      if (!found) {
        return void 0;
      }
    } else {
      var index = segment;

      if (node.type !== 'array' || index < 0 || !Array.isArray(node.children) || index >= node.children.length) {
        return void 0;
      }

      node = node.children[index];
    }
  }

  return node;
}
/**
 * Gets the JSON path of the given JSON DOM node
 */


function getNodePath(node) {
  if (!node.parent || !node.parent.children) {
    return [];
  }

  var path = getNodePath(node.parent);

  if (node.parent.type === 'property') {
    var key = node.parent.children[0].value;
    path.push(key);
  } else if (node.parent.type === 'array') {
    var index = node.parent.children.indexOf(node);

    if (index !== -1) {
      path.push(index);
    }
  }

  return path;
}
/**
 * Evaluates the JavaScript object of the given JSON DOM node
 */


function getNodeValue(node) {
  switch (node.type) {
    case 'array':
      return node.children.map(getNodeValue);

    case 'object':
      var obj = Object.create(null);

      for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
        var prop = _a[_i];
        var valueNode = prop.children[1];

        if (valueNode) {
          obj[prop.children[0].value] = getNodeValue(valueNode);
        }
      }

      return obj;

    case 'null':
    case 'string':
    case 'number':
    case 'boolean':
      return node.value;

    default:
      return void 0;
  }
}

function contains(node, offset, includeRightBound) {
  if (includeRightBound === void 0) {
    includeRightBound = false;
  }

  return offset >= node.offset && offset < node.offset + node.length || includeRightBound && offset === node.offset + node.length;
}
/**
 * Finds the most inner node at the given offset. If includeRightBound is set, also finds nodes that end at the given offset.
 */


function findNodeAtOffset(node, offset, includeRightBound) {
  if (includeRightBound === void 0) {
    includeRightBound = false;
  }

  if (contains(node, offset, includeRightBound)) {
    var children = node.children;

    if (Array.isArray(children)) {
      for (var i = 0; i < children.length && children[i].offset <= offset; i++) {
        var item = findNodeAtOffset(children[i], offset, includeRightBound);

        if (item) {
          return item;
        }
      }
    }

    return node;
  }

  return void 0;
}
/**
 * Parses the given text and invokes the visitor functions for each object, array and literal reached.
 */


function visit(text, visitor, options) {
  var _scanner = (0, _scanner2.createScanner)(text, false);

  function toNoArgVisit(visitFunction) {
    return visitFunction ? function () {
      return visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength());
    } : function () {
      return true;
    };
  }

  function toOneArgVisit(visitFunction) {
    return visitFunction ? function (arg) {
      return visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength());
    } : function () {
      return true;
    };
  }

  var onObjectBegin = toNoArgVisit(visitor.onObjectBegin),
      onObjectProperty = toOneArgVisit(visitor.onObjectProperty),
      onObjectEnd = toNoArgVisit(visitor.onObjectEnd),
      onArrayBegin = toNoArgVisit(visitor.onArrayBegin),
      onArrayEnd = toNoArgVisit(visitor.onArrayEnd),
      onLiteralValue = toOneArgVisit(visitor.onLiteralValue),
      onSeparator = toOneArgVisit(visitor.onSeparator),
      onComment = toNoArgVisit(visitor.onComment),
      onError = toOneArgVisit(visitor.onError);
  var disallowComments = options && options.disallowComments;
  var allowTrailingComma = options && options.allowTrailingComma;

  function scanNext() {
    while (true) {
      var token = _scanner.scan();

      switch (_scanner.getTokenError()) {
        case 4
        /* InvalidUnicode */
        :
          handleError(14
          /* InvalidUnicode */
          );
          break;

        case 5
        /* InvalidEscapeCharacter */
        :
          handleError(15
          /* InvalidEscapeCharacter */
          );
          break;

        case 3
        /* UnexpectedEndOfNumber */
        :
          handleError(13
          /* UnexpectedEndOfNumber */
          );
          break;

        case 1
        /* UnexpectedEndOfComment */
        :
          if (!disallowComments) {
            handleError(11
            /* UnexpectedEndOfComment */
            );
          }

          break;

        case 2
        /* UnexpectedEndOfString */
        :
          handleError(12
          /* UnexpectedEndOfString */
          );
          break;

        case 6
        /* InvalidCharacter */
        :
          handleError(16
          /* InvalidCharacter */
          );
          break;
      }

      switch (token) {
        case 12
        /* LineCommentTrivia */
        :
        case 13
        /* BlockCommentTrivia */
        :
          if (disallowComments) {
            handleError(10
            /* InvalidCommentToken */
            );
          } else {
            onComment();
          }

          break;

        case 16
        /* Unknown */
        :
          handleError(1
          /* InvalidSymbol */
          );
          break;

        case 15
        /* Trivia */
        :
        case 14
        /* LineBreakTrivia */
        :
          break;

        default:
          return token;
      }
    }
  }

  function handleError(error, skipUntilAfter, skipUntil) {
    if (skipUntilAfter === void 0) {
      skipUntilAfter = [];
    }

    if (skipUntil === void 0) {
      skipUntil = [];
    }

    onError(error);

    if (skipUntilAfter.length + skipUntil.length > 0) {
      var token = _scanner.getToken();

      while (token !== 17
      /* EOF */
      ) {
        if (skipUntilAfter.indexOf(token) !== -1) {
          scanNext();
          break;
        } else if (skipUntil.indexOf(token) !== -1) {
          break;
        }

        token = scanNext();
      }
    }
  }

  function parseString(isValue) {
    var value = _scanner.getTokenValue();

    if (isValue) {
      onLiteralValue(value);
    } else {
      onObjectProperty(value);
    }

    scanNext();
    return true;
  }

  function parseLiteral() {
    switch (_scanner.getToken()) {
      case 11
      /* NumericLiteral */
      :
        var value = 0;

        try {
          value = JSON.parse(_scanner.getTokenValue());

          if (typeof value !== 'number') {
            handleError(2
            /* InvalidNumberFormat */
            );
            value = 0;
          }
        } catch (e) {
          handleError(2
          /* InvalidNumberFormat */
          );
        }

        onLiteralValue(value);
        break;

      case 7
      /* NullKeyword */
      :
        onLiteralValue(null);
        break;

      case 8
      /* TrueKeyword */
      :
        onLiteralValue(true);
        break;

      case 9
      /* FalseKeyword */
      :
        onLiteralValue(false);
        break;

      default:
        return false;
    }

    scanNext();
    return true;
  }

  function parseProperty() {
    if (_scanner.getToken() !== 10
    /* StringLiteral */
    ) {
        handleError(3
        /* PropertyNameExpected */
        , [], [2
        /* CloseBraceToken */
        , 5
        /* CommaToken */
        ]);
        return false;
      }

    parseString(false);

    if (_scanner.getToken() === 6
    /* ColonToken */
    ) {
        onSeparator(':');
        scanNext(); // consume colon

        if (!parseValue()) {
          handleError(4
          /* ValueExpected */
          , [], [2
          /* CloseBraceToken */
          , 5
          /* CommaToken */
          ]);
        }
      } else {
      handleError(5
      /* ColonExpected */
      , [], [2
      /* CloseBraceToken */
      , 5
      /* CommaToken */
      ]);
    }

    return true;
  }

  function parseObject() {
    onObjectBegin();
    scanNext(); // consume open brace

    var needsComma = false;

    while (_scanner.getToken() !== 2
    /* CloseBraceToken */
    && _scanner.getToken() !== 17
    /* EOF */
    ) {
      if (_scanner.getToken() === 5
      /* CommaToken */
      ) {
          if (!needsComma) {
            handleError(4
            /* ValueExpected */
            , [], []);
          }

          onSeparator(',');
          scanNext(); // consume comma

          if (_scanner.getToken() === 2
          /* CloseBraceToken */
          && allowTrailingComma) {
            break;
          }
        } else if (needsComma) {
        handleError(6
        /* CommaExpected */
        , [], []);
      }

      if (!parseProperty()) {
        handleError(4
        /* ValueExpected */
        , [], [2
        /* CloseBraceToken */
        , 5
        /* CommaToken */
        ]);
      }

      needsComma = true;
    }

    onObjectEnd();

    if (_scanner.getToken() !== 2
    /* CloseBraceToken */
    ) {
        handleError(7
        /* CloseBraceExpected */
        , [2
        /* CloseBraceToken */
        ], []);
      } else {
      scanNext(); // consume close brace
    }

    return true;
  }

  function parseArray() {
    onArrayBegin();
    scanNext(); // consume open bracket

    var needsComma = false;

    while (_scanner.getToken() !== 4
    /* CloseBracketToken */
    && _scanner.getToken() !== 17
    /* EOF */
    ) {
      if (_scanner.getToken() === 5
      /* CommaToken */
      ) {
          if (!needsComma) {
            handleError(4
            /* ValueExpected */
            , [], []);
          }

          onSeparator(',');
          scanNext(); // consume comma

          if (_scanner.getToken() === 4
          /* CloseBracketToken */
          && allowTrailingComma) {
            break;
          }
        } else if (needsComma) {
        handleError(6
        /* CommaExpected */
        , [], []);
      }

      if (!parseValue()) {
        handleError(4
        /* ValueExpected */
        , [], [4
        /* CloseBracketToken */
        , 5
        /* CommaToken */
        ]);
      }

      needsComma = true;
    }

    onArrayEnd();

    if (_scanner.getToken() !== 4
    /* CloseBracketToken */
    ) {
        handleError(8
        /* CloseBracketExpected */
        , [4
        /* CloseBracketToken */
        ], []);
      } else {
      scanNext(); // consume close bracket
    }

    return true;
  }

  function parseValue() {
    switch (_scanner.getToken()) {
      case 3
      /* OpenBracketToken */
      :
        return parseArray();

      case 1
      /* OpenBraceToken */
      :
        return parseObject();

      case 10
      /* StringLiteral */
      :
        return parseString(true);

      default:
        return parseLiteral();
    }
  }

  scanNext();

  if (_scanner.getToken() === 17
  /* EOF */
  ) {
      return true;
    }

  if (!parseValue()) {
    handleError(4
    /* ValueExpected */
    , [], []);
    return false;
  }

  if (_scanner.getToken() !== 17
  /* EOF */
  ) {
      handleError(9
      /* EndOfFileExpected */
      , [], []);
    }

  return true;
}
/**
 * Takes JSON with JavaScript-style comments and remove
 * them. Optionally replaces every none-newline character
 * of comments with a replaceCharacter
 */


function stripComments(text, replaceCh) {
  var _scanner = (0, _scanner2.createScanner)(text),
      parts = [],
      kind,
      offset = 0,
      pos;

  do {
    pos = _scanner.getPosition();
    kind = _scanner.scan();

    switch (kind) {
      case 12
      /* LineCommentTrivia */
      :
      case 13
      /* BlockCommentTrivia */
      :
      case 17
      /* EOF */
      :
        if (offset !== pos) {
          parts.push(text.substring(offset, pos));
        }

        if (replaceCh !== void 0) {
          parts.push(_scanner.getTokenValue().replace(/[^\r\n]/g, replaceCh));
        }

        offset = _scanner.getPosition();
        break;
    }
  } while (kind !== 17
  /* EOF */
  );

  return parts.join('');
}

function getLiteralNodeType(value) {
  switch (typeof value) {
    case 'boolean':
      return 'boolean';

    case 'number':
      return 'number';

    case 'string':
      return 'string';

    default:
      return 'null';
  }
}
},{"./scanner.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/scanner.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/edit.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeProperty = removeProperty;
exports.setProperty = setProperty;
exports.applyEdit = applyEdit;
exports.isWS = isWS;

var _format = require("./format.js");

var _parser = require("./parser.js");

function removeProperty(text, path, formattingOptions) {
  return setProperty(text, path, void 0, formattingOptions);
}

function setProperty(text, originalPath, value, formattingOptions, getInsertionIndex) {
  var path = originalPath.slice();
  var errors = [];
  var root = (0, _parser.parseTree)(text, errors);
  var parent = void 0;
  var lastSegment = void 0;

  while (path.length > 0) {
    lastSegment = path.pop();
    parent = (0, _parser.findNodeAtLocation)(root, path);

    if (parent === void 0 && value !== void 0) {
      if (typeof lastSegment === 'string') {
        value = (_a = {}, _a[lastSegment] = value, _a);
      } else {
        value = [value];
      }
    } else {
      break;
    }
  }

  if (!parent) {
    // empty document
    if (value === void 0) {
      // delete
      throw new Error('Can not delete in empty document');
    }

    return withFormatting(text, {
      offset: root ? root.offset : 0,
      length: root ? root.length : 0,
      content: JSON.stringify(value)
    }, formattingOptions);
  } else if (parent.type === 'object' && typeof lastSegment === 'string' && Array.isArray(parent.children)) {
    var existing = (0, _parser.findNodeAtLocation)(parent, [lastSegment]);

    if (existing !== void 0) {
      if (value === void 0) {
        // delete
        if (!existing.parent) {
          throw new Error('Malformed AST');
        }

        var propertyIndex = parent.children.indexOf(existing.parent);
        var removeBegin = void 0;
        var removeEnd = existing.parent.offset + existing.parent.length;

        if (propertyIndex > 0) {
          // remove the comma of the previous node
          var previous = parent.children[propertyIndex - 1];
          removeBegin = previous.offset + previous.length;
        } else {
          removeBegin = parent.offset + 1;

          if (parent.children.length > 1) {
            // remove the comma of the next node
            var next = parent.children[1];
            removeEnd = next.offset;
          }
        }

        return withFormatting(text, {
          offset: removeBegin,
          length: removeEnd - removeBegin,
          content: ''
        }, formattingOptions);
      } else {
        // set value of existing property
        return withFormatting(text, {
          offset: existing.offset,
          length: existing.length,
          content: JSON.stringify(value)
        }, formattingOptions);
      }
    } else {
      if (value === void 0) {
        // delete
        return []; // property does not exist, nothing to do
      }

      var newProperty = JSON.stringify(lastSegment) + ": " + JSON.stringify(value);
      var index = getInsertionIndex ? getInsertionIndex(parent.children.map(function (p) {
        return p.children[0].value;
      })) : parent.children.length;
      var edit = void 0;

      if (index > 0) {
        var previous = parent.children[index - 1];
        edit = {
          offset: previous.offset + previous.length,
          length: 0,
          content: ',' + newProperty
        };
      } else if (parent.children.length === 0) {
        edit = {
          offset: parent.offset + 1,
          length: 0,
          content: newProperty
        };
      } else {
        edit = {
          offset: parent.offset + 1,
          length: 0,
          content: newProperty + ','
        };
      }

      return withFormatting(text, edit, formattingOptions);
    }
  } else if (parent.type === 'array' && typeof lastSegment === 'number' && Array.isArray(parent.children)) {
    var insertIndex = lastSegment;

    if (insertIndex === -1) {
      // Insert
      var newProperty = "" + JSON.stringify(value);
      var edit = void 0;

      if (parent.children.length === 0) {
        edit = {
          offset: parent.offset + 1,
          length: 0,
          content: newProperty
        };
      } else {
        var previous = parent.children[parent.children.length - 1];
        edit = {
          offset: previous.offset + previous.length,
          length: 0,
          content: ',' + newProperty
        };
      }

      return withFormatting(text, edit, formattingOptions);
    } else {
      if (value === void 0 && parent.children.length >= 0) {
        //Removal
        var removalIndex = lastSegment;
        var toRemove = parent.children[removalIndex];
        var edit = void 0;

        if (parent.children.length === 1) {
          // only item
          edit = {
            offset: parent.offset + 1,
            length: parent.length - 2,
            content: ''
          };
        } else if (parent.children.length - 1 === removalIndex) {
          // last item
          var previous = parent.children[removalIndex - 1];
          var offset = previous.offset + previous.length;
          var parentEndOffset = parent.offset + parent.length;
          edit = {
            offset: offset,
            length: parentEndOffset - 2 - offset,
            content: ''
          };
        } else {
          edit = {
            offset: toRemove.offset,
            length: parent.children[removalIndex + 1].offset - toRemove.offset,
            content: ''
          };
        }

        return withFormatting(text, edit, formattingOptions);
      } else {
        throw new Error('Array modification not supported yet');
      }
    }
  } else {
    throw new Error("Can not add " + (typeof lastSegment !== 'number' ? 'index' : 'property') + " to parent of type " + parent.type);
  }

  var _a;
}

function withFormatting(text, edit, formattingOptions) {
  // apply the edit
  var newText = applyEdit(text, edit); // format the new text

  var begin = edit.offset;
  var end = edit.offset + edit.content.length;

  if (edit.length === 0 || edit.content.length === 0) {
    // insert or remove
    while (begin > 0 && !(0, _format.isEOL)(newText, begin - 1)) {
      begin--;
    }

    while (end < newText.length && !(0, _format.isEOL)(newText, end)) {
      end++;
    }
  }

  var edits = (0, _format.format)(newText, {
    offset: begin,
    length: end - begin
  }, formattingOptions); // apply the formatting edits and track the begin and end offsets of the changes

  for (var i = edits.length - 1; i >= 0; i--) {
    var edit_1 = edits[i];
    newText = applyEdit(newText, edit_1);
    begin = Math.min(begin, edit_1.offset);
    end = Math.max(end, edit_1.offset + edit_1.length);
    end += edit_1.content.length - edit_1.length;
  } // create a single edit with all changes


  var editLength = text.length - (newText.length - end) - begin;
  return [{
    offset: begin,
    length: editLength,
    content: newText.substring(begin, end)
  }];
}

function applyEdit(text, edit) {
  return text.substring(0, edit.offset) + edit.content + text.substring(edit.offset + edit.length);
}

function isWS(text, offset) {
  return '\r\n \t'.indexOf(text.charAt(offset)) !== -1;
}
},{"./format.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/format.js","./parser.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/parser.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/main.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.modify = modify;
exports.applyEdits = applyEdits;
exports.stripComments = exports.visit = exports.getNodeValue = exports.getNodePath = exports.findNodeAtOffset = exports.findNodeAtLocation = exports.parseTree = exports.parse = exports.getLocation = exports.createScanner = void 0;

var formatter = _interopRequireWildcard(require("./impl/format.js"));

var edit = _interopRequireWildcard(require("./impl/edit.js"));

var scanner = _interopRequireWildcard(require("./impl/scanner.js"));

var parser = _interopRequireWildcard(require("./impl/parser.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Creates a JSON scanner on the given text.
 * If ignoreTrivia is set, whitespaces or comments are ignored.
 */
var createScanner = scanner.createScanner;
/**
 * For a given offset, evaluate the location in the JSON document. Each segment in the location path is either a property name or an array index.
 */

exports.createScanner = createScanner;
var getLocation = parser.getLocation;
/**
 * Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 * Therefore always check the errors list to find out if the input was valid.
 */

exports.getLocation = getLocation;
var parse = parser.parse;
/**
 * Parses the given text and returns a tree representation the JSON content. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 */

exports.parse = parse;
var parseTree = parser.parseTree;
/**
 * Finds the node at the given path in a JSON DOM.
 */

exports.parseTree = parseTree;
var findNodeAtLocation = parser.findNodeAtLocation;
/**
 * Finds the most inner node at the given offset. If includeRightBound is set, also finds nodes that end at the given offset.
 */

exports.findNodeAtLocation = findNodeAtLocation;
var findNodeAtOffset = parser.findNodeAtOffset;
/**
 * Gets the JSON path of the given JSON DOM node
 */

exports.findNodeAtOffset = findNodeAtOffset;
var getNodePath = parser.getNodePath;
/**
 * Evaluates the JavaScript object of the given JSON DOM node
 */

exports.getNodePath = getNodePath;
var getNodeValue = parser.getNodeValue;
/**
 * Parses the given text and invokes the visitor functions for each object, array and literal reached.
 */

exports.getNodeValue = getNodeValue;
var visit = parser.visit;
/**
 * Takes JSON with JavaScript-style comments and remove
 * them. Optionally replaces every none-newline character
 * of comments with a replaceCharacter
 */

exports.visit = visit;
var stripComments = parser.stripComments;
/**
 * Computes the edits needed to format a JSON document.
 *
 * @param documentText The input text
 * @param range The range to format or `undefined` to format the full content
 * @param options The formatting options
 * @returns A list of edit operations describing the formatting changes to the original document. Edits can be either inserts, replacements or
 * removals of text segments. All offsets refer to the original state of the document. No two edits must change or remove the same range of
 * text in the original document. However, multiple edits can have
 * the same offset, for example multiple inserts, or an insert followed by a remove or replace. The order in the array defines which edit is applied first.
 * To apply edits to an input, you can use `applyEdits`
 */

exports.stripComments = stripComments;

function format(documentText, range, options) {
  return formatter.format(documentText, range, options);
}
/**
 * Computes the edits needed to modify a value in the JSON document.
 *
 * @param documentText The input text
 * @param path The path of the value to change. The path represents either to the document root, a property or an array item.
 * If the path points to an non-existing property or item, it will be created.
 * @param value The new value for the specified property or item. If the value is undefined,
 * the property or item will be removed.
 * @param options Options
 * @returns A list of edit operations describing the formatting changes to the original document. Edits can be either inserts, replacements or
 * removals of text segments. All offsets refer to the original state of the document. No two edits must change or remove the same range of
 * text in the original document. However, multiple edits can have
 * the same offset, for example multiple inserts, or an insert followed by a remove or replace. The order in the array defines which edit is applied first.
 * To apply edits to an input, you can use `applyEdits`
 */


function modify(text, path, value, options) {
  return edit.setProperty(text, path, value, options.formattingOptions, options.getInsertionIndex);
}
/**
 * Applies edits to a input string.
 */


function applyEdits(text, edits) {
  for (var i = edits.length - 1; i >= 0; i--) {
    text = edit.applyEdit(text, edits[i]);
  }

  return text;
}
},{"./impl/format.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/format.js","./impl/edit.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/edit.js","./impl/scanner.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/scanner.js","./impl/parser.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/impl/parser.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/utils/objects.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equals = equals;

function equals(one, other) {
  if (one === other) {
    return true;
  }

  if (one === null || one === undefined || other === null || other === undefined) {
    return false;
  }

  if (typeof one !== typeof other) {
    return false;
  }

  if (typeof one !== 'object') {
    return false;
  }

  if (Array.isArray(one) !== Array.isArray(other)) {
    return false;
  }

  var i, key;

  if (Array.isArray(one)) {
    if (one.length !== other.length) {
      return false;
    }

    for (i = 0; i < one.length; i++) {
      if (!equals(one[i], other[i])) {
        return false;
      }
    }
  } else {
    var oneKeys = [];

    for (key in one) {
      oneKeys.push(key);
    }

    oneKeys.sort();
    var otherKeys = [];

    for (key in other) {
      otherKeys.push(key);
    }

    otherKeys.sort();

    if (!equals(oneKeys, otherKeys)) {
      return false;
    }

    for (i = 0; i < oneKeys.length; i++) {
      if (!equals(one[oneKeys[i]], other[oneKeys[i]])) {
        return false;
      }
    }
  }

  return true;
}
},{}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/jsonLanguageTypes.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Range", {
  enumerable: true,
  get: function () {
    return _main.Range;
  }
});
Object.defineProperty(exports, "TextEdit", {
  enumerable: true,
  get: function () {
    return _main.TextEdit;
  }
});
Object.defineProperty(exports, "Color", {
  enumerable: true,
  get: function () {
    return _main.Color;
  }
});
Object.defineProperty(exports, "ColorInformation", {
  enumerable: true,
  get: function () {
    return _main.ColorInformation;
  }
});
Object.defineProperty(exports, "ColorPresentation", {
  enumerable: true,
  get: function () {
    return _main.ColorPresentation;
  }
});
Object.defineProperty(exports, "FoldingRange", {
  enumerable: true,
  get: function () {
    return _main.FoldingRange;
  }
});
Object.defineProperty(exports, "FoldingRangeKind", {
  enumerable: true,
  get: function () {
    return _main.FoldingRangeKind;
  }
});
exports.ErrorCode = void 0;

var _main = require("./../vscode-languageserver-types/main.js");

/**
 * Error codes used by diagnostics
 */
var ErrorCode;
exports.ErrorCode = ErrorCode;

(function (ErrorCode) {
  ErrorCode[ErrorCode["Undefined"] = 0] = "Undefined";
  ErrorCode[ErrorCode["EnumValueMismatch"] = 1] = "EnumValueMismatch";
  ErrorCode[ErrorCode["UnexpectedEndOfComment"] = 257] = "UnexpectedEndOfComment";
  ErrorCode[ErrorCode["UnexpectedEndOfString"] = 258] = "UnexpectedEndOfString";
  ErrorCode[ErrorCode["UnexpectedEndOfNumber"] = 259] = "UnexpectedEndOfNumber";
  ErrorCode[ErrorCode["InvalidUnicode"] = 260] = "InvalidUnicode";
  ErrorCode[ErrorCode["InvalidEscapeCharacter"] = 261] = "InvalidEscapeCharacter";
  ErrorCode[ErrorCode["InvalidCharacter"] = 262] = "InvalidCharacter";
  ErrorCode[ErrorCode["PropertyExpected"] = 513] = "PropertyExpected";
  ErrorCode[ErrorCode["CommaExpected"] = 514] = "CommaExpected";
  ErrorCode[ErrorCode["ColonExpected"] = 515] = "ColonExpected";
  ErrorCode[ErrorCode["ValueExpected"] = 516] = "ValueExpected";
  ErrorCode[ErrorCode["CommaOrCloseBacketExpected"] = 517] = "CommaOrCloseBacketExpected";
  ErrorCode[ErrorCode["CommaOrCloseBraceExpected"] = 518] = "CommaOrCloseBraceExpected";
  ErrorCode[ErrorCode["TrailingComma"] = 519] = "TrailingComma";
  ErrorCode[ErrorCode["DuplicateKey"] = 520] = "DuplicateKey";
  ErrorCode[ErrorCode["CommentNotPermitted"] = 521] = "CommentNotPermitted";
  ErrorCode[ErrorCode["SchemaResolveError"] = 768] = "SchemaResolveError";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
},{"./../vscode-languageserver-types/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-languageserver-types/main.js"}],"node_modules/monaco-editor/esm/vs/language/json/fillers/vscode-nls.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadMessageBundle = loadMessageBundle;
exports.config = config;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function format(message, args) {
  var result;

  if (args.length === 0) {
    result = message;
  } else {
    result = message.replace(/\{(\d+)\}/g, function (match, rest) {
      var index = rest[0];
      return typeof args[index] !== 'undefined' ? args[index] : match;
    });
  }

  return result;
}

function localize(key, message) {
  var args = [];

  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }

  return format(message, args);
}

function loadMessageBundle(file) {
  return localize;
}

function config(opt) {
  return loadMessageBundle;
}
},{}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-uri/index.js":[function(require,module,exports) {
var process = require("process");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var isWindows;

if (typeof process === 'object') {
  isWindows = process.platform === 'win32';
} else if (typeof navigator === 'object') {
  var userAgent = navigator.userAgent;
  isWindows = userAgent.indexOf('Windows') >= 0;
} //#endregion


var _schemePattern = /^\w[\w\d+.-]*$/;
var _singleSlashStart = /^\//;
var _doubleSlashStart = /^\/\//;

function _validateUri(ret) {
  // scheme, https://tools.ietf.org/html/rfc3986#section-3.1
  // ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
  if (ret.scheme && !_schemePattern.test(ret.scheme)) {
    throw new Error('[UriError]: Scheme contains illegal characters.');
  } // path, http://tools.ietf.org/html/rfc3986#section-3.3
  // If a URI contains an authority component, then the path component
  // must either be empty or begin with a slash ("/") character.  If a URI
  // does not contain an authority component, then the path cannot begin
  // with two slash characters ("//").


  if (ret.path) {
    if (ret.authority) {
      if (!_singleSlashStart.test(ret.path)) {
        throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
      }
    } else {
      if (_doubleSlashStart.test(ret.path)) {
        throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
      }
    }
  }
} // implements a bit of https://tools.ietf.org/html/rfc3986#section-5


function _referenceResolution(scheme, path) {
  // the slash-character is our 'default base' as we don't
  // support constructing URIs relative to other URIs. This
  // also means that we alter and potentially break paths.
  // see https://tools.ietf.org/html/rfc3986#section-5.1.4
  switch (scheme) {
    case 'https':
    case 'http':
    case 'file':
      if (!path) {
        path = _slash;
      } else if (path[0] !== _slash) {
        path = _slash + path;
      }

      break;
  }

  return path;
}

var _empty = '';
var _slash = '/';
var _regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
/**
 * Uniform Resource Identifier (URI) http://tools.ietf.org/html/rfc3986.
 * This class is a simple parser which creates the basic component paths
 * (http://tools.ietf.org/html/rfc3986#section-3) with minimal validation
 * and encoding.
 *
 *       foo://example.com:8042/over/there?name=ferret#nose
 *       \_/   \______________/\_________/ \_________/ \__/
 *        |           |            |            |        |
 *     scheme     authority       path        query   fragment
 *        |   _____________________|__
 *       / \ /                        \
 *       urn:example:animal:ferret:nose
 *
 *
 */

var URI = function () {
  /**
   * @internal
   */
  function URI(schemeOrData, authority, path, query, fragment) {
    if (typeof schemeOrData === 'object') {
      this.scheme = schemeOrData.scheme || _empty;
      this.authority = schemeOrData.authority || _empty;
      this.path = schemeOrData.path || _empty;
      this.query = schemeOrData.query || _empty;
      this.fragment = schemeOrData.fragment || _empty; // no validation because it's this URI
      // that creates uri components.
      // _validateUri(this);
    } else {
      this.scheme = schemeOrData || _empty;
      this.authority = authority || _empty;
      this.path = _referenceResolution(this.scheme, path || _empty);
      this.query = query || _empty;
      this.fragment = fragment || _empty;

      _validateUri(this);
    }
  }

  URI.isUri = function (thing) {
    if (thing instanceof URI) {
      return true;
    }

    if (!thing) {
      return false;
    }

    return typeof thing.authority === 'string' && typeof thing.fragment === 'string' && typeof thing.path === 'string' && typeof thing.query === 'string' && typeof thing.scheme === 'string';
  };

  Object.defineProperty(URI.prototype, "fsPath", {
    // ---- filesystem path -----------------------

    /**
     * Returns a string representing the corresponding file system path of this URI.
     * Will handle UNC paths and normalize windows drive letters to lower-case. Also
     * uses the platform specific path separator. Will *not* validate the path for
     * invalid characters and semantics. Will *not* look at the scheme of this URI.
     */
    get: function () {
      return _makeFsPath(this);
    },
    enumerable: true,
    configurable: true
  }); // ---- modify to new -------------------------

  URI.prototype.with = function (change) {
    if (!change) {
      return this;
    }

    var scheme = change.scheme,
        authority = change.authority,
        path = change.path,
        query = change.query,
        fragment = change.fragment;

    if (scheme === void 0) {
      scheme = this.scheme;
    } else if (scheme === null) {
      scheme = _empty;
    }

    if (authority === void 0) {
      authority = this.authority;
    } else if (authority === null) {
      authority = _empty;
    }

    if (path === void 0) {
      path = this.path;
    } else if (path === null) {
      path = _empty;
    }

    if (query === void 0) {
      query = this.query;
    } else if (query === null) {
      query = _empty;
    }

    if (fragment === void 0) {
      fragment = this.fragment;
    } else if (fragment === null) {
      fragment = _empty;
    }

    if (scheme === this.scheme && authority === this.authority && path === this.path && query === this.query && fragment === this.fragment) {
      return this;
    }

    return new _URI(scheme, authority, path, query, fragment);
  }; // ---- parse & validate ------------------------


  URI.parse = function (value) {
    var match = _regexp.exec(value);

    if (!match) {
      return new _URI(_empty, _empty, _empty, _empty, _empty);
    }

    return new _URI(match[2] || _empty, decodeURIComponent(match[4] || _empty), decodeURIComponent(match[5] || _empty), decodeURIComponent(match[7] || _empty), decodeURIComponent(match[9] || _empty));
  };

  URI.file = function (path) {
    var authority = _empty; // normalize to fwd-slashes on windows,
    // on other systems bwd-slashes are valid
    // filename character, eg /f\oo/ba\r.txt

    if (isWindows) {
      path = path.replace(/\\/g, _slash);
    } // check for authority as used in UNC shares
    // or use the path as given


    if (path[0] === _slash && path[1] === _slash) {
      var idx = path.indexOf(_slash, 2);

      if (idx === -1) {
        authority = path.substring(2);
        path = _slash;
      } else {
        authority = path.substring(2, idx);
        path = path.substring(idx) || _slash;
      }
    }

    return new _URI('file', authority, path, _empty, _empty);
  };

  URI.from = function (components) {
    return new _URI(components.scheme, components.authority, components.path, components.query, components.fragment);
  }; // ---- printing/externalize ---------------------------

  /**
   *
   * @param skipEncoding Do not encode the result, default is `false`
   */


  URI.prototype.toString = function (skipEncoding) {
    if (skipEncoding === void 0) {
      skipEncoding = false;
    }

    return _asFormatted(this, skipEncoding);
  };

  URI.prototype.toJSON = function () {
    return this;
  };

  URI.revive = function (data) {
    if (!data) {
      return data;
    } else if (data instanceof URI) {
      return data;
    } else {
      var result = new _URI(data);
      result._fsPath = data.fsPath;
      result._formatted = data.external;
      return result;
    }
  };

  return URI;
}();

var _default = URI; // tslint:disable-next-line:class-name

exports.default = _default;

var _URI = function (_super) {
  __extends(_URI, _super);

  function _URI() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this._formatted = null;
    _this._fsPath = null;
    return _this;
  }

  Object.defineProperty(_URI.prototype, "fsPath", {
    get: function () {
      if (!this._fsPath) {
        this._fsPath = _makeFsPath(this);
      }

      return this._fsPath;
    },
    enumerable: true,
    configurable: true
  });

  _URI.prototype.toString = function (skipEncoding) {
    if (skipEncoding === void 0) {
      skipEncoding = false;
    }

    if (!skipEncoding) {
      if (!this._formatted) {
        this._formatted = _asFormatted(this, false);
      }

      return this._formatted;
    } else {
      // we don't cache that
      return _asFormatted(this, true);
    }
  };

  _URI.prototype.toJSON = function () {
    var res = {
      $mid: 1
    }; // cached state

    if (this._fsPath) {
      res.fsPath = this._fsPath;
    }

    if (this._formatted) {
      res.external = this._formatted;
    } // uri components


    if (this.path) {
      res.path = this.path;
    }

    if (this.scheme) {
      res.scheme = this.scheme;
    }

    if (this.authority) {
      res.authority = this.authority;
    }

    if (this.query) {
      res.query = this.query;
    }

    if (this.fragment) {
      res.fragment = this.fragment;
    }

    return res;
  };

  return _URI;
}(URI); // reserved characters: https://tools.ietf.org/html/rfc3986#section-2.2


var encodeTable = (_a = {}, _a[58
/* Colon */
] = '%3A', _a[47
/* Slash */
] = '%2F', _a[63
/* QuestionMark */
] = '%3F', _a[35
/* Hash */
] = '%23', _a[91
/* OpenSquareBracket */
] = '%5B', _a[93
/* CloseSquareBracket */
] = '%5D', _a[64
/* AtSign */
] = '%40', _a[33
/* ExclamationMark */
] = '%21', _a[36
/* DollarSign */
] = '%24', _a[38
/* Ampersand */
] = '%26', _a[39
/* SingleQuote */
] = '%27', _a[40
/* OpenParen */
] = '%28', _a[41
/* CloseParen */
] = '%29', _a[42
/* Asterisk */
] = '%2A', _a[43
/* Plus */
] = '%2B', _a[44
/* Comma */
] = '%2C', _a[59
/* Semicolon */
] = '%3B', _a[61
/* Equals */
] = '%3D', _a[32
/* Space */
] = '%20', _a);

function encodeURIComponentFast(uriComponent, allowSlash) {
  var res = undefined;
  var nativeEncodePos = -1;

  for (var pos = 0; pos < uriComponent.length; pos++) {
    var code = uriComponent.charCodeAt(pos); // unreserved characters: https://tools.ietf.org/html/rfc3986#section-2.3

    if (code >= 97
    /* a */
    && code <= 122
    /* z */
    || code >= 65
    /* A */
    && code <= 90
    /* Z */
    || code >= 48
    /* Digit0 */
    && code <= 57
    /* Digit9 */
    || code === 45
    /* Dash */
    || code === 46
    /* Period */
    || code === 95
    /* Underline */
    || code === 126
    /* Tilde */
    || allowSlash && code === 47
    /* Slash */
    ) {
      // check if we are delaying native encode
      if (nativeEncodePos !== -1) {
        res += encodeURIComponent(uriComponent.substring(nativeEncodePos, pos));
        nativeEncodePos = -1;
      } // check if we write into a new string (by default we try to return the param)


      if (res !== undefined) {
        res += uriComponent.charAt(pos);
      }
    } else {
      // encoding needed, we need to allocate a new string
      if (res === undefined) {
        res = uriComponent.substr(0, pos);
      } // check with default table first


      var escaped = encodeTable[code];

      if (escaped !== undefined) {
        // check if we are delaying native encode
        if (nativeEncodePos !== -1) {
          res += encodeURIComponent(uriComponent.substring(nativeEncodePos, pos));
          nativeEncodePos = -1;
        } // append escaped variant to result


        res += escaped;
      } else if (nativeEncodePos === -1) {
        // use native encode only when needed
        nativeEncodePos = pos;
      }
    }
  }

  if (nativeEncodePos !== -1) {
    res += encodeURIComponent(uriComponent.substring(nativeEncodePos));
  }

  return res !== undefined ? res : uriComponent;
}

function encodeURIComponentMinimal(path) {
  var res = undefined;

  for (var pos = 0; pos < path.length; pos++) {
    var code = path.charCodeAt(pos);

    if (code === 35
    /* Hash */
    || code === 63
    /* QuestionMark */
    ) {
        if (res === undefined) {
          res = path.substr(0, pos);
        }

        res += encodeTable[code];
      } else {
      if (res !== undefined) {
        res += path[pos];
      }
    }
  }

  return res !== undefined ? res : path;
}
/**
 * Compute `fsPath` for the given uri
 * @param uri
 */


function _makeFsPath(uri) {
  var value;

  if (uri.authority && uri.path.length > 1 && uri.scheme === 'file') {
    // unc path: file://shares/c$/far/boo
    value = "//" + uri.authority + uri.path;
  } else if (uri.path.charCodeAt(0) === 47
  /* Slash */
  && (uri.path.charCodeAt(1) >= 65
  /* A */
  && uri.path.charCodeAt(1) <= 90
  /* Z */
  || uri.path.charCodeAt(1) >= 97
  /* a */
  && uri.path.charCodeAt(1) <= 122
  /* z */
  ) && uri.path.charCodeAt(2) === 58
  /* Colon */
  ) {
      // windows drive letter: file:///c:/far/boo
      value = uri.path[1].toLowerCase() + uri.path.substr(2);
    } else {
    // other path
    value = uri.path;
  }

  if (isWindows) {
    value = value.replace(/\//g, '\\');
  }

  return value;
}
/**
 * Create the external version of a uri
 */


function _asFormatted(uri, skipEncoding) {
  var encoder = !skipEncoding ? encodeURIComponentFast : encodeURIComponentMinimal;
  var res = '';
  var scheme = uri.scheme,
      authority = uri.authority,
      path = uri.path,
      query = uri.query,
      fragment = uri.fragment;

  if (scheme) {
    res += scheme;
    res += ':';
  }

  if (authority || scheme === 'file') {
    res += _slash;
    res += _slash;
  }

  if (authority) {
    var idx = authority.indexOf('@');

    if (idx !== -1) {
      // <user>@<auth>
      var userinfo = authority.substr(0, idx);
      authority = authority.substr(idx + 1);
      idx = userinfo.indexOf(':');

      if (idx === -1) {
        res += encoder(userinfo, false);
      } else {
        // <user>:<pass>@<auth>
        res += encoder(userinfo.substr(0, idx), false);
        res += ':';
        res += encoder(userinfo.substr(idx + 1), false);
      }

      res += '@';
    }

    authority = authority.toLowerCase();
    idx = authority.indexOf(':');

    if (idx === -1) {
      res += encoder(authority, false);
    } else {
      // <auth>:<port>
      res += encoder(authority.substr(0, idx), false);
      res += authority.substr(idx);
    }
  }

  if (path) {
    // lower-case windows drive letters in /C:/fff or C:/fff
    if (path.length >= 3 && path.charCodeAt(0) === 47
    /* Slash */
    && path.charCodeAt(2) === 58
    /* Colon */
    ) {
        var code = path.charCodeAt(1);

        if (code >= 65
        /* A */
        && code <= 90
        /* Z */
        ) {
            path = "/" + String.fromCharCode(code + 32) + ":" + path.substr(3); // "/c:".length === 3
          }
      } else if (path.length >= 2 && path.charCodeAt(1) === 58
    /* Colon */
    ) {
        var code = path.charCodeAt(0);

        if (code >= 65
        /* A */
        && code <= 90
        /* Z */
        ) {
            path = String.fromCharCode(code + 32) + ":" + path.substr(2); // "/c:".length === 3
          }
      } // encode the rest of the path


    res += encoder(path, true);
  }

  if (query) {
    res += '?';
    res += encoder(query, false);
  }

  if (fragment) {
    res += '#';
    res += encoder(fragment, false);
  }

  return res;
}

var _a;
},{"process":"node_modules/process/browser.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/parser/jsonParser.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asSchema = asSchema;
exports.newJSONDocument = newJSONDocument;
exports.getNodeValue = getNodeValue;
exports.getNodePath = getNodePath;
exports.contains = contains;
exports.parse = parse;
exports.JSONDocument = exports.ValidationResult = exports.EnumMatch = exports.ObjectASTNodeImpl = exports.PropertyASTNodeImpl = exports.StringASTNodeImpl = exports.NumberASTNodeImpl = exports.ArrayASTNodeImpl = exports.BooleanASTNodeImpl = exports.NullASTNodeImpl = exports.ASTNodeImpl = void 0;

var Json = _interopRequireWildcard(require("./../../jsonc-parser/main.js"));

var objects = _interopRequireWildcard(require("../utils/objects.js"));

var _jsonLanguageTypes = require("../jsonLanguageTypes.js");

var nls = _interopRequireWildcard(require("./../../../fillers/vscode-nls.js"));

var _index = _interopRequireDefault(require("./../../vscode-uri/index.js"));

var _main2 = require("./../../vscode-languageserver-types/main.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var localize = nls.loadMessageBundle();
var colorHexPattern = /^#([0-9A-Fa-f]{3,4}|([0-9A-Fa-f]{2}){3,4})$/;
var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var ASTNodeImpl =
/** @class */
function () {
  function ASTNodeImpl(parent, offset, length) {
    this.offset = offset;
    this.length = length;
    this.parent = parent;
  }

  Object.defineProperty(ASTNodeImpl.prototype, "children", {
    get: function () {
      return [];
    },
    enumerable: true,
    configurable: true
  });

  ASTNodeImpl.prototype.toString = function () {
    return 'type: ' + this.type + ' (' + this.offset + '/' + this.length + ')' + (this.parent ? ' parent: {' + this.parent.toString() + '}' : '');
  };

  return ASTNodeImpl;
}();

exports.ASTNodeImpl = ASTNodeImpl;

var NullASTNodeImpl =
/** @class */
function (_super) {
  __extends(NullASTNodeImpl, _super);

  function NullASTNodeImpl(parent, offset) {
    var _this = _super.call(this, parent, offset) || this;

    _this.type = 'null';
    _this.value = null;
    return _this;
  }

  return NullASTNodeImpl;
}(ASTNodeImpl);

exports.NullASTNodeImpl = NullASTNodeImpl;

var BooleanASTNodeImpl =
/** @class */
function (_super) {
  __extends(BooleanASTNodeImpl, _super);

  function BooleanASTNodeImpl(parent, boolValue, offset) {
    var _this = _super.call(this, parent, offset) || this;

    _this.type = 'boolean';
    _this.value = boolValue;
    return _this;
  }

  return BooleanASTNodeImpl;
}(ASTNodeImpl);

exports.BooleanASTNodeImpl = BooleanASTNodeImpl;

var ArrayASTNodeImpl =
/** @class */
function (_super) {
  __extends(ArrayASTNodeImpl, _super);

  function ArrayASTNodeImpl(parent, offset) {
    var _this = _super.call(this, parent, offset) || this;

    _this.type = 'array';
    _this.items = [];
    return _this;
  }

  Object.defineProperty(ArrayASTNodeImpl.prototype, "children", {
    get: function () {
      return this.items;
    },
    enumerable: true,
    configurable: true
  });
  return ArrayASTNodeImpl;
}(ASTNodeImpl);

exports.ArrayASTNodeImpl = ArrayASTNodeImpl;

var NumberASTNodeImpl =
/** @class */
function (_super) {
  __extends(NumberASTNodeImpl, _super);

  function NumberASTNodeImpl(parent, offset) {
    var _this = _super.call(this, parent, offset) || this;

    _this.type = 'number';
    _this.isInteger = true;
    _this.value = Number.NaN;
    return _this;
  }

  return NumberASTNodeImpl;
}(ASTNodeImpl);

exports.NumberASTNodeImpl = NumberASTNodeImpl;

var StringASTNodeImpl =
/** @class */
function (_super) {
  __extends(StringASTNodeImpl, _super);

  function StringASTNodeImpl(parent, offset, length) {
    var _this = _super.call(this, parent, offset, length) || this;

    _this.type = 'string';
    _this.value = '';
    return _this;
  }

  return StringASTNodeImpl;
}(ASTNodeImpl);

exports.StringASTNodeImpl = StringASTNodeImpl;

var PropertyASTNodeImpl =
/** @class */
function (_super) {
  __extends(PropertyASTNodeImpl, _super);

  function PropertyASTNodeImpl(parent, offset) {
    var _this = _super.call(this, parent, offset) || this;

    _this.type = 'property';
    _this.colonOffset = -1;
    return _this;
  }

  Object.defineProperty(PropertyASTNodeImpl.prototype, "children", {
    get: function () {
      return this.valueNode ? [this.keyNode, this.valueNode] : [this.keyNode];
    },
    enumerable: true,
    configurable: true
  });
  return PropertyASTNodeImpl;
}(ASTNodeImpl);

exports.PropertyASTNodeImpl = PropertyASTNodeImpl;

var ObjectASTNodeImpl =
/** @class */
function (_super) {
  __extends(ObjectASTNodeImpl, _super);

  function ObjectASTNodeImpl(parent, offset) {
    var _this = _super.call(this, parent, offset) || this;

    _this.type = 'object';
    _this.properties = [];
    return _this;
  }

  Object.defineProperty(ObjectASTNodeImpl.prototype, "children", {
    get: function () {
      return this.properties;
    },
    enumerable: true,
    configurable: true
  });
  return ObjectASTNodeImpl;
}(ASTNodeImpl);

exports.ObjectASTNodeImpl = ObjectASTNodeImpl;

function asSchema(schema) {
  if (typeof schema === 'boolean') {
    return schema ? {} : {
      "not": {}
    };
  }

  return schema;
}

var EnumMatch;
exports.EnumMatch = EnumMatch;

(function (EnumMatch) {
  EnumMatch[EnumMatch["Key"] = 0] = "Key";
  EnumMatch[EnumMatch["Enum"] = 1] = "Enum";
})(EnumMatch || (exports.EnumMatch = EnumMatch = {}));

var SchemaCollector =
/** @class */
function () {
  function SchemaCollector(focusOffset, exclude) {
    if (focusOffset === void 0) {
      focusOffset = -1;
    }

    if (exclude === void 0) {
      exclude = null;
    }

    this.focusOffset = focusOffset;
    this.exclude = exclude;
    this.schemas = [];
  }

  SchemaCollector.prototype.add = function (schema) {
    this.schemas.push(schema);
  };

  SchemaCollector.prototype.merge = function (other) {
    var _a;

    (_a = this.schemas).push.apply(_a, other.schemas);
  };

  SchemaCollector.prototype.include = function (node) {
    return (this.focusOffset === -1 || contains(node, this.focusOffset)) && node !== this.exclude;
  };

  SchemaCollector.prototype.newSub = function () {
    return new SchemaCollector(-1, this.exclude);
  };

  return SchemaCollector;
}();

var NoOpSchemaCollector =
/** @class */
function () {
  function NoOpSchemaCollector() {}

  Object.defineProperty(NoOpSchemaCollector.prototype, "schemas", {
    get: function () {
      return [];
    },
    enumerable: true,
    configurable: true
  });

  NoOpSchemaCollector.prototype.add = function (schema) {};

  NoOpSchemaCollector.prototype.merge = function (other) {};

  NoOpSchemaCollector.prototype.include = function (node) {
    return true;
  };

  NoOpSchemaCollector.prototype.newSub = function () {
    return this;
  };

  NoOpSchemaCollector.instance = new NoOpSchemaCollector();
  return NoOpSchemaCollector;
}();

var ValidationResult =
/** @class */
function () {
  function ValidationResult() {
    this.problems = [];
    this.propertiesMatches = 0;
    this.propertiesValueMatches = 0;
    this.primaryValueMatches = 0;
    this.enumValueMatch = false;
    this.enumValues = null;
  }

  ValidationResult.prototype.hasProblems = function () {
    return !!this.problems.length;
  };

  ValidationResult.prototype.mergeAll = function (validationResults) {
    var _this = this;

    validationResults.forEach(function (validationResult) {
      _this.merge(validationResult);
    });
  };

  ValidationResult.prototype.merge = function (validationResult) {
    this.problems = this.problems.concat(validationResult.problems);
  };

  ValidationResult.prototype.mergeEnumValues = function (validationResult) {
    if (!this.enumValueMatch && !validationResult.enumValueMatch && this.enumValues && validationResult.enumValues) {
      this.enumValues = this.enumValues.concat(validationResult.enumValues);

      for (var _i = 0, _a = this.problems; _i < _a.length; _i++) {
        var error = _a[_i];

        if (error.code === _jsonLanguageTypes.ErrorCode.EnumValueMismatch) {
          error.message = localize('enumWarning', 'Value is not accepted. Valid values: {0}.', this.enumValues.map(function (v) {
            return JSON.stringify(v);
          }).join(', '));
        }
      }
    }
  };

  ValidationResult.prototype.mergePropertyMatch = function (propertyValidationResult) {
    this.merge(propertyValidationResult);
    this.propertiesMatches++;

    if (propertyValidationResult.enumValueMatch || !propertyValidationResult.hasProblems() && propertyValidationResult.propertiesMatches) {
      this.propertiesValueMatches++;
    }

    if (propertyValidationResult.enumValueMatch && propertyValidationResult.enumValues && propertyValidationResult.enumValues.length === 1) {
      this.primaryValueMatches++;
    }
  };

  ValidationResult.prototype.compare = function (other) {
    var hasProblems = this.hasProblems();

    if (hasProblems !== other.hasProblems()) {
      return hasProblems ? -1 : 1;
    }

    if (this.enumValueMatch !== other.enumValueMatch) {
      return other.enumValueMatch ? -1 : 1;
    }

    if (this.primaryValueMatches !== other.primaryValueMatches) {
      return this.primaryValueMatches - other.primaryValueMatches;
    }

    if (this.propertiesValueMatches !== other.propertiesValueMatches) {
      return this.propertiesValueMatches - other.propertiesValueMatches;
    }

    return this.propertiesMatches - other.propertiesMatches;
  };

  return ValidationResult;
}();

exports.ValidationResult = ValidationResult;

function newJSONDocument(root, diagnostics) {
  if (diagnostics === void 0) {
    diagnostics = [];
  }

  return new JSONDocument(root, diagnostics, []);
}

function getNodeValue(node) {
  return Json.getNodeValue(node);
}

function getNodePath(node) {
  return Json.getNodePath(node);
}

function contains(node, offset, includeRightBound) {
  if (includeRightBound === void 0) {
    includeRightBound = false;
  }

  return offset >= node.offset && offset < node.offset + node.length || includeRightBound && offset === node.offset + node.length;
}

var JSONDocument =
/** @class */
function () {
  function JSONDocument(root, syntaxErrors, comments) {
    if (syntaxErrors === void 0) {
      syntaxErrors = [];
    }

    if (comments === void 0) {
      comments = [];
    }

    this.root = root;
    this.syntaxErrors = syntaxErrors;
    this.comments = comments;
  }

  JSONDocument.prototype.getNodeFromOffset = function (offset, includeRightBound) {
    if (includeRightBound === void 0) {
      includeRightBound = false;
    }

    if (this.root) {
      return Json.findNodeAtOffset(this.root, offset, includeRightBound);
    }

    return void 0;
  };

  JSONDocument.prototype.visit = function (visitor) {
    if (this.root) {
      var doVisit_1 = function (node) {
        var ctn = visitor(node);
        var children = node.children;

        if (Array.isArray(children)) {
          for (var i = 0; i < children.length && ctn; i++) {
            ctn = doVisit_1(children[i]);
          }
        }

        return ctn;
      };

      doVisit_1(this.root);
    }
  };

  JSONDocument.prototype.validate = function (textDocument, schema) {
    if (this.root && schema) {
      var validationResult = new ValidationResult();
      validate(this.root, schema, validationResult, NoOpSchemaCollector.instance);
      return validationResult.problems.map(function (p) {
        var range = _main2.Range.create(textDocument.positionAt(p.location.offset), textDocument.positionAt(p.location.offset + p.location.length));

        return _main2.Diagnostic.create(range, p.message, p.severity, p.code);
      });
    }

    return null;
  };

  JSONDocument.prototype.getMatchingSchemas = function (schema, focusOffset, exclude) {
    if (focusOffset === void 0) {
      focusOffset = -1;
    }

    if (exclude === void 0) {
      exclude = null;
    }

    var matchingSchemas = new SchemaCollector(focusOffset, exclude);

    if (this.root && schema) {
      validate(this.root, schema, new ValidationResult(), matchingSchemas);
    }

    return matchingSchemas.schemas;
  };

  return JSONDocument;
}();

exports.JSONDocument = JSONDocument;

function validate(node, schema, validationResult, matchingSchemas) {
  if (!node || !matchingSchemas.include(node)) {
    return;
  }

  switch (node.type) {
    case 'object':
      _validateObjectNode(node, schema, validationResult, matchingSchemas);

      break;

    case 'array':
      _validateArrayNode(node, schema, validationResult, matchingSchemas);

      break;

    case 'string':
      _validateStringNode(node, schema, validationResult, matchingSchemas);

      break;

    case 'number':
      _validateNumberNode(node, schema, validationResult, matchingSchemas);

      break;

    case 'property':
      return validate(node.valueNode, schema, validationResult, matchingSchemas);
  }

  _validateNode();

  matchingSchemas.add({
    node: node,
    schema: schema
  });

  function _validateNode() {
    function matchesType(type) {
      return node.type === type || type === 'integer' && node.type === 'number' && node.isInteger;
    }

    if (Array.isArray(schema.type)) {
      if (!schema.type.some(matchesType)) {
        validationResult.problems.push({
          location: {
            offset: node.offset,
            length: node.length
          },
          severity: _main2.DiagnosticSeverity.Warning,
          message: schema.errorMessage || localize('typeArrayMismatchWarning', 'Incorrect type. Expected one of {0}.', schema.type.join(', '))
        });
      }
    } else if (schema.type) {
      if (!matchesType(schema.type)) {
        validationResult.problems.push({
          location: {
            offset: node.offset,
            length: node.length
          },
          severity: _main2.DiagnosticSeverity.Warning,
          message: schema.errorMessage || localize('typeMismatchWarning', 'Incorrect type. Expected "{0}".', schema.type)
        });
      }
    }

    if (Array.isArray(schema.allOf)) {
      schema.allOf.forEach(function (subSchemaRef) {
        validate(node, asSchema(subSchemaRef), validationResult, matchingSchemas);
      });
    }

    var notSchema = asSchema(schema.not);

    if (notSchema) {
      var subValidationResult = new ValidationResult();
      var subMatchingSchemas = matchingSchemas.newSub();
      validate(node, notSchema, subValidationResult, subMatchingSchemas);

      if (!subValidationResult.hasProblems()) {
        validationResult.problems.push({
          location: {
            offset: node.offset,
            length: node.length
          },
          severity: _main2.DiagnosticSeverity.Warning,
          message: localize('notSchemaWarning', "Matches a schema that is not allowed.")
        });
      }

      subMatchingSchemas.schemas.forEach(function (ms) {
        ms.inverted = !ms.inverted;
        matchingSchemas.add(ms);
      });
    }

    var testAlternatives = function (alternatives, maxOneMatch) {
      var matches = []; // remember the best match that is used for error messages

      var bestMatch = null;
      alternatives.forEach(function (subSchemaRef) {
        var subSchema = asSchema(subSchemaRef);
        var subValidationResult = new ValidationResult();
        var subMatchingSchemas = matchingSchemas.newSub();
        validate(node, subSchema, subValidationResult, subMatchingSchemas);

        if (!subValidationResult.hasProblems()) {
          matches.push(subSchema);
        }

        if (!bestMatch) {
          bestMatch = {
            schema: subSchema,
            validationResult: subValidationResult,
            matchingSchemas: subMatchingSchemas
          };
        } else {
          if (!maxOneMatch && !subValidationResult.hasProblems() && !bestMatch.validationResult.hasProblems()) {
            // no errors, both are equally good matches
            bestMatch.matchingSchemas.merge(subMatchingSchemas);
            bestMatch.validationResult.propertiesMatches += subValidationResult.propertiesMatches;
            bestMatch.validationResult.propertiesValueMatches += subValidationResult.propertiesValueMatches;
          } else {
            var compareResult = subValidationResult.compare(bestMatch.validationResult);

            if (compareResult > 0) {
              // our node is the best matching so far
              bestMatch = {
                schema: subSchema,
                validationResult: subValidationResult,
                matchingSchemas: subMatchingSchemas
              };
            } else if (compareResult === 0) {
              // there's already a best matching but we are as good
              bestMatch.matchingSchemas.merge(subMatchingSchemas);
              bestMatch.validationResult.mergeEnumValues(subValidationResult);
            }
          }
        }
      });

      if (matches.length > 1 && maxOneMatch) {
        validationResult.problems.push({
          location: {
            offset: node.offset,
            length: 1
          },
          severity: _main2.DiagnosticSeverity.Warning,
          message: localize('oneOfWarning', "Matches multiple schemas when only one must validate.")
        });
      }

      if (bestMatch !== null) {
        validationResult.merge(bestMatch.validationResult);
        validationResult.propertiesMatches += bestMatch.validationResult.propertiesMatches;
        validationResult.propertiesValueMatches += bestMatch.validationResult.propertiesValueMatches;
        matchingSchemas.merge(bestMatch.matchingSchemas);
      }

      return matches.length;
    };

    if (Array.isArray(schema.anyOf)) {
      testAlternatives(schema.anyOf, false);
    }

    if (Array.isArray(schema.oneOf)) {
      testAlternatives(schema.oneOf, true);
    }

    var testBranch = function (schema) {
      var subSchema = asSchema(schema);
      var subValidationResult = new ValidationResult();
      var subMatchingSchemas = matchingSchemas.newSub();
      validate(node, subSchema, subValidationResult, subMatchingSchemas);
      validationResult.merge(subValidationResult);
      validationResult.propertiesMatches += subValidationResult.propertiesMatches;
      validationResult.propertiesValueMatches += subValidationResult.propertiesValueMatches;
      matchingSchemas.merge(subMatchingSchemas);
    };

    var testCondition = function (ifSchema, thenSchema, elseSchema) {
      var subSchema = asSchema(ifSchema);
      var subValidationResult = new ValidationResult();
      var subMatchingSchemas = matchingSchemas.newSub();
      validate(node, subSchema, subValidationResult, subMatchingSchemas);

      if (!subValidationResult.hasProblems()) {
        if (thenSchema) {
          testBranch(thenSchema);
        }
      } else if (elseSchema) {
        testBranch(elseSchema);
      }
    };

    if (schema.if) {
      testCondition(schema.if, schema.then, schema.else);
    }

    if (Array.isArray(schema.enum)) {
      var val = getNodeValue(node);
      var enumValueMatch = false;

      for (var _i = 0, _a = schema.enum; _i < _a.length; _i++) {
        var e = _a[_i];

        if (objects.equals(val, e)) {
          enumValueMatch = true;
          break;
        }
      }

      validationResult.enumValues = schema.enum;
      validationResult.enumValueMatch = enumValueMatch;

      if (!enumValueMatch) {
        validationResult.problems.push({
          location: {
            offset: node.offset,
            length: node.length
          },
          severity: _main2.DiagnosticSeverity.Warning,
          code: _jsonLanguageTypes.ErrorCode.EnumValueMismatch,
          message: schema.errorMessage || localize('enumWarning', 'Value is not accepted. Valid values: {0}.', schema.enum.map(function (v) {
            return JSON.stringify(v);
          }).join(', '))
        });
      }
    }

    if (schema.const) {
      var val = getNodeValue(node);

      if (!objects.equals(val, schema.const)) {
        validationResult.problems.push({
          location: {
            offset: node.offset,
            length: node.length
          },
          severity: _main2.DiagnosticSeverity.Warning,
          code: _jsonLanguageTypes.ErrorCode.EnumValueMismatch,
          message: schema.errorMessage || localize('constWarning', 'Value must be {0}.', JSON.stringify(schema.const))
        });
        validationResult.enumValueMatch = false;
      } else {
        validationResult.enumValueMatch = true;
      }

      validationResult.enumValues = [schema.const];
    }

    if (schema.deprecationMessage && node.parent) {
      validationResult.problems.push({
        location: {
          offset: node.parent.offset,
          length: node.parent.length
        },
        severity: _main2.DiagnosticSeverity.Warning,
        message: schema.deprecationMessage
      });
    }
  }

  function _validateNumberNode(node, schema, validationResult, matchingSchemas) {
    var val = node.value;

    if (typeof schema.multipleOf === 'number') {
      if (val % schema.multipleOf !== 0) {
        validationResult.problems.push({
          location: {
            offset: node.offset,
            length: node.length
          },
          severity: _main2.DiagnosticSeverity.Warning,
          message: localize('multipleOfWarning', 'Value is not divisible by {0}.', schema.multipleOf)
        });
      }
    }

    function getExclusiveLimit(limit, exclusive) {
      if (typeof exclusive === 'number') {
        return exclusive;
      }

      if (typeof exclusive === 'boolean' && exclusive) {
        return limit;
      }

      return void 0;
    }

    function getLimit(limit, exclusive) {
      if (typeof exclusive !== 'boolean' || !exclusive) {
        return limit;
      }

      return void 0;
    }

    var exclusiveMinimum = getExclusiveLimit(schema.minimum, schema.exclusiveMinimum);

    if (typeof exclusiveMinimum === 'number' && val <= exclusiveMinimum) {
      validationResult.problems.push({
        location: {
          offset: node.offset,
          length: node.length
        },
        severity: _main2.DiagnosticSeverity.Warning,
        message: localize('exclusiveMinimumWarning', 'Value is below the exclusive minimum of {0}.', exclusiveMinimum)
      });
    }

    var exclusiveMaximum = getExclusiveLimit(schema.maximum, schema.exclusiveMaximum);

    if (typeof exclusiveMaximum === 'number' && val >= exclusiveMaximum) {
      validationResult.problems.push({
        location: {
          offset: node.offset,
          length: node.length
        },
        severity: _main2.DiagnosticSeverity.Warning,
        message: localize('exclusiveMaximumWarning', 'Value is above the exclusive maximum of {0}.', exclusiveMaximum)
      });
    }

    var minimum = getLimit(schema.minimum, schema.exclusiveMinimum);

    if (typeof minimum === 'number' && val < minimum) {
      validationResult.problems.push({
        location: {
          offset: node.offset,
          length: node.length
        },
        severity: _main2.DiagnosticSeverity.Warning,
        message: localize('minimumWarning', 'Value is below the minimum of {0}.', minimum)
      });
    }

    var maximum = getLimit(schema.maximum, schema.exclusiveMaximum);

    if (typeof maximum === 'number' && val > maximum) {
      validationResult.problems.push({
        location: {
          offset: node.offset,
          length: node.length
        },
        severity: _main2.DiagnosticSeverity.Warning,
        message: localize('maximumWarning', 'Value is above the maximum of {0}.', maximum)
      });
    }
  }

  function _validateStringNode(node, schema, validationResult, matchingSchemas) {
    if (schema.minLength && node.value.length < schema.minLength) {
      validationResult.problems.push({
        location: {
          offset: node.offset,
          length: node.length
        },
        severity: _main2.DiagnosticSeverity.Warning,
        message: localize('minLengthWarning', 'String is shorter than the minimum length of {0}.', schema.minLength)
      });
    }

    if (schema.maxLength && node.value.length > schema.maxLength) {
      validationResult.problems.push({
        location: {
          offset: node.offset,
          length: node.length
        },
        severity: _main2.DiagnosticSeverity.Warning,
        message: localize('maxLengthWarning', 'String is longer than the maximum length of {0}.', schema.maxLength)
      });
    }

    if (schema.pattern) {
      var regex = new RegExp(schema.pattern);

      if (!regex.test(node.value)) {
        validationResult.problems.push({
          location: {
            offset: node.offset,
            length: node.length
          },
          severity: _main2.DiagnosticSeverity.Warning,
          message: schema.patternErrorMessage || schema.errorMessage || localize('patternWarning', 'String does not match the pattern of "{0}".', schema.pattern)
        });
      }
    }

    if (schema.format) {
      switch (schema.format) {
        case 'uri':
        case 'uri-reference':
          {
            var errorMessage = void 0;

            if (!node.value) {
              errorMessage = localize('uriEmpty', 'URI expected.');
            } else {
              try {
                var uri = _index.default.parse(node.value);

                if (!uri.scheme && schema.format === 'uri') {
                  errorMessage = localize('uriSchemeMissing', 'URI with a scheme is expected.');
                }
              } catch (e) {
                errorMessage = e.message;
              }
            }

            if (errorMessage) {
              validationResult.problems.push({
                location: {
                  offset: node.offset,
                  length: node.length
                },
                severity: _main2.DiagnosticSeverity.Warning,
                message: schema.patternErrorMessage || schema.errorMessage || localize('uriFormatWarning', 'String is not a URI: {0}', errorMessage)
              });
            }
          }
          break;

        case 'email':
          {
            if (!node.value.match(emailPattern)) {
              validationResult.problems.push({
                location: {
                  offset: node.offset,
                  length: node.length
                },
                severity: _main2.DiagnosticSeverity.Warning,
                message: schema.patternErrorMessage || schema.errorMessage || localize('emailFormatWarning', 'String is not an e-mail address.')
              });
            }
          }
          break;

        case 'color-hex':
          {
            if (!node.value.match(colorHexPattern)) {
              validationResult.problems.push({
                location: {
                  offset: node.offset,
                  length: node.length
                },
                severity: _main2.DiagnosticSeverity.Warning,
                message: schema.patternErrorMessage || schema.errorMessage || localize('colorHexFormatWarning', 'Invalid color format. Use #RGB, #RGBA, #RRGGBB or #RRGGBBAA.')
              });
            }
          }
          break;

        default:
      }
    }
  }

  function _validateArrayNode(node, schema, validationResult, matchingSchemas) {
    if (Array.isArray(schema.items)) {
      var subSchemas_1 = schema.items;
      subSchemas_1.forEach(function (subSchemaRef, index) {
        var subSchema = asSchema(subSchemaRef);
        var itemValidationResult = new ValidationResult();
        var item = node.items[index];

        if (item) {
          validate(item, subSchema, itemValidationResult, matchingSchemas);
          validationResult.mergePropertyMatch(itemValidationResult);
        } else if (node.items.length >= subSchemas_1.length) {
          validationResult.propertiesValueMatches++;
        }
      });

      if (node.items.length > subSchemas_1.length) {
        if (typeof schema.additionalItems === 'object') {
          for (var i = subSchemas_1.length; i < node.items.length; i++) {
            var itemValidationResult = new ValidationResult();
            validate(node.items[i], schema.additionalItems, itemValidationResult, matchingSchemas);
            validationResult.mergePropertyMatch(itemValidationResult);
          }
        } else if (schema.additionalItems === false) {
          validationResult.problems.push({
            location: {
              offset: node.offset,
              length: node.length
            },
            severity: _main2.DiagnosticSeverity.Warning,
            message: localize('additionalItemsWarning', 'Array has too many items according to schema. Expected {0} or fewer.', subSchemas_1.length)
          });
        }
      }
    } else {
      var itemSchema_1 = asSchema(schema.items);

      if (itemSchema_1) {
        node.items.forEach(function (item) {
          var itemValidationResult = new ValidationResult();
          validate(item, itemSchema_1, itemValidationResult, matchingSchemas);
          validationResult.mergePropertyMatch(itemValidationResult);
        });
      }
    }

    var containsSchema = asSchema(schema.contains);

    if (containsSchema) {
      var doesContain = node.items.some(function (item) {
        var itemValidationResult = new ValidationResult();
        validate(item, containsSchema, itemValidationResult, NoOpSchemaCollector.instance);
        return !itemValidationResult.hasProblems();
      });

      if (!doesContain) {
        validationResult.problems.push({
          location: {
            offset: node.offset,
            length: node.length
          },
          severity: _main2.DiagnosticSeverity.Warning,
          message: schema.errorMessage || localize('requiredItemMissingWarning', 'Array does not contain required item.')
        });
      }
    }

    if (schema.minItems && node.items.length < schema.minItems) {
      validationResult.problems.push({
        location: {
          offset: node.offset,
          length: node.length
        },
        severity: _main2.DiagnosticSeverity.Warning,
        message: localize('minItemsWarning', 'Array has too few items. Expected {0} or more.', schema.minItems)
      });
    }

    if (schema.maxItems && node.items.length > schema.maxItems) {
      validationResult.problems.push({
        location: {
          offset: node.offset,
          length: node.length
        },
        severity: _main2.DiagnosticSeverity.Warning,
        message: localize('maxItemsWarning', 'Array has too many items. Expected {0} or fewer.', schema.maxItems)
      });
    }

    if (schema.uniqueItems === true) {
      var values_1 = getNodeValue(node);
      var duplicates = values_1.some(function (value, index) {
        return index !== values_1.lastIndexOf(value);
      });

      if (duplicates) {
        validationResult.problems.push({
          location: {
            offset: node.offset,
            length: node.length
          },
          severity: _main2.DiagnosticSeverity.Warning,
          message: localize('uniqueItemsWarning', 'Array has duplicate items.')
        });
      }
    }
  }

  function _validateObjectNode(node, schema, validationResult, matchingSchemas) {
    var seenKeys = Object.create(null);
    var unprocessedProperties = [];
    node.properties.forEach(function (node) {
      var key = node.keyNode.value;
      seenKeys[key] = node.valueNode;
      unprocessedProperties.push(key);
    });

    if (Array.isArray(schema.required)) {
      schema.required.forEach(function (propertyName) {
        if (!seenKeys[propertyName]) {
          var keyNode = node.parent && node.parent.type === 'property' && node.parent.keyNode;
          var location = keyNode ? {
            offset: keyNode.offset,
            length: keyNode.length
          } : {
            offset: node.offset,
            length: 1
          };
          validationResult.problems.push({
            location: location,
            severity: _main2.DiagnosticSeverity.Warning,
            message: localize('MissingRequiredPropWarning', 'Missing property "{0}".', propertyName)
          });
        }
      });
    }

    var propertyProcessed = function (prop) {
      var index = unprocessedProperties.indexOf(prop);

      while (index >= 0) {
        unprocessedProperties.splice(index, 1);
        index = unprocessedProperties.indexOf(prop);
      }
    };

    if (schema.properties) {
      Object.keys(schema.properties).forEach(function (propertyName) {
        propertyProcessed(propertyName);
        var propertySchema = schema.properties[propertyName];
        var child = seenKeys[propertyName];

        if (child) {
          if (typeof propertySchema === 'boolean') {
            if (!propertySchema) {
              var propertyNode = child.parent;
              validationResult.problems.push({
                location: {
                  offset: propertyNode.keyNode.offset,
                  length: propertyNode.keyNode.length
                },
                severity: _main2.DiagnosticSeverity.Warning,
                message: schema.errorMessage || localize('DisallowedExtraPropWarning', 'Property {0} is not allowed.', propertyName)
              });
            } else {
              validationResult.propertiesMatches++;
              validationResult.propertiesValueMatches++;
            }
          } else {
            var propertyValidationResult = new ValidationResult();
            validate(child, propertySchema, propertyValidationResult, matchingSchemas);
            validationResult.mergePropertyMatch(propertyValidationResult);
          }
        }
      });
    }

    if (schema.patternProperties) {
      Object.keys(schema.patternProperties).forEach(function (propertyPattern) {
        var regex = new RegExp(propertyPattern);
        unprocessedProperties.slice(0).forEach(function (propertyName) {
          if (regex.test(propertyName)) {
            propertyProcessed(propertyName);
            var child = seenKeys[propertyName];

            if (child) {
              var propertySchema = schema.patternProperties[propertyPattern];

              if (typeof propertySchema === 'boolean') {
                if (!propertySchema) {
                  var propertyNode = child.parent;
                  validationResult.problems.push({
                    location: {
                      offset: propertyNode.keyNode.offset,
                      length: propertyNode.keyNode.length
                    },
                    severity: _main2.DiagnosticSeverity.Warning,
                    message: schema.errorMessage || localize('DisallowedExtraPropWarning', 'Property {0} is not allowed.', propertyName)
                  });
                } else {
                  validationResult.propertiesMatches++;
                  validationResult.propertiesValueMatches++;
                }
              } else {
                var propertyValidationResult = new ValidationResult();
                validate(child, propertySchema, propertyValidationResult, matchingSchemas);
                validationResult.mergePropertyMatch(propertyValidationResult);
              }
            }
          }
        });
      });
    }

    if (typeof schema.additionalProperties === 'object') {
      unprocessedProperties.forEach(function (propertyName) {
        var child = seenKeys[propertyName];

        if (child) {
          var propertyValidationResult = new ValidationResult();
          validate(child, schema.additionalProperties, propertyValidationResult, matchingSchemas);
          validationResult.mergePropertyMatch(propertyValidationResult);
        }
      });
    } else if (schema.additionalProperties === false) {
      if (unprocessedProperties.length > 0) {
        unprocessedProperties.forEach(function (propertyName) {
          var child = seenKeys[propertyName];

          if (child) {
            var propertyNode = child.parent;
            validationResult.problems.push({
              location: {
                offset: propertyNode.keyNode.offset,
                length: propertyNode.keyNode.length
              },
              severity: _main2.DiagnosticSeverity.Warning,
              message: schema.errorMessage || localize('DisallowedExtraPropWarning', 'Property {0} is not allowed.', propertyName)
            });
          }
        });
      }
    }

    if (schema.maxProperties) {
      if (node.properties.length > schema.maxProperties) {
        validationResult.problems.push({
          location: {
            offset: node.offset,
            length: node.length
          },
          severity: _main2.DiagnosticSeverity.Warning,
          message: localize('MaxPropWarning', 'Object has more properties than limit of {0}.', schema.maxProperties)
        });
      }
    }

    if (schema.minProperties) {
      if (node.properties.length < schema.minProperties) {
        validationResult.problems.push({
          location: {
            offset: node.offset,
            length: node.length
          },
          severity: _main2.DiagnosticSeverity.Warning,
          message: localize('MinPropWarning', 'Object has fewer properties than the required number of {0}', schema.minProperties)
        });
      }
    }

    if (schema.dependencies) {
      Object.keys(schema.dependencies).forEach(function (key) {
        var prop = seenKeys[key];

        if (prop) {
          var propertyDep = schema.dependencies[key];

          if (Array.isArray(propertyDep)) {
            propertyDep.forEach(function (requiredProp) {
              if (!seenKeys[requiredProp]) {
                validationResult.problems.push({
                  location: {
                    offset: node.offset,
                    length: node.length
                  },
                  severity: _main2.DiagnosticSeverity.Warning,
                  message: localize('RequiredDependentPropWarning', 'Object is missing property {0} required by property {1}.', requiredProp, key)
                });
              } else {
                validationResult.propertiesValueMatches++;
              }
            });
          } else {
            var propertySchema = asSchema(propertyDep);

            if (propertySchema) {
              var propertyValidationResult = new ValidationResult();
              validate(node, propertySchema, propertyValidationResult, matchingSchemas);
              validationResult.mergePropertyMatch(propertyValidationResult);
            }
          }
        }
      });
    }

    var propertyNames = asSchema(schema.propertyNames);

    if (propertyNames) {
      node.properties.forEach(function (f) {
        var key = f.keyNode;

        if (key) {
          validate(key, propertyNames, validationResult, NoOpSchemaCollector.instance);
        }
      });
    }
  }
}

function parse(textDocument, config) {
  var problems = [];
  var lastProblemOffset = -1;
  var text = textDocument.getText();
  var scanner = Json.createScanner(text, false);
  var commentRanges = config && config.collectComments ? [] : void 0;

  function _scanNext() {
    while (true) {
      var token_1 = scanner.scan();

      _checkScanError();

      switch (token_1) {
        case 12
        /* LineCommentTrivia */
        :
        case 13
        /* BlockCommentTrivia */
        :
          if (Array.isArray(commentRanges)) {
            commentRanges.push(_main2.Range.create(textDocument.positionAt(scanner.getTokenOffset()), textDocument.positionAt(scanner.getTokenOffset() + scanner.getTokenLength())));
          }

          break;

        case 15
        /* Trivia */
        :
        case 14
        /* LineBreakTrivia */
        :
          break;

        default:
          return token_1;
      }
    }
  }

  function _accept(token) {
    if (scanner.getToken() === token) {
      _scanNext();

      return true;
    }

    return false;
  }

  function _errorAtRange(message, code, startOffset, endOffset, severity) {
    if (severity === void 0) {
      severity = _main2.DiagnosticSeverity.Error;
    }

    if (problems.length === 0 || startOffset !== lastProblemOffset) {
      var range = _main2.Range.create(textDocument.positionAt(startOffset), textDocument.positionAt(endOffset));

      problems.push(_main2.Diagnostic.create(range, message, severity, code, textDocument.languageId));
      lastProblemOffset = startOffset;
    }
  }

  function _error(message, code, node, skipUntilAfter, skipUntil) {
    if (node === void 0) {
      node = null;
    }

    if (skipUntilAfter === void 0) {
      skipUntilAfter = [];
    }

    if (skipUntil === void 0) {
      skipUntil = [];
    }

    var start = scanner.getTokenOffset();
    var end = scanner.getTokenOffset() + scanner.getTokenLength();

    if (start === end && start > 0) {
      start--;

      while (start > 0 && /\s/.test(text.charAt(start))) {
        start--;
      }

      end = start + 1;
    }

    _errorAtRange(message, code, start, end);

    if (node) {
      _finalize(node, false);
    }

    if (skipUntilAfter.length + skipUntil.length > 0) {
      var token_2 = scanner.getToken();

      while (token_2 !== 17
      /* EOF */
      ) {
        if (skipUntilAfter.indexOf(token_2) !== -1) {
          _scanNext();

          break;
        } else if (skipUntil.indexOf(token_2) !== -1) {
          break;
        }

        token_2 = _scanNext();
      }
    }

    return node;
  }

  function _checkScanError() {
    switch (scanner.getTokenError()) {
      case 4
      /* InvalidUnicode */
      :
        _error(localize('InvalidUnicode', 'Invalid unicode sequence in string.'), _jsonLanguageTypes.ErrorCode.InvalidUnicode);

        return true;

      case 5
      /* InvalidEscapeCharacter */
      :
        _error(localize('InvalidEscapeCharacter', 'Invalid escape character in string.'), _jsonLanguageTypes.ErrorCode.InvalidEscapeCharacter);

        return true;

      case 3
      /* UnexpectedEndOfNumber */
      :
        _error(localize('UnexpectedEndOfNumber', 'Unexpected end of number.'), _jsonLanguageTypes.ErrorCode.UnexpectedEndOfNumber);

        return true;

      case 1
      /* UnexpectedEndOfComment */
      :
        _error(localize('UnexpectedEndOfComment', 'Unexpected end of comment.'), _jsonLanguageTypes.ErrorCode.UnexpectedEndOfComment);

        return true;

      case 2
      /* UnexpectedEndOfString */
      :
        _error(localize('UnexpectedEndOfString', 'Unexpected end of string.'), _jsonLanguageTypes.ErrorCode.UnexpectedEndOfString);

        return true;

      case 6
      /* InvalidCharacter */
      :
        _error(localize('InvalidCharacter', 'Invalid characters in string. Control characters must be escaped.'), _jsonLanguageTypes.ErrorCode.InvalidCharacter);

        return true;
    }

    return false;
  }

  function _finalize(node, scanNext) {
    node.length = scanner.getTokenOffset() + scanner.getTokenLength() - node.offset;

    if (scanNext) {
      _scanNext();
    }

    return node;
  }

  function _parseArray(parent) {
    if (scanner.getToken() !== 3
    /* OpenBracketToken */
    ) {
        return null;
      }

    var node = new ArrayASTNodeImpl(parent, scanner.getTokenOffset());

    _scanNext(); // consume OpenBracketToken


    var count = 0;
    var needsComma = false;

    while (scanner.getToken() !== 4
    /* CloseBracketToken */
    && scanner.getToken() !== 17
    /* EOF */
    ) {
      if (scanner.getToken() === 5
      /* CommaToken */
      ) {
          if (!needsComma) {
            _error(localize('ValueExpected', 'Value expected'), _jsonLanguageTypes.ErrorCode.ValueExpected);
          }

          var commaOffset = scanner.getTokenOffset();

          _scanNext(); // consume comma


          if (scanner.getToken() === 4
          /* CloseBracketToken */
          ) {
              if (needsComma) {
                _errorAtRange(localize('TrailingComma', 'Trailing comma'), _jsonLanguageTypes.ErrorCode.TrailingComma, commaOffset, commaOffset + 1);
              }

              continue;
            }
        } else if (needsComma) {
        _error(localize('ExpectedComma', 'Expected comma'), _jsonLanguageTypes.ErrorCode.CommaExpected);
      }

      var item = _parseValue(node, count++);

      if (!item) {
        _error(localize('PropertyExpected', 'Value expected'), _jsonLanguageTypes.ErrorCode.ValueExpected, null, [], [4
        /* CloseBracketToken */
        , 5
        /* CommaToken */
        ]);
      } else {
        node.items.push(item);
      }

      needsComma = true;
    }

    if (scanner.getToken() !== 4
    /* CloseBracketToken */
    ) {
        return _error(localize('ExpectedCloseBracket', 'Expected comma or closing bracket'), _jsonLanguageTypes.ErrorCode.CommaOrCloseBacketExpected, node);
      }

    return _finalize(node, true);
  }

  function _parseProperty(parent, keysSeen) {
    var node = new PropertyASTNodeImpl(parent, scanner.getTokenOffset());

    var key = _parseString(node);

    if (!key) {
      if (scanner.getToken() === 16
      /* Unknown */
      ) {
          // give a more helpful error message
          _error(localize('DoubleQuotesExpected', 'Property keys must be doublequoted'), _jsonLanguageTypes.ErrorCode.Undefined);

          var keyNode = new StringASTNodeImpl(node, scanner.getTokenOffset(), scanner.getTokenLength());
          keyNode.value = scanner.getTokenValue();
          key = keyNode;

          _scanNext(); // consume Unknown

        } else {
        return null;
      }
    }

    node.keyNode = key;
    var seen = keysSeen[key.value];

    if (seen) {
      _errorAtRange(localize('DuplicateKeyWarning', "Duplicate object key"), _jsonLanguageTypes.ErrorCode.DuplicateKey, node.keyNode.offset, node.keyNode.offset + node.keyNode.length, _main2.DiagnosticSeverity.Warning);

      if (typeof seen === 'object') {
        _errorAtRange(localize('DuplicateKeyWarning', "Duplicate object key"), _jsonLanguageTypes.ErrorCode.DuplicateKey, seen.keyNode.offset, seen.keyNode.offset + seen.keyNode.length, _main2.DiagnosticSeverity.Warning);
      }

      keysSeen[key.value] = true; // if the same key is duplicate again, avoid duplicate error reporting
    } else {
      keysSeen[key.value] = node;
    }

    if (scanner.getToken() === 6
    /* ColonToken */
    ) {
        node.colonOffset = scanner.getTokenOffset();

        _scanNext(); // consume ColonToken

      } else {
      _error(localize('ColonExpected', 'Colon expected'), _jsonLanguageTypes.ErrorCode.ColonExpected);

      if (scanner.getToken() === 10
      /* StringLiteral */
      && textDocument.positionAt(key.offset + key.length).line < textDocument.positionAt(scanner.getTokenOffset()).line) {
        node.length = key.length;
        return node;
      }
    }

    var value = _parseValue(node, key.value);

    if (!value) {
      return _error(localize('ValueExpected', 'Value expected'), _jsonLanguageTypes.ErrorCode.ValueExpected, node, [], [2
      /* CloseBraceToken */
      , 5
      /* CommaToken */
      ]);
    }

    node.valueNode = value;
    node.length = value.offset + value.length - node.offset;
    return node;
  }

  function _parseObject(parent) {
    if (scanner.getToken() !== 1
    /* OpenBraceToken */
    ) {
        return null;
      }

    var node = new ObjectASTNodeImpl(parent, scanner.getTokenOffset());
    var keysSeen = Object.create(null);

    _scanNext(); // consume OpenBraceToken


    var needsComma = false;

    while (scanner.getToken() !== 2
    /* CloseBraceToken */
    && scanner.getToken() !== 17
    /* EOF */
    ) {
      if (scanner.getToken() === 5
      /* CommaToken */
      ) {
          if (!needsComma) {
            _error(localize('PropertyExpected', 'Property expected'), _jsonLanguageTypes.ErrorCode.PropertyExpected);
          }

          var commaOffset = scanner.getTokenOffset();

          _scanNext(); // consume comma


          if (scanner.getToken() === 2
          /* CloseBraceToken */
          ) {
              if (needsComma) {
                _errorAtRange(localize('TrailingComma', 'Trailing comma'), _jsonLanguageTypes.ErrorCode.TrailingComma, commaOffset, commaOffset + 1);
              }

              continue;
            }
        } else if (needsComma) {
        _error(localize('ExpectedComma', 'Expected comma'), _jsonLanguageTypes.ErrorCode.CommaExpected);
      }

      var property = _parseProperty(node, keysSeen);

      if (!property) {
        _error(localize('PropertyExpected', 'Property expected'), _jsonLanguageTypes.ErrorCode.PropertyExpected, null, [], [2
        /* CloseBraceToken */
        , 5
        /* CommaToken */
        ]);
      } else {
        node.properties.push(property);
      }

      needsComma = true;
    }

    if (scanner.getToken() !== 2
    /* CloseBraceToken */
    ) {
        return _error(localize('ExpectedCloseBrace', 'Expected comma or closing brace'), _jsonLanguageTypes.ErrorCode.CommaOrCloseBraceExpected, node);
      }

    return _finalize(node, true);
  }

  function _parseString(parent) {
    if (scanner.getToken() !== 10
    /* StringLiteral */
    ) {
        return null;
      }

    var node = new StringASTNodeImpl(parent, scanner.getTokenOffset());
    node.value = scanner.getTokenValue();
    return _finalize(node, true);
  }

  function _parseNumber(parent) {
    if (scanner.getToken() !== 11
    /* NumericLiteral */
    ) {
        return null;
      }

    var node = new NumberASTNodeImpl(parent, scanner.getTokenOffset());

    if (scanner.getTokenError() === 0
    /* None */
    ) {
        var tokenValue = scanner.getTokenValue();

        try {
          var numberValue = JSON.parse(tokenValue);

          if (typeof numberValue !== 'number') {
            return _error(localize('InvalidNumberFormat', 'Invalid number format.'), _jsonLanguageTypes.ErrorCode.Undefined, node);
          }

          node.value = numberValue;
        } catch (e) {
          return _error(localize('InvalidNumberFormat', 'Invalid number format.'), _jsonLanguageTypes.ErrorCode.Undefined, node);
        }

        node.isInteger = tokenValue.indexOf('.') === -1;
      }

    return _finalize(node, true);
  }

  function _parseLiteral(parent) {
    var node;

    switch (scanner.getToken()) {
      case 7
      /* NullKeyword */
      :
        return _finalize(new NullASTNodeImpl(parent, scanner.getTokenOffset()), true);

      case 8
      /* TrueKeyword */
      :
        return _finalize(new BooleanASTNodeImpl(parent, true, scanner.getTokenOffset()), true);

      case 9
      /* FalseKeyword */
      :
        return _finalize(new BooleanASTNodeImpl(parent, false, scanner.getTokenOffset()), true);

      default:
        return null;
    }
  }

  function _parseValue(parent, name) {
    return _parseArray(parent) || _parseObject(parent) || _parseString(parent) || _parseNumber(parent) || _parseLiteral(parent);
  }

  var _root = null;

  var token = _scanNext();

  if (token !== 17
  /* EOF */
  ) {
      _root = _parseValue(null, null);

      if (!_root) {
        _error(localize('Invalid symbol', 'Expected a JSON object, array or literal.'), _jsonLanguageTypes.ErrorCode.Undefined);
      } else if (scanner.getToken() !== 17
      /* EOF */
      ) {
          _error(localize('End of file expected', 'End of file expected.'), _jsonLanguageTypes.ErrorCode.Undefined);
        }
    }

  return new JSONDocument(_root, problems, commentRanges);
}
},{"./../../jsonc-parser/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/main.js","../utils/objects.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/utils/objects.js","../jsonLanguageTypes.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/jsonLanguageTypes.js","./../../../fillers/vscode-nls.js":"node_modules/monaco-editor/esm/vs/language/json/fillers/vscode-nls.js","./../../vscode-uri/index.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-uri/index.js","./../../vscode-languageserver-types/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-languageserver-types/main.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/utils/json.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringifyObject = stringifyObject;

function stringifyObject(obj, indent, stringifyLiteral) {
  if (obj !== null && typeof obj === 'object') {
    var newIndent = indent + '\t';

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return '[]';
      }

      var result = '[\n';

      for (var i = 0; i < obj.length; i++) {
        result += newIndent + stringifyObject(obj[i], newIndent, stringifyLiteral);

        if (i < obj.length - 1) {
          result += ',';
        }

        result += '\n';
      }

      result += indent + ']';
      return result;
    } else {
      var keys = Object.keys(obj);

      if (keys.length === 0) {
        return '{}';
      }

      var result = '{\n';

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        result += newIndent + JSON.stringify(key) + ': ' + stringifyObject(obj[key], newIndent, stringifyLiteral);

        if (i < keys.length - 1) {
          result += ',';
        }

        result += '\n';
      }

      result += indent + '}';
      return result;
    }
  }

  return stringifyLiteral(obj);
}
},{}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/utils/strings.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startsWith = startsWith;
exports.endsWith = endsWith;
exports.convertSimple2RegExpPattern = convertSimple2RegExpPattern;
exports.repeat = repeat;

function startsWith(haystack, needle) {
  if (haystack.length < needle.length) {
    return false;
  }

  for (var i = 0; i < needle.length; i++) {
    if (haystack[i] !== needle[i]) {
      return false;
    }
  }

  return true;
}
/**
 * Determines if haystack ends with needle.
 */


function endsWith(haystack, needle) {
  var diff = haystack.length - needle.length;

  if (diff > 0) {
    return haystack.lastIndexOf(needle) === diff;
  } else if (diff === 0) {
    return haystack === needle;
  } else {
    return false;
  }
}

function convertSimple2RegExpPattern(pattern) {
  return pattern.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&').replace(/[\*]/g, '.*');
}

function repeat(value, count) {
  var s = '';

  while (count > 0) {
    if ((count & 1) === 1) {
      s += value;
    }

    value += value;
    count = count >>> 1;
  }

  return s;
}
},{}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/jsonCompletion.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONCompletion = void 0;

var Parser = _interopRequireWildcard(require("../parser/jsonParser.js"));

var Json = _interopRequireWildcard(require("./../../jsonc-parser/main.js"));

var _json = require("../utils/json.js");

var _strings = require("../utils/strings.js");

var _main2 = require("./../../vscode-languageserver-types/main.js");

var nls = _interopRequireWildcard(require("./../../../fillers/vscode-nls.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var localize = nls.loadMessageBundle();

var JSONCompletion =
/** @class */
function () {
  function JSONCompletion(schemaService, contributions, promiseConstructor) {
    if (contributions === void 0) {
      contributions = [];
    }

    this.templateVarIdCounter = 0;
    this.schemaService = schemaService;
    this.contributions = contributions;
    this.promise = promiseConstructor || Promise;
  }

  JSONCompletion.prototype.doResolve = function (item) {
    for (var i = this.contributions.length - 1; i >= 0; i--) {
      if (this.contributions[i].resolveCompletion) {
        var resolver = this.contributions[i].resolveCompletion(item);

        if (resolver) {
          return resolver;
        }
      }
    }

    return this.promise.resolve(item);
  };

  JSONCompletion.prototype.doComplete = function (document, position, doc) {
    var _this = this;

    var result = {
      items: [],
      isIncomplete: false
    };
    var offset = document.offsetAt(position);
    var node = doc.getNodeFromOffset(offset, true);

    if (this.isInComment(document, node ? node.offset : 0, offset)) {
      return Promise.resolve(result);
    }

    var currentWord = this.getCurrentWord(document, offset);
    var overwriteRange = null;

    if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
      overwriteRange = _main2.Range.create(document.positionAt(node.offset), document.positionAt(node.offset + node.length));
    } else {
      var overwriteStart = offset - currentWord.length;

      if (overwriteStart > 0 && document.getText()[overwriteStart - 1] === '"') {
        overwriteStart--;
      }

      overwriteRange = _main2.Range.create(document.positionAt(overwriteStart), position);
    }

    var proposed = {};
    var collector = {
      add: function (suggestion) {
        var existing = proposed[suggestion.label];

        if (!existing) {
          proposed[suggestion.label] = suggestion;

          if (overwriteRange) {
            suggestion.textEdit = _main2.TextEdit.replace(overwriteRange, suggestion.insertText);
          }

          result.items.push(suggestion);
        } else if (!existing.documentation) {
          existing.documentation = suggestion.documentation;
        }
      },
      setAsIncomplete: function () {
        result.isIncomplete = true;
      },
      error: function (message) {
        console.error(message);
      },
      log: function (message) {
        console.log(message);
      },
      getNumberOfProposals: function () {
        return result.items.length;
      }
    };
    return this.schemaService.getSchemaForResource(document.uri, doc).then(function (schema) {
      var collectionPromises = [];
      var addValue = true;
      var currentKey = '';
      var currentProperty = null;

      if (node) {
        if (node.type === 'string') {
          var parent = node.parent;

          if (parent && parent.type === 'property' && parent.keyNode === node) {
            addValue = !parent.valueNode;
            currentProperty = parent;
            currentKey = document.getText().substr(node.offset + 1, node.length - 2);

            if (parent) {
              node = parent.parent;
            }
          }
        }
      } // proposals for properties


      if (node && node.type === 'object') {
        // don't suggest keys when the cursor is just before the opening curly brace
        if (node.offset === offset) {
          return result;
        } // don't suggest properties that are already present


        var properties = node.properties;
        properties.forEach(function (p) {
          if (!currentProperty || currentProperty !== p) {
            proposed[p.keyNode.value] = _main2.CompletionItem.create('__');
          }
        });
        var separatorAfter_1 = '';

        if (addValue) {
          separatorAfter_1 = _this.evaluateSeparatorAfter(document, document.offsetAt(overwriteRange.end));
        }

        if (schema) {
          // property proposals with schema
          _this.getPropertyCompletions(schema, doc, node, addValue, separatorAfter_1, collector);
        } else {
          // property proposals without schema
          _this.getSchemaLessPropertyCompletions(doc, node, currentKey, collector);
        }

        var location_1 = Parser.getNodePath(node);

        _this.contributions.forEach(function (contribution) {
          var collectPromise = contribution.collectPropertyCompletions(document.uri, location_1, currentWord, addValue, separatorAfter_1 === '', collector);

          if (collectPromise) {
            collectionPromises.push(collectPromise);
          }
        });

        if (!schema && currentWord.length > 0 && document.getText().charAt(offset - currentWord.length - 1) !== '"') {
          collector.add({
            kind: _main2.CompletionItemKind.Property,
            label: _this.getLabelForValue(currentWord),
            insertText: _this.getInsertTextForProperty(currentWord, null, false, separatorAfter_1),
            insertTextFormat: _main2.InsertTextFormat.Snippet,
            documentation: ''
          });
        }
      } // proposals for values


      var types = {};

      if (schema) {
        // value proposals with schema
        _this.getValueCompletions(schema, doc, node, offset, document, collector, types);
      } else {
        // value proposals without schema
        _this.getSchemaLessValueCompletions(doc, node, offset, document, collector);
      }

      if (_this.contributions.length > 0) {
        _this.getContributedValueCompletions(doc, node, offset, document, collector, collectionPromises);
      }

      return _this.promise.all(collectionPromises).then(function () {
        if (collector.getNumberOfProposals() === 0) {
          var offsetForSeparator = offset;

          if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
            offsetForSeparator = node.offset + node.length;
          }

          var separatorAfter = _this.evaluateSeparatorAfter(document, offsetForSeparator);

          _this.addFillerValueCompletions(types, separatorAfter, collector);
        }

        return result;
      });
    });
  };

  JSONCompletion.prototype.getPropertyCompletions = function (schema, doc, node, addValue, separatorAfter, collector) {
    var _this = this;

    var matchingSchemas = doc.getMatchingSchemas(schema.schema, node.offset);
    matchingSchemas.forEach(function (s) {
      if (s.node === node && !s.inverted) {
        var schemaProperties_1 = s.schema.properties;

        if (schemaProperties_1) {
          Object.keys(schemaProperties_1).forEach(function (key) {
            var propertySchema = schemaProperties_1[key];

            if (typeof propertySchema === 'object' && !propertySchema.deprecationMessage && !propertySchema.doNotSuggest) {
              var proposal = {
                kind: _main2.CompletionItemKind.Property,
                label: key,
                insertText: _this.getInsertTextForProperty(key, propertySchema, addValue, separatorAfter),
                insertTextFormat: _main2.InsertTextFormat.Snippet,
                filterText: _this.getFilterTextForValue(key),
                documentation: propertySchema.description || ''
              };

              if ((0, _strings.endsWith)(proposal.insertText, "$1" + separatorAfter)) {
                proposal.command = {
                  title: 'Suggest',
                  command: 'editor.action.triggerSuggest'
                };
              }

              collector.add(proposal);
            }
          });
        }
      }
    });
  };

  JSONCompletion.prototype.getSchemaLessPropertyCompletions = function (doc, node, currentKey, collector) {
    var _this = this;

    var collectCompletionsForSimilarObject = function (obj) {
      obj.properties.forEach(function (p) {
        var key = p.keyNode.value;
        collector.add({
          kind: _main2.CompletionItemKind.Property,
          label: key,
          insertText: _this.getInsertTextForValue(key, ''),
          insertTextFormat: _main2.InsertTextFormat.Snippet,
          filterText: _this.getFilterTextForValue(key),
          documentation: ''
        });
      });
    };

    if (node.parent) {
      if (node.parent.type === 'property') {
        // if the object is a property value, check the tree for other objects that hang under a property of the same name
        var parentKey_1 = node.parent.keyNode.value;
        doc.visit(function (n) {
          if (n.type === 'property' && n !== node.parent && n.keyNode.value === parentKey_1 && n.valueNode && n.valueNode.type === 'object') {
            collectCompletionsForSimilarObject(n.valueNode);
          }

          return true;
        });
      } else if (node.parent.type === 'array') {
        // if the object is in an array, use all other array elements as similar objects
        node.parent.items.forEach(function (n) {
          if (n.type === 'object' && n !== node) {
            collectCompletionsForSimilarObject(n);
          }
        });
      }
    } else if (node.type === 'object') {
      collector.add({
        kind: _main2.CompletionItemKind.Property,
        label: '$schema',
        insertText: this.getInsertTextForProperty('$schema', null, true, ''),
        insertTextFormat: _main2.InsertTextFormat.Snippet,
        documentation: '',
        filterText: this.getFilterTextForValue("$schema")
      });
    }
  };

  JSONCompletion.prototype.getSchemaLessValueCompletions = function (doc, node, offset, document, collector) {
    var _this = this;

    var offsetForSeparator = offset;

    if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
      offsetForSeparator = node.offset + node.length;
      node = node.parent;
    }

    if (!node) {
      collector.add({
        kind: this.getSuggestionKind('object'),
        label: 'Empty object',
        insertText: this.getInsertTextForValue({}, ''),
        insertTextFormat: _main2.InsertTextFormat.Snippet,
        documentation: ''
      });
      collector.add({
        kind: this.getSuggestionKind('array'),
        label: 'Empty array',
        insertText: this.getInsertTextForValue([], ''),
        insertTextFormat: _main2.InsertTextFormat.Snippet,
        documentation: ''
      });
      return;
    }

    var separatorAfter = this.evaluateSeparatorAfter(document, offsetForSeparator);

    var collectSuggestionsForValues = function (value) {
      if (!Parser.contains(value.parent, offset, true)) {
        collector.add({
          kind: _this.getSuggestionKind(value.type),
          label: _this.getLabelTextForMatchingNode(value, document),
          insertText: _this.getInsertTextForMatchingNode(value, document, separatorAfter),
          insertTextFormat: _main2.InsertTextFormat.Snippet,
          documentation: ''
        });
      }

      if (value.type === 'boolean') {
        _this.addBooleanValueCompletion(!value.value, separatorAfter, collector);
      }
    };

    if (node.type === 'property') {
      if (offset > node.colonOffset) {
        var valueNode = node.valueNode;

        if (valueNode && (offset > valueNode.offset + valueNode.length || valueNode.type === 'object' || valueNode.type === 'array')) {
          return;
        } // suggest values at the same key


        var parentKey_2 = node.keyNode.value;
        doc.visit(function (n) {
          if (n.type === 'property' && n.keyNode.value === parentKey_2 && n.valueNode) {
            collectSuggestionsForValues(n.valueNode);
          }

          return true;
        });

        if (parentKey_2 === '$schema' && node.parent && !node.parent.parent) {
          this.addDollarSchemaCompletions(separatorAfter, collector);
        }
      }
    }

    if (node.type === 'array') {
      if (node.parent && node.parent.type === 'property') {
        // suggest items of an array at the same key
        var parentKey_3 = node.parent.keyNode.value;
        doc.visit(function (n) {
          if (n.type === 'property' && n.keyNode.value === parentKey_3 && n.valueNode && n.valueNode.type === 'array') {
            n.valueNode.items.forEach(collectSuggestionsForValues);
          }

          return true;
        });
      } else {
        // suggest items in the same array
        node.items.forEach(collectSuggestionsForValues);
      }
    }
  };

  JSONCompletion.prototype.getValueCompletions = function (schema, doc, node, offset, document, collector, types) {
    var _this = this;

    var offsetForSeparator = offset;
    var parentKey = null;
    var valueNode = null;

    if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
      offsetForSeparator = node.offset + node.length;
      valueNode = node;
      node = node.parent;
    }

    if (!node) {
      this.addSchemaValueCompletions(schema.schema, '', collector, types);
      return;
    }

    if (node.type === 'property' && offset > node.colonOffset) {
      var valueNode_1 = node.valueNode;

      if (valueNode_1 && offset > valueNode_1.offset + valueNode_1.length) {
        return; // we are past the value node
      }

      parentKey = node.keyNode.value;
      node = node.parent;
    }

    if (node && (parentKey !== null || node.type === 'array')) {
      var separatorAfter_2 = this.evaluateSeparatorAfter(document, offsetForSeparator);
      var matchingSchemas = doc.getMatchingSchemas(schema.schema, node.offset, valueNode);
      matchingSchemas.forEach(function (s) {
        if (s.node === node && !s.inverted && s.schema) {
          if (node.type === 'array' && s.schema.items) {
            if (Array.isArray(s.schema.items)) {
              var index = _this.findItemAtOffset(node, document, offset);

              if (index < s.schema.items.length) {
                _this.addSchemaValueCompletions(s.schema.items[index], separatorAfter_2, collector, types);
              }
            } else {
              _this.addSchemaValueCompletions(s.schema.items, separatorAfter_2, collector, types);
            }
          }

          if (s.schema.properties) {
            var propertySchema = s.schema.properties[parentKey];

            if (propertySchema) {
              _this.addSchemaValueCompletions(propertySchema, separatorAfter_2, collector, types);
            }
          }
        }
      });

      if (parentKey === '$schema' && !node.parent) {
        this.addDollarSchemaCompletions(separatorAfter_2, collector);
      }

      if (types['boolean']) {
        this.addBooleanValueCompletion(true, separatorAfter_2, collector);
        this.addBooleanValueCompletion(false, separatorAfter_2, collector);
      }

      if (types['null']) {
        this.addNullValueCompletion(separatorAfter_2, collector);
      }
    }
  };

  JSONCompletion.prototype.getContributedValueCompletions = function (doc, node, offset, document, collector, collectionPromises) {
    if (!node) {
      this.contributions.forEach(function (contribution) {
        var collectPromise = contribution.collectDefaultCompletions(document.uri, collector);

        if (collectPromise) {
          collectionPromises.push(collectPromise);
        }
      });
    } else {
      if (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null') {
        node = node.parent;
      }

      if (node.type === 'property' && offset > node.colonOffset) {
        var parentKey_4 = node.keyNode.value;
        var valueNode = node.valueNode;

        if (!valueNode || offset <= valueNode.offset + valueNode.length) {
          var location_2 = Parser.getNodePath(node.parent);
          this.contributions.forEach(function (contribution) {
            var collectPromise = contribution.collectValueCompletions(document.uri, location_2, parentKey_4, collector);

            if (collectPromise) {
              collectionPromises.push(collectPromise);
            }
          });
        }
      }
    }
  };

  JSONCompletion.prototype.addSchemaValueCompletions = function (schema, separatorAfter, collector, types) {
    var _this = this;

    if (typeof schema === 'object') {
      this.addEnumValueCompletions(schema, separatorAfter, collector);
      this.addDefaultValueCompletions(schema, separatorAfter, collector);
      this.collectTypes(schema, types);

      if (Array.isArray(schema.allOf)) {
        schema.allOf.forEach(function (s) {
          return _this.addSchemaValueCompletions(s, separatorAfter, collector, types);
        });
      }

      if (Array.isArray(schema.anyOf)) {
        schema.anyOf.forEach(function (s) {
          return _this.addSchemaValueCompletions(s, separatorAfter, collector, types);
        });
      }

      if (Array.isArray(schema.oneOf)) {
        schema.oneOf.forEach(function (s) {
          return _this.addSchemaValueCompletions(s, separatorAfter, collector, types);
        });
      }
    }
  };

  JSONCompletion.prototype.addDefaultValueCompletions = function (schema, separatorAfter, collector, arrayDepth) {
    var _this = this;

    if (arrayDepth === void 0) {
      arrayDepth = 0;
    }

    var hasProposals = false;

    if (isDefined(schema.default)) {
      var type = schema.type;
      var value = schema.default;

      for (var i = arrayDepth; i > 0; i--) {
        value = [value];
        type = 'array';
      }

      collector.add({
        kind: this.getSuggestionKind(type),
        label: this.getLabelForValue(value),
        insertText: this.getInsertTextForValue(value, separatorAfter),
        insertTextFormat: _main2.InsertTextFormat.Snippet,
        detail: localize('json.suggest.default', 'Default value')
      });
      hasProposals = true;
    }

    if (Array.isArray(schema.defaultSnippets)) {
      schema.defaultSnippets.forEach(function (s) {
        var type = schema.type;
        var value = s.body;
        var label = s.label;
        var insertText;
        var filterText;

        if (isDefined(value)) {
          var type_1 = schema.type;

          for (var i = arrayDepth; i > 0; i--) {
            value = [value];
            type_1 = 'array';
          }

          insertText = _this.getInsertTextForSnippetValue(value, separatorAfter);
          filterText = _this.getFilterTextForSnippetValue(value);
          label = label || _this.getLabelForSnippetValue(value);
        } else if (typeof s.bodyText === 'string') {
          var prefix = '',
              suffix = '',
              indent = '';

          for (var i = arrayDepth; i > 0; i--) {
            prefix = prefix + indent + '[\n';
            suffix = suffix + '\n' + indent + ']';
            indent += '\t';
            type = 'array';
          }

          insertText = prefix + indent + s.bodyText.split('\n').join('\n' + indent) + suffix + separatorAfter;
          label = label || insertText;
          filterText = insertText.replace(/[\n]/g, ''); // remove new lines
        }

        collector.add({
          kind: _this.getSuggestionKind(type),
          label: label,
          documentation: s.description,
          insertText: insertText,
          insertTextFormat: _main2.InsertTextFormat.Snippet,
          filterText: filterText
        });
        hasProposals = true;
      });
    }

    if (!hasProposals && typeof schema.items === 'object' && !Array.isArray(schema.items)) {
      this.addDefaultValueCompletions(schema.items, separatorAfter, collector, arrayDepth + 1);
    }
  };

  JSONCompletion.prototype.addEnumValueCompletions = function (schema, separatorAfter, collector) {
    if (isDefined(schema.const)) {
      collector.add({
        kind: this.getSuggestionKind(schema.type),
        label: this.getLabelForValue(schema.const),
        insertText: this.getInsertTextForValue(schema.const, separatorAfter),
        insertTextFormat: _main2.InsertTextFormat.Snippet,
        documentation: schema.description
      });
    }

    if (Array.isArray(schema.enum)) {
      for (var i = 0, length = schema.enum.length; i < length; i++) {
        var enm = schema.enum[i];
        var documentation = schema.description;

        if (schema.enumDescriptions && i < schema.enumDescriptions.length) {
          documentation = schema.enumDescriptions[i];
        }

        collector.add({
          kind: this.getSuggestionKind(schema.type),
          label: this.getLabelForValue(enm),
          insertText: this.getInsertTextForValue(enm, separatorAfter),
          insertTextFormat: _main2.InsertTextFormat.Snippet,
          documentation: documentation
        });
      }
    }
  };

  JSONCompletion.prototype.collectTypes = function (schema, types) {
    if (Array.isArray(schema.enum) || isDefined(schema.const)) {
      return;
    }

    var type = schema.type;

    if (Array.isArray(type)) {
      type.forEach(function (t) {
        return types[t] = true;
      });
    } else {
      types[type] = true;
    }
  };

  JSONCompletion.prototype.addFillerValueCompletions = function (types, separatorAfter, collector) {
    if (types['object']) {
      collector.add({
        kind: this.getSuggestionKind('object'),
        label: '{}',
        insertText: this.getInsertTextForGuessedValue({}, separatorAfter),
        insertTextFormat: _main2.InsertTextFormat.Snippet,
        detail: localize('defaults.object', 'New object'),
        documentation: ''
      });
    }

    if (types['array']) {
      collector.add({
        kind: this.getSuggestionKind('array'),
        label: '[]',
        insertText: this.getInsertTextForGuessedValue([], separatorAfter),
        insertTextFormat: _main2.InsertTextFormat.Snippet,
        detail: localize('defaults.array', 'New array'),
        documentation: ''
      });
    }
  };

  JSONCompletion.prototype.addBooleanValueCompletion = function (value, separatorAfter, collector) {
    collector.add({
      kind: this.getSuggestionKind('boolean'),
      label: value ? 'true' : 'false',
      insertText: this.getInsertTextForValue(value, separatorAfter),
      insertTextFormat: _main2.InsertTextFormat.Snippet,
      documentation: ''
    });
  };

  JSONCompletion.prototype.addNullValueCompletion = function (separatorAfter, collector) {
    collector.add({
      kind: this.getSuggestionKind('null'),
      label: 'null',
      insertText: 'null' + separatorAfter,
      insertTextFormat: _main2.InsertTextFormat.Snippet,
      documentation: ''
    });
  };

  JSONCompletion.prototype.addDollarSchemaCompletions = function (separatorAfter, collector) {
    var _this = this;

    var schemaIds = this.schemaService.getRegisteredSchemaIds(function (schema) {
      return schema === 'http' || schema === 'https';
    });
    schemaIds.forEach(function (schemaId) {
      return collector.add({
        kind: _main2.CompletionItemKind.Module,
        label: _this.getLabelForValue(schemaId),
        filterText: _this.getFilterTextForValue(schemaId),
        insertText: _this.getInsertTextForValue(schemaId, separatorAfter),
        insertTextFormat: _main2.InsertTextFormat.Snippet,
        documentation: ''
      });
    });
  };

  JSONCompletion.prototype.getLabelForValue = function (value) {
    var label = JSON.stringify(value);

    if (label.length > 57) {
      return label.substr(0, 57).trim() + '...';
    }

    return label;
  };

  JSONCompletion.prototype.getFilterTextForValue = function (value) {
    return JSON.stringify(value);
  };

  JSONCompletion.prototype.getFilterTextForSnippetValue = function (value) {
    return JSON.stringify(value).replace(/\$\{\d+:([^}]+)\}|\$\d+/g, '$1');
  };

  JSONCompletion.prototype.getLabelForSnippetValue = function (value) {
    var label = JSON.stringify(value);
    label = label.replace(/\$\{\d+:([^}]+)\}|\$\d+/g, '$1');

    if (label.length > 57) {
      return label.substr(0, 57).trim() + '...';
    }

    return label;
  };

  JSONCompletion.prototype.getInsertTextForPlainText = function (text) {
    return text.replace(/[\\\$\}]/g, '\\$&'); // escape $, \ and } 
  };

  JSONCompletion.prototype.getInsertTextForValue = function (value, separatorAfter) {
    var text = JSON.stringify(value, null, '\t');

    if (text === '{}') {
      return '{\n\t$1\n}' + separatorAfter;
    } else if (text === '[]') {
      return '[\n\t$1\n]' + separatorAfter;
    }

    return this.getInsertTextForPlainText(text + separatorAfter);
  };

  JSONCompletion.prototype.getInsertTextForSnippetValue = function (value, separatorAfter) {
    var replacer = function (value) {
      if (typeof value === 'string') {
        if (value[0] === '^') {
          return value.substr(1);
        }
      }

      return JSON.stringify(value);
    };

    return (0, _json.stringifyObject)(value, '', replacer) + separatorAfter;
  };

  JSONCompletion.prototype.getInsertTextForGuessedValue = function (value, separatorAfter) {
    switch (typeof value) {
      case 'object':
        if (value === null) {
          return '${1:null}' + separatorAfter;
        }

        return this.getInsertTextForValue(value, separatorAfter);

      case 'string':
        var snippetValue = JSON.stringify(value);
        snippetValue = snippetValue.substr(1, snippetValue.length - 2); // remove quotes

        snippetValue = this.getInsertTextForPlainText(snippetValue); // escape \ and }

        return '"${1:' + snippetValue + '}"' + separatorAfter;

      case 'number':
      case 'boolean':
        return '${1:' + JSON.stringify(value) + '}' + separatorAfter;
    }

    return this.getInsertTextForValue(value, separatorAfter);
  };

  JSONCompletion.prototype.getSuggestionKind = function (type) {
    if (Array.isArray(type)) {
      var array = type;
      type = array.length > 0 ? array[0] : null;
    }

    if (!type) {
      return _main2.CompletionItemKind.Value;
    }

    switch (type) {
      case 'string':
        return _main2.CompletionItemKind.Value;

      case 'object':
        return _main2.CompletionItemKind.Module;

      case 'property':
        return _main2.CompletionItemKind.Property;

      default:
        return _main2.CompletionItemKind.Value;
    }
  };

  JSONCompletion.prototype.getLabelTextForMatchingNode = function (node, document) {
    switch (node.type) {
      case 'array':
        return '[]';

      case 'object':
        return '{}';

      default:
        var content = document.getText().substr(node.offset, node.length);
        return content;
    }
  };

  JSONCompletion.prototype.getInsertTextForMatchingNode = function (node, document, separatorAfter) {
    switch (node.type) {
      case 'array':
        return this.getInsertTextForValue([], separatorAfter);

      case 'object':
        return this.getInsertTextForValue({}, separatorAfter);

      default:
        var content = document.getText().substr(node.offset, node.length) + separatorAfter;
        return this.getInsertTextForPlainText(content);
    }
  };

  JSONCompletion.prototype.getInsertTextForProperty = function (key, propertySchema, addValue, separatorAfter) {
    var propertyText = this.getInsertTextForValue(key, '');

    if (!addValue) {
      return propertyText;
    }

    var resultText = propertyText + ': ';
    var value;
    var nValueProposals = 0;

    if (propertySchema) {
      if (Array.isArray(propertySchema.defaultSnippets)) {
        if (propertySchema.defaultSnippets.length === 1) {
          var body = propertySchema.defaultSnippets[0].body;

          if (isDefined(body)) {
            value = this.getInsertTextForSnippetValue(body, '');
          }
        }

        nValueProposals += propertySchema.defaultSnippets.length;
      }

      if (propertySchema.enum) {
        if (!value && propertySchema.enum.length === 1) {
          value = this.getInsertTextForGuessedValue(propertySchema.enum[0], '');
        }

        nValueProposals += propertySchema.enum.length;
      }

      if (isDefined(propertySchema.default)) {
        if (!value) {
          value = this.getInsertTextForGuessedValue(propertySchema.default, '');
        }

        nValueProposals++;
      }

      if (nValueProposals === 0) {
        var type = Array.isArray(propertySchema.type) ? propertySchema.type[0] : propertySchema.type;

        if (!type) {
          if (propertySchema.properties) {
            type = 'object';
          } else if (propertySchema.items) {
            type = 'array';
          }
        }

        switch (type) {
          case 'boolean':
            value = '$1';
            break;

          case 'string':
            value = '"$1"';
            break;

          case 'object':
            value = '{\n\t$1\n}';
            break;

          case 'array':
            value = '[\n\t$1\n]';
            break;

          case 'number':
          case 'integer':
            value = '${1:0}';
            break;

          case 'null':
            value = '${1:null}';
            break;

          default:
            return propertyText;
        }
      }
    }

    if (!value || nValueProposals > 1) {
      value = '$1';
    }

    return resultText + value + separatorAfter;
  };

  JSONCompletion.prototype.getCurrentWord = function (document, offset) {
    var i = offset - 1;
    var text = document.getText();

    while (i >= 0 && ' \t\n\r\v":{[,]}'.indexOf(text.charAt(i)) === -1) {
      i--;
    }

    return text.substring(i + 1, offset);
  };

  JSONCompletion.prototype.evaluateSeparatorAfter = function (document, offset) {
    var scanner = Json.createScanner(document.getText(), true);
    scanner.setPosition(offset);
    var token = scanner.scan();

    switch (token) {
      case 5
      /* CommaToken */
      :
      case 2
      /* CloseBraceToken */
      :
      case 4
      /* CloseBracketToken */
      :
      case 17
      /* EOF */
      :
        return '';

      default:
        return ',';
    }
  };

  JSONCompletion.prototype.findItemAtOffset = function (node, document, offset) {
    var scanner = Json.createScanner(document.getText(), true);
    var children = node.items;

    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];

      if (offset > child.offset + child.length) {
        scanner.setPosition(child.offset + child.length);
        var token = scanner.scan();

        if (token === 5
        /* CommaToken */
        && offset >= scanner.getTokenOffset() + scanner.getTokenLength()) {
          return i + 1;
        }

        return i;
      } else if (offset >= child.offset) {
        return i;
      }
    }

    return 0;
  };

  JSONCompletion.prototype.isInComment = function (document, start, offset) {
    var scanner = Json.createScanner(document.getText(), false);
    scanner.setPosition(start);
    var token = scanner.scan();

    while (token !== 17
    /* EOF */
    && scanner.getTokenOffset() + scanner.getTokenLength() < offset) {
      token = scanner.scan();
    }

    return (token === 12
    /* LineCommentTrivia */
    || token === 13
    /* BlockCommentTrivia */
    ) && scanner.getTokenOffset() <= offset;
  };

  return JSONCompletion;
}();

exports.JSONCompletion = JSONCompletion;

function isDefined(val) {
  return typeof val !== 'undefined';
}
},{"../parser/jsonParser.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/parser/jsonParser.js","./../../jsonc-parser/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/main.js","../utils/json.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/utils/json.js","../utils/strings.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/utils/strings.js","./../../vscode-languageserver-types/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-languageserver-types/main.js","./../../../fillers/vscode-nls.js":"node_modules/monaco-editor/esm/vs/language/json/fillers/vscode-nls.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/jsonHover.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONHover = void 0;

var Parser = _interopRequireWildcard(require("../parser/jsonParser.js"));

var _main = require("./../../vscode-languageserver-types/main.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var JSONHover =
/** @class */
function () {
  function JSONHover(schemaService, contributions, promiseConstructor) {
    if (contributions === void 0) {
      contributions = [];
    }

    this.schemaService = schemaService;
    this.contributions = contributions;
    this.promise = promiseConstructor || Promise;
  }

  JSONHover.prototype.doHover = function (document, position, doc) {
    var offset = document.offsetAt(position);
    var node = doc.getNodeFromOffset(offset);

    if (!node || (node.type === 'object' || node.type === 'array') && offset > node.offset + 1 && offset < node.offset + node.length - 1) {
      return this.promise.resolve(null);
    }

    var hoverRangeNode = node; // use the property description when hovering over an object key

    if (node.type === 'string') {
      var parent = node.parent;

      if (parent.type === 'property' && parent.keyNode === node) {
        node = parent.valueNode;

        if (!node) {
          return this.promise.resolve(null);
        }
      }
    }

    var hoverRange = _main.Range.create(document.positionAt(hoverRangeNode.offset), document.positionAt(hoverRangeNode.offset + hoverRangeNode.length));

    var createHover = function (contents) {
      var result = {
        contents: contents,
        range: hoverRange
      };
      return result;
    };

    var location = Parser.getNodePath(node);

    for (var i = this.contributions.length - 1; i >= 0; i--) {
      var contribution = this.contributions[i];
      var promise = contribution.getInfoContribution(document.uri, location);

      if (promise) {
        return promise.then(function (htmlContent) {
          return createHover(htmlContent);
        });
      }
    }

    return this.schemaService.getSchemaForResource(document.uri, doc).then(function (schema) {
      if (schema) {
        var matchingSchemas = doc.getMatchingSchemas(schema.schema, node.offset);
        var title_1 = null;
        var markdownDescription_1 = null;
        var markdownEnumValueDescription_1 = null,
            enumValue_1 = null;
        matchingSchemas.every(function (s) {
          if (s.node === node && !s.inverted && s.schema) {
            title_1 = title_1 || s.schema.title;
            markdownDescription_1 = markdownDescription_1 || s.schema.markdownDescription || toMarkdown(s.schema.description);

            if (s.schema.enum) {
              var idx = s.schema.enum.indexOf(Parser.getNodeValue(node));

              if (s.schema.markdownEnumDescriptions) {
                markdownEnumValueDescription_1 = s.schema.markdownEnumDescriptions[idx];
              } else if (s.schema.enumDescriptions) {
                markdownEnumValueDescription_1 = toMarkdown(s.schema.enumDescriptions[idx]);
              }

              if (markdownEnumValueDescription_1) {
                enumValue_1 = s.schema.enum[idx];

                if (typeof enumValue_1 !== 'string') {
                  enumValue_1 = JSON.stringify(enumValue_1);
                }
              }
            }
          }

          return true;
        });
        var result = '';

        if (title_1) {
          result = toMarkdown(title_1);
        }

        if (markdownDescription_1) {
          if (result.length > 0) {
            result += "\n\n";
          }

          result += markdownDescription_1;
        }

        if (markdownEnumValueDescription_1) {
          if (result.length > 0) {
            result += "\n\n";
          }

          result += "`" + toMarkdown(enumValue_1) + "`: " + markdownEnumValueDescription_1;
        }

        return createHover([result]);
      }

      return null;
    });
  };

  return JSONHover;
}();

exports.JSONHover = JSONHover;

function toMarkdown(plain) {
  if (plain) {
    var res = plain.replace(/([^\n\r])(\r?\n)([^\n\r])/gm, '$1\n\n$3'); // single new lines to \n\n (Markdown paragraph)

    return res.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&"); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
  }

  return void 0;
}
},{"../parser/jsonParser.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/parser/jsonParser.js","./../../vscode-languageserver-types/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-languageserver-types/main.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/jsonValidation.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONValidation = void 0;

var _main = require("./../../vscode-languageserver-types/main.js");

var _jsonLanguageTypes = require("../jsonLanguageTypes.js");

var nls = _interopRequireWildcard(require("./../../../fillers/vscode-nls.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var localize = nls.loadMessageBundle();

var JSONValidation =
/** @class */
function () {
  function JSONValidation(jsonSchemaService, promiseConstructor) {
    this.jsonSchemaService = jsonSchemaService;
    this.promise = promiseConstructor;
    this.validationEnabled = true;
  }

  JSONValidation.prototype.configure = function (raw) {
    if (raw) {
      this.validationEnabled = raw.validate;
      this.commentSeverity = raw.allowComments ? void 0 : _main.DiagnosticSeverity.Error;
    }
  };

  JSONValidation.prototype.doValidation = function (textDocument, jsonDocument, documentSettings, schema) {
    var _this = this;

    if (!this.validationEnabled) {
      return this.promise.resolve([]);
    }

    var diagnostics = [];
    var added = {};

    var addProblem = function (problem) {
      // remove duplicated messages
      var signature = problem.range.start.line + ' ' + problem.range.start.character + ' ' + problem.message;

      if (!added[signature]) {
        added[signature] = true;
        diagnostics.push(problem);
      }
    };

    var getDiagnostics = function (schema) {
      var trailingCommaSeverity = documentSettings ? toDiagnosticSeverity(documentSettings.trailingCommas) : _main.DiagnosticSeverity.Error;
      var commentSeverity = documentSettings ? toDiagnosticSeverity(documentSettings.comments) : _this.commentSeverity;

      if (schema) {
        if (schema.errors.length && jsonDocument.root) {
          var astRoot = jsonDocument.root;
          var property = astRoot.type === 'object' ? astRoot.properties[0] : null;

          if (property && property.keyNode.value === '$schema') {
            var node = property.valueNode || property;

            var range = _main.Range.create(textDocument.positionAt(node.offset), textDocument.positionAt(node.offset + node.length));

            addProblem(_main.Diagnostic.create(range, schema.errors[0], _main.DiagnosticSeverity.Warning, _jsonLanguageTypes.ErrorCode.SchemaResolveError));
          } else {
            var range = _main.Range.create(textDocument.positionAt(astRoot.offset), textDocument.positionAt(astRoot.offset + 1));

            addProblem(_main.Diagnostic.create(range, schema.errors[0], _main.DiagnosticSeverity.Warning, _jsonLanguageTypes.ErrorCode.SchemaResolveError));
          }
        } else {
          var semanticErrors = jsonDocument.validate(textDocument, schema.schema);

          if (semanticErrors) {
            semanticErrors.forEach(addProblem);
          }
        }

        if (schemaAllowsComments(schema.schema)) {
          trailingCommaSeverity = commentSeverity = void 0;
        }
      }

      jsonDocument.syntaxErrors.forEach(function (p) {
        if (p.code === _jsonLanguageTypes.ErrorCode.TrailingComma) {
          if (typeof commentSeverity !== 'number') {
            return;
          }

          p.severity = trailingCommaSeverity;
        }

        addProblem(p);
      });

      if (typeof commentSeverity === 'number') {
        var message_1 = localize('InvalidCommentToken', 'Comments are not permitted in JSON.');
        jsonDocument.comments.forEach(function (c) {
          addProblem(_main.Diagnostic.create(c, message_1, commentSeverity, _jsonLanguageTypes.ErrorCode.CommentNotPermitted));
        });
      }

      return diagnostics;
    };

    if (schema) {
      return this.promise.resolve(getDiagnostics(schema));
    }

    return this.jsonSchemaService.getSchemaForResource(textDocument.uri, jsonDocument).then(function (schema) {
      return getDiagnostics(schema);
    });
  };

  return JSONValidation;
}();

exports.JSONValidation = JSONValidation;

function schemaAllowsComments(schemaRef) {
  if (schemaRef && typeof schemaRef === 'object') {
    if (schemaRef.allowComments) {
      return true;
    }

    if (schemaRef.allOf) {
      return schemaRef.allOf.some(schemaAllowsComments);
    }
  }

  return false;
}

function toDiagnosticSeverity(severityLevel) {
  switch (severityLevel) {
    case 'error':
      return _main.DiagnosticSeverity.Error;

    case 'warning':
      return _main.DiagnosticSeverity.Warning;

    case 'ignore':
      return void 0;
  }

  return void 0;
}
},{"./../../vscode-languageserver-types/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-languageserver-types/main.js","../jsonLanguageTypes.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/jsonLanguageTypes.js","./../../../fillers/vscode-nls.js":"node_modules/monaco-editor/esm/vs/language/json/fillers/vscode-nls.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/utils/colors.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexDigit = hexDigit;
exports.colorFromHex = colorFromHex;
exports.colorFrom256RGB = colorFrom256RGB;
var Digit0 = 48;
var Digit9 = 57;
var A = 65;
var a = 97;
var f = 102;

function hexDigit(charCode) {
  if (charCode < Digit0) {
    return 0;
  }

  if (charCode <= Digit9) {
    return charCode - Digit0;
  }

  if (charCode < a) {
    charCode += a - A;
  }

  if (charCode >= a && charCode <= f) {
    return charCode - a + 10;
  }

  return 0;
}

function colorFromHex(text) {
  if (text[0] !== '#') {
    return null;
  }

  switch (text.length) {
    case 4:
      return {
        red: hexDigit(text.charCodeAt(1)) * 0x11 / 255.0,
        green: hexDigit(text.charCodeAt(2)) * 0x11 / 255.0,
        blue: hexDigit(text.charCodeAt(3)) * 0x11 / 255.0,
        alpha: 1
      };

    case 5:
      return {
        red: hexDigit(text.charCodeAt(1)) * 0x11 / 255.0,
        green: hexDigit(text.charCodeAt(2)) * 0x11 / 255.0,
        blue: hexDigit(text.charCodeAt(3)) * 0x11 / 255.0,
        alpha: hexDigit(text.charCodeAt(4)) * 0x11 / 255.0
      };

    case 7:
      return {
        red: (hexDigit(text.charCodeAt(1)) * 0x10 + hexDigit(text.charCodeAt(2))) / 255.0,
        green: (hexDigit(text.charCodeAt(3)) * 0x10 + hexDigit(text.charCodeAt(4))) / 255.0,
        blue: (hexDigit(text.charCodeAt(5)) * 0x10 + hexDigit(text.charCodeAt(6))) / 255.0,
        alpha: 1
      };

    case 9:
      return {
        red: (hexDigit(text.charCodeAt(1)) * 0x10 + hexDigit(text.charCodeAt(2))) / 255.0,
        green: (hexDigit(text.charCodeAt(3)) * 0x10 + hexDigit(text.charCodeAt(4))) / 255.0,
        blue: (hexDigit(text.charCodeAt(5)) * 0x10 + hexDigit(text.charCodeAt(6))) / 255.0,
        alpha: (hexDigit(text.charCodeAt(7)) * 0x10 + hexDigit(text.charCodeAt(8))) / 255.0
      };
  }

  return null;
}

function colorFrom256RGB(red, green, blue, alpha) {
  if (alpha === void 0) {
    alpha = 1.0;
  }

  return {
    red: red / 255.0,
    green: green / 255.0,
    blue: blue / 255.0,
    alpha: alpha
  };
}
},{}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/jsonDocumentSymbols.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONDocumentSymbols = void 0;

var Parser = _interopRequireWildcard(require("../parser/jsonParser.js"));

var Strings = _interopRequireWildcard(require("../utils/strings.js"));

var _colors = require("../utils/colors.js");

var nls = _interopRequireWildcard(require("./../../../fillers/vscode-nls.js"));

var _main = require("./../../vscode-languageserver-types/main.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var localize = nls.loadMessageBundle();

var JSONDocumentSymbols =
/** @class */
function () {
  function JSONDocumentSymbols(schemaService) {
    this.schemaService = schemaService;
  }

  JSONDocumentSymbols.prototype.findDocumentSymbols = function (document, doc) {
    var _this = this;

    var root = doc.root;

    if (!root) {
      return null;
    } // special handling for key bindings


    var resourceString = document.uri;

    if (resourceString === 'vscode://defaultsettings/keybindings.json' || Strings.endsWith(resourceString.toLowerCase(), '/user/keybindings.json')) {
      if (root.type === 'array') {
        var result_1 = [];
        root.items.forEach(function (item) {
          if (item.type === 'object') {
            for (var _i = 0, _a = item.properties; _i < _a.length; _i++) {
              var property = _a[_i];

              if (property.keyNode.value === 'key') {
                if (property.valueNode) {
                  if (property.valueNode) {
                    var location = _main.Location.create(document.uri, getRange(document, item));

                    result_1.push({
                      name: Parser.getNodeValue(property.valueNode),
                      kind: _main.SymbolKind.Function,
                      location: location
                    });
                  }

                  return;
                }
              }
            }
          }
        });
        return result_1;
      }
    }

    var collectOutlineEntries = function (result, node, containerName) {
      if (node.type === 'array') {
        node.items.forEach(function (node) {
          return collectOutlineEntries(result, node, containerName);
        });
      } else if (node.type === 'object') {
        node.properties.forEach(function (property) {
          var location = _main.Location.create(document.uri, getRange(document, property));

          var valueNode = property.valueNode;

          if (valueNode) {
            var childContainerName = containerName ? containerName + '.' + property.keyNode.value : property.keyNode.value;
            result.push({
              name: property.keyNode.value,
              kind: _this.getSymbolKind(valueNode.type),
              location: location,
              containerName: containerName
            });
            collectOutlineEntries(result, valueNode, childContainerName);
          }
        });
      }

      return result;
    };

    var result = collectOutlineEntries([], root, void 0);
    return result;
  };

  JSONDocumentSymbols.prototype.findDocumentSymbols2 = function (document, doc) {
    var _this = this;

    var root = doc.root;

    if (!root) {
      return null;
    } // special handling for key bindings


    var resourceString = document.uri;

    if (resourceString === 'vscode://defaultsettings/keybindings.json' || Strings.endsWith(resourceString.toLowerCase(), '/user/keybindings.json')) {
      if (root.type === 'array') {
        var result_2 = [];
        root.items.forEach(function (item) {
          if (item.type === 'object') {
            for (var _i = 0, _a = item.properties; _i < _a.length; _i++) {
              var property = _a[_i];

              if (property.keyNode.value === 'key') {
                if (property.valueNode) {
                  var range = getRange(document, item);
                  var selectionRange = getRange(document, property.keyNode);
                  result_2.push({
                    name: Parser.getNodeValue(property.valueNode),
                    kind: _main.SymbolKind.Function,
                    range: range,
                    selectionRange: selectionRange
                  });
                }

                return;
              }
            }
          }
        });
        return result_2;
      }
    }

    var collectOutlineEntries = function (result, node) {
      if (node.type === 'array') {
        node.items.forEach(function (node, index) {
          if (node) {
            var range = getRange(document, node);
            var selectionRange = range;
            var name = String(index);
            var children = collectOutlineEntries([], node);
            result.push({
              name: name,
              kind: _this.getSymbolKind(node.type),
              range: range,
              selectionRange: selectionRange,
              children: children
            });
          }
        });
      } else if (node.type === 'object') {
        node.properties.forEach(function (property) {
          var valueNode = property.valueNode;

          if (valueNode) {
            var range = getRange(document, property);
            var selectionRange = getRange(document, property.keyNode);
            var name = property.keyNode.value;
            var children = collectOutlineEntries([], valueNode);
            result.push({
              name: name,
              kind: _this.getSymbolKind(valueNode.type),
              range: range,
              selectionRange: selectionRange,
              children: children
            });
          }
        });
      }

      return result;
    };

    var result = collectOutlineEntries([], root);
    return result;
  };

  JSONDocumentSymbols.prototype.getSymbolKind = function (nodeType) {
    switch (nodeType) {
      case 'object':
        return _main.SymbolKind.Module;

      case 'string':
        return _main.SymbolKind.String;

      case 'number':
        return _main.SymbolKind.Number;

      case 'array':
        return _main.SymbolKind.Array;

      case 'boolean':
        return _main.SymbolKind.Boolean;

      default:
        // 'null'
        return _main.SymbolKind.Variable;
    }
  };

  JSONDocumentSymbols.prototype.getSymbolDetail = function (nodeType) {
    switch (nodeType) {
      case 'object':
        return localize('kind.object', 'object');

      case 'string':
        return localize('kind.string', 'string');

      case 'number':
        return localize('kind.number', 'number');

      case 'array':
        return localize('kind.array', 'array');

      case 'boolean':
        return localize('kind.boolean', 'boolean');

      default:
        // 'null'
        return localize('kind.null', 'null');
    }
  };

  JSONDocumentSymbols.prototype.findDocumentColors = function (document, doc) {
    return this.schemaService.getSchemaForResource(document.uri, doc).then(function (schema) {
      var result = [];

      if (schema) {
        var matchingSchemas = doc.getMatchingSchemas(schema.schema);
        var visitedNode = {};

        for (var _i = 0, matchingSchemas_1 = matchingSchemas; _i < matchingSchemas_1.length; _i++) {
          var s = matchingSchemas_1[_i];

          if (!s.inverted && s.schema && (s.schema.format === 'color' || s.schema.format === 'color-hex') && s.node && s.node.type === 'string') {
            var nodeId = String(s.node.offset);

            if (!visitedNode[nodeId]) {
              var color = (0, _colors.colorFromHex)(Parser.getNodeValue(s.node));

              if (color) {
                var range = getRange(document, s.node);
                result.push({
                  color: color,
                  range: range
                });
              }

              visitedNode[nodeId] = true;
            }
          }
        }
      }

      return result;
    });
  };

  JSONDocumentSymbols.prototype.getColorPresentations = function (document, doc, color, range) {
    var result = [];
    var red256 = Math.round(color.red * 255),
        green256 = Math.round(color.green * 255),
        blue256 = Math.round(color.blue * 255);

    function toTwoDigitHex(n) {
      var r = n.toString(16);
      return r.length !== 2 ? '0' + r : r;
    }

    var label;

    if (color.alpha === 1) {
      label = "#" + toTwoDigitHex(red256) + toTwoDigitHex(green256) + toTwoDigitHex(blue256);
    } else {
      label = "#" + toTwoDigitHex(red256) + toTwoDigitHex(green256) + toTwoDigitHex(blue256) + toTwoDigitHex(Math.round(color.alpha * 255));
    }

    result.push({
      label: label,
      textEdit: _main.TextEdit.replace(range, JSON.stringify(label))
    });
    return result;
  };

  return JSONDocumentSymbols;
}();

exports.JSONDocumentSymbols = JSONDocumentSymbols;

function getRange(document, node) {
  return _main.Range.create(document.positionAt(node.offset), document.positionAt(node.offset + node.length));
}
},{"../parser/jsonParser.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/parser/jsonParser.js","../utils/strings.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/utils/strings.js","../utils/colors.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/utils/colors.js","./../../../fillers/vscode-nls.js":"node_modules/monaco-editor/esm/vs/language/json/fillers/vscode-nls.js","./../../vscode-languageserver-types/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-languageserver-types/main.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/configuration.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schemaContributions = void 0;

var nls = _interopRequireWildcard(require("./../../../fillers/vscode-nls.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var localize = nls.loadMessageBundle();
var schemaContributions = {
  schemaAssociations: {},
  schemas: {
    // bundle the schema-schema to include (localized) descriptions
    'http://json-schema.org/draft-04/schema#': {
      'title': localize('schema.json', 'Describes a JSON file using a schema. See json-schema.org for more info.'),
      '$schema': 'http://json-schema.org/draft-04/schema#',
      'definitions': {
        'schemaArray': {
          'type': 'array',
          'minItems': 1,
          'items': {
            '$ref': '#'
          }
        },
        'positiveInteger': {
          'type': 'integer',
          'minimum': 0
        },
        'positiveIntegerDefault0': {
          'allOf': [{
            '$ref': '#/definitions/positiveInteger'
          }, {
            'default': 0
          }]
        },
        'simpleTypes': {
          'type': 'string',
          'enum': ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string']
        },
        'stringArray': {
          'type': 'array',
          'items': {
            'type': 'string'
          },
          'minItems': 1,
          'uniqueItems': true
        }
      },
      'type': 'object',
      'properties': {
        'id': {
          'type': 'string',
          'format': 'uri',
          'description': localize('schema.json.id', 'A unique identifier for the schema.')
        },
        '$schema': {
          'type': 'string',
          'format': 'uri',
          'description': localize('schema.json.$schema', 'The schema to verify this document against ')
        },
        'title': {
          'type': 'string',
          'description': localize('schema.json.title', 'A descriptive title of the element')
        },
        'description': {
          'type': 'string',
          'description': localize('schema.json.description', 'A long description of the element. Used in hover menus and suggestions.')
        },
        'default': {
          'description': localize('schema.json.default', 'A default value. Used by suggestions.')
        },
        'multipleOf': {
          'type': 'number',
          'minimum': 0,
          'exclusiveMinimum': true,
          'description': localize('schema.json.multipleOf', 'A number that should cleanly divide the current value (i.e. have no remainder)')
        },
        'maximum': {
          'type': 'number',
          'description': localize('schema.json.maximum', 'The maximum numerical value, inclusive by default.')
        },
        'exclusiveMaximum': {
          'type': 'boolean',
          'default': false,
          'description': localize('schema.json.exclusiveMaximum', 'Makes the maximum property exclusive.')
        },
        'minimum': {
          'type': 'number',
          'description': localize('schema.json.minimum', 'The minimum numerical value, inclusive by default.')
        },
        'exclusiveMinimum': {
          'type': 'boolean',
          'default': false,
          'description': localize('schema.json.exclusiveMininum', 'Makes the minimum property exclusive.')
        },
        'maxLength': {
          'allOf': [{
            '$ref': '#/definitions/positiveInteger'
          }],
          'description': localize('schema.json.maxLength', 'The maximum length of a string.')
        },
        'minLength': {
          'allOf': [{
            '$ref': '#/definitions/positiveIntegerDefault0'
          }],
          'description': localize('schema.json.minLength', 'The minimum length of a string.')
        },
        'pattern': {
          'type': 'string',
          'format': 'regex',
          'description': localize('schema.json.pattern', 'A regular expression to match the string against. It is not implicitly anchored.')
        },
        'additionalItems': {
          'anyOf': [{
            'type': 'boolean'
          }, {
            '$ref': '#'
          }],
          'default': {},
          'description': localize('schema.json.additionalItems', 'For arrays, only when items is set as an array. If it is a schema, then this schema validates items after the ones specified by the items array. If it is false, then additional items will cause validation to fail.')
        },
        'items': {
          'anyOf': [{
            '$ref': '#'
          }, {
            '$ref': '#/definitions/schemaArray'
          }],
          'default': {},
          'description': localize('schema.json.items', 'For arrays. Can either be a schema to validate every element against or an array of schemas to validate each item against in order (the first schema will validate the first element, the second schema will validate the second element, and so on.')
        },
        'maxItems': {
          'allOf': [{
            '$ref': '#/definitions/positiveInteger'
          }],
          'description': localize('schema.json.maxItems', 'The maximum number of items that can be inside an array. Inclusive.')
        },
        'minItems': {
          'allOf': [{
            '$ref': '#/definitions/positiveIntegerDefault0'
          }],
          'description': localize('schema.json.minItems', 'The minimum number of items that can be inside an array. Inclusive.')
        },
        'uniqueItems': {
          'type': 'boolean',
          'default': false,
          'description': localize('schema.json.uniqueItems', 'If all of the items in the array must be unique. Defaults to false.')
        },
        'maxProperties': {
          'allOf': [{
            '$ref': '#/definitions/positiveInteger'
          }],
          'description': localize('schema.json.maxProperties', 'The maximum number of properties an object can have. Inclusive.')
        },
        'minProperties': {
          'allOf': [{
            '$ref': '#/definitions/positiveIntegerDefault0'
          }],
          'description': localize('schema.json.minProperties', 'The minimum number of properties an object can have. Inclusive.')
        },
        'required': {
          'allOf': [{
            '$ref': '#/definitions/stringArray'
          }],
          'description': localize('schema.json.required', 'An array of strings that lists the names of all properties required on this object.')
        },
        'additionalProperties': {
          'anyOf': [{
            'type': 'boolean'
          }, {
            '$ref': '#'
          }],
          'default': {},
          'description': localize('schema.json.additionalProperties', 'Either a schema or a boolean. If a schema, then used to validate all properties not matched by \'properties\' or \'patternProperties\'. If false, then any properties not matched by either will cause this schema to fail.')
        },
        'definitions': {
          'type': 'object',
          'additionalProperties': {
            '$ref': '#'
          },
          'default': {},
          'description': localize('schema.json.definitions', 'Not used for validation. Place subschemas here that you wish to reference inline with $ref')
        },
        'properties': {
          'type': 'object',
          'additionalProperties': {
            '$ref': '#'
          },
          'default': {},
          'description': localize('schema.json.properties', 'A map of property names to schemas for each property.')
        },
        'patternProperties': {
          'type': 'object',
          'additionalProperties': {
            '$ref': '#'
          },
          'default': {},
          'description': localize('schema.json.patternProperties', 'A map of regular expressions on property names to schemas for matching properties.')
        },
        'dependencies': {
          'type': 'object',
          'additionalProperties': {
            'anyOf': [{
              '$ref': '#'
            }, {
              '$ref': '#/definitions/stringArray'
            }]
          },
          'description': localize('schema.json.dependencies', 'A map of property names to either an array of property names or a schema. An array of property names means the property named in the key depends on the properties in the array being present in the object in order to be valid. If the value is a schema, then the schema is only applied to the object if the property in the key exists on the object.')
        },
        'enum': {
          'type': 'array',
          'minItems': 1,
          'uniqueItems': true,
          'description': localize('schema.json.enum', 'The set of literal values that are valid')
        },
        'type': {
          'anyOf': [{
            '$ref': '#/definitions/simpleTypes'
          }, {
            'type': 'array',
            'items': {
              '$ref': '#/definitions/simpleTypes'
            },
            'minItems': 1,
            'uniqueItems': true
          }],
          'description': localize('schema.json.type', 'Either a string of one of the basic schema types (number, integer, null, array, object, boolean, string) or an array of strings specifying a subset of those types.')
        },
        'format': {
          'anyOf': [{
            'type': 'string',
            'description': localize('schema.json.format', 'Describes the format expected for the value.'),
            'enum': ['date-time', 'uri', 'email', 'hostname', 'ipv4', 'ipv6', 'regex']
          }, {
            'type': 'string'
          }]
        },
        'allOf': {
          'allOf': [{
            '$ref': '#/definitions/schemaArray'
          }],
          'description': localize('schema.json.allOf', 'An array of schemas, all of which must match.')
        },
        'anyOf': {
          'allOf': [{
            '$ref': '#/definitions/schemaArray'
          }],
          'description': localize('schema.json.anyOf', 'An array of schemas, where at least one must match.')
        },
        'oneOf': {
          'allOf': [{
            '$ref': '#/definitions/schemaArray'
          }],
          'description': localize('schema.json.oneOf', 'An array of schemas, exactly one of which must match.')
        },
        'not': {
          'allOf': [{
            '$ref': '#'
          }],
          'description': localize('schema.json.not', 'A schema which must not match.')
        }
      },
      'dependencies': {
        'exclusiveMaximum': ['maximum'],
        'exclusiveMinimum': ['minimum']
      },
      'default': {}
    }
  }
};
exports.schemaContributions = schemaContributions;
},{"./../../../fillers/vscode-nls.js":"node_modules/monaco-editor/esm/vs/language/json/fillers/vscode-nls.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/jsonSchemaService.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONSchemaService = exports.ResolvedSchema = exports.UnresolvedSchema = void 0;

var Json = _interopRequireWildcard(require("./../../jsonc-parser/main.js"));

var _index = _interopRequireDefault(require("./../../vscode-uri/index.js"));

var Strings = _interopRequireWildcard(require("../utils/strings.js"));

var Parser = _interopRequireWildcard(require("../parser/jsonParser.js"));

var nls = _interopRequireWildcard(require("./../../../fillers/vscode-nls.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var localize = nls.loadMessageBundle();

var FilePatternAssociation =
/** @class */
function () {
  function FilePatternAssociation(pattern) {
    try {
      this.patternRegExp = new RegExp(Strings.convertSimple2RegExpPattern(pattern) + '$');
    } catch (e) {
      // invalid pattern
      this.patternRegExp = null;
    }

    this.schemas = [];
  }

  FilePatternAssociation.prototype.addSchema = function (id) {
    this.schemas.push(id);
  };

  FilePatternAssociation.prototype.matchesPattern = function (fileName) {
    return this.patternRegExp && this.patternRegExp.test(fileName);
  };

  FilePatternAssociation.prototype.getSchemas = function () {
    return this.schemas;
  };

  return FilePatternAssociation;
}();

var SchemaHandle =
/** @class */
function () {
  function SchemaHandle(service, url, unresolvedSchemaContent) {
    this.service = service;
    this.url = url;

    if (unresolvedSchemaContent) {
      this.unresolvedSchema = this.service.promise.resolve(new UnresolvedSchema(unresolvedSchemaContent));
    }
  }

  SchemaHandle.prototype.getUnresolvedSchema = function () {
    if (!this.unresolvedSchema) {
      this.unresolvedSchema = this.service.loadSchema(this.url);
    }

    return this.unresolvedSchema;
  };

  SchemaHandle.prototype.getResolvedSchema = function () {
    var _this = this;

    if (!this.resolvedSchema) {
      this.resolvedSchema = this.getUnresolvedSchema().then(function (unresolved) {
        return _this.service.resolveSchemaContent(unresolved, _this.url);
      });
    }

    return this.resolvedSchema;
  };

  SchemaHandle.prototype.clearSchema = function () {
    this.resolvedSchema = null;
    this.unresolvedSchema = null;
  };

  return SchemaHandle;
}();

var UnresolvedSchema =
/** @class */
function () {
  function UnresolvedSchema(schema, errors) {
    if (errors === void 0) {
      errors = [];
    }

    this.schema = schema;
    this.errors = errors;
  }

  return UnresolvedSchema;
}();

exports.UnresolvedSchema = UnresolvedSchema;

var ResolvedSchema =
/** @class */
function () {
  function ResolvedSchema(schema, errors) {
    if (errors === void 0) {
      errors = [];
    }

    this.schema = schema;
    this.errors = errors;
  }

  ResolvedSchema.prototype.getSection = function (path) {
    return Parser.asSchema(this.getSectionRecursive(path, this.schema));
  };

  ResolvedSchema.prototype.getSectionRecursive = function (path, schema) {
    var _this = this;

    if (!schema || typeof schema === 'boolean' || path.length === 0) {
      return schema;
    }

    var next = path.shift();

    if (schema.properties && typeof schema.properties[next]) {
      return this.getSectionRecursive(path, schema.properties[next]);
    } else if (schema.patternProperties) {
      Object.keys(schema.patternProperties).forEach(function (pattern) {
        var regex = new RegExp(pattern);

        if (regex.test(next)) {
          return _this.getSectionRecursive(path, schema.patternProperties[pattern]);
        }
      });
    } else if (typeof schema.additionalProperties === 'object') {
      return this.getSectionRecursive(path, schema.additionalProperties);
    } else if (next.match('[0-9]+')) {
      if (Array.isArray(schema.items)) {
        var index = parseInt(next, 10);

        if (!isNaN(index) && schema.items[index]) {
          return this.getSectionRecursive(path, schema.items[index]);
        }
      } else if (schema.items) {
        return this.getSectionRecursive(path, schema.items);
      }
    }

    return null;
  };

  return ResolvedSchema;
}();

exports.ResolvedSchema = ResolvedSchema;

var JSONSchemaService =
/** @class */
function () {
  function JSONSchemaService(requestService, contextService, promiseConstructor) {
    this.contextService = contextService;
    this.requestService = requestService;
    this.promiseConstructor = promiseConstructor || Promise;
    this.callOnDispose = [];
    this.contributionSchemas = {};
    this.contributionAssociations = {};
    this.schemasById = {};
    this.filePatternAssociations = [];
    this.filePatternAssociationById = {};
    this.registeredSchemasIds = {};
  }

  JSONSchemaService.prototype.getRegisteredSchemaIds = function (filter) {
    return Object.keys(this.registeredSchemasIds).filter(function (id) {
      var scheme = _index.default.parse(id).scheme;

      return scheme !== 'schemaservice' && (!filter || filter(scheme));
    });
  };

  Object.defineProperty(JSONSchemaService.prototype, "promise", {
    get: function () {
      return this.promiseConstructor;
    },
    enumerable: true,
    configurable: true
  });

  JSONSchemaService.prototype.dispose = function () {
    while (this.callOnDispose.length > 0) {
      this.callOnDispose.pop()();
    }
  };

  JSONSchemaService.prototype.onResourceChange = function (uri) {
    uri = this.normalizeId(uri);
    var schemaFile = this.schemasById[uri];

    if (schemaFile) {
      schemaFile.clearSchema();
      return true;
    }

    return false;
  };

  JSONSchemaService.prototype.normalizeId = function (id) {
    // remove trailing '#', normalize drive capitalization
    return _index.default.parse(id).toString();
  };

  JSONSchemaService.prototype.setSchemaContributions = function (schemaContributions) {
    var _this = this;

    if (schemaContributions.schemas) {
      var schemas = schemaContributions.schemas;

      for (var id in schemas) {
        var normalizedId = this.normalizeId(id);
        this.contributionSchemas[normalizedId] = this.addSchemaHandle(normalizedId, schemas[id]);
      }
    }

    if (schemaContributions.schemaAssociations) {
      var schemaAssociations = schemaContributions.schemaAssociations;

      for (var pattern in schemaAssociations) {
        var associations = schemaAssociations[pattern];
        this.contributionAssociations[pattern] = associations;
        var fpa = this.getOrAddFilePatternAssociation(pattern);
        associations.forEach(function (schemaId) {
          var id = _this.normalizeId(schemaId);

          fpa.addSchema(id);
        });
      }
    }
  };

  JSONSchemaService.prototype.addSchemaHandle = function (id, unresolvedSchemaContent) {
    var schemaHandle = new SchemaHandle(this, id, unresolvedSchemaContent);
    this.schemasById[id] = schemaHandle;
    return schemaHandle;
  };

  JSONSchemaService.prototype.getOrAddSchemaHandle = function (id, unresolvedSchemaContent) {
    return this.schemasById[id] || this.addSchemaHandle(id, unresolvedSchemaContent);
  };

  JSONSchemaService.prototype.getOrAddFilePatternAssociation = function (pattern) {
    var fpa = this.filePatternAssociationById[pattern];

    if (!fpa) {
      fpa = new FilePatternAssociation(pattern);
      this.filePatternAssociationById[pattern] = fpa;
      this.filePatternAssociations.push(fpa);
    }

    return fpa;
  };

  JSONSchemaService.prototype.registerExternalSchema = function (uri, filePatterns, unresolvedSchemaContent) {
    var _this = this;

    if (filePatterns === void 0) {
      filePatterns = null;
    }

    var id = this.normalizeId(uri);
    this.registeredSchemasIds[id] = true;

    if (filePatterns) {
      filePatterns.forEach(function (pattern) {
        _this.getOrAddFilePatternAssociation(pattern).addSchema(id);
      });
    }

    return unresolvedSchemaContent ? this.addSchemaHandle(id, unresolvedSchemaContent) : this.getOrAddSchemaHandle(id);
  };

  JSONSchemaService.prototype.clearExternalSchemas = function () {
    var _this = this;

    this.schemasById = {};
    this.filePatternAssociations = [];
    this.filePatternAssociationById = {};
    this.registeredSchemasIds = {};

    for (var id in this.contributionSchemas) {
      this.schemasById[id] = this.contributionSchemas[id];
      this.registeredSchemasIds[id] = true;
    }

    for (var pattern in this.contributionAssociations) {
      var fpa = this.getOrAddFilePatternAssociation(pattern);
      this.contributionAssociations[pattern].forEach(function (schemaId) {
        var id = _this.normalizeId(schemaId);

        fpa.addSchema(id);
      });
    }
  };

  JSONSchemaService.prototype.getResolvedSchema = function (schemaId) {
    var id = this.normalizeId(schemaId);
    var schemaHandle = this.schemasById[id];

    if (schemaHandle) {
      return schemaHandle.getResolvedSchema();
    }

    return this.promise.resolve(null);
  };

  JSONSchemaService.prototype.loadSchema = function (url) {
    if (!this.requestService) {
      var errorMessage = localize('json.schema.norequestservice', 'Unable to load schema from \'{0}\'. No schema request service available', toDisplayString(url));
      return this.promise.resolve(new UnresolvedSchema({}, [errorMessage]));
    }

    return this.requestService(url).then(function (content) {
      if (!content) {
        var errorMessage = localize('json.schema.nocontent', 'Unable to load schema from \'{0}\': No content.', toDisplayString(url));
        return new UnresolvedSchema({}, [errorMessage]);
      }

      var schemaContent = {};
      var jsonErrors = [];
      schemaContent = Json.parse(content, jsonErrors);
      var errors = jsonErrors.length ? [localize('json.schema.invalidFormat', 'Unable to parse content from \'{0}\': Parse error at offset {1}.', toDisplayString(url), jsonErrors[0].offset)] : [];
      return new UnresolvedSchema(schemaContent, errors);
    }, function (error) {
      var errorMessage = localize('json.schema.unabletoload', 'Unable to load schema from \'{0}\': {1}', toDisplayString(url), error.toString());
      return new UnresolvedSchema({}, [errorMessage]);
    });
  };

  JSONSchemaService.prototype.resolveSchemaContent = function (schemaToResolve, schemaURL) {
    var _this = this;

    var resolveErrors = schemaToResolve.errors.slice(0);
    var schema = schemaToResolve.schema;
    var contextService = this.contextService;

    var findSection = function (schema, path) {
      if (!path) {
        return schema;
      }

      var current = schema;

      if (path[0] === '/') {
        path = path.substr(1);
      }

      path.split('/').some(function (part) {
        current = current[part];
        return !current;
      });
      return current;
    };

    var merge = function (target, sourceRoot, sourceURI, path) {
      var section = findSection(sourceRoot, path);

      if (section) {
        for (var key in section) {
          if (section.hasOwnProperty(key) && !target.hasOwnProperty(key)) {
            target[key] = section[key];
          }
        }
      } else {
        resolveErrors.push(localize('json.schema.invalidref', '$ref \'{0}\' in \'{1}\' can not be resolved.', path, sourceURI));
      }
    };

    var resolveExternalLink = function (node, uri, linkPath, parentSchemaURL) {
      if (contextService && !/^\w+:\/\/.*/.test(uri)) {
        uri = contextService.resolveRelativePath(uri, parentSchemaURL);
      }

      uri = _this.normalizeId(uri);
      return _this.getOrAddSchemaHandle(uri).getUnresolvedSchema().then(function (unresolvedSchema) {
        if (unresolvedSchema.errors.length) {
          var loc = linkPath ? uri + '#' + linkPath : uri;
          resolveErrors.push(localize('json.schema.problemloadingref', 'Problems loading reference \'{0}\': {1}', loc, unresolvedSchema.errors[0]));
        }

        merge(node, unresolvedSchema.schema, uri, linkPath);
        return resolveRefs(node, unresolvedSchema.schema, uri);
      });
    };

    var resolveRefs = function (node, parentSchema, parentSchemaURL) {
      if (!node || typeof node !== 'object') {
        return Promise.resolve(null);
      }

      var toWalk = [node];
      var seen = [];
      var openPromises = [];

      var collectEntries = function () {
        var entries = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          entries[_i] = arguments[_i];
        }

        for (var _a = 0, entries_1 = entries; _a < entries_1.length; _a++) {
          var entry = entries_1[_a];

          if (typeof entry === 'object') {
            toWalk.push(entry);
          }
        }
      };

      var collectMapEntries = function () {
        var maps = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          maps[_i] = arguments[_i];
        }

        for (var _a = 0, maps_1 = maps; _a < maps_1.length; _a++) {
          var map = maps_1[_a];

          if (typeof map === 'object') {
            for (var key in map) {
              var entry = map[key];

              if (typeof entry === 'object') {
                toWalk.push(entry);
              }
            }
          }
        }
      };

      var collectArrayEntries = function () {
        var arrays = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          arrays[_i] = arguments[_i];
        }

        for (var _a = 0, arrays_1 = arrays; _a < arrays_1.length; _a++) {
          var array = arrays_1[_a];

          if (Array.isArray(array)) {
            for (var _b = 0, array_1 = array; _b < array_1.length; _b++) {
              var entry = array_1[_b];

              if (typeof entry === 'object') {
                toWalk.push(entry);
              }
            }
          }
        }
      };

      var handleRef = function (next) {
        while (next.$ref) {
          var segments = next.$ref.split('#', 2);
          delete next.$ref;

          if (segments[0].length > 0) {
            openPromises.push(resolveExternalLink(next, segments[0], segments[1], parentSchemaURL));
            return;
          } else {
            merge(next, parentSchema, parentSchemaURL, segments[1]); // can set next.$ref again
          }
        }

        collectEntries(next.items, next.additionalProperties, next.not, next.contains, next.propertyNames, next.if, next.then, next.else);
        collectMapEntries(next.definitions, next.properties, next.patternProperties, next.dependencies);
        collectArrayEntries(next.anyOf, next.allOf, next.oneOf, next.items);
      };

      while (toWalk.length) {
        var next = toWalk.pop();

        if (seen.indexOf(next) >= 0) {
          continue;
        }

        seen.push(next);
        handleRef(next);
      }

      return _this.promise.all(openPromises);
    };

    return resolveRefs(schema, schema, schemaURL).then(function (_) {
      return new ResolvedSchema(schema, resolveErrors);
    });
  };

  JSONSchemaService.prototype.getSchemaForResource = function (resource, document) {
    // first use $schema if present
    if (document && document.root && document.root.type === 'object') {
      var schemaProperties = document.root.properties.filter(function (p) {
        return p.keyNode.value === '$schema' && p.valueNode && p.valueNode.type === 'string';
      });

      if (schemaProperties.length > 0) {
        var schemeId = Parser.getNodeValue(schemaProperties[0].valueNode);

        if (schemeId && Strings.startsWith(schemeId, '.') && this.contextService) {
          schemeId = this.contextService.resolveRelativePath(schemeId, resource);
        }

        if (schemeId) {
          var id = this.normalizeId(schemeId);
          return this.getOrAddSchemaHandle(id).getResolvedSchema();
        }
      }
    }

    var seen = Object.create(null);
    var schemas = [];

    for (var _i = 0, _a = this.filePatternAssociations; _i < _a.length; _i++) {
      var entry = _a[_i];

      if (entry.matchesPattern(resource)) {
        for (var _b = 0, _c = entry.getSchemas(); _b < _c.length; _b++) {
          var schemaId = _c[_b];

          if (!seen[schemaId]) {
            schemas.push(schemaId);
            seen[schemaId] = true;
          }
        }
      }
    }

    if (schemas.length > 0) {
      return this.createCombinedSchema(resource, schemas).getResolvedSchema();
    }

    return this.promise.resolve(null);
  };

  JSONSchemaService.prototype.createCombinedSchema = function (resource, schemaIds) {
    if (schemaIds.length === 1) {
      return this.getOrAddSchemaHandle(schemaIds[0]);
    } else {
      var combinedSchemaId = 'schemaservice://combinedSchema/' + encodeURIComponent(resource);
      var combinedSchema = {
        allOf: schemaIds.map(function (schemaId) {
          return {
            $ref: schemaId
          };
        })
      };
      return this.addSchemaHandle(combinedSchemaId, combinedSchema);
    }
  };

  return JSONSchemaService;
}();

exports.JSONSchemaService = JSONSchemaService;

function toDisplayString(url) {
  try {
    var uri = _index.default.parse(url);

    if (uri.scheme === 'file') {
      return uri.fsPath;
    }
  } catch (e) {// ignore
  }

  return url;
}
},{"./../../jsonc-parser/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/main.js","./../../vscode-uri/index.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-uri/index.js","../utils/strings.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/utils/strings.js","../parser/jsonParser.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/parser/jsonParser.js","./../../../fillers/vscode-nls.js":"node_modules/monaco-editor/esm/vs/language/json/fillers/vscode-nls.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/jsonFolding.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFoldingRanges = getFoldingRanges;

var _main = require("./../../vscode-languageserver-types/main.js");

var _main2 = require("./../../jsonc-parser/main.js");

var _jsonLanguageTypes = require("../jsonLanguageTypes.js");

function getFoldingRanges(document, context) {
  var ranges = [];
  var nestingLevels = [];
  var stack = [];
  var prevStart = -1;
  var scanner = (0, _main2.createScanner)(document.getText(), false);
  var token = scanner.scan();

  function addRange(range) {
    ranges.push(range);
    nestingLevels.push(stack.length);
  }

  while (token !== 17
  /* EOF */
  ) {
    switch (token) {
      case 1
      /* OpenBraceToken */
      :
      case 3
      /* OpenBracketToken */
      :
        {
          var startLine = document.positionAt(scanner.getTokenOffset()).line;
          var range = {
            startLine: startLine,
            endLine: startLine,
            kind: token === 1
            /* OpenBraceToken */
            ? 'object' : 'array'
          };
          stack.push(range);
          break;
        }

      case 2
      /* CloseBraceToken */
      :
      case 4
      /* CloseBracketToken */
      :
        {
          var kind = token === 2
          /* CloseBraceToken */
          ? 'object' : 'array';

          if (stack.length > 0 && stack[stack.length - 1].kind === kind) {
            var range = stack.pop();
            var line = document.positionAt(scanner.getTokenOffset()).line;

            if (range && line > range.startLine + 1 && prevStart !== range.startLine) {
              range.endLine = line - 1;
              addRange(range);
              prevStart = range.startLine;
            }
          }

          break;
        }

      case 13
      /* BlockCommentTrivia */
      :
        {
          var startLine = document.positionAt(scanner.getTokenOffset()).line;
          var endLine = document.positionAt(scanner.getTokenOffset() + scanner.getTokenLength()).line;

          if (scanner.getTokenError() === 1
          /* UnexpectedEndOfComment */
          && startLine + 1 < document.lineCount) {
            scanner.setPosition(document.offsetAt(_main.Position.create(startLine + 1, 0)));
          } else {
            if (startLine < endLine) {
              addRange({
                startLine: startLine,
                endLine: endLine,
                kind: _jsonLanguageTypes.FoldingRangeKind.Comment
              });
              prevStart = startLine;
            }
          }

          break;
        }

      case 12
      /* LineCommentTrivia */
      :
        {
          var text = document.getText().substr(scanner.getTokenOffset(), scanner.getTokenLength());
          var m = text.match(/^\/\/\s*#(region\b)|(endregion\b)/);

          if (m) {
            var line = document.positionAt(scanner.getTokenOffset()).line;

            if (m[1]) {
              // start pattern match
              var range = {
                startLine: line,
                endLine: line,
                kind: _jsonLanguageTypes.FoldingRangeKind.Region
              };
              stack.push(range);
            } else {
              var i = stack.length - 1;

              while (i >= 0 && stack[i].kind !== _jsonLanguageTypes.FoldingRangeKind.Region) {
                i--;
              }

              if (i >= 0) {
                var range = stack[i];
                stack.length = i;

                if (line > range.startLine && prevStart !== range.startLine) {
                  range.endLine = line;
                  addRange(range);
                  prevStart = range.startLine;
                }
              }
            }
          }

          break;
        }
    }

    token = scanner.scan();
  }

  var rangeLimit = context && context.rangeLimit;

  if (typeof rangeLimit !== 'number' || ranges.length <= rangeLimit) {
    return ranges;
  }

  var counts = [];

  for (var _i = 0, nestingLevels_1 = nestingLevels; _i < nestingLevels_1.length; _i++) {
    var level = nestingLevels_1[_i];

    if (level < 30) {
      counts[level] = (counts[level] || 0) + 1;
    }
  }

  var entries = 0;
  var maxLevel = 0;

  for (var i = 0; i < counts.length; i++) {
    var n = counts[i];

    if (n) {
      if (n + entries > rangeLimit) {
        maxLevel = i;
        break;
      }

      entries += n;
    }
  }

  var result = [];

  for (var i = 0; i < ranges.length; i++) {
    var level = nestingLevels[i];

    if (typeof level === 'number') {
      if (level < maxLevel || level === maxLevel && entries++ < rangeLimit) {
        result.push(ranges[i]);
      }
    }
  }

  return result;
}
},{"./../../vscode-languageserver-types/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-languageserver-types/main.js","./../../jsonc-parser/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/main.js","../jsonLanguageTypes.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/jsonLanguageTypes.js"}],"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/jsonLanguageService.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getLanguageService: true,
  TextDocument: true,
  Position: true,
  CompletionItem: true,
  CompletionList: true,
  Hover: true,
  Range: true,
  SymbolInformation: true,
  Diagnostic: true,
  TextEdit: true,
  FormattingOptions: true,
  MarkedString: true
};
exports.getLanguageService = getLanguageService;
Object.defineProperty(exports, "TextDocument", {
  enumerable: true,
  get: function () {
    return _main.TextDocument;
  }
});
Object.defineProperty(exports, "Position", {
  enumerable: true,
  get: function () {
    return _main.Position;
  }
});
Object.defineProperty(exports, "CompletionItem", {
  enumerable: true,
  get: function () {
    return _main.CompletionItem;
  }
});
Object.defineProperty(exports, "CompletionList", {
  enumerable: true,
  get: function () {
    return _main.CompletionList;
  }
});
Object.defineProperty(exports, "Hover", {
  enumerable: true,
  get: function () {
    return _main.Hover;
  }
});
Object.defineProperty(exports, "Range", {
  enumerable: true,
  get: function () {
    return _main.Range;
  }
});
Object.defineProperty(exports, "SymbolInformation", {
  enumerable: true,
  get: function () {
    return _main.SymbolInformation;
  }
});
Object.defineProperty(exports, "Diagnostic", {
  enumerable: true,
  get: function () {
    return _main.Diagnostic;
  }
});
Object.defineProperty(exports, "TextEdit", {
  enumerable: true,
  get: function () {
    return _main.TextEdit;
  }
});
Object.defineProperty(exports, "FormattingOptions", {
  enumerable: true,
  get: function () {
    return _main.FormattingOptions;
  }
});
Object.defineProperty(exports, "MarkedString", {
  enumerable: true,
  get: function () {
    return _main.MarkedString;
  }
});

var _main = require("./../vscode-languageserver-types/main.js");

var _jsonCompletion = require("./services/jsonCompletion.js");

var _jsonHover = require("./services/jsonHover.js");

var _jsonValidation = require("./services/jsonValidation.js");

var _jsonDocumentSymbols = require("./services/jsonDocumentSymbols.js");

var _jsonParser = require("./parser/jsonParser.js");

var _configuration = require("./services/configuration.js");

var _jsonSchemaService = require("./services/jsonSchemaService.js");

var _jsonFolding = require("./services/jsonFolding.js");

var _main2 = require("./../jsonc-parser/main.js");

var _jsonLanguageTypes = require("./jsonLanguageTypes.js");

Object.keys(_jsonLanguageTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _jsonLanguageTypes[key];
    }
  });
});

function getLanguageService(params) {
  var promise = params.promiseConstructor || Promise;
  var jsonSchemaService = new _jsonSchemaService.JSONSchemaService(params.schemaRequestService, params.workspaceContext, promise);
  jsonSchemaService.setSchemaContributions(_configuration.schemaContributions);
  var jsonCompletion = new _jsonCompletion.JSONCompletion(jsonSchemaService, params.contributions, promise);
  var jsonHover = new _jsonHover.JSONHover(jsonSchemaService, params.contributions, promise);
  var jsonDocumentSymbols = new _jsonDocumentSymbols.JSONDocumentSymbols(jsonSchemaService);
  var jsonValidation = new _jsonValidation.JSONValidation(jsonSchemaService, promise);
  return {
    configure: function (settings) {
      jsonSchemaService.clearExternalSchemas();

      if (settings.schemas) {
        settings.schemas.forEach(function (settings) {
          jsonSchemaService.registerExternalSchema(settings.uri, settings.fileMatch, settings.schema);
        });
      }

      jsonValidation.configure(settings);
    },
    resetSchema: function (uri) {
      return jsonSchemaService.onResourceChange(uri);
    },
    doValidation: jsonValidation.doValidation.bind(jsonValidation),
    parseJSONDocument: function (document) {
      return (0, _jsonParser.parse)(document, {
        collectComments: true
      });
    },
    newJSONDocument: function (root, diagnostics) {
      return (0, _jsonParser.newJSONDocument)(root, diagnostics);
    },
    doResolve: jsonCompletion.doResolve.bind(jsonCompletion),
    doComplete: jsonCompletion.doComplete.bind(jsonCompletion),
    findDocumentSymbols: jsonDocumentSymbols.findDocumentSymbols.bind(jsonDocumentSymbols),
    findDocumentSymbols2: jsonDocumentSymbols.findDocumentSymbols2.bind(jsonDocumentSymbols),
    findColorSymbols: function (d, s) {
      return jsonDocumentSymbols.findDocumentColors(d, s).then(function (s) {
        return s.map(function (s) {
          return s.range;
        });
      });
    },
    findDocumentColors: jsonDocumentSymbols.findDocumentColors.bind(jsonDocumentSymbols),
    getColorPresentations: jsonDocumentSymbols.getColorPresentations.bind(jsonDocumentSymbols),
    doHover: jsonHover.doHover.bind(jsonHover),
    getFoldingRanges: _jsonFolding.getFoldingRanges,
    format: function (d, r, o) {
      var range = void 0;

      if (r) {
        var offset = d.offsetAt(r.start);
        var length = d.offsetAt(r.end) - offset;
        range = {
          offset: offset,
          length: length
        };
      }

      var options = {
        tabSize: o ? o.tabSize : 4,
        insertSpaces: o ? o.insertSpaces : true,
        eol: '\n'
      };
      return (0, _main2.format)(d.getText(), range, options).map(function (e) {
        return _main.TextEdit.replace(_main.Range.create(d.positionAt(e.offset), d.positionAt(e.offset + e.length)), e.content);
      });
    }
  };
}
},{"./../vscode-languageserver-types/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-languageserver-types/main.js","./services/jsonCompletion.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/jsonCompletion.js","./services/jsonHover.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/jsonHover.js","./services/jsonValidation.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/jsonValidation.js","./services/jsonDocumentSymbols.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/jsonDocumentSymbols.js","./parser/jsonParser.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/parser/jsonParser.js","./services/configuration.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/configuration.js","./services/jsonSchemaService.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/jsonSchemaService.js","./services/jsonFolding.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/services/jsonFolding.js","./../jsonc-parser/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/jsonc-parser/main.js","./jsonLanguageTypes.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/jsonLanguageTypes.js"}],"node_modules/monaco-editor/esm/vs/language/json/jsonWorker.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.JSONWorker = void 0;

var jsonService = _interopRequireWildcard(require("./_deps/vscode-json-languageservice/jsonLanguageService.js"));

var ls = _interopRequireWildcard(require("./_deps/vscode-languageserver-types/main.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var Promise = monaco.Promise;
var defaultSchemaRequestService;

if (typeof fetch !== 'undefined') {
  defaultSchemaRequestService = function (url) {
    return fetch(url).then(function (response) {
      return response.text();
    });
  };
}

var PromiseAdapter =
/** @class */
function () {
  function PromiseAdapter(executor) {
    this.wrapped = new monaco.Promise(executor);
  }

  PromiseAdapter.prototype.then = function (onfulfilled, onrejected) {
    var thenable = this.wrapped;
    return thenable.then(onfulfilled, onrejected);
  };

  PromiseAdapter.prototype.getWrapped = function () {
    return this.wrapped;
  };

  PromiseAdapter.resolve = function (v) {
    return monaco.Promise.as(v);
  };

  PromiseAdapter.reject = function (v) {
    return monaco.Promise.wrapError(v);
  };

  PromiseAdapter.all = function (values) {
    return monaco.Promise.join(values);
  };

  return PromiseAdapter;
}();

var JSONWorker =
/** @class */
function () {
  function JSONWorker(ctx, createData) {
    this._ctx = ctx;
    this._languageSettings = createData.languageSettings;
    this._languageId = createData.languageId;
    this._languageService = jsonService.getLanguageService({
      schemaRequestService: createData.enableSchemaRequest && defaultSchemaRequestService,
      promiseConstructor: PromiseAdapter
    });

    this._languageService.configure(this._languageSettings);
  }

  JSONWorker.prototype.doValidation = function (uri) {
    var document = this._getTextDocument(uri);

    if (document) {
      var jsonDocument = this._languageService.parseJSONDocument(document);

      return this._languageService.doValidation(document, jsonDocument);
    }

    return Promise.as([]);
  };

  JSONWorker.prototype.doComplete = function (uri, position) {
    var document = this._getTextDocument(uri);

    var jsonDocument = this._languageService.parseJSONDocument(document);

    return this._languageService.doComplete(document, position, jsonDocument);
  };

  JSONWorker.prototype.doResolve = function (item) {
    return this._languageService.doResolve(item);
  };

  JSONWorker.prototype.doHover = function (uri, position) {
    var document = this._getTextDocument(uri);

    var jsonDocument = this._languageService.parseJSONDocument(document);

    return this._languageService.doHover(document, position, jsonDocument);
  };

  JSONWorker.prototype.format = function (uri, range, options) {
    var document = this._getTextDocument(uri);

    var textEdits = this._languageService.format(document, range, options);

    return Promise.as(textEdits);
  };

  JSONWorker.prototype.resetSchema = function (uri) {
    return Promise.as(this._languageService.resetSchema(uri));
  };

  JSONWorker.prototype.findDocumentSymbols = function (uri) {
    var document = this._getTextDocument(uri);

    var jsonDocument = this._languageService.parseJSONDocument(document);

    var symbols = this._languageService.findDocumentSymbols(document, jsonDocument);

    return Promise.as(symbols);
  };

  JSONWorker.prototype.findDocumentColors = function (uri) {
    var document = this._getTextDocument(uri);

    var stylesheet = this._languageService.parseJSONDocument(document);

    var colorSymbols = this._languageService.findDocumentColors(document, stylesheet);

    return Promise.as(colorSymbols);
  };

  JSONWorker.prototype.getColorPresentations = function (uri, color, range) {
    var document = this._getTextDocument(uri);

    var stylesheet = this._languageService.parseJSONDocument(document);

    var colorPresentations = this._languageService.getColorPresentations(document, stylesheet, color, range);

    return Promise.as(colorPresentations);
  };

  JSONWorker.prototype.provideFoldingRanges = function (uri, context) {
    var document = this._getTextDocument(uri);

    var ranges = this._languageService.getFoldingRanges(document, context);

    return Promise.as(ranges);
  };

  JSONWorker.prototype._getTextDocument = function (uri) {
    var models = this._ctx.getMirrorModels();

    for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
      var model = models_1[_i];

      if (model.uri.toString() === uri) {
        return ls.TextDocument.create(uri, this._languageId, model.version, model.getValue());
      }
    }

    return null;
  };

  return JSONWorker;
}();

exports.JSONWorker = JSONWorker;

function create(ctx, createData) {
  return new JSONWorker(ctx, createData);
}
},{"./_deps/vscode-json-languageservice/jsonLanguageService.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-json-languageservice/jsonLanguageService.js","./_deps/vscode-languageserver-types/main.js":"node_modules/monaco-editor/esm/vs/language/json/_deps/vscode-languageserver-types/main.js"}],"node_modules/monaco-editor/esm/vs/language/json/json.worker.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

var worker = _interopRequireWildcard(require("../../editor/editor.worker.js"));

var _jsonWorker = require("./jsonWorker.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

self.onmessage = function () {
  // ignore the first message
  worker.initialize(function (ctx, createData) {
    return new _jsonWorker.JSONWorker(ctx, createData);
  });
};
},{"../../editor/editor.worker.js":"node_modules/monaco-editor/esm/vs/editor/editor.worker.js","./jsonWorker.js":"node_modules/monaco-editor/esm/vs/language/json/jsonWorker.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58630" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","node_modules/monaco-editor/esm/vs/language/json/json.worker.js"], null)
//# sourceMappingURL=/json.worker.1e65d052.map