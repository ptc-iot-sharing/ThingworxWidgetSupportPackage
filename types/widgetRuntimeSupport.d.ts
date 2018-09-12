declare module 'typescriptwebpacksupport' {
    /**
     * Returns a decorator that binds the class member it is applied to to the given widget property.
     * When this decorator is used, `updateProperty` becomes optional.
     *
     * The class member to which this descriptor is applied should not have a getter. If it does, it will be replaced
     * by this decorator.
     */
    export function TWProperty(name: any): (target: any, key: any, descriptor: any) => void;
    /**
     * Returns a decorator that binds the class method it is applied to to the given widget service.
     * When this decorator is used, `serviceInvoked` becomes optional.
     */
    export function TWService(name: any): (target: any, key: any, descriptor: any) => void;
    /**
     * Makes the given widget class available to Thingworx.
     * @param widget        The widget class to export.
     */
    export function ThingworxRuntimeWidget(widget: any): void;
    /**
     * Makes the given widget class available to Thingworx.
     * @param widget        The widget class to export.
     */
    export function ThingworxComposerWidget(widget: any): void;
    /**
     * Makes the given widget class available to Thingworx.
     * @param name          The name with which the widget will be exported.
     */
    export function TWNamedComposerWidget(name: any): (widget: any) => void;
    /**
     * Makes the given widget class available to Thingworx.
     * @param name          The name with which the widget will be exported.
     */
    export function TWNamedRuntimeWidget(name: any): (widget: any) => void;

}