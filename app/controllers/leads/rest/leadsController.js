/***********************************************************************
*
* DESCRIPTION :
*       Controller for leads related services
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		27 Dec 2014
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var leadsController = new Controller();
var leadService = require(_path_service+"/leadService.js" )
var commonValidator = require(_path_util+"/commonValidator")


/*
* Validate function for user registration
*/
leadsController.validate_captureLeads=function(){
      var myvalidator = new commonValidator(this.req);
    /// this.req = request object, this.res = response object.
    console.log("inside validate",this.req.body.emailId);
    
    var validateEmail = ["required","isEmail"];
    myvalidator.validate("emailId",validateEmail,this.req.body.emailId);

    var validateName = ["required"];
    myvalidator.validate("name",validateName,this.req.body.name);

    var validateProjectId = ["required"];
    myvalidator.validate("ProjectId",validateProjectId,this.req.body.prjectId);

    var validateMobileNo = ["required"];
    myvalidator.validate("mobileNo",validateMobileNo,this.req.body.mobileNo);
    
    var validateBhk = ["required"];
    myvalidator.validate("bhk",validateBhk,this.req.body.bhk);
    
    var validatePropertyType= ["required"];
    myvalidator.validate("propertyType",validatePropertyType,this.req.body.propertyType);

    var validateType= ["required"];
    myvalidator.validate("type",validateType,this.req.body.type);
    console.log(myvalidator.getErrors())
}

/*
* 	capture leads 
**/

leadsController.captureLeads = function() {
 var lService = new leadService();
  //Validation
    if(this.req.errors.hasError()){
       this.processJson(403,"validation error",this.req.errors.getErrors());
       return;
    }
    var _nself = this;
    lService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    lService.captureLeads(_nself.req.body);
}

/*
*   Verify leads Not in use
**/
leadsController.reviewLeadVerify = function() {
 var lService = new leadService();
  
    var _nself = this;
    lService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var data = {
      "userId":_nself.req.session['X-CS-Auth'].userId,
      "leadId":_nself.req.params.leadId
    }
    lService.reviewLeadVerify(data);
}

/*
*   Delete leads 
**/
leadsController.leadDelete = function() {
 var lService = new leadService();
  
    var _nself = this;
    lService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
     var user = _nself.getCurrentUserInfo(_nself);
    var data = {
      "userId":user.irxId,
      "leadId":_nself.req.params.leadId
    }
    lService.leadDelete(data);
}
module.exports = leadsController;

/*
*   List leads 
**/
leadsController.listLeads = function() {
  var lService = new leadService();

  var _nself = this;
  lService.on("done", function(code,msg,err,errValue){
   _nself.processJson(code,msg,err,errValue);
  });
     var user = _nself.getCurrentUserInfo(_nself);
  var data = {
    "userId":user.irxId,
    page:_nself.req.query.page,
  }
  lService.listLeads(data);
}
module.exports = leadsController;