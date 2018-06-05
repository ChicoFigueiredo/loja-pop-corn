var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({ passReqToCallback: true },
    function(req, username, password, done) {
        console.log(username + '/' + JSON.stringify(password));
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            console.log(user.password);
            console.log('passou');
            if (user.password != password) {
                return done(null, false, req.flash('message', 'Senha Inválida'));
            }
            console.log('passou');
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    console.log("USER>" + JSON.stringify(user))
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ username: id }, function(err, user) {
        done(err, user);
    });
});

module.exports = passport;