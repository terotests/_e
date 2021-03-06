# _e - UI component library

NOTE: This is just early release of this version, bugs may appear.

This a simplified, data-agnostic version of the _e -UI library. It promotes creating
UI views in functional style so that each view is creates from a function receiving the data it should be using as a paramters.

Views can also be nested in infinite amount.

- [View push/pop Demo] (http://jsfiddle.net/55yxzuy4/)
- [Twitter Bootstrap Demo] (http://jsfiddle.net/kx9sdj3g/)
- [Functional views Demo] (http://jsfiddle.net/vbyssjmq/)


# Basics

Views are creates from nested objects using composing operations like `add` 
``` javascript
  var myDiv = _e(document.body).div();
  var childDiv = myDiv.div(); // creates a child div under the parent
```

When you have the object, you can add subvies to it with functional approach like this

``` javascript
    myDiv.ol(function(e) {
        e.li().text("One");
        e.li().text("Two");
        e.li().text("Three"); // e can be "this" for the same
    }); 
```

You can also create elements which are not binded to any DOM element like this:
``` javascript
  var mySpan = _e("span").text("Hello"); // creates a SPAN with no parent
```

The element can be added later to the main DOM tree
``` javascript
  myDiv.add( mySpan );
```

It is possible to just create a nested element and store it to variable for later use
``` javascript
  var parent = _e(); // creates a DIV
  var child = parent.div(); // new nested div
```

Setting attributes and classes can be done using  `attr` or `addClass` 

``` javascript
  var myInput = _e("input").attr( {
        "type" : "color"
  }).addClass("basicInput");
```

or with arguments

``` javascript
  myDiv.input("bacicInput", {
        "type" : "color"
  });
```

## Building views with pseudo -HTML style

You can also build views using this kind of view marking:

``` javascript
main = _e(document.body).div();
main.h1()
        .span().text("Hello")
        .spanEnd()
    .h1End()
    .ol()
        .li()
            .text("moro")
        .liEnd()
        .li()
            .span()
                .text("Hello")
            .spanEnd()
        .liEnd()
    .olEnd();

```

http://jsfiddle.net/w981roh0/


# Functional view creation

The most simple way of creating a view is just to have a function which returns the view object like this
``` javascript
  var someViewFunction( name ) {
    var view = _e();
    // Create the view here with any elements it is using
    view.h1().text("Hello "+name);
    return view;
  }
```

After that you can just `add()` the item to the main DOM.

``` javascript
  myDiv.add( someViewFunction("World") ); // gets the object
```

You can also create a new view using constructor functions like this

``` javascript
  myDiv.div( function(newDiv) {
       // manipulate the "newDiv" here
  });
```

Different ways of creating views are collected here

http://jsfiddle.net/vbyssjmq/

# Creating a view with polymer 

http://codepen.io/teroktolonen/full/WQoebR

# Using with tree views

Examples:

* http://jsfiddle.net/d45mggv6/

# AJAX commands

## post

Sends data as POST variables and gets a string from server

```javascript
var main = _e(document.body);
main.post("someUrl", {
   cmd : "login"
}, function(resultAsJson) {
    // success
}, function() {
    // fail
});

```

## postJSON

Sends data as JSON and parses the returned JSON to Object.

```javascript
var main = _e(document.body);
main.postJSON("someUrl", {
   cmd : "login"
}, function(resultAsJson) {
    // success
}, function() {
    // fail
});

```

## Hooking

Hooking to AJAX call is useful if you want to emulate the server behaviour on client.

```javascript
var main = _e(document.body);
main.ajaxHook("someUrl", function(data) {
    if(data.cmd=="test") {
      return {
         userid : 100,
         success : true
      }      
    }
   if(data.cmd=="login") {
      return {
         userid : 100,
         success : true
      }      
    }
});
main.postJSON("someUrl", {
   cmd : "login"
}, function() {
    // success
}, function() {
    // fail
});

```

## File Upload Hook

http://jsfiddle.net/s3whz24s/2/

```javascript

var main = _e(document.body);
var uploader = main.createUploader({
    testTraditional : false,
    images : true,
    autoupload : false,
    uploadSpeed : 10,
    url : "http://localhost:7777/upload/",
    done: function(r) {
        console.log(r);
    },
    progress : function(info) {
        progress.text(JSON.stringify(info));
    }, 
    vars : {
        fileInformation : "Extra playload carried"
    },
    onSelectFile : function(file) {
        if(file.type.indexOf("image")>=0) {
            tnList.clear();
            tnList.fileObjectThumbnail( 100,100,file );
        }
    }
});

main.uploadHook("http://localhost:7777/upload/", function(data) {
    console.log(data);
    data.files.forEach( 
        function(file) {
            uploads.fileObjectThumbnail( 100,100,file );
        });    
})
```
# Binding to Mosh models

http://jsfiddle.net/LLpa17gL/

Mosh is of course outside dependency, it is not mandatory to use it but it can help.

```javascript
var main = _e(document.body);

var model = _data({ text : "Hello world"});
input = main.input().bind(model, "text");
```

The default is to bind to either to textContent or value of the input.

You can also override the default binding if you wish

```javascript
var main = _e(document.body);

var model = _data({ text : "Hello world"});
input = main.input().bind(model, "text", function(newValue) {
     this.val( "Got this from outside "); 
});
```


# View factories

A new undocumented feature, tests are here:

* http://jsfiddle.net/yu3wjjwa/
* simple navigation http://jsfiddle.net/30jag1uq/2/

## using with _data

http://jsfiddle.net/s5wzww3e/

```javascript
var main = _e(document.body);

// create the basic layout for the page
main.createLayout("standard", function() {
    var o = _e();
    o.div("top")
    o.div("top2")
    o.div("content");
    return o;
});
main.setLayout("standard");

// view factory to show aribatry mosh object
main.viewFactory("showObject", function(id) {
    var o = _e().addClass("container");
    var data = _data(id);
    data.then(     
        function() {
            o.pre().text("page ID was "+id);
            o.h1().bind(data, "title");
            o.p().bind(data, "content");
        });
    return o;
});

// navigation for the items...
main.viewFactory("topNavi", function(id) {
    var o = _e().addClass("topNavi");
    var activeBtn;
    // create the mosh data to use for creating the navigation
    var data = _data([
        { title : "First Page", content : "Some content for the first page" },
        { title : "Second Page", content : "Some content for the Second page" }
    ]);
    data.then( 
        function() {
            o.div().mvc( data, function(item) {
                var btn = _e("button");
                btn.span().bind(item, "title");
                btn.on("click",function() {
                    if(activeBtn) activeBtn.removeClass("selected");
                    o.pushTo("content", "showObject", item.getID());
                    activeBtn = btn;
                    btn.addClass("selected");
                });
                return btn;
            });          
        });

    return o;
});
main.pushTo("top", "topNavi");
```

# Role based view factories

Demo: http://jsfiddle.net/Lsczxqdf/1/

The view factories can be also role-specific. To create a view for a role use syntax
``` javascript
    myDiv.viewFactory("rolename", "viewname", function() {
        var o = _e();
        // create the view here, 
        return o;
    });
```
The default role is `default`. For setting up certain role call
``` javascript
    myDiv.setRole("admin");
```

Example switching roles between "admin" and "user" :

``` javascript
    var main = _e(document.body).div();
    var tools = main.div();
    var myDiv = main.div();
    
    myDiv.layout("top 100% | content 100%");
    
    myDiv.viewFactory("admin", "testView", function() {
        var o = _e();
        o.div().text("Admin view");
        return o;
    });
    myDiv.viewFactory("admin", "topNavi", function() {
        var o = _e();
        o.div().text("Admin top navigation");
        return o;
    })        
    myDiv.viewFactory("user", "testView", function() {
        var o = _e();
        o.div().text("User view");
        return o;            
    });
    myDiv.viewFactory("user", "topNavi", function() {
        var o = _e();
        o.div().text("User top navigation");
        return o;
    })          
    myDiv.setRole("user");
    myDiv.pushTo("top", "topNavi");
    myDiv.pushTo("content", "testView");
    
    tools.button().text("admin").on("click", function() {
        myDiv.setRole("admin"); 
    });
    tools.button().text("user").on("click", function() {
        myDiv.setRole("user"); 
    });
```
# Avoiding local scope pollution

Better and more readable structure can be achieved using functions as constructor parameters. The
constructor gets the newly created element set to it´s `this` parameter and as the first parameter to the constructor function.

``` javascript
myDiv.ol(function(e) {
    e.li().text("One");
    e.li().text("Two");
    e.li().text("Three"); // e can be "this" for the same
}); 
```

SVG example comparing the approaches can be found here http://jsfiddle.net/fwsx6mv0/

# File uploader

``` javascript
var main = _e(document.body).div(),
    progress = main.pre();
var uploader = main.createUploader({
    testTraditional : false,
    images : true,
    url : "http://localhost:7777/upload/",
    done: function(r) {
        console.log(r);
    },
    progress : function(info) {
        progress.text(JSON.stringify(info));
    }, 
    vars : {
        hello : "world!"
    }
});

main.add(uploader);
main.div().button().text("Upload").on("click", function() {
    uploader.trigger("upload");
});
```

# Controllers and Routers

Example is here

http://jsfiddle.net/rhextnhs/


# Creating views

Elements can create subviews using

``` javascript
 elem.pushView( someOtherView );  
 
```

And restore the view using

``` javascript
 elem.popView( );  
 
```

The animation attribute for the view is `viewIn` and out `viewOut` the animation is assumed to take 0.4 seconds where 0.2 seconds is reserved for fading out / in.

The default animations are created like this and you can change them

``` javascript
var outPosition = {
    "transform" : "translate(-2000px,0px)"
};

var inPosition = {
    "transform" : "translate(0,0)",
};

css().animation("viewOut", {
    duration : "0.4s",
    "iteration-count" : 1,
},  inPosition,  0.5, outPosition, outPosition); 

css().animation("viewIn", {
    duration : "0.4s",
    "iteration-count" : 1,
},  outPosition, 0.5, inPosition, inPosition); 
 
```

# Using with Bacon.js

The inputs can be transformed to streams usin `toBacon()` like this

``` javascript
 // create a stream of color values
 var colorStream = m.div().input({type:"color", value :"#ff4433"}).toBacon();
```
The stream can be consumed by elements ( with certain restrictions at the moment), currently available are
 - attributes
 - text values
 - HTML content
 - class -names
 - string values with template function `str` 

For example, SVG rect element could consume the fill value like this:

``` javascript
myDiv.svg({ width : 150, height:150}).g().rect({
    x : 10, y : 10, width:100, height : 100,
    fill : colorStream // consumes values from the colorStream
});
```
- [Gradient Editor example] (http://jsfiddle.net/feho44zb/1/)
- [SVG Editor example is here] (http://jsfiddle.net/90u23ryx/1/)

If you want to handle events manually, you can use `bacon()` -function ( this may be changed to baconEvent) 

``` javascript
// create input and the results as Bacon.js stream.
var myDiv = _e("#res");
myDiv.input().bacon("keydown")
   .onValue( function(event) {
     myDiv.div().text(event.target.value);
  });
```

## Converting any view to stream

Any ui view can be converted to Bacon.js stream using `toBacon()` function. 

The component can then send any values to the resulting stream using `val( newValue )` function.
Example can be found here.

http://jsfiddle.net/w0g9193a/

## Template function "str"

You can combine strings from streaming values using `str` -function

``` javascript
var myInput = _e("input");
var myStream = myInput.toBagon();

// combine the input and stream into single sting value
var myDiv.text( _e().str( "The value is ", myStream ) );
```



# Drag and Drop

You can get information about drag -events on the elements, however it is up to you to actually move the items on the screen, the way you see best fit.

The basic callback has format

``` javascript
elem.drag(function(dragInfo) {
   // do something here with dragInfo
});
```

The object "dragInfo" has following format:

``` javascript
{"sx":0,        // start coordinates of the dragged element
 "sy":0,
 "dx":100,      // dx,dy number of pixels drag has moved
 "dy":129,
 "x":100,       // elements calculated x,y
 "y":129,       
 "start":false, // drag has just started
 "end":true,     // drag has ended
 "item" : obj    // item which is dragged
}
```

## Drag as Bacon.js Stream

If you want more control over the drag events you can subscript to the drag as Bacon.js
stream (requires the library)

``` javascript
elem.baconDrag().onValue(function(dragInfo) {

});
```

[Bacon.js drag demo] (http://jsfiddle.net/kmo77e5y/)

# Local Storage support

If you want some input to persist between updates, you can make them store things locally using

``` javascript
var inp = _e("input").localStore("myTestId");
```
The input will store it's value to the `myTestId` after the page reloads.

http://jsfiddle.net/kt58vqc7/


# Creating "Fiddles"

```javascript
var myDiv = _e(document.body).div();
myDiv.fiddle({
    stylesheets : [
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css",
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css"
    ],
    scripts : [
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js"
    ],
    html : "<div class='alert alert-info'>Bootstrap loaded</div>",
    jsCode : "setInterval( function() { fiddleDone('1000ms passed') }, 1000);",
    width : 300, height : 300,
    onReady : function(v) {
        alert(v);
    },
});
```
Simple Example:
http://jsfiddle.net/qfpj5su7/

Example using Bacon.js throttling the input streams with debounce() and localStore() to save the data between the edits. 
http://jsfiddle.net/drah36qf/

# Creating plugins / extending

You can add new functions all elements with extendAll.

``` javascript
var myDiv = _e();
myDiv.extendAll( {
    fancyButton : function() {
        var b = _e("button");
        b.addClass("btn btn-primary btn-group-sm");
        this.add(b);
        return b;
    }
});

myDiv.fancyButton().text("This is a fancy button");
```

# CSS namespacing

CSS can be built without Stylesheets using JavaScript objects as style mixins. 
It is possible to create code which uses no stylesheets or calculates the styles on-line.

Each element can have a namespaced CSS style object, which can be created like

``` javascript
o.css().bind("<CSSClassName>",  {
    "color"   : "black",
    "padding" : "1em"
});
```

The child elements of this node can then make use of this by adding the CSS class.

``` javascript
elem.addClass("<CSSClassName>");
```


# CSS gradients

[Demo with gradients] (http://jsfiddle.net/d9w9ky3f/)

Gradient markings are now expanded to browser -specific instructions:

``` javascript
    css().bind("button:hover", {
        "background" : "linear-gradient(#666, #333)"
    });
```

## YUV functions

For those familiar with YUV colors perhaps this demo explains it best

[Demo with gradients] (http://jsfiddle.net/9hu4w4tf/)


## Color mixing

Colors can be mixed with `.mix(color1, color2, amount)` or with `.dim(color, amount)` 

http://jsfiddle.net/ag4Lmxvv/


# CSS Effects

``` javascript
// The Effect is done here...
myDiv.createEffect("fade", 
                  { opacity : 1 }, 
                  { opacity : 0 }, 
                  {    
                         duration : 0.2
                  }); 
                 
// To enter the effect
myDiv.effectOut( "fade", function() [
   // callback after the effect has ended
});

// To restore back
myDiv.effectIn( "fade", function() {
   // callback after the effect has ended
});

```

http://jsfiddle.net/r77qk7pg/

# Components

Couple of tests

- http://jsfiddle.net/qhj458hc/3/
- Testing polymer -like styling http://jsfiddle.net/1218mqmj/2/
- Or at codepen http://codepen.io/teroktolonen/full/pjNzMx


```javascript
var main = _e(document.body);
var scopeOne = main.div();

scopeOne.customElement("pri-button", {
    css : function(myCss) {
         var btnShadow = "0 3px 10px rgba(0, 0, 0, 0.34)";       
         myCss.bind("div", {
            "display": "inline-block",
            "padding": "0.4em 0.8em",
            "position": "relative",
            "margin" : "0.3em",
            "overflow": "hidden",
            "cursor": "pointer",
            "color": "#fff",
            "background-color": "#4a89dc",
            "box-shadow" : btnShadow
        });
        myCss.animation("tryMe", {
                duration : "4s",
                "iteration-count" : 1,
            },{ transform : "rotate(0deg)"},{ transform : "rotate(360deg)"});
    },
    init : function(params, createOptions) {
        this.text(params); // do something with the params
    },
    tagName : "div"
})
scopeOne.e("pri-button", "Hello there").addClass("tryMe");
```

# Events

You can either create traditional event handler on each element like:

``` javascript
myDiv.on("click", function(elem, data) {
   
});
```

Or you can create a routing information, which will be caught by parent elements.

``` javascript
// parent element
myDiv.router("click", function(data) {
   alert(data.msg);
});
// child sending event:
var childDiv = myDiv.div().text("Say hi");
childDiv.setRoute( { msg : "Hello" });
```

Routing is more efficient, since it requires only one event -handler function.

# Using .on( ... )

You can place tradional event-handler with .on( ) 

``` javascript
myDiv.on("click", function(elem, data) {
    // elem is the elment clicked
    // data is the trigger parameter
});
// triggering manually
myDiv.trigger("click", someData);
```

# Starting by connecting to document

Finding a HTML element and creating elments under it:

``` javascript
var main = _e("#maindiv"); // search by ID
main.div().text("Hello world");
```

or you can just insert a new element under BODY

``` javascript
var content = _e(document.body).div("content");
```

## Shortcuts for elements

Most DOM -elements can be created just by calling a function of their name:

``` javascript
var main = _e("#maindiv");

// creating table
var tbl = main.table();

// creating button
var btn = main.button();

// creating input
var inp = main.input();

// creating textarea
var ta = main.textarea();

// adding row to table
tbl.addRow(1,2,3);

// creating span
var s = main.span()

// creating svg element
var svg = main.svg({ width : 300, height : 300});

// creating svg group
var g = svg.g();

// creating svg path
var path = svg.path({ d : "M26,27.5H6c-0.829,0-1.5-0.672-1.5-1.5V6c0-0.829,0.671-1.5,1.5-1.5h20c0.828,0,1.5,0.671,1.5,1.5v20C27.5,26.828,26.828,27.5,26,27.5zM7.5,24.5h17v-17h-17V24.5z"});

```



# SVG support

Since SVG elements behave in many ways like DOM elements, you can use all MVC features also to them.

To create a simple SVG icon -example with color picker:

```

var svg = _e("svg");
svg.attr({
    width : 200,
    height :300
});

svg.g().path({
    d : "<some path>"
    fill : "<some color"
});

```

# Random tests

- custon drop-down http://jsfiddle.net/xudgwhjs/
- effects http://codepen.io/teroktolonen/full/pjNzMx



# ToDo

A lot of small fixes coming

- clear up the code from global namespace pollution
- clean the event handler code
- add support for color gradients in CSS
- document more CSS examples
- document using Data libraries
- document MVC model
- document updating extensions
- document DND functionality
- SVG examples
- document onFrame handlers etc.
- SVG path add-ons

# Ideas

Generic view navi -idea : a remote or local data browser

https://gist.github.com/terotests/c052b5abc841ca91cb19

# License

MIT. Currently use at own risk.

























   

 


   
#### Class _e


- [__promiseClass](README.md#_e___promiseClass)
- [__singleton](README.md#_e___singleton)
- [_classFactory](README.md#_e__classFactory)
- [_constrArgs](README.md#_e__constrArgs)
- [_isStdElem](README.md#_e__isStdElem)
- [extendAll](README.md#_e_extendAll)
- [getComponentRegistry](README.md#_e_getComponentRegistry)
- [getElemNames](README.md#_e_getElemNames)

- [initAsTag](README.md#_e_initAsTag)
- [initElemNames](README.md#_e_initElemNames)
- [registerComponent](README.md#_e_registerComponent)



   
    
##### trait Node ordering

- [add](README.md#_add)
- [addItem](README.md#_addItem)
- [clear](README.md#_clear)
- [insertAfter](README.md#_insertAfter)
- [insertAt](README.md#_insertAt)
- [insertBefore](README.md#_insertBefore)
- [moveDown](README.md#_moveDown)
- [moveUp](README.md#_moveUp)
- [parent](README.md#_parent)
- [prepend](README.md#_prepend)
- [reIndex](README.md#_reIndex)
- [remove](README.md#_remove)
- [removeChild](README.md#_removeChild)
- [removeChildEvents](README.md#_removeChildEvents)
- [removeIndexedChild](README.md#_removeIndexedChild)
- [replaceWith](README.md#_replaceWith)


    
    
    
##### trait TouchEvents

- [baconDrag](README.md#_baconDrag)
- [drag](README.md#_drag)
- [draggable](README.md#_draggable)
- [mousePos](README.md#_mousePos)
- [pauseEvents](README.md#_pauseEvents)
- [touch](README.md#_touch)
- [touchclick](README.md#_touchclick)
- [touchevents](README.md#_touchevents)


    
    
    
##### trait Dimensions

- [absolute](README.md#_absolute)
- [baseZ](README.md#_baseZ)
- [box](README.md#_box)
- [height](README.md#_height)
- [offset](README.md#_offset)
- [pxParam](README.md#_pxParam)
- [relative](README.md#_relative)
- [width](README.md#_width)
- [x](README.md#_x)
- [y](README.md#_y)
- [z](README.md#_z)


    
    
    
##### trait CSSTransform

- [_resetProjection](README.md#__resetProjection)
- [compStyle](README.md#_compStyle)
- [createEffect](README.md#_createEffect)
- [css](README.md#_css)
- [effectIn](README.md#_effectIn)
- [effectOut](README.md#_effectOut)
- [findScreen](README.md#_findScreen)
- [findTransform](README.md#_findTransform)
- [hide](README.md#_hide)
- [setProjectionScreen](README.md#_setProjectionScreen)
- [setTransformMatrix](README.md#_setTransformMatrix)
- [show](README.md#_show)
- [style](README.md#_style)
- [styleString](README.md#_styleString)
- [updateTransFromMatrix](README.md#_updateTransFromMatrix)


    
    
    
##### trait Table

- [addRow](README.md#_addRow)


    
    
    
##### trait Iteration

- [child](README.md#_child)
- [childCount](README.md#_childCount)
- [forChildren](README.md#_forChildren)
- [forEach](README.md#_forEach)
- [searchTree](README.md#_searchTree)


    
    
    
##### trait DomClass

- [addClass](README.md#_addClass)
- [findPostFix](README.md#_findPostFix)
- [hasClass](README.md#_hasClass)
- [removeClass](README.md#_removeClass)


    
    
    
##### trait events

- [_alwaysTouchclick](README.md#__alwaysTouchclick)
- [bacon](README.md#_bacon)
- [bindSysEvent](README.md#_bindSysEvent)
- [delegate](README.md#_delegate)
- [eventBinder](README.md#_eventBinder)
- [isHovering](README.md#_isHovering)
- [namedListener](README.md#_namedListener)
- [on](README.md#_on)
- [removeAllHandlers](README.md#_removeAllHandlers)
- [removeListener](README.md#_removeListener)
- [trigger](README.md#_trigger)
- [uniqueListener](README.md#_uniqueListener)


    
    
    
##### trait Table

- [bind](README.md#InputHandling_bind)
- [bindVal](README.md#InputHandling_bindVal)
- [blur](README.md#InputHandling_blur)
- [checked](README.md#InputHandling_checked)
- [focus](README.md#InputHandling_focus)
- [toBacon](README.md#InputHandling_toBacon)
- [val](README.md#InputHandling_val)


    
    
    
    
    
##### trait domShortcuts

- [_addCustomTagFn](README.md#domShortcuts__addCustomTagFn)
- [_initShortcuts](README.md#domShortcuts__initShortcuts)
- [attr](README.md#domShortcuts_attr)
- [canvas](README.md#domShortcuts_canvas)
- [checkbox](README.md#domShortcuts_checkbox)
- [clearCanvas](README.md#domShortcuts_clearCanvas)
- [ctx](README.md#domShortcuts_ctx)
- [e](README.md#domShortcuts_e)
- [row](README.md#domShortcuts_row)
- [shortcutFor](README.md#domShortcuts_shortcutFor)
- [src](README.md#domShortcuts_src)
- [toDataURL](README.md#domShortcuts_toDataURL)


    
    
    
##### trait domContent

- [_setDomText](README.md#domContent__setDomText)
- [html](README.md#domContent_html)
- [text](README.md#domContent_text)


    
    
    
##### trait viewsNavis

- [fiddle](README.md#viewsNavis_fiddle)
- [initScreenEvents](README.md#viewsNavis_initScreenEvents)
- [onMediaChange](README.md#viewsNavis_onMediaChange)
- [popView](README.md#viewsNavis_popView)
- [pushTo](README.md#viewsNavis_pushTo)
- [pushView](README.md#viewsNavis_pushView)
- [scrollTo](README.md#viewsNavis_scrollTo)


    
    
    
##### trait mvc_trait

- [_findSendHandler](README.md#mvc_trait__findSendHandler)
- [clickTo](README.md#mvc_trait_clickTo)
- [createItemView](README.md#mvc_trait_createItemView)
- [data](README.md#mvc_trait_data)
- [forwardData](README.md#mvc_trait_forwardData)
- [fromStream](README.md#mvc_trait_fromStream)
- [getViewFunction](README.md#mvc_trait_getViewFunction)
- [model](README.md#mvc_trait_model)
- [mvc](README.md#mvc_trait_mvc)
- [onMsg](README.md#mvc_trait_onMsg)
- [send](README.md#mvc_trait_send)
- [sendHandler](README.md#mvc_trait_sendHandler)
- [sendMsg](README.md#mvc_trait_sendMsg)


    
    
    
##### trait svgShortcuts

- [circle](README.md#svgShortcuts_circle)
- [defs](README.md#svgShortcuts_defs)
- [feGaussianBlur](README.md#svgShortcuts_feGaussianBlur)
- [feMerge](README.md#svgShortcuts_feMerge)
- [feMergeNode](README.md#svgShortcuts_feMergeNode)
- [feOffset](README.md#svgShortcuts_feOffset)
- [filter](README.md#svgShortcuts_filter)
- [g](README.md#svgShortcuts_g)
- [image](README.md#svgShortcuts_image)
- [line](README.md#svgShortcuts_line)
- [path](README.md#svgShortcuts_path)
- [rect](README.md#svgShortcuts_rect)
- [svg](README.md#svgShortcuts_svg)
- [svg_text](README.md#svgShortcuts_svg_text)
- [tspan](README.md#svgShortcuts_tspan)


    
    
    
##### trait util_fns

- [guid](README.md#util_fns_guid)
- [isArray](README.md#util_fns_isArray)
- [isFunction](README.md#util_fns_isFunction)
- [isObject](README.md#util_fns_isObject)
- [isStream](README.md#util_fns_isStream)
- [str](README.md#util_fns_str)
- [whenLoaded](README.md#util_fns_whenLoaded)


    
    
    
    
    
    
    
##### trait colors_trait

- [colorMix](README.md#_colorMix)
- [colorToHex](README.md#_colorToHex)
- [colourNameToHex](README.md#_colourNameToHex)
- [componentToHex](README.md#_componentToHex)
- [dim](README.md#_dim)
- [hexToRgb](README.md#_hexToRgb)
- [hexToYuv](README.md#_hexToYuv)
- [mix](README.md#_mix)
- [rgbToHex](README.md#_rgbToHex)
- [rgbToYuv](README.md#_rgbToYuv)
- [toRGB](README.md#_toRGB)
- [toRSpace](README.md#_toRSpace)
- [yuvConversion](README.md#_yuvConversion)
- [yuvConversion2](README.md#_yuvConversion2)
- [yuvPixelConversion](README.md#_yuvPixelConversion)
- [yuvToRgb](README.md#_yuvToRgb)


    
    
    
##### trait ajax_methods

- [_httpsend](README.md#__httpsend)
- [_initAjax](README.md#__initAjax)
- [_traditionalUpload](README.md#__traditionalUpload)
- [ajaxHook](README.md#_ajaxHook)
- [appendToHead](README.md#_appendToHead)
- [createUploader](README.md#_createUploader)
- [fileObjectThumbnail](README.md#_fileObjectThumbnail)
- [get](README.md#_get)
- [getJSON](README.md#_getJSON)
- [post](README.md#_post)
- [postJSON](README.md#_postJSON)
- [uploadHook](README.md#_uploadHook)


    
    
    
##### trait web_comp

- [_findComp](README.md#__findComp)
- [_findCustomElem](README.md#__findCustomElem)
- [_initCustom](README.md#__initCustom)
- [composite](README.md#_composite)
- [createClass](README.md#_createClass)
- [customElement](README.md#_customElement)
- [getRegisteredClasses](README.md#_getRegisteredClasses)
- [modifyCss](README.md#_modifyCss)
- [props](README.md#_props)
- [ref](README.md#_ref)
- [registerElement](README.md#_registerElement)
- [state](README.md#_state)


    
    
    
##### trait web_worker

- [_baseWorker](README.md#__baseWorker)
- [_callObject](README.md#__callObject)
- [_callWorker](README.md#__callWorker)
- [_createWorker](README.md#__createWorker)
- [_createWorkerClass](README.md#__createWorkerClass)
- [_createWorkerObj](README.md#__createWorkerObj)
- [_serializeClass](README.md#__serializeClass)
- [_workersAvailable](README.md#__workersAvailable)


    
    
    
##### trait diff_patch

- [doReact](README.md#_doReact)
- [patchWith](README.md#_patchWith)


    
    


   
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
            
#### Class _qc


- [attr](README.md#_qc_attr)
- [bindSysEvent](README.md#_qc_bindSysEvent)
- [blur](README.md#_qc_blur)
- [css](README.md#_qc_css)
- [focus](README.md#_qc_focus)
- [get](README.md#_qc_get)
- [pxParam](README.md#_qc_pxParam)



   


   



      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
            
#### Class later


- [_easeFns](README.md#later__easeFns)
- [add](README.md#later_add)
- [addEasingFn](README.md#later_addEasingFn)
- [after](README.md#later_after)
- [asap](README.md#later_asap)
- [ease](README.md#later_ease)
- [every](README.md#later_every)
- [once](README.md#later_once)
- [onFrame](README.md#later_onFrame)
- [removeFrameFn](README.md#later_removeFrameFn)



   


   



      
    
      
            
#### Class css


- [_assign](README.md#css__assign)
- [_classFactory](README.md#css__classFactory)
- [animation](README.md#css_animation)
- [animSettings](README.md#css_animSettings)
- [assign](README.md#css_assign)
- [bind](README.md#css_bind)
- [buildCss](README.md#css_buildCss)
- [collectAnimationCss](README.md#css_collectAnimationCss)
- [convert](README.md#css_convert)
- [forMedia](README.md#css_forMedia)
- [forRules](README.md#css_forRules)
- [initConversions](README.md#css_initConversions)
- [makeCss](README.md#css_makeCss)
- [mediaFork](README.md#css_mediaFork)
- [ruleToCss](README.md#css_ruleToCss)
- [updateStyleTag](README.md#css_updateStyleTag)



   
    
##### trait _dataTrait

- [guid](README.md#_dataTrait_guid)
- [isArray](README.md#_dataTrait_isArray)
- [isFunction](README.md#_dataTrait_isFunction)
- [isObject](README.md#_dataTrait_isObject)


    
    


   
      
    



      
    
      
    
      
    
      
    
      
    
      
    





   
# Class _e


The class has following internal singleton variables:
        
* _eg
        
* _ee_
        
* guid
        
* _screenInit
        
* _svgElems
        
* _registry
        
* _elemNames
        
* _hasRemoted
        
* _elemNamesList
        
        
### <a name="_e___promiseClass"></a>_e::__promiseClass(t)

Will return the Promise class implementation, if available
*The source code for the function*:
```javascript
var p;
if(typeof(_promise) != "undefined") p = _promise;
if(!p && typeof(Promise) != "undefined") p = Promise;
return p;
```

### <a name="_e___singleton"></a>_e::__singleton(t)


*The source code for the function*:
```javascript
return _eg;
```

### <a name="_e__classFactory"></a>_e::_classFactory(elemName, into)


*The source code for the function*:
```javascript

if(elemName) {
    if(_registry && _registry[elemName]) {
        var classConst = _registry[elemName];
        return new classConst(elemName, into);
    }
}

```

### <a name="_e__constrArgs"></a>_e::_constrArgs(args)

Parse element constructor argumens, typically: elementName, attributes, constructor function and custom data.
*The source code for the function*:
```javascript
// var args = Array.prototype.slice.call(arguments);

var res = {}, me = this;

res.elemName = args.shift();
/*
res.elemName
res.classStr
res.data
res.stream
res.attrs
res.constr
*/

args.forEach( function( a, i ) {
    
    if(typeof a == "string" ) {
        res.classStr = a;
        return;
    }
    if(me.isObject( a ) && me.isFunction(a.getID) ) {
        res.data = a;
        return;
    }      
    if(me.isStream( a ) ) {
        res.stream = a;
        return;
    }  
    if(me.isObject( a ) && (!me.isFunction( a )) ) {
        res.attrs = a;
        return;
    }  
    if(me.isFunction( a ) ) {
        res.constr = a;
        return;
    }     
});
return res;
```

### <a name="_e__isStdElem"></a>_e::_isStdElem(name)


*The source code for the function*:
```javascript
return _elemNames[name];
```

### <a name="_e_extendAll"></a>_e::extendAll(name, fn)


*The source code for the function*:
```javascript

if(this.isObject(name)) {
    
    for( var n in name ) {
        if(name.hasOwnProperty(n)) this.extendAll( n, name[n]);
    }
    
    return this;
}

if(!_myTrait_[name]) {
    _myTrait_[name] = fn;
}
return this;
```

### <a name="_e_getComponentRegistry"></a>_e::getComponentRegistry(t)


*The source code for the function*:
```javascript
return _registry;
```

### <a name="_e_getElemNames"></a>_e::getElemNames(t)


*The source code for the function*:
```javascript
return _elemNamesList;
```

        
### _e::constructor( elemName, into, childConstructor )

```javascript

var argList = Array.prototype.slice.call(arguments);

var res = this._constrArgs( argList );

this.initAsTag.apply( this, [res.elemName, res.attrs, res.constr, res.data] );

// this.initAsTag(elemName, into, childConstructor);
/*
res.elemName
res.classStr
res.data
res.stream
res.attrs
res.constr
*/

```
        
### <a name="_e_initAsTag"></a>_e::initAsTag(elemName, into, childConstructor, elemStateData)


*The source code for the function*:
```javascript

if(this.isObject(elemName)) {
    this._dom = elemName;
    elemName = this._dom.tagName;
    
    if(elemName=="input") {
        if(this._dom.getAttribute("type")=="checkbox") {
            elemName = "checkbox";
        }
    }
    
    // ---- might be DOM object...
} else {
   if(elemName && elemName.charAt) {
       if(elemName.charAt(0)=="#") {

           var ee = document.getElementById(elemName.substring(1));
           if(ee) {
               elemName = ee.tagName;
               this._dom = ee;
           }
       }
   }
}

this._attributes = {};

var const_fn;
if(this.isFunction(into)) const_fn = into;
if(this.isFunction(childConstructor)) const_fn = childConstructor;

if(!_registry) {
    _registry = {};
}

if(!elemName) elemName = "div";

var addClass;
var pts = elemName.split("."); // => has classname?
if(pts[1]) {
    elemName = pts[0];
    addClass = pts[1];
}

if(!_eg) {
    this.initElemNames();
    _eg = _ee_ = this.globalState();
    _svgElems = {
        "circle" : "true",
        "rect" : true,
        "path" : true,
        "svg" : true,
        "image" : true,
        "line" : true,
        "text" : true,
        "tspan" : true,
        "g" : true,
        "pattern" : true,
        "polygon" : true,
        "polyline" : true,
        "clippath" : true,
        "defs" : true,
        "feoffset" : true,
        "femerge":true,
        "femergenode":true,
        "fegaussianblur" : true,
        "filter" : true
    }
    
}
var svgNS = "http://www.w3.org/2000/svg";  
var origElemName = elemName;
var hasCustom;
elemName = elemName.toLowerCase()

if(!_elemNames[elemName] && !_svgElems[elemName] ) {
    // custom element, this may be a polymer element or similar
    hasCustom = this._findCustomElem( origElemName );
    
    if(hasCustom) {
        this._customElement = hasCustom;
        if(this.isObject(into)) {
            this._customAttrs = into; // second attribute { title : name } etc.
        } else {
            this._customAttrs = {};
        }
        elemName = hasCustom.tagName || "div";
    }
}

if(!_screenInit) {
    this.initScreenEvents();
    _screenInit = true;
}

if(_svgElems[elemName]) {
    this._svgElem = true;
    this._svg = true;
}

// 
this._type = elemName;
this._tag = elemName.toLowerCase();
if(this._type=="checkbox") {
    this._checked = false;
    this._tag = "input";
}
this._children = [];

if(elemName == "svg") this._svg = true;

if(!this._dom) {
    if(elemName == "svg") {
        this._dom = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink"
        this._dom.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        this._dom.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    } else {
        if(this._svgElem) {
            this._dom = document.createElementNS(svgNS, origElemName);
        } else {
            this._dom = document.createElement(this._tag);
        }
    }
}

// jQuery emulation might be removed...
this.q = new _qc(this._dom, this);

if(this._svg) this._svgAttributes = {};

if(this._type=="checkbox") {
    this.q.attr("type","checkbox");
}
if(!this._svg && addClass) this.addClass( addClass );

if(!this._component && into) {
    if(typeof(into.appendChild)!="undefined")
        into.appendChild(this._dom);
}

if(hasCustom) {
    this._initCustom( this, hasCustom, null, this._customAttrs || {}, elemStateData );
}

if(this.isFunction(const_fn)) {
    if(this._uiWaitProm) {
        var me = this;
        this._uiWaitProm.then( function() {
            if(me._contentObj) {
                const_fn.apply(me._contentObj, [me._contentObj]);
            } else {
                const_fn.apply(me, [me]);
            }
        })
    } else {
        if(this._contentObj) {
            const_fn.apply(this._contentObj, [this._contentObj]);
        } else {
            const_fn.apply(this, [this]);
        }
    }
    
}

```

### <a name="_e_initElemNames"></a>_e::initElemNames(t)


*The source code for the function*:
```javascript
if(_elemNames) return;
_elemNamesList = ["a", "abbr", "acronym","address","applet","area","article","aside","audio",
"b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas",
"caption","center","cite","code","col","colgroup","datalist","dd","del","details",
"dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font",
"footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup",
"hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link",
"main","map","mark","menu","menuitem","meta","meter","nav","noframes","noscript","object",
"ol","optgroup","option","output","p","param","pre","progress","q","rp","rt","ruby",
"s","sampe","script","section","select","small","source","span","strike","strong","style",
"sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title",
"tr","track","tt","u","ul","var","video","wbr"];
_elemNames = {};
_elemNamesList.forEach( function(n) {
    _elemNames[n] = true;
})

var me = this;
_elemNamesList.forEach(function(en) {
     var o = {};
     o[en+"End"] = function() {
         return this.parent();
     }
     me.extendAll(o);
});



```

### <a name="_e_registerComponent"></a>_e::registerComponent(name, classDef)


*The source code for the function*:
```javascript

if(!_registry[name]) {
    _registry[name] = classDef;
}
```



   
    
## trait Node ordering

The class has following internal singleton variables:
        
        
### <a name="_add"></a>::add(items)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.add.apply(this._contentObj, Array.prototype.slice.call(arguments));
}
if(! (items instanceof Array) ) {
    items = Array.prototype.slice.call(arguments, 0);
}    
var me = this;
items.forEach(  function(e) {

    //
    if(me.isFunction(e)) {
        var creator = e;
        var newItem = _e();
        var res = e.apply(newItem, [me]);
        if(res) {
            e = res;
        } else {
            e = newItem;
        }
    }    
    
    if(typeof(e)=="number" || typeof(e)=="string" || !isNaN(e) ) {
        var nd = _e("span");
        nd._dom.innerHTML = e+"";
        me.add(nd);
        return me;
    }
    
    if(me.isStream(e)) {
        e.onValue( function(t) {
            me.add( t );
        });        
        return me;
    }
    
    if(typeof(e)=="undefined") return;
    
    if(typeof(e._dom)!="undefined") {
        
        if(e._parent) {
            e._parent.removeChild(e);
        }
        
        if(!me._children) {
            me._children = [];
        }
        var ii = me._children.length;
        e._index = ii;
        me._children.push(e);
        e._parent = me;
        e._svg = me._svg;

        if(e._customElement) {
            if(e._initWithDef && e._initWithDef.componentWillMount) {
                e._initWithDef.componentWillMount.apply( e, []);
            }
        }         
        
        me._dom.appendChild(e._dom);            

        if(e._customElement) {

            // disallow locally scoped elements for now...
            if(!e._initWithDef )  {          
                var reCheck, oldDef = e._customElement;
                if(e._customElement.customTag) {
                    reCheck = e._findCustomElem(e._customElement.customTag);
                }
                if(reCheck === oldDef) oldDef = null;
                var useDef = reCheck || e._customElement;
                if(!e._initWithDef || ( e._initWithDef != useDef) ) {
                    // e.clear(); // <- removed clear, should be taken care by _initCustom
                    me._initCustom( e, reCheck || e._customElement, me, e._customAttrs || {}, oldDef );
                }
            }
            if(e._initWithDef && e._initWithDef.componentDidMount) {
                e._initWithDef.componentDidMount.apply( e, []);
            }
        }        
        
        if( e._contentObj ) e._contentObj._contentParent = me;

        e.trigger("parent",me);
        me.trigger("child",e);
    }                    
});

return this;
```

### <a name="_addItem"></a>::addItem(items)


*The source code for the function*:
```javascript

var list = Array.prototype.slice.call(arguments, 0);
return this.add.apply(this, list);
```

### <a name="_clear"></a>::clear(t)

Removes all the subnodes
*The source code for the function*:
```javascript

if(this._contentObj) {
    return this._contentObj.clear.apply(this._contentObj, Array.prototype.slice.call(arguments));
}

this._children.forEach( function(c) {
    c.remove();
});
this._children = [];
while (this._dom.firstChild) {
    this._dom.removeChild(this._dom.firstChild);
}
return this;
```

### <a name="_insertAfter"></a>::insertAfter(newItem)


*The source code for the function*:
```javascript

// referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);

if(!this._parent) return;
if(!this._parent._children) return;

if(newItem==this) {
    return;
}
// var newItem = _e(a,b,c,d,e,f);
var myIndex = this._index;
var chList = this._parent._children;
if(newItem._parent && (newItem._parent!=this._parent)) {
    newItem._parent.removeChild(newItem);
    var myIndex = chList.indexOf(this);
    chList.splice(myIndex+1,0,newItem); 
    this._parent.reIndex();
} else {
    
    if(!newItem._parent) {
        newItem._parent = this._parent;
        chList.splice(myIndex+1,0,newItem);
    } else {
        var oldIndex = chList.indexOf(newItem);
        chList.splice(oldIndex,1);
        var myIndex = chList.indexOf(this);
        chList.splice(myIndex+1,0,newItem);
    }
    this._parent.reIndex();
}

var pDOM = newItem._dom;
var mDOM = this._dom;
mDOM.parentNode.insertBefore(pDOM, mDOM.nextSibling);  
```

### <a name="_insertAt"></a>::insertAt(i, obj)


*The source code for the function*:
```javascript

if(i < this._children.length) {
    var ch = this.child(i);
    ch.insertBefore(obj);
} else {
    this.add(obj);
}

```

### <a name="_insertBefore"></a>::insertBefore(newItem)
`newItem` Item to be inserted
 

Inserts a new node before an existing node
*The source code for the function*:
```javascript

if(!this._parent) return;
if(!this._parent._children) return;

if(newItem==this) {
    return;
}

// var newItem = _e(a,b,c,d,e,f);
var myIndex = this._index;
var chList = this._parent._children;

if(newItem._parent && (newItem._parent!=this._parent)) {
    newItem._parent.removeChild(newItem);
    newItem._parent = this._parent;
    var myIndex = chList.indexOf(this);
    chList.splice(myIndex,0,newItem); 
    this._parent.reIndex();
} else {
    if(!newItem._parent) {
        newItem._parent = this._parent;
        chList.splice(myIndex,0,newItem);
    } else {
        var oldIndex = chList.indexOf(newItem);
        if(oldIndex>=0) chList.splice(oldIndex,1);
        var myIndex = chList.indexOf(this);
        chList.splice(myIndex,0,newItem);
    }
    this._parent.reIndex();
}

var pDOM = newItem._dom;
var mDOM = this._dom;
       mDOM.parentNode.insertBefore(pDOM, mDOM);  

return this;       

```

### <a name="_moveDown"></a>::moveDown(t)

Moves the node down in the DOM tree
*The source code for the function*:
```javascript

if(typeof(this._index)!="undefined" && this._parent) {
    var myIndex = this._index,
        nextIndex;
    if(!this._parent) return;
    if(!this._parent._children) return;
    if(myIndex>=(this._parent._children.length-1)) return;
    
    if(this._parent._children) {

        var next = this._parent._children[myIndex+1];

        next._index--;
        this._index++;
        var chList = this._parent._children;
        
        chList.splice(myIndex+1, 0, chList.splice(myIndex, 1)[0]);
        
        var pDOM = next._dom;
        var mDOM = this._dom;
        mDOM.parentNode.insertBefore(mDOM, pDOM.nextSibling);
        
        
    }
}
```

### <a name="_moveUp"></a>::moveUp(t)

Moves the node up in the DOM tree
*The source code for the function*:
```javascript

if(this._index && this._parent) {

    var myIndex = this._index,
        nextIndex;
    if(!myIndex) return;
    if(myIndex<=0) return;
    if(this._parent._children) {

        var prev = this._parent._children[myIndex-1];
        prev._index++;
        this._index--;
        var chList = this._parent._children;
        
        chList.splice(myIndex-1, 0, chList.splice(myIndex, 1)[0]);
        
        var pDOM = prev._dom;
        var mDOM = this._dom;
        pDOM.parentNode.insertBefore(mDOM, pDOM);
        
    }
}
```

### <a name="_parent"></a>::parent(dontSkipToContParent)
`dontSkipToContParent` If set to true does not immediately skip to the parent&#39;s content parent
 


*The source code for the function*:
```javascript
if(this._contentParent) {
    return this._contentParent;
}
var p = this._parent;
if(p && p._contentParent && !dontSkipToContParent) return p._contentParent;
return p;
```

### <a name="_prepend"></a>::prepend(items)

Adds items as the first child of the current node
*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.prepend.apply(this._contentObj, Array.prototype.slice.call(arguments));
}


if(! (items instanceof Array) ) {
    items = Array.prototype.slice.call(arguments, 0);
}    
var me = this;
items.forEach(  function(e) {
    if(typeof(e)=="string") {
        me._dom.innerHTML = e;
        return me;
    }
    
    if(typeof(e)=="undefined") return;
    
    if(typeof(e._dom)!="undefined") {
        
        if(e._parent) {
            e._parent.removeChild(e);
        }
        
        if(!me._children) {
            me._children = [];
        }
        
        e._index = 0;
        me._children.unshift(e);
        e._parent = me;
        me._dom.insertBefore(e._dom, me._dom.firstChild); 
        
        var len = me._children.length;
        for(var i=0; i<len; i++) me._children[i]._index = i;
        
        e.trigger("parent",me);
        me.trigger("child",e);
    }                    
});

return this;
```

### <a name="_reIndex"></a>::reIndex(t)


*The source code for the function*:
```javascript

var chList = this._children;
var i=0, len = chList.length;
for(var i=0; i<len; i++) {
    this._children[i]._index = i;
}

```

### <a name="_remove"></a>::remove(t)

Removes the item from the DOM -tree
*The source code for the function*:
```javascript

if(this._initWithDef && this._initWithDef.componentWillUnmount) {
    this._initWithDef.componentWillUnmount.apply( this, []);
}
this.removeChildEvents();

if(this._parent) {
    this._parent.removeChild(this);
} else {
    var p = this._dom.parentElement;
    if(p) p.removeChild(this._dom);
}

this._children = [];
this.removeAllHandlers();
```

### <a name="_removeChild"></a>::removeChild(o)

Removes a child of the node
*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.removeChild.apply(this._contentObj, Array.prototype.slice.call(arguments));
}

if(this._children) {

    var me = this;
    var i = this._children.indexOf(o);
    if(i>=0) {
        this._children.splice(i,1);
        this._dom.removeChild( o._dom );
    } 
    this.reIndex();
}
```

### <a name="_removeChildEvents"></a>::removeChildEvents(t)


*The source code for the function*:
```javascript
this.forChildren( function(ch) {
    if(ch._initWithDef && ch._initWithDef.componentWillUnmount) {
        ch._initWithDef.componentWillUnmount.apply( ch, []);
    }     
    ch.removeAllHandlers();
    ch.removeChildEvents();
});
```

### <a name="_removeIndexedChild"></a>::removeIndexedChild(o)

Removes the node from the index, but not from the DOM tree
*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.removeIndexedChild.apply(this._contentObj, Array.prototype.slice.call(arguments));
}
if(this._children) {
    var i = this._children.indexOf(o);
    if(i>=0) {
        this._children.splice(i,1);
    }
}
```

### <a name="_replaceWith"></a>::replaceWith(elem)


*The source code for the function*:
```javascript
// var a = A.parentNode.replaceChild(document.createElement("span"), A);

var p = this.parent();
if(p) {
    var pi = p._children.indexOf(this);
    p._dom.replaceChild(elem._dom, this._dom);
    p._children.splice(pi, 1, elem);
    elem._parent = p;
    elem._svg = this._svg;
    // copy the event handlers of not????
    // this.remove();
}

```


    
    
    
## trait TouchEvents

The class has following internal singleton variables:
        
* _mousePoint
        
        
### <a name="_baconDrag"></a>::baconDrag(opts)


*The source code for the function*:
```javascript
var me = this;
return Bacon.fromBinder( function(sink) {
  me.drag( function(dv) {
      sink(dv);
  });
}); 
```

### <a name="_drag"></a>::drag(callBack, disableTransform)


*The source code for the function*:
```javascript
var me = this,
    state = {};
    
if(this.isObject(callBack) && !this.isFunction(callBack)) {
    
    var objToDrag = callBack;
    var sx,sy;
    callBack = function(dv) {
        if(dv.start) {
            sx = objToDrag.x();
            sy = objToDrag.y();            
        }
        objToDrag.x( sx + dv.dx).y( sy + dv.dy );           
    }
}
    
var rootTransform,
    rootScreen;
    
this.draggable( function(o,dv) {
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
    if(!disableTransform && trans.length > 0 && (typeof(Matrix3D) != "undefined")) {
        rootTransform = Matrix3D();
        trans.forEach( function(m) {
            rootTransform.matMul(m);
        })
        rootScreen = me.findScreen();
        var point = rootTransform.dragTransformation( state, rootScreen );
        state.sx = point.sx;
        state.sy = point.sy;
        state.x  = point.x;
        state.y  = point.y;
        state.dx = point.dx;
        state.dy = point.dy;
    } else {
        rootTransform = null;
    }
    
    callBack(state);
}, function(o,dv) {
    state.start = false;
    state.dx = dv.dx;
    state.dy = dv.dy;
    state.mx = dv.mx;
    state.my = dv.my;       
    state.x = state.sx +state.dx;
    state.y = state.sy +state.dy;             
    if(!disableTransform && rootTransform) {
        var point = rootTransform.dragTransformation( state, rootScreen );
        state.sx = point.sx;
        state.sy = point.sy;
        state.x  = point.x;
        state.y  = point.y;
        state.dx = point.dx;
        state.dy = point.dy;        
    }
    callBack(state);
}, function(o,dv) {
    state.end = true;
    state.dx = dv.dx;
    state.dy = dv.dy;        
    state.mx = dv.mx;
    state.my = dv.my;      
    if(!disableTransform && rootTransform) {
        var point = rootTransform.dragTransformation( state, rootScreen );
        state.sx = point.sx;
        state.sy = point.sy;
        state.x  = point.x;
        state.y  = point.y;
        state.dx = point.dx;
        state.dy = point.dy;        
    }    
    callBack(state);
});
return this;
```

### <a name="_draggable"></a>::draggable(startFn, middleFn, endFn)

Three functions, fired when drag starts, proceeds and ends
*The source code for the function*:
```javascript
var _eg = this.__singleton();
_eg.draggable(this);

if(startFn) this.on("startdrag", startFn);
if(middleFn) this.on("drag", middleFn);
if(endFn) this.on("enddrag", endFn);

```

### ::constructor( t )

```javascript
this._touchItems = [];
```
        
### <a name="_mousePos"></a>::mousePos(t)


*The source code for the function*:
```javascript
if(!_mousePoint) {
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
```

### <a name="_pauseEvents"></a>::pauseEvents(e)


*The source code for the function*:
```javascript
e = e || window.event;

if(e.stopPropagation) e.stopPropagation();
if(e.preventDefault) e.preventDefault();
e.cancelBubble=true;
e.returnValue=false;

return false;
```

### <a name="_touch"></a>::touch(i)

Get touch number i
*The source code for the function*:
```javascript
return this._touchItems[i];

```

### <a name="_touchclick"></a>::touchclick(t)

Enables click emulation on touch devices
*The source code for the function*:
```javascript
this.touchevents();
var o = this;
this.on("touchstart", function(o,dv) {
    o.trigger("click");
});
```

### <a name="_touchevents"></a>::touchevents(t)

Initializes the touch events
*The source code for the function*:
```javascript

// NOTE
// http://blogs.msdn.com/b/davrous/archive/2013/02/20/handling-touch-in-your-html5-apps-thanks-to-the-pointer-events-of-ie10-and-windows-8.aspx
// http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
// https://coderwall.com/p/egbgdw
// http://jessefreeman.com/articles/from-webkit-to-windows-8-touch-events/

var elem =  this._dom;

// No hope...
if(!elem.addEventListener) return;

var o = this;
this._touchItems = [];

var touchStart= function(e) {

                          // o._touchItems = [];
                          var allTouches = e.touches;
                          
                          if(e.targetTouches) allTouches = e.targetTouches;
                          
                          o._touchCount = allTouches.length;
                          o._touchItems.length = o._touchCount; // truncate array
                          
                          for(var i=0; i<allTouches.length; i++) {
                            var item = {};
                            item.startX = allTouches[0].pageX;
                            item.startY = allTouches[0].pageY;
                            item.startMs = ( new Date() ).getTime();
                            o._touchItems[i]  = item;
                          }
                          o.trigger("touchstart");
                          if(e.preventDefault) e.preventDefault();
                          if(e.stopPropagation) e.stopPropagation();
                    
                          e.returnValue = false;
                          return false;
                      };

var touchMove =  function(e) {
                          var allTouches = e.touches;
                          if(e.targetTouches) allTouches = e.targetTouches; // [0].pageX;)
                          o._touchCount = allTouches.length;
                          for(var i=0; i<allTouches.length; i++) {
                             var item = o._touchItems[i];
                             if(!item) continue;
                             item.dx = e.touches[i].pageX - item.startX;
                             item.dy = e.touches[i].pageY - item.startY;
                             //item.x = e.touches[i].pageX - off.left;
                             //item.y = e.touches[i].pageY - off.top;
                          }
                          
                          if(o._touchCount>1) {
                              var pinch = {
                                  items : o._touchItems
                              }
                              o.trigger("pinch", pinch);
                          }
                          
                          o.trigger("touchmove");
                          if(e.preventDefault) e.preventDefault();
                          if(e.stopPropagation) e.stopPropagation();
                          return false;
};

var touchEnd = function(e) {
                          o.trigger("touchend");
                          if(e.preventDefault) e.preventDefault();
                          if(e.stopPropagation) e.stopPropagation();
                          e.returnValue = false;
                          return false;
                      };

/*elem.addEventListener("touchcancel", function(e) {
                      o.trigger("touchcancel");
                      e.preventDefault();
                      }, false);*/


var msHandler = function(event) {
    // o.trigger("mstouch",event);
    switch (event.type) {
        case "touchstart": case "MSPointerDown": touchStart(event);
        break;
        case "touchmove": case "MSPointerMove": touchMove(event);
        break;
        case "touchend": case "MSPointerUp": touchEnd(event);
        break;
    }
    // if(event.preventDefault) event.preventDefault();
    event.returnValue = false;
//                     event.preventDefault();
}


elem.addEventListener("touchstart", touchStart, false);
elem.addEventListener("touchmove", touchMove, false);
elem.addEventListener("touchend", touchEnd, false);



```


    
    
    
## trait Dimensions

The class has following internal singleton variables:
        
        
### <a name="_absolute"></a>::absolute(t)

Makes the DOM element absolute positioned
*The source code for the function*:
```javascript
this.q.css("position", "absolute");
this.x(0).y(0).z(this.baseZ());
return this;

    

```

### <a name="_baseZ"></a>::baseZ(v)


*The source code for the function*:
```javascript
if(typeof(v)!="undefined") {
    this._baseZ = v;
    return this;
}
if(typeof(this._baseZ)=="undefined") this._baseZ = 0;
return this._baseZ;
```

### <a name="_box"></a>::box(t)


*The source code for the function*:
```javascript
var box = { left : 0, top : 0, width : 800, height : 800 };

var elem = this._dom;
try {
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !=="undefined" ) {
		box = elem.getBoundingClientRect();
	}
} catch(e) {
    // for IE having this bg
    box = { left : 0, top : 0, width : 800, height : 800 };
}
return box;
```

### <a name="_height"></a>::height(v)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.height(v);
}
if(typeof(v)=="undefined") return this._h;

if(this.isStream(v)) {
    var me = this;
    v.onValue( function(v) {
        me.height(v);
    });
    return this;
}

if(v=="auto"){
    this._dom.style.height = v;
    this._h = v;
    return this;
}
if(v.slice) {
    if(v.slice(-1)=="%") {
        this._dom.style.height = v;
        return this;
    }
    if(v.slice(-2)=="em") {
        this._dom.style.height = v;
        return this;
    }    
}

var p = this.pxParam(v);
if(typeof(p)!="undefined") {
    this._dom.style.height = p;
    this._h = parseInt(v);
    this.trigger("height");
}
return this;
```

### ::constructor( t )

```javascript

```
        
### <a name="_offset"></a>::offset(t)


*The source code for the function*:
```javascript
var doc = document.documentElement;
var scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
var scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

var box = this.box();
return {
	top: box.top + scrollTop, // + document.body.scrollTop, //  - docElem.clientTop,
	left: box.left+scrollLeft, // + document.body.scrollLeft // - docElem.clientLeft
	width : box.width,
	height : box.height
};  
```

### <a name="_pxParam"></a>::pxParam(v)

Transform the param into CSS pixel value, like "12px"
*The source code for the function*:
```javascript
if(typeof(v)=="string") {
    return parseInt(v)+"px";
} else {
    var i = parseInt(v);
    if(!isNaN(i)) {
        return i+"px";
    }
}
```

### <a name="_relative"></a>::relative(t)

Makes the DOM item relatively positioned
*The source code for the function*:
```javascript
this.q.css("position", "relative");
this.x(0).y(0).z(this.baseZ());
return this;

```

### <a name="_width"></a>::width(v)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.width(v);
}

if(typeof(v)=="undefined") return this._w;

if(this.isStream(v)) {
    var me = this;
    v.onValue( function(v) {
        me.width(v);
    });
    return this;
}


if(v=="auto"){
    this._dom.style.width = v;
    this._w = v;
    return this;
}

if(v.slice) {
    if(v.slice(-1)=="%") {
        this._dom.style.width = v;
        return this;
    }
    if(v.slice(-2)=="em") {
        this._dom.style.width = v;
        return this;
    }    
}

var p = this.pxParam(v);
if(typeof(p)!="undefined") {
    this._dom.style.width = p;
    this._w = parseInt(v);
    this.trigger("width");
}
return this;
```

### <a name="_x"></a>::x(v)
`v` if set, the value of the x
 


*The source code for the function*:
```javascript

if(this.isStream(v)) {
    var me = this;
    v.onValue( function(v) {
        me.x(v);
    });
    return this;
}


if(typeof(v)!="undefined") {
    this.q.css("left", v+"px");
    this._x = v;
    this.trigger("x");
    return this;
}
if(typeof(this._x)=="undefined") this._x = 0;
return this._x;
```

### <a name="_y"></a>::y(v)
`v` if set, the value of y
 


*The source code for the function*:
```javascript

if(this.isStream(v)) {
    var me = this;
    v.onValue( function(v) {
        me.y(v);
    });
    return this;
}

if(typeof(v)!="undefined") {
    this.q.css("top", v+"px");
    this._y = v;
    this.trigger("y");
    return this;
}
if(typeof(this._y)=="undefined") this._y = 0;
return this._y;
```

### <a name="_z"></a>::z(v)
`v` if set, the value of z-index
 


*The source code for the function*:
```javascript

if(this.isStream(v)) {
    var me = this;
    v.onValue( function(v) {
        me.z(v);
    });
    return this;
}

var base = this._baseZ || 0;
if(typeof(v)!="undefined") {
    this.q.css("zIndex", v+base);
    this._z = v;
    this.trigger("z");
    return this;
}
if(typeof(this._z)=="undefined") this._z = 0;
return this._z;
```


    
    
    
## trait CSSTransform

The class has following internal singleton variables:
        
* _effects
        
* _nsConversion
        
* _nsIndex
        
        
### <a name="__resetProjection"></a>::_resetProjection(options, fromDOM)
`options` The screen options
 
`fromDOM` Do we use DOM as source
 


*The source code for the function*:
```javascript

if(!options.has3D) return;

if(fromDOM) {
    var box = this.offset();
    if(!options.offset) options.offset = {};
    options.offset.x = box.left;
    options.offset.y = box.top;
    options.screenWidth = box.width;
    options.screenHeight = box.height;
    options.width = box.width;
    options.height = box.height;    
}

if(options.lastWidth == options.width &&
   options.lastHeight== options.height) return;
   
// perspectiveOrigin
var halfWidth  = parseInt( options.width / 2),
    halfHeight = parseInt( options.height / 2 );

// the projection screen size
this._dom.style.perspectiveOrigin = halfWidth+"px "+halfHeight+"px ";
this._dom.style.transformStyle="preserve-3d"

options.lastWidth = options.width;
options.lastHeight = options.height;

options.has3D = true;
```

### <a name="_compStyle"></a>::compStyle(t)

Returns object, which will return computed style for the element. The returned object can be used as

```javascript
var cs = el.compStyle();
cs.get("color");
```
*The source code for the function*:
```javascript
var elem = this._dom;
var cs = window.getComputedStyle(elem,null);
return {
 get : function(prop) {
    return cs.getPropertyValue(prop);
 }
};

```

### <a name="_createEffect"></a>::createEffect(name, inPosition, outPosition, options)


*The source code for the function*:
```javascript

css().bind("."+name+"OutPosition", outPosition);
css().bind("."+name+"InPosition", inPosition);

options = options || {};
options.duration = options.duration || 0.2;

css().animation(name+"Out", {
    duration : (options.duration.toFixed(2) * 2) + "s",
    "iteration-count" : 1,
},  inPosition,  0.5, outPosition, outPosition); 

css().animation(name+"In", {
    duration : (options.duration.toFixed(2) * 2) + "s",
    "iteration-count" : 1,
},  outPosition, 0.5, inPosition, inPosition); 

_effects[name] = options;


```

### <a name="_css"></a>::css(subNamespace)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.css.apply(this._contentObj, Array.prototype.slice.call(arguments));
}
// convert the namespaces to shorter versions
if(!_nsConversion) {
    _nsConversion = {};
    _nsIndex = 1;
}

if(!this._myClass) {
    this._myClass = "css_"+this.guid();
}

// subNamespace is usually used together with custom components, which are
// defining their own styles in some namespace
if(subNamespace) {
    // css namespaces of this object
    if(!this._cssNs) this._cssNs = {};
    
    // if the CSS object has been constructed
    var cssObj = this._cssNs[subNamespace];
    if(cssObj) return cssObj;
    
    // if not, create a new css object in a new namespace
    var nsFull = this._myClass+"_"+subNamespace;
    if(!_nsConversion[nsFull]) _nsConversion[nsFull] = _nsIndex++;
    var nsShort = this._myClass+"_"+_nsConversion[nsFull];
    
    cssObj = css(nsShort);
    this._cssNs[subNamespace] = cssObj;
    cssObj._nameSpace = nsShort;
    return cssObj; 
}

if(!this._css) {
    this._css = css(this._myClass);
    this.addClass(this._myClass);
}

return this._css;


```

### <a name="_effectIn"></a>::effectIn(name, fn)


*The source code for the function*:
```javascript

if(!this._effectOn) this._effectOn = {};

if(this._effectOn[name]) {
    return;
}

if(!this._effectState) {
    this._effectState = {};
    this._effectState[name] = 1;
    return;
}

if(this._effectState[name]==1) return;

this._effectOn[name] = (new Date()).getTime();

var options = _effects[name];

var eOut = name+"Out",
    eIn = name+"In",
    eInPos = name+"InPosition",
    eOutPos = name+"OutPosition";
    
this.removeClass(eOut);
this.removeClass(eIn);
this.addClass(eIn);
var me = this;
later().after(options.duration, function() {
    me.removeClass(eOutPos);
    me.addClass(eInPos);
    me.removeClass(eIn);
    me._effectOn[name] = 0;
    me._effectState[name] = 1;
    if(fn) fn();
});    

```

### <a name="_effectOut"></a>::effectOut(name, fn)


*The source code for the function*:
```javascript
if(!this._effectOn) this._effectOn = {};

if(this._effectOn[name]) {
    return;
}
if(!this._effectState) {
    this._effectState = {};
    this._effectState[name] = 1;
}
if(this._effectState[name]==2) return;

this._effectOn[name] = (new Date()).getTime();

var options = _effects[name];

var eOut = name+"Out",
    eIn = name+"In",
    eInPos = name+"InPosition",
    eOutPos = name+"OutPosition";
    
this.removeClass(eOut);
this.removeClass(eIn);
this.addClass(eOut);
var me = this;
later().after(options.duration, function() {
    me.removeClass(eInPos);
    me.addClass(eOutPos);
    me.removeClass(eOut);
    me._effectOn[name] = 0;
    me._effectState[name] = 2;
    if(fn) fn();
}); 
```

### <a name="_findScreen"></a>::findScreen(t)


*The source code for the function*:
```javascript
if(!this._screenDefinition) {
    var p = this.parent();
    if(p) return p.findScreen();
   
    // if no screen found, return default screen
    return {
        screenWidth : 1000,
        screenHeight : 1000,
        perspective : 101133300,
        offset : {
            x : 0,
            y : 0
        }
    };
    
} else {
    var options = this._screenDefinition;
    var box = this.offset();
    if(!options.offset) options.offset = {};
    
    options.offset.x = box.left;
    options.offset.y = box.top;
    options.screenWidth = box.width;
    options.screenHeight = box.height;
    options.width = box.width;
    options.height = box.height;
    
    this._resetProjection( options );
    
    // TODO: should we calculate the screen size also here??
    
    return options;  
}
```

### <a name="_findTransform"></a>::findTransform(results, startFromParent)
`results` Left empty upon first call
 

Collects all the transformations for a certain matrix.
*The source code for the function*:
```javascript

if(!results) results = [];

if(!startFromParent) {
    if(this._transformMatrix) {
        results.unshift(this._transformMatrix);
    } 
}
var p = this._parent;
if(p) p.findTransform(results);

return results;
```

### <a name="_hide"></a>::hide(t)

Hides the node from DOM tree
*The source code for the function*:
```javascript
this._dom.style.display = "none";
this.trigger("hide");


```

### ::constructor( t )

```javascript
if(!_effects) {
    _effects = {};
}
```
        
### <a name="_setProjectionScreen"></a>::setProjectionScreen(options)
`options` The screen definition
 


*The source code for the function*:
```javascript

options = options || {};

var hadPerspective = false;
if(!options.perspective ) {
    options.perspective = 101133300;
} else {
    hadPerspective = true;
    this._dom.style.perspective = options.perspective+"px";
    this._dom.style.webkitPerspective = options.perspective+"px";
}

if(options.has3D || hadPerspective) {

    if(options.width && options.height) {
        this._resetProjection( options );
    }
    options.has3D = true;
}

this._screenDefinition = options;
var me = this;

me.on("width", function() {
    me._resetProjection( options, true );
});
me.on("height", function() {
    me._resetProjection( options, true );
})

```

### <a name="_setTransformMatrix"></a>::setTransformMatrix(m3d, use3D)
`m3d` Matrix3D instance
 

Set transform matrix this element is listening right now..
*The source code for the function*:
```javascript
if(this._transformMatrix) {
    // setting second time is an error
    
    this._transformMatrix.removeListener( this._matrixHandler );
    m3d.onChange(this._matrixHandler);
    this._transformMatrix = m3d;
    return this;
}

this._transformMatrix = m3d;
this._use3D = use3D;

var me = this;
this._matrixHandler = function(m) {
    me.updateTransFromMatrix(m);
}
m3d.onChange(this._matrixHandler);

return this;
```

### <a name="_show"></a>::show(t)

Shows the node in the DOM tree if not visible
*The source code for the function*:
```javascript
this._dom.style.display = "";
this.trigger("show");

```

### <a name="_style"></a>::style(v)

Creates a local CSS style using the css() object
*The source code for the function*:
```javascript
if(typeof(v)!="undefined") {
    // should we have named styles... perhaps... TODO
}
if(!this._localStyle) {
    var createStyleGuid = "localstyle"+(new Date()).getTime()+"_"+guid();
    this._localStyle = css().css("width","auto");
    this._localStyle.writeRule(createStyleGuid);
    this.addClass(createStyleGuid);
}
return this._localStyle;
```

### <a name="_styleString"></a>::styleString(value)


*The source code for the function*:
```javascript
// TODO: binding the style string???
this._dom.style.cssText = value;
return this;
```

### <a name="_updateTransFromMatrix"></a>::updateTransFromMatrix(fromMatrix)


*The source code for the function*:
```javascript
if( this._transformMatrix) {
    
    // update from 2D matrix this time, no 3D support right now...
    
    if(this._use3D) {
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

```


    
    
    
## trait Table

The class has following internal singleton variables:
        
        
### <a name="_addRow"></a>::addRow(items)

adds rows of items into the table, for example tbl.addRow(a,b,c)
*The source code for the function*:
```javascript

if(this._contentObj) {
    return this._contentObj.addRow.apply(this._contentObj, Array.prototype.slice.call(arguments));
}

var row = new _e("tr");
this.addItem(row);

row.addClass("row"+this._children.length);

var itemList = items;
if(!this.isArray(items)) {
    var len = arguments.length;
    var ii=0;
    itemList = new Array(len);
    while(ii<len) itemList[ii] = arguments[ii++];
}

var colIndex=0, me = this;
itemList.forEach(function(ii) {
    row.td("col"+(colIndex++), {"valign" : "top"}).add( ii );
});
return this;  
```


    
    
    
## trait Iteration

The class has following internal singleton variables:
        
        
### <a name="_child"></a>::child(i)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.child(i);
}
return this._children[i];

```

### <a name="_childCount"></a>::childCount(t)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.childCount();
}

if(!this._children) return 0;
return this._children.length
```

### <a name="_forChildren"></a>::forChildren(fn, recursive)

Calls function for all the direct children of this node
*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.forChildren(fn,recursive);
}


if(this._children) {
    this._children.forEach( function(c) {
        fn(c);
        if(recursive) c.forChildren(fn, recursive);
    });
}
```

### <a name="_forEach"></a>::forEach(fn)

Calls function for all the direct children of this node
*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.forEach.apply(this._contentObj, Array.prototype.slice.call(arguments));
}

if(this._children) 
    this._children.forEach( function(c) {
        fn(c);   
    });
```

### <a name="_searchTree"></a>::searchTree(fn, list)

Returns all the children which return true when given as parameter to function fn.
*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.searchTree(fn,list);
}

if(!list) list = [];
var v;
if(v = fn(this)) list.push(v)
if(this._children) 
    this._children.forEach( function(c) {
        // if(fn(c)) list.push(c);
        c.searchTree(fn,list);
    });
return list;
```


    
    
    
## trait DomClass

The class has following internal singleton variables:
        
        
### <a name="_addClass"></a>::addClass(c)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.addClass(c);
}
if(this._svg) return this;
if(this._dom instanceof SVGElement) return;

if(!this._classes) {
    this._classes = [];
}

if(this.isStream(c)) {
    
    var me = this,
        oldClass = "";
    c.onValue(function(c) {
        if(oldClass && (c!= oldClass)) {
            me.removeClass(oldClass);
        }
        me.addClass(c);
        oldClass = c;
    });
    
    return this;
}

if(this.hasClass(c)) return;
this._classes.push(c);
if(!this._svg) this._dom.className = this._classes.join(" "); 

return this;
```

### <a name="_findPostFix"></a>::findPostFix(str)


*The source code for the function*:
```javascript

if(this._myClass) {
    return this._myClass;
} else {
    var p = this.parent();
    if(p) return p.findPostFix();
}
return "";
```

### <a name="_hasClass"></a>::hasClass(c)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.hasClass(c);
}
if(!this._classes) return false;
if(this._classes.indexOf(c)>=0) return true;
return false;
```

### <a name="_removeClass"></a>::removeClass(c)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.removeClass(c);
}

if(!this._classes) return this;
var i;
while( (i = this._classes.indexOf(c))>=0) {
    if(i>=0) {
        this._classes.splice(i,1);
        this._dom.className = this._classes.join(" ");
    }
}
return this;
```


    
    
    
## trait events

The class has following internal singleton variables:
        
* _touchClick
        
* _outInit
        
* _outListeners
        
        
### <a name="__alwaysTouchclick"></a>::_alwaysTouchclick(t)


*The source code for the function*:
```javascript
_touchClick = t;
```

### <a name="_bacon"></a>::bacon(eventName, eventTransformer)


*The source code for the function*:
```javascript

return Bacon.fromEvent(this._dom, eventName, eventTransformer); // (this._dom, eventName [, eventTransformer]) 

```

### <a name="_bindSysEvent"></a>::bindSysEvent(en, fn, stop)


*The source code for the function*:
```javascript
en = en.toLowerCase();
if(!this._sys) this._sys = {};
if(this._sys[en]) return false;

this._sys[en] = true;

var me = this;
if(!stop) {
    this._dom.addEventListener(en, fn);
} else {
    this._dom.addEventListener(en, function(e) {
            e = e || window.event;
            me._event = e;
            if(stop) {
                if(e && e.stopPropagation) {
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
```

### <a name="_delegate"></a>::delegate(myDelecate)

Delegates the events to this object
*The source code for the function*:
```javascript

if(!this._delegates) this._delegates = [];
this._delegates.push(myDelecate);

```

### <a name="_eventBinder"></a>::eventBinder(dom, eventName, fn, stop)


*The source code for the function*:
```javascript
var me = this;
dom.addEventListener(eventName, function(e) {
        e = e || window.event;
        me._event = e;
        if(stop) {
            if(e && e.stopPropagation) {
                e.stopPropagation();
            } else {
               e = window.event;
               e.cancelBubble = true;
            }
        }
        fn();
    });
 
```

### <a name="_isHovering"></a>::isHovering(t)


*The source code for the function*:
```javascript
if(!this._hoverable) {
    this._hovering = false;
    var o = this;
    
    this.on("mouseenter", function() {
        // console.log("Entered...");
        o._hovering = true; 
    });
    this.on("mouseleave", function() {
        o._hovering = false; 
    });
    this._hoverable = true;
}
return this._hovering;
```

### <a name="_namedListener"></a>::namedListener(name, fn)


*The source code for the function*:
```javascript

if(typeof(fn)!="undefined") {
    
    if(!this._namedListeners) 
        this._namedListeners = {};
    this._namedListeners[name] = fn;   
    fn._listenerName = name;
    return this;
} 
if(!this._namedListeners) return;
return this._namedListeners[name];
```

### <a name="_on"></a>::on(en, ef)
`en` Event name
 

Binds event name to event function
*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.on( en, ef );
}

if(!this._ev) this._ev = {};
if(!this._ev[en]) this._ev[en] = [];

this._ev[en].push(ef);
var me = this;

ef._unbindEvent = function() {
   me.removeListener(en,ef);    
}

if(en=="outclick") {
    if(!_outInit) {
        _outInit= true;
        _outListeners = [];
        if(document.body) {
            document.body.addEventListener("click", function() {
                // isHovering
                for(var i=0; i<_outListeners.length; i++) {
                    var out = _outListeners[i];
                    if(!out.isHovering()) out.trigger("outclick");
                }
            }, true)
        }
    }
    if(_outListeners.indexOf(me) < 0 ) {
        _outListeners.push( me );
    } 
    this.isHovering();
    return this;
}

if(en=="load") {
    if(this._imgLoaded) {
        this.trigger("load");
    }
}

// To stop the prop...
if(en=="click") {
    this.bindSysEvent("click", function() {
        me.trigger("click");
    }, true);
    
    // if automatic touchclick emulation is on
    if(_touchClick) this.touchclick();
}
    
if(en=="dblclick") this.bindSysEvent("dblclick", function() {
        me.trigger("dblclick");
    }, true);    
    
if(en=="mousedown") this.bindSysEvent("mousedown", function() {
        me.trigger("mousedown");
    });
    
if(en=="mouseup") this.bindSysEvent("mouseup", function() {
        me.trigger("mouseup");
    });
    
if(en=="checked") {
    
    this.bindSysEvent("change", function() {
        if(me._type=="checkbox") {
            if(me._dom.checked) {
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
    
if(en=="value") {
    this.bindSysEvent("change", function() {
        if(me._type=="checkbox") {
            if(me._dom.checked) {
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
    
    if(this._type=="input" || this._type=="textarea") {
            var lastValue="";
            this.bindSysEvent("keyup", function() {
                                    var bch = false;
                                    if(lastValue != me._dom.value) bch = true;
                                    me._value = me._dom.value;
                                    if(bch) me.trigger("value");
                                    lastValue = me._dom.value;
                    });                        
        

    }
}

if(en=="focus") {
    this.bindSysEvent("focus", function() {
        me._value = me._dom.value;
        me.trigger("focus");
    });
}  

if(en=="play") {
    this.bindSysEvent("play", function() {
        me.trigger("play");
    });
}         

if(en=="mousemove") {
    this.bindSysEvent("mousemove", function() {
        me.trigger("mousemove");
    });
} 

if(en=="blur") {
    this.bindSysEvent("blur", function() {
        me._value = me._dom.value;
        me.trigger("blur");
    });
}

if(en=="mouseenter") {

    this.bindSysEvent("mouseover", function(e) {
             e = e || window.event;
            if(me._hover) return;
            me._hover = true;
            me._event = e;
            if(me._parent) {
                if(!me._parent._hover) {
                    me._parent.trigger("mouseenter");
                }
            }
            me.trigger("mouseenter");
        });
    this.bindSysEvent("mouseout", function(e) {
            if(!me._hover) return;
            
            var childHover = false;
            me.forChildren( function(c) { if(c._hover) childHover = true; });
            
            if(childHover) return;
            me._hover = false;
            me.trigger("mouseleave");
        });                        
 
}

return this;
```

### <a name="_removeAllHandlers"></a>::removeAllHandlers(t)


*The source code for the function*:
```javascript

if(this._ev) {
    // console.log("Removing handlers....");
    for(var n in this._ev) {
        if(this._ev.hasOwnProperty(n)) {
            var list = this._ev[n],
                me = this;
            //console.log("Removing list....", list);
            list.forEach( function(fn) {
                if(me._namedListeners) {
                    var ln = fn._listenerName;
                    if(me._namedListeners[ln]) {
                        delete me._namedListeners[ln];
                    }
                }
                if(fn._unbindEvent) {
                    //console.log("Calling unbind event... for ", fn);
                    fn._unbindEvent();
                }
            });
        }
    }
    for(var n in this._namedListeners) {
        if(this._namedListeners.hasOwnProperty(n)) {
            var fn = this._namedListeners[n];
            if(fn._unbindEvent) {
                    //console.log("Calling unbind event... for ", fn);
                    fn._unbindEvent();
            }
            delete this._namedListeners[n];
        }
    }
    
    if(_outListeners) {
        var i = _outListeners.indexOf( this );
        if(i >=0) {
            _outListeners.splice(i,1);
        }
    }
}
```

### <a name="_removeListener"></a>::removeListener(eventName, fn)


*The source code for the function*:
```javascript
if(this._ev && this._ev[eventName]) {
    var i = this._ev[eventName].indexOf(fn);
    if(i>=0) this._ev[eventName].splice(i,1);
    
    if(this._ev[eventName].length==0) {
        delete this._ev[eventName];
    }    
}
```

### <a name="_trigger"></a>::trigger(en, data, fn)

triggers event with data and optional function
*The source code for the function*:
```javascript

if(this._contentObj) {
    return this._contentObj.trigger(en, data, fn);
}

if(this._delegates) {
    this._delegates.forEach( function(d) {
        if(d && d.trigger) d.trigger(en,data, fn);
    });
    // return;
}
if(!this._ev) return;
if(!this._ev[en]) return;
var me = this;
this._ev[en].forEach( function(cb) { 
    if(cb) {
        cb.apply( me, [me, data, fn] );
    }
});    
return this;
```

### <a name="_uniqueListener"></a>::uniqueListener(listenerName, fn)


*The source code for the function*:
```javascript
var oldList = this.namedListener(listenerName);
if(oldList) {
  if(oldList._unbindEvent) oldList._unbindEvent();
}
this.namedListener(listenerName, fn);
return fn;

```


    
    
    
## trait Table

The class has following internal singleton variables:
        
        
### <a name="InputHandling_bind"></a>InputHandling::bind(obj, varName, withFunction)

Binds input value to an object with data
*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.bind.apply(this._contentObj, Array.prototype.slice.call(arguments));
}

var o = this, me = this;

if(this.isFunction(obj[varName])) {

    var val = obj.get(varName),
        o = this,
        fn = function(v) {
            obj.set(varName, v);
            // obj[varName](v);
        },
        bSendingEvent = false,
        me = this;
  
    var isNumber = false;
    var oo = obj;

    var valueInListener = this.uniqueListener("bind:valueIn", function(obj, newVal) {

        if(bSendingEvent) return;
        
        if(me.isFunction( withFunction) ) {
             withFunction.apply( me, [newVal, me, obj]);
             val = newVal;
             return;
        }
        
        if(o._type=="checkbox") {
            if(typeof(newVal)=="string") {
                newVal = (newVal == "true" );
            }
            o.checked(newVal);
        } else {
            o.bindVal(newVal);
        } 
        val = newVal;
    });
    var valueOutListener = this.uniqueListener("bind:valueOut",function(obj,v) {

        //console.trace();
        bSendingEvent = true;
        if(o._type=="checkbox") {
            fn(o.checked());
        } else {
            fn(isNumber ? parseFloat( o.val() ) : o.val() );
        }
        bSendingEvent = false;
    });    
    
    var invalidInputListener = this.uniqueListener("bind:invalidIn",function(obj, msg) {
        o.trigger("invalid", msg);
    });
    var validInputListener = this.uniqueListener("bind:validIn",function(obj, newVal) {
        o.trigger("valid", newVal);
    });
    if(o._type=="checkbox") {
        obj.on(varName, valueInListener );
        this.on("value", valueOutListener);         
    } else {
        obj.on(varName, valueInListener );
        this.on("value", valueOutListener); 
    }

    if(me.isFunction( withFunction) ) {
         withFunction.apply( me, [val, me, obj]);
    } else {    
        if(o._type=="checkbox") {
            o.checked(val);
        } else {
            o.bindVal(val);
        }    
    }
    
    // and exit...
    return this;
}

var _ee_ = this.__singleton();
_ee_.bind(obj, varName, this);
var o = this;
this.on("value", function() {
    if(obj) {
        
        if(o._type=="checkbox") {
            
            if(o.checked()) {
                obj.set(varName, true);
            } else {
                obj.set(varName, false);
            }
            
        } else {
            obj.set(varName, o.val());
        }

    }
});

if(obj) {
    if(o._type=="checkbox") {
        
        if(obj[varName]) {
            o.checked(true);
        } else {
            o.checked(false);
        }
    } else {

        if(obj[varName]) {
            o.val(obj[varName]);
        }
        
    }
}
return o;
```

### <a name="InputHandling_bindVal"></a>InputHandling::bindVal(v)


*The source code for the function*:
```javascript


if(typeof(this._dom.value)!="undefined" || this._type=="option") {
    this._dom.value = v;
} else {

    this._dom.style.whiteSpace="pre-wrap";
    this._dom.textContent = v;
}
this._value = v;
return this;
```

### <a name="InputHandling_blur"></a>InputHandling::blur(t)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.blur.apply(this._contentObj, Array.prototype.slice.call(arguments));
}
if(this._dom.blur) this._dom.blur();
```

### <a name="InputHandling_checked"></a>InputHandling::checked(v)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.checked.apply(this._contentObj, Array.prototype.slice.call(arguments));
}

if(typeof(v)=="undefined") {
    this._checked = this._dom.checked;
    return this._checked;
}

var nowOn = this._dom.checked;
this._dom.checked = v;

if( (nowOn && !v) || (!nowOn && v) ){
    this.trigger("value", nowOn);
} 

return this;
```

### <a name="InputHandling_focus"></a>InputHandling::focus(t)

Focus into this element
*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.focus();
}
if(this._dom.focus) this._dom.focus();
```

### <a name="InputHandling_toBacon"></a>InputHandling::toBacon(transformFn)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.toBacon.apply(this._contentObj, Array.prototype.slice.call(arguments));
}
var me = this;
later().asap( function() {
    if(typeof( me.val()) != "undefined" ) {
        me.trigger("value");
    }
});

return Bacon.fromBinder( function(sink) {
     me.on("value", function(o,v) {
         if(transformFn) {
             sink(transformFn( me.val()) );
         } else {
             sink(me.val());
         }
     });
     return function() {
         
     }
});
```

### <a name="InputHandling_val"></a>InputHandling::val(v)

Sets or gets the input value
*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.val.apply(this._contentObj, Array.prototype.slice.call(arguments));
}
if(typeof(v)=="undefined"){
    if(this._type=="select" || this._type=="input" || this._type=="textarea") {
        this._value = this._dom.value;
    }
    return this._value;
}

if(typeof(this._dom.value)!="undefined" || this._type=="option") {
    this._dom.value = v;
} 

this._value = v;
this.trigger("value", v);
return this;
```


    
    
    
    
    
## trait domShortcuts

The class has following internal singleton variables:
        
* _shInit
        
* _elemInit
        
        
### <a name="domShortcuts__addCustomTagFn"></a>domShortcuts::_addCustomTagFn(name)
`name` Name of the custom tag
 

Creates a custom tag function, if possible, to the prototype of the class
*The source code for the function*:
```javascript
this.extendAll(name, function() {
    var argList = Array.prototype.slice.call(arguments);
    argList.unshift(name);
    return this.e.apply(this, argList);
});
```

### <a name="domShortcuts__initShortcuts"></a>domShortcuts::_initShortcuts(t)

Some of the methods have shortcuts
*The source code for the function*:
```javascript
// _elemNames
if(_elemInit) return;
_elemInit = true;

var es = ["a", "b", "h1","h2","h3","h4","h5","h6","button","checkbox",
"div","form","img","input","label","li","ol","p","pre","span","strong","table","textarea","ul","video"];

es.forEach( function(n) {
    _myTrait_[n] = function(className, attrs, c,d,e) {
        return this.shortcutFor(n, className, attrs,c,d,e);
    }    
});
```

### <a name="domShortcuts_attr"></a>domShortcuts::attr(v, v2)


*The source code for the function*:
```javascript


if(this.isObject(v)) {
   for(var n in v) {
       if(v.hasOwnProperty(n)) {
           this.attr(n, v[n]);
       }
   }
   
} else {
    var elem = this;
    
    if(v == "ref") {

        var pComp = elem._findComp();
        if(pComp) {
            if( pComp._instanceVars ) {
                var initData = pComp._instanceVars;
                if(!initData.refs) initData.refs = {};
                initData.refs[v2] = elem;
            }
        }
    }
    
    if(elem._compBaseData) {
        
       if(this.isArray(v2)) {
           var varObj  = v2[0];
           var varName = v2[1];

           varObj.on(varName, function() {
               later().add(
                   function() {
                       elem._compBaseData.set(v, varObj.get(varName));
                   });
           });
           elem._compBaseData.set(v, varObj.get(varName));
           // --> two way
           elem._compBaseData.on(v, function() {
               varObj.set(varName, elem._compBaseData.get(v));
           });
       } else {
           elem._compBaseData.set(v, v2);
       }
       
    } else {    
        if(this._tag=="canvas") {
            if(v=="width") {
                this._canWidth = parseInt(v2);
            }
            if(v=="height") this._canHeight = parseInt(v2);
        }
        this.q.attr(v,v2);
    }
}
return this;
```

### <a name="domShortcuts_canvas"></a>domShortcuts::canvas(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("canvas", className, attrs);
el._canvas = true;
return el;
```

### <a name="domShortcuts_checkbox"></a>domShortcuts::checkbox(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("checkbox", className, attrs);
return el;
```

### <a name="domShortcuts_clearCanvas"></a>domShortcuts::clearCanvas(t)


*The source code for the function*:
```javascript
var ctx = this.ctx(),
    canvas = this._dom;
    
ctx.clearRect(0, 0, canvas.width, canvas.height);

return this;
```

### <a name="domShortcuts_ctx"></a>domShortcuts::ctx(t)


*The source code for the function*:
```javascript
if(this._dom.getContext) {
    return this._dom.getContext("2d")
}
```

### <a name="domShortcuts_e"></a>domShortcuts::e(elemName, className, attrs)


*The source code for the function*:
```javascript

var argList = Array.prototype.slice.call(arguments);

if(this._contentObj) {
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

if(!this._isStdElem(res.elemName)) {

    var customElem = this._findCustomElem(res.elemName);
    if(customElem) {

        if(customElem.init || customElem.render) {

            // create the element HTML tag
            var elem = _e(customElem.customTag, res.attrs, res.constr, res.data);
            this.add( elem );
            return elem;
        }
    }
}
var el = this.shortcutFor.apply( this, argList); // (elemName, className, attrs);
return el;
```

### domShortcuts::constructor( t )

```javascript
if(!_elemInit) this._initShortcuts();
```
        
### <a name="domShortcuts_row"></a>domShortcuts::row(params)


*The source code for the function*:
```javascript
var args = Array.prototype.slice.call(arguments);
if(this._tag == "table") {
    this.addRow(args);
    return this;
}

var tbl = this.table();
tbl.addRow(args);
return tbl;
```

### <a name="domShortcuts_shortcutFor"></a>domShortcuts::shortcutFor(name, className, attrs)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.shortcutFor.apply(this._contentObj, Array.prototype.slice.call(arguments));
}

var el = _e(name);
this.add(el);

var argData = this._constrArgs( Array.prototype.slice.call(arguments) );

if(argData.classStr) el.addClass( argData.classStr );
if(argData.stream) el.addClass( argData.stream );

if(argData.attrs) {
    var myAttrs = argData.attrs;
    for(var n in myAttrs) {
        if(myAttrs.hasOwnProperty(n)) {
            if(name=="input" && (n=="type" && myAttrs[n]=="checkbox")) {
                el._type = "checkbox";
            }
            el.attr(n, myAttrs[n]);
        }
    }
}

if(argData.constr) {
    argData.constr.apply(el, [el]);
}

return el;
```

### <a name="domShortcuts_src"></a>domShortcuts::src(src)


*The source code for the function*:
```javascript
if(this._tag=="img") {
    if(!this._hasLoadL) {
        var me = this;
        me._imgLoaded = false;
        this.__singleton().addEventListener(this._dom, "load", function() {
                me.trigger("load");
                me._imgLoaded = true;
            });
        this._hasLoadL = true;
    }
}

if(this._tag=="canvas") {
    var img = _e("img"),
        me = this;
    me._imgLoaded = false;
    img.src(src);
    img.on("load", function() {
        var im = img._dom;
        if(!me._canWidth) {
            me.q.attr("width",im.width);
            me.q.attr("height",im.height);            
            me._canWidth  = im.width;
            me._canHeight = im.height;            
        }
        
        var ctx = me._dom.getContext("2d");
        ctx.drawImage(im, 0,0, im.width, im.height, 0, 0, me._canWidth, me._canHeight);
        me.trigger("load");
        me._imgLoaded = true;
    });
    return this;
}
this.q.attr("src",src);

return this;
```

### <a name="domShortcuts_toDataURL"></a>domShortcuts::toDataURL(format, quality)


*The source code for the function*:
```javascript

if(!quality) quality = 1;

return this._dom.toDataURL(format || "image/png", quality);
```


    
    
    
## trait domContent

The class has following internal singleton variables:
        
        
### <a name="domContent__setDomText"></a>domContent::_setDomText(elem, text)


*The source code for the function*:
```javascript
if( typeof(elem.textContent)!="undefined") {
   elem.textContent = text;
} 
```

### <a name="domContent_html"></a>domContent::html(h)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.html.apply(this._contentObj, Array.prototype.slice.call(arguments));
}

if (typeof(h) == "undefined") return this._dom.innerHTML;
this._dom.innerHTML = h;
return this;
```

### <a name="domContent_text"></a>domContent::text(t)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.text.apply(this._contentObj, Array.prototype.slice.call(arguments));
}

if(typeof(t)=="undefined") return this._html;

var args = new Array( arguments.length );
var ii=0;
while(ii < arguments.length) args[ii] = arguments[ii++];

if(args.length > 1 ) {

    var bHadNonS = false, me = this;
    args.forEach( function(o) {
        if(me.isObject(o) && !me.isStream(o)) bHadNonS = true;
    });
    
    if(bHadNonS) {
        this.clear();
        this.add( args );
        return this;
    }
    t = this.str( args );
}

if(this.isObject(t)) {
    if(t.onValue) {
        var me = this;
        // TODO: check if we are re-binding two streams on the same element, possible error
        t.onValue( function(t) {
            if(me._svgElem || typeof(me._dom.textContent)!="undefined") {
               me._dom.textContent = t;
            } 
            me._html = t;
        });
        return this;
    }
}

if(this._svgElem || typeof(this._dom.textContent)!="undefined") {
   this._dom.textContent = t;
} 

this._html = t;
return this;
```


    
    
    
## trait viewsNavis

The class has following internal singleton variables:
        
* lastView
        
* bInited
        
* _settingView
        
* _eventState
        
* _windowSize
        
* _mediaListeners
        
* mql
        
* _transitionOn
        
* _dynamicFactory
        
        
### <a name="viewsNavis_fiddle"></a>viewsNavis::fiddle(options)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.fiddle.apply(this._contentObj, Array.prototype.slice.call(arguments));
}
var iframe = _e("iframe"); 
var myId = this.guid();

var html = decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chead%3E"); 

if(options.scripts) options.scripts.forEach( function(s) {
    html+=decodeURIComponent("%3Cscript%20src%3D'")+s+decodeURIComponent("'%3E%3C%2Fscript%3E");
});
if(options.stylesheets) options.stylesheets.forEach( function(s) {
    html+='<link rel="stylesheet" href="'+s+'"></link>';
});
if(options.head) html+=options.head;
html+="</head><body>";

if(!options.callBackName) options.callBackName = "fiddleDone";

if(options.onReady && options.callBackName ) {
    var ls = window['localStorage'];
    var waitFor = function() {
        var res;
        if( res = ls.getItem(myId) ) {
            later().removeFrameFn( waitFor );
            options.onReady( JSON.parse( res ) );
        }
    }
    later().onFrame(waitFor);
    html += decodeURIComponent("%3Cscript%3E")+"function "+options.callBackName+"(v){window['localStorage'].setItem('"+myId+"', JSON.stringify(v));}";
    html += decodeURIComponent("%3C%2Fscript%3E");
}

if(options.html) html+=options.html;
if(options.jsCode) html+=decodeURIComponent("%3Cscript%3E")+options.jsCode+decodeURIComponent("%3C%2Fscript%3E");
html+="</body></html>";
this.addItem(iframe);
var contWinDoc  = iframe._dom.contentWindow.document;
contWinDoc.open();
contWinDoc.write(html);
contWinDoc.close();    

iframe.width(options.width || 800).height(options.height || 600);

return this;
```

### <a name="viewsNavis_initScreenEvents"></a>viewsNavis::initScreenEvents(t)


*The source code for the function*:
```javascript
// object.addEventListener("resize", myScript);
// if(window.matchMedia) {
_windowSize = {
    w : 0,
    h : 0
};

var _widthLimits = [700];

var eventCnt = 0;

_mediaListeners = [];
if(window.matchMedia) {
     mql = window.matchMedia("(max-width:700px)");
     mql.addListener(function(q) {
         eventCnt++;
         if(q.matches) {
            _mediaListeners.forEach( function(fn) {
                fn({ w : window.innerWidth || document.documentElement.clientWidth, 
                     h : window.innerHeight || document.documentElement.clientHeight,
                     limit : 700,
                     width_less : true,
                     eCnt : eventCnt
                     }); 
            });              
         } else {
             _mediaListeners.forEach( function(fn) {
                 fn({ w : window.innerWidth || document.documentElement.clientWidth, 
                      h : window.innerHeight || document.documentElement.clientHeight,
                      limit : 700,
                      width_more : true,
                      eCnt : eventCnt
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
    
    this.eventBinder(bindTo, "resize", function() {
        // what is the screen size... 
        
        eventCnt++;
        
        var width = window.innerWidth || document.documentElement.clientWidth,
            doAlert = false,
            limit = 700;
        
        _widthLimits.forEach( function(w) {
            var ch = (w - width) * (w - _windowSize.w);
            if(ch<0) {
                limit = w;
                doAlert = true;
            }
        });
        
        _windowSize.w = window.innerWidth || document.documentElement.clientWidth;
        _windowSize.h = window.innerHeight || document.documentElement.clientHeight;
        
        if(doAlert) {
            _mediaListeners.forEach( function(fn) {
                var data = {
                    limit :limit,
                    w : _windowSize.w,
                    h : _windowSize.h,
                    eCnt : eventCnt
                };
                if(_windowSize.w>limit) {
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
```

### <a name="viewsNavis_onMediaChange"></a>viewsNavis::onMediaChange(fn)


*The source code for the function*:
```javascript

_mediaListeners.push(fn);
```

### <a name="viewsNavis_popView"></a>viewsNavis::popView(toView)


*The source code for the function*:
```javascript

if(this._contentObj) {
    return this._contentObj.popView.apply(this._contentObj, Array.prototype.slice.call(arguments));
}

if(!this._views || this._views.length==0) {
    var p = this.parent(true);
    if(p) {
        p.popView();
        return this;
    }
    this._views = [];
    return this;
}       

var ms = (new Date()).getTime();
if(_transitionOn && ( ms - _transitionOn < 1000)) return;
_transitionOn = ms;

var cont = this;
var lastView = this;
var view = this._views.pop();

var showP = true;
var me = this;

if(!this._poppedViews) this._poppedViews = _e();

cont.forChildren(function(ch) {
    
    ch.removeClass("viewOut");
    ch.removeClass("viewIn");
    ch.addClass("viewOut");
    
    if(showP) {
        later().after(0.2, function() {
            // console.log("Old view child count ", view.oldChildren._children.length);
            var addThese = [];
            view.oldChildren.forChildren( function(ch) {
                ch.show();
                addThese.push(ch);
            });
            addThese.forEach( function(c) {
                cont.add( c );
                c.removeClass("viewOut");
                c.removeClass("viewIn");
                c.addClass("viewIn");                
            });
            
            if(view.oldTitle && me.setTitle) me.setTitle(view.oldTitle);                
            showP = false;
            later().after(0.2, function() {
                _transitionOn = 0;
                if(addThese[0]) addThese[0].scrollTo(view._y, view._x);
            });
        });
    }
    later().after(0.2, function() {
        // ch.remove();
        me._poppedViews.add( ch );
    });
    
});



```

### <a name="viewsNavis_pushTo"></a>viewsNavis::pushTo(name, factoryName, paramName)
`name` Name of the layout element, for example &quot;top&quot;, &quot;content&quot; or &quot;bottom&quot;
 
`factoryName` Name of the view factory created with viewFactory
 
`paramName` Parameter name for the view
 


*The source code for the function*:
```javascript

if(this.isObject(paramName)) {
    var mm = paramName;
    if(paramName.model) {
        mm = paramName.model
    }
    if(mm.getID) paramName = mm.getID();
}

if(!this._activeLayout) {
    var p = this.parent();
    if(p) {
        p.pushTo(name, factoryName, paramName);
    }
    return this;
} else {

    var currentRole = this.getRole();
    if(!currentRole) currentRole = "default";
    
    var view = this.findViewByName( name, this._activeLayout.view );
    
    if(!view) {
        return;
    }
    
    if(!_viewCache) _viewCache = {};
    
    var obj, wf;
    var me = this, cache_key;
    
    if(!paramName) paramName = "";
    if(this.isObject( factoryName) ) {
        obj = factoryName;
        cache_key = currentRole+"."+factoryName+"."+paramName;
    } else {
        
        // returns the function which creates the view
        wf = this.findViewFactory( factoryName, currentRole );
        if(!wf) wf = this.findViewFactory( factoryName, "default" );
        // factory function object has the cache
        if(wf && !wf._viewCache) wf._viewCache = {};
   
        // views with same params will be cached
        cache_key = currentRole+"."+factoryName+"."+paramName;
   
        if(wf) {
            if(wf._viewCache[cache_key]) {
                obj = wf._viewCache[cache_key];
            } else {
                var f = wf;
                if(f) {
                    obj = f( paramName );
                    if(obj) {
                        wf._viewCache[cache_key] = obj;
                    }
                }
            }
        }
    }
    
    if(obj) {
        
        if(!this._activeLayout.parts) this._activeLayout.parts = {};
        this._activeLayout.parts[name] = view;
        
        // view = the div or element the object created by the factory is pushed into
        // for example "top" in layout top 100% | content 100%
        view.pushView( obj );
        
        // to emulate React.js behaviour...
        if(obj.componentDidMount) {
            obj.componentDidMount();
        }
        obj.trigger("mount");
        
        // in case the view should be refreshed with some other 
        obj._refeshView = {
            name : name,
            factoryName : factoryName,
            paramName : paramName,
            view : view,
            activeLayout : this._activeLayout
        }

        if(wf && wf._dynamic && !wf._binded) {
            wf._binded = true;
            wf._dynamic.on("body", function(o,v) {
                try {
                    var newF = new Function(v);
                    var newObj = newF( paramName );
                    if(newObj) {
                        obj.replaceWith( newObj );
                        obj = newObj;
                        
                        wf._container._viewFactory[factoryName] = newF;
                        if(newF && !newF._viewCache) newF._viewCache = {};
                        newF._viewCache[cache_key] = newObj;
                    }
                } catch(e) {
                    
                }
            });
        }
    }
}

```

### <a name="viewsNavis_pushView"></a>viewsNavis::pushView(newView, params, oldViewHolder)


*The source code for the function*:
```javascript

if(this._contentObj) {
    return this._contentObj.pushView.apply(this._contentObj, Array.prototype.slice.call(arguments));
}

if(!this._views) {
    this._views = [];
}

if(!_eventState) _eventState = {};
if(newView == this) return;
if(newView == lastView) return;

var cont = this;
if(cont._children && cont._children[0]==newView) {
    // console.error("... pushing view failed because this view had already the child view???.... ", newView);
    return;
}

if(this.isFunction(newView)) {
    newView = newView();
}

var ms = (new Date()).getTime();
if(this._transitionOn && ( ms - this._transitionOn < 1000)) return;
this._transitionOn = ms;

if(!params) params = null;

var oldChildren = oldViewHolder || _e();

var viewData = {
    parentView : null,
    oldTitle : this.__currentTitle,
    oldChildren : oldChildren,
    params : params
};        
if(window) {
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
cont.forChildren(function(ch) {

    hadChildren = true;
    // fadeout, fadein, not used here...
    later().after(0.3, function() {

        newView.removeClass("viewOut");
        newView.removeClass("viewIn");
        
        newView.addClass("viewIn");    
        cont.add(newView);
         
        newView.show();
        showP = false;
        
        later().after(0.2, function() {
            
            me._transitionOn = 0;
            newView.scrollTo();
        });
    });
    ch.removeClass("viewIn");
    ch.removeClass("viewOut");
    ch.addClass("viewOut");
    later().after(0.2, function() {
        oldChildren.add(ch);
    });
});
this._views.push(viewData);
if(!hadChildren) {

    later().after(0.3, function() {
        newView.removeClass("viewIn");
        newView.removeClass("viewOut");
        newView.addClass("viewIn");
        cont.add(newView);
        
        newView.show();

        later().after(0.2, function() {
            me._transitionOn = 0;
            newView.scrollTo();
        });        
    });
}

_eventState.pushing = false;

return this;
```

### <a name="viewsNavis_scrollTo"></a>viewsNavis::scrollTo(yPosition, xPosition)
`yPosition` Given y scroll position
 
`xPosition` Given x position
 

Make the window scroll to this element
*The source code for the function*:
```javascript
if(window) {
    var currLeft = xPosition || window.pageXOffset;
    var currTop = window.pageYOffset;
    var pageHeight = window.innerHeight;
    if(yPosition) {
        var toY = yPosition;
        var dy = parseInt(toY) - currTop;
        if(Math.abs(dy) < 200) {
            if( ( (currTop + pageHeight - 200) > toY) &&
                ( toY > currTop ) 
            ){
                return;
            }
        }
        later().ease("pow", 600, function(t) {
            window.scrollTo(currLeft || 0, parseInt(currTop + dy*t));
        });        
        // window.scrollTo( currLeft, parseInt(yPosition));
        return this;
    }
    
    var box = this.offset();

    var toY = box.top - (pageHeight * 0.3);
    if(toY<0) toY = 0;

    var dy = parseInt(toY) - currTop;

    if(Math.abs(dy) < 200) {
        if( ( (currTop + pageHeight - 200) > toY) &&
            ( toY > currTop ) 
        ){
            return;
        }
    }    
    
    later().ease("pow", 600, function(t) {
        window.scrollTo(currLeft || 0, parseInt(currTop + dy*t));
    });
    
}
return this;
```


    
    
    
## trait mvc_trait

The class has following internal singleton variables:
        
* _viewContent
        
* _viewTemplates
        
* _namedViews
        
* _dataLink
        
* _customDirectives
        
        
### <a name="mvc_trait__findSendHandler"></a>mvc_trait::_findSendHandler(url)


*The source code for the function*:
```javascript

if(this._sendHook) {
    var h = this._sendHook[url];
    if(h) return h;
    var h = this._sendHook["*"]; // catch all if "*" is used.
    if(h) return h;    
}
// don't use the .parent() because it will skip the component
var p = this._parent;
if(p) {
    var had = p._findSendHandler(url);
    if(had) return had;
}

var cp = this._contentParent;
if(cp) {
    var had = cp._findSendHandler(url);
    return had;
}

```

### <a name="mvc_trait_clickTo"></a>mvc_trait::clickTo(eventName, eventParams)


*The source code for the function*:
```javascript

var id = eventParams;
if(this.isObject(id)) {
    if(id.getID) id = id.getID();
}
this.on("click", function() {
    this.send(eventName, id);
})
return this;
```

### <a name="mvc_trait_createItemView"></a>mvc_trait::createItemView(item)


*The source code for the function*:
```javascript
var vf = this.getViewFunction(item),
    me = this,
    newView;
if(vf) {
    newView = vf(item);
    
    if(item.viewClass) {
        if(this.isFunction(item.viewClass)) {
            var oo = item.viewClass(null, true);
            var oldClass = item.viewClass();
            var myEventH = function(o,v) {
                if(oldClass!=v) {
                    var nv = me.createItemView(item);
                    oldClass = v;
                    newView.replaceWith(nv);
                    newView = nv;
                    oo.me.removeListener(oo.name, myEventH);
                }
            };
            oo.me.on(oo.name, myEventH );
        }
    }

}
return newView;
```

### <a name="mvc_trait_data"></a>mvc_trait::data(v)


*The source code for the function*:
```javascript
if(typeof(v) != "undefined") {
    this.__mdata = v;
    return this;
}
return this.__mdata;
```

### <a name="mvc_trait_forwardData"></a>mvc_trait::forwardData(dataObj, variables, filterFn)

for example   window.forwardData( winDefData, "x,y, w => width, h => height, title=>text");
*The source code for the function*:
```javascript
var list = variables.split(",");
var me = this;
list.forEach( function(vName) {
    vName = vName.trim();
    var targetFn = vName;
    var parts = vName.split("=>");
    if(parts.length>1) {
      vName = parts[0].trim();
      targetFn = parts[1].trim();
    }
    dataObj.on(vName, function(o,v) {
    
    try {
       if(filterFn) {
         v = filterFn.apply( me, [ vName, v] );
       }              
       if(typeof(v) != "undefined") {
         if(me[targetFn]) 
             me[targetFn]( v );
       }
    } catch(e) {
       console.error(e.message);
    }
    });
    var value = dataObj.get(vName);
    if(filterFn) {
    value = filterFn.apply( me, [ vName, value] );
    }           
    if(typeof(value) != "undefined") {
    if(me[targetFn]) me[targetFn]( value );
    }
})
```

### <a name="mvc_trait_fromStream"></a>mvc_trait::fromStream(stream, viewFn)


*The source code for the function*:
```javascript

var me = this;

stream.onValue( function(data) {
    var newView = viewFn( data );
    later().add( function() {
        me.clear();
        me.add( newView );
    });
});
```

### <a name="mvc_trait_getViewFunction"></a>mvc_trait::getViewFunction(item)


*The source code for the function*:
```javascript
if(this.isFunction(this._view)) {
    return this._view;
}
if(item.viewClass) {
    var vf;
    if(vf=this._view[item.viewClass()])
        return vf;
}
// if no other options...
for(var n in this._view) {
    if(this._view.hasOwnProperty(n)) {
        var vf = this._view[n];
        if(this.isFunction(vf)) {
            return vf;
        }
    }
}
```

### mvc_trait::constructor( t )

```javascript

```
        
### <a name="mvc_trait_model"></a>mvc_trait::model(t)


*The source code for the function*:
```javascript
return this.state();
```

### <a name="mvc_trait_mvc"></a>mvc_trait::mvc(model, view, controller)


*The source code for the function*:
```javascript
if(this._contentObj) {
    return this._contentObj.mvc.apply(this._contentObj, Array.prototype.slice.call(arguments));
}

var me = this;
if(view) {
    this._view = view;
}

if(model) {
    // assume now that it is array 
    this._model = model;
    
    // TODO: sort, delete, move...
    if(this._model.on) {
        this._model.on("insert", function(o,i) {
            var item = me._model.item(i);
            var nv = me.createItemView(item);
            if(nv) {
                me.insertAt(i,nv);
            } 
        });
        
        this._model.on("move", function(o, cmd) {

            var old = me.child(cmd.from),
                after = me.child(cmd.to);

            if(!after || !old) {
                return;
            }
            
            if(cmd.to < cmd.from) {
                after.insertBefore(old);
            } else {
                after.insertAfter(old);
            }
        });
        this._model.on("remove", function(o,i) {

            var ch = me.child(i);
            if(ch) {
                ch.remove(); 
            }
        });
        this._model.on("sort", function(o,ops) {
            
            if(ops.length==0) return;
            
            if(me.isObject(ops[0][1])) return;
            
            var tmpOps = new Array();
            
            for(var i=0; i<ops.length;i++) {
                if(ops[i][1]==ops[i][2]) {
                    ops[i][0] = null;
                    continue;
                }
                tmpOps[i] = new Array(3);
                tmpOps[i][1] = me.child(ops[i][1]);
                tmpOps[i][2] = me.child(ops[i][2]);
            } 
            
            // console.log("Sort with", ops, JSON.stringify(ops));
            for(var i=0; i<tmpOps.length;i++) {
                var c1 = tmpOps[i][1],
                    c2 = tmpOps[i][2],
                    cmd = ops[i][0];
                if(cmd=="a") {
                   c2.insertBefore(c1); 
                } 
                if(cmd=="b") {
                   c2.insertAfter(c1); 
                }
            }            

        });
    }
    
    if(this._model.forEach) {
        this._model.forEach( function(item) {
            var nv = me.createItemView(item);
            if(nv) {
                me.add(nv);
            }            
        });
    }
    
}

if(controller) {
    this._controller = controller;
}
return this;
```

### <a name="mvc_trait_onMsg"></a>mvc_trait::onMsg(url, handlerFunction, context)


*The source code for the function*:
```javascript
if(!this._sendHook) {
    this._sendHook = {};
}

if(!this._sendHook[url]) {
    this._sendHook[url] = [];
}

if(context) handlerFunction._context = context;

this._sendHook[url].unshift( handlerFunction );
```

### <a name="mvc_trait_send"></a>mvc_trait::send(url, data, callBack, errorCallback)
`url` URL or controller name to send the data to
 

You can create a send handler using

```
obj.sendHandler(url, function(data, result, fail) { });
```

To send into this url use
```
  obj.send(url, data, function(result) {
     
  });
```
*The source code for the function*:
```javascript

var me = this;
later().add(
    function() {
        var list = me._findSendHandler(url);
        if(list) {
            for(var i=0; i<list.length; i++) {
                var fn = list[i];
                var res = fn.apply( fn._context || me, [data, callBack, errorCallback, url] );
                if(res === true) {
                    return;
                }
            }
        } else {
            if(errorCallback) {
                errorCallback("Controller or send handler for "+url+" was not found");
            } else {
                console.error("controller for message "+url+" was not found");
            }
        }
});

```

### <a name="mvc_trait_sendHandler"></a>mvc_trait::sendHandler(url, handlerFunction, context)
`context` value of &quot;this&quot; when the handler is going to be called
 


*The source code for the function*:
```javascript
return this.onMsg( url, handlerFunction, context );
```

### <a name="mvc_trait_sendMsg"></a>mvc_trait::sendMsg(url, data, callBack, errorCallback)


*The source code for the function*:
```javascript
return this.send( url, data, callBack, errorCallback);
```


    
    
    
## trait svgShortcuts

The class has following internal singleton variables:
        
        
### <a name="svgShortcuts_circle"></a>svgShortcuts::circle(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("circle", className, attrs);
return el;
```

### <a name="svgShortcuts_defs"></a>svgShortcuts::defs(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("defs", className, attrs);
return el;
```

### <a name="svgShortcuts_feGaussianBlur"></a>svgShortcuts::feGaussianBlur(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("feGaussianBlur", className, attrs);
return el;
```

### <a name="svgShortcuts_feMerge"></a>svgShortcuts::feMerge(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("feMerge", className, attrs);
return el;
```

### <a name="svgShortcuts_feMergeNode"></a>svgShortcuts::feMergeNode(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("feMergeNode", className, attrs);
return el;
```

### <a name="svgShortcuts_feOffset"></a>svgShortcuts::feOffset(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("feOffset", className, attrs);
return el;
```

### <a name="svgShortcuts_filter"></a>svgShortcuts::filter(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("filter", className, attrs);
return el;
```

### <a name="svgShortcuts_g"></a>svgShortcuts::g(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("g", className, attrs);
return el;
```

### <a name="svgShortcuts_image"></a>svgShortcuts::image(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("image", className, attrs);
return el;
```

### <a name="svgShortcuts_line"></a>svgShortcuts::line(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("line", className, attrs);
return el;
```

### <a name="svgShortcuts_path"></a>svgShortcuts::path(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("path", className, attrs);
return el;
```

### <a name="svgShortcuts_rect"></a>svgShortcuts::rect(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("rect", className, attrs);
return el;
```

### <a name="svgShortcuts_svg"></a>svgShortcuts::svg(className, attrs, none)


*The source code for the function*:
```javascript
var el = this.shortcutFor("svg", className, attrs);
return el;
```

### <a name="svgShortcuts_svg_text"></a>svgShortcuts::svg_text(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("text", className, attrs);
return el;
```

### <a name="svgShortcuts_tspan"></a>svgShortcuts::tspan(className, attrs)


*The source code for the function*:
```javascript
var el = this.shortcutFor("tspan", className, attrs);
return el;
```


    
    
    
## trait util_fns

The class has following internal singleton variables:
        
        
### <a name="util_fns_guid"></a>util_fns::guid(t)


*The source code for the function*:
```javascript
return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
```

### <a name="util_fns_isArray"></a>util_fns::isArray(someVar)


*The source code for the function*:
```javascript
return Object.prototype.toString.call( someVar ) === '[object Array]';
```

### <a name="util_fns_isFunction"></a>util_fns::isFunction(fn)


*The source code for the function*:
```javascript
return Object.prototype.toString.call(fn) == '[object Function]';
```

### <a name="util_fns_isObject"></a>util_fns::isObject(obj)


*The source code for the function*:
```javascript
return obj === Object(obj);
```

### <a name="util_fns_isStream"></a>util_fns::isStream(obj)


*The source code for the function*:
```javascript

if(this.isObject(obj)) {
    if(obj.onValue && obj.bufferWithTime) return true;
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
```

### <a name="util_fns_str"></a>util_fns::str(params)


*The source code for the function*:
```javascript

var args;
if(this.isArray(params)) {
    args = params;
} else {
    args = Array.prototype.slice.call(arguments);
}

// Supports Bacon.js streams at the moment...
var bHadStream = false, me = this;
var indexes = [], streams = [], all = [];
args.forEach( function(item, i) {
    if(me.isStream(item)) {
        bHadStream = true;
        all.push("");
    } else {
        all.push(item);
    }
});
if(!bHadStream) return args.join("");

return Bacon.fromBinder(function(sink) {
    
    args.forEach( function(item, i) {
        if(me.isStream(item)) {   
            item.onValue( function(v) {
                all[i] = v;
                sink(all.join(""));
            })
        }
    });
    
    later().add( function() {
        sink(all.join(""));
    });

    return function() {
        
    };
});



```

### <a name="util_fns_whenLoaded"></a>util_fns::whenLoaded(imgList, fn)


*The source code for the function*:
```javascript

var cnt = imgList.length;

imgList.forEach( function(im) {
    im.on("load", function() {
        cnt--;
        if(cnt==0) {
            fn(imgList);
        }
    }) 
});

if(imgList.length==0) fn([]);

```


    
    
    
    
    
    
    
## trait colors_trait

The class has following internal singleton variables:
        
* colors
        
        
### <a name="_colorMix"></a>::colorMix(c1, c2, t)


*The source code for the function*:
```javascript

var from = this.toRGB(c1),
    to = this.toRGB(c2);
    
var res = this.yuvConversion2(from,to, function(y1,y2) {
    return {
        y : (1-t)*y1.y + t*y2.y,
        u : (1-t)*y1.u + t*y2.u,
        v : (1-t)*y1.v + t*y2.v
    }
});

return res;
```

### <a name="_colorToHex"></a>::colorToHex(color)


*The source code for the function*:
```javascript
if (color.substr(0, 1) === '#') {
    return color;
}
var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

var red = parseInt(digits[2]);
var green = parseInt(digits[3]);
var blue = parseInt(digits[4]);

var rgb = blue | (green << 8) | (red << 16);
return digits[1] + '#' + rgb.toString(16);
```

### <a name="_colourNameToHex"></a>::colourNameToHex(colour)


*The source code for the function*:
```javascript

if (typeof colors[colour.toLowerCase()] != 'undefined')
    return colors[colour.toLowerCase()];

return false;
```

### <a name="_componentToHex"></a>::componentToHex(c)


*The source code for the function*:
```javascript
c = parseInt(c);
var hex = c.toString(16);
return hex.length == 1 ? "0" + hex : hex;
```

### <a name="_dim"></a>::dim(colorName, brightness)


*The source code for the function*:
```javascript
return this.yuvConversion( colorName, function(yuv) {
        yuv.y = yuv.y - brightness;
        return yuv;
    });
```

### <a name="_hexToRgb"></a>::hexToRgb(hex)


*The source code for the function*:
```javascript
if (hex[0]=="#") hex=hex.substr(1);
if (hex.length==3) {
    var temp=hex; hex='';
    temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
    for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
}
if(!hex) return null;
if(hex==null) return;
var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);

return {
    r: parseInt(triplets[0],16),
    g: parseInt(triplets[1],16),
    b: parseInt(triplets[2],16)
}
```

### <a name="_hexToYuv"></a>::hexToYuv(hexVal)


*The source code for the function*:
```javascript
var me = this;
return me.rgbToYuv( me.toRGB(hexVal) );
```

### ::constructor( t )

```javascript

if(!colors) {
    colors = {"none": "#ffffff", 
        "black":"#000000",
        "blue":"#0000ff",
        "brown":"#a52a2a",
        "cornflowerblue":"#6495ed",
        "cyan":"#00ffff",
        "darkblue":"#00008b","darkcyan":"#008b8b",
        "gray":"#808080","green":"#008000",
        "magenta":"#ff00ff","orange":"#ffa500",
        "pink":"#ffc0cb","purple":"#800080",
        "red":"#ff0000","turquoise":"#40e0d0",
        "violet":"#ee82ee", "white":"#ffffff",
        "skyblue":"#87ceeb",
        "yellow":"#ffff00"};
}
```
        
### <a name="_mix"></a>::mix(c1, c2, amount)


*The source code for the function*:
```javascript

if(typeof(amount)=="undefined") amount = 0.5;

return this.yuvConversion2( c1,c2, function(y1,y2) {
    return {
        y : (1-amount) * y1.y + amount * y2.y,
        u : (1-amount) * y1.u + amount * y2.u,
        v : (1-amount) * y1.v + amount * y2.v
    }
})
```

### <a name="_rgbToHex"></a>::rgbToHex(p)


*The source code for the function*:
```javascript
var me = this;
return "#" + me.componentToHex(p.r) + me.componentToHex(p.g) + me.componentToHex(p.b);
```

### <a name="_rgbToYuv"></a>::rgbToYuv(c)


*The source code for the function*:
```javascript
var R = c.r / 255;
var G = c.g / 255;
var B = c.b / 255;
return { y : 0.299 * R + 0.587 * G + 0.114 * B,
         u  : -0.14713  * R - 0.28885 * G + 0.436*B,
         v:  0.615 * R - 0.51499*G - 0.10001*B  }
```

### <a name="_toRGB"></a>::toRGB(c)


*The source code for the function*:
```javascript
if(typeof(c)=="object") return c;
var me = this;

var hex = me.colourNameToHex(c);
if(!hex) {
    hex = me.colorToHex(c);
}
return me.hexToRgb(hex);
```

### <a name="_toRSpace"></a>::toRSpace(v)


*The source code for the function*:
```javascript
return Math.max(0, Math.min(255, Math.round(v)));
```

### <a name="_yuvConversion"></a>::yuvConversion(c, fn)


*The source code for the function*:
```javascript
var me = this;
var yuv = me.rgbToYuv( me.toRGB(c) );
yuv = fn(yuv);
var rgb = me.yuvToRgb( yuv );
return me.rgbToHex( rgb );
```

### <a name="_yuvConversion2"></a>::yuvConversion2(c1, c2, fn)


*The source code for the function*:
```javascript
var me = this;
var yuv = me.rgbToYuv( me.toRGB(c1) );
var yuv2 = me.rgbToYuv( me.toRGB(c2) );
yuv = fn(yuv, yuv2);
var rgb = me.yuvToRgb( yuv );
return me.rgbToHex( rgb );
```

### <a name="_yuvPixelConversion"></a>::yuvPixelConversion(c, fn)


*The source code for the function*:
```javascript
var yuv = me.rgbToYuv( c );
yuv = fn(yuv);
var rgb = me.yuvToRgb( yuv );
c.r = rgb.r;
c.g = rgb.g;
c.b = rgb.b;
return c;
```

### <a name="_yuvToRgb"></a>::yuvToRgb(c)


*The source code for the function*:
```javascript
var Y = c.y;
var U = c.u;
var V = c.v;

return {    r : this.toRSpace(255*(Y+ 0 * U + 1.13983 * V)),
            g : this.toRSpace(255*(Y -0.39465 * U  -0.58060 * V)),
            b : this.toRSpace(255*(Y + 2.03211 * U  )) }
```


    
    
    
## trait ajax_methods

The class has following internal singleton variables:
        
* x
        
* _ajaxHook
        
* _uploadHook
        
* _loadedLibs
        
        
### <a name="__httpsend"></a>::_httpsend(url, callback, method, data, errorCallback)
`url` request target url
 
`callback` function to receive HTTP return value
 
`method` POST or GET
 
`data` String data to send
 
`errorCallback` error function
 


*The source code for the function*:
```javascript
var x = this._initAjax();
x.open(method, url);
x.onreadystatechange = function() {
    if (x.readyState == 4) {
        if (x.status==200) {
            callback(x.responseText)
        } else {
            errorCallback(x);
        }
    }
};
if (method == 'POST') {
    x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
}
x.send(data);
return this;

```

### <a name="__initAjax"></a>::_initAjax(t)


*The source code for the function*:
```javascript
if (typeof XMLHttpRequest !== 'undefined') {
    return new XMLHttpRequest();  
}
var versions = [
    "MSXML2.XmlHttp.6.0",
    "MSXML2.XmlHttp.5.0",   
    "MSXML2.XmlHttp.4.0",  
    "MSXML2.XmlHttp.3.0",   
    "MSXML2.XmlHttp.2.0",  
    "Microsoft.XmlHttp"
];

var xhr;
for(var i = 0; i < versions.length; i++) {  
    try {  
        xhr = new ActiveXObject(versions[i]);  
        break;  
    } catch (e) {
    }  
}
return xhr;
```

### <a name="__traditionalUpload"></a>::_traditionalUpload(options)


*The source code for the function*:
```javascript

var o = _e();
var form = o.form("",{
    "action" :  options.url,
    "enctype" : "multipart/form-data",
    "method" : "POST",
    "name" : o.guid()
});

var maxCnt = options.maxCnt || 1;
var chStr = "complete"+this.guid();
var toBeRemoved = [];

var onComplete = function(v) {
   delete window[chStr];
   if(options.progress) {
        var info = {
            loadPros : 100,
            ready : true
        };
        options.progress( info );   
   }
   if(options.done) {
       options.done(v);
   }  
};

window[chStr] = onComplete;
form.input("", {
    type : "hidden",
    value : chStr,
    name : "onComplete"
});

if(options.vars) {
    for(var n in options.vars) {
        if(options.vars.hasOwnProperty(n)) {
            form.input("", {
                type : "hidden",
                value : options.vars[n],
                name : n
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
var createUploadField = function() {
    if(fileCnt>=maxFileCnt) return;
    // <label for="exampleInputFile">File input</label>
    var inp = uplFields.input("", {
         type : "file",
         name : options.fieldName || "newFile"+(fieldNumber++),
         size : 50
    });
    inp.on("value", function() {
        if(options.autoupload) {
            o.uploadFiles();
        } else {
            if(fileCnt<maxCnt) createUploadField(); 
        }
    });
    
    fileCnt++;
}

createUploadField();
var iFrame = _e("iframe");
var frame_id = o.guid();
iFrame.q.attr("id", frame_id);
iFrame.q.attr("name", frame_id);
iFrame.absolute().x(-4000).y(-4000);

var loadCnt = 0;

// iFrame._dom.onreadystatechange = MyIframeReadyStateChanged;
iFrame._dom.addEventListener("load", function() {
    uploadInProgress = false;
    loadCnt++;
    if(loadCnt==1) return;
    
    // remove the input
    toBeRemoved.forEach( function(oldInput) {
        oldInput.remove();
    })
    if(options.done) {
        
        var ifrm = iFrame._dom;
        var doc = ifrm.contentDocument? ifrm.contentDocument: ifrm.contentWindow.document;
        // var form = doc.getElementById('demoForm');        
       if(options.progress) {
            var info = {
                loadPros : 100,
                ready : true
            };
            options.progress( info );   
       }        
       if(options.done) {
           var ihtml = doc.body.innerHTML;
           if(ihtml) options.done(ihtml);
       }
    }
})
o.add( iFrame );

o.uploadFiles = function(vars) {

    if(uploadInProgress) return;
    uploadInProgress = true;
    
    var hook = _uploadHook && _uploadHook[options.url];
    if(hook) {
        
        var sendData = {
            traditional : true,
            postData : {},
            files : []
        };
        if(options.vars) {
             if(options.vars) {
                for(var n in options.vars) {
                    if(options.vars.hasOwnProperty(n)) {
                        sendData.postData[n] = options.vars[n];
                    }
                }
            }           
        }        
        uplFields.forEach(
            function(input) {
                toBeRemoved.push(input);
                if(!input._dom.files) return;
                var len = input._dom.files.length;
                for(var fi=0; fi<len; fi++) {
                    var file = input._dom.files[fi];
                    if (file) {
                        sendData.files.push(file);
                    }
                } 
            });
        
        try {
            var progress = 0;
            var sendI = setInterval(
                function() {
                    progress+= Math.random()*(options.uploadSpeed || 10);
                    if(progress>100) progress = 100;
                    
                    if(progress == 100) {
                        var res = hook(sendData);
                        if(options.done) {
                            options.done(res);
                        } 
                        clearInterval(sendI);
                    }
                    if(options.progress) options.progress({
                                                loadPros : parseInt( progress ),
                                                ready : parseInt( progress ) == 100
                                            }); 
                               
                },30);
        } catch(e) {
            if(options.error) {
                options.error(e.message);
            }              
        }
        return;
    }    
    
    if(vars) {
        for(var n in vars) {
            if(vars.hasOwnProperty(n)) {
                form.input("", {
                    type : "hidden",
                    value : vars[n],
                    name : n
                });
            }
        }        
    }
    form._dom.target = frame_id; //'my_iframe' is the name of the iframe
	form._dom.submit();

}

if(options.getUploader) {
    options.getUploader(o.uploadFiles);
}
o.on("upload", function(o, v) {
    o.uploadFiles( v || {} );   
});
return o;


```

### <a name="_ajaxHook"></a>::ajaxHook(url, handlerFunction)


*The source code for the function*:
```javascript
if(!_ajaxHook) {
    _ajaxHook = {};
}

if(!_ajaxHook[url]) {
    _ajaxHook[url] = [];
}

_ajaxHook[url].unshift( handlerFunction );

```

### <a name="_appendToHead"></a>::appendToHead(elemType, url)


*The source code for the function*:
```javascript

if(!url) {
    url = elemType;
    var parts = url.split(".");
    elemType = parts.pop(); // for example file.css -> css
}
var p = this.__promiseClass();
if(p) {
    if(!_loadedLibs) {
        _loadedLibs = {};
    }
    // if loading, return the promise
    if(_loadedLibs[url]) {
        return _loadedLibs[url];
    }
    _loadedLibs[url] = new p(
        function(accept, fail) {

            var ext;
            if(elemType == "js") {
                ext = document.createElement("script");
                ext.src = url;
            }
            if(elemType == "css") {
                ext = document.createElement("link");
                ext.setAttribute("rel", "stylesheet");
                ext.setAttribute("type", "text/css");
                ext.setAttribute("href", url);        
                 
            }
            if(!ext) {
                fail("Unknown element type "+url);
                return;
            }
            ext.onload = function () {
                accept(url);
            }
            ext.onerror = function() {
                fail(url);
            }     
            document.head.appendChild(ext);

        });
    return _loadedLibs[url];
}

```

### <a name="_createUploader"></a>::createUploader(options)


*The source code for the function*:
```javascript

if(options.testTraditional || typeof(window.FormData) == "undefined") {
    return this._traditionalUpload(options);
}

// The file uploader
var inp = _e("input").addClass("uploader-field");
inp.q.attr("type", "file");

// uploader basic settings
inp._uploadGUID = "uploadField"+this.guid();
inp.q.attr("id", inp._uploadGUID);
inp.q.attr("name", inp._uploadGUID);

if(options.audio) {
   inp.q.attr("capture", "microphone");
   inp.q.attr("accept", "audio/*");    
}
if(options.video) {
   inp.q.attr("capture", "camcorder");
   inp.q.attr("accept", "video/*");    
}
if(options.images) {
   inp.q.attr("capture", "camera");
   inp.q.attr("accept", "image/*");
}

/*
<p>Capture Image: <input type="file" accept="image/*" id="capture" capture="camera"> 
<p>Capture Audio: <input type="file" accept="audio/*" id="capture" capture="microphone"> 
<p>Capture Video: <input type="file" accept="video/*" id="capture" capture="camcorder"> 
*/

// upload handler here...
var upload = function(uploadElement) {

    var hook = _uploadHook && _uploadHook[options.url];
    if(hook) {
        
        var sendData = {
            postData : {},
            files : []
        };
        if(options.vars) {
             if(options.vars) {
                for(var n in options.vars) {
                    if(options.vars.hasOwnProperty(n)) {
                        sendData.postData[n] = options.vars[n];
                    }
                }
            }           
        }        
        var len = uploadElement.files.length;
        for(var fi=0; fi<len; fi++) {
            var file = uploadElement.files[fi];
            if (file) {
                sendData.files.push(file);
            }
        } 
        try {
            var progress = 0;
            var sendI = setInterval(
                function() {
                    progress+= Math.random()*(options.uploadSpeed || 10);
                    if(progress>100) progress = 100;
                    
                    if(progress == 100) {
                        var res = hook(sendData);
                        if(options.done) {
                            options.done(res);
                        } 
                        clearInterval(sendI);
                    }
                    if(options.progress) options.progress({
                                                loadPros : parseInt( progress ),
                                                ready : parseInt( progress ) == 100
                                            }); 
                               
                },30);
        } catch(e) {
            if(options.error) {
                options.error(e.message);
            }              
        }
        return;
    }

    var len = uploadElement.files.length;
    for(var fi=0; fi<len; fi++) {
        var file = uploadElement.files[fi];
        if (file) {
            var formData = new window.FormData();
            if(options.vars) {
                 if(options.vars) {
                    for(var n in options.vars) {
                        if(options.vars.hasOwnProperty(n)) {
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
                        if(options.done) {
                            options.done(xhr.responseText);
                        }
                    } else {
                        if(options.error) {
                            options.error(xhr.responseText, xhr );
                        }                    
                    }
                }
            };
            xhr.open('POST', options.url);
            if(options.progress && xhr.upload) {
                xhr.upload.onprogress = function (e) {
                            if (e.lengthComputable) {
                                var done = (e.loaded / e.total) * 100;
                                var info = {
                                    loadPros : done,
                                    ready : false
                                };
                                if(e.loaded==e.total) {
                                    info.ready = true;
                                }
                                options.progress( info );
                            }
                        }            
            }
            xhr.send(formData);
        }
    }
}

inp._dom.addEventListener('change', function(event) {
    
    if(options.autoupload) {
        if(event.target.files.length == 1 ) {
            upload(inp._dom);
        }
    }
    if(options.onSelectFile) {
        var len = inp._dom.files.length;
        for(var fi=0; fi<len; fi++) {
            var file = inp._dom.files[fi];   
            options.onSelectFile( file, file.type );
        }
    }

	});
inp.on("upload", function() {
    if(inp._dom.files.length >= 1 ) {
        upload(inp._dom);
    }    
});
return inp;

```

### <a name="_fileObjectThumbnail"></a>::fileObjectThumbnail(width, height, fileObject)


*The source code for the function*:
```javascript
var reader = new FileReader();
var myImage = _e("img");
var me = this;

myImage.width( width );
myImage.height( height );

reader.onload = function(event){
    var img = myImage._dom;
    img.onload = function(){
        me.add( myImage );
    }
    img.src = event.target.result;
}
reader.readAsDataURL(fileObject);    
return myImage;
```

### <a name="_get"></a>::get(url, data, callback)


*The source code for the function*:
```javascript
var query = [];
if(this.isFunction(data)) {
    callback = data;
    this._httpsend(url, callback, 'GET', null);
} else {
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    this._httpsend(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null);
}
return this;


```

### <a name="_getJSON"></a>::getJSON(url, data, callback)


*The source code for the function*:
```javascript
var query = [];
if(this.isFunction(data)) {
    callback = data;
    this._httpsend(url, function(r) {
        callback(JSON.parse(r));
    }, 'GET', null);
} else {
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    this._httpsend(url + (query.length ? '?' + query.join('&') : ''), function(r) {
        callback(JSON.parse(r));
    }, 'GET', null);
}
return this;

```

### <a name="_post"></a>::post(url, data, callback, errCallback)


*The source code for the function*:
```javascript

if(_ajaxHook && _ajaxHook[url]) {
    try {
        for( var i=0; i<_ajaxHook[url].length;i++) {
            var ff = _ajaxHook[url][i];
            var res = ff( data );
            if(res) {
                callback( res );
                return;
            }
        }
    } catch(e) {
        if(errCallback) errCallback(e);
    }
    return this;
}

var query = [];
for (var key in data) {
    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
}
this._httpsend(url, callback, 'POST', query.join('&'), errCallback);

return this;

```

### <a name="_postJSON"></a>::postJSON(url, data, callback, errCallback)


*The source code for the function*:
```javascript

if(_ajaxHook && _ajaxHook[url]) {
    try {
        for( var i=0; i<_ajaxHook[url].length;i++) {
            var ff = _ajaxHook[url][i];
            var res = ff( data );
            if(res) {
                callback( res );
                return;
            }
        }
    } catch(e) {
        if(errCallback)  errCallback(e);
    }
    return this;
}
this._httpsend(url, function(result) {
    try {
        var data = JSON.parse(result);
        if(callback) callback(data);
    } catch(e) {
        if(errCallback) errCallback(e);
    }
}, 'POST', JSON.stringify(data), errCallback);

return this;

```

### <a name="_uploadHook"></a>::uploadHook(url, handlerFunction)


*The source code for the function*:
```javascript
if(!_uploadHook) {
    _uploadHook = {};
}

_uploadHook[url] = handlerFunction;
```


    
    
    
## trait web_comp

The class has following internal singleton variables:
        
* _customElems
        
* _instances
        
        
### <a name="__findComp"></a>::_findComp(t)

Finds the first parent component
*The source code for the function*:
```javascript
if(!this._compBaseData) {
    var p = this._parent;
    if(p) return p._findComp();
    return null;
}
return this;
```

### <a name="__findCustomElem"></a>::_findCustomElem(name)


*The source code for the function*:
```javascript

if(this._customElems) {
    var e = this._customElems[name];
    if(e) return e;
}
var p = this.parent();
if(p) return p._findCustomElem(name);

if(_customElems) return _customElems[name];


```

### <a name="__initCustom"></a>::_initCustom(elem, customElem, parentE, attrObj, givenBaseData)
`elem` _e() element to init the element to
 
`customElem` Custom element initialization data
 


*The source code for the function*:
```javascript

var baseData;

// getInitialState

if(elem._compBaseData) {
    baseData = elem._compBaseData;
} else {

    if(customElem.data ) {
        // if there is attributes set for the object
        baseData = _data(JSON.parse(JSON.stringify(customElem.data)));
    } else {
        if(customElem.getDefaultProps) {
            baseData = _data(customElem.getDefaultProps());
        } else {
            baseData = _data({});
        }
    }        

    elem._compBaseData = baseData;
    if(this.isObject(attrObj)) {
        var oo = attrObj;
        // TODO: make this batter, now only one-dimensional :/ 
        for( var n in oo) {
            if(oo.hasOwnProperty(n)) {
                elem.attr(n, oo[n]);
            }
        }  
    }     
}

if(customElem.baseCss) {
    if(elem._customCssBase) elem.removeClass( elem._customCssBase  );
    elem.addClass( customElem.baseCss._nameSpace);
    elem._customCssBase = customElem.baseCss._nameSpace;
}

var current_ch = [];
if(elem._contentObj) {
    elem._contentObj.forChildren( function(ch) {
         current_ch.push(ch);
    });
}

if(parentE) {
    elem._contentParent = parentE;
}

// -- initialize the controllers --
var known = ["data", "css", "init", "render", "baseCss"];
for( var prop in customElem ) {
    if(customElem.hasOwnProperty(prop)) {
        var fn = customElem[prop];
        if(this.isFunction(fn)) {
            var me = this;
            (function(fn) {
                elem.sendHandler(prop, function(params, callback, errCb) {
                    fn.apply(elem, [params, callback, errCb]);
                });
            }(fn));
        }
    }
}
if(customElem.webWorkers && !this._workersAvailable()) {
     for( var prop in customElem.webWorkers ) {
        if(customElem.webWorkers .hasOwnProperty(prop)) {
            var fn = customElem.webWorkers[prop];
            if(this.isFunction(fn)) {
                var me = this;
                (function(fn, prop) {
                    elem.sendHandler(prop, function(params, callback, errCb) {
                        fn.apply(elem, [params, callback, errCb]);
                    });
                }(fn, prop));
            }
        }
    }   
}


var objProperties = baseData || attrObj || {};

if(givenBaseData) {
    elem._compState = givenBaseData;
} else {
    if(customElem.getInitialState ) {
        var stateData = customElem.getInitialState.apply( elem, [objProperties] );
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
if( customElem.requires || customElem._waitClass) {
    
    var prom = _promise(); // should be available
    var start = prom;
    // -- load if promises available...
    if(customElem.requires) {
        if(customElem.requires.js) {
            customElem.requires.js.forEach( function(item) {
                prom = prom.then( function() {
                    return elem.appendToHead("js", item.url);
                });
            });
        }
        if(customElem.requires.css) {
            customElem.requires.css.forEach( function(item) {
                prom = prom.then( function() {
                    return elem.appendToHead("css", item.url);
                });
            });
        }    
    }
    // got to wait for the web worker class creation, if it has been defined
    if(customElem._waitClass) {
        prom = prom.then( function() {
            return customElem._waitClass; 
        });
        elem._workerObjId = this.guid();
        var self = this;
        prom = prom.then( function() {
            return self._createWorkerObj(customElem.customTag, elem._workerObjId, elem);
        });
        prom = prom.then( function() {
            var ww = customElem.webWorkers;
            for( var fName in ww ) {
                if(ww.hasOwnProperty(fName)) {
                    var fn = ww[fName];
                    if(self.isFunction(fn)) {
                        (function(fName) {
                            elem.sendHandler(fName, function(params, callback) {
                                self._callObject( elem._workerObjId, fName, params, callback );
                            });
                        })(fName);
                    }
                }
            }            
        });
       
    }
    
    
    prom = prom.then( function() {
        var contentObj = renderFn.apply(elem, [objProperties, customElem]);
        if(contentObj) {
            elem._contentObj = contentObj;
            contentObj._contentParent = elem;
            current_ch.forEach( function(ch) {
                contentObj.add( ch );
            });
        }            
    });
    start.resolve();
    elem._uiWaitProm = prom;
    
} else {
    var contentObj = renderFn.apply(elem, [objProperties, customElem]);
    if(contentObj) {
        elem._contentObj = contentObj;
        contentObj._contentParent = elem;
        current_ch.forEach( function(ch) {
            contentObj.add( ch );
        });
    }    
}

```

### <a name="_composite"></a>::composite(t)


*The source code for the function*:
```javascript
var argList = Array.prototype.slice.call(arguments);

if(this._contentObj) {
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

if(!this._isStdElem(res.elemName)) {

    var customElem = this._findCustomElem(res.elemName);
    if(customElem) {
        // find the state...
        
        var model = this.state(),
            baseData;
        if(model && model.hasOwn && !model.hasOwn(customElem.customTag)) {
            if(res.data) {
                // always make a copy if aguments given to avoid problems if the
                // data has been network connected...
                model.set(customElem.customTag, res.data.toPlainData());
            } else {
                if(customElem.getInitialState) {
                    var stateData = customElem.getInitialState.apply( this, [] );
                    model.set(customElem.customTag, stateData);
                } else {
                    model.set(customElem.customTag, {});
                }
            }
        }
        if(model && model.hasOwn(customElem.customTag)) {
            baseData = model[customElem.customTag];
        }
        if(customElem.init || customElem.render) {

            // create the element HTML tag
            var elem = _e(customElem.customTag, res.attrs, res.constr, baseData || res.data);
            this.add( elem );
            return elem;
        }
    }
}
var el = this.shortcutFor.apply( this, argList); // (elemName, className, attrs);
return el;
```

### <a name="_createClass"></a>::createClass(elemName, options)


*The source code for the function*:
```javascript
return this.customElement(elemName, options);
```

### <a name="_customElement"></a>::customElement(elemName, options)

Registers a custom element. Note: Allows rewriting the element definition.
*The source code for the function*:
```javascript

if(!this._customElems) this._customElems = {};
if(!_customElems) _customElems = {};

this._customElems[elemName] = options;
_customElems[elemName] = options;

// save the custom element tag name for further referencese
options.customTag = elemName;

// create the CSS if necessary to the namespace of the element
if(options.css) {
    var baseCss = this.css(elemName);
    options.css(baseCss);
    options.baseCss = baseCss;
    
    // TODO: add _firstUpdate to  
    // CSS object baseCss._firstUpdate = function() { --- } 
}

// Object 
if(options.webWorkers && this.isObject(options.webWorkers) && this._workersAvailable()) {
    // this._createWorkerClass
    options._waitClass = this._createWorkerClass( elemName, options.webWorkers );
}
this._addCustomTagFn(elemName);

```

### <a name="_getRegisteredClasses"></a>::getRegisteredClasses(t)


*The source code for the function*:
```javascript
return _customElems || {};
```

### <a name="_modifyCss"></a>::modifyCss(compName, fn)
`compName` The component or element name
 
`fn` Function
 

Creates "postcss" like postprocessing for every CSS object in registered components list
*The source code for the function*:
```javascript
var cList = this.getRegisteredClasses();

if(!fn) {
    fn = compName;
    compName = false;
}

if(compName) {
    var ob = cList[compName];
    if(ob && ob.baseCss) {
        // TODO: add also the CSS construction parameters here
        fn( n, ob.baseCss ); 
    }
    return this;
}

for( var n in cList ) {
    
    if(compName && (n!=compName)) continue;
    
    if(cList.hasOwnProperty(n)) {
        var ob = cList[n];
        if(ob.baseCss) {
            // TODO: add also the CSS construction parameters here
            fn( n, ob.baseCss ); 
        }
    }
}
return this;
```

### <a name="_props"></a>::props(t)


*The source code for the function*:
```javascript
if(!this._compBaseData) {
    var p = this._parent;
    if(p) return p.props();
    return null;
}
return this._compBaseData;
```

### <a name="_ref"></a>::ref(name)


*The source code for the function*:
```javascript
var pComp = this._findComp();
if(pComp) {
    if( pComp._instanceVars ) {
        var initData = pComp._instanceVars;
        if(initData.refs) {
            return initData.refs[name];
        }
    }
}
```

### <a name="_registerElement"></a>::registerElement(elemName, options)


*The source code for the function*:
```javascript
return this.customElement(elemName, options);
```

### <a name="_state"></a>::state(t)


*The source code for the function*:
```javascript

if(this._compState) {
    return this._compState;
} else {
    if(this._initWithDef) {
        this._compState = _data({});
        return this._compState;
    } else {
        var p = this._parent;
        if(p) return p.state();
    }
    
}
```


    
    
    
## trait web_worker

The class has following internal singleton variables:
        
* _callBackHash
        
* _idx
        
* _worker
        
* _initDone
        
* _objRefs
        
* _threadPool
        
* _maxWorkerCnt
        
* _roundRobin
        
* _objPool
        
        
### <a name="__baseWorker"></a>::_baseWorker(t)

The bootstrap for the worker to receive and delegate commands. This is the code running at the worker -side of the pool.
*The source code for the function*:
```javascript
return {
  init: function() {
    if (this._initDone) return;
    this._initDone = true;
    this._classes = {};
    this._instances = {};
  },
  start: function(msg) {
    this.init();
    // Root object call
    if (msg.data.cmd == "call" && msg.data.id == "/") {
      if (msg.data.fn == "createClass") {
        var newClass;
        var dataObj = JSON.parse( msg.data.data );
        eval("newClass = " + dataObj.code);
        this._classes[dataObj.className] = newClass;
        postMessage({
          cbid: msg.data.cbid,
          data : "Done"
        });        
      }
      if (msg.data.fn== "createObject" && msg.data.data ) {
        var dataObj = JSON.parse( msg.data.data );
        var newClass = this._classes[dataObj.className];
        if (newClass) {
          var o_instance = Object.create(newClass);
          this._instances[dataObj.id] = o_instance;
          o_instance.send = function(msg, data, cb) {
              postMessage({
                msg : msg,
                data : data,
                ref_id : dataObj.id
              });             
          }
          o_instance._ref_id = dataObj.id;
          postMessage({
            cbid: msg.data.cbid,
            data : "Done"
          });
        }
      }
      return;
    }
    if (msg.data.cmd == "call" && msg.data.id) {
      var ob = this._instances[msg.data.id];
      if (ob) {
        if (ob[msg.data.fn]) {
          ob[msg.data.fn].apply(ob, [msg.data.data, function(msgData) {
            postMessage({
              cbid: msg.data.cbid,
              data : msgData
            });
          }]);
        }
      } else {
         // TODO: error handling postMessage("no instance found");
      }
    }
  }
}
```

### <a name="__callObject"></a>::_callObject(id, fnName, data, callback)
`id` Object ID to call
 
`fnName` Name of function
 
`data` Data as string
 
`callback` Callback when done
 


*The source code for the function*:
```javascript
var o = _objRefs[id];
if(o) {
    this._callWorker(_threadPool[o.__wPool], id, fnName, data, callback );
}
return this;

```

### <a name="__callWorker"></a>::_callWorker(worker, objectID, functionName, dataToSend, callBack)
`worker` Web Worker to call
 
`objectID` ID of function or / to call the root
 
`functionName` Name of the function to call 
 
`dataToSend` Data, converted to string if object
 
`callBack` callback
 


*The source code for the function*:
```javascript
if(!_worker) return;

_callBackHash[_idx] = callBack;
if(typeof(dataToSend) == "object") dataToSend = JSON.stringify(dataToSend);
worker.postMessage({
  cmd: "call",
  id: objectID,
  fn: functionName,
  cbid: _idx++,
  data: dataToSend
});

```

### <a name="__createWorker"></a>::_createWorker(index)
`index` Thread index
 


*The source code for the function*:
```javascript
try {
    
    // currently only one worker in the system...
    
    if(typeof(index) == "undefined") {
        if(_worker) return _worker;
    }
    
    var theCode = "var o = " + this._serializeClass(this._baseWorker()) +
      "\n onmessage = function(eEvent) { o.start.apply(o, [eEvent]); } ";
    var blob = new Blob([theCode], {
      type: "text/javascript"
    });
    var ww = new Worker(window.URL.createObjectURL(blob));
    if(!_callBackHash) {
        _callBackHash = {};
        _idx = 1;
    }
    _worker = ww;
    ww.onmessage = function(oEvent) {
        if (typeof(oEvent.data) == "object") {
          if(oEvent.data.cbid) {
              var cb = _callBackHash[oEvent.data.cbid];
              delete _callBackHash[oEvent.data.cbid];
              cb( oEvent.data.data );
          }
          if(oEvent.data.ref_id) {
              var oo = _objRefs[oEvent.data.ref_id];
              
              if(oo) {
                  var dd = oEvent.data.data;
                  if (typeof(dd) == "object") dd = JSON.stringify( dd );
                  oo.send( oEvent.data.msg, dd, function(res) {
                      if(oEvent.data.cbid) {
                          // --> might send the message back to the worker
                          // TODO: send msg back
                      }
                  });
              }
          }          
          return;
        }
        // unknown message
        console.error("Unknown message from the worker ", oEvent.data);
    };    
    if(typeof(index) != "undefined") {
        _threadPool[index] = ww;
    }    
    return ww;
} catch(e) {
    return null;
}
```

### <a name="__createWorkerClass"></a>::_createWorkerClass(className, classObj)


*The source code for the function*:
```javascript
var p = this.__promiseClass(), me = this;

return new p(
    function(success) {
        var prom, first;
        var codeStr = me._serializeClass(classObj);
        for(var i=0; i<_maxWorkerCnt; i++) {
            ( function(i) {
            if(!prom) {
                first = prom = new p(function(done) {
                    me._callWorker(_threadPool[i], "/", "createClass",  {
                        className: className,
                        code: codeStr
                    }, done );
                });
            } else {
                prom = prom.then( function() {
                    return new p(function(done) {
                        me._callWorker(_threadPool[i], "/", "createClass",  {
                            className: className,
                            code: codeStr
                        }, done );
                    })
                })
            }
            })(i);
        }
        prom.then( function() {
            success(true);
        })

});
```

### <a name="__createWorkerObj"></a>::_createWorkerObj(className, id, refObj)
`className` Class of the Object
 
`id` Object ID
 


*The source code for the function*:
```javascript
var p = this.__promiseClass(), me = this;
return new p(
    function(success) {
        
        var pool_index = (_roundRobin++) % _maxWorkerCnt;
        refObj.__wPool = pool_index;
        
        me._callWorker(_threadPool[pool_index], "/", "createObject",  {
            className: className,
            id: id
        }, function( result ) {
            _objRefs[id] = refObj;
            success( result ); 
        });
});

```

### <a name="__serializeClass"></a>::_serializeClass(o)
`o` The Object with functions as properties
 


*The source code for the function*:
```javascript
var res = "{";
var i = 0;
for (var n in o) {
    if (i++) res += ",";
    res += n + " : " + (o[n].toString());
}
res += "};";
return res;

```

### <a name="__workersAvailable"></a>::_workersAvailable(t)


*The source code for the function*:
```javascript
return _worker;
```

### ::constructor( t )

```javascript

if(!_initDone) {
    _initDone = true;
    _maxWorkerCnt = 4;
    _roundRobin = 0;
    _threadPool = [];
    _objRefs = {};
    for(var i=0; i<_maxWorkerCnt;i++) {
        this._createWorker(i);
    }
    
}

```
        

    
    
    
## trait diff_patch

The class has following internal singleton variables:
        
        
### <a name="_doReact"></a>::doReact(data, fn)
`data` Some random data
 


*The source code for the function*:
```javascript

if(typeof(fn) != "undefined") this._reactFn = fn;
if(this._reactFn) {
    this.patchWith( this._reactFn( data ) );
}
```

### <a name="_patchWith"></a>::patchWith(elem)


*The source code for the function*:
```javascript
 
if(elem._tag != this._tag) {
    // just redraw the item...
    this.replaceWith( elem );
    return this;
}

var classStr, elemClassStr;

if( this._classes ) {
    var classStr = this._classes.join(" ");
} 
if( elem._classes ) {
    var elemClassStr = elem._classes.join(" ");
} 

if(classStr != elemClassStr) {
    this._classes = elem._classes;
    if(elemClassStr) {
        this._dom.className = elemClassStr;
    } else {
        this._dom.className = "";
    }
    
}

this._ev = elem._ev;

for(var n in elem._attributes) {
    var v = elem._attributes[n];
    if(this._attributes[n] != v) {
        this._attributes[n] = v;
        this._dom.setAttribute(n,v);
    }
}

for(var n in this._attributes) {
    if(typeof( elem._attributes[n]) == "undefined") {
        delete this._attributes[n];
        this._dom.removeAttribute(n,v);
    }
}

// TODO: patch width, height, x, y etc.

if(this._tag == "input" || this._tag == "textarea") {
    if(elem._value != this._value) {

    }
} else {
    if(elem._children.length === 0) {
        var myList = this._children.slice(); // make copy of the array
        myList.forEach( function(ch) {
            ch.remove();
        });
        if(elem._html != this._html) {
            this._html = elem._html || "";
            this._dom.textContent = elem._html;
        }
    } else {
        if(elem._html != this._html) {
            this._html = elem._html || "";
            this._dom.textContent = elem._html;
        }        
        var removeCnt = this._children.length - elem._children.length;
        var theList = elem._children.slice(); // make copy of the array
        var myList = this._children.slice(); // make copy of the array
        for(var j=0; j<theList.length;j++) {
            var myCh = myList[j];
            if(myCh) {
                myCh.patchWith( theList[j] );
            } else {
                this.add( theList[j] );
            }
        }
        while( removeCnt > 0) {
            if(myList[j]) myList[j++].remove();
            removeCnt--;
        }
    }
}



```


    
    


   
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
            
# Class _qc


The class has following internal singleton variables:
        
        
### <a name="_qc_attr"></a>_qc::attr(n, v)


*The source code for the function*:
```javascript

var host = this._host;
if(!isNaN(n)) return;

if(host._svgElem) {
    
    if(host.isObject(v)) {
        if(v.onValue) {
            // Assume it is a stream...
            var me = this;
            v.onValue( function(val) {
                if(typeof(val)!="undefined" && ( val !== null) ) {
                    if(n=="xlink:href") {
                        me._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);      
                     } else {
                        me._dom.setAttributeNS(null, n,val);
                     }
                }
            });            
            
            return this;
        }
    }
    
    if(host.isArray(v)) {

        var oo = v[0],
            fName = v[1],
            val = oo[fName](),
            me = this,
            domi = me._dom,
            host = this._host,
            list;

        if(n=="xlink:href") {
            list = host.uniqueListener("attr:"+n, function(o,newV) {
                if(typeof(newV)!="undefined" && ( newV !== null) ) {
                    domi.setAttributeNS('http://www.w3.org/1999/xlink', 'href', newV);      
                }
            });            
        } else {
            list = host.uniqueListener("attr:"+n,function(o,newV) {
                if(typeof(newV)!="undefined" && ( newV !== null) ) {
                    domi.setAttributeNS(null, n, newV);
                }
            });            
        }
        oo.on(fName, list);
        if(typeof(val)!="undefined" && ( val !== null) ) {
            if(n=="xlink:href") {
                this._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);      
             } else {
                this._dom.setAttributeNS(null, n,val);
             }
        } else {
            
        }
        return this;        
    }

    if(typeof(v)!="undefined") {
        if(n=="xlink:href"){
            this._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', v);
        } else {
           this._dom.setAttributeNS(null,n,v); 
        }
    }
        
    return this;    
}


if(host.isArray(v)) {
    
    // console.log("Taking array as ", v);
    
    var oo = v[0],
        fName = v[1],
        val = oo[fName](),
        me = this,
        domi = me._dom,
        list;


    list = host.uniqueListener("attr:"+n,function(o,newV) {
        if(typeof(newV)!="undefined" && ( newV !== null) ) {
            host._attributes[n] = newV;
            domi.setAttribute(n, newV);
        }
    });            
    oo.on(fName, list);
    if(typeof(val)!="undefined" && ( val !== null) ) {
        if(n=="xlink:href") {
            this._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);      
         } else {
            host._attributes[n] = val;
            this._dom.setAttributeNS(null, n,val);
         }
    } 
    return this;
}
       
    
if(host.isObject(v)) {
    if(v.onValue) {
        // Assume it is a stream...
        var me = this;
        v.onValue( function(val) {
            if(typeof(val)!="undefined" && ( val !== null) ) {
                if(n=="xlink:href") {
                    me._dom.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);      
                 } else {
                    host._attributes[n] = val;
                    me._dom.setAttributeNS(null, n,val);
                 }
            }
        });            
        
        return this;
    }
}

if(typeof(v)!="undefined" && isNaN(n) ) {
    host._attributes[n] = v;
    this._dom.setAttribute(n,v);
}
return this;
```

### <a name="_qc_bindSysEvent"></a>_qc::bindSysEvent(en, fn, stop)


*The source code for the function*:
```javascript
en = en.toLowerCase();
if(!this._sys) this._sys = {};
if(this._sys[en]) return false;

this._sys[en] = true;

var me = this;
this._dom.addEventListener(en, function(e) {
        e = e || window.event;
        me._event = e;
        if(stop) {
            if(e && e.stopPropagation) {
                e.stopPropagation();
            } else {
               e = window.event;
               e.cancelBubble = true;
            }
        }
    fn();
    });
return true;
```

### <a name="_qc_blur"></a>_qc::blur(t)


*The source code for the function*:
```javascript
if(this._dom.blur) this._dom.blur();
```

### <a name="_qc_css"></a>_qc::css(n, v)


*The source code for the function*:
```javascript
if(n=="background-color") n = "backgroundColor";
if(n=="margin-left") n = "marginLeft";
if(n=="font-size") {
    n = "fontSize";
    v = this.pxParam(v);
}

if(n=="left"||n=="top"||n=="bottom"||n=="right"||n=="width"||n=="height") {
    
    v = this.pxParam(v);
}
    
if(v.substring) {
 if(v.substring(0,3)=="NaN") {
     return;
 }
}
this._dom.style[n] = v;
return this;
```

### <a name="_qc_focus"></a>_qc::focus(t)


*The source code for the function*:
```javascript
if(this._dom.focus) this._dom.focus();
```

### <a name="_qc_get"></a>_qc::get(index)


*The source code for the function*:
```javascript
return this._dom;
```

### _qc::constructor( myDom, host )

```javascript
this._dom = myDom;
this._host = host;
```
        
### <a name="_qc_pxParam"></a>_qc::pxParam(v)


*The source code for the function*:
```javascript

if(v=="auto") return v;

if(typeof(v.slice)!="undefined") {
   if(v.slice(-1)=="%") {
        return v;
    }
    if(v.slice(-2)=="em") {
        return v;
    }
    if(v.slice(-2)=="px") {
        return v;
    }
}

if(isNaN( parseInt(v)) ) {
    return "";
}
if(typeof(v)=="string") {
    return parseInt(v)+"px";
} else {
    var i = parseInt(v);
    if(!isNaN(i)) {
        return i+"px";
    }
}
```



   


   



      
    
      
    
      
    
      
    
      
    
      
    
      
    
      
            
# Class later


The class has following internal singleton variables:
        
* _initDone
        
* _callers
        
* _oneTimers
        
* _everies
        
* _framers
        
* _localCnt
        
* _easings
        
* _easeFns
        
        
### <a name="later__easeFns"></a>later::_easeFns(t)


*The source code for the function*:
```javascript
_easings = { 
    easeIn : function(t) {
        return t*t;
    },
    easeOut : function(t) {
        return -1*t*(t-2);
    },   
    easeInOut : function(t) {
        if(t < 0.5) return t*t;
        return -1*t*(t-2);
    },
    easeInCubic : function(t) {
        return t*t*t;
    },
    easeOutCubic : function(t) {
        return (1-t)*(1-t)*(1-t) + 1;
    },    
    pow : function(t) {
        return Math.pow(t,parseFloat(1.5-t));
    },
    linear : function(t) {
        return t;
    }
}

```

### <a name="later_add"></a>later::add(fn, thisObj, args)


*The source code for the function*:
```javascript
if(thisObj || args) {
   var tArgs;
   if( Object.prototype.toString.call( args ) === '[object Array]' ) {
       tArgs = args;
   } else {
       tArgs = Array.prototype.slice.call(arguments, 2);
       if(!tArgs) tArgs = [];
   }
   _callers.push([thisObj, fn, tArgs]);   
} else {
    _callers.push(fn);
}
```

### <a name="later_addEasingFn"></a>later::addEasingFn(name, fn)


*The source code for the function*:
```javascript
_easings[name] = fn;
```

### <a name="later_after"></a>later::after(seconds, fn, name)


*The source code for the function*:
```javascript

if(!name) {
    name = "aft_"+(_localCnt++);
}

_everies[name] = {
    step : Math.floor(seconds * 1000),
    fn : fn,
    nextTime : 0,
    remove : true
};
```

### <a name="later_asap"></a>later::asap(fn)


*The source code for the function*:
```javascript
this.add(fn);

```

### <a name="later_ease"></a>later::ease(name, delay, callback, over)
`name` Name of the easing to use
 
`delay` Delay of the transformation in ms
 
`callback` Callback to set the values
 
`over` When animation is over
 


*The source code for the function*:
```javascript

var fn = _easings[name];
if(!fn) fn = _easings.pow;
var id_name = "e_"+(_localCnt++);
_easeFns[id_name] = {
    easeFn : fn,
    duration : delay,
    cb : callback,
    over : over
};



```

### <a name="later_every"></a>later::every(seconds, fn, name)


*The source code for the function*:
```javascript

if(!name) {
    name = "t7491_"+(_localCnt++);
}

_everies[name] = {
    step : Math.floor(seconds * 1000),
    fn : fn,
    nextTime : 0
};
```

### later::constructor( interval, fn )

```javascript
if(!_initDone) {
   this._easeFns();
   _localCnt=1;
 
   var frame, cancelFrame;
   if(typeof(window) != "undefined") {
       var frame = window['requestAnimationFrame'], 
           cancelFrame= window['cancelRequestAnimationFrame'];
       ['', 'ms', 'moz', 'webkit', 'o'].forEach( function(x) { 
           if(!frame) {
            frame = window[x+'RequestAnimationFrame'];
            cancelFrame = window[x+'CancelAnimationFrame'] 
                                       || window[x+'CancelRequestAnimationFrame'];
           }
        });
   }
 
   var is_node_js = (new Function("try { return this == global; } catch(e) { return false; }"))();
   
   if(is_node_js) {
       frame= function(cb) {
            return setImmediate(cb);// (cb,1);
       }; 
   } else {
        if (!frame) {
            frame= function(cb) {
                return setTimeout(cb, 16);
            };       
        }
   }
 
    if (!cancelFrame)
        cancelFrame = function(id) {
            clearTimeout(id);
        };    
        
    _callers = [];
    _oneTimers = {};
    _everies = {};
    _framers = [];
    _easeFns = {};
    var lastMs = 0;
    
    var _callQueQue = function() {
       var ms = (new Date()).getTime(),
           elapsed = lastMs - ms;
       
       if(lastMs==0) elapsed = 0;
       var fn;
       while(fn=_callers.shift()) {
          if(Object.prototype.toString.call( fn ) === '[object Array]' ) {
              fn[1].apply(fn[0], fn[2]);
          } else {
              fn();
          }
           
       }
       
       for(var i=0; i<_framers.length;i++) {
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
       for(var n in _easeFns) {
           if(_easeFns.hasOwnProperty(n)) {
               var v = _easeFns[n];
               if(!v.start) v.start = ms;
               var delta = ms - v.start,
                   dt = delta / v.duration;
               if(dt>=1) {
                   dt = 1;
                   delete _easeFns[n];
               }
               v.cb(v.easeFn(dt));
               if((dt == 1) && v.over) v.over();
           }
       }   

       for(var n in _oneTimers) {
           if(_oneTimers.hasOwnProperty(n)) {
               var v = _oneTimers[n];
               v[0](v[1]);
               delete _oneTimers[n];
           }
       }
       
       for(var n in _everies) {
           if(_everies.hasOwnProperty(n)) {
               var v = _everies[n];
               if(v.nextTime < ms) {
                   if(v.remove) {
                       if(v.nextTime > 0) {
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
               if(v.until) {
                   if(v.until < ms) {
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
```
        
### <a name="later_once"></a>later::once(key, fn, value)


*The source code for the function*:
```javascript
// _oneTimers

_oneTimers[key] = [fn,value];
```

### <a name="later_onFrame"></a>later::onFrame(fn)


*The source code for the function*:
```javascript

_framers.push(fn);
```

### <a name="later_removeFrameFn"></a>later::removeFrameFn(fn)


*The source code for the function*:
```javascript

var i = _framers.indexOf(fn);
if(i>=0) {
    if(fn._onRemove) {
        fn._onRemove();
    }
    _framers.splice(i,1);
    return true;
} else {
    return false;
}
```



   


   



      
    
      
            
# Class css


The class has following internal singleton variables:
        
* head
        
* styleTag
        
* bexp
        
* bexp2
        
* _conversions
        
* _instances
        
* _insInit
        
* _someDirty
        
* _virtualTags
        
* _virtualSize
        
* _IE9Limits
        
* _IE9Tag
        
        
### <a name="css__assign"></a>css::_assign(objectList)


*The source code for the function*:
```javascript
var o = {}, args;
if(this.isArray(objectList)) {
  args = objectList;
} else {
  args = Array.prototype.slice.call(arguments);
}
args.forEach(function(rules) {
            for(var n in rules) {
                if(rules.hasOwnProperty(n)) {
                    var value = rules[n];
                    if(value===null || value === false) {
                        delete o[n];
                    } else {
                        o[n] = rules[n]; 
                    }
                }
            }
        });          
return o;

```

### <a name="css__classFactory"></a>css::_classFactory(id, mediaRule)


*The source code for the function*:
```javascript

if(!id) id = "_global_";

if(mediaRule) id+="/"+mediaRule;

if(!_instances) {
    _instances = {};
    _instances[id] = this;
} else {
    if(_instances[id]) return _instances[id];
    _instances[id] = this;
}
```

### <a name="css_animation"></a>css::animation(animName, settings)


*The source code for the function*:
```javascript

var args = Array.prototype.slice.call(arguments),
    animName = args.shift(),
    settings = args.shift(),
    animKeyName = animName+"-keyframes",
    parts = args,
    t = 0,
    me = this,
    animStr = "",
    postFix = this._cssScope || "";
    
args.forEach( function(cssRuleObj) {
    if(me.isObject(cssRuleObj)) {
        var pros;
        if(typeof(cssRuleObj.time) != "undefined") {
            pros = parseInt( 100.00 * parseFloat( cssRuleObj.time) );
        } else {
            pros = parseInt( t*100.00 );
        }
        if(pros < 0) pros = 0;
        if(pros > 100) pros = 100;        
        animStr += pros+"% "+me.ruleToCss(cssRuleObj) +" \n";
        t = 1;
    } else {
        t = cssRuleObj;
    }
});
var fullStr = "";
var exp = ["", "-o-", "-moz-", "-webkit-"];
exp.forEach( function(r) {
    fullStr+="@"+r+"keyframes "+animKeyName+postFix+" { "+animStr+" } \n";
})
this._animations[animKeyName+postFix] = fullStr;

var animDef = {};
if(this.isObject(settings)) {
    var so = this.animSettings( settings );
    so["animation-name"] = animKeyName+postFix;
    this.bind("."+animName, so );
} else {
    this.bind( "."+animName, { animation : animKeyName+postFix+" "+settings  } );
}

```

### <a name="css_animSettings"></a>css::animSettings(obj)


*The source code for the function*:
```javascript

if(this.isObject(obj)) {
    var res = {};
    for(var n in obj) {
       if(obj.hasOwnProperty(n)) {
           if(n=="duration" || n=="iteration-count") {
               res["animation-"+n] = obj[n]; 
           } else {
               res[n] = obj[n]; 
           }
       }
    }
    return res;
} else {
    return {};
}
```

### <a name="css_assign"></a>css::assign(cssRule)
`cssRule` The rule to modify
 


*The source code for the function*:
```javascript
// my rulesets...
var args = Array.prototype.slice.call(arguments);
var rule = args[0];

if(!this._data[rule]) this._data[rule] = [];

var i = 1;
var max = 3; // maximum number, until we just merge rest to the last...

while(args[i]) {
    if(this._data[rule].length>=max) {
        var new_obj = args[i];
        var rule_obj = this._data[rule][this._data[rule].length-1];
        for(var n in new_obj) {
            if(new_obj.hasOwnProperty(n)) {
                rule_obj[n] = new_obj[n];
            }
        }
        i++;
        continue;
    }
    this._data[rule].push( args[i] ); 
    i++;
}
this._dirty = true;
_someDirty = true;
return this;

```

### <a name="css_bind"></a>css::bind(className, obj)
`obj` one or more objects to combine
 


*The source code for the function*:
```javascript
// my rulesets...
var args = Array.prototype.slice.call(arguments),
    rule = args.shift();

this._data[rule] = args;
this._dirty = true;
_someDirty = true;

return this;

```

### <a name="css_buildCss"></a>css::buildCss(mediaRule)


*The source code for the function*:
```javascript

if(this._data) {
    if(!mediaRule) mediaRule = this._mediaRule;
    var o = {};
    for( var rule in this._data) {
        if(this._data.hasOwnProperty(rule)) {
            var ruleData = this._data[rule];
            if(this._composedData[rule]) {
                ruleData = [this._composedData[rule]].concat(ruleData);
            }
            o[rule] = this._assign( ruleData );
        }
    }
    this._composedData = o;
    this.updateStyleTag( this.makeCss(o, mediaRule) );
}

```

### <a name="css_collectAnimationCss"></a>css::collectAnimationCss(t)


*The source code for the function*:
```javascript

var anims = this._animations,
    str = "";
    
for(var n in anims) {
    if(anims.hasOwnProperty(n))  str += anims[n];
}
return str;
```

### <a name="css_convert"></a>css::convert(n, v)


*The source code for the function*:
```javascript
var str = "", gPos;

if(v && v.indexOf && (gPos=v.indexOf("-gradient")) >= 0) {
    
    var start = gPos - 1,   
        end = gPos+8,
        bError = false;
    var legals = "lineardg-wbktmozp"; // repeating
    while(legals.indexOf( v.charAt(start)) >=0) {
        start--;
        if(start<=0) {
            start = 0;
            break;
        }
    }
    
    var pCnt = 1;

    while(v.charAt(end++)!="(");
    
    while(pCnt>0) {
        if( v.charAt(end)=="(") pCnt++;
        if( v.charAt(end)==")") pCnt--;
        end++;
        if(v.length < end ) {
            bError = true;
            break;
        }
    }
    if(!bError) {
        var gradString  = v.substring( start, end ),
            s = v.substring(0,start),
            e = v.substring(end);
        var str = "";
        ["-webkit-","","-moz-","-o-"].forEach( function(p) {
             str+= n+" : "+s+" "+p+gradString+e+";\n";
        });
    }
    
    
}

if(_conversions[n]) {
    str = _conversions[n](n,v);
} else {
    str+= n+" : "+v+";\n";
}
return str;
```

### <a name="css_forMedia"></a>css::forMedia(mediaRule)


*The source code for the function*:
```javascript

var mediaObj = css( this._cssScope , mediaRule);

if(!this._mediaHash) this._mediaHash = {};
if(!this._mediaHash[mediaRule]) this._mediaHash[mediaRule] = mediaObj;

return mediaObj;

```

### <a name="css_forRules"></a>css::forRules(fn)


*The source code for the function*:
```javascript
// TODO: consider how the if media rules need to be given using this function 
for(var n in this._data) {
    if(this._data.hasOwnProperty(n)) {
        fn.apply(this, [n, this._assign( this._data[n]) ] );
    }
}

```

### css::constructor( cssScope, mediaRule )

```javascript
// my rulesets...
this._data = this._data  || {};
this._animations = {};
this._composedData = this._composedData || {};

this._mediaRule = mediaRule;

// this used to be cssPostFix;
this._cssScope = cssScope || "";
// this._postFix = cssPostFix || "";

if(!head) {
    _virtualTags = [];
    var me = this;
    later().every(1/10, function() {
        if(!_someDirty) return;
        _someDirty = false;

        for( var id in _instances) {
            if(_instances.hasOwnProperty(id)) {
                var ins = _instances[id];
                if(ins._dirty) {
                    ins.buildCss();
                    ins._dirty = false;
                    if(ins._firstUpdate) {
                        ins._firstUpdate();
                        delete ins._firstUpdate;
                    }
                }
            }
        }
        if(_IE9Limits && _IE9Tag) {
            _IE9Tag.styleSheet.cssText = _virtualTags.join(" ");
        };

    });
}
if(!_insInit) _insInit = {};
var id = (cssScope || "_global_");
if(mediaRule) id+="/"+mediaRule;
if(!_insInit[id]) {
    _insInit[id] = true;
    this.initConversions();
}


```
        
### <a name="css_initConversions"></a>css::initConversions(t)


*The source code for the function*:
```javascript

// -- moving this to virtual tags for IE9 ----
// _virtualTags

if(!_virtualSize) _virtualSize = 0;

if(!window.atob && document.all) {
    _IE9Limits = true;
}

this._virtualTagId = _virtualSize++;
_virtualTags[this._virtualTagId] = ""; // make it string to support array join

bexp = function(p, v) {
    var str = "";
    str+="-o-"+p+":"+v+";\n";
    str+="-moz-"+p+":"+v+";\n";
    str+="-webkit-"+p+":"+v+";\n";
    str+=p+":"+v+";\n";
    return str;
}

bexp2 = function(p, v) {
    var str = "";
    str+="-o-"+p+":"+"-o-"+v+";\n";
    str+="-moz-"+p+":"+"-moz-"+v+";\n";
    str+="-webkit-"+p+":"+"-webkit-"+v+";\n";
    str+=p+":"+v+";\n";
    return str;
}
    
 _conversions = {
    "border-radius" : function(n,v) {
        return bexp(n,v);
    },
    "box-shadow" : function(n,v) {
        return bexp(n,v);
    },
    "rotate" : function(n,v) {
        n = "transform";
        v = "rotate("+parseInt(v)+"deg)";
        return bexp(n,v);
    },
    "transition" : function(n,v) {
        return bexp2(n,v);
    },
    "filter" : function(n,v) {
        return bexp(n,v);
    },
    "animation" : function(n,v) {
        return bexp(n,v);
    },
    "animation-iteration-count" : function(n,v) {
        return bexp(n,v);
    },
    "animation-fill-mode" : function(n,v) {
        return bexp(n,v);
    },    
    "transition-timing-function" : function(n,v) {
        return bexp(n,v);
    },    
    "animation-name" : function(n,v) {
        return bexp(n,v);
    },
    "animation-timing-function" : function(n,v) {
        return bexp(n,v);
    },
    "animation-duration" : function(n,v) {
        return bexp(n,v);
    },                        
    "transform" : function(n,v) {
        return bexp(n,v);
    },
    "transform-style" : function(n,v) {
        return bexp(n,v);
    },
    "transform-origin" : function(n,v) {
        return bexp(n,v);
    },
    "perspective" : function(n,v) {
        return bexp(n,v);
    },
    "text-shadow" : function(n,v) {
        return bexp(n,v);
    },
    "opacity" : function(n,v) {
        v = parseFloat(v);
        var str = '-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity='+parseInt(v*100)+')";';
        str+='filter: alpha(opacity='+parseInt(v*100)+');';
        str+= bexp(n,v);
        return str;
    }
};    

```

### <a name="css_makeCss"></a>css::makeCss(o, mediaRule)


*The source code for the function*:
```javascript
var str = mediaRule ?  mediaRule + "{" : "";

for(var rule in o) {
    if(o.hasOwnProperty(rule)) {
        var cssRules = o[rule];
        if(this._cssScope) {
            var cssString = this.ruleToCss(cssRules);
            str += "." + this._cssScope + " " + rule + cssString + " ";
            str += rule + "." + this._cssScope + " " + cssString;            
        } else {
            str += rule+this.ruleToCss( cssRules );
        }
    }
}

// add the animation css also into this mediarule...
str += this.collectAnimationCss();

str += mediaRule ? "}\n" : "";
return str;
```

### <a name="css_mediaFork"></a>css::mediaFork(mediaRule)


*The source code for the function*:
```javascript

return css( this._cssScope , mediaRule);
```

### <a name="css_ruleToCss"></a>css::ruleToCss(cssRulesObj)


*The source code for the function*:
```javascript
var str = "{";
for(var n in cssRulesObj) {
    if(n=="time") continue;
    str += this.convert(n, cssRulesObj[n]);
}
str += "}\n";
return str;
```

### <a name="css_updateStyleTag"></a>css::updateStyleTag(cssText)


*The source code for the function*:
```javascript

try {
    if(_IE9Limits) {
        // if the styletag does not exist create it for IE9
        if(!_IE9Tag) {
            head = document.getElementsByTagName('head')[0];
            var styleTag = document.createElement('style');
            styleTag.setAttribute('type', 'text/css');
            styleTag.styleSheet.cssText = "";
            _IE9Tag = styleTag;
            head.appendChild(styleTag);      
        }
        // for IE9 build CSS into virtual tags first
        _virtualTags[this._virtualTagId] = cssText;      
    } else {
        
        var styleTag;
        
        if(!this._styleTag) {
            head = document.getElementsByTagName('head')[0];
            var styleTag = document.createElement('style');
            styleTag.setAttribute('type', 'text/css');
            if (styleTag.styleSheet) {   // IE
                styleTag.styleSheet.cssText = "";
            } else {                // the world
                styleTag.appendChild(document.createTextNode(""));
            }
            head.appendChild(styleTag);      
            this._styleTag = styleTag;            
        }
        
        styleTag = this._styleTag;
        var old =  styleTag.firstChild;        
        styleTag.appendChild(document.createTextNode(cssText));
        if(typeof(old)!="undefined") {
            styleTag.removeChild(old);
        }
    }

} catch(e) {
    if(console && console.log) console.log(e.message, cssText);
}

```



   
    
## trait _dataTrait

The class has following internal singleton variables:
        
        
### <a name="_dataTrait_guid"></a>_dataTrait::guid(t)


*The source code for the function*:
```javascript

return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

```

### <a name="_dataTrait_isArray"></a>_dataTrait::isArray(t)


*The source code for the function*:
```javascript
return Object.prototype.toString.call( t ) === '[object Array]';
```

### <a name="_dataTrait_isFunction"></a>_dataTrait::isFunction(fn)


*The source code for the function*:
```javascript
return Object.prototype.toString.call(fn) == '[object Function]';
```

### <a name="_dataTrait_isObject"></a>_dataTrait::isObject(t)


*The source code for the function*:
```javascript
return t === Object(t);
```


    
    


   
      
    



      
    
      
    
      
    
      
    
      
    
      
    




