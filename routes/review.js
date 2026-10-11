const express = require("express");
const router = express.Router({ mergeParams: true });//:id 
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/ExpressError.js");
const Listing = require("../models/listing.js")// 
const Review = require("../models/reviews.js");
const { reviewSchema } = require("../Schema.js");
const{ validateReview, isLoggedIn, isReviewAuhor} = require("../middleware.js");
const reviewController = require("../controller/review.js")

//Review
// add review route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuhor,
     wrapAsync(reviewController.destroyReview));

module.exports = router