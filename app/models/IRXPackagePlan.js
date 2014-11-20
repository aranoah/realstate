var mongoose = require('mongoose');

var IRXPackagePlanSchema =new mongoose.Schema({
   
   packageName:{type:String,required:true},
   packagePrice:{type:Number,required:true},
   features :{type:String},// to be reviewed
   createdOn:{type:Date},
   updatedOn:{type:Date}
});

IRXPackagePlanModel = mongoose.model('irxpackageplan', IRXPackagePlanSchema);
module.exports = IRXPackagePlanModel;