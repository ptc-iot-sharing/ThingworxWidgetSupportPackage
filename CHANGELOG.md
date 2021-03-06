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
