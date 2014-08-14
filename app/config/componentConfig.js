app.constant("COMPONENT_PROPERTIES", {

    minHeight: 100,
    minWidth: 100,
    defaultHeight: 200,
    defaultWidth: 200,
    resizerHorizontalOrVerticalWidth: 5,
    resizerHorizontalAndVerticalWidth: 30,

    _supportedComponents: {
        text: {},
        youtube: {
            hasNotEditMode: true
        }
    },

    /* That function is just a useful function but not configurable */
    hasEditMode: function(componentType) {
        return !this._supportedComponents[componentType].hasNotEditMode;
    }
});