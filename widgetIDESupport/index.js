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
 * Makes this property a binding target.
 */
export const bindingTarget = TWPropertyAspect.aspectWithKeyAndValue('isBindingTarget', true);

/**
 * Makes this property a binding source.
 */
export const bindingSource = TWPropertyAspect.aspectWithKeyAndValue('isBindingSource', true);

/**
 * Makes this property non-editable in the composer.
 */
export const nonEditable = TWPropertyAspect.aspectWithKeyAndValue('isEditable', false);

/**
 * Makes this property hidden.
 */
export const hidden = TWPropertyAspect.aspectWithKeyAndValue('isVisible', false);

/**
 * Makes this property localizable.
 */
export const localizable = TWPropertyAspect.aspectWithKeyAndValue('isLocalizable', true);

/**
 * When baseType is set to `'TAGS'` this makes the tag type be model tags. If this aspect is not specified,
 * the tag type will default to data tags.
 */
export const tagType = TWPropertyAspect.aspectWithKeyAndValue('isLocalizable', 'ModelTags');

/**
 * Constructs and returns a property aspect that specifies what infotable the widget
 * should look into when displaying the available fields, when the baseType is set to `'FIELDNAME'`.
 * This must be the name of one of this widget's infotable properties.
 * @param {string} name         The name of the infotable property.
 * @return {TWPropertyAspect}   A property aspect.
 */
export function sourcePropertyName(name) {
    return TWPropertyAspect.aspectWithKeyAndValue('sourcePropertyName', name);
}

/**
 * Constructs and returns a property aspect that specifies what infotable
 * property this rendering is based upon when the baseType is set to `'RENDERERWITHFORMAT'`. 
 * This must be the name of one of this widget's infotable properties.
 * @param {string} name         The name of the infotable property.
 * @return {TWPropertyAspect}   A property aspect.
 */
export function baseTypeInfotableProperty(name) {
    return TWPropertyAspect.aspectWithKeyAndValue('baseTypeInfotableProperty', name);
}

/**
 * Constructs and returns a property aspect that restricts the available fields
 * to only the fields of this base type, when the baseType is set to `'FIELDNAME'`.
 * @param {TWBaseType} name         The base type.
 * @return {TWPropertyAspect}       A property aspect.
 */
export function baseTypeRestriction(name) {
    return TWPropertyAspect.aspectWithKeyAndValue('baseTypeRestriction', name);
}

/**
 * Constructs and returns a property aspect that sets the default value of the property.
 * @param {any} value               The default value.
 * @return {TWPropertyAspect}       A property aspect.
 */
export function defaultValue(value) {
    return TWPropertyAspect.aspectWithKeyAndValue('defaultValue', value);
}


/**
 * Constructs and returns a property aspect that represents the name of a method that will be
 * invoked when user sets a property value, but before it is actually updated.
 * The method can be used to validate the new property value.
 * 
 * This must be the name of a method on the widget class that receives the following parameters:
 * - **`value`**:     Represents the value that is about to be assigned to the property.
 * 
 * The method can return a `string` if the update should fail. The string returned by that method
 * will be used as an error message displayed to the user that explains why the new value was rejected.
 * @param {string} name         The name of the method that will handle this.
 * @return {TWPropertyAspect}   A property aspect.
 */
export function willSet(name) {
    return TWPropertyAspect.aspectWithKeyAndValue('_willSet', name);
}

/**
 * Constructs and returns a property aspect that represents the name of a method that will be
 * invoked when user sets a property value, after its value has been updated.
 * The method can be used to react to the updated property or instruct Thingworx to redraw the widget.
 * 
 * This must be the name of a method on the widget class that receives the following parameters:
 * - **`value`**:     Represents the value that has been assigned to the property.
 * 
 * The method can return a `boolean` that tells Thingworx whether the widget should be redrawn because of the update.
 * @param {string} name         The name of the method that will handle this.
 * @return {TWPropertyAspect}   A property aspect.
 */
