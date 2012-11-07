	// NPM Modules
var restify 	= require('restify')
, mongoose 		= require('mongoose');

// Mobile-Trail Services
var	registerSv	= require('./service/register')
, customerSv = require('./service/authorize');

// Create Server
var server = restify.createServer({
  name: 'mobile-trial'
});

var port = 3000;

// Connect to Mongo DB
mongoose.connect('mongodb://localhost/mobile-trial-db'); 

// Enable Bundles
server.use(restify.bodyParser());

// Authorize user
server.use(function authorization(req, res, next){
	next();
});

server.get('/', function(req, res){
	res.json({});
});
server.post('/', function(req, res){
	res.json({});
});
server.post('/register',	 		registerSv.create);
server.get ('/register', 			registerSv.getAll);
server.get ('/register/:app', registerSv.get);
server.put ('/register/:app', registerSv.update);
server.del ('/register/:app', registerSv.delete);

server.post('/authorize/:app/customer/:customer', customerSv.authorize);

//Start listen
server.listen(port, function(){
	console.log("listen on port " + port);
});


