

const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            // console.log(registeredUser);
            req.flash("success", `Dear ${registeredUser.username}, Welcome to WonderLust`)
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WonderLust")
    //if res.locals.redirect exist then redirect on it else riderect to listings 
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "logged you out");
        res.redirect("listings")
    })
}

