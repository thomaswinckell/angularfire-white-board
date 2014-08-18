app.constant("FIREBASE_URL", "https://test-fire-whiteboard.firebaseio.com/");

app.constant("AUTHENTICATION", {

    enabled : false,
    loginProvider: 'google',
    options: {
        preferRedirect: true,
        rememberMe: true,
        scope: 'https://www.googleapis.com/auth/plus.login'
    }
});

app.constant("WHITE_BOARD_PROPERTIES", {

    gridWidth: 20,

    isEnableControlModeEvent: function(event) {
        return ((event.keyCode == 17) && event.ctrlKey);
    },

    isDisableControlModeEvent: function(event) {
        return ((event.keyCode == 17) && !event.ctrlKey);
    }
});
