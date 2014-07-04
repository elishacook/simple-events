# EventHub

EventHub is a small, simple, well...uh, event manager. It does not support DOM events. It is intended to be used as a notification center for an application or to add event management behaviors to other objects. It is similar to jQuery in use. For instance, `obj.on('foo bar', some_fn)` will call `some_fn` when either `"foo"` or `"bar"` are fired on `obj`.

Have a look at the unit tests for usage examples.

## Install

You can install using bower

```
bower install eventhub.js
```

Eventhub will register itself using AMD, Node, AngularJS and/or [depin](https://github.com/elishacook/depin). If none of those environments are found it will be available as a global. If you are using angular, depend on the `eventhub` module and inject the `EventHub` class.