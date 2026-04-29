const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload=multer({storage});




//index route:
router.get("/",wrapAsync(listingController.index));

//new route
router.get("/new",isLoggedIn,listingController.renderNewform);

//create and save in db route:
router.post("/new",isLoggedIn,upload.single("lis[image]"),wrapAsync(listingController.createListing));


//show route:
router.get("/:id",wrapAsync(listingController.showListings));


//edit route:
router.get("/edit/:id",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

//update route:
router.put("/edit/:id",isLoggedIn,isOwner,upload.single("lis[image]"),validateListing,wrapAsync(listingController.updateListing));

//delete route:
router.delete("/delete/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports=router;