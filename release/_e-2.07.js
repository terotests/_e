// The code template begins here
"use strict";

(function () {

  var __amdDefs__ = {};

  // The class definition is here...
  var _e_prototype = function _e_prototype() {
    // Then create the traits and subclasses for this class here...

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param array items
       */
      _myTrait_.add = function (items) {
        if (this._contentObj) {
          return this._contentObj.add.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }
        if (!(items instanceof Array)) {
          items = Array.prototype.slice.call(arguments, 0);
        }
        var me = this;
        items.forEach(function (e) {

          //
          if (me.isFunction(e)) {
            var creator = e;
            var newItem = _e();
            var res = e.apply(newItem, [me]);
            if (res) {
              e = res;
            } else {
              e = newItem;
            }
          }

          if (typeof e == "number" || typeof e == "string" || !isNaN(e)) {
            var nd = _e("span");
            nd._dom.innerHTML = e + "";
            me.add(nd);
            return me;
          }

          if (me.isStream(e)) {
            e.onValue(function (t) {
              me.add(t);
            });
            return me;
          }

          if (typeof e == "undefined") return;

          if (typeof e._dom != "undefined") {

            if (e._parent) {
              e._parent.removeChild(e);
            }

            if (!me._children) {
              me._children = [];
            }
            var ii = me._children.length;
            e._index = ii;
            me._children.push(e);
            e._parent = me;
            e._svg = me._svg;

            if (e._customElement) {
              if (e._initWithDef && e._initWithDef.componentWillMount) {
                e._initWithDef.componentWillMount.apply(e, []);
              }
            }

            me._dom.appendChild(e._dom);

            if (e._customElement) {

              // disallow locally scoped elements for now...
              if (!e._initWithDef) {
                var reCheck,
                    oldDef = e._customElement;
                if (e._customElement.customTag) {
                  reCheck = e._findCustomElem(e._customElement.customTag);
                }
                if (reCheck === oldDef) oldDef = null;
                var useDef = reCheck || e._customElement;
                if (!e._initWithDef || e._initWithDef != useDef) {
                  // e.clear(); // <- removed clear, should be taken care by _initCustom
                  me._initCustom(e, reCheck || e._customElement, me, e._customAttrs || {}, oldDef);
                }
              }
              if (e._initWithDef && e._initWithDef.componentDidMount) {
                e._initWithDef.componentDidMount.apply(e, []);
              }
            }

            if (e._contentObj) e._contentObj._contentParent = me;

            e.trigger("parent", me);
            me.trigger("child", e);
          }
        });

        return this;
      };

      /**
       * @param array items
       */
      _myTrait_.addItem = function (items) {

        var list = Array.prototype.slice.call(arguments, 0);
        return this.add.apply(this, list);
      };

      /**
       * Removes all the subnodes
       * @param float t
       */
      _myTrait_.clear = function (t) {

        if (this._contentObj) {
          return this._contentObj.clear.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        this._children.forEach(function (c) {
          c.remove();
        });
        this._children = [];
        while (this._dom.firstChild) {
          this._dom.removeChild(this._dom.firstChild);
        }
        return this;
      };

      /**
       * @param Object newItem
       */
      _myTrait_.insertAfter = function (newItem) {

        // referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);

        if (!this._parent) return;
        if (!this._parent._children) return;

        if (newItem == this) {
          return;
        }
        // var newItem = _e(a,b,c,d,e,f);
        var myIndex = this._index;
        var chList = this._parent._children;
        if (newItem._parent && newItem._parent != this._parent) {
          newItem._parent.removeChild(newItem);
          var myIndex = chList.indexOf(this);
          chList.splice(myIndex + 1, 0, newItem);
          this._parent.reIndex();
        } else {

          if (!newItem._parent) {
            newItem._parent = this._parent;
            chList.splice(myIndex + 1, 0, newItem);
          } else {
            var oldIndex = chList.indexOf(newItem);
            chList.splice(oldIndex, 1);
            var myIndex = chList.indexOf(this);
            chList.splice(myIndex + 1, 0, newItem);
          }
          this._parent.reIndex();
        }

        var pDOM = newItem._dom;
        var mDOM = this._dom;
        mDOM.parentNode.insertBefore(pDOM, mDOM.nextSibling);
      };

      /**
       * @param float i
       * @param float obj
       */
      _myTrait_.insertAt = function (i, obj) {

        if (i < this._children.length) {
          var ch = this.child(i);
          ch.insertBefore(obj);
        } else {
          this.add(obj);
        }
      };

      /**
       * Inserts a new node before an existing node
       * @param _e newItem  - Item to be inserted
       */
      _myTrait_.insertBefore = function (newItem) {

        if (!this._parent) return;
        if (!this._parent._children) return;

        if (newItem == this) {
          return;
        }

        // var newItem = _e(a,b,c,d,e,f);
        var myIndex = this._index;
        var chList = this._parent._children;

        if (newItem._parent && newItem._parent != this._parent) {
          newItem._parent.removeChild(newItem);
          newItem._parent = this._parent;
          var myIndex = chList.indexOf(this);
          chList.splice(myIndex, 0, newItem);
          this._parent.reIndex();
        } else {
          if (!newItem._parent) {
            newItem._parent = this._parent;
            chList.splice(myIndex, 0, newItem);
          } else {
            var oldIndex = chList.indexOf(newItem);
            if (oldIndex >= 0) chList.splice(oldIndex, 1);
            var myIndex = chList.indexOf(this);
            chList.splice(myIndex, 0, newItem);
          }
          this._parent.reIndex();
        }

        var pDOM = newItem._dom;
        var mDOM = this._dom;
        mDOM.parentNode.insertBefore(pDOM, mDOM);

        return this;
      };

      /**
       * Moves the node down in the DOM tree
       * @param float t
       */
      _myTrait_.moveDown = function (t) {

        if (typeof this._index != "undefined" && this._parent) {
          var myIndex = this._index,
              nextIndex;
          if (!this._parent) return;
          if (!this._parent._children) return;
          if (myIndex >= this._parent._children.length - 1) return;

          if (this._parent._children) {

            var next = this._parent._children[myIndex + 1];

            next._index--;
            this._index++;
            var chList = this._parent._children;

            chList.splice(myIndex + 1, 0, chList.splice(myIndex, 1)[0]);

            var pDOM = next._dom;
            var mDOM = this._dom;
            mDOM.parentNode.insertBefore(mDOM, pDOM.nextSibling);
          }
        }
      };

      /**
       * Moves the node up in the DOM tree
       * @param float t
       */
      _myTrait_.moveUp = function (t) {

        if (this._index && this._parent) {

          var myIndex = this._index,
              nextIndex;
          if (!myIndex) return;
          if (myIndex <= 0) return;
          if (this._parent._children) {

            var prev = this._parent._children[myIndex - 1];
            prev._index++;
            this._index--;
            var chList = this._parent._children;

            chList.splice(myIndex - 1, 0, chList.splice(myIndex, 1)[0]);

            var pDOM = prev._dom;
            var mDOM = this._dom;
            pDOM.parentNode.insertBefore(mDOM, pDOM);
          }
        }
      };

      /**
       * @param boolean dontSkipToContParent  - If set to true does not immediately skip to the parent&#39;s content parent
       */
      _myTrait_.parent = function (dontSkipToContParent) {
        if (this._contentParent) {
          return this._contentParent;
        }
        var p = this._parent;
        if (p && p._contentParent && !dontSkipToContParent) return p._contentParent;
        return p;
      };

      /**
       * Adds items as the first child of the current node
       * @param array items
       */
      _myTrait_.prepend = function (items) {
        if (this._contentObj) {
          return this._contentObj.prepend.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        if (!(items instanceof Array)) {
          items = Array.prototype.slice.call(arguments, 0);
        }
        var me = this;
        items.forEach(function (e) {
          if (typeof e == "string") {
            me._dom.innerHTML = e;
            return me;
          }

          if (typeof e == "undefined") return;

          if (typeof e._dom != "undefined") {

            if (e._parent) {
              e._parent.removeChild(e);
            }

            if (!me._children) {
              me._children = [];
            }

            e._index = 0;
            me._children.unshift(e);
            e._parent = me;
            me._dom.insertBefore(e._dom, me._dom.firstChild);

            var len = me._children.length;
            for (var i = 0; i < len; i++) me._children[i]._index = i;

            e.trigger("parent", me);
            me.trigger("child", e);
          }
        });

        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.reIndex = function (t) {

        var chList = this._children;
        var i = 0,
            len = chList.length;
        for (var i = 0; i < len; i++) {
          this._children[i]._index = i;
        }
      };

      /**
       * Removes the item from the DOM -tree
       * @param float t
       */
      _myTrait_.remove = function (t) {

        if (this._initWithDef && this._initWithDef.componentWillUnmount) {
          this._initWithDef.componentWillUnmount.apply(this, []);
        }
        this.removeChildEvents();

        if (this._parent) {
          this._parent.removeChild(this);
        } else {
          var p = this._dom.parentElement;
          if (p) p.removeChild(this._dom);
        }

        this._children = [];
        this.removeAllHandlers();
      };

      /**
       * Removes a child of the node
       * @param Object o
       */
      _myTrait_.removeChild = function (o) {
        if (this._contentObj) {
          return this._contentObj.removeChild.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        if (this._children) {

          var me = this;
          var i = this._children.indexOf(o);
          if (i >= 0) {
            this._children.splice(i, 1);
            this._dom.removeChild(o._dom);
          }
          this.reIndex();
        }
      };

      /**
       * @param float t
       */
      _myTrait_.removeChildEvents = function (t) {
        this.forChildren(function (ch) {
          if (ch._initWithDef && ch._initWithDef.componentWillUnmount) {
            ch._initWithDef.componentWillUnmount.apply(ch, []);
          }
          ch.removeAllHandlers();
          ch.removeChildEvents();
        });
      };

      /**
       * Removes the node from the index, but not from the DOM tree
       * @param Object o
       */
      _myTrait_.removeIndexedChild = function (o) {
        if (this._contentObj) {
          return this._contentObj.removeIndexedChild.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }
        if (this._children) {
          var i = this._children.indexOf(o);
          if (i >= 0) {
            this._children.splice(i, 1);
          }
        }
      };

      /**
       * @param Object elem
       */
      _myTrait_.replaceWith = function (elem) {
        // var a = A.parentNode.replaceChild(document.createElement("span"), A);

        var p = this.parent();
        if (p) {
          var pi = p._children.indexOf(this);
          p._dom.replaceChild(elem._dom, this._dom);
          p._children.splice(pi, 1, elem);
          elem._parent = p;
          elem._svg = this._svg;
          // copy the event handlers of not????
          // this.remove();
        }
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _mousePoint;

      // Initialize static variables here...

      /**
       * @param float opts
       */
      _myTrait_.baconDrag = function (opts) {
        var me = this;
        return Bacon.fromBinder(function (sink) {
          me.drag(function (dv) {
            sink(dv);
          });
        });
      };

      /**
       * @param float callBack
       * @param float disableTransform
       */
      _myTrait_.drag = function (callBack, disableTransform) {
        var me = this,
            state = {};

        if (this.isObject(callBack) && !this.isFunction(callBack)) {

          var objToDrag = callBack;
          var sx, sy;
          callBack = function (dv) {
            if (dv.start) {
              sx = objToDrag.x();
              sy = objToDrag.y();
            }
            objToDrag.x(sx + dv.dx).y(sy + dv.dy);
          };
        }

        var rootTransform, rootScreen;

        this.draggable(function (o, dv) {
          state.item = me;
          state.sx = dv.x;
          state.sy = dv.y;
          state.mx = dv.mx;
          state.my = dv.my;
          state.dx = 0;
          state.dy = 0;
          state.x = dv.x;
          state.y = dv.y;
          state.start = true;
          state.end = false;

          // find the transformation matrix if any...
          var trans = me.findTransform(null, true);
          if (!disableTransform && trans.length > 0 && typeof Matrix3D != "undefined") {
            rootTransform = Matrix3D();
            trans.forEach(function (m) {
              rootTransform.matMul(m);
            });
            rootScreen = me.findScreen();
            var point = rootTransform.dragTransformation(state, rootScreen);
            state.sx = point.sx;
            state.sy = point.sy;
            state.x = point.x;
            state.y = point.y;
            state.dx = point.dx;
            state.dy = point.dy;
          } else {
            rootTransform = null;
          }

          callBack(state);
        }, function (o, dv) {
          state.start = false;
          state.dx = dv.dx;
          state.dy = dv.dy;
          state.mx = dv.mx;
          state.my = dv.my;
          state.x = state.sx + state.dx;
          state.y = state.sy + state.dy;
          if (!disableTransform && rootTransform) {
            var point = rootTransform.dragTransformation(state, rootScreen);
            state.sx = point.sx;
            state.sy = point.sy;
            state.x = point.x;
            state.y = point.y;
            state.dx = point.dx;
            state.dy = point.dy;
          }
          callBack(state);
        }, function (o, dv) {
          state.end = true;
          state.dx = dv.dx;
          state.dy = dv.dy;
          state.mx = dv.mx;
          state.my = dv.my;
          if (!disableTransform && rootTransform) {
            var point = rootTransform.dragTransformation(state, rootScreen);
            state.sx = point.sx;
            state.sy = point.sy;
            state.x = point.x;
            state.y = point.y;
            state.dx = point.dx;
            state.dy = point.dy;
          }
          callBack(state);
        });
        return this;
      };

      /**
       * Three functions, fired when drag starts, proceeds and ends
       * @param function startFn
       * @param float middleFn
       * @param float endFn
       */
      _myTrait_.draggable = function (startFn, middleFn, endFn) {

        // prevent setting two times the drag
        if (this._dragEnabled) return;

        var _eg = this.__singleton();
        _eg.draggable(this);

        // sets the item as draggable item..
        this._dragEnabled = true;

        if (startFn) this.on("startdrag", startFn);
        if (middleFn) this.on("drag", middleFn);
        if (endFn) this.on("enddrag", endFn);
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {
        this._touchItems = [];
      });

      /**
       * @param float t
       */
      _myTrait_.mousePos = function (t) {
        if (!_mousePoint) {
          _mousePoint = {};
        }
        var off = this.offset(),
            _eg = this.__singleton(),
            m = _eg.mouse();

        _mousePoint.sx = m.x;
        _mousePoint.sy = m.y;
        _mousePoint.x = m.x - off.left;
        _mousePoint.y = m.y - off.top;
        return _mousePoint;
      };

      /**
       * @param float e
       */
      _myTrait_.pauseEvents = function (e) {
        e = e || window.event;

        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;

        return false;
      };

      /**
       * Get touch number i
       * @param int i
       */
      _myTrait_.touch = function (i) {
        return this._touchItems[i];
      };

      /**
       * Enables click emulation on touch devices
       * @param float t
       */
      _myTrait_.touchclick = function (t) {
        this.touchevents();
        var o = this;
        this.on("touchstart", function (o, dv) {
          o.trigger("click");
        });
        return this;
      };

      /**
       * Initializes the touch events
       * @param float t
       */
      _myTrait_.touchevents = function (t) {

        // NOTE
        // http://blogs.msdn.com/b/davrous/archive/2013/02/20/handling-touch-in-your-html5-apps-thanks-to-the-pointer-events-of-ie10-and-windows-8.aspx
        // http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
        // https://coderwall.com/p/egbgdw
        // http://jessefreeman.com/articles/from-webkit-to-windows-8-touch-events/

        var elem = this._dom;

        // No hope...
        if (!elem.addEventListener) return;

        var o = this;
        this._touchItems = [];

        var touchStart = function touchStart(e) {

          // o._touchItems = [];
          var allTouches = e.touches;

          if (e.targetTouches) allTouches = e.targetTouches;

          o._touchCount = allTouches.length;
          o._touchItems.length = o._touchCount; // truncate array

          for (var i = 0; i < allTouches.length; i++) {
            var item = {};
            item.startX = allTouches[0].pageX;
            item.startY = allTouches[0].pageY;
            item.startMs = new Date().getTime();
            o._touchItems[i] = item;
          }
          o.trigger("touchstart");
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();

          e.returnValue = false;
          return false;
        };

        var touchMove = function touchMove(e) {
          var allTouches = e.touches;
          if (e.targetTouches) allTouches = e.targetTouches; // [0].pageX;)
          o._touchCount = allTouches.length;
          for (var i = 0; i < allTouches.length; i++) {
            var item = o._touchItems[i];
            if (!item) continue;
            item.dx = e.touches[i].pageX - item.startX;
            item.dy = e.touches[i].pageY - item.startY;
            //item.x = e.touches[i].pageX - off.left;
            //item.y = e.touches[i].pageY - off.top;
          }

          if (o._touchCount > 1) {
            var pinch = {
              items: o._touchItems
            };
            o.trigger("pinch", pinch);
          }

          o.trigger("touchmove");
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          return false;
        };

        var touchEnd = function touchEnd(e) {
          o.trigger("touchend");
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          e.returnValue = false;
          return false;
        };

        /*elem.addEventListener("touchcancel", function(e) {
                      o.trigger("touchcancel");
                      e.preventDefault();
                      }, false);*/

        var msHandler = function msHandler(event) {
          // o.trigger("mstouch",event);
          switch (event.type) {
            case "touchstart":
            case "MSPointerDown":
              touchStart(event);
              break;
            case "touchmove":
            case "MSPointerMove":
              touchMove(event);
              break;
            case "touchend":
            case "MSPointerUp":
              touchEnd(event);
              break;
          }
          // if(event.preventDefault) event.preventDefault();
          event.returnValue = false;
          //                     event.preventDefault();
        };

        elem.addEventListener("touchstart", touchStart, false);
        elem.addEventListener("touchmove", touchMove, false);
        elem.addEventListener("touchend", touchEnd, false);
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * Makes the DOM element absolute positioned
       * @param float t
       */
      _myTrait_.absolute = function (t) {
        this.q.css("position", "absolute");
        this.x(0).y(0).z(this.baseZ());
        return this;
      };

      /**
       * @param float v
       */
      _myTrait_.baseZ = function (v) {
        if (typeof v != "undefined") {
          this._baseZ = v;
          return this;
        }
        if (typeof this._baseZ == "undefined") this._baseZ = 0;
        return this._baseZ;
      };

      /**
       * @param float t
       */
      _myTrait_.box = function (t) {
        var box = {
          left: 0,
          top: 0,
          width: 800,
          height: 800
        };

        var elem = this._dom;
        try {
          // BlackBerry 5, iOS 3 (original iPhone)
          if (typeof elem.getBoundingClientRect !== "undefined") {
            box = elem.getBoundingClientRect();
          }
        } catch (e) {
          // for IE having this bg
          box = {
            left: 0,
            top: 0,
            width: 800,
            height: 800
          };
        }
        return box;
      };

      /**
       * @param float v
       */
      _myTrait_.height = function (v) {
        if (this._contentObj) {
          return this._contentObj.height(v);
        }
        if (typeof v == "undefined") return this._h;

        if (this.isStream(v)) {
          var me = this;
          v.onValue(function (v) {
            me.height(v);
          });
          return this;
        }

        if (v == "auto") {
          this._dom.style.height = v;
          this._h = v;
          return this;
        }
        if (v.slice) {
          if (v.slice(-1) == "%") {
            this._dom.style.height = v;
            return this;
          }
          if (v.slice(-2) == "em") {
            this._dom.style.height = v;
            return this;
          }
        }

        var p = this.pxParam(v);
        if (typeof p != "undefined") {
          this._dom.style.height = p;
          this._h = parseInt(v);
          this.trigger("height");
        }
        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.offset = function (t) {
        var doc = document.documentElement;
        var scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        var scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

        var box = this.box();
        return {
          top: box.top + scrollTop, // + document.body.scrollTop, //  - docElem.clientTop,
          left: box.left + scrollLeft, // + document.body.scrollLeft // - docElem.clientLeft
          width: box.width,
          height: box.height
        };
      };

      /**
       * Transform the param into CSS pixel value, like &quot;12px&quot;
       * @param float v
       */
      _myTrait_.pxParam = function (v) {
        if (typeof v == "string") {
          return parseInt(v) + "px";
        } else {
          var i = parseInt(v);
          if (!isNaN(i)) {
            return i + "px";
          }
        }
      };

      /**
       * Makes the DOM item relatively positioned
       * @param float t
       */
      _myTrait_.relative = function (t) {
        this.q.css("position", "relative");
        this.x(0).y(0).z(this.baseZ());
        return this;
      };

      /**
       * @param float v
       */
      _myTrait_.width = function (v) {
        if (this._contentObj) {
          return this._contentObj.width(v);
        }

        if (typeof v == "undefined") return this._w;

        if (this.isStream(v)) {
          var me = this;
          v.onValue(function (v) {
            me.width(v);
          });
          return this;
        }

        if (v == "auto") {
          this._dom.style.width = v;
          this._w = v;
          return this;
        }

        if (v.slice) {
          if (v.slice(-1) == "%") {
            this._dom.style.width = v;
            return this;
          }
          if (v.slice(-2) == "em") {
            this._dom.style.width = v;
            return this;
          }
        }

        var p = this.pxParam(v);
        if (typeof p != "undefined") {
          this._dom.style.width = p;
          this._w = parseInt(v);
          this.trigger("width");
        }
        return this;
      };

      /**
       * @param float v  - if set, the value of the x
       */
      _myTrait_.x = function (v) {

        if (this.isStream(v)) {
          var me = this;
          v.onValue(function (v) {
            me.x(v);
          });
          return this;
        }

        if (typeof v != "undefined") {
          this.q.css("left", v + "px");
          this._x = v;
          this.trigger("x");
          return this;
        }
        if (typeof this._x == "undefined") this._x = 0;
        return this._x;
      };

      /**
       * @param float v  - if set, the value of y
       */
      _myTrait_.y = function (v) {

        if (this.isStream(v)) {
          var me = this;
          v.onValue(function (v) {
            me.y(v);
          });
          return this;
        }

        if (typeof v != "undefined") {
          this.q.css("top", v + "px");
          this._y = v;
          this.trigger("y");
          return this;
        }
        if (typeof this._y == "undefined") this._y = 0;
        return this._y;
      };

      /**
       * @param float v  - if set, the value of z-index
       */
      _myTrait_.z = function (v) {

        if (this.isStream(v)) {
          var me = this;
          v.onValue(function (v) {
            me.z(v);
          });
          return this;
        }

        var base = this._baseZ || 0;
        if (typeof v != "undefined") {
          this.q.css("zIndex", v + base);
          this._z = v;
          this.trigger("z");
          return this;
        }
        if (typeof this._z == "undefined") this._z = 0;
        return this._z;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _effects;
      var _nsConversion;
      var _nsIndex;

      // Initialize static variables here...

      /**
       * @param Object options  - The screen options
       * @param Boolean fromDOM  - Do we use DOM as source
       */
      _myTrait_._resetProjection = function (options, fromDOM) {

        if (!options.has3D) return;

        if (fromDOM) {
          var box = this.offset();
          if (!options.offset) options.offset = {};
          options.offset.x = box.left;
          options.offset.y = box.top;
          options.screenWidth = box.width;
          options.screenHeight = box.height;
          options.width = box.width;
          options.height = box.height;
        }

        if (options.lastWidth == options.width && options.lastHeight == options.height) return;

        // perspectiveOrigin
        var halfWidth = parseInt(options.width / 2),
            halfHeight = parseInt(options.height / 2);

        // the projection screen size
        this._dom.style.perspectiveOrigin = halfWidth + "px " + halfHeight + "px ";
        this._dom.style.transformStyle = "preserve-3d";

        options.lastWidth = options.width;
        options.lastHeight = options.height;

        options.has3D = true;
      };

      /**
      * Returns object, which will return computed style for the element. The returned object can be used as
      ```javascript
      var cs = el.compStyle();
      cs.get(&quot;color&quot;);
      ```
      * @param float t  
      */
      _myTrait_.compStyle = function (t) {
        var elem = this._dom;
        var cs = window.getComputedStyle(elem, null);
        return {
          get: function get(prop) {
            return cs.getPropertyValue(prop);
          }
        };
      };

      /**
       * @param float name
       * @param float inPosition
       * @param float outPosition
       * @param float options
       */
      _myTrait_.createEffect = function (name, inPosition, outPosition, options) {

        css().bind("." + name + "OutPosition", outPosition);
        css().bind("." + name + "InPosition", inPosition);

        options = options || {};
        options.duration = options.duration || 0.2;

        css().animation(name + "Out", {
          duration: options.duration.toFixed(2) * 2 + "s",
          "iteration-count": 1 }, inPosition, 0.5, outPosition, outPosition);

        css().animation(name + "In", {
          duration: options.duration.toFixed(2) * 2 + "s",
          "iteration-count": 1 }, outPosition, 0.5, inPosition, inPosition);

        _effects[name] = options;
      };

      /**
       * @param String subNamespace
       */
      _myTrait_.css = function (subNamespace) {
        if (this._contentObj) {
          return this._contentObj.css.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }
        // convert the namespaces to shorter versions
        if (!_nsConversion) {
          _nsConversion = {};
          _nsIndex = 1;
        }

        if (!this._myClass) {
          this._myClass = "css_" + this.guid();
        }

        // subNamespace is usually used together with custom components, which are
        // defining their own styles in some namespace
        if (subNamespace) {
          // css namespaces of this object
          if (!this._cssNs) this._cssNs = {};

          // if the CSS object has been constructed
          var cssObj = this._cssNs[subNamespace];
          if (cssObj) return cssObj;

          // if not, create a new css object in a new namespace
          var nsFull = this._myClass + "_" + subNamespace;
          if (!_nsConversion[nsFull]) _nsConversion[nsFull] = _nsIndex++;
          var nsShort = this._myClass + "_" + _nsConversion[nsFull];

          cssObj = css(nsShort);
          this._cssNs[subNamespace] = cssObj;
          cssObj._nameSpace = nsShort;
          return cssObj;
        }

        if (!this._css) {
          this._css = css(this._myClass);
          this.addClass(this._myClass);
        }

        return this._css;
      };

      /**
       * @param float name
       * @param float fn
       */
      _myTrait_.effectIn = function (name, fn) {

        if (!this._effectOn) this._effectOn = {};

        if (this._effectOn[name]) {
          return;
        }

        if (!this._effectState) {
          this._effectState = {};
          this._effectState[name] = 1;
          return;
        }

        if (this._effectState[name] == 1) return;

        this._effectOn[name] = new Date().getTime();

        var options = _effects[name];

        var eOut = name + "Out",
            eIn = name + "In",
            eInPos = name + "InPosition",
            eOutPos = name + "OutPosition";

        this.removeClass(eOut);
        this.removeClass(eIn);
        this.addClass(eIn);
        var me = this;
        later().after(options.duration, function () {
          me.removeClass(eOutPos);
          me.addClass(eInPos);
          me.removeClass(eIn);
          me._effectOn[name] = 0;
          me._effectState[name] = 1;
          if (fn) fn();
        });
      };

      /**
       * @param float name
       * @param float fn
       */
      _myTrait_.effectOut = function (name, fn) {
        if (!this._effectOn) this._effectOn = {};

        if (this._effectOn[name]) {
          return;
        }
        if (!this._effectState) {
          this._effectState = {};
          this._effectState[name] = 1;
        }
        if (this._effectState[name] == 2) return;

        this._effectOn[name] = new Date().getTime();

        var options = _effects[name];

        var eOut = name + "Out",
            eIn = name + "In",
            eInPos = name + "InPosition",
            eOutPos = name + "OutPosition";

        this.removeClass(eOut);
        this.removeClass(eIn);
        this.addClass(eOut);
        var me = this;
        later().after(options.duration, function () {
          me.removeClass(eInPos);
          me.addClass(eOutPos);
          me.removeClass(eOut);
          me._effectOn[name] = 0;
          me._effectState[name] = 2;
          if (fn) fn();
        });
      };

      /**
       * @param float t
       */
      _myTrait_.findScreen = function (t) {
        if (!this._screenDefinition) {
          var p = this.parent();
          if (p) return p.findScreen();

          // if no screen found, return default screen
          return {
            screenWidth: 1000,
            screenHeight: 1000,
            perspective: 101133300,
            offset: {
              x: 0,
              y: 0
            }
          };
        } else {
          var options = this._screenDefinition;
          var box = this.offset();
          if (!options.offset) options.offset = {};

          options.offset.x = box.left;
          options.offset.y = box.top;
          options.screenWidth = box.width;
          options.screenHeight = box.height;
          options.width = box.width;
          options.height = box.height;

          this._resetProjection(options);

          // TODO: should we calculate the screen size also here??

          return options;
        }
      };

      /**
       * Collects all the transformations for a certain matrix.
       * @param Array results  - Left empty upon first call
       * @param float startFromParent
       */
      _myTrait_.findTransform = function (results, startFromParent) {

        if (!results) results = [];

        if (!startFromParent) {
          if (this._transformMatrix) {
            results.unshift(this._transformMatrix);
          }
        }
        var p = this._parent;
        if (p) p.findTransform(results);

        return results;
      };

      /**
       * Hides the node from DOM tree
       * @param float t
       */
      _myTrait_.hide = function (t) {
        this._dom.style.display = "none";
        this.trigger("hide");
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {
        if (!_effects) {
          _effects = {};
        }
      });

      /**
       * @param Object options  - The screen definition
       */
      _myTrait_.setProjectionScreen = function (options) {

        options = options || {};

        var hadPerspective = false;
        if (!options.perspective) {
          options.perspective = 101133300;
        } else {
          hadPerspective = true;
          this._dom.style.perspective = options.perspective + "px";
          this._dom.style.webkitPerspective = options.perspective + "px";
        }

        if (options.has3D || hadPerspective) {

          if (options.width && options.height) {
            this._resetProjection(options);
          }
          options.has3D = true;
        }

        this._screenDefinition = options;
        var me = this;

        me.on("width", function () {
          me._resetProjection(options, true);
        });
        me.on("height", function () {
          me._resetProjection(options, true);
        });
      };

      /**
       * Set transform matrix this element is listening right now..
       * @param Matrix m3d  - Matrix3D instance
       * @param float use3D
       */
      _myTrait_.setTransformMatrix = function (m3d, use3D) {
        if (this._transformMatrix) {
          // setting second time is an error

          this._transformMatrix.removeListener(this._matrixHandler);
          m3d.onChange(this._matrixHandler);
          this._transformMatrix = m3d;
          return this;
        }

        this._transformMatrix = m3d;
        this._use3D = use3D;

        var me = this;
        this._matrixHandler = function (m) {
          me.updateTransFromMatrix(m);
        };
        m3d.onChange(this._matrixHandler);

        return this;
      };

      /**
       * Shows the node in the DOM tree if not visible
       * @param float t
       */
      _myTrait_.show = function (t) {
        this._dom.style.display = "";
        this.trigger("show");
      };

      /**
       * Creates a local CSS style using the css() object
       * @param string v
       */
      _myTrait_.style = function (v) {
        if (typeof v != "undefined") {}
        if (!this._localStyle) {
          var createStyleGuid = "localstyle" + new Date().getTime() + "_" + guid();
          this._localStyle = css().css("width", "auto");
          this._localStyle.writeRule(createStyleGuid);
          this.addClass(createStyleGuid);
        }
        return this._localStyle;
      };

      /**
       * @param String value
       */
      _myTrait_.styleString = function (value) {
        // TODO: binding the style string???
        this._dom.style.cssText = value;
        return this;
      };

      /**
       * @param float fromMatrix
       */
      _myTrait_.updateTransFromMatrix = function (fromMatrix) {
        if (this._transformMatrix) {

          // update from 2D matrix this time, no 3D support right now...

          if (this._use3D) {
            var styleStr = fromMatrix.getCSSMatrix3D();
            this.attr("style", styleStr);
            return this;
          } else {
            var tx = fromMatrix.get2DTransform();
          }
          var d = this._dom;
          d.style["transform"] = tx;
          d.style["-webkit-transform"] = tx;
          d.style["-moz-transform"] = tx;
          d.style["-ms-transform"] = tx;
          tx = "0px 0px";;
          d.style["transform-origin"] = tx;
          d.style["-webkit-transform-origin"] = tx;
          d.style["-moz-transform-origin"] = tx;
          d.style["-ms-transform-origin"] = tx;

          this.trigger("transform");
        }
        return this;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * adds rows of items into the table, for example tbl.addRow(a,b,c)
       * @param Array items
       */
      _myTrait_.addRow = function (items) {

        if (this._contentObj) {
          return this._contentObj.addRow.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        var row = new _e("tr");
        this.addItem(row);

        row.addClass("row" + this._children.length);

        var itemList = items;
        if (!this.isArray(items)) {
          var len = arguments.length;
          var ii = 0;
          itemList = new Array(len);
          while (ii < len) itemList[ii] = arguments[ii++];
        }

        var colIndex = 0,
            me = this;
        itemList.forEach(function (ii) {
          row.td("col" + colIndex++, {
            "valign": "top"
          }).add(ii);
        });
        return this;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param int i
       */
      _myTrait_.child = function (i) {
        if (this._contentObj) {
          return this._contentObj.child(i);
        }
        return this._children[i];
      };

      /**
       * @param float t
       */
      _myTrait_.childCount = function (t) {
        if (this._contentObj) {
          return this._contentObj.childCount();
        }

        if (!this._children) return 0;
        return this._children.length;
      };

      /**
       * Calls function for all the direct children of this node
       * @param function fn
       * @param float recursive
       */
      _myTrait_.forChildren = function (fn, recursive) {
        if (this._contentObj) {
          return this._contentObj.forChildren(fn, recursive);
        }

        if (this._children) {
          this._children.forEach(function (c) {
            fn(c);
            if (recursive) c.forChildren(fn, recursive);
          });
        }
      };

      /**
       * Calls function for all the direct children of this node
       * @param function fn
       */
      _myTrait_.forEach = function (fn) {
        if (this._contentObj) {
          return this._contentObj.forEach.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        if (this._children) this._children.forEach(function (c) {
          fn(c);
        });
      };

      /**
       * Returns all the children which return true when given as parameter to function fn.
       * @param function fn
       * @param float list
       */
      _myTrait_.searchTree = function (fn, list) {
        if (this._contentObj) {
          return this._contentObj.searchTree(fn, list);
        }

        if (!list) list = [];
        var v;
        if (v = fn(this)) list.push(v);
        if (this._children) this._children.forEach(function (c) {
          // if(fn(c)) list.push(c);
          c.searchTree(fn, list);
        });
        return list;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param string c
       */
      _myTrait_.addClass = function (c) {
        if (this._contentObj) {
          return this._contentObj.addClass(c);
        }
        if (this._svg) return this;
        if (this._dom instanceof SVGElement) return;

        if (!this._classes) {
          this._classes = [];
        }

        if (this.isStream(c)) {

          var me = this,
              oldClass = "";
          c.onValue(function (c) {
            if (oldClass && c != oldClass) {
              me.removeClass(oldClass);
            }
            me.addClass(c);
            oldClass = c;
          });

          return this;
        }

        if (this.hasClass(c)) return;
        this._classes.push(c);
        if (!this._svg) this._dom.className = this._classes.join(" ");

        return this;
      };

      /**
       * @param float str
       */
      _myTrait_.findPostFix = function (str) {

        if (this._myClass) {
          return this._myClass;
        } else {
          var p = this.parent();
          if (p) return p.findPostFix();
        }
        return "";
      };

      /**
       * @param string c
       */
      _myTrait_.hasClass = function (c) {
        if (this._contentObj) {
          return this._contentObj.hasClass(c);
        }
        if (!this._classes) return false;
        if (this._classes.indexOf(c) >= 0) return true;
        return false;
      };

      /**
       * @param string c
       */
      _myTrait_.removeClass = function (c) {
        if (this._contentObj) {
          return this._contentObj.removeClass(c);
        }

        if (!this._classes) return this;
        var i;
        while ((i = this._classes.indexOf(c)) >= 0) {
          if (i >= 0) {
            this._classes.splice(i, 1);
            this._dom.className = this._classes.join(" ");
          }
        }
        return this;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _touchClick;
      var _outInit;
      var _outListeners;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_._alwaysTouchclick = function (t) {
        _touchClick = t;
      };

      /**
       * @param float eventName
       * @param float eventTransformer
       */
      _myTrait_.bacon = function (eventName, eventTransformer) {

        return Bacon.fromEvent(this._dom, eventName, eventTransformer); // (this._dom, eventName [, eventTransformer])
      };

      /**
       * @param String en
       * @param float fn
       * @param float stop
       */
      _myTrait_.bindSysEvent = function (en, fn, stop) {
        en = en.toLowerCase();
        if (!this._sys) this._sys = {};
        if (this._sys[en]) return false;

        this._sys[en] = true;

        var me = this;
        if (!stop) {
          this._dom.addEventListener(en, fn);
        } else {
          this._dom.addEventListener(en, function (e) {
            e = e || window.event;
            me._event = e;
            if (stop) {
              if (e && e.stopPropagation) {
                e.stopPropagation();
              } else {
                e = window.event;
                e.cancelBubble = true;
              }
            }
            fn();
          });
        }
        return true;
      };

      /**
       * Delegates the events to this object
       * @param _e myDelecate
       */
      _myTrait_.delegate = function (myDelecate) {

        if (!this._delegates) this._delegates = [];
        this._delegates.push(myDelecate);
      };

      /**
       * @param float dom
       * @param float eventName
       * @param float fn
       * @param float stop
       */
      _myTrait_.eventBinder = function (dom, eventName, fn, stop) {
        var me = this;
        dom.addEventListener(eventName, function (e) {
          e = e || window.event;
          me._event = e;
          if (stop) {
            if (e && e.stopPropagation) {
              e.stopPropagation();
            } else {
              e = window.event;
              e.cancelBubble = true;
            }
          }
          fn();
        });
      };

      /**
       * @param float t
       */
      _myTrait_.isHovering = function (t) {
        if (!this._hoverable) {
          this._hovering = false;
          var o = this;

          this.on("mouseenter", function () {
            o._hovering = true;
          });
          this.on("mouseleave", function () {
            o._hovering = false;
          });
          this._hoverable = true;
        }
        return this._hovering;
      };

      /**
       * @param float name
       * @param float fn
       */
      _myTrait_.namedListener = function (name, fn) {

        if (typeof fn != "undefined") {

          if (!this._namedListeners) this._namedListeners = {};
          this._namedListeners[name] = fn;
          fn._listenerName = name;
          return this;
        }
        if (!this._namedListeners) return;
        return this._namedListeners[name];
      };

      /**
       * Binds event name to event function
       * @param string en  - Event name
       * @param float ef
       */
      _myTrait_.on = function (en, ef) {
        if (this._contentObj) {
          return this._contentObj.on(en, ef);
        }

        if (!this._ev) this._ev = {};
        if (!this._ev[en]) this._ev[en] = [];

        this._ev[en].push(ef);
        var me = this;

        ef._unbindEvent = function () {
          me.removeListener(en, ef);
        };

        if (en == "outclick") {
          if (!_outInit) {
            _outInit = true;
            _outListeners = [];
            if (document.body) {
              document.body.addEventListener("click", function () {
                // isHovering
                for (var i = 0; i < _outListeners.length; i++) {
                  var out = _outListeners[i];
                  if (!out.isHovering()) out.trigger("outclick");
                }
              }, true);
            }
          }
          if (_outListeners.indexOf(me) < 0) {
            _outListeners.push(me);
          }
          this.isHovering();
          return this;
        }

        if (en == "load") {
          if (this._imgLoaded) {
            this.trigger("load");
          }
        }

        // To stop the prop...
        if (en == "click") {
          this.bindSysEvent("click", function () {
            me.trigger("click");
          }, true);

          // if automatic touchclick emulation is on
          if (_touchClick) this.touchclick();
        }

        if (en == "dblclick") this.bindSysEvent("dblclick", function () {
          me.trigger("dblclick");
        }, true);

        if (en == "mousedown") this.bindSysEvent("mousedown", function () {
          me.trigger("mousedown");
        });

        if (en == "mouseup") this.bindSysEvent("mouseup", function () {
          me.trigger("mouseup");
        });

        if (en == "checked") {

          this.bindSysEvent("change", function () {
            if (me._type == "checkbox") {
              if (me._dom.checked) {
                me._checked = true;
              } else {
                me._checked = false;
              }
              me.trigger("checked");
            } else {
              me._value = me._dom.value;
            }
            me.trigger("value");
          });
        }

        if (en == "value") {
          this.bindSysEvent("change", function () {
            if (me._type == "checkbox") {
              if (me._dom.checked) {
                me._checked = true;
              } else {
                me._checked = false;
              }
              me.trigger("checked");
            } else {
              me._value = me._dom.value;
            }
            me.trigger("value");
          });

          if (this._type == "input" || this._type == "textarea") {
            var lastValue = "";
            this.bindSysEvent("keyup", function () {
              var bch = false;
              if (lastValue != me._dom.value) bch = true;
              me._value = me._dom.value;
              if (bch) me.trigger("value");
              lastValue = me._dom.value;
            });
          }
        }

        if (en == "focus") {
          this.bindSysEvent("focus", function () {
            me._value = me._dom.value;
            me.trigger("focus");
          });
        }

        if (en == "play") {
          this.bindSysEvent("play", function () {
            me.trigger("play");
          });
        }

        if (en == "mousemove") {
          this.bindSysEvent("mousemove", function () {
            me.trigger("mousemove");
          });
        }

        if (en == "blur") {
          this.bindSysEvent("blur", function () {
            me._value = me._dom.value;
            me.trigger("blur");
          });
        }

        if (en == "mouseenter") {

          // this._dragEnabled
          var gs = this.__singleton();
          this.bindSysEvent("mouseover", function (e) {
            e = e || window.event;
            if (me._hover) return;
            me._hover = true;
            me._event = e;
            var dtSet = false;
            if (me._dragEnabled) {
              gs.setDragTarget(me);
              dtSet = true;
            }
            var pp = me._parent;
            while (pp && !pp._hover) {
              pp.trigger("mouseenter");
              if (!dtSet) {
                if (pp._dragEnabled) {
                  gs.setDragTarget(pp);
                  dtSet = true;
                }
              }
              pp = pp._parent;
            }
            me.trigger("mouseenter");
          }, true);
          this.bindSysEvent("mouseout", function (e) {
            if (!me._hover) return;

            var childHover = false;
            me.forChildren(function (c) {
              if (c._hover) childHover = true;
            });

            if (childHover) return;
            me._hover = false;
            me.trigger("mouseleave");
          }, true);
        }

        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.removeAllHandlers = function (t) {

        if (this._ev) {
          // console.log("Removing handlers....");
          for (var n in this._ev) {
            if (this._ev.hasOwnProperty(n)) {
              var list = this._ev[n],
                  me = this;
              //console.log("Removing list....", list);
              list.forEach(function (fn) {
                if (me._namedListeners) {
                  var ln = fn._listenerName;
                  if (me._namedListeners[ln]) {
                    delete me._namedListeners[ln];
                  }
                }
                if (fn._unbindEvent) {
                  //console.log("Calling unbind event... for ", fn);
                  fn._unbindEvent();
                }
              });
            }
          }
          for (var n in this._namedListeners) {
            if (this._namedListeners.hasOwnProperty(n)) {
              var fn = this._namedListeners[n];
              if (fn._unbindEvent) {
                //console.log("Calling unbind event... for ", fn);
                fn._unbindEvent();
              }
              delete this._namedListeners[n];
            }
          }

          if (_outListeners) {
            var i = _outListeners.indexOf(this);
            if (i >= 0) {
              _outListeners.splice(i, 1);
            }
          }
        }
      };

      /**
       * @param float eventName
       * @param float fn
       */
      _myTrait_.removeListener = function (eventName, fn) {
        if (this._ev && this._ev[eventName]) {
          var i = this._ev[eventName].indexOf(fn);
          if (i >= 0) this._ev[eventName].splice(i, 1);

          if (this._ev[eventName].length == 0) {
            delete this._ev[eventName];
          }
        }
      };

      /**
       * triggers event with data and optional function
       * @param string en
       * @param float data
       * @param float fn
       */
      _myTrait_.trigger = function (en, data, fn) {

        if (this._contentObj) {
          return this._contentObj.trigger(en, data, fn);
        }

        if (this._delegates) {
          this._delegates.forEach(function (d) {
            if (d && d.trigger) d.trigger(en, data, fn);
          });
          // return;
        }
        if (!this._ev) return;
        if (!this._ev[en]) return;
        var me = this;
        this._ev[en].forEach(function (cb) {
          if (cb) {
            cb.apply(me, [me, data, fn]);
          }
        });
        return this;
      };

      /**
       * @param string listenerName
       * @param float fn
       */
      _myTrait_.uniqueListener = function (listenerName, fn) {
        var oldList = this.namedListener(listenerName);
        if (oldList) {
          if (oldList._unbindEvent) oldList._unbindEvent();
        }
        this.namedListener(listenerName, fn);
        return fn;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * Binds input value to an object with data
       * @param object obj
       * @param float varName
       * @param function withFunction
       */
      _myTrait_.bind = function (obj, varName, withFunction) {
        if (this._contentObj) {
          return this._contentObj.bind.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        var o = this,
            me = this;

        if (this.isFunction(obj[varName])) {

          var val = obj.get(varName),
              o = this,
              fn = function fn(v) {
            obj.set(varName, v);
            // obj[varName](v);
          },
              bSendingEvent = false,
              me = this;

          var isNumber = false;
          var oo = obj;

          var valueInListener = this.uniqueListener("bind:valueIn", function (obj, newVal) {

            if (bSendingEvent) return;

            if (me.isFunction(withFunction)) {
              withFunction.apply(me, [newVal, me, obj]);
              val = newVal;
              return;
            }

            if (o._type == "checkbox") {
              if (typeof newVal == "string") {
                newVal = newVal == "true";
              }
              o.checked(newVal);
            } else {
              o.bindVal(newVal);
            }
            val = newVal;
          });
          var valueOutListener = this.uniqueListener("bind:valueOut", function (obj, v) {

            //console.trace();
            bSendingEvent = true;
            if (o._type == "checkbox") {
              fn(o.checked());
            } else {
              fn(isNumber ? parseFloat(o.val()) : o.val());
            }
            bSendingEvent = false;
          });

          var invalidInputListener = this.uniqueListener("bind:invalidIn", function (obj, msg) {
            o.trigger("invalid", msg);
          });
          var validInputListener = this.uniqueListener("bind:validIn", function (obj, newVal) {
            o.trigger("valid", newVal);
          });
          if (o._type == "checkbox") {
            obj.on(varName, valueInListener);
            this.on("value", valueOutListener);
          } else {
            obj.on(varName, valueInListener);
            this.on("value", valueOutListener);
          }

          if (me.isFunction(withFunction)) {
            withFunction.apply(me, [val, me, obj]);
          } else {
            if (o._type == "checkbox") {
              o.checked(val);
            } else {
              o.bindVal(val);
            }
          }

          // and exit...
          return this;
        }

        // var _ee_ = this.__singleton();
        // _ee_.bind(obj, varName, this);
        var o = this;
        this.on("value", function () {
          if (obj) {

            if (o._type == "checkbox") {

              if (o.checked()) {
                obj.set(varName, true);
              } else {
                obj.set(varName, false);
              }
            } else {
              obj.set(varName, o.val());
            }
          }
        });

        if (obj) {
          if (o._type == "checkbox") {

            if (obj[varName]) {
              o.checked(true);
            } else {
              o.checked(false);
            }
          } else {

            if (obj[varName]) {
              o.val(obj[varName]);
            }
          }
        }
        return o;
      };

      /**
       * @param float v
       */
      _myTrait_.bindVal = function (v) {

        if (typeof this._dom.value != "undefined" || this._type == "option") {
          this._dom.value = v;
        } else {

          this._dom.style.whiteSpace = "pre-wrap";
          this._dom.textContent = v;
        }
        this._value = v;
        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.blur = function (t) {
        if (this._contentObj) {
          return this._contentObj.blur.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }
        if (this._dom.blur) this._dom.blur();
      };

      /**
       * @param bool v
       */
      _myTrait_.checked = function (v) {
        if (this._contentObj) {
          return this._contentObj.checked.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        if (typeof v == "undefined") {
          this._checked = this._dom.checked;
          return this._checked;
        }

        var nowOn = this._dom.checked;
        this._dom.checked = v;

        if (nowOn && !v || !nowOn && v) {
          this.trigger("value", nowOn);
        }

        return this;
      };

      /**
       * Focus into this element
       * @param float t
       */
      _myTrait_.focus = function (t) {
        if (this._contentObj) {
          return this._contentObj.focus();
        }
        if (this._dom.focus) this._dom.focus();
      };

      /**
       * @param float transformFn
       */
      _myTrait_.toBacon = function (transformFn) {
        if (this._contentObj) {
          return this._contentObj.toBacon.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }
        var me = this;
        later().asap(function () {
          if (typeof me.val() != "undefined") {
            me.trigger("value");
          }
        });

        return Bacon.fromBinder(function (sink) {
          me.on("value", function (o, v) {
            if (transformFn) {
              sink(transformFn(me.val()));
            } else {
              sink(me.val());
            }
          });
          return function () {};
        });
      };

      /**
       * Sets or gets the input value
       * @param object v
       */
      _myTrait_.val = function (v) {
        if (this._contentObj) {
          return this._contentObj.val.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }
        if (typeof v == "undefined") {
          if (this._type == "select" || this._type == "input" || this._type == "textarea") {
            this._value = this._dom.value;
          }
          return this._value;
        }

        if (typeof this._dom.value != "undefined" || this._type == "option") {
          this._dom.value = v;
        }

        this._value = v;
        this.trigger("value", v);
        return this;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _shInit;
      var _elemInit;

      // Initialize static variables here...

      /**
       * Creates a custom tag function, if possible, to the prototype of the class
       * @param String name  - Name of the custom tag
       */
      _myTrait_._addCustomTagFn = function (name) {
        this.extendAll(name, function () {
          var argList = Array.prototype.slice.call(arguments);
          argList.unshift(name);
          return this.e.apply(this, argList);
        });
      };

      /**
       * Some of the methods have shortcuts
       * @param float t
       */
      _myTrait_._initShortcuts = function (t) {
        // _elemNames
        if (_elemInit) return;
        _elemInit = true;

        var es = ["a", "b", "h1", "h2", "h3", "h4", "h5", "h6", "button", "checkbox", "td", "tr", "div", "form", "img", "input", "label", "li", "ol", "p", "pre", "span", "strong", "table", "textarea", "ul", "video", "tspan", "svg", "rect", "path", "line", "image", "g", "filter", "feOffset", "feMergeNode", "feMerge", "feGaussianBlur", "defs", "circle"];

        es.forEach(function (n) {
          _myTrait_[n] = function (className, attrs, c, d, e) {
            return this.shortcutFor(n, className, attrs, c, d, e);
          };
        });
      };

      /**
       * @param object v
       * @param float v2
       */
      _myTrait_.attr = function (v, v2) {

        if (this.isObject(v)) {
          for (var n in v) {
            if (v.hasOwnProperty(n)) {
              this.attr(n, v[n]);
            }
          }
        } else {
          var elem = this;

          if (v == "ref") {

            var pComp = elem._findComp();
            if (pComp) {
              if (pComp._instanceVars) {
                var initData = pComp._instanceVars;
                if (!initData.refs) initData.refs = {};
                initData.refs[v2] = elem;
              }
            }
          }

          if (elem._compBaseData) {

            if (this.isArray(v2)) {
              var varObj = v2[0];
              var varName = v2[1];

              varObj.on(varName, function () {
                later().add(function () {
                  elem._compBaseData.set(v, varObj.get(varName));
                });
              });
              elem._compBaseData.set(v, varObj.get(varName));
              // --> two way
              elem._compBaseData.on(v, function () {
                varObj.set(varName, elem._compBaseData.get(v));
              });
            } else {
              elem._compBaseData.set(v, v2);
            }
          } else {
            if (this._tag == "canvas") {
              if (v == "width") {
                this._canWidth = parseInt(v2);
              }
              if (v == "height") this._canHeight = parseInt(v2);
            }
            this.q.attr(v, v2);
          }
        }
        return this;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.canvas = function (className, attrs) {
        var el = this.shortcutFor("canvas", className, attrs);
        el._canvas = true;
        return el;
      };

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.checkbox = function (className, attrs) {
        var el = this.shortcutFor("checkbox", className, attrs);
        return el;
      };

      /**
       * @param float t
       */
      _myTrait_.clearCanvas = function (t) {
        var ctx = this.ctx(),
            canvas = this._dom;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.ctx = function (t) {
        if (this._dom.getContext) {
          return this._dom.getContext("2d");
        }
      };

      /**
       * @param float elemName
       * @param string className
       * @param float attrs
       */
      _myTrait_.e = function (elemName, className, attrs) {

        var argList = Array.prototype.slice.call(arguments);

        if (this._contentObj) {
          return this._contentObj.e.apply(this._contentObj, argList);
        }
        /*
        res.elemName
        res.classStr
        res.data
        res.stream
        res.attrs
        res.constr
        */
        var res = this._constrArgs(argList);

        if (!this._isStdElem(res.elemName)) {

          var customElem = this._findCustomElem(res.elemName);
          if (customElem) {

            if (customElem.init || customElem.render) {

              // create the element HTML tag
              var elem = _e(customElem.customTag, res.attrs, res.constr, res.data);
              this.add(elem);
              return elem;
            }
          }
        }
        var el = this.shortcutFor.apply(this, argList); // (elemName, className, attrs);
        return el;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {
        if (!_elemInit) this._initShortcuts();
      });

      /**
       * @param float params
       */
      _myTrait_.row = function (params) {
        var args = Array.prototype.slice.call(arguments);
        if (this._tag == "table") {
          this.addRow(args);
          return this;
        }

        var tbl = this.table();
        tbl.addRow(args);
        return tbl;
      };

      /**
       * @param String name
       * @param float className
       * @param float attrs
       */
      _myTrait_.shortcutFor = function (name, className, attrs) {
        if (this._contentObj) {
          return this._contentObj.shortcutFor.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        var el = _e(name);
        this.add(el);

        var argData = this._constrArgs(Array.prototype.slice.call(arguments));

        if (argData.classStr) el.addClass(argData.classStr);
        if (argData.stream) el.addClass(argData.stream);

        if (argData.attrs) {
          var myAttrs = argData.attrs;
          for (var n in myAttrs) {
            if (myAttrs.hasOwnProperty(n)) {
              if (name == "input" && (n == "type" && myAttrs[n] == "checkbox")) {
                el._type = "checkbox";
              }
              el.attr(n, myAttrs[n]);
            }
          }
        }

        if (argData.constr) {
          argData.constr.apply(el, [el]);
        }

        return el;
      };

      /**
       * @param String src
       */
      _myTrait_.src = function (src) {
        if (this._tag == "img") {
          if (!this._hasLoadL) {
            var me = this;
            me._imgLoaded = false;
            this.__singleton().addEventListener(this._dom, "load", function () {
              me.trigger("load");
              me._imgLoaded = true;
            });
            this._hasLoadL = true;
          }
        }

        if (this._tag == "canvas") {
          var img = _e("img"),
              me = this;
          me._imgLoaded = false;
          img.src(src);
          img.on("load", function () {
            var im = img._dom;
            if (!me._canWidth) {
              me.q.attr("width", im.width);
              me.q.attr("height", im.height);
              me._canWidth = im.width;
              me._canHeight = im.height;
            }

            var ctx = me._dom.getContext("2d");
            ctx.drawImage(im, 0, 0, im.width, im.height, 0, 0, me._canWidth, me._canHeight);
            me.trigger("load");
            me._imgLoaded = true;
          });
          return this;
        }
        this.q.attr("src", src);

        return this;
      };

      /**
       * @param float format
       * @param float quality
       */
      _myTrait_.toDataURL = function (format, quality) {

        if (!quality) quality = 1;

        return this._dom.toDataURL(format || "image/png", quality);
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float elem
       * @param float text
       */
      _myTrait_._setDomText = function (elem, text) {
        if (typeof elem.textContent != "undefined") {
          elem.textContent = text;
        }
      };

      /**
       * @param string h
       */
      _myTrait_.html = function (h) {
        if (this._contentObj) {
          return this._contentObj.html.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        if (typeof h == "undefined") return this._dom.innerHTML;
        this._dom.innerHTML = h;
        return this;
      };

      /**
       * @param string t
       */
      _myTrait_.text = function (t) {
        if (this._contentObj) {
          return this._contentObj.text.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        if (typeof t == "undefined") return this._html;

        var args = new Array(arguments.length);
        var ii = 0;
        while (ii < arguments.length) args[ii] = arguments[ii++];

        if (args.length > 1) {

          var bHadNonS = false,
              me = this;
          args.forEach(function (o) {
            if (me.isObject(o) && !me.isStream(o)) bHadNonS = true;
          });

          if (bHadNonS) {
            this.clear();
            this.add(args);
            return this;
          }
          t = this.str(args);
        }

        if (this.isObject(t)) {
          if (t.onValue) {
            var me = this;
            // TODO: check if we are re-binding two streams on the same element, possible error
            t.onValue(function (t) {
              if (me._svgElem || typeof me._dom.textContent != "undefined") {
                me._dom.textContent = t;
              }
              me._html = t;
            });
            return this;
          }
        }

        if (this._svgElem || typeof this._dom.textContent != "undefined") {
          this._dom.textContent = t;
        }

        this._html = t;
        return this;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var lastView;
      var bInited;
      var _settingView;
      var _eventState;
      var _windowSize;
      var _mediaListeners;
      var mql;
      var _transitionOn;
      var _dynamicFactory;

      // Initialize static variables here...

      /**
       * @param float options
       */
      _myTrait_.fiddle = function (options) {
        if (this._contentObj) {
          return this._contentObj.fiddle.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }
        var iframe = _e("iframe");
        var myId = this.guid();

        var html = decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chead%3E");

        if (options.scripts) options.scripts.forEach(function (s) {
          html += decodeURIComponent("%3Cscript%20src%3D'") + s + decodeURIComponent("'%3E%3C%2Fscript%3E");
        });
        if (options.stylesheets) options.stylesheets.forEach(function (s) {
          html += "<link rel=\"stylesheet\" href=\"" + s + "\"></link>";
        });
        if (options.head) html += options.head;
        html += "</head><body>";

        if (!options.callBackName) options.callBackName = "fiddleDone";

        if (options.onReady && options.callBackName) {
          var ls = window["localStorage"];
          var waitFor = function waitFor() {
            var res;
            if (res = ls.getItem(myId)) {
              later().removeFrameFn(waitFor);
              options.onReady(JSON.parse(res));
            }
          };
          later().onFrame(waitFor);
          html += decodeURIComponent("%3Cscript%3E") + "function " + options.callBackName + "(v){window['localStorage'].setItem('" + myId + "', JSON.stringify(v));}";
          html += decodeURIComponent("%3C%2Fscript%3E");
        }

        if (options.html) html += options.html;
        if (options.jsCode) html += decodeURIComponent("%3Cscript%3E") + options.jsCode + decodeURIComponent("%3C%2Fscript%3E");
        html += "</body></html>";
        this.addItem(iframe);
        var contWinDoc = iframe._dom.contentWindow.document;
        contWinDoc.open();
        contWinDoc.write(html);
        contWinDoc.close();

        iframe.width(options.width || 800).height(options.height || 600);

        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.initScreenEvents = function (t) {
        // object.addEventListener("resize", myScript);
        // if(window.matchMedia) {
        _windowSize = {
          w: 0,
          h: 0
        };

        var _widthLimits = [700];

        var eventCnt = 0;

        _mediaListeners = [];
        if (window.matchMedia) {
          mql = window.matchMedia("(max-width:700px)");
          mql.addListener(function (q) {
            eventCnt++;
            if (q.matches) {
              _mediaListeners.forEach(function (fn) {
                fn({
                  w: window.innerWidth || document.documentElement.clientWidth,
                  h: window.innerHeight || document.documentElement.clientHeight,
                  limit: 700,
                  width_less: true,
                  eCnt: eventCnt
                });
              });
            } else {
              _mediaListeners.forEach(function (fn) {
                fn({
                  w: window.innerWidth || document.documentElement.clientWidth,
                  h: window.innerHeight || document.documentElement.clientHeight,
                  limit: 700,
                  width_more: true,
                  eCnt: eventCnt
                });
              });
            }
          });
        } else {
          // console.log("Bind resize");
          // eventBinder(dom, event, fun

          var isIE8 = !document.addEventListener ? true : false,
              bindTo = window;

          // if(isIE8) bindTo = document.body;

          this.eventBinder(bindTo, "resize", function () {
            // what is the screen size...

            eventCnt++;

            var width = window.innerWidth || document.documentElement.clientWidth,
                doAlert = false,
                limit = 700;

            _widthLimits.forEach(function (w) {
              var ch = (w - width) * (w - _windowSize.w);
              if (ch < 0) {
                limit = w;
                doAlert = true;
              }
            });

            _windowSize.w = window.innerWidth || document.documentElement.clientWidth;
            _windowSize.h = window.innerHeight || document.documentElement.clientHeight;

            if (doAlert) {
              _mediaListeners.forEach(function (fn) {
                var data = {
                  limit: limit,
                  w: _windowSize.w,
                  h: _windowSize.h,
                  eCnt: eventCnt
                };
                if (_windowSize.w > limit) {
                  data.width_more = true;
                } else {
                  data.width_less = true;
                }
                fn(data);
              });
            }
          });
          /*
          object.addEventListener("resize", function() {
          // _windowSize
          });
          */
        }
      };

      /**
       * @param function fn
       */
      _myTrait_.onMediaChange = function (fn) {

        _mediaListeners.push(fn);
      };

      /**
       * @param Object toView
       */
      _myTrait_.popView = function (toView) {

        if (this._contentObj) {
          return this._contentObj.popView.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        if (!this._views || this._views.length == 0) {
          var p = this.parent(true);
          if (p) {
            p.popView();
            return this;
          }
          this._views = [];
          return this;
        }

        var ms = new Date().getTime();
        if (_transitionOn && ms - _transitionOn < 1000) return;
        _transitionOn = ms;

        var cont = this;
        var lastView = this;
        var view = this._views.pop();

        var showP = true;
        var me = this;

        if (!this._poppedViews) this._poppedViews = _e();

        cont.forChildren(function (ch) {

          ch.removeClass("viewOut");
          ch.removeClass("viewIn");
          ch.addClass("viewOut");

          if (showP) {
            later().after(0.2, function () {
              // console.log("Old view child count ", view.oldChildren._children.length);
              var addThese = [];
              view.oldChildren.forChildren(function (ch) {
                ch.show();
                addThese.push(ch);
              });
              addThese.forEach(function (c) {
                cont.add(c);
                c.removeClass("viewOut");
                c.removeClass("viewIn");
                c.addClass("viewIn");
              });

              if (view.oldTitle && me.setTitle) me.setTitle(view.oldTitle);
              showP = false;
              later().after(0.2, function () {
                _transitionOn = 0;
                if (addThese[0]) addThese[0].scrollTo(view._y, view._x);
              });
            });
          }
          later().after(0.2, function () {
            // ch.remove();
            me._poppedViews.add(ch);
          });
        });
      };

      /**
       * @param String name  - Name of the layout element, for example &quot;top&quot;, &quot;content&quot; or &quot;bottom&quot;
       * @param String factoryName  - Name of the view factory created with viewFactory
       * @param String paramName  - Parameter name for the view
       */
      _myTrait_.pushTo = function (name, factoryName, paramName) {

        if (this.isObject(paramName)) {
          var mm = paramName;
          if (paramName.model) {
            mm = paramName.model;
          }
          if (mm.getID) paramName = mm.getID();
        }

        if (!this._activeLayout) {
          var p = this.parent();
          if (p) {
            p.pushTo(name, factoryName, paramName);
          }
          return this;
        } else {

          var currentRole = this.getRole();
          if (!currentRole) currentRole = "default";

          var view = this.findViewByName(name, this._activeLayout.view);

          if (!view) {
            return;
          }

          if (!_viewCache) _viewCache = {};

          var obj, wf;
          var me = this,
              cache_key;

          if (!paramName) paramName = "";
          if (this.isObject(factoryName)) {
            obj = factoryName;
            cache_key = currentRole + "." + factoryName + "." + paramName;
          } else {

            // returns the function which creates the view
            wf = this.findViewFactory(factoryName, currentRole);
            if (!wf) wf = this.findViewFactory(factoryName, "default");
            // factory function object has the cache
            if (wf && !wf._viewCache) wf._viewCache = {};

            // views with same params will be cached
            cache_key = currentRole + "." + factoryName + "." + paramName;

            if (wf) {
              if (wf._viewCache[cache_key]) {
                obj = wf._viewCache[cache_key];
              } else {
                var f = wf;
                if (f) {
                  obj = f(paramName);
                  if (obj) {
                    wf._viewCache[cache_key] = obj;
                  }
                }
              }
            }
          }

          if (obj) {

            if (!this._activeLayout.parts) this._activeLayout.parts = {};
            this._activeLayout.parts[name] = view;

            // view = the div or element the object created by the factory is pushed into
            // for example "top" in layout top 100% | content 100%
            view.pushView(obj);

            // to emulate React.js behaviour...
            if (obj.componentDidMount) {
              obj.componentDidMount();
            }
            obj.trigger("mount");

            // in case the view should be refreshed with some other
            obj._refeshView = {
              name: name,
              factoryName: factoryName,
              paramName: paramName,
              view: view,
              activeLayout: this._activeLayout
            };

            if (wf && wf._dynamic && !wf._binded) {
              wf._binded = true;
              wf._dynamic.on("body", function (o, v) {
                try {
                  var newF = new Function(v);
                  var newObj = newF(paramName);
                  if (newObj) {
                    obj.replaceWith(newObj);
                    obj = newObj;

                    wf._container._viewFactory[factoryName] = newF;
                    if (newF && !newF._viewCache) newF._viewCache = {};
                    newF._viewCache[cache_key] = newObj;
                  }
                } catch (e) {}
              });
            }
          }
        }
      };

      /**
       * @param float newView
       * @param float params
       * @param float oldViewHolder
       */
      _myTrait_.pushView = function (newView, params, oldViewHolder) {

        if (this._contentObj) {
          return this._contentObj.pushView.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        if (!this._views) {
          this._views = [];
        }

        if (!_eventState) _eventState = {};
        if (newView == this) return;
        if (newView == lastView) return;

        var cont = this;
        if (cont._children && cont._children[0] == newView) {
          // console.error("... pushing view failed because this view had already the child view???.... ", newView);
          return;
        }

        if (this.isFunction(newView)) {
          newView = newView();
        }

        var ms = new Date().getTime();
        if (this._transitionOn && ms - this._transitionOn < 1000) return;
        this._transitionOn = ms;

        if (!params) params = null;

        var oldChildren = oldViewHolder || _e();

        var viewData = {
          parentView: null,
          oldTitle: this.__currentTitle,
          oldChildren: oldChildren,
          params: params
        };
        if (window) {
          viewData._x = window.pageXOffset;
          viewData._y = window.pageYOffset;
        }

        var showP = true,
            hadChildren = false,
            me = this;

        /* 
        this.onValue("pushView", function(v) {
        me.pushView(v);
        });   
        this.onValue("popView", function(toView) {
        me.popView(toView);
        });
        */

        lastView = this;

        // console.log("PUSH, view child count ", cont._children.length);
        cont.forChildren(function (ch) {

          hadChildren = true;
          // fadeout, fadein, not used here...
          later().after(0.3, function () {

            newView.removeClass("viewOut");
            newView.removeClass("viewIn");

            newView.addClass("viewIn");
            cont.add(newView);

            newView.show();
            showP = false;

            later().after(0.2, function () {

              me._transitionOn = 0;
              newView.scrollTo();
            });
          });
          ch.removeClass("viewIn");
          ch.removeClass("viewOut");
          ch.addClass("viewOut");
          later().after(0.2, function () {
            oldChildren.add(ch);
          });
        });
        this._views.push(viewData);
        if (!hadChildren) {

          later().after(0.3, function () {
            newView.removeClass("viewIn");
            newView.removeClass("viewOut");
            newView.addClass("viewIn");
            cont.add(newView);

            newView.show();

            later().after(0.2, function () {
              me._transitionOn = 0;
              newView.scrollTo();
            });
          });
        }

        _eventState.pushing = false;

        return this;
      };

      /**
       * Make the window scroll to this element
       * @param int yPosition  - Given y scroll position
       * @param int xPosition  - Given x position
       */
      _myTrait_.scrollTo = function (yPosition, xPosition) {
        if (window) {
          var currLeft = xPosition || window.pageXOffset;
          var currTop = window.pageYOffset;
          var pageHeight = window.innerHeight;
          if (yPosition) {
            var toY = yPosition;
            var dy = parseInt(toY) - currTop;
            if (Math.abs(dy) < 200) {
              if (currTop + pageHeight - 200 > toY && toY > currTop) {
                return;
              }
            }
            later().ease("pow", 600, function (t) {
              window.scrollTo(currLeft || 0, parseInt(currTop + dy * t));
            });
            // window.scrollTo( currLeft, parseInt(yPosition));
            return this;
          }

          var box = this.offset();

          var toY = box.top - pageHeight * 0.3;
          if (toY < 0) toY = 0;

          var dy = parseInt(toY) - currTop;

          if (Math.abs(dy) < 200) {
            if (currTop + pageHeight - 200 > toY && toY > currTop) {
              return;
            }
          }

          later().ease("pow", 600, function (t) {
            window.scrollTo(currLeft || 0, parseInt(currTop + dy * t));
          });
        }
        return this;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _viewContent;
      var _viewTemplates;
      var _namedViews;
      var _dataLink;
      var _customDirectives;

      // Initialize static variables here...

      /**
       * @param String url
       */
      _myTrait_._findSendHandler = function (url) {

        if (this._sendHook) {
          var h = this._sendHook[url];
          if (h) return h;
          var h = this._sendHook["*"]; // catch all if "*" is used.
          if (h) return h;
        }
        // don't use the .parent() because it will skip the component
        var p = this._parent;
        if (p) {
          var had = p._findSendHandler(url);
          if (had) return had;
        }

        var cp = this._contentParent;
        if (cp) {
          var had = cp._findSendHandler(url);
          return had;
        }
      };

      /**
       * @param String eventName
       * @param Object eventParams
       */
      _myTrait_.clickTo = function (eventName, eventParams) {

        var id = eventParams;
        if (this.isObject(id)) {
          if (id.getID) id = id.getID();
        }
        this.on("click", function () {
          this.send(eventName, id);
        });
        return this;
      };

      /**
       * @param Object item
       */
      _myTrait_.createItemView = function (item) {
        var vf = this.getViewFunction(item),
            me = this,
            newView;
        if (vf) {
          newView = vf(item);
        }
        return newView;
      };

      /**
       * @param float v
       */
      _myTrait_.data = function (v) {
        if (typeof v != "undefined") {
          this.__mdata = v;
          return this;
        }
        return this.__mdata;
      };

      /**
       * for example   window.forwardData( winDefData, &quot;x,y, w =&gt; width, h =&gt; height, title=&gt;text&quot;);
       * @param float dataObj
       * @param float variables
       * @param float filterFn
       */
      _myTrait_.forwardData = function (dataObj, variables, filterFn) {
        var list = variables.split(",");
        var me = this;
        list.forEach(function (vName) {
          vName = vName.trim();
          var targetFn = vName;
          var parts = vName.split("=>");
          if (parts.length > 1) {
            vName = parts[0].trim();
            targetFn = parts[1].trim();
          }
          dataObj.on(vName, function (o, v) {

            try {
              if (filterFn) {
                v = filterFn.apply(me, [vName, v]);
              }
              if (typeof v != "undefined") {
                if (me[targetFn]) me[targetFn](v);
              }
            } catch (e) {
              console.error(e.message);
            }
          });
          var value = dataObj.get(vName);
          if (filterFn) {
            value = filterFn.apply(me, [vName, value]);
          }
          if (typeof value != "undefined") {
            if (me[targetFn]) me[targetFn](value);
          }
        });
      };

      /**
       * @param float stream
       * @param float viewFn
       */
      _myTrait_.fromStream = function (stream, viewFn) {

        var me = this;

        stream.onValue(function (data) {
          var newView = viewFn(data);
          later().add(function () {
            me.clear();
            me.add(newView);
          });
        });
      };

      /**
       * @param Object item
       */
      _myTrait_.getViewFunction = function (item) {
        if (this.isFunction(this._view)) {
          return this._view;
        }
        if (item.viewClass) {
          var vf;
          if (vf = this._view[item.viewClass()]) return vf;
        }
        // if no other options...
        for (var n in this._view) {
          if (this._view.hasOwnProperty(n)) {
            var vf = this._view[n];
            if (this.isFunction(vf)) {
              return vf;
            }
          }
        }
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {});

      /**
       * @param float t
       */
      _myTrait_.model = function (t) {
        return this.state();
      };

      /**
       * @param Object model
       * @param float view
       * @param float controller
       */
      _myTrait_.mvc = function (model, view, controller) {
        if (this._contentObj) {
          return this._contentObj.mvc.apply(this._contentObj, Array.prototype.slice.call(arguments));
        }

        var me = this;
        if (view) {
          this._view = view;
        }

        if (model) {
          // assume now that it is array
          this._model = model;

          // TODO: sort, delete, move...
          if (this._model.on) {
            this._model.on("insert", function (o, i) {
              var item = me._model.item(i);
              var nv = me.createItemView(item);
              if (nv) {
                me.insertAt(i, nv);
              }
            });

            this._model.on("move", function (o, cmd) {

              var old = me.child(cmd.from),
                  after = me.child(cmd.to);

              if (!after || !old) {
                return;
              }

              if (cmd.to < cmd.from) {
                after.insertBefore(old);
              } else {
                after.insertAfter(old);
              }
            });
            this._model.on("remove", function (o, i) {

              var ch = me.child(i);
              if (ch) {
                ch.remove();
              }
            });
            this._model.on("sort", function (o, ops) {

              if (ops.length == 0) return;

              if (me.isObject(ops[0][1])) return;

              var tmpOps = new Array();

              for (var i = 0; i < ops.length; i++) {
                if (ops[i][1] == ops[i][2]) {
                  ops[i][0] = null;
                  continue;
                }
                tmpOps[i] = new Array(3);
                tmpOps[i][1] = me.child(ops[i][1]);
                tmpOps[i][2] = me.child(ops[i][2]);
              }

              // console.log("Sort with", ops, JSON.stringify(ops));
              for (var i = 0; i < tmpOps.length; i++) {
                var c1 = tmpOps[i][1],
                    c2 = tmpOps[i][2],
                    cmd = ops[i][0];
                if (cmd == "a") {
                  c2.insertBefore(c1);
                }
                if (cmd == "b") {
                  c2.insertAfter(c1);
                }
              }
            });
          }

          if (this._model.forEach) {
            this._model.forEach(function (item) {
              var nv = me.createItemView(item);
              if (nv) {
                me.add(nv);
              }
            });
          }
        }

        if (controller) {
          this._controller = controller;
        }
        return this;
      };

      /**
       * @param float url
       * @param float handlerFunction
       * @param float context
       */
      _myTrait_.onMsg = function (url, handlerFunction, context) {
        if (!this._sendHook) {
          this._sendHook = {};
        }

        if (!this._sendHook[url]) {
          this._sendHook[url] = [];
        }

        if (context) handlerFunction._context = context;

        this._sendHook[url].unshift(handlerFunction);
      };

      /**
      * You can create a send handler using
      ```
      obj.sendHandler(url, function(data, result, fail) { });
      ```
      To send into this url use
      ```
      obj.send(url, data, function(result) {
        });
      ```
      * @param string url  - URL or controller name to send the data to 
      * @param Object data  
      * @param function callBack  
      * @param function errorCallback  
      */
      _myTrait_.send = function (url, data, callBack, errorCallback) {

        var me = this;
        later().add(function () {
          var list = me._findSendHandler(url);
          if (list) {
            for (var i = 0; i < list.length; i++) {
              var fn = list[i];
              var res = fn.apply(fn._context || me, [data, callBack, errorCallback, url]);
              if (res === true) {
                return;
              }
            }
          } else {
            if (errorCallback) {
              errorCallback("Controller or send handler for " + url + " was not found");
            } else {
              console.error("controller for message " + url + " was not found");
            }
          }
        });
      };

      /**
       * @param String url
       * @param function handlerFunction
       * @param float context  - value of &quot;this&quot; when the handler is going to be called
       */
      _myTrait_.sendHandler = function (url, handlerFunction, context) {
        return this.onMsg(url, handlerFunction, context);
      };

      /**
       * @param float url
       * @param float data
       * @param float callBack
       * @param float errorCallback
       */
      _myTrait_.sendMsg = function (url, data, callBack, errorCallback) {
        return this.send(url, data, callBack, errorCallback);
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float className
       * @param float attrs
       */
      _myTrait_.svg_text = function (className, attrs) {
        var el = this.shortcutFor("text", className, attrs);
        return el;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.guid = function (t) {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      };

      /**
       * @param float someVar
       */
      _myTrait_.isArray = function (someVar) {
        return Object.prototype.toString.call(someVar) === "[object Array]";
      };

      /**
       * @param Function fn
       */
      _myTrait_.isFunction = function (fn) {
        return Object.prototype.toString.call(fn) == "[object Function]";
      };

      /**
       * @param Object obj
       */
      _myTrait_.isObject = function (obj) {
        return obj === Object(obj);
      };

      /**
       * @param float obj
       */
      _myTrait_.isStream = function (obj) {

        if (this.isObject(obj)) {
          if (obj.onValue && obj.bufferWithTime) return true;
        }
        /*
        if(typeof(RxJS) !="undefined") {
        if(obj instanceof RxJS) return true;
        }
        if(typeof(Bacon) !="undefined") {
        if(obj instanceof Bacon) return true;
        }
        */

        return false;
      };

      /**
       * @param float params
       */
      _myTrait_.str = function (params) {

        var args;
        if (this.isArray(params)) {
          args = params;
        } else {
          args = Array.prototype.slice.call(arguments);
        }

        // Supports Bacon.js streams at the moment...
        var bHadStream = false,
            me = this;
        var indexes = [],
            streams = [],
            all = [];
        args.forEach(function (item, i) {
          if (me.isStream(item)) {
            bHadStream = true;
            all.push("");
          } else {
            all.push(item);
          }
        });
        if (!bHadStream) return args.join("");

        return Bacon.fromBinder(function (sink) {

          args.forEach(function (item, i) {
            if (me.isStream(item)) {
              item.onValue(function (v) {
                all[i] = v;
                sink(all.join(""));
              });
            }
          });

          later().add(function () {
            sink(all.join(""));
          });

          return function () {};
        });
      };

      /**
       * @param float imgList
       * @param float fn
       */
      _myTrait_.whenLoaded = function (imgList, fn) {

        var cnt = imgList.length;

        imgList.forEach(function (im) {
          im.on("load", function () {
            cnt--;
            if (cnt == 0) {
              fn(imgList);
            }
          });
        });

        if (imgList.length == 0) fn([]);
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var colors;

      // Initialize static variables here...

      /**
       * @param float c1
       * @param float c2
       * @param float t
       */
      _myTrait_.colorMix = function (c1, c2, t) {

        var from = this.toRGB(c1),
            to = this.toRGB(c2);

        var res = this.yuvConversion2(from, to, function (y1, y2) {
          return {
            y: (1 - t) * y1.y + t * y2.y,
            u: (1 - t) * y1.u + t * y2.u,
            v: (1 - t) * y1.v + t * y2.v
          };
        });

        return res;
      };

      /**
       * @param String color
       */
      _myTrait_.colorToHex = function (color) {
        if (color.substr(0, 1) === "#") {
          return color;
        }
        var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

        var red = parseInt(digits[2]);
        var green = parseInt(digits[3]);
        var blue = parseInt(digits[4]);

        var rgb = blue | green << 8 | red << 16;
        return digits[1] + "#" + rgb.toString(16);
      };

      /**
       * @param String colour
       */
      _myTrait_.colourNameToHex = function (colour) {

        if (typeof colors[colour.toLowerCase()] != "undefined") return colors[colour.toLowerCase()];

        return false;
      };

      /**
       * @param float c
       */
      _myTrait_.componentToHex = function (c) {
        c = parseInt(c);
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      };

      /**
       * @param float colorName
       * @param float brightness
       */
      _myTrait_.dim = function (colorName, brightness) {
        return this.yuvConversion(colorName, function (yuv) {
          yuv.y = yuv.y - brightness;
          return yuv;
        });
      };

      /**
       * @param String hex
       */
      _myTrait_.hexToRgb = function (hex) {
        if (hex[0] == "#") hex = hex.substr(1);
        if (hex.length == 3) {
          var temp = hex;
          hex = "";
          temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
          for (var i = 0; i < 3; i++) hex += temp[i] + temp[i];
        }
        if (!hex) return null;
        if (hex == null) return;
        var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);

        return {
          r: parseInt(triplets[0], 16),
          g: parseInt(triplets[1], 16),
          b: parseInt(triplets[2], 16)
        };
      };

      /**
       * @param String hexVal
       */
      _myTrait_.hexToYuv = function (hexVal) {
        var me = this;
        return me.rgbToYuv(me.toRGB(hexVal));
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {

        if (!colors) {
          colors = {
            "none": "#ffffff",
            "black": "#000000",
            "blue": "#0000ff",
            "brown": "#a52a2a",
            "cornflowerblue": "#6495ed",
            "cyan": "#00ffff",
            "darkblue": "#00008b",
            "darkcyan": "#008b8b",
            "gray": "#808080",
            "green": "#008000",
            "magenta": "#ff00ff",
            "orange": "#ffa500",
            "pink": "#ffc0cb",
            "purple": "#800080",
            "red": "#ff0000",
            "turquoise": "#40e0d0",
            "violet": "#ee82ee",
            "white": "#ffffff",
            "skyblue": "#87ceeb",
            "yellow": "#ffff00"
          };
        }
      });

      /**
       * @param float c1
       * @param float c2
       * @param float amount
       */
      _myTrait_.mix = function (c1, c2, amount) {

        if (typeof amount == "undefined") amount = 0.5;

        return this.yuvConversion2(c1, c2, function (y1, y2) {
          return {
            y: (1 - amount) * y1.y + amount * y2.y,
            u: (1 - amount) * y1.u + amount * y2.u,
            v: (1 - amount) * y1.v + amount * y2.v
          };
        });
      };

      /**
       * @param Object p
       */
      _myTrait_.rgbToHex = function (p) {
        var me = this;
        return "#" + me.componentToHex(p.r) + me.componentToHex(p.g) + me.componentToHex(p.b);
      };

      /**
       * @param Object c
       */
      _myTrait_.rgbToYuv = function (c) {
        var R = c.r / 255;
        var G = c.g / 255;
        var B = c.b / 255;
        return {
          y: 0.299 * R + 0.587 * G + 0.114 * B,
          u: -0.14713 * R - 0.28885 * G + 0.436 * B,
          v: 0.615 * R - 0.51499 * G - 0.10001 * B
        };
      };

      /**
       * @param Object c
       */
      _myTrait_.toRGB = function (c) {
        if (typeof c == "object") return c;
        var me = this;

        var hex = me.colourNameToHex(c);
        if (!hex) {
          hex = me.colorToHex(c);
        }
        return me.hexToRgb(hex);
      };

      /**
       * @param float v
       */
      _myTrait_.toRSpace = function (v) {
        return Math.max(0, Math.min(255, Math.round(v)));
      };

      /**
       * @param color c
       * @param float fn
       */
      _myTrait_.yuvConversion = function (c, fn) {
        var me = this;
        var yuv = me.rgbToYuv(me.toRGB(c));
        yuv = fn(yuv);
        var rgb = me.yuvToRgb(yuv);
        return me.rgbToHex(rgb);
      };

      /**
       * @param string c1
       * @param float c2
       * @param float fn
       */
      _myTrait_.yuvConversion2 = function (c1, c2, fn) {
        var me = this;
        var yuv = me.rgbToYuv(me.toRGB(c1));
        var yuv2 = me.rgbToYuv(me.toRGB(c2));
        yuv = fn(yuv, yuv2);
        var rgb = me.yuvToRgb(yuv);
        return me.rgbToHex(rgb);
      };

      /**
       * @param Object c
       * @param function fn
       */
      _myTrait_.yuvPixelConversion = function (c, fn) {
        var yuv = me.rgbToYuv(c);
        yuv = fn(yuv);
        var rgb = me.yuvToRgb(yuv);
        c.r = rgb.r;
        c.g = rgb.g;
        c.b = rgb.b;
        return c;
      };

      /**
       * @param Object c
       */
      _myTrait_.yuvToRgb = function (c) {
        var Y = c.y;
        var U = c.u;
        var V = c.v;

        return {
          r: this.toRSpace(255 * (Y + 0 * U + 1.13983 * V)),
          g: this.toRSpace(255 * (Y - 0.39465 * U - 0.5806 * V)),
          b: this.toRSpace(255 * (Y + 2.03211 * U))
        };
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var x;
      var _ajaxHook;
      var _uploadHook;
      var _loadedLibs;

      // Initialize static variables here...

      /**
       * @param String url  - request target url
       * @param function callback  - function to receive HTTP return value
       * @param String method  - POST or GET
       * @param String data  - String data to send
       * @param function errorCallback  - error function
       */
      _myTrait_._httpsend = function (url, callback, method, data, errorCallback) {
        var x = this._initAjax();
        x.open(method, url);
        x.onreadystatechange = function () {
          if (x.readyState == 4) {
            if (x.status == 200) {
              callback(x.responseText);
            } else {
              errorCallback(x);
            }
          }
        };
        if (method == "POST") {
          x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        x.send(data);
        return this;
      };

      /**
       * @param float t
       */
      _myTrait_._initAjax = function (t) {
        if (typeof XMLHttpRequest !== "undefined") {
          return new XMLHttpRequest();
        }
        var versions = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"];

        var xhr;
        for (var i = 0; i < versions.length; i++) {
          try {
            xhr = new ActiveXObject(versions[i]);
            break;
          } catch (e) {}
        }
        return xhr;
      };

      /**
       * @param float options
       */
      _myTrait_._traditionalUpload = function (options) {

        var o = _e();
        var form = o.form("", {
          "action": options.url,
          "enctype": "multipart/form-data",
          "method": "POST",
          "name": o.guid()
        });

        var maxCnt = options.maxCnt || 1;
        var chStr = "complete" + this.guid();
        var toBeRemoved = [];

        var onComplete = function onComplete(v) {
          delete window[chStr];
          if (options.progress) {
            var info = {
              loadPros: 100,
              ready: true
            };
            options.progress(info);
          }
          if (options.done) {
            options.done(v);
          }
        };

        window[chStr] = onComplete;
        form.input("", {
          type: "hidden",
          value: chStr,
          name: "onComplete"
        });

        if (options.vars) {
          for (var n in options.vars) {
            if (options.vars.hasOwnProperty(n)) {
              form.input("", {
                type: "hidden",
                value: options.vars[n],
                name: n
              });
            }
          }
        }
        var uplFields = form.div("form-group");

        var maxFileCnt = options.maxFileCnt || 5,
            fileCnt = 0,
            uploadInProgress = false;

        // <input type="file" name="my-file" size="50" maxlength="25" /> <br />

        var fieldNumber = 1;
        var createUploadField = function createUploadField() {
          if (fileCnt >= maxFileCnt) return;
          // <label for="exampleInputFile">File input</label>
          var inp = uplFields.input("", {
            type: "file",
            name: options.fieldName || "newFile" + fieldNumber++,
            size: 50
          });
          inp.on("value", function () {
            if (options.autoupload) {
              o.uploadFiles();
            } else {
              if (fileCnt < maxCnt) createUploadField();
            }
          });

          fileCnt++;
        };

        createUploadField();
        var iFrame = _e("iframe");
        var frame_id = o.guid();
        iFrame.q.attr("id", frame_id);
        iFrame.q.attr("name", frame_id);
        iFrame.absolute().x(-4000).y(-4000);

        var loadCnt = 0;

        // iFrame._dom.onreadystatechange = MyIframeReadyStateChanged;
        iFrame._dom.addEventListener("load", function () {
          uploadInProgress = false;
          loadCnt++;
          if (loadCnt == 1) return;

          // remove the input
          toBeRemoved.forEach(function (oldInput) {
            oldInput.remove();
          });
          if (options.done) {

            var ifrm = iFrame._dom;
            var doc = ifrm.contentDocument ? ifrm.contentDocument : ifrm.contentWindow.document;
            // var form = doc.getElementById('demoForm');       
            if (options.progress) {
              var info = {
                loadPros: 100,
                ready: true
              };
              options.progress(info);
            }
            if (options.done) {
              var ihtml = doc.body.innerHTML;
              if (ihtml) options.done(ihtml);
            }
          }
        });
        o.add(iFrame);

        o.uploadFiles = function (vars) {

          if (uploadInProgress) return;
          uploadInProgress = true;

          var hook = _uploadHook && _uploadHook[options.url];
          if (hook) {

            var sendData = {
              traditional: true,
              postData: {},
              files: []
            };
            if (options.vars) {
              if (options.vars) {
                for (var n in options.vars) {
                  if (options.vars.hasOwnProperty(n)) {
                    sendData.postData[n] = options.vars[n];
                  }
                }
              }
            }
            uplFields.forEach(function (input) {
              toBeRemoved.push(input);
              if (!input._dom.files) return;
              var len = input._dom.files.length;
              for (var fi = 0; fi < len; fi++) {
                var file = input._dom.files[fi];
                if (file) {
                  sendData.files.push(file);
                }
              }
            });

            try {
              var progress = 0;
              var sendI = setInterval(function () {
                progress += Math.random() * (options.uploadSpeed || 10);
                if (progress > 100) progress = 100;

                if (progress == 100) {
                  var res = hook(sendData);
                  if (options.done) {
                    options.done(res);
                  }
                  clearInterval(sendI);
                }
                if (options.progress) options.progress({
                  loadPros: parseInt(progress),
                  ready: parseInt(progress) == 100
                });
              }, 30);
            } catch (e) {
              if (options.error) {
                options.error(e.message);
              }
            }
            return;
          }

          if (vars) {
            for (var n in vars) {
              if (vars.hasOwnProperty(n)) {
                form.input("", {
                  type: "hidden",
                  value: vars[n],
                  name: n
                });
              }
            }
          }
          form._dom.target = frame_id; //'my_iframe' is the name of the iframe
          form._dom.submit();
        };

        if (options.getUploader) {
          options.getUploader(o.uploadFiles);
        }
        o.on("upload", function (o, v) {
          o.uploadFiles(v || {});
        });
        return o;
      };

      /**
       * @param String url
       * @param function handlerFunction
       */
      _myTrait_.ajaxHook = function (url, handlerFunction) {
        if (!_ajaxHook) {
          _ajaxHook = {};
        }

        if (!_ajaxHook[url]) {
          _ajaxHook[url] = [];
        }

        _ajaxHook[url].unshift(handlerFunction);
      };

      /**
       * @param string elemType
       * @param float url
       */
      _myTrait_.appendToHead = function (elemType, url) {

        if (!url) {
          url = elemType;
          var parts = url.split(".");
          elemType = parts.pop(); // for example file.css -> css
        }
        var p = this.__promiseClass();
        if (p) {
          if (!_loadedLibs) {
            _loadedLibs = {};
          }
          // if loading, return the promise
          if (_loadedLibs[url]) {
            return _loadedLibs[url];
          }
          _loadedLibs[url] = new p(function (accept, fail) {

            var ext;
            if (elemType == "js") {
              ext = document.createElement("script");
              ext.src = url;
            }
            if (elemType == "css") {
              ext = document.createElement("link");
              ext.setAttribute("rel", "stylesheet");
              ext.setAttribute("type", "text/css");
              ext.setAttribute("href", url);
            }
            if (!ext) {
              fail("Unknown element type " + url);
              return;
            }
            ext.onload = function () {
              accept(url);
            };
            ext.onerror = function () {
              fail(url);
            };
            document.head.appendChild(ext);
          });
          return _loadedLibs[url];
        }
      };

      /**
       * @param float options
       */
      _myTrait_.createUploader = function (options) {

        if (options.testTraditional || typeof window.FormData == "undefined") {
          return this._traditionalUpload(options);
        }

        // The file uploader
        var inp = _e("input").addClass("uploader-field");
        inp.q.attr("type", "file");

        // uploader basic settings
        inp._uploadGUID = "uploadField" + this.guid();
        inp.q.attr("id", inp._uploadGUID);
        inp.q.attr("name", inp._uploadGUID);

        if (options.audio) {
          inp.q.attr("capture", "microphone");
          inp.q.attr("accept", "audio/*");
        }
        if (options.video) {
          inp.q.attr("capture", "camcorder");
          inp.q.attr("accept", "video/*");
        }
        if (options.images) {
          inp.q.attr("capture", "camera");
          inp.q.attr("accept", "image/*");
        }

        /*
        <p>Capture Image: <input type="file" accept="image/*" id="capture" capture="camera"> 
        <p>Capture Audio: <input type="file" accept="audio/*" id="capture" capture="microphone"> 
        <p>Capture Video: <input type="file" accept="video/*" id="capture" capture="camcorder"> 
        */

        // upload handler here...
        var upload = function upload(uploadElement) {

          var hook = _uploadHook && _uploadHook[options.url];
          if (hook) {

            var sendData = {
              postData: {},
              files: []
            };
            if (options.vars) {
              if (options.vars) {
                for (var n in options.vars) {
                  if (options.vars.hasOwnProperty(n)) {
                    sendData.postData[n] = options.vars[n];
                  }
                }
              }
            }
            var len = uploadElement.files.length;
            for (var fi = 0; fi < len; fi++) {
              var file = uploadElement.files[fi];
              if (file) {
                sendData.files.push(file);
              }
            }
            try {
              var progress = 0;
              var sendI = setInterval(function () {
                progress += Math.random() * (options.uploadSpeed || 10);
                if (progress > 100) progress = 100;

                if (progress == 100) {
                  var res = hook(sendData);
                  if (options.done) {
                    options.done(res);
                  }
                  clearInterval(sendI);
                }
                if (options.progress) options.progress({
                  loadPros: parseInt(progress),
                  ready: parseInt(progress) == 100
                });
              }, 30);
            } catch (e) {
              if (options.error) {
                options.error(e.message);
              }
            }
            return;
          }

          var len = uploadElement.files.length;
          for (var fi = 0; fi < len; fi++) {
            var file = uploadElement.files[fi];
            if (file) {
              var formData = new window.FormData();
              if (options.vars) {
                if (options.vars) {
                  for (var n in options.vars) {
                    if (options.vars.hasOwnProperty(n)) {
                      formData.append(n, options.vars[n]);
                    }
                  }
                }
              }

              formData.append(options.fieldName || "newFile", file);
              var xhr = new XMLHttpRequest();
              xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) //done
                  {
                    if (xhr.status === 200) {
                      if (options.done) {
                        options.done(xhr.responseText);
                      }
                    } else {
                      if (options.error) {
                        options.error(xhr.responseText, xhr);
                      }
                    }
                  }
              };
              xhr.open("POST", options.url);
              if (options.progress && xhr.upload) {
                xhr.upload.onprogress = function (e) {
                  if (e.lengthComputable) {
                    var done = e.loaded / e.total * 100;
                    var info = {
                      loadPros: done,
                      ready: false
                    };
                    if (e.loaded == e.total) {
                      info.ready = true;
                    }
                    options.progress(info);
                  }
                };
              }
              xhr.send(formData);
            }
          }
        };

        inp._dom.addEventListener("change", function (event) {

          if (options.autoupload) {
            if (event.target.files.length == 1) {
              upload(inp._dom);
            }
          }
          if (options.onSelectFile) {
            var len = inp._dom.files.length;
            for (var fi = 0; fi < len; fi++) {
              var file = inp._dom.files[fi];
              options.onSelectFile(file, file.type);
            }
          }
        });
        inp.on("upload", function () {
          if (inp._dom.files.length >= 1) {
            upload(inp._dom);
          }
        });
        return inp;
      };

      /**
       * @param int width
       * @param float height
       * @param float fileObject
       */
      _myTrait_.fileObjectThumbnail = function (width, height, fileObject) {
        var reader = new FileReader();
        var myImage = _e("img");
        var me = this;

        myImage.width(width);
        myImage.height(height);

        reader.onload = function (event) {
          var img = myImage._dom;
          img.onload = function () {
            me.add(myImage);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(fileObject);
        return myImage;
      };

      /**
       * @param float url
       * @param float data
       * @param float callback
       */
      _myTrait_.get = function (url, data, callback) {
        var query = [];
        if (this.isFunction(data)) {
          callback = data;
          this._httpsend(url, callback, "GET", null);
        } else {
          for (var key in data) {
            query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
          }
          this._httpsend(url + (query.length ? "?" + query.join("&") : ""), callback, "GET", null);
        }
        return this;
      };

      /**
       * @param float url
       * @param float data
       * @param float callback
       */
      _myTrait_.getJSON = function (url, data, callback) {
        var query = [];
        if (this.isFunction(data)) {
          callback = data;
          this._httpsend(url, function (r) {
            callback(JSON.parse(r));
          }, "GET", null);
        } else {
          for (var key in data) {
            query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
          }
          this._httpsend(url + (query.length ? "?" + query.join("&") : ""), function (r) {
            callback(JSON.parse(r));
          }, "GET", null);
        }
        return this;
      };

      /**
       * @param String url
       * @param Object data
       * @param function callback
       * @param function errCallback
       */
      _myTrait_.post = function (url, data, callback, errCallback) {

        if (_ajaxHook && _ajaxHook[url]) {
          try {
            for (var i = 0; i < _ajaxHook[url].length; i++) {
              var ff = _ajaxHook[url][i];
              var res = ff(data);
              if (res) {
                callback(res);
                return;
              }
            }
          } catch (e) {
            if (errCallback) errCallback(e);
          }
          return this;
        }

        var query = [];
        for (var key in data) {
          query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }
        this._httpsend(url, callback, "POST", query.join("&"), errCallback);

        return this;
      };

      /**
       * @param String url
       * @param Object data
       * @param function callback
       * @param function errCallback
       */
      _myTrait_.postJSON = function (url, data, callback, errCallback) {

        if (_ajaxHook && _ajaxHook[url]) {
          try {
            for (var i = 0; i < _ajaxHook[url].length; i++) {
              var ff = _ajaxHook[url][i];
              var res = ff(data);
              if (res) {
                callback(res);
                return;
              }
            }
          } catch (e) {
            if (errCallback) errCallback(e);
          }
          return this;
        }
        this._httpsend(url, function (result) {
          try {
            var data = JSON.parse(result);
            if (callback) callback(data);
          } catch (e) {
            if (errCallback) errCallback(e);
          }
        }, "POST", JSON.stringify(data), errCallback);

        return this;
      };

      /**
       * @param String url
       * @param function handlerFunction
       */
      _myTrait_.uploadHook = function (url, handlerFunction) {
        if (!_uploadHook) {
          _uploadHook = {};
        }

        _uploadHook[url] = handlerFunction;
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _customElems;
      var _instances;

      // Initialize static variables here...

      /**
       * Finds the first parent component
       * @param float t
       */
      _myTrait_._findComp = function (t) {
        if (!this._compBaseData) {
          var p = this._parent;
          if (p) return p._findComp();
          return null;
        }
        return this;
      };

      /**
       * @param String name
       */
      _myTrait_._findCustomElem = function (name) {

        if (this._customElems) {
          var e = this._customElems[name];
          if (e) return e;
        }
        var p = this.parent();
        if (p) return p._findCustomElem(name);

        if (_customElems) return _customElems[name];
      };

      /**
       * @param Object elem  - _e() element to init the element to
       * @param Object customElem  - Custom element initialization data
       * @param float parentE
       * @param float attrObj
       * @param Object givenBaseData
       */
      _myTrait_._initCustom = function (elem, customElem, parentE, attrObj, givenBaseData) {

        var baseData;

        // getInitialState

        if (elem._compBaseData) {
          baseData = elem._compBaseData;
        } else {

          if (customElem.data) {
            // if there is attributes set for the object
            baseData = _data(JSON.parse(JSON.stringify(customElem.data)));
          } else {
            if (customElem.getDefaultProps) {
              baseData = _data(customElem.getDefaultProps());
            } else {
              baseData = _data({});
            }
          }

          elem._compBaseData = baseData;
          if (this.isObject(attrObj)) {
            var oo = attrObj;
            // TODO: make this batter, now only one-dimensional :/
            for (var n in oo) {
              if (oo.hasOwnProperty(n)) {
                elem.attr(n, oo[n]);
              }
            }
          }
        }

        if (customElem.baseCss) {
          if (elem._customCssBase) elem.removeClass(elem._customCssBase);
          elem.addClass(customElem.baseCss._nameSpace);
          elem._customCssBase = customElem.baseCss._nameSpace;
        }

        var current_ch = [];
        if (elem._contentObj) {
          elem._contentObj.forChildren(function (ch) {
            current_ch.push(ch);
          });
        }

        if (parentE) {
          elem._contentParent = parentE;
        }

        // -- initialize the controllers --
        var known = ["data", "css", "init", "render", "baseCss"];
        for (var prop in customElem) {
          if (customElem.hasOwnProperty(prop)) {
            var fn = customElem[prop];
            if (this.isFunction(fn)) {
              var me = this;
              (function (fn) {
                elem.sendHandler(prop, function (params, callback, errCb) {
                  fn.apply(elem, [params, callback, errCb]);
                });
              })(fn);
            }
          }
        }
        if (customElem.webWorkers && !this._workersAvailable()) {
          for (var prop in customElem.webWorkers) {
            if (customElem.webWorkers.hasOwnProperty(prop)) {
              var fn = customElem.webWorkers[prop];
              if (this.isFunction(fn)) {
                var me = this;
                (function (fn, prop) {
                  elem.sendHandler(prop, function (params, callback, errCb) {
                    fn.apply(elem, [params, callback, errCb]);
                  });
                })(fn, prop);
              }
            }
          }
          // TODO: implement static variable storage for non-web worker classes
        }

        var objProperties = baseData || attrObj || {};

        if (givenBaseData) {
          elem._compState = givenBaseData;
        } else {
          if (customElem.getInitialState) {
            var stateData = customElem.getInitialState.apply(elem, [objProperties]);
            elem._compState = _data(stateData);
          }
        }

        var renderFn = customElem.init,
            reactiveRender = customElem.render;

        elem._initWithDef = customElem;
        elem._instanceVars = {};

        // ready to go with render function
        /*
        requires : {
        js : [
            { url : "https://rawgit.com/terotests/displayList/master/release/displayList-0.05.js?v=2" }
        ]  
        },
        */
        // _createWorkerObj ... options._waitClass
        if (customElem.requires || customElem._waitClass) {

          var prom = _promise(); // should be available
          var start = prom;
          // -- load if promises available...
          if (customElem.requires) {
            if (customElem.requires.js) {
              customElem.requires.js.forEach(function (item) {
                prom = prom.then(function () {
                  return elem.appendToHead("js", item.url);
                });
              });
            }
            if (customElem.requires.css) {
              customElem.requires.css.forEach(function (item) {
                prom = prom.then(function () {
                  return elem.appendToHead("css", item.url);
                });
              });
            }
          }
          // got to wait for the web worker class creation, if it has been defined
          if (customElem._waitClass) {
            prom = prom.then(function () {
              return customElem._waitClass;
            });
            elem._workerObjId = this.guid();
            var self = this;
            prom = prom.then(function () {
              return self._createWorkerObj(customElem.customTag, elem._workerObjId, elem);
            });
            prom = prom.then(function () {
              var ww = customElem.webWorkers;
              for (var fName in ww) {
                if (ww.hasOwnProperty(fName)) {
                  var fn = ww[fName];
                  if (self.isFunction(fn)) {
                    (function (fName) {
                      elem.sendHandler(fName, function (params, callback) {
                        self._callObject(elem._workerObjId, fName, params, callback);
                      });
                    })(fName);
                  }
                }
              }
              elem.sendHandler("setStaticVar", function (params, callback) {
                self._callObject(elem._workerObjId, "setStaticVar", params, callback);
              });
            });
          }

          prom = prom.then(function () {
            var contentObj = renderFn.apply(elem, [objProperties, customElem]);
            if (contentObj) {
              elem._contentObj = contentObj;
              contentObj._contentParent = elem;
              current_ch.forEach(function (ch) {
                contentObj.add(ch);
              });
            }
          });
          start.resolve();
          elem._uiWaitProm = prom;
        } else {
          var contentObj = renderFn.apply(elem, [objProperties, customElem]);
          if (contentObj) {
            elem._contentObj = contentObj;
            contentObj._contentParent = elem;
            current_ch.forEach(function (ch) {
              contentObj.add(ch);
            });
          }
        }
      };

      /**
       * @param float t
       */
      _myTrait_.composite = function (t) {
        var argList = Array.prototype.slice.call(arguments);

        if (this._contentObj) {
          return this._contentObj.composite.apply(this._contentObj, argList);
        }
        /*
        res.elemName
        res.classStr
        res.data
        res.stream
        res.attrs
        res.constr
        */
        var res = this._constrArgs(argList);

        if (!this._isStdElem(res.elemName)) {

          var customElem = this._findCustomElem(res.elemName);
          if (customElem) {
            // find the state...

            var model = this.state(),
                baseData;
            if (model && model.hasOwn && !model.hasOwn(customElem.customTag)) {
              if (res.data) {
                // always make a copy if aguments given to avoid problems if the
                // data has been network connected...
                model.set(customElem.customTag, res.data.toPlainData());
              } else {
                if (customElem.getInitialState) {
                  var stateData = customElem.getInitialState.apply(this, []);
                  model.set(customElem.customTag, stateData);
                } else {
                  model.set(customElem.customTag, {});
                }
              }
            }
            if (model && model.hasOwn(customElem.customTag)) {
              baseData = model[customElem.customTag];
            }
            if (customElem.init || customElem.render) {

              // create the element HTML tag
              var elem = _e(customElem.customTag, res.attrs, res.constr, baseData || res.data);
              this.add(elem);
              return elem;
            }
          }
        }
        var el = this.shortcutFor.apply(this, argList); // (elemName, className, attrs);
        return el;
      };

      /**
       * @param float elemName
       * @param float options
       */
      _myTrait_.createClass = function (elemName, options) {
        return this.customElement(elemName, options);
      };

      /**
       * Registers a custom element. Note: Allows rewriting the element definition.
       * @param String elemName
       * @param Object options
       */
      _myTrait_.customElement = function (elemName, options) {

        if (!this._customElems) this._customElems = {};
        if (!_customElems) _customElems = {};

        this._customElems[elemName] = options;
        _customElems[elemName] = options;

        // save the custom element tag name for further referencese
        options.customTag = elemName;

        // create the CSS if necessary to the namespace of the element
        if (options.css) {
          var baseCss = this.css(elemName);
          options.css(baseCss);
          options.baseCss = baseCss;

          // TODO: add _firstUpdate to 
          // CSS object baseCss._firstUpdate = function() { --- }
        }

        // Object
        if (options.webWorkers && this.isObject(options.webWorkers) && this._workersAvailable()) {
          // this._createWorkerClass
          options._waitClass = this._createWorkerClass(elemName, options.webWorkers);
        }
        this._addCustomTagFn(elemName);
      };

      /**
       * @param float t
       */
      _myTrait_.getRegisteredClasses = function (t) {
        return _customElems || {};
      };

      /**
       * Creates &quot;postcss&quot; like postprocessing for every CSS object in registered components list
       * @param String compName  - The component or element name
       * @param function fn  - Function
       */
      _myTrait_.modifyCss = function (compName, fn) {
        var cList = this.getRegisteredClasses();

        if (!fn) {
          fn = compName;
          compName = false;
        }

        if (compName) {
          var ob = cList[compName];
          if (ob && ob.baseCss) {
            // TODO: add also the CSS construction parameters here
            fn(n, ob.baseCss);
          }
          return this;
        }

        for (var n in cList) {

          if (compName && n != compName) continue;

          if (cList.hasOwnProperty(n)) {
            var ob = cList[n];
            if (ob.baseCss) {
              // TODO: add also the CSS construction parameters here
              fn(n, ob.baseCss);
            }
          }
        }
        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.props = function (t) {
        if (!this._compBaseData) {
          var p = this._parent;
          if (p) return p.props();
          return null;
        }
        return this._compBaseData;
      };

      /**
       * @param String name
       */
      _myTrait_.ref = function (name) {
        var pComp = this._findComp();
        if (pComp) {
          if (pComp._instanceVars) {
            var initData = pComp._instanceVars;
            if (initData.refs) {
              return initData.refs[name];
            }
          }
        }
      };

      /**
       * @param String elemName
       * @param Object options
       */
      _myTrait_.registerElement = function (elemName, options) {
        return this.customElement(elemName, options);
      };

      /**
       * @param float t
       */
      _myTrait_.state = function (t) {

        if (this._compState) {
          return this._compState;
        } else {
          if (this._initWithDef) {
            this._compState = _data({});
            return this._compState;
          } else {
            var p = this._parent;
            if (p) return p.state();
          }
        }
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _callBackHash;
      var _idx;
      var _worker;
      var _initDone;
      var _objRefs;
      var _threadPool;
      var _maxWorkerCnt;
      var _roundRobin;
      var _objPool;

      // Initialize static variables here...

      /**
       * The bootstrap for the worker to receive and delegate commands. This is the code running at the worker -side of the pool.
       * @param float t
       */
      _myTrait_._baseWorker = function (t) {
        return {
          init: function init() {
            if (this._initDone) return;
            this._initDone = true;
            this._classes = {};
            this._instances = {};
            this._instanceMeta = {};
            this._classStatics = {};
          },
          start: function start(msg) {
            this.init();
            // Root object call
            if (msg.data.cmd == "call" && msg.data.id == "/") {
              if (msg.data.fn == "createClass") {
                var newClass;
                var dataObj = JSON.parse(msg.data.data);
                eval("newClass = " + dataObj.code);
                this._classes[dataObj.className] = newClass;
                this._classStatics[dataObj.className] = {};
                postMessage({
                  cbid: msg.data.cbid,
                  data: "Done"
                });
              }
              if (msg.data.fn == "createObject" && msg.data.data) {
                var dataObj = JSON.parse(msg.data.data);
                var newClass = this._classes[dataObj.className];
                if (newClass) {
                  var o_instance = Object.create(newClass);
                  this._instances[dataObj.id] = o_instance;
                  this._instanceMeta[dataObj.id] = {
                    className: dataObj.className,
                    staticVars: this._classStatics[dataObj.className]
                  };
                  o_instance._statics = this._classStatics[dataObj.className];

                  // public function for the UI process to update a static variable
                  o_instance.setStaticVar = function (setData, cb) {
                    console.log("setStaticVar ");
                    console.log(setData);
                    if (typeof setData != "object") getData = JSON.parse(setData);
                    if (setData.name) {
                      o_instance._statics[setData.name] = setData.value;
                    }
                  };

                  // private function for the web worker to get a static variable
                  o_instance._getStaticVar = function (name) {
                    return o_instance._statics[name];
                  };

                  o_instance.send = function (msg, data, cb) {
                    postMessage({
                      msg: msg,
                      data: data,
                      ref_id: dataObj.id
                    });
                  };
                  o_instance._ref_id = dataObj.id;
                  postMessage({
                    cbid: msg.data.cbid,
                    data: "Done"
                  });
                }
              }
              return;
            }
            if (msg.data.cmd == "call" && msg.data.id) {
              var ob = this._instances[msg.data.id];
              if (ob) {
                if (ob[msg.data.fn]) {
                  ob[msg.data.fn].apply(ob, [msg.data.data, function (msgData) {
                    postMessage({
                      cbid: msg.data.cbid,
                      data: msgData
                    });
                  }]);
                }
              } else {}
            }
          }
        };
      };

      /**
       * @param String id  - Object ID to call
       * @param float fnName  - Name of function
       * @param String data  - Data as string
       * @param function callback  - Callback when done
       */
      _myTrait_._callObject = function (id, fnName, data, callback) {
        var o = _objRefs[id];
        if (o) {
          this._callWorker(_threadPool[o.__wPool], id, fnName, data, callback);
        }
        return this;
      };

      /**
       * @param Object worker  - Web Worker to call
       * @param String objectID  - ID of function or / to call the root
       * @param Name of function to call functionName  - Name of the function to call
       * @param String dataToSend  - Data, converted to string if object
       * @param function callBack  - callback
       */
      _myTrait_._callWorker = function (worker, objectID, functionName, dataToSend, callBack) {
        if (!_worker) return;

        _callBackHash[_idx] = callBack;
        if (typeof dataToSend == "object") dataToSend = JSON.stringify(dataToSend);
        worker.postMessage({
          cmd: "call",
          id: objectID,
          fn: functionName,
          cbid: _idx++,
          data: dataToSend
        });
      };

      /**
       * @param int index  - Thread index
       */
      _myTrait_._createWorker = function (index) {
        try {

          // currently only one worker in the system...

          if (typeof index == "undefined") {
            if (_worker) return _worker;
          }

          var theCode = "var o = " + this._serializeClass(this._baseWorker()) + "\n onmessage = function(eEvent) { o.start.apply(o, [eEvent]); } ";
          var blob = new Blob([theCode], {
            type: "text/javascript"
          });
          var ww = new Worker(window.URL.createObjectURL(blob));
          if (!_callBackHash) {
            _callBackHash = {};
            _idx = 1;
          }
          _worker = ww;
          ww.onmessage = function (oEvent) {
            if (typeof oEvent.data == "object") {
              if (oEvent.data.cbid) {
                var cb = _callBackHash[oEvent.data.cbid];
                delete _callBackHash[oEvent.data.cbid];
                cb(oEvent.data.data);
              }
              if (oEvent.data.ref_id) {
                var oo = _objRefs[oEvent.data.ref_id];

                if (oo) {
                  var dd = oEvent.data.data;
                  if (typeof dd == "object") dd = JSON.stringify(dd);
                  oo.send(oEvent.data.msg, dd, function (res) {
                    if (oEvent.data.cbid) {}
                  });
                }
              }
              return;
            }
            // unknown message
            console.error("Unknown message from the worker ", oEvent.data);
          };
          if (typeof index != "undefined") {
            _threadPool[index] = ww;
          }
          return ww;
        } catch (e) {
          return null;
        }
      };

      /**
       * @param float className
       * @param float classObj
       */
      _myTrait_._createWorkerClass = function (className, classObj) {
        var p = this.__promiseClass(),
            me = this;

        return new p(function (success) {
          var prom, first;
          var codeStr = me._serializeClass(classObj);
          for (var i = 0; i < _maxWorkerCnt; i++) {
            (function (i) {
              if (!prom) {
                first = prom = new p(function (done) {
                  me._callWorker(_threadPool[i], "/", "createClass", {
                    className: className,
                    code: codeStr
                  }, done);
                });
              } else {
                prom = prom.then(function () {
                  return new p(function (done) {
                    me._callWorker(_threadPool[i], "/", "createClass", {
                      className: className,
                      code: codeStr
                    }, done);
                  });
                });
              }
            })(i);
          }
          prom.then(function () {
            success(true);
          });
        });
      };

      /**
       * @param String className  - Class of the Object
       * @param String id  - Object ID
       * @param float refObj
       */
      _myTrait_._createWorkerObj = function (className, id, refObj) {
        var p = this.__promiseClass(),
            me = this;
        return new p(function (success) {

          var pool_index = _roundRobin++ % _maxWorkerCnt;
          refObj.__wPool = pool_index;

          me._callWorker(_threadPool[pool_index], "/", "createObject", {
            className: className,
            id: id
          }, function (result) {
            _objRefs[id] = refObj;
            success(result);
          });
        });
      };

      /**
       * @param Object o  - The Object with functions as properties
       */
      _myTrait_._serializeClass = function (o) {
        var res = "{";
        var i = 0;
        for (var n in o) {
          if (i++) res += ",";
          res += n + " : " + o[n].toString();
        }
        res += "};";
        return res;
      };

      /**
       * @param float t
       */
      _myTrait_._workersAvailable = function (t) {
        return _worker;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {

        if (!_initDone) {
          _initDone = true;
          _maxWorkerCnt = 4;
          _roundRobin = 0;
          _threadPool = [];
          _objRefs = {};
          for (var i = 0; i < _maxWorkerCnt; i++) {
            this._createWorker(i);
          }
        }
      });
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param Object data  - Some random data
       * @param float fn
       */
      _myTrait_.doReact = function (data, fn) {

        if (typeof fn != "undefined") this._reactFn = fn;
        if (this._reactFn) {
          this.patchWith(this._reactFn(data));
        }
      };

      /**
       * @param Object elem
       */
      _myTrait_.patchWith = function (elem) {

        if (elem._tag != this._tag) {
          // just redraw the item...
          this.replaceWith(elem);
          return this;
        }

        var classStr, elemClassStr;

        if (this._classes) {
          var classStr = this._classes.join(" ");
        }
        if (elem._classes) {
          var elemClassStr = elem._classes.join(" ");
        }

        if (classStr != elemClassStr) {
          this._classes = elem._classes;
          if (elemClassStr) {
            this._dom.className = elemClassStr;
          } else {
            this._dom.className = "";
          }
        }

        this._ev = elem._ev;

        for (var n in elem._attributes) {
          var v = elem._attributes[n];
          if (this._attributes[n] != v) {
            this._attributes[n] = v;
            this._dom.setAttribute(n, v);
          }
        }

        for (var n in this._attributes) {
          if (typeof elem._attributes[n] == "undefined") {
            delete this._attributes[n];
            this._dom.removeAttribute(n, v);
          }
        }

        // TODO: patch width, height, x, y etc.

        if (this._tag == "input" || this._tag == "textarea") {
          if (elem._value != this._value) {}
        } else {
          if (elem._children.length === 0) {
            var myList = this._children.slice(); // make copy of the array
            myList.forEach(function (ch) {
              ch.remove();
            });
            if (elem._html != this._html) {
              this._html = elem._html || "";
              this._dom.textContent = elem._html;
            }
          } else {
            if (elem._html != this._html) {
              this._html = elem._html || "";
              this._dom.textContent = elem._html;
            }
            var removeCnt = this._children.length - elem._children.length;
            var theList = elem._children.slice(); // make copy of the array
            var myList = this._children.slice(); // make copy of the array
            for (var j = 0; j < theList.length; j++) {
              var myCh = myList[j];
              if (myCh) {
                myCh.patchWith(theList[j]);
              } else {
                this.add(theList[j]);
              }
            }
            while (removeCnt > 0) {
              if (myList[j]) myList[j++].remove();
              removeCnt--;
            }
          }
        }
      };
    })(this);

    // the subclass definition comes around here then

    // The class definition is here...
    var _qc_prototype = function _qc_prototype() {
      // Then create the traits and subclasses for this class here...

      (function (_myTrait_) {

        // Initialize static variables here...

        /**
         * @param float n
         * @param float v
         */
        _myTrait_.attr = function (n, v) {

          var host = this._host;
          if (!isNaN(n)) return;

          if (host._svgElem) {

            if (host.isObject(v)) {
              if (v.onValue) {
                // Assume it is a stream...
                var me = this;
                v.onValue(function (val) {
                  if (typeof val != "undefined" && val !== null) {
                    if (n == "xlink:href") {
                      me._dom.setAttributeNS("http://www.w3.org/1999/xlink", "href", val);
                    } else {
                      me._dom.setAttributeNS(null, n, val);
                    }
                  }
                });

                return this;
              }
            }

            if (host.isArray(v)) {

              var oo = v[0],
                  fName = v[1],
                  val = oo[fName](),
                  me = this,
                  domi = me._dom,
                  host = this._host,
                  list;

              if (n == "xlink:href") {
                list = host.uniqueListener("attr:" + n, function (o, newV) {
                  if (typeof newV != "undefined" && newV !== null) {
                    domi.setAttributeNS("http://www.w3.org/1999/xlink", "href", newV);
                  }
                });
              } else {
                list = host.uniqueListener("attr:" + n, function (o, newV) {
                  if (typeof newV != "undefined" && newV !== null) {
                    domi.setAttributeNS(null, n, newV);
                  }
                });
              }
              oo.on(fName, list);
              if (typeof val != "undefined" && val !== null) {
                if (n == "xlink:href") {
                  this._dom.setAttributeNS("http://www.w3.org/1999/xlink", "href", val);
                } else {
                  this._dom.setAttributeNS(null, n, val);
                }
              } else {}
              return this;
            }

            if (typeof v != "undefined") {
              if (n == "xlink:href") {
                this._dom.setAttributeNS("http://www.w3.org/1999/xlink", "href", v);
              } else {
                this._dom.setAttributeNS(null, n, v);
              }
            }

            return this;
          }

          if (host.isArray(v)) {

            // console.log("Taking array as ", v);

            var oo = v[0],
                fName = v[1],
                val = oo[fName](),
                me = this,
                domi = me._dom,
                list;

            list = host.uniqueListener("attr:" + n, function (o, newV) {
              if (typeof newV != "undefined" && newV !== null) {
                host._attributes[n] = newV;
                domi.setAttribute(n, newV);
              }
            });
            oo.on(fName, list);
            if (typeof val != "undefined" && val !== null) {
              if (n == "xlink:href") {
                this._dom.setAttributeNS("http://www.w3.org/1999/xlink", "href", val);
              } else {
                host._attributes[n] = val;
                this._dom.setAttributeNS(null, n, val);
              }
            }
            return this;
          }

          if (host.isObject(v)) {
            if (v.onValue) {
              // Assume it is a stream...
              var me = this;
              v.onValue(function (val) {
                if (typeof val != "undefined" && val !== null) {
                  if (n == "xlink:href") {
                    me._dom.setAttributeNS("http://www.w3.org/1999/xlink", "href", val);
                  } else {
                    host._attributes[n] = val;
                    me._dom.setAttributeNS(null, n, val);
                  }
                }
              });

              return this;
            }
          }

          if (typeof v != "undefined" && isNaN(n)) {
            host._attributes[n] = v;
            this._dom.setAttribute(n, v);
          }
          return this;
        };

        /**
         * @param String en
         * @param float fn
         * @param float stop
         */
        _myTrait_.bindSysEvent = function (en, fn, stop) {
          en = en.toLowerCase();
          if (!this._sys) this._sys = {};
          if (this._sys[en]) return false;

          this._sys[en] = true;

          var me = this;
          this._dom.addEventListener(en, function (e) {
            e = e || window.event;
            me._event = e;
            if (stop) {
              if (e && e.stopPropagation) {
                e.stopPropagation();
              } else {
                e = window.event;
                e.cancelBubble = true;
              }
            }
            fn();
          });
          return true;
        };

        /**
         * @param float t
         */
        _myTrait_.blur = function (t) {
          if (this._dom.blur) this._dom.blur();
        };

        /**
         * @param string n
         * @param float v
         */
        _myTrait_.css = function (n, v) {
          if (n == "background-color") n = "backgroundColor";
          if (n == "margin-left") n = "marginLeft";
          if (n == "font-size") {
            n = "fontSize";
            v = this.pxParam(v);
          }

          if (n == "left" || n == "top" || n == "bottom" || n == "right" || n == "width" || n == "height") {

            v = this.pxParam(v);
          }

          if (v.substring) {
            if (v.substring(0, 3) == "NaN") {
              return;
            }
          }
          this._dom.style[n] = v;
          return this;
        };

        /**
         * @param float t
         */
        _myTrait_.focus = function (t) {
          if (this._dom.focus) this._dom.focus();
        };

        /**
         * @param float index
         */
        _myTrait_.get = function (index) {
          return this._dom;
        };

        if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
        if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
        _myTrait_.__traitInit.push(function (myDom, host) {
          this._dom = myDom;
          this._host = host;
        });

        /**
         * @param String v
         */
        _myTrait_.pxParam = function (v) {

          if (v == "auto") return v;

          if (typeof v.slice != "undefined") {
            if (v.slice(-1) == "%") {
              return v;
            }
            if (v.slice(-2) == "em") {
              return v;
            }
            if (v.slice(-2) == "px") {
              return v;
            }
          }

          if (isNaN(parseInt(v))) {
            return "";
          }
          if (typeof v == "string") {
            return parseInt(v) + "px";
          } else {
            var i = parseInt(v);
            if (!isNaN(i)) {
              return i + "px";
            }
          }
        };
      })(this);
    };

    var _qc = function _qc(a, b, c, d, e, f, g, h) {
      var m = this,
          res;
      if (m instanceof _qc) {
        var args = [a, b, c, d, e, f, g, h];
        if (m.__factoryClass) {
          m.__factoryClass.forEach(function (initF) {
            res = initF.apply(m, args);
          });
          if (typeof res == "function") {
            if (res._classInfo.name != _qc._classInfo.name) return new res(a, b, c, d, e, f, g, h);
          } else {
            if (res) return res;
          }
        }
        if (m.__traitInit) {
          m.__traitInit.forEach(function (initF) {
            initF.apply(m, args);
          });
        } else {
          if (typeof m.init == "function") m.init.apply(m, args);
        }
      } else return new _qc(a, b, c, d, e, f, g, h);
    };
    // inheritance is here

    _qc._classInfo = {
      name: "_qc"
    };
    _qc.prototype = new _qc_prototype();

    // the subclass definition comes around here then

    // The class definition is here...
    var later_prototype = function later_prototype() {
      // Then create the traits and subclasses for this class here...

      (function (_myTrait_) {
        var _initDone;
        var _callers;
        var _oneTimers;
        var _everies;
        var _framers;
        var _localCnt;
        var _easings;
        var _easeFns;

        // Initialize static variables here...

        /**
         * @param float t
         */
        _myTrait_._easeFns = function (t) {
          _easings = {
            easeIn: function easeIn(t) {
              return t * t;
            },
            easeOut: function easeOut(t) {
              return -1 * t * (t - 2);
            },
            easeInOut: function easeInOut(t) {
              if (t < 0.5) return t * t;
              return -1 * t * (t - 2);
            },
            easeInCubic: function easeInCubic(t) {
              return t * t * t;
            },
            easeOutCubic: function easeOutCubic(t) {
              return (1 - t) * (1 - t) * (1 - t) + 1;
            },
            pow: function pow(t) {
              return Math.pow(t, parseFloat(1.5 - t));
            },
            linear: function linear(t) {
              return t;
            }
          };
        };

        /**
         * @param function fn
         * @param float thisObj
         * @param float args
         */
        _myTrait_.add = function (fn, thisObj, args) {
          if (thisObj || args) {
            var tArgs;
            if (Object.prototype.toString.call(args) === "[object Array]") {
              tArgs = args;
            } else {
              tArgs = Array.prototype.slice.call(arguments, 2);
              if (!tArgs) tArgs = [];
            }
            _callers.push([thisObj, fn, tArgs]);
          } else {
            _callers.push(fn);
          }
        };

        /**
         * @param float name
         * @param float fn
         */
        _myTrait_.addEasingFn = function (name, fn) {
          _easings[name] = fn;
        };

        /**
         * @param float seconds
         * @param float fn
         * @param float name
         */
        _myTrait_.after = function (seconds, fn, name) {

          if (!name) {
            name = "aft_" + _localCnt++;
          }

          _everies[name] = {
            step: Math.floor(seconds * 1000),
            fn: fn,
            nextTime: 0,
            remove: true
          };
        };

        /**
         * @param function fn
         */
        _myTrait_.asap = function (fn) {
          this.add(fn);
        };

        /**
         * @param String name  - Name of the easing to use
         * @param int delay  - Delay of the transformation in ms
         * @param function callback  - Callback to set the values
         * @param function over  - When animation is over
         */
        _myTrait_.ease = function (name, delay, callback, over) {

          var fn = _easings[name];
          if (!fn) fn = _easings.pow;
          var id_name = "e_" + _localCnt++;
          _easeFns[id_name] = {
            easeFn: fn,
            duration: delay,
            cb: callback,
            over: over
          };
        };

        /**
         * @param float seconds
         * @param float fn
         * @param float name
         */
        _myTrait_.every = function (seconds, fn, name) {

          if (!name) {
            name = "t7491_" + _localCnt++;
          }

          _everies[name] = {
            step: Math.floor(seconds * 1000),
            fn: fn,
            nextTime: 0
          };
        };

        if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
        if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
        _myTrait_.__traitInit.push(function (interval, fn) {
          if (!_initDone) {
            this._easeFns();
            _localCnt = 1;

            var frame, cancelFrame;
            if (typeof window != "undefined") {
              var frame = window["requestAnimationFrame"],
                  cancelFrame = window["cancelRequestAnimationFrame"];
              ["", "ms", "moz", "webkit", "o"].forEach(function (x) {
                if (!frame) {
                  frame = window[x + "RequestAnimationFrame"];
                  cancelFrame = window[x + "CancelAnimationFrame"] || window[x + "CancelRequestAnimationFrame"];
                }
              });
            }

            var is_node_js = new Function("try { return this == global; } catch(e) { return false; }")();

            if (is_node_js) {
              frame = function (cb) {
                return setImmediate(cb); // (cb,1);
              };
            } else {
              if (!frame) {
                frame = function (cb) {
                  return setTimeout(cb, 16);
                };
              }
            }

            if (!cancelFrame) cancelFrame = function (id) {
              clearTimeout(id);
            };

            _callers = [];
            _oneTimers = {};
            _everies = {};
            _framers = [];
            _easeFns = {};
            var lastMs = 0;

            var _callQueQue = function _callQueQue() {
              var ms = new Date().getTime(),
                  elapsed = lastMs - ms;

              if (lastMs == 0) elapsed = 0;
              var fn;
              while (fn = _callers.shift()) {
                if (Object.prototype.toString.call(fn) === "[object Array]") {
                  fn[1].apply(fn[0], fn[2]);
                } else {
                  fn();
                }
              }

              for (var i = 0; i < _framers.length; i++) {
                var fFn = _framers[i];
                fFn();
              }
              /*
              _easeFns.push({
              easeFn : fn,
              duration : delay,
              cb : callback
              });
               */
              for (var n in _easeFns) {
                if (_easeFns.hasOwnProperty(n)) {
                  var v = _easeFns[n];
                  if (!v.start) v.start = ms;
                  var delta = ms - v.start,
                      dt = delta / v.duration;
                  if (dt >= 1) {
                    dt = 1;
                    delete _easeFns[n];
                  }
                  v.cb(v.easeFn(dt));
                  if (dt == 1 && v.over) v.over();
                }
              }

              for (var n in _oneTimers) {
                if (_oneTimers.hasOwnProperty(n)) {
                  var v = _oneTimers[n];
                  v[0](v[1]);
                  delete _oneTimers[n];
                }
              }

              for (var n in _everies) {
                if (_everies.hasOwnProperty(n)) {
                  var v = _everies[n];
                  if (v.nextTime < ms) {
                    if (v.remove) {
                      if (v.nextTime > 0) {
                        v.fn();
                        delete _everies[n];
                      } else {
                        v.nextTime = ms + v.step;
                      }
                    } else {
                      v.fn();
                      v.nextTime = ms + v.step;
                    }
                  }
                  if (v.until) {
                    if (v.until < ms) {
                      delete _everies[n];
                    }
                  }
                }
              }

              frame(_callQueQue);
              lastMs = ms;
            };
            _callQueQue();
            _initDone = true;
          }
        });

        /**
         * @param  key
         * @param float fn
         * @param float value
         */
        _myTrait_.once = function (key, fn, value) {
          // _oneTimers

          _oneTimers[key] = [fn, value];
        };

        /**
         * @param function fn
         */
        _myTrait_.onFrame = function (fn) {

          _framers.push(fn);
        };

        /**
         * @param float fn
         */
        _myTrait_.removeFrameFn = function (fn) {

          var i = _framers.indexOf(fn);
          if (i >= 0) {
            if (fn._onRemove) {
              fn._onRemove();
            }
            _framers.splice(i, 1);
            return true;
          } else {
            return false;
          }
        };
      })(this);
    };

    var later = function later(a, b, c, d, e, f, g, h) {
      var m = this,
          res;
      if (m instanceof later) {
        var args = [a, b, c, d, e, f, g, h];
        if (m.__factoryClass) {
          m.__factoryClass.forEach(function (initF) {
            res = initF.apply(m, args);
          });
          if (typeof res == "function") {
            if (res._classInfo.name != later._classInfo.name) return new res(a, b, c, d, e, f, g, h);
          } else {
            if (res) return res;
          }
        }
        if (m.__traitInit) {
          m.__traitInit.forEach(function (initF) {
            initF.apply(m, args);
          });
        } else {
          if (typeof m.init == "function") m.init.apply(m, args);
        }
      } else return new later(a, b, c, d, e, f, g, h);
    };
    // inheritance is here

    later._classInfo = {
      name: "later"
    };
    later.prototype = new later_prototype();

    (function () {
      if (typeof define !== "undefined" && define !== null && define.amd != null) {
        __amdDefs__["later"] = later;
        this.later = later;
      } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
        module.exports["later"] = later;
      } else {
        this.later = later;
      }
    }).call(new Function("return this")());

    // the subclass definition comes around here then

    // The class definition is here...
    var css_prototype = function css_prototype() {
      // Then create the traits and subclasses for this class here...

      // trait comes here...

      (function (_myTrait_) {

        // Initialize static variables here...

        /**
         * @param float t
         */
        _myTrait_.guid = function (t) {

          return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        };

        /**
         * @param float t
         */
        _myTrait_.isArray = function (t) {
          return Object.prototype.toString.call(t) === "[object Array]";
        };

        /**
         * @param float fn
         */
        _myTrait_.isFunction = function (fn) {
          return Object.prototype.toString.call(fn) == "[object Function]";
        };

        /**
         * @param float t
         */
        _myTrait_.isObject = function (t) {
          return t === Object(t);
        };
      })(this);

      (function (_myTrait_) {
        var head;
        var styleTag;
        var bexp;
        var bexp2;
        var _conversions;
        var _instances;
        var _insInit;
        var _someDirty;
        var _virtualTags;
        var _virtualSize;
        var _IE9Limits;
        var _IE9Tag;

        // Initialize static variables here...

        /**
         * @param Object objectList
         */
        _myTrait_._assign = function (objectList) {
          var o = {},
              args;
          if (this.isArray(objectList)) {
            args = objectList;
          } else {
            args = Array.prototype.slice.call(arguments);
          }
          args.forEach(function (rules) {
            for (var n in rules) {
              if (rules.hasOwnProperty(n)) {
                var value = rules[n];
                if (value === null || value === false) {
                  delete o[n];
                } else {
                  o[n] = rules[n];
                }
              }
            }
          });
          return o;
        };

        if (!_myTrait_.hasOwnProperty("__factoryClass")) _myTrait_.__factoryClass = [];
        _myTrait_.__factoryClass.push(function (id, mediaRule) {

          if (!id) id = "_global_";

          if (mediaRule) id += "/" + mediaRule;

          if (!_instances) {
            _instances = {};
            _instances[id] = this;
          } else {
            if (_instances[id]) return _instances[id];
            _instances[id] = this;
          }
        });

        /**
         * @param float animName
         * @param float settings
         */
        _myTrait_.animation = function (animName, settings) {

          var args = Array.prototype.slice.call(arguments),
              animName = args.shift(),
              settings = args.shift(),
              animKeyName = animName + "-keyframes",
              parts = args,
              t = 0,
              me = this,
              animStr = "",
              postFix = this._cssScope || "";

          args.forEach(function (cssRuleObj) {
            if (me.isObject(cssRuleObj)) {
              var pros;
              if (typeof cssRuleObj.time != "undefined") {
                pros = parseInt(100 * parseFloat(cssRuleObj.time));
              } else {
                pros = parseInt(t * 100);
              }
              if (pros < 0) pros = 0;
              if (pros > 100) pros = 100;
              animStr += pros + "% " + me.ruleToCss(cssRuleObj) + " \n";
              t = 1;
            } else {
              t = cssRuleObj;
            }
          });
          var fullStr = "";
          var exp = ["", "-o-", "-moz-", "-webkit-"];
          exp.forEach(function (r) {
            fullStr += "@" + r + "keyframes " + animKeyName + postFix + " { " + animStr + " } \n";
          });
          this._animations[animKeyName + postFix] = fullStr;

          var animDef = {};
          if (this.isObject(settings)) {
            var so = this.animSettings(settings);
            so["animation-name"] = animKeyName + postFix;
            this.bind("." + animName, so);
          } else {
            this.bind("." + animName, {
              animation: animKeyName + postFix + " " + settings
            });
          }
        };

        /**
         * @param float obj
         */
        _myTrait_.animSettings = function (obj) {

          if (this.isObject(obj)) {
            var res = {};
            for (var n in obj) {
              if (obj.hasOwnProperty(n)) {
                if (n == "duration" || n == "iteration-count") {
                  res["animation-" + n] = obj[n];
                } else {
                  res[n] = obj[n];
                }
              }
            }
            return res;
          } else {
            return {};
          }
        };

        /**
         * @param String cssRule  - The rule to modify
         */
        _myTrait_.assign = function (cssRule) {
          // my rulesets...
          var args = Array.prototype.slice.call(arguments);
          var rule = args[0];

          if (!this._data[rule]) this._data[rule] = [];

          var i = 1;
          var max = 3; // maximum number, until we just merge rest to the last...

          while (args[i]) {
            if (this._data[rule].length >= max) {
              var new_obj = args[i];
              var rule_obj = this._data[rule][this._data[rule].length - 1];
              for (var n in new_obj) {
                if (new_obj.hasOwnProperty(n)) {
                  rule_obj[n] = new_obj[n];
                }
              }
              i++;
              continue;
            }
            this._data[rule].push(args[i]);
            i++;
          }
          this._dirty = true;
          _someDirty = true;
          return this;
        };

        /**
         * @param String className
         * @param Object obj  - one or more objects to combine
         */
        _myTrait_.bind = function (className, obj) {
          // my rulesets...
          var args = Array.prototype.slice.call(arguments),
              rule = args.shift();

          this._data[rule] = args;
          this._dirty = true;
          _someDirty = true;

          return this;
        };

        /**
         * @param float mediaRule
         */
        _myTrait_.buildCss = function (mediaRule) {

          if (this._data) {
            if (!mediaRule) mediaRule = this._mediaRule;
            var o = {};
            for (var rule in this._data) {
              if (this._data.hasOwnProperty(rule)) {
                var ruleData = this._data[rule];
                if (this._composedData[rule]) {
                  ruleData = [this._composedData[rule]].concat(ruleData);
                }
                o[rule] = this._assign(ruleData);
              }
            }
            this._composedData = o;
            this.updateStyleTag(this.makeCss(o, mediaRule));
          }
        };

        /**
         * @param float t
         */
        _myTrait_.collectAnimationCss = function (t) {

          var anims = this._animations,
              str = "";

          for (var n in anims) {
            if (anims.hasOwnProperty(n)) str += anims[n];
          }
          return str;
        };

        /**
         * @param float n
         * @param float v
         */
        _myTrait_.convert = function (n, v) {
          var str = "",
              gPos;

          if (v && v.indexOf && (gPos = v.indexOf("-gradient")) >= 0) {

            var start = gPos - 1,
                end = gPos + 8,
                bError = false;
            var legals = "lineardg-wbktmozp"; // repeating
            while (legals.indexOf(v.charAt(start)) >= 0) {
              start--;
              if (start <= 0) {
                start = 0;
                break;
              }
            }

            var pCnt = 1;

            while (v.charAt(end++) != "(");

            while (pCnt > 0) {
              if (v.charAt(end) == "(") pCnt++;
              if (v.charAt(end) == ")") pCnt--;
              end++;
              if (v.length < end) {
                bError = true;
                break;
              }
            }
            if (!bError) {
              var gradString = v.substring(start, end),
                  s = v.substring(0, start),
                  e = v.substring(end);
              var str = "";
              ["-webkit-", "", "-moz-", "-o-"].forEach(function (p) {
                str += n + " : " + s + " " + p + gradString + e + ";\n";
              });
            }
          }

          if (_conversions[n]) {
            str = _conversions[n](n, v);
          } else {
            str += n + " : " + v + ";\n";
          }
          return str;
        };

        /**
         * @param float mediaRule
         */
        _myTrait_.forMedia = function (mediaRule) {

          var mediaObj = css(this._cssScope, mediaRule);

          if (!this._mediaHash) this._mediaHash = {};
          if (!this._mediaHash[mediaRule]) this._mediaHash[mediaRule] = mediaObj;

          return mediaObj;
        };

        /**
         * @param function fn
         */
        _myTrait_.forRules = function (fn) {
          // TODO: consider how the if media rules need to be given using this function
          for (var n in this._data) {
            if (this._data.hasOwnProperty(n)) {
              fn.apply(this, [n, this._assign(this._data[n])]);
            }
          }
        };

        if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
        if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
        _myTrait_.__traitInit.push(function (cssScope, mediaRule) {
          // my rulesets...
          this._data = this._data || {};
          this._animations = {};
          this._composedData = this._composedData || {};

          this._mediaRule = mediaRule;

          // this used to be cssPostFix;
          this._cssScope = cssScope || "";
          // this._postFix = cssPostFix || "";

          if (!head) {
            _virtualTags = [];
            var me = this;
            later().every(1 / 10, function () {
              if (!_someDirty) return;
              _someDirty = false;

              for (var id in _instances) {
                if (_instances.hasOwnProperty(id)) {
                  var ins = _instances[id];
                  if (ins._dirty) {
                    ins.buildCss();
                    ins._dirty = false;
                    if (ins._firstUpdate) {
                      ins._firstUpdate();
                      delete ins._firstUpdate;
                    }
                  }
                }
              }
              if (_IE9Limits && _IE9Tag) {
                _IE9Tag.styleSheet.cssText = _virtualTags.join(" ");
              };
            });
          }
          if (!_insInit) _insInit = {};
          var id = cssScope || "_global_";
          if (mediaRule) id += "/" + mediaRule;
          if (!_insInit[id]) {
            _insInit[id] = true;
            this.initConversions();
          }
        });

        /**
         * @param float t
         */
        _myTrait_.initConversions = function (t) {

          // -- moving this to virtual tags for IE9 ----
          // _virtualTags

          if (!_virtualSize) _virtualSize = 0;

          if (!window.atob && document.all) {
            _IE9Limits = true;
          }

          this._virtualTagId = _virtualSize++;
          _virtualTags[this._virtualTagId] = ""; // make it string to support array join

          bexp = function (p, v) {
            var str = "";
            str += "-o-" + p + ":" + v + ";\n";
            str += "-moz-" + p + ":" + v + ";\n";
            str += "-webkit-" + p + ":" + v + ";\n";
            str += p + ":" + v + ";\n";
            return str;
          };

          bexp2 = function (p, v) {
            var str = "";
            str += "-o-" + p + ":" + "-o-" + v + ";\n";
            str += "-moz-" + p + ":" + "-moz-" + v + ";\n";
            str += "-webkit-" + p + ":" + "-webkit-" + v + ";\n";
            str += p + ":" + v + ";\n";
            return str;
          };

          _conversions = {
            "border-radius": function borderRadius(n, v) {
              return bexp(n, v);
            },
            "box-shadow": function boxShadow(n, v) {
              return bexp(n, v);
            },
            "rotate": function rotate(n, v) {
              n = "transform";
              v = "rotate(" + parseInt(v) + "deg)";
              return bexp(n, v);
            },
            "transition": function transition(n, v) {
              return bexp2(n, v);
            },
            "filter": function filter(n, v) {
              return bexp(n, v);
            },
            "animation": function animation(n, v) {
              return bexp(n, v);
            },
            "animation-iteration-count": function animationIterationCount(n, v) {
              return bexp(n, v);
            },
            "animation-fill-mode": function animationFillMode(n, v) {
              return bexp(n, v);
            },
            "transition-timing-function": function transitionTimingFunction(n, v) {
              return bexp(n, v);
            },
            "animation-name": function animationName(n, v) {
              return bexp(n, v);
            },
            "animation-timing-function": function animationTimingFunction(n, v) {
              return bexp(n, v);
            },
            "animation-duration": function animationDuration(n, v) {
              return bexp(n, v);
            },
            "transform": function transform(n, v) {
              return bexp(n, v);
            },
            "transform-style": function transformStyle(n, v) {
              return bexp(n, v);
            },
            "transform-origin": function transformOrigin(n, v) {
              return bexp(n, v);
            },
            "perspective": function perspective(n, v) {
              return bexp(n, v);
            },
            "text-shadow": function textShadow(n, v) {
              return bexp(n, v);
            },
            "opacity": function opacity(n, v) {
              v = parseFloat(v);
              var str = "-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=" + parseInt(v * 100) + ")\";";
              str += "filter: alpha(opacity=" + parseInt(v * 100) + ");";
              str += bexp(n, v);
              return str;
            }
          };
        };

        /**
         * @param float o
         * @param float mediaRule
         */
        _myTrait_.makeCss = function (o, mediaRule) {
          var str = mediaRule ? mediaRule + "{" : "";

          for (var rule in o) {
            if (o.hasOwnProperty(rule)) {
              var cssRules = o[rule];
              if (this._cssScope) {
                var cssString = this.ruleToCss(cssRules);
                str += "." + this._cssScope + " " + rule + cssString + " ";
                str += rule + "." + this._cssScope + " " + cssString;
              } else {
                str += rule + this.ruleToCss(cssRules);
              }
            }
          }

          // add the animation css also into this mediarule...
          str += this.collectAnimationCss();

          str += mediaRule ? "}\n" : "";
          return str;
        };

        /**
         * @param String mediaRule
         */
        _myTrait_.mediaFork = function (mediaRule) {

          return css(this._cssScope, mediaRule);
        };

        /**
         * @param float cssRulesObj
         */
        _myTrait_.ruleToCss = function (cssRulesObj) {
          var str = "{";
          for (var n in cssRulesObj) {
            if (n == "time") continue;
            str += this.convert(n, cssRulesObj[n]);
          }
          str += "}\n";
          return str;
        };

        /**
         * @param float cssText
         */
        _myTrait_.updateStyleTag = function (cssText) {

          try {
            if (_IE9Limits) {
              // if the styletag does not exist create it for IE9
              if (!_IE9Tag) {
                head = document.getElementsByTagName("head")[0];
                var styleTag = document.createElement("style");
                styleTag.setAttribute("type", "text/css");
                styleTag.styleSheet.cssText = "";
                _IE9Tag = styleTag;
                head.appendChild(styleTag);
              }
              // for IE9 build CSS into virtual tags first
              _virtualTags[this._virtualTagId] = cssText;
            } else {

              var styleTag;

              if (!this._styleTag) {
                head = document.getElementsByTagName("head")[0];
                var styleTag = document.createElement("style");
                styleTag.setAttribute("type", "text/css");
                if (styleTag.styleSheet) {
                  // IE
                  styleTag.styleSheet.cssText = "";
                } else {
                  // the world
                  styleTag.appendChild(document.createTextNode(""));
                }
                head.appendChild(styleTag);
                this._styleTag = styleTag;
              }

              styleTag = this._styleTag;
              var old = styleTag.firstChild;
              styleTag.appendChild(document.createTextNode(cssText));
              if (typeof old != "undefined") {
                styleTag.removeChild(old);
              }
            }
          } catch (e) {
            if (console && console.log) console.log(e.message, cssText);
          }
        };
      })(this);
    };

    var css = function css(a, b, c, d, e, f, g, h) {
      var m = this,
          res;
      if (m instanceof css) {
        var args = [a, b, c, d, e, f, g, h];
        if (m.__factoryClass) {
          m.__factoryClass.forEach(function (initF) {
            res = initF.apply(m, args);
          });
          if (typeof res == "function") {
            if (res._classInfo.name != css._classInfo.name) return new res(a, b, c, d, e, f, g, h);
          } else {
            if (res) return res;
          }
        }
        if (m.__traitInit) {
          m.__traitInit.forEach(function (initF) {
            initF.apply(m, args);
          });
        } else {
          if (typeof m.init == "function") m.init.apply(m, args);
        }
      } else return new css(a, b, c, d, e, f, g, h);
    };
    // inheritance is here

    css._classInfo = {
      name: "css"
    };
    css.prototype = new css_prototype();

    (function () {
      if (typeof define !== "undefined" && define !== null && define.amd != null) {
        __amdDefs__["css"] = css;
        this.css = css;
      } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
        module.exports["css"] = css;
      } else {
        this.css = css;
      }
    }).call(new Function("return this")());

    (function (_myTrait_) {
      var _eg;
      var _ee_;
      var guid;
      var _screenInit;
      var _svgElems;
      var _registry;
      var _elemNames;
      var _hasRemoted;
      var _elemNamesList;

      // Initialize static variables here...

      /**
       * Will return the Promise class implementation, if available
       * @param float t
       */
      _myTrait_.__promiseClass = function (t) {
        var p;
        if (typeof _promise != "undefined") p = _promise;
        if (!p && typeof Promise != "undefined") p = Promise;
        return p;
      };

      /**
       * @param float t
       */
      _myTrait_.__singleton = function (t) {
        return _eg;
      };

      if (!_myTrait_.hasOwnProperty("__factoryClass")) _myTrait_.__factoryClass = [];
      _myTrait_.__factoryClass.push(function (elemName, into) {

        if (elemName) {
          if (_registry && _registry[elemName]) {
            var classConst = _registry[elemName];
            return new classConst(elemName, into);
          }
        }
      });

      /**
       * Parse element constructor argumens, typically: elementName, attributes, constructor function and custom data.
       * @param Array args
       */
      _myTrait_._constrArgs = function (args) {
        // var args = Array.prototype.slice.call(arguments);

        var res = {},
            me = this;

        res.elemName = args.shift();
        /*
        res.elemName
        res.classStr
        res.data
        res.stream
        res.attrs
        res.constr
        */

        args.forEach(function (a, i) {

          if (typeof a == "string") {
            res.classStr = a;
            return;
          }
          if (me.isObject(a) && me.isFunction(a.getID)) {
            res.data = a;
            return;
          }
          if (me.isStream(a)) {
            res.stream = a;
            return;
          }
          if (me.isObject(a) && !me.isFunction(a)) {
            res.attrs = a;
            return;
          }
          if (me.isFunction(a)) {
            res.constr = a;
            return;
          }
        });
        return res;
      };

      /**
       * @param String name
       */
      _myTrait_._isStdElem = function (name) {
        return _elemNames[name];
      };

      /**
       * @param string name
       * @param float fn
       */
      _myTrait_.extendAll = function (name, fn) {

        if (this.isObject(name)) {

          for (var n in name) {
            if (name.hasOwnProperty(n)) this.extendAll(n, name[n]);
          }

          return this;
        }

        if (!_myTrait_[name]) {
          _myTrait_[name] = fn;
        }
        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.getComponentRegistry = function (t) {
        return _registry;
      };

      /**
       * @param float t
       */
      _myTrait_.getElemNames = function (t) {
        return _elemNamesList;
      };

      /**
       * @param float t
       */
      _myTrait_.globalState = function (t) {

        var outPosition = {
          "transform": "translate(-2000px,0px)"
        };

        var inPosition = {
          "transform": "translate(0,0)" };

        css().animation("viewOut", {
          duration: "0.4s",
          "iteration-count": 1 }, inPosition, 0.5, outPosition, outPosition);

        css().animation("viewIn", {
          duration: "0.4s",
          "iteration-count": 1 }, outPosition, 0.5, inPosition, inPosition);

        var _eg = _ee_ = (function () {

          var o = {};

          var _dragging = false;
          var _dragItem = null;
          var _draggableItems = [];
          var _mouseDown = false;
          var _mouse = {
            x: 0,
            y: 0
          };
          var _dv = {
            sx: 0,
            sy: 0,
            dx: 0,
            dy: 0
          };

          o._cssfactor = 1;

          o.addEventListener = function (dom, en, fn) {
            dom.addEventListener(en.toLowerCase(), fn);
            return true;
          };

          o.mouse = function () {
            return _mouse;
          };

          o.pxParam = function (v) {

            if (typeof v == "string") {
              return parseInt(v) + "px";
            } else {
              var i = parseInt(v);
              if (!isNaN(i)) {
                // this._dom.style.width = i+"px";
                return i + "px";
              }
            }
          };

          o.bexp = function (p, v) {
            var str = "";
            str += "-o-" + p + ":" + v + ";\n";
            str += "-moz-" + p + ":" + v + ";\n";
            str += "-webkit-" + p + ":" + v + ";\n";
            str += p + ":" + v + ";\n";
            return str;
          };

          var currentDragTarget;
          o.setDragTarget = function (elem) {
            currentDragTarget = elem;
          };

          o.addEventListener(document, "mousemove", function (e) {

            e = e || window.event;

            if (!e.pageX) {

              _mouse.x = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
              _mouse.y = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
            } else {
              _mouse.x = e.pageX;
              _mouse.y = e.pageY;
            }

            // console.log("Mousemove ", _dragging);
            if (_dragging) {

              if (e.stopPropagation) e.stopPropagation();
              if (e.preventDefault) e.preventDefault();
              e.cancelBubble = true;
              e.returnValue = false;

              _dv.mx = _mouse.x;
              _dv.my = _mouse.y;
              _dv.dx = _mouse.x - _dv.sx;
              _dv.dy = _mouse.y - _dv.sy;
              if (_dragItem) _dragItem.trigger("drag", _dv);
            }
          });

          o.setDragged = function (i) {
            _dragging = true;
            _dragItem = i;
          };

          o.dragMouseUp = function () {
            if (_dragItem) {
              // enddrag
              _dragItem.trigger("enddrag", _dv);
            }
            _dragging = false;
            _dragItem = null;
          };

          o.dragMouseDown = function (forceElem) {
            _mouseDown = true;
            if (_dragging) return;
            var found = false;

            if (currentDragTarget && currentDragTarget.isHovering()) {
              var e = currentDragTarget;
              // console.log("Could start drag");
              var off = e.offset();
              o.setDragged(e);
              _dv.sx = _mouse.x;
              _dv.sy = _mouse.y;
              _dv.mx = _mouse.x;
              _dv.my = _mouse.y;
              _dv.dx = 0;
              _dv.dy = 0;
              _dv.x = off.left;
              _dv.y = off.top;
              found = true;
              e.trigger("startdrag", _dv);

              return true;
            }
            return;
            // TODO: remove lines below
            var candidates = [];
            if (forceElem) {
              candidates.push(forceElem);
            } else {
              _draggableItems.forEach(function (e) {
                if (e.isHovering()) {
                  candidates.push(e);
                }
              });
              candidates.sort(function (a, b) {
                if (a.z && b.z) return b.z() - a.z();
                return 0;
              });
            }

            if (candidates[0]) {
              var e = candidates[0];
              // console.log("Could start drag");
              var off = e.offset();
              o.setDragged(e);
              _dv.sx = _mouse.x;
              _dv.sy = _mouse.y;
              _dv.mx = _mouse.x;
              _dv.my = _mouse.y;
              _dv.dx = 0;
              _dv.dy = 0;
              _dv.x = off.left;
              _dv.y = off.top;
              found = true;
              e.trigger("startdrag", _dv);

              return true;
            }
          };

          o.addEventListener(document, "mouseup", function () {
            o.dragMouseUp();
          });

          o.addEventListener(document, "mousedown", function (e) {
            if (o.dragMouseDown()) {
              e = e || window.event;
              if (e.stopPropagation) e.stopPropagation();
              if (e.preventDefault) e.preventDefault();
              e.cancelBubble = true;
              e.returnValue = false;
            }
          });

          o.draggable = function (e) {
            _draggableItems.push(e);
            e.isHovering();

            var me = e;

            e.touchevents();
            e.on("touchstart", function () {

              var off = me.offset();

              var t = e.touch(0);
              _dv.sx = t.startX;
              _dv.sy = t.startY;
              _dv.dx = 0;
              _dv.dy = 0;
              _dv.mx = t.startX;
              _dv.my = t.startY;
              _dv.x = t.startX - off.left;
              _dv.y = t.startY - off.top;
              _dragging = true;
              e.trigger("startdrag", _dv);
            });
            e.on("touchmove", function () {

              var t = e.touch(0);
              _dv.dx = t.dx;
              _dv.dy = t.dy;
              _dv.mx = t.startX + t.dx;
              _dv.my = t.startY + t.dy;
              _dragging = true;
              e.trigger("drag", _dv);
              //e.trigger("msg", "got touchmove 3");
            });
            e.on("touchend", function () {

              var t = e.touch(0);
              _dv.dx = t.dx;
              _dv.dy = t.dy;
              _dv.mx = t.startX + t.dx;
              _dv.my = t.startY + t.dy;
              e.trigger("enddrag", _dv);
              _dragging = false;
            });
          };

          return o;
        })();

        return _eg;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (elemName, into, childConstructor) {

        var argList = Array.prototype.slice.call(arguments);

        var res = this._constrArgs(argList);

        this.initAsTag.apply(this, [res.elemName, res.attrs, res.constr, res.data]);

        // this.initAsTag(elemName, into, childConstructor);
        /*
        res.elemName
        res.classStr
        res.data
        res.stream
        res.attrs
        res.constr
        */
      });

      /**
       * @param float elemName
       * @param float into
       * @param float childConstructor
       * @param float elemStateData
       */
      _myTrait_.initAsTag = function (elemName, into, childConstructor, elemStateData) {

        if (this.isObject(elemName)) {
          this._dom = elemName;
          elemName = this._dom.tagName;

          if (elemName == "input") {
            if (this._dom.getAttribute("type") == "checkbox") {
              elemName = "checkbox";
            }
          }

          // ---- might be DOM object...
        } else {
          if (elemName && elemName.charAt) {
            if (elemName.charAt(0) == "#") {

              var ee = document.getElementById(elemName.substring(1));
              if (ee) {
                elemName = ee.tagName;
                this._dom = ee;
              }
            }
          }
        }

        this._attributes = {};

        var const_fn;
        if (this.isFunction(into)) const_fn = into;
        if (this.isFunction(childConstructor)) const_fn = childConstructor;

        if (!_registry) {
          _registry = {};
        }

        if (!elemName) elemName = "div";

        var addClass;
        var pts = elemName.split("."); // => has classname?
        if (pts[1]) {
          elemName = pts[0];
          addClass = pts[1];
        }

        if (!_eg) {
          this.initElemNames();
          _eg = _ee_ = this.globalState();
          _svgElems = {
            "circle": "true",
            "rect": true,
            "path": true,
            "svg": true,
            "image": true,
            "line": true,
            "text": true,
            "tspan": true,
            "g": true,
            "pattern": true,
            "polygon": true,
            "polyline": true,
            "clippath": true,
            "defs": true,
            "feoffset": true,
            "femerge": true,
            "femergenode": true,
            "fegaussianblur": true,
            "filter": true
          };
        }
        var svgNS = "http://www.w3.org/2000/svg";
        var origElemName = elemName;
        var hasCustom;
        elemName = elemName.toLowerCase();

        if (!_elemNames[elemName] && !_svgElems[elemName]) {
          // custom element, this may be a polymer element or similar
          hasCustom = this._findCustomElem(origElemName);

          if (hasCustom) {
            this._customElement = hasCustom;
            if (this.isObject(into)) {
              this._customAttrs = into; // second attribute { title : name } etc.
            } else {
              this._customAttrs = {};
            }
            elemName = hasCustom.tagName || "div";
          }
        }

        if (!_screenInit) {
          this.initScreenEvents();
          _screenInit = true;
        }

        if (_svgElems[elemName]) {
          this._svgElem = true;
          this._svg = true;
        }

        //
        this._type = elemName;
        this._tag = elemName.toLowerCase();
        if (this._type == "checkbox") {
          this._checked = false;
          this._tag = "input";
        }
        this._children = [];

        if (elemName == "svg") this._svg = true;

        if (!this._dom) {
          if (elemName == "svg") {
            this._dom = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            // xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink"
            this._dom.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            this._dom.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
          } else {
            if (this._svgElem) {
              this._dom = document.createElementNS(svgNS, origElemName);
            } else {
              this._dom = document.createElement(this._tag);
            }
          }
        }

        // jQuery emulation might be removed...
        this.q = new _qc(this._dom, this);

        if (this._svg) this._svgAttributes = {};

        if (this._type == "checkbox") {
          this.q.attr("type", "checkbox");
        }
        if (!this._svg && addClass) this.addClass(addClass);

        if (!this._component && into) {
          if (typeof into.appendChild != "undefined") into.appendChild(this._dom);
        }

        if (hasCustom) {
          this._initCustom(this, hasCustom, null, this._customAttrs || {}, elemStateData);
        }

        if (this.isFunction(const_fn)) {
          if (this._uiWaitProm) {
            var me = this;
            this._uiWaitProm.then(function () {
              if (me._contentObj) {
                const_fn.apply(me._contentObj, [me._contentObj]);
              } else {
                const_fn.apply(me, [me]);
              }
            });
          } else {
            if (this._contentObj) {
              const_fn.apply(this._contentObj, [this._contentObj]);
            } else {
              const_fn.apply(this, [this]);
            }
          }
        }
      };

      /**
       * @param float t
       */
      _myTrait_.initElemNames = function (t) {
        if (_elemNames) return;
        _elemNamesList = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "sampe", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];
        _elemNames = {};
        _elemNamesList.forEach(function (n) {
          _elemNames[n] = true;
        });

        var me = this;
        _elemNamesList.forEach(function (en) {
          var o = {};
          o[en + "End"] = function () {
            return this.parent();
          };
          me.extendAll(o);
        });
      };

      /**
       * @param float name
       * @param float classDef
       */
      _myTrait_.registerComponent = function (name, classDef) {

        if (!_registry[name]) {
          _registry[name] = classDef;
        }
      };
    })(this);
  };

  var _e = function _e(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof _e) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != _e._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new _e(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  _e._classInfo = {
    name: "_e"
  };
  _e.prototype = new _e_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["_e"] = _e;
      this._e = _e;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["_e"] = _e;
    } else {
      this._e = _e;
    }
  }).call(new Function("return this")());

  if (typeof define !== "undefined" && define !== null && define.amd != null) {
    define(__amdDefs__);
  }
}).call(new Function("return this")());

// should we have named styles... perhaps... TODO

// TODO: error handling postMessage("no instance found");

// --> might send the message back to the worker
// TODO: send msg back