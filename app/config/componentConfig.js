app.constant("COMPONENT_PROPERTIES", {

    MIN_HEIGHT: 100,
    MIN_WIDTH: 100,
    DEFAULT_HEIGHT: 200,
    DEFAULT_WIDTH: 200,

    SUPPORTED_COMPONENTS: {
        text: {},
        youtube: {
            hasNotEditMode: true
        }
    },

    /* That function is just a useful function but not configurable */
    hasEditMode: function(componentType) {
        return !this.SUPPORTED_COMPONENTS[componentType].hasNotEditMode;
    }
});