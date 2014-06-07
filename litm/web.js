
/**
 * Module dependencies.
 */
var data={};
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express()
	,server=require('http').createServer(app)
	,io=require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser("my secret thing"));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', routes.index);
// app.get('/users', user.list);
app.get('/', routes.index);
app.get('/users', user.list);

//socket.io
io.sockets.on('connection',function(socket){
	socket.on('clientMessage',function(content){
		socket.emit('serverMessage',1,'You said: '+content);
		socket.get('username',function(err,username){
			if(!username){
				username=socket.id;
			}
			socket.broadcast.emit('serverMessage',2,username+' said: '+ content);	
		});
	});

	socket.on('login',function(username){
		console.log(username);
		socket.set('username',username,function(err){
			if(err){throw err;}
			socket.emit('serverMessage',3,'Currently logged in as '+username);
			socket.broadcast.emit('serverMeassage',3,'User '+username+' logged in');
		});
	});
	// socket.emit('login');
	socket.emit('request');
	socket.on('data',function(value,animate){
		game.beginnew(value,animate)
		data[socket.id]=[value,animate]
		socket.emit('redraw',value,animate)
	})
	socket.on('move',function(direction){
		f=game.move(direction,data[socket.id][0],data[socket.id][1]);
		if (f==false)
			socket.emit('lose');
		socket.emit('redraw',data[socket.id][0],data[socket.id][1])
	})
	socket.on('flush',function(animate){
		data[socket.id][1]=animate;
	})
	// socket.value=game.beginnew();
	// game.beginnew(socket.value,socket.animate)
});


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
