/**
 * @deprecated Use property.
 * 
 * Returns a decorator that binds the class member it is applied to to the given widget property.
 * When this decorator is used, `updateProperty` becomes optional.
 * 
 * The class member to which this descriptor is applied should not have a getter. If it does, it will be replaced
 * by this decorator.
 */
export function TWProperty(name) {
    return function (target, key, descriptor) {
        var setter;
        var hasDescriptor = (descriptor !== undefined);
        if (!hasDescriptor) descriptor = {};

        // Override the setter to call setProperty. It should also invoke the member's setter if it has one
        if (descriptor.set) {
            var previousSetter = descriptor.set;
            setter = function (value) {
                this.setProperty(name, value);
                previousSetter.apply(this, arguments);
            };
        }
        else {
            setter = function (value) {
                this.setProperty(name, value);
            }
        }
        // set the newly created setter
        descriptor.set = setter;

        // Override the getter to return the result of calling getProperty
        descriptor.get = function () {
            return this.getProperty(name);
        }

        // Decorate updateProperty if a previous annotation hasn't already done it
        if (!target._decoratedProperties) {
            target._decoratedProperties = {};
            var standardUpdateProperties = target.updateProperty;

            if (standardUpdateProperties) {
                target.updateProperty = function (info) {
                    if (this._decoratedProperties[info.TargetProperty]) this[this._decoratedProperties[info.TargetProperty]] = info.SinglePropertyValue || info.RawSinglePropertyValue;
                    standardUpdateProperties.apply(this, arguments);
                };
            }
            else {
                target.updateProperty = function (info) {
                    if (this._decoratedProperties[info.TargetProperty]) this[this._decoratedProperties[info.TargetProperty]] = info.SinglePropertyValue || info.RawSinglePropertyValue;
                };
            }
        }

        // Add this automatic property to the internal binding map
        target._decoratedProperties[name] = key;

        if (!hasDescriptor) Object.defineProperty(target, key, descriptor);
    }
}


/**
 * @deprecated Use service.
 * 
 * Returns a decorator that binds the class method it is applied to to the given widget service.
 * When this decorator is used, `serviceInvoked` becomes optional.
 */
export function TWService(name) {
    return function (target, key, descriptor) {
        // Decorate updateProperty if a previous annotation hasn't already done it
        if (!target._decoratedServices) {
            target._decoratedServices = {};
            var standardServiceInvoked = target.serviceInvoked;

            if (standardServiceInvoked) {
                target.serviceInvoked = function (name) {
                    if (this._decoratedServices[name]) this[this._decoratedServices[name]]();
                    standardServiceInvoked.apply(this, arguments);
                };
            }
            else {
                target.serviceInvoked = function (name) {
                    if (this._decoratedServices[name]) this[this._decoratedServices[name]]();
                };
            }
        }

        // Add this automatic property to the internal binding map
        target._decoratedServices[name] = key;
    }
}


