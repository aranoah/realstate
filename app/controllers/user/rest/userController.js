/***********************************************************************
*
* DESCRIPTION :
*       Test controller for user related services
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		11 Nov 2014
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var commonValidator = require(_path_util+"/commonValidator")
var userController = new Controller();

var userService = require(_path_service+"/userService.js" )

/*
* Validate function for user registration
*/
userController.validate_createUser=function(){
      var myvalidator = new commonValidator(this.req);
    /// this.req = request object, this.res = response object.
    console.log("inside validate",this.req.body.emailId);
    
    var validateEmail = ["required","isEmail"];
    myvalidator.validate("emailId",validateEmail,this.req.body.emailId);

    var validateName = ["required"];
    myvalidator.validate("name",validateName,this.req.body.name);
    
    var validatePassword = ["required"];
    myvalidator.validate("password",validatePassword,this.req.body.password);

    console.log(myvalidator.getErrors())
}

/*
* Validate function for user registration
*/
// userController.validate_updateUser=function(){
//       var myvalidator = new commonValidator(this.req);
//     /// this.req = request object, this.res = response object.
//     console.log("inside validate",this.req.body.emailId);
    
//     var validateEmail = ["required","isEmail"];
//     myvalidator.validate("emailId",validateEmail,this.req.body.emailId);
    
//     console.log(myvalidator.getErrors())
// }

/*
* 	Create User and send verification url
*	
**/

userController.createUser = function() {
	var userSvc = new userService();
	//Validation
    if(this.req.errors.hasError()){
       this.processJson(403,"validation error",this.req.errors.getErrors());
       return;
    }
    var _nself = this;
    userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    userSvc.registerUser(_nself.req.body);
}

/*
*   Update User
* 
**/

userController.updateUser = function() {
  var userSvc = new userService();
  //Validation
    // if(this.req.errors.hasError()){
    //    this.processJson(403,"validation error",this.req.errors.getErrors());
    //    return;
    // }
    var _nself = this;
    userSvc.on("done", function(status,msg,result,page){
     _nself.processJson(status,msg,result,page);
    });
    var user = _nself.req.body;
    user.irxId = _nself.getCurrentUser(_nself);;
    userSvc.updateUser(user);
}

/*
*   Get User Details
* 
**/

userController.getUserDetails = function() {
  var userSvc = new userService();
 
    var _nself = this;
    userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    
    userId= _nself.req.params.userId;
    userSvc.getUserDetails(userId);
}


/*
* 	Verify User 
*	@TODO : Controller level validation
**/

userController.verifyUser = function() {
	var userSvc = new userService();
    var _nself = this;
    userSvc.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var userId = _nself.req.param("userId");
    var vfCode = _nself.req.param("vfCode");
    var phoneNum = false;
    if(_nself.req.query.phoneNum && _nself.req.query.phoneNum !=" "){
      phoneNum = true;
    }
    var data = {
    	"userId":userId,
    	"vfCode":vfCode,
      "phoneNum":phoneNum
    }
    console.log(data)
    userSvc.verifyUser(data);
}
/*
*   Login user 
*   @TODO : Controller level valid ation
**/

userController.login = function() {
  console.log("In Login Method")
  var _nself =this;
   _app_context.cansec.validate(_nself.req,_nself.res,function(){
      if(_nself.req.session){
         _nself.processJson(0,"OK",_nself.req.session['X-CS-Auth'].user,null)
      }else {
         _nself.processJson(0,"Error","Error",null)
      }
     
    });
  
}
/*
*   Logout user 
*   @TODO : Controller level validation
**/

userController.logout = function() {
  console.log("In Login Method")
  
   _app_context.cansec.clear(this.req,this.res);
    this.processJson(200,"OK",null,null)
}

/*
*   List User Projects

*   @TODO : Controller level validation
**/

userController.listUserProjects = function() {
 
  var _nself = this;
  userId= _nself.req.params.userId;
  var page = _nself.request.query.page;
  
  if(!page){
    page={
      "start":0,
      "pageSIze":3
    }
  }
  
  var userSvc = new userService();
 
   var data= {
      "page":page,
      "userId":userId
    }
    userSvc.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    
    userSvc.listUserProjects(data);
 
   
}

/*
*   List User Locations
*
*   @TODO : Controller level validation
**/

userController.listUserLocations = function() {
  var _nself = this;
  userId= _nself.req.params.userId;
  var page = _nself.request.query.page;
  
  if(!page){
    page={
      "start":0,
      "pageSIze":3
    }
  }
  
  var userSvc = new userService();
 
   var data= {
      "page":page,
      "userId":userId
    }
    userSvc.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    
    userSvc.listUserLocations(data);
  
}

/*
* Invite anyone to review your profile. Sends email and sms
*/
userController.inviteForReview = function(){
  var _nself = this;
  var targetId = _nself.req.params.userid;
  var parentId = _nself.getCurrentUser(_nself);;
  var msg = _nself.req.query.msg;
  var userSvc = new userService();
  userSvc.on("done", function(code,msg,result,errValue){
    _nself.processJson(code,msg,result,errValue);
  });
  var data = {
    "parentId":parentId,
    "targetId": targetId,
    "msg":msg
  }
  userSvc.inviteForReview(data);
}

/*
* Review a profile
*/
userController.review = function(){
  var _nself = this;
  var parentId = _nself.req.params.parentId;
 
  var msg = _nself.req.body.msg;
  var agentId = _nself.getCurrentUser(_nself);
 
  var userSvc = new userService();
  userSvc.on("done", function(code,msg,result,errValue){
    _nself.processJson(code,msg,result,errValue);
  });
  var data = {
    "parentId":parentId,
    "agentId": agentId,
    "msg":msg
  }
  userSvc.review(data);
}

/*
* Add last visited pages to a user
*/
userController.addLastVisited = function(){
  var _nself = this;
  var name = _nself.req.body.name;
  var url = _nself.req.body.url;
  var type = _nself.req.body.type;
  var agentId = _nself.getCurrentUser(_nself);
  var userSvc = new userService();
  userSvc.on("done", function(code,msg,result,errValue){
    _nself.processJson(code,msg,result,errValue);
  });
  var data = {
   "agentId": agentId,
   "lastVisited":{
      "name":name,
      "url":url,
      "type":type
     }
  }
  userSvc.addLastVisited(data);
}

/*
* List last visited pages
*/

userController.listLastVisited = function(){
  var _nself = this;
  var agentId = _nself.getCurrentUser(_nself);
 
  var userSvc = new userService();
  userSvc.on("done", function(code,msg,result,errValue){
    _nself.processJson(code,msg,result,errValue);
  });
 
  userSvc.addLastVisited(agentId);
}

/*
* check whether this username is available or not
*/
userController.checkUserName = function(){
  var _nself = this;
  var text = _nself.req.params.text;
  var agentId = _nself.getCurrentUser(_nself);
  var userSvc = new userService();
  userSvc.on("done", function(code,msg,result,errValue){
    _nself.processJson(code,msg,result,errValue);
  });
  var data={
    "text":text,
    "id" :agentId
  }
  userSvc.checkUserName(data);
}

module.exports = userController;   