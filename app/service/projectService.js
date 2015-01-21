/***********************************************************************
*
* DESCRIPTION :
*       Service class for project related functionalities
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		27 Nov 2014
*
* CHANGES :
*
**/
var CONSTANTS = require(_path_util+'/constants');
var mongoErr = require(_path_util+'/mongo-error')
var STATUS = CONSTANTS.him_status;

var defPage = CONSTANTS.def_page;
var IRXProductLineModel = require(_path_model+"/IRXProductLine");

var mongoose = require('mongoose');
var IRXAgentMProductModel = require(_path_model+"/IRXAgentMProduct");
var properties = require(_path_env+"/properties.js");
var baseService = require(_path_service+"/base/baseService");
var IRXUserProfileModel = require(_path_model+"/IRXUser");

var mongoose = require('mongoose');
function ProjectService(){    
	baseService.call(this);
}
ProjectService.prototype.__proto__=baseService.prototype ;

/*
*	Get Project Details
*
**/
ProjectService.prototype.getProjectDetails = function(projectId) {
	console.log("In getProjectDetails")
	var _selfInstance = this;
	var Project = IRXProductLineModel;
	var id = projectId;
	
	Project.findOne({"id":id},
				function(err,data){
					if (err){
			 			console.error(err)
			 			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
			 			
			 		} else{

			 			if(data && data != null){
			 				
			 				_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,data,null);
			 				
			 			} else{
			 				console.log("Project data not found")
							_selfInstance.emit("done",404,"Project data not found","Project data not found",null);
			 			}
			 			
			  		}
				})
	
}

/*
*	List Preferred agents
*
**/
ProjectService.prototype.listPreferedAgents = function(projectId) {
	console.log("In listPreferedAgents")
	var _selfInstance = this;
	var Mapping = IRXAgentMProductModel;
	var id = projectId;
	
	this.once("listPrefStage1",function(agentIds){
 	
	 	IRXUserProfileModel.find({"id":{$in:agentIds}},function(err,agents){
	 		
	 		if(err){
	 			console.error(err);
				_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
			}else {
				if(agents && agents != null){
					_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,agents,null);
				} else {
					console.error("No agents found")
		 			_selfInstance.emit("done",404,"No agents found",null,null);
				}
				
			}
	 	})
		
	}) 
	Mapping.find({"project":id},{"agentId":1},{skip:0,limit:4 },
					function(err,mapping){
						if(err){
							console.log(err)
							_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
						
						} else{
							
							if(mapping && mapping != null && mapping.length>0){
								console.log(mapping.length)
								var agentIds = new Array();
								for(var i=0;i<mapping.length;i++){
									agentIds.push(mapping[i].agentId);
								}
								_selfInstance.emit('listPrefStage1',agentIds);		
							} else {
								console.log("No prefered agent found")
								_selfInstance.emit("done",404,"No prefered agent found","No prefered agent found",null);
			 				}
						}
					})



}

module.exports = ProjectService;