var licenseSv = require('./../service/license'),
		certificateSv = require('./../service/certificate');


exports.authorize = function(req, res, next){

	var app = res.locals.app;
	var developer = res.locals.developer;
	var customer = res.locals.customer;

	var account = req.params.account;
	
	//Check if neccessary parameters exist
	var bodyParams = JSON.parse(req.body);

	if(developer == null) {
		licenseSv.authorize(app, customer, account, bodyParams, function(err, licResponse){	
			if(err){
				res.send(500, handleError(err));
				return;
			}
			res.send(getSignedResponse(licResponse, app.privateKey));
		});
	} else {
		licenseSv.testResponse(developer, function(err, responseCode, licResponse){
			res.send(getSignedResponse(licResponse, app.privateKey));
		});
	}
}


function stringifyResponse(lic){
	var result = lic[licenseSv.PARAM_RESULTCODE]
						 + "|" + lic[licenseSv.PARAM_NONCE]
						 + "|" + lic[licenseSv.PARAM_PACKAGENAME]
						 + "|" + lic[licenseSv.PARAM_VERSIONCODE]
						 + "|" + lic[licenseSv.PARAM_USERID]
						 + "|" + lic[licenseSv.PARAM_TIMESTAMP]; 
			result += ":";
			result += licenseSv.EXTRA_VALIDTIME + "=" + lic[licenseSv.EXTRA_VALIDTIME];
			result += "&" + licenseSv.EXTRA_GRACETIME + "=" + lic[licenseSv.EXTRA_GRACETIME];
			result += "&" + licenseSv.EXTRA_GRACERETRYS + "=" + lic[licenseSv.EXTRA_GRACERETRYS];
			return result;
}

function getSignedResponse(licResponse, privateKey){
		var stringifiedResponse = stringifyResponse(licResponse);
		var signature = certificateSv.sign(stringifiedResponse, privateKey);
		var successResponse = licResponse[licenseSv.PARAM_RESPONSECODE] + "--" + stringifiedResponse + "--" + signature;
		return successResponse;
}

function handleError(err){
	var errorResponse = licenseSv.CODE_SERVERERROR + "--" + err + "--" + "null";
	return errorResponse;
}