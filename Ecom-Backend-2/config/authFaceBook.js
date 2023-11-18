const passport = require("passport");
const FaceBookStrategy = require("passport-facebook").Strategy;
const _ = require("lodash");
const { User } = require("../models/user");

const strategy = new FaceBookStrategy(
    {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3001/auth/facebook/redirect",
        profileFields: ["id", "displayName", "photos", "email"],
        scope: ["email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
        console.log("This is facebook profile => ", profile);

        let user = await User.findOneAndUpdate({
            facebookId: profile.id
        });
        
        console.log("Facebook ID: ", user);
        if (user) {
            if(user.provider === 'facebook'){
                const token = user.generateJWT();
            
                const response = {
                    user: _.pick(user, ["email", "_id", "provider"]),
                    token: token,
                };
                cb(null, response);
            }else{
                const token = user.generateJWT();
                user = await User.findOneAndUpdate({provider: 'google'}, {email: profile._json.email, name: profile._json.name, provider: 'facebook'}, {new: true})
                const response = {
                    user: _.pick(user, ["email", "_id", "provider"]),
                    token: token,
                };
                cb(null, response);
            }
           

            console.log("Facebook user exists");
        } else {
            user = new User({
                facebookId: profile.id,
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

            console.log("New facebook user created => ", user);
        }
    }
);

passport.use(strategy);
