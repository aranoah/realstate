var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;

var restController = new Controller();


restController.validate_main=function(){
    /// this.req = request object, this.res = response object.
    console.log("inside validate");
    this.req.checkBody('email', 'Invalid email').notEmpty();    
    return false;
}


restController.main = function() {
	/*** if validation applied for this method then call use handle validation**/
  console.log(1)
	var errors = this.req.validationErrors();
	if (errors) {
		console.log(errors);
		this.processJson(STATUS.CLIENT_ERROR.code,STATUS.CLIENT_ERROR.msg,errors,null);
    	return;
  	}

  	this.title = 'Locomotive';
  	this.err="";
  	this.processJson(STATUS.OK.code,STATUS.OK.msg,"result",null);
}

restController.elasticTest = function() {
  var _selfInstance = this;
    _app_context.esClient.search({
    index: 'him-schemas',
    type:"business",
    body: {
      query: {
        match: {
          name: 'Medanta Hospital'
        }
      }
    }
  }).then(function (resp) {
    var hits = resp.hits.hits;
   _selfInstance.processJson(STATUS.OK.code,STATUS.OK.msg,hits,null);
}, function (err) {
   _selfInstance.processJson(STATUS.SERVER_ERROR.code,STATUS.SERVER_ERROR.msg,err,null);
});
}
module.exports = restController;
