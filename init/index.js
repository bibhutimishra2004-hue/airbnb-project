const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listings.js");

main().then(()=>{
    console.log("connected with the db");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
 
}

const data=async()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"69dfda653ed15ac3fbbe7ac4"}));
    await listing.insertMany(initdata.data);
    console.log("data inserted succesfully")

}
data();