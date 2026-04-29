const listing =require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const data=await listing.find({});
    res.render("listings/index.ejs",{data});

};


module.exports.renderNewform=(req,res)=>{
    res.render("listings/form.ejs");
}


module.exports.showListings=async(req,res)=>{
    const {id}=req.params;
    const info=await listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!info){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    }
    console.log(info);
    res.render("listings/show.ejs",{info,mapToken:process.env.MAP_TOKEN});

}

module.exports.createListing=async(req,res,next)=>{

    let response=await geocodingClient.forwardGeocode({
        query: req.body.lis.location,
        limit:1,
    })
    .send();

    console.log(response.body.features[0].geometry);
    //res.send("done");

    let url=req.file.path;
    let filename=req.file.filename;
    
    let newlist=new listing(req.body.lis);
    newlist.owner=req.user._id;
    newlist.image={url,filename};
    newlist.geometry=response.body.features[0].geometry;
    let savedListing=await newlist.save();
    console.log(savedListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.editListing=async(req,res)=>{
    const {id}=req.params;
    const details=await listing.findById(id);
    if(!details){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=details.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    
    res.render("listings/edit.ejs",{details,originalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    id=id.trim();

    let updatedListing=await listing.findByIdAndUpdate(id,{...req.body.lis});

    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    updatedListing.image={url,filename};
    await updatedListing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}


module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}