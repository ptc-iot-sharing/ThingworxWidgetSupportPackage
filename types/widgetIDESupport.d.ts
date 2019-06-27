declare module 'TWIDESupport' {

    /**
     * A class that represents a property aspect.
     */
    class TWPropertyAspect {
        private static aspectWithKeyAndValue(key: string, value: any): TWPropertyAspect;

        private _key: string;

        private _value: any;
    }

    class TWSourceInfotablePropertyAspect extends TWPropertyAspect {
    }

    /**
     * Makes this property a binding target.
     */
    export const bindingTarget: TWPropertyAspect;

    /**
     * Makes this property a binding source.
     */
    export const bindingSource: TWPropertyAspect;

    /**
     * Makes this property non-editable in the composer.
     */
    export const nonEditable: TWPropertyAspect;

    /**
     * Makes this property hidden.
     */
    export const hidden: TWPropertyAspect;

    /**
     * Makes this property localizable.
     */
    export const localizable: TWPropertyAspect;

    /**
     * When baseType is set to `'TAGS'` this makes the tag type be model tags. If this aspect is not specified,
     * the tag type will default to data tags.
     */
    export const tagType: TWPropertyAspect;

    /**
     * Constructs and returns a property aspect that specifies what infotable the widget
     * should look into when displaying the available fields, when the baseType is set to `'FIELDNAME'`.
     * This must be the name of one of this widget's infotable properties.
     * @param {string} name                         The name of the infotable property.
     * @return {TWSourceInfotablePropertyAspect}    A property aspect.
     */
    export function sourcePropertyName(name: string): TWSourceInfotablePropertyAspect;

    /**
     * Constructs and returns a property aspect that specifies what infotable
     * property this rendering is based upon when the baseType is set to `'RENDERERWITHFORMAT'`. 
     * This must be the name of one of this widget's infotable properties.
     * @param {string} name         The name of the infotable property.
     * @return {TWPropertyAspect}   A property aspect.
     */
    export function baseTypeInfotableProperty(name): TWPropertyAspect;

    /**
     * Constructs and returns a property aspect that restricts the available fields
     * to only the fields of this base type, when the baseType is set to `'FIELDNAME'`.
     * @param {TWBaseType} name         The base type.
     * @return {TWPropertyAspect}       A property aspect.
     */
    export function baseTypeRestriction(name): TWPropertyAspect;

    /**
     * Constructs and returns a property aspect that sets the default value of the property.
     * @param {any} value               The default value.
     * @return {TWPropertyAspect}       A property aspect.
     */
    export function defaultValue(value): TWPropertyAspect;

    /**
     * Returns a decorator that marks the given property as a property definition. 
     * Getting or setting the affected property will then be routed through `getProperty` and `setProperty`.
     * @param {string} baseType     The property's base type.
     * @param  {...TWPropertyAspect} args        An optional list of property aspects to apply to this property.
     * @return {any}                A decorator.
     */
    export function property(baseType: TWBaseType, ...args: TWPropertyAspect[]): (target: any, key: any, descriptor?: any) => void;

    /**
     * Returns a decorator that marks the given property as a property definition. 
     * Getting or setting the affected property will then be routed through `getProperty` and `setProperty`.
     * @param {string} baseType     The property's base type.
     * @param  {...TWPropertyAspect} args        An optional list of property aspects to apply to this property.
     * @return {any}                A decorator.
     */
    export function property(baseType: 'FIELDNAME', sourceProperty: TWSourceInfotablePropertyAspect, ...args: TWPropertyAspect[]): (target: any, key: any, descriptor?: any) => void;

    /**
     * A decorator that marks the given property as a service.
     * @param {} target 
     * @param {*} key 
     * @param {*} descriptor 
     */
    export function service(target: any, key: any, descriptor?: any): void;

    /**
     * A decorator that marks the given property as an event.
     * @param {} target 
     * @param {*} key 
     * @param {*} descriptor 
     */
    export function event(target: any, key: any, descriptor?: any): void;

    /**
     * Returns a decorator that sets the description of the given descriptor or the widget class.
     * This can be specified before any property, event or service definition.
     * If this is applied to a descriptor that hasn't been decorated with one of those decorators, a runtime error will be raised.
     * @param {string} description      The descriptor.
     * @return {any}                    A decorator.
     */
    export function description(description: string): (target: any, key?: any, descriptor?: any) => void;

    /**
     * A class that represents a widget aspect.
     */
    class TWWidgetAspect {
        private static aspectWithKeyAndValue(key, value): TWWidgetAspect;
    }


    /**
     * Makes this widget auto resizable.
     */
    export const autoResizable: TWWidgetAspect;

    /**
     * Makes this widget require a responsive container in order to be placed.
     * Should be used together with `autoResizable`.
     */
    export const requiresResponsiveParent: TWWidgetAspect;

    /**
     * Makes this widget draggable if it is a container.
     */
    export const draggable: TWWidgetAspect;

    /**
     * Makes this widget a container that can hold other widgets.
     */
    export const container: TWWidgetAspect;

    /**
     * Makes this widget a container that can hold other widgets in specific places.
     * This widget is expected to have elements representing dedicated spots for sub-widgets in its runtime and design-time DOM structures.
     * Its subwidgets will be added in order to its declarative spots.
     * The declarative spots are HTML elements with the `sub-widget-container-id` attribute set to this widget's ID and the `sub-widget` attribute set to
     * the index of the sub-widget that will be rendered within that element.
     */
    export const declaresSpotsForSubwidgets: TWWidgetAspect;

    /**
     * Prevents this widget from being repositioned by dragging.
     */
    export const preventPositioning: TWWidgetAspect;

    /**
     * Prevents pasting or adding other widgets to this widget.
     */
    export const preventPasting: TWWidgetAspect;

    /**
     * Prevents copying this widget.
     */
    export const preventCopying: TWWidgetAspect;

    /**
     * Causes this widget to gain a Thingworx generated label.
     * It is recommended to exclude this aspect and control labels manually.
     */
    export const supportsLabel: TWWidgetAspect;

    /**
     * Constructs and returns a widget aspect that sets the border width of the widget.
     * If the widget provides a border, this should be set to the width of the border. 
     * This helps ensure pixel-perfect WYSIWG between builder and runtime. 
     * If you set a border of 1px on the “widget-content” element at design time, you are effectively making that widget 2px taller and 2px wider (1px to each side). 
     * To account for this descrepancy, setting the borderWidth property will make the design-time widget the exact same number of pixels smaller. 
     * Effectively, this places the border “inside” the widget that you have created and making the width & height in the widget properties accurate.
     * @param {any} value               The border width value.
     * @return {TWWidgetAspect}       A property aspect.
     */
    export function borderWidth(value: string): TWWidgetAspect;

    /**
     * TBD
     */
    export function customEditor(value: string): TWWidgetAspect;

    /**
     * TBD
     */
    export function customEditorMenuText(value: string): TWWidgetAspect;
    
    
    /**
    * Returns a decorator that makes a given widget class available to Thingworx.
    * @param {string} name                 The display name of the widget.
    * @param  {...TWWidgetAspect} args     An optional list of aspects to apply to the widget.
    */
    export function TWWidgetDefinition(name: string, ...args: TWWidgetAspect[]): (widget: any) => void;

    /**
     * @deprecated Use TWWidgetDefinition
     * 
     * Makes the given widget class available to Thingworx.
     * @param widget        The widget class to export.
     */
    export function ThingworxComposerWidget(widget: any): void;

    /**
     * @deprecated Use TWWidgetDefinition
     * 
     * Makes the given widget class available to Thingworx.
     * @param name          The name with which the widget will be exported.
     */
    export function TWNamedComposerWidget(name: any): (widget: any) => void;

}
