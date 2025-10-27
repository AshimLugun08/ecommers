// C:\Users\asus\Downloads\ifm\project\backend\config\passport.js (Your existing code)

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/api/auth/google/callback',
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists by email
                let user = await User.findOne({ email: profile.emails[0].value });

                // If not, create a new user
                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: 'google-auth', // Dummy password (not used)
                    });
                }

                // Note: The token created here is not used for the final redirect,
                // but we call done(null, user) or done(null, {user, token}) 
                // to populate req.user in the callback. Using 'user' is safer.
                return done(null, user); 
            } catch (err) {
                console.error('Google Strategy Error:', err);
                return done(err, null);
            }
        }
    )
);

// Note: If session is false (as in auth.js), serialize/deserialize aren't strictly needed 
// but are good to keep for consistency.
passport.serializeUser((user, done) => done(null, user.id)); 
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
});

module.exports = passport;