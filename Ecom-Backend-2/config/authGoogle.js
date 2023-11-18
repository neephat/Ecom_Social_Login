const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const _ = require("lodash");
const { User } = require("../models/user");

const strategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, cb) => {
        console.log("This is the user profile => ", profile);

        let user = await User.findOneAndUpdate({
            googleId: profile.id,
        });
        console.log("Google ID: ", user);
        if (user) {
            if(user.provider === 'google'){
                const token = user.generateJWT();
            
                const response = {
                    user: _.pick(user, ["email", "_id", "provider"]),
                    token: token,
                };
                cb(null, response);
            }else{
                const token = user.generateJWT();
                user = await User.findOneAndUpdate({provider: 'facebook'}, {email: profile._json.email, name: profile._json.name, provider: 'google'}, {new: true})
                const response = {
                    user: _.pick(user, ["email", "_id", "provider"]),
                    token: token,
                };
                cb(null, response);
            }    
            console.log("User exists :", user);
        } else {
            user = new User({
                googleId: profile.id,
                email: profile._json.email,
                name: profile.displayName,
                provider: profile.provider
            });

            await user.save();

            const token = user.generateJWT();

            const response = {
                user: _.pick(user, ["email", "_id", "provider"]),
                token: token,
            };

            cb(null, response);

            console.log("This is new user => ", user);
        }
    }
);

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => done(err, user));
// });

passport.use(strategy);