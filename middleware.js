const listing=require("./models/listings.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const expErr=require("./utils/expressError.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in!!!");
        return res.redirect("/login");
    }
    next();

}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    id=id.trim();

    const foundListing =await listing.findById(id);
    if(!foundListing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You must be the owner of this listing to perform the action");
        return res.redirect(`/listings/${id}`);

    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expErr(400,errMsg);
    }
    else{
        next();
    }
}


module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expErr(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;

    const review =await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You must be the author of this review to perform the action");
        return res.redirect(`/listings/${id}`);

    }
    next();
}
