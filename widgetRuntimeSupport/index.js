/**
 * A class that represents a property aspect.
 */
class TWPropertyAspect {
    static aspectWithKeyAndValue(key, value) {
        let aspect = new TWPropertyAspect();
        aspect._key = key;
        aspect._value = value;
        return aspect;
    }
}

/**
 * Constructs and returns a property aspect that can be used to 
 * specify a method that can verify binding information before updating the property.
 * 
 * This must be the name of a method on the widget class that received the following parameters:
 * - **`value`**:     Represents the value that is about to be assigned to the property.
 * - **`info`**:      The complete `UpdatePropertyInfo` object.
 * 
 * The method must return a `boolean` that specify whether the binding update should occur or not.
 * @param {string} name         The name of the method that will handle this.
 * @return {TWPropertyAspect}   A property aspect.
 */
export function willBind(name) {
    return TWPropertyAspect.aspectWithKeyAndValue('willBind', name);
}

/**
 * Constructs and returns a property aspect that can be used to 
 * specify a method that will be invoked after the property has been updated because of a binding.
 * Unlike the regular setter, this method will not be invoked when the property is assigned normally.
 * 
 * When this method is invoked, the new value will have been assigned to the property.
 * 
 * This must be the name of a method on the widget class that received the following parameters:
 * - **`previousValue`**:       Represents the property's previous value.
 * - **`info`**:                The complete `UpdatePropertyInfo` object.
 * 
 * The method is not expected to return any value.
 * @param {string} name         The name of the method that will handle this.
 * @return {TWPropertyAspect}   A property aspect.
 */
export function didBind(name) {
    return TWPropertyAspect.aspectWithKeyAndValue('didBind', name);
}

/**
 * Constructs and returns a property aspect that can be used to 
 * specify the name of the thingworx property which will be bound to this property.
 * 
 * If this aspect is not specified, the name of the class member will be used by default.
 * @param {string} name         The name of the property.
 * @return {TWPropertyAspect}   A property aspect.
 */
export function name(name) {
    return TWPropertyAspect.aspectWithKeyAndValue('name', name);
}

/**
 * A decorator that binds the given class member to a service with the same name.
 * 
 * Optionally, this function may be invoked with a string as its first parameter,
 * in which case it will return a decorator that binds the given class member
 * to the service with the specified name.
 */
export function service(arg1) {
    let name = arg1;
    const decorator = function (target, key, descriptor) {
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

    if (typeof arg1 == 'string') {
        return decorator;
    }
    else {
        name = arguments[1];
        decorator.apply(this, arguments);
    }
}

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