export function didSet(name) {
    return TWPropertyAspect.aspectWithKeyAndValue('_didSet', name);
}

/**
 * Constructs and returns a property aspect that represents the name of a method that will be
 * invoked when user adds a binding source to this property.
 * The method can be used to react to the new binding.
 * 
 * This must be the name of a method on the widget class that will receive no parameters.
 * 
 * The method is not expected to return any value.
 * @param {string} name         The name of the method that will handle this.
 * @return {TWPropertyAspect}   A property aspect.
 */
export function didBind(name) {
    return TWPropertyAspect.aspectWithKeyAndValue('_didBind', name);
}

const willSetSymbol = window.Symbol ? window.Symbol() : '@@_willSet';
const didSetSymbol = window.Symbol ? window.Symbol() : '@@_didSet';
const didBindSymbol = window.Symbol ? window.Symbol() : '@@_didBind';
const versionSymbol = window.Symbol ? window.Symbol() : '@@_version';

const _getInheritedProperty = function (proto, property) {
    if (proto[property]) return proto[property];

    const superproto = Object.getPrototypeOf(proto);

    proto[property] = {};
    for (const key in superproto[property]) {
        proto[property][key] = superproto[property][key];
    }

    return proto[property];
}

const _getDecoratedProperties = proto => _getInheritedProperty(proto, '_decoratedProperties');
const _getDecoratedWillSet = proto => _getInheritedProperty(proto, willSetSymbol);
const _getDecoratedDidSet = proto => _getInheritedProperty(proto, didSetSymbol);
const _getDecoratedDidBind = proto => _getInheritedProperty(proto, didBindSymbol);

/**
 * Returns a decorator that marks the given property as a property definition. 
 * Getting or setting the affected property will then be routed through `getProperty` and `setProperty`.
 * @param {string} baseType     The property's base type.
 * @param  {...TWPropertyAspect} args        An optional list of property aspects to apply to this property.
 * @return {any}                A decorator.
 */
export function property(baseType, ...args) {
    return function (target, key, descriptor) {
        var setter;
        var hasDescriptor = (descriptor !== undefined);
        if (!hasDescriptor) descriptor = {};

        // Override the setter to call setProperty. It should also invoke the member's setter if it has one
        if (descriptor.set) {
            var previousSetter = descriptor.set;
            setter = function (value) {
                this.setProperty(key, value);
                previousSetter.apply(this, arguments);
            };
        }
        else {
            setter = function (value) {
                this.setProperty(key, value);
            }
        }
        // set the newly created setter
        descriptor.set = setter;

        // Override the getter to return the result of calling getProperty
        descriptor.get = function () {
            return this.getProperty(key);
        }

        // Create the _decoratedProperties property if a previous annotation hasn't already done it
        if (!target._decoratedProperties) {
            target._decoratedProperties = _getDecoratedProperties(target);
        }

        // Add this automatic property to the internal binding map
        target._decoratedProperties[key] = {
            baseType: baseType,
            type: 'property'
        };

        if (args) for (const arg of args) {
            if (arg._key.startsWith('_')) {
                // Underscore prefixed names are custom aspects that must be handled separately
                switch (arg._key) {
                    case '_willSet':
                        target[willSetSymbol] = _getDecoratedWillSet(target);
                        target[willSetSymbol][key] = arg._value;
                        break;
                    case '_didSet':
                        target[didSetSymbol] = _getDecoratedDidSet(target);
                        target[didSetSymbol][key] = arg._value;
                        break;
                    case '_didBind':
                        target[didBindSymbol] = _getDecoratedDidBind(target);
                        target[didBindSymbol][key] = arg._value;
                        break;
                }
            }
            else {
                target._decoratedProperties[key][arg._key] = arg._value;
            }
        }

        if (!hasDescriptor) Object.defineProperty(target, key, descriptor);
    }
}

