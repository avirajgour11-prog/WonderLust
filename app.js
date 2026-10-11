if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utlis/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//store session information in MongoDB Atlas 
const store = MongoStore.create({
 mongoUrl: process.env.ATLASDB_URL,
 crypto: {
    secret: process.env.SECRET,
 },
 touchAfter: 24 * 3600  //Note: in second not in mili second 
})
 
store.on("error", (error) => { 
    console.log("ERROR in MONGODB SESSION STORE", error );
    
 })

const sessionOption = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

//Basic configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//Make connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl = process.env.ATLASDB_URL;
main().then(() => {
    console.log("connected sucessfully");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

//Session
app.use(session(sessionOption));


//Flash
app.use(flash());

// passport initialize 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//user se realted information ko session ke andar store karana = serialize
passport.serializeUser(User.serializeUser());
//user se realted information ko session se remove karana = serialize
passport.deserializeUser(User.deserializeUser());

//Global variables
app.use((req, res, next) => { //new listing added message
    res.locals.success = req.flash('success');
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


//Routers 
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter)

// check all the known route and give Error on unknown route
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Somnething went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});



app.listen(8080, () => {
    console.log("server is listening request at server 8080");

});

