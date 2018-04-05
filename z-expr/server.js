const express = require('express'),
    app = express(),
    passport = require('passport'),
    auth = require('./auth'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(cookieSession({
    name: 'session',
    keys: ['123']
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

auth(passport);
app.use(passport.initialize());
app.use(passport.session());
app.get('/', (req, res) => {
    console.log('token: ' + req.session.token);
    if (req.session.token) {
        res.cookie('token', req.session.token);
        res.json({
            status: 'session cookie set'
        });
    } else {
        res.cookie('token', '')
        res.json({
            status: 'session cookie not set'
        });
    }
});
app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        req.session.token = req.user.token;
        res.redirect('/');
    }
);
app.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/auth/google');
}

app.get('/account', ensureAuthenticated, function(req, res) {
    res.render('account', { user: req.user });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});