// This creates an extensible base prototype from which classes can actually inherit
if (typeof TW.Widget == 'function') {
    (function () {
        let TWWidgetConstructor = TW.Widget;
        if (window.TWRuntimeWidget) return;
        let __BMTWInternalState;
        TW.Widget = function () {
            TWWidgetConstructor.apply(this, arguments);
            // To capture the internal state for class-based widgets, the base thingworx widget constructor
            // is decorated and its object is temporarily stored as a global variable
            __BMTWInternalState = this;
            return this;
        }

        // Copy over the static methods
        Object.keys(TWWidgetConstructor).forEach((key) => {
            TW.Widget[key] = TWWidgetConstructor[key];
        });

        let internalStates = new WeakMap();
        // Note that despite looking like a regular class, this will still require that widgets are created by thingworx
        // as they cannot function without the base instance created by `new TW.Widget()`
        window.TWRuntimeWidget = function () {
            // Because Thingworx incorrectly attempts to change the prototype of the exported widget
            // the new prototype is temporarily stored as a global variable and used as the internal state
            // for the widget
            internalStates.set(this, __BMTWInternalState);

            // After the internal state is initialized, all of its methods are redefined and bound
            // to the real widget and all of its properties are copied over to the widget
            // A possible hurdle would be the `thisWidget` reference to self that the Thingworx widget
            // creates, however that is reset in `appendTo` to that function's context object
            let self = this;
            Object.keys(__BMTWInternalState).forEach((key) => {
                let value = __BMTWInternalState[key];
                let state = __BMTWInternalState;

                if (typeof value == 'function') {
                    if (!TWRuntimeWidget.prototype[key]) {
                        (TWRuntimeWidget.prototype[key] = function () {
                            return internalStates.get(this)[key].apply(this, arguments);
                        })
                    }
                    __BMTWInternalState[key] = value.bind(this);
                }
                else {
                    this[key] = value;
                }
            });

            // Clear out the global internal state to prevent it from leaking
            __BMTWInternalState = undefined;
        }
        TWRuntimeWidget.prototype = {};
    })();
}

/**
 * Returns a decorator that makes a given widget class available to Thingworx.
 * @param {string} name                 The name of the widget.
 * @param  {...TWWidgetAspect} args     An optional list of aspects to apply to the widget.
 */
export function TWWidgetDefinition(name, ...args) {
    return function (widget) {
        // Thingworx attempts to change the prototype of the custom widget constructor
        // which in addition to being a bad practice, prevents the usual prototype-based inheritance
        // and prevents using the class-based syntax
        
        // As of Thingworx 8.4 making the prototype read-only is no longer viable as the widget factory
        // functions now run in strict mode and crash when attempting to write to the read-only prototype
        // property
        Object.defineProperty(widget, 'prototype', {writable: false});

        // Store the aspects as a static member of the class
        let aspects = {};

        if (args) for (let arg of args) {
            aspects[arg._key] = arg._value;
        }

        aspects.name = name;

        widget._aspects = aspects;
        
        // Instead, the widget constructor is replaced with a dummy function that returns the appropriate
        // instance when invoked
        TW.IDE.Widgets[widget.name] = function () {
            return new widget;
        }
    }
}

/**
 * @deprecated Use TWWidgetDefinition.
 * 
 * Makes the given widget class available to Thingworx.
 * @param widget        The widget class to export.
 */
export function ThingworxRuntimeWidget(widget) {
    // Thingworx attempts to change the prototype of the custom widget constructor
    // which in addition to being a bad practice, prevents the usual prototype-based inheritance
    // and prevents using the class-based syntax
    
    // As of Thingworx 8.4 making the prototype read-only is no longer viable as the widget factory
    // functions now run in strict mode and crash when attempting to write to the read-only prototype
    // property
    Object.defineProperty(widget, 'prototype', {writable: false});
    
    // Instead, the widget constructor is replaced with a dummy function that returns the appropriate
    // instance when invoked
    TW.Runtime.Widgets[widget.name] = function () {
        return new widget;
    }
}

/**
 * @deprecated Use TWWidgetDefinition.
 * 
 * Makes the given widget class available to Thingworx.
 * @param name          The name with which the widget will be exported.
 */
export function TWNamedRuntimeWidget(name) {
    return function (widget) {
        // Thingworx attempts to change the prototype of the custom widget constructor
        // which in addition to being a bad practice, prevents the usual prototype-based inheritance
        // and prevents using the class-based syntax

        // As of Thingworx 8.4 making the prototype read-only is no longer viable as the widget factory
        // functions now run in strict mode and crash when attempting to write to the read-only prototype
        // property
        Object.defineProperty(widget, 'prototype', {writable: false});

        // Instead, the widget constructor is replaced with a dummy function that returns the appropriate
        // instance when invoked
        TW.Runtime.Widgets[name] = function () {
            return new widget;
        }
    }
}

