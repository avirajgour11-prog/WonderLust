const Listing = require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require("./utlis/ExpressError.js");
const { listingSchema,reviewSchema } = require("./Schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);// give user information only when user is login other wise it is undefined
    if (!req.isAuthenticated()) {// check if user not login they don't able to create listing
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "you must be logged in first to create listing!")
        return res.redirect("/login");
    }

    next();}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next()
}
//indevidual error handler
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

module.exports.isReviewAuhor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next()
}