app.constant("COMPONENT_PROPERTIES", {

    minHeight: 100,
    minWidth: 100,
    defaultHeight: 200,
    defaultWidth: 200,
    resizerHorizontalOrVerticalWidth: 5,
    resizerHorizontalAndVerticalWidth: 30,
    spaceBetweenBorderToLaunchScroll: 50,

    _supportedComponents: {
        text: {},
        youtube: {
            hasNotEditMode: true
        }
    },

    isDeleteEvent: function(event) {
        return event.keyCode == 46;
    },

    isMoveEvent: function(event) {
        return (this.isMoveUpEvent(event) || this.isMoveDownEvent(event) ||
            this.isMoveRightEvent(event) || this.isMoveLeftEvent(event));
    },

    isMoveUpEvent: function(event) {
        return event.keyCode == 38;
    },

    isMoveDownEvent: function(event) {
        return event.keyCode == 40;
    },

    isMoveRightEvent: function(event) {
        return event.keyCode == 39;
    },

    isMoveLeftEvent: function(event) {
        return event.keyCode == 37;
    },

    /* That function is just a useful function but not configurable */
    hasEditMode: function(componentType) {
        return !this._supportedComponents[componentType].hasNotEditMode;
    }
});