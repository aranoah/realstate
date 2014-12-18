/***********************************************************************
*
* DESCRIPTION :
*       Test controller for user related services
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Raghu (raghavendra@aranoah.com)      
*
* START DATE :    
*		16 Dec 2014
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var projectController = new Controller();



/*
* 	Project-Listing page 
*	@TODO : Server integration still pending
**/


projectController.main = function() {
  console.log("In main Method")
  this.title = "Project-Listing page";
  this.render("irx/project"); 
}
module.exports = projectController;