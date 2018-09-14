// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry) {
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

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({10:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pointStyle = {
  control_point_radius: 4,
  control_point_color: '#005cf9'
};

var ControlPoint = exports.ControlPoint = function () {
  function ControlPoint(x, y) {
    _classCallCheck(this, ControlPoint);

    this.x = x || 0;
    this.y = y || 0;
  }

  /* 画控制点 */


  _createClass(ControlPoint, [{
    key: 'draw',
    value: function draw(ratio) {
      ratio = ratio || 1;
      this.ctx.beginPath();
      this.ctx.arc(this.x * ratio, this.y * ratio, pointStyle.control_point_radius, 0, Math.PI * 2, false);
    }
  }, {
    key: 'print',
    value: function print(ratio) {
      this.draw(ratio);
      this.ctx.save();
      this.ctx.strokeStyle = pointStyle.control_point_color;
      this.ctx.fillStyle = pointStyle.control_point_color;
      this.ctx.stroke();
      this.ctx.fill();
      this.ctx.restore();
    }
  }, {
    key: 'isInPoint',
    value: function isInPoint(x, y) {
      this.draw();
      if (this.ctx.isPointInPath(x, y)) {
        return true;
      }
      return false;
    }
  }]);

  return ControlPoint;
}();
},{}],11:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Path = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _controlPoint = require('./control-point');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path = exports.Path = function () {
  function Path() {
    var isClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, Path);

    // super()
    this.isClose = isClose; // 路径是否关闭
  }

  _createClass(Path, [{
    key: 'isInPoint',
    value: function isInPoint(x, y) {
      var cep = void 0;
      for (var i = 0, len = this.length; i < len; i++) {
        cep = this[i].isInPoint(x, y);
        if (cep) {
          return {
            ep: this[i],
            cp: cep instanceof _controlPoint.ControlPoint ? cep : null
          };
        }
      }
      return null;
    }
  }, {
    key: 'removeSelected',
    value: function removeSelected() {
      this.forEach(function (ep) {
        ep.selected = false;
      });
    }
  }, {
    key: 'deleteSelected',
    value: function deleteSelected() {
      for (var i = 0, len = this.length; i < len; i++) {
        if (this[i].selected) {
          this.splice(i, 1);
          len = this.length;
          i--;
        }
      }
    }
  }, {
    key: 'addEndPoint',
    value: function addEndPoint(oed, ed) {
      for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] === oed) {
          this.splice(i + 1, 0, ed);
        }
      }
    }
  }]);

  return Path;
}();

Object.setPrototypeOf(Path.prototype, Array.prototype);
},{"./control-point":10}],12:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndPoint = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _controlPoint = require('./control-point');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pointStyle = {
  end_point_length: 5,
  mouse_end_point_length: 10,
  end_point_color: '#5d5d5d', // 轮廓颜色
  stroke_width: 2, // 轮廓宽度
  fill_color: '#ffffff', // 填充颜色
  hover_fill_color: '#ffc107' // 选中时的填充颜色
};

