// C:\Users\asus\Downloads\ifm\project\backend\config\passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Ensure this path correctly points to your Mongoose User model

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // 🛑 IMPORTANT: This URL must match the exact callback URL 
            // set in your Google Cloud Console for OAuth credentials.
            callbackURL: `${process.env.BASE_URL}/auth/google/callback`, 
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const userEmail = profile.emails[0].value;
                
                // 1. Check if user exists by email
                // When we find an existing user, the 'user' object will have the updated role (e.g., 'admin') 
                // IF it was successfully saved to the database.
                let user = await User.findOne({ email: userEmail });

                // 2. If user does not exist, create a new one
                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email: userEmail,
                        password: 'google-auth', // Placeholder password for OAuth users
                        role: 'user', // ✅ FIX: Default role for all new sign-ups
                    });
                }
                
                // 🔑 CRITICAL LOG: This helps debug the role issue. 
                // It must log 'admin' for your test user if the database update worked.
                console.log(`Passport Success: User ${user.email} Role: ${user.role}`);

                // 3. Return the user object. This object populates req.user in routes/auth.js
                return done(null, user); 

            } catch (err) {
                console.error('🔥 Google Strategy Error:', err);
                return done(err, null);
            }
        }
    )
);

// Passport serialization/deserialization for session management (standard practice)
passport.serializeUser((user, done) => done(null, user.id)); 

passport.deserializeUser((id, done) => {
    // Select('-password') is used to prevent sending the password hash to the frontend
    User.findById(id).select('-password').then(user => done(null, user));
});

module.exports = passport;