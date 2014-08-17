app.constant("FIREBASE_URL", "https://brilliant-fire-7355.firebaseio.com/");

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
    gridWidth: 5
});