var EndPoint = exports.EndPoint = function () {
  function EndPoint(x, y, cp0, cp1) {
    _classCallCheck(this, EndPoint);

    this.x = x || 0;
    this.y = y || 0;
    this.selected = false; // endpoint被选中
    this.cp0 = cp0 || new _controlPoint.ControlPoint(x, y);
    this.cp1 = cp1 || new _controlPoint.ControlPoint(x, y);
    this.cpBalance = true; // 控制平衡点
  }

  _createClass(EndPoint, [{
    key: 'draw',
    value: function draw(ratio) {
      ratio = ratio || 1;
      this.ctx.beginPath();
      this.ctx.arc(this.x * ratio, this.y * ratio, pointStyle.end_point_length, 0, Math.PI * 2, false);
    }
  }, {
    key: 'print',
    value: function print(ratio) {
      ratio = ratio || 1;
      this.draw(ratio);
      this.ctx.save();
      this.ctx.strokeStyle = pointStyle.end_point_color;
      this.ctx.fillStyle = pointStyle.fill_color;
      this.ctx.lineWidth = pointStyle.stroke_width;
      if (this.selected) {
        this.ctx.fillStyle = pointStyle.hover_fill_color;
      }
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 绘制控制点

  }, {
    key: 'printControlPoints',
    value: function printControlPoints(ratio) {
      ratio = ratio || 1;
      this.print(ratio);
      if (!this.selected) {
        return;
      }
      if (this.cp0.x !== this.x || this.cp0.y !== this.y) {
        this.cp0.print(ratio);
        this.line(this.cp0.x, this.cp0.y, this.x, this.y, this.ctx, pointStyle.end_point_color);
      }
      if (this.cp1.x !== this.x || this.cp1.y !== this.y) {
        this.cp1.print(ratio);
        this.line(this.cp1.x, this.cp1.y, this.x, this.y, this.ctx, pointStyle.end_point_color);
      }
    }
    // draw line

  }, {
    key: 'line',
    value: function line(x1, y1, x2, y2, ctx, color) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.strokeStyle = color;
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    }
  }, {
    key: 'isInPoint',
    value: function isInPoint(x, y) {
      this.draw();
      if (this.ctx.isPointInPath(x, y)) {
        return this;
      }
      if (this.selected) {
        if (this.cp0.isInPoint(x, y)) {
          return this.cp0;
        }
        if (this.cp1.isInPoint(x, y)) {
          return this.cp1;
        }
      }
      return false;
    }
  }, {
    key: 'distanceOfPoint',
    value: function distanceOfPoint(controlPoint) {
      return Math.sqrt(Math.pow(this.x - controlPoint.x, 2) + Math.pow(this.y - controlPoint.y, 2));
    }
  }, {
    key: 'calculateControlPoint',
    value: function calculateControlPoint(x, y, controlPoint) {
      if (this.cpBalance) {
        controlPoint.counterpart = controlPoint === this.cp0 ? this.cp1 : this.cp0;
        controlPoint.counterpart.staticDistance = controlPoint.counterpart.staticDistance ? controlPoint.counterpart.staticDistance : this.distanceOfPoint(controlPoint.counterpart);

        var staticDistance = controlPoint.counterpart.staticDistance;
        var dynamicDistance = this.distanceOfPoint(controlPoint);

        controlPoint.counterpart.x = staticDistance / dynamicDistance * (this.x - x) + this.x;
        controlPoint.counterpart.y = staticDistance / dynamicDistance * (this.y - y) + this.y;
      }
      controlPoint.x = x;
      controlPoint.y = y;
    }
  }]);

  return EndPoint;
}();
},{"./control-point":10}],7:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pen = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _controlPoint = require('./control-point');

var _path = require('./path');