/**
 * A decorator that marks the given property as a service.
 * @param {} target 
 * @param {*} key 
 * @param {*} descriptor 
 */
export function service(target, key, descriptor) {
    // Create the _decoratedProperties property if a previous annotation hasn't already done it
    if (!target._decoratedProperties) {
        target._decoratedProperties = _getDecoratedProperties(target);
    }

    // Add this automatic property to the internal binding map
    target._decoratedProperties[key] = {
        type: 'service'
    };
}

/**
 * A decorator that marks the given property as an event.
 * @param {} target 
 * @param {*} key 
 * @param {*} descriptor 
 */
export function event(target, key, descriptor) {
    // Create the _decoratedProperties property if a previous annotation hasn't already done it
    if (!target._decoratedProperties) {
        target._decoratedProperties = _getDecoratedProperties(target);
    }

    // Add this automatic property to the internal binding map
    target._decoratedProperties[key] = {
        type: 'event'
    };
}

/**
 * Returns a decorator that sets the description of the given descriptor or the widget class.
 * This can be specified before any property, event or service definition.
 * If this is applied to a descriptor that hasn't been decorated with one of those decorators, a runtime error will be raised.
 * @param {string} description      The descriptor.
 * @return {any}                    A decorator.
 */
export function description(description) {
    return function (target, key, descriptor) {
        if (!key) {
            // If key is not defined, then this decorator has been applied to the class
            target._aspects.description = description;
        }
        else {
            // Add this automatic property to the internal binding map
            target._decoratedProperties[key].description = description;
        }
    }
}

/**
 * A class that represents a widget aspect.
 */
class TWWidgetAspect {
    static aspectWithKeyAndValue(key, value) {
        let aspect = new TWWidgetAspect();
        aspect._key = key;
        aspect._value = value;
        return aspect;
    }
}


/**
 * Makes this widget auto resizable.
 */
export const autoResizable = TWWidgetAspect.aspectWithKeyAndValue('supportsAutoResize', true);

/**
 * Makes this widget require a responsive container in order to be placed.
 * Should be used together with `autoResizable`.
 */
export const requiresResponsiveParent = TWWidgetAspect.aspectWithKeyAndValue('onlySupportedInResponsiveParents', true);

/**
 * Makes this widget draggable if it is a container.
 */
export const draggable = TWWidgetAspect.aspectWithKeyAndValue('isDraggable', true);

/**
 * Makes this widget a container that can hold other widgets.
 */
export const container = TWWidgetAspect.aspectWithKeyAndValue('isContainer', true);

/**
 * Makes this widget a container that can hold other widgets in specific places.
 * This widget is expected to have elements representing dedicated spots for sub-widgets in its runtime and design-time DOM structures.
 * Its subwidgets will be added in order to its declarative spots.
 * The declarative spots are HTML elements with the `sub-widget-container-id` attribute set to this widget's ID and the `sub-widget` attribute set to
 * the index of the sub-widget that will be rendered within that element.
 */
export const declaresSpotsForSubwidgets = TWWidgetAspect.aspectWithKeyAndValue('isContainerWithDeclarativeSpotsForSubWidgets', true);

/**
 * Prevents this widget from being repositioned by dragging.
 */
export const preventPositioning = TWWidgetAspect.aspectWithKeyAndValue('allowPositioning', false);

/**
 * Prevents pasting or adding other widgets to this widget.
 */
export const preventPasting = TWWidgetAspect.aspectWithKeyAndValue('allowPasteOrDrop', false);

/**
 * Prevents copying this widget.
 */
export const preventCopying = TWWidgetAspect.aspectWithKeyAndValue('allowCopy', false);

/**
 * Causes this widget to gain a Thingworx generated label.
 * It is recommended to exclude this aspect and control labels manually.
 */
export const supportsLabel = TWWidgetAspect.aspectWithKeyAndValue('supportsLabel', true);

