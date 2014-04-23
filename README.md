# EventHub

EventHub is a small, simple, well...uh, event manager. It does not support DOM events. It is intended to be used as a notification center for an application or to add event management behaviors to other objects. It is similar to jQuery in use. For instance, `obj.on('foo bar', some_fn)` will call `some_fn` when either `"foo"` or `"bar"` are fired on `obj`.

Have a look at the unit tests for usage examples.