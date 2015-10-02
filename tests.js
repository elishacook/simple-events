'use strict'

var expect = require('chai').expect,
    SimpleEvents = require('./lib/index')


var Counter = function ()
{
    this.i = 0
    this.inc = function () { this.i++ }.bind(this)
}


describe('simple-events', function ()
{
    it('emits once per call to emit()', function ()
    {
        var events = new SimpleEvents(),
            counter = new Counter()
            
        events.on('foo', counter.inc)
        events.emit('foo')
        
        expect(counter.i).to.equal(1)
        
        events.emit('foo')
        events.emit('foo')
        expect(counter.i).to.equal(3)
    })
    
    it('can unregister a listener', function ()
    {
        var events = new SimpleEvents(),
            counter = new Counter()
            
        events.on('foo', counter.inc)
        events.emit('foo')
        
        expect(counter.i).to.equal(1)
        
        events.off('foo', counter.inc)
        events.emit('foo')
        
        expect(counter.i).to.equal(1)
    })
    
    it('calls each listener once per emit()', function ()
    {
        var counter1 = new Counter(),
            counter2 = new Counter(),
            events = new SimpleEvents()
            
        events.on('bar', counter1.inc)
        events.on('bar', counter2.inc)
        events.emit('bar')
        expect(counter1.i).to.equal(1)
        expect(counter2.i).to.equal(1)
    })
    
    it('can pass arguments to event listeners', function ()
    {
        var events = new SimpleEvents(),
            result = 0
            
        events.on('do-addition', function (a,b) { result = a+b })
        events.emit('do-addition', 5, 23)
        
        expect(result).to.equal(28)
    })
    
    it('can register multiple, space-separated events in a single call', function ()
    {
        var counter = new Counter(),
            events = new SimpleEvents()
        
        events.on('foo bar baz', counter.inc)
        events.emit('foo')
        events.emit('bar')
        events.emit('baz')
        expect(counter.i).to.equal(3)
        
        events.off('foo baz', counter.inc)
        events.emit('foo')
        events.emit('baz')
        expect(counter.i).to.equal(3)
        
        events.emit('bar')
        expect(counter.i).to.equal(4)
    })
    
    it('can register to listen only once', function ()
    {
        var counter1 = new Counter(),
            counter2 = new Counter(),
            events = new SimpleEvents()
        
        events.on('you-only-live', counter1.inc)
        events.once('you-only-live', counter2.inc)
        
        events.emit('you-only-live')
        events.emit('you-only-live')
        events.emit('you-only-live')
        
        expect(counter1.i).to.equal(3)
        expect(counter2.i).to.equal(1)
    })
    
    it('can register a late listener', function ()
    {
        var counter = new Counter(),
            events = new SimpleEvents()
        
        events.emit('white-rabbit')
        expect(counter.i).to.equal(0)
        
        events.late('white-rabbit', counter.inc)
        expect(counter.i).to.equal(1)
        
        events.emit('white-rabbit')
        expect(counter.i).to.equal(2)
    })
    
    it('can listen to all events', function ()
    {
        var counter = new Counter(),
            events = new SimpleEvents()
            
        events.all(counter.inc)
        events.emit('there')
        events.emit('that')
        events.emit('is')
        events.emit('better')
        expect(counter.i).to.equal(4)
    })
    
    it('can mixin to another object', function (done)
    {
        var obj = new Object()
        SimpleEvents.mixin(obj)
        obj.on('foo', function ()
        {
            done()
        })
        obj.emit('foo')
    })
})