var _endPoint = require('./end-point');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pen = exports.Pen = function () {
  function Pen() {
    var targetCvs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#matting-pen';
    var sourceCvs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#matting-img';

    _classCallCheck(this, Pen);

    this.canvas = document.querySelector(targetCvs);
    this.sourceCvs = document.querySelector(sourceCvs);
    this.ctx = this.canvas.getContext('2d');
    this.stroke_color = '#ffc107'; // 线条颜色
  }

  _createClass(Pen, [{
    key: 'reset',
    value: function reset() {
      this.paths = [];
      this.paths.push(new _path.Path());

      this.dragging = false; // 是否正在拖动
      this.editCpBalance = false; // 控制点平衡
      this.isNewEndPoint = false; // 是否新点
      this.currentEndPoint = null; // 当前点
      this.draggingControlPoint = null; // 当前控制点
      // this.zoomRatio = 1  // 缩放比例

      _controlPoint.ControlPoint.prototype.ctx = this.ctx;
      _endPoint.EndPoint.prototype.ctx = this.ctx;
      _endPoint.EndPoint.prototype.canvas = this;

      this.canvas.width = this.sourceCvs.width;
      this.canvas.height = this.sourceCvs.height;
      this.active();
    }

    // the positoin on canvas

  }, {
    key: 'positionToCanvas',
    value: function positionToCanvas(x, y) {
      var bbox = this.canvas.getBoundingClientRect();
      return {
        x: x - bbox.left * (this.canvas.width / bbox.width),
        y: y - bbox.top * (this.canvas.height / bbox.height)
      };
    }
    // mouse click

  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      console.log('mousedown', e);

      var location = this.positionToCanvas(e.clientX, e.clientY);
      var selectedPath = this.getSelectedPath();

      this.dragging = true;
      this.isNewEndPoint = false;
      this.draggingControlPoint = false;
      this.currentEndPoint = this.isExistPoint(location.x, location.y);
      this.removeSelectedEndPoint();

      if (this.currentEndPoint) {
        // if the endPoint exist
        this.currentEndPoint.selected = true;

        if (this.editCpBalance && !this.draggingControlPoint) {
          var ced = this.currentEndPoint;
          ced.cpBalance = true;
          ced.cp0.x = ced.cp1.x = ced.x;
          ced.cp0.y = ced.cp1.y = ced.y;
          this.isNewEndPoint = true;
        }

        if (!this.draggingControlPoint && this.currentEndPoint === this.paths[this.paths.length - 1][0] && this.paths[this.paths.length - 1].length > 2) {
          // click first endpoint
          // close path
          this.createPath();
        }
      } else {
        this.currentEndPoint = this.createEndPoint(location.x, location.y);
        this.isNewEndPoint = true;
        if (this.editCpBalance && selectedPath) {
          // add endpoint to selectedendpoint after
          selectedPath.path.addEndPoint(selectedPath.ep, this.currentEndPoint);
        } else {
          this.paths[this.paths.length - 1].push(this.currentEndPoint);
        }
      }
      this.renderer();
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      e.preventDefault();

      if (!this.dragging) {
        return;
      }
      var loc = this.positionToCanvas(e.clientX, e.clientY);
      var ced = this.currentEndPoint;

      this.canvas.style.cursor = 'move';

      if (this.isNewEndPoint) {
        ced.cp1.x = loc.x;
        ced.cp1.y = loc.y;

        ced.cp0.x = ced.x * 2 - loc.x;
        ced.cp0.y = ced.y * 2 - loc.y;
      } else if (this.draggingControlPoint) {
        // Dragging controlPoint
        console.log('dragging controlPoint');

        if (this.editCpBalance) {
          ced.cpBalance = false;
        }
        this.draggingControlPoint.x = loc.x;
        this.draggingControlPoint.y = loc.y;
        ced.calculateControlPoint(loc.x, loc.y, this.draggingControlPoint);
      } else {
        // Dragging endpoint
        var offset = {
          x: loc.x - ced.x,
          y: loc.y - ced.y
        };
        ced.x = loc.x;
        ced.y = loc.y;

        ced.cp1.x += offset.x;
        ced.cp1.y += offset.y;
        ced.cp0.x += offset.x;
        ced.cp0.y += offset.y;
      }
      this.renderer();
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      // console.log('mouseup', e)
      this.canvas.style.cursor = 'default';
      this.dragging = false;
      if (this.draggingControlPoint) {
        if (this.draggingControlPoint.counterpart) {
          delete this.draggingControlPoint.counterpart.staticDistance;
        }
        delete this.draggingControlPoint.counterpart;
        this.draggingControlPoint = false;
      }
    }

    // key down: provide delete endPoint

  }, {
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      switch (e.keyCode) {
        case 8:
          e.preventDefault();
          this.deleteEndPoint();
          this.renderer();
      }
    }
    // active the canvas's eventListner

  }, {
    key: 'active',
    value: function active() {
      var that = this;
      var listeners = {
        mousedown: function mousedown(e) {
          that.onMouseDown(e);
        },
        mousemove: function mousemove(e) {
          that.onMouseMove(e);
        },
        mouseup: function mouseup(e) {
          that.onMouseUp(e);
        },
        keydown: function keydown(e) {
          that.onKeyDown(e);
        }
      };
      this.canvas.addEventListener('mousedown', listeners.mousedown, false);
      this.canvas.addEventListener('mousemove', listeners.mousemove, false);
      this.canvas.addEventListener('mouseup', listeners.mouseup, false);
      document.addEventListener('keydown', listeners.keydown, false);
    }
  }, {
    key: 'createPath',
    value: function createPath() {
      this.paths[this.paths.length - 1].isClose = true;
      this.paths.push(new _path.Path());
    }
  }, {
    key: 'getSelectedPath',
    value: function getSelectedPath() {
      for (var i = 0, len1 = this.paths.length; i < len1; i++) {
        for (var j = 0, len2 = this.paths[i].length; j < len2; j++) {
          if (this.paths[i][j].selected) {
            return {
              path: this.paths[i],
              ep: this.paths[i][j]
            };
          }
        }
      }
      return null;
    }
  }, {
    key: 'removeSelectedEndPoint',
    value: function removeSelectedEndPoint() {
      this.paths.forEach(function (path) {
        path.removeSelected();
      });
    }
  }, {
    key: 'createEndPoint',
    value: function createEndPoint(x, y) {
      var ep = new _endPoint.EndPoint(x, y);
      ep.selected = true;
      return ep;
    }

    // delete point

  }, {
    key: 'deleteEndPoint',
    value: function deleteEndPoint() {
      var paths = this.paths;
      for (var i = 0, l = paths.length; i < l; i++) {
        paths[i].deleteSelected();
        if (paths[i].length === 0 && i + 1 !== l) {
          paths.splice(i, 1);
          l = paths.length;
          i--;
        }
      }
    }
  }, {
    key: 'isExistPoint',
    value: function isExistPoint(x, y) {
      var cep = void 0,
          i = 0,
          l = void 0;
      for (l = this.paths.length; i < l; i++) {
        cep = this.paths[i].isInPoint(x, y);
        if (cep) {
          if (cep.cp instanceof _controlPoint.ControlPoint) {
            // set  controlpoint
            this.draggingControlPoint = cep.cp;
          }
          return cep.ep;
        }
      }
      return null;
    }
    // renderer the spline

  }, {
    key: 'renderer',
    value: function renderer() {
      var _this = this;

      var ep = void 0,
          prev_ep = void 0,
          ctx = this.ctx;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.paths.forEach(function (path) {
        var len = path.length;
        for (var i = 0; i < len; i++) {
          ep = path[i];
          ep.printControlPoints();
          if (i > 0) {
            // draw line
            prev_ep = path[i - 1];
            _this.bezierCurveTo(prev_ep, ep, ctx);
          }
        }
        if (path.isClose) {
          prev_ep = path[len - 1];
          ep = path[0];
          _this.bezierCurveTo(prev_ep, ep, ctx);
        }
      });
    }
  }, {
    key: 'bezierCurveTo',
    value: function bezierCurveTo(prev_ep, ep, ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = this.stroke_color;
      ctx.lineWidth = 2;
      ctx.moveTo(prev_ep.x, prev_ep.y);
      ctx.bezierCurveTo(prev_ep.cp1.x, prev_ep.cp1.y, ep.cp0.x, ep.cp0.y, ep.x, ep.y);
      // ctx.quadraticCurveTo(prev_ep.cp1.x, prev_ep.cp1.y, ep.x, ep.y)
      ctx.stroke();
      ctx.restore();
    }
  }]);

  return Pen;
}();
},{"./control-point":10,"./path":11,"./end-point":12}],6:[function(require,module,exports) {
module.exports="/tianer.1f28de55.jpg";
},{}],4:[function(require,module,exports) {
'use strict';

var _pen = require('./pen');

window.addEventListener('load', loadImg, false);

var imgCanvas = document.querySelector('#matting-img');
var imgCtx = imgCanvas.getContext('2d');
// img example 
function loadImg() {
  var img = new Image();
  img.onload = function () {
    var w = img.width;
    var h = img.height;

    imgCtx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
    imgCanvas.width = w * 1.5;
    imgCanvas.height = h * 1.2;
    imgCtx.drawImage(img, 0, 0, w * 1.5, h * 1.2);

    // Use class Pen here 
    var pen = new _pen.Pen();
    pen.reset();
  };
  img.src = require('../img/tianer.jpg');
}
},{"./pen":7,"../img/tianer.jpg":6}],16:[function(require,module,exports) {

var OVERLAY_ID = '__parcel__error__overlay__';

var global = (1, eval)('this');
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
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '60164' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
        parents.push(+k);
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
},{}]},{},[16,4])
//# sourceMappingURL=/main.0104bf58.map