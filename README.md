# EventHub

[![Build Status][1]][2]

`.on`, `.off`, `.once`, etc. Have a look at the unit tests for usage examples.

Can be easily used as a mixin:

```js
var SimpleEvents = require('simple-events')

var FooBar = function ()
{
    SimpleEvents.mixin(this)
}

var foobar = new FooBar()
foobar.on('stuff', function (x) { console.log(x + 10) })
foobar.emit('stuff', 10) // 20
```

## Install

You can install using npm.

```
npm install @elishacook/simple-events
```

[1]: https://secure.travis-ci.org/elishacook/simple-events.svg
[2]: https://travis-ci.org/elishacook/simple-events