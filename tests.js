var Counter = function ()
{
    this.i = 0
    this.inc = function () { this.i++ }.bind(this)
}

test('Simple events', function ()
{
    var counter = new Counter()
    ok(counter.i == 0, 'Counter is zero')
    
    var hub = new EventHub()
    hub.on('foo', counter.inc)
    hub.fire('foo')
    equal(counter.i, 1, "Event fired once")
    
    hub.fire('foo')
    hub.fire('foo')
    equal(counter.i, 3, "Event fired twice")
    
    hub.off('foo', counter.inc)
    hub.fire('foo')
    equal(counter.i, 3, "Event fired but did not call unregistered listener")
    
    var counter2 = new Counter()
    
    hub.on('bar', counter.inc)
    hub.on('bar', counter2.inc)
    hub.fire('bar')
    ok(counter.i == 4 && counter2.i == 1, "Event fired and called 2 listeners once each")
    
    var result = 0
    hub.on('do-addition', function (a,b) { result = a+b })
    hub.fire('do-addition', 5, 23)
    equal(result, 28, 'Event passed arguments to callback')
})

test('Multiple event registration', function ()
{
    var counter = new Counter(),
        hub = new EventHub()
    
    hub.on('foo bar baz', counter.inc)
    hub.fire('foo')
    hub.fire('bar')
    hub.fire('baz')
    equal(counter.i, 3, "Called listener once for each registered event")
    
    hub.off('foo baz', counter.inc)
    hub.fire('foo')
    hub.fire('baz')
    equal(counter.i, 3, "Didn't call unregistered listeners")
    
    hub.fire('bar')
    equal(counter.i, 4, "Called listener that was still registered")
})

test('One time events', function ()
{
    var counter1 = new Counter(),
        counter2 = new Counter(),
        hub = new EventHub()
    
    hub.on('you-only-live', counter1.inc)
    hub.one('you-only-live', counter2.inc)
    
    hub.fire('you-only-live')
    hub.fire('you-only-live')
    hub.fire('you-only-live')
    
    equal(counter1.i, 3, "Called normal listener 3 times")
    equal(counter2.i, 1, "Called one-time listener once")
    
})

test('Late events', function ()
{
    var counter = new Counter(),
        hub = new EventHub()
    
    hub.fire('white-rabbit')
    equal(counter.i, 0, "Did not call unregistered listener")
    
    hub.late('white-rabbit', counter.inc)
    equal(counter.i, 1, "Called late-bound listener")
    
    hub.fire('white-rabbit')
    equal(counter.i, 2, "Called late-bound listener like a normal listener for subsequent events")
})

test('Catch-all listener', function ()
{
    var counter = new Counter(),
        hub = new EventHub()
        
    hub.all(counter.inc)
    hub.fire('there')
    hub.fire('that')
    hub.fire('is')
    hub.fire('better')
    equal(counter.i, 4, "Catch-all listener was called for 4 unregistered events")
})

test('Mixin', function ()
{
    expect(1)
    var obj = new Object()
    EventHub.mixin(obj)
    obj.on('foo', function ()
    {
        ok(true, 'Called a registered listener')
    })
    obj.fire('foo')
})