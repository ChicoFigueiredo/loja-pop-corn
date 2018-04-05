const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

GoogleStrategy.prototype.userProfile = function(token, done) {
    done(null, {})
}

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
            clientID: '954700325718-rr3jab9sb3hf6hnpe38uak881rmgimg6.apps.googleusercontent.com',
            clientSecret: 'R7BZl36s9vZLEG_Mai8aHS3e',
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
        (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token
            });
        }));
};