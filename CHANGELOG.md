## 2.3.1 (2023-10-19)

- Typescript definitions
  - Added more missing definitions at IDE
 
## 2.3.0 (2023-10-18)

- Features
  - At IDE, for `@property` annotations, setters can also be used instead of just `@didSet` decorators
- Bug fixes
  - Fix error that would appear in the browser console when a widget is destroyed
- Typescript definitions
  - Added documentation about the global ThingWorx invoker class 
  - Add documentation for TWQuery, copied from the [BMThingTransformer](https://github.com/BogdanMihaiciuc/ThingTransformer/blob/master/static/types/TWBaseTypes.d.ts#L365) package
  - Make the `TWInfotable` types generic
  - Added missing IDE `updateProperties` method parameters added in ThingWorx 9.3
  - Make the `getProperty`, allowing the user to either specify a type, or have the type inferred from the default value
  - Add `IDE.convertLocalizableString`

## 2.2.2 (2023-04-10)

- Adds property aspects that can be used to mark properties as nullable and specify a placeholder for them, for example, to support the "Autosize" behaviour on the width and height properties.

## 2.2.1 (2023-01-17)

- Fix issue that caused boolean or other non string properties from being correctly propagated
- Certain decorator aspects were copied on all classes that extended from a base class. This was because the check to initialise or retrieve the decorator store was always returning the superclass store rather than initialising a new one on the subclasses.

## 2.0.9 (2020-09-04)

- Fixes issues importing this project in widgets that depend on `@types/jquery`

## 2.0.8 (2020-07-31)

- Added compatibly with Thingworx 9 (7b1f12fddec791e54886301f81d8a4078500fc7b)

## 2.0.7 (2020-07-01)

- Corrected the type definitions of `allWidgetProperties().properties`

## 2.0.6 (2020-07-01)

- Added missing `@responsiveWidgetContainer` and `@nonRemovable` composer widget annotations
- Expose method `TWWidgetAspect.aspectWithKeyAndValue` as public, since it will enable users to use methods that are not fully defined
- Added missing `addWidget`, `widgetContextMenuCmd` and `widgetContextMenuItems` on composer widgets

## 2.0.5 (2020-04-29)

- Added missing `select` and `unselect` methods on composer widgets (4b6feb2962667e6d9e2d3cc36af5a553ba2a031c)

## 2.0.4 (2020-03-25)

### Bug Fixes

- Fixed widgets that inherit from a base widget sharing properties: https://github.com/ptc-iot-sharing/ThingworxWidgetSupportPackage/commit/c546e8a4914c126612140075c8822a846092980a

## 2.0.3 (2019-12-17)

### Bug Fixes

- Fixed missing `selectOptions` on `@property` annotations: https://github.com/ptc-iot-sharing/ThingworxWidgetSupportPackage/commit/c7aeb3b200217bd9220db2f78752f1e54c5cb0c7 and https://github.com/ptc-iot-sharing/ThingworxWidgetSupportPackage/commit/fa43b98359cbf51b478ffd1fd8d9e31bada44616

## 2.0.1 (2019-12-10)

### Bug Fixes

- Support for multiple versions of a widgets: https://github.com/ptc-iot-sharing/ThingworxWidgetSupportPackage/commit/e9f1482af7a051bc1df8cb6c1b67beaf482e9c1f
