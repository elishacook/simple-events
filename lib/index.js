'use strict'

module.exports = SimpleEvents

function SimpleEvents ()
{
    this._listeners = {}
    this._once = {}
    this._late = {}
    this._all = []
}
SimpleEvents.prototype =
{
    /* Add a listener to an event */
    on: function (name, callback)
    {
        this._call_registration_function(this._on_single, name, callback)
        return this
    },
    
    /* Remove a listener added with on(), once() or late() */
    off: function (name, callback)
    {
        this._call_registration_function(this._off_single, name, callback)
        return this
    },
    
    /* Add a listener to an event, emit the callback only once. If the
     * event was already emitted before adding, execute the callback immediately.
     */
    once: function (name, callback)
    {
        this._call_registration_function(this._once_single, name, callback)
        return this
    },
    
    /**
     * A combination of once() and on(). Bind a callback to an event. If the event
     * was emitted in the past, execute the callback immediately but also listen
     * to future events.
     */
    late: function (name, callback)
    {
        this._call_registration_function(this._late_single, name, callback)
        return this
    },
    
    /**
     * Bind a callback to ALL events.
     */
    all: function (callback)
    {
        this._all.push(callback)
        return this
    },
    
    /**
     * Fire an event. The first argument is the event name. Subsequent arguments
     * are passed to the event listeners.
     */
    emit: function () /* event_name, [arg1, [arg2, ...]] */
    {
        var name = arguments[0]
        var args = Array.prototype.slice.call(arguments, 1)
        
        if (typeof this._once[name] == "undefined")
        {
            this._once[name] = { args: args }
        }
        
        if (typeof this._once[name].listeners != "undefined")
        {
            this._once[name].listeners.forEach(function (listener)
            {
                listener.apply(undefined, args)
            })
            
            delete this._once[name].listeners
        }
        
        if (typeof this._listeners[name] != "undefined")
        {
            this._listeners[name].forEach(function (listener)
            {
                listener.apply(undefined, args)
            })
        }
        
        if (typeof this._late[name] == "undefined")
        {
            this._late[name] = { args: args, listeners: [] }
        }
        
        if (typeof this._late[name].listeners != "undefined")
        {
            var me = this
            this._late[name].listeners.forEach(function (listener)
            {
                listener.apply(undefined, args)
                me.on(name, listener)
            })
            
            this._late[name].listeners = []
        }
        
        if (this._all.length > 0)
        {
            args.unshift(name)
            this._all.forEach(function (listener)
            {
                listener.apply(undefined, args)
            })
        }
        
        return this
    },
    
    _on_single: function (name, callback)
    {
        if (!name)
        {
            return this
        }
        
        if (typeof this._listeners[name] == "undefined")
        {
            this._listeners[name] = []
        }

        if (this._listeners[name].indexOf(callback) === -1)
        {
            this._listeners[name].push(callback)
        }
    },
    
    _off_single: function (name, callback)
    {
        if (typeof this._listeners[name] == "undefined")
        {
            return
        }
        
        if (callback)
        {
            var i = this._listeners[name].indexOf(callback)
            
            if (i !== -1)
            {
                this._listeners[name].splice(i, 1)
            }
        }
        else
        {
            this._listeners[name] = []
        }
    },
    
    _once_single: function (name, callback)
    {
        if (typeof this._once[name] != "undefined" && 
            this._once[name].args != "undefined")
        {
            callback.apply(undefined, this._once[name].args)
        }
        else
        {
            if (typeof this._once[name] == "undefined")
            {
                this._once[name] = { listeners: [] }
            }
            
            if (this._once[name].listeners.indexOf(callback) === -1)
            {
                this._once[name].listeners.push(callback)
            }
        }
    },
    
    _late_single: function (name, callback)
    {
        if (!name)
        {
            return
        }
        
        if (typeof this._late[name] == "undefined")
        {
            this.on(name, callback)
        }
        else if (this._late[name].args)
        {
            callback.apply(undefined, this._late[name].args)
            this.on(name, callback)
        }
        else
        {
            this._late[name].listeners.push(callback)
        }
    },
    
    _call_registration_function: function (fn, name, callback)
    {
        var bound = fn.bind(this)
        
        name.split(/\s+/).forEach(function (n)
        {
            bound(n, callback)
        })
    }
}

/**
 * Turn an object into an SimpleEvents instance.
 */
SimpleEvents.mixin = function (obj)
{
    obj._event_manager = new SimpleEvents()
    
    for (var n in obj._event_manager)
    {
        if (typeof obj._event_manager[n] == "function")
        {
            obj[n] = obj._event_manager[n].bind(obj._event_manager)
        }
    }
}
