var mongoose = require('mongoose');

var IRXUserProfileSchema =new mongoose.Schema({
   name:{type:String,required:true},
   userId:{type:String,required:true},
   password:{type:String,required:true},
   location:{city:String,state:String,country:String,name:String,pincode:String,lat:Number,lon:Number},
   type:{type:String,required:true},
   companyName: {type:String},
   imageUrl:{type:String},
   specialities :{type:Array},
   roles: {type:Array},
   permission: {type:Array},
   rank:{type:Number},//indexing
   preferred:{type:Boolean},
   createdOn:{type:Date},
   updatedOn:{type:Date}
});

IRXUserProfileModel = mongoose.model('irxuser', IRXUserProfileSchema);
module.exports = IRXUserProfileModel;