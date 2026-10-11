const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });//multer store file in cloudinary storage

router.route("/")
.get(wrapAsync(listingController.index))//index route
.post(                                  //create route
     isLoggedIn, 
     upload.single('listing[image][url]'), 
     validateListing,
     wrapAsync(listingController.createListing))
     
//New Route
router.get("/new",
     isLoggedIn,
     listingController.renderNewForm
);

router.route("/:id")
.get(
     wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image][url]'), 
    validateListing,
    wrapAsync(listingController.updateListings))
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));

//Show Route (order issue)


//Edit Route
router.get("/:id/edit",
     isLoggedIn,
     isOwner,
     wrapAsync(listingController.renderEditForm))


module.exports = router;