/**
 * Constructs and returns a widget aspect that sets the border width of the widget.
 * If the widget provides a border, this should be set to the width of the border. 
 * This helps ensure pixel-perfect WYSIWG between builder and runtime. 
 * If you set a border of 1px on the “widget-content” element at design time, you are effectively making that widget 2px taller and 2px wider (1px to each side). 
 * To account for this descrepancy, setting the borderWidth property will make the design-time widget the exact same number of pixels smaller. 
 * Effectively, this places the border “inside” the widget that you have created and making the width & height in the widget properties accurate.
 * @param {any} value               The border width value.
 * @return {TWPropertyAspect}       A property aspect.
 */
export function borderWidth(value) {
    return TWWidgetAspect.aspectWithKeyAndValue('borderWidth', value);
}

/**
 * TBD
 */
export function customEditor(value) {
    return TWWidgetAspect.aspectWithKeyAndValue('customEditor', value);
}

/**
 * TBD
 */
export function customEditorMenuText(value) {
    return TWWidgetAspect.aspectWithKeyAndValue('customEditorMenuText', value);
}


// This creates an extensible base prototype from which classes can actually inherit
if (TW.IDE && (typeof TW.IDE.Widget == 'function')) {
    (function () {
        let TWWidgetConstructor = TW.IDE.Widget;
        if (window.TWComposerWidget) {
            // Note that despite looking like a regular class, this will still require that widgets are created by thingworx
            // as they cannot function without the base instance created by `new TW.IDE.Widget()`
            if ((!TWComposerWidget.prototype[versionSymbol]) || TWComposerWidget.prototype[versionSymbol] < 2) {
                // Duplication needed for compatibility with previous versions
                let prototype = {
                    widgetProperties() {
                        // If this widget was created with aspect decorators, assume that everything
                        // else can be initialized by decorators
                        if (this.constructor._aspects) {
                            let result = {};
                            for (let aspect in this.constructor._aspects) {
                                result[aspect] = this.constructor._aspects[aspect];
                            }
        
                            // this._decoratedProperties contains properties, events and
                            // services together, so it has to be filtered to only return the properties
                            result.properties = {};
                            if (this._decoratedProperties) {
                                for (let property in this._decoratedProperties) {
                                    if (this._decoratedProperties[property].type == 'property') {
                                        result.properties[property] = this._decoratedProperties[property];
                                    }
                                }
                            }
                            
                            return result;
                        }
                    },
        
                    widgetServices() {
                        var result = {};
                        if (this._decoratedProperties) {
                            for (let property in this._decoratedProperties) {
                                if (this._decoratedProperties[property].type == 'service') {
                                    result[property] = this._decoratedProperties[property];
                                }
                            }
                        }
                        return result;
                    },
        
                    widgetEvents() {
                        var result = {};
                        if (this._decoratedProperties) {
                            for (let property in this._decoratedProperties) {
                                if (this._decoratedProperties[property].type == 'event') {
                                    result[property] = this._decoratedProperties[property];
                                }
                            }
                        }
                        return result;
                    },

                    beforeSetProperty(key, value) {
                        if (this[willSetSymbol] && (key in this[willSetSymbol])) {
                            return this[this[willSetSymbol][key]](value);
                        }
                    },

                    afterSetProperty(key, value) {
                        if (this[didSetSymbol] && (key in this[didSetSymbol])) {
                            return this[this[didSetSymbol][key]](value);
                        }
                    },

                    afterAddBindingSource(info) {
                        if (this[didBindSymbol] && (info.targetProperty in this[didBindSymbol])) {
                            return this[this[didBindSymbol][info.targetProperty]](info);
                        }
                    }
                };
                TWComposerWidget.prototype.widgetProperties = prototype.widgetProperties;
                TWComposerWidget.prototype.widgetEvents = prototype.widgetEvents;
                TWComposerWidget.prototype.widgetServices = prototype.widgetServices;
                TWComposerWidget.prototype.beforeSetProperty = prototype.beforeSetProperty;
                TWComposerWidget.prototype.afterSetProperty = prototype.afterSetProperty;
                TWComposerWidget.prototype.afterAddBindingSource = prototype.afterAddBindingSource;
                TWComposerWidget.prototype[versionSymbol] = 2;

                // Make the prototype read-only; future releases will be able to handle this
                Object.defineProperty(window.TWComposerWidget, 'prototype', {writable: false});
            }
            return;
        }
        let __BMTWInternalState;
        let __BMTWArguments;
        TW.IDE.Widget = function () {
            TWWidgetConstructor.apply(this, arguments);
            // To capture the internal state for class-based widgets, the base thingworx widget constructor
            // is decorated and its object is temporarily stored as a global variable
            __BMTWInternalState = this;
            __BMTWArguments = Array.prototype.slice.call(arguments);
            return this;
        }

        // Copy over the static methods
        Object.keys(TWWidgetConstructor).forEach((key) => {
            TW.IDE.Widget[key] = TWWidgetConstructor[key];
        });

        let internalStates = new WeakMap();
        window.TWComposerWidget = function () {
            // Retain the object's current keys and values
            let keys = Object.keys(this);
            let values = {};
            let self = this;
            keys.forEach((key) => values[key] = self[key]);

            // Invoke the IDE constructor here as well
            TWWidgetConstructor.apply(this, __BMTWArguments);

            // Because Thingworx incorrectly attempts to change the prototype of the exported widget
            // the new prototype is temporarily stored as a global variable and used as the internal state
            // for the widget
            internalStates.set(this, __BMTWInternalState);

            // After the internal state is initialized, all of its methods are redefined and bound
            // to the real widget and all of its properties are copied over to the widget
            // A possible hurdle would be the `thisWidget` reference to self that the Thingworx widget
            // creates, however that is reset in `appendTo` to that function's context object
            Object.keys(__BMTWInternalState).forEach((key) => {
                let value = __BMTWInternalState[key];
                let state = __BMTWInternalState;

                if (typeof value == 'function') {
                    if (!TWComposerWidget.prototype[key]) {
                        (TWComposerWidget.prototype[key] = function () {
                            return internalStates.get(this)[key].apply(this, arguments);
                        })
                    }
                    __BMTWInternalState[key] = value.bind(this);
                    if (keys.indexOf(key) == -1) {
                        // Remove methods which are already defined on the prototype
                        delete this[key];
                    }
                    else {
                        // Otherwise restore the previous value, making it non-configurable
                        Object.defineProperty(this, key, {
                            value: values[key],
                            configurable: false,
                            writable: true
                        });
                        //this[key] = values[key];
                    }
                }
                else {
                    // Restore previous values if they were defined, making them unconfigurable
                    // A special exception has to be made for the 'properties' property which thingworx continues to use
                    // after the widget is removed and all its non-prototype properties have been removed
                    // That property is made non-writable in addition to being non-configurable
                    let writable = (key !== 'properties');
                    if (keys.indexOf(key) != -1) {
                        Object.defineProperty(this, key, {
                            value: values[key],
                            configurable: false,
                            writable: writable
                        });
                        //this[key] = values[key];
                    }
                    else {
                        Object.defineProperty(this, key, {
                            value: state[key],
                            configurable: false,
                            writable: writable
                        });
                        //this[key] = state[key];
                    }
                }
            });

            // Clear out the global internal state to prevent it from leaking
            __BMTWInternalState = undefined;
            __BMTWArguments = undefined;
        }
        TWComposerWidget.prototype = {
            widgetProperties() {
                // If this widget was created with aspect decorators, assume that everything
                // else can be initialized by decorators
                if (this.constructor._aspects) {
                    let result = {};
                    for (let aspect in this.constructor._aspects) {
                        result[aspect] = this.constructor._aspects[aspect];
                    }

                    // this._decoratedProperties contains properties, events and
                    // services together, so it has to be filtered to only return the properties
                    result.properties = {};
                    if (this._decoratedProperties) {
                        for (let property in this._decoratedProperties) {
                            if (this._decoratedProperties[property].type == 'property') {
                                result.properties[property] = this._decoratedProperties[property];
                            }
                        }
                    }
                    
                    return result;
                }
            },

            widgetServices() {
                var result = {};
                if (this._decoratedProperties) {
                    for (let property in this._decoratedProperties) {
                        if (this._decoratedProperties[property].type == 'service') {
                            result[property] = this._decoratedProperties[property];
                        }
                    }
                }
                return result;
            },

            widgetEvents() {
                var result = {};
                if (this._decoratedProperties) {
                    for (let property in this._decoratedProperties) {
                        if (this._decoratedProperties[property].type == 'event') {
                            result[property] = this._decoratedProperties[property];
                        }
                    }
                }
                return result;
            },

            beforeSetProperty(key, value) {
                if (this[willSetSymbol] && (key in this[willSetSymbol])) {
                    return this[this[willSetSymbol][key]](value);
                }
            },

            afterSetProperty(key, value) {
                if (this[didSetSymbol] && (key in this[didSetSymbol])) {
                    return this[this[didSetSymbol][key]](value);
                }
            },

            afterAddBindingSource(info) {
                if (this[didBindSymbol] && (info.targetProperty in this[didBindSymbol])) {
                    return this[this[didBindSymbol][info.targetProperty]](info);
                }
            },

            [versionSymbol]: 2
        };

        // Make the prototype read-only; future releases will be able to handle this
        Object.defineProperty(window.TWComposerWidget, 'prototype', {writable: false});

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

        // Ensure that decorated properties are copied over correctly
        _getDecoratedProperties(widget.prototype);
        _getDecoratedWillSet(widget.prototype);
        _getDecoratedDidSet(widget.prototype);
        _getDecoratedDidBind(widget.prototype);

        // Copy over the decorations from the superclass
        const superclass = Object.getPrototypeOf(widget.prototype).constructor;

        let aspects = {};

        for (const key in (superclass._aspects || {})) {
            aspects[key] = superclass._aspects[key];
        }

        // Add own aspects
        if (args) for (let arg of args) {
            aspects[arg._key] = arg._value;
        }

        aspects.name = name;

        // Store the aspects as a static member of the class
        widget._aspects = aspects;
        
        // Instead, the widget constructor is replaced with a dummy function that returns the appropriate
        // instance when invoked
        TW.IDE.Widgets[widget.name] = function () {
            return new widget;
        }
    }
}

/**
 * @deprecated Use the TWWidgetDefinition decorator.
 * Makes the given widget class available to Thingworx.
 * @param widget        The widget class to export.
 */
export function ThingworxComposerWidget(widget) {
    // Thingworx attempts to change the prototype of the custom widget constructor
    // which in addition to being a bad practice, prevents the usual prototype-based inheritance
    // and prevents using the class-based syntax
    
    // As of Thingworx 8.4 making the prototype read-only is no longer viable as the widget factory
    // functions now run in strict mode and crash when attempting to write to the read-only prototype
    // property
    Object.defineProperty(widget, 'prototype', {writable: false});
    
    // Instead, the widget constructor is replaced with a dummy function that returns the appropriate
    // instance when invoked
    TW.IDE.Widgets[widget.name] = function () {
        return new widget;
    }
}

/**
 * @deprecated Use the TWWidgetDefinition decorator.
 * Makes the given widget class available to Thingworx.
 * @param name          The name with which the widget will be exported.
 */
export function TWNamedComposerWidget(name) {
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
        TW.IDE.Widgets[name] = function () {
            return new widget;
        }
    }
}