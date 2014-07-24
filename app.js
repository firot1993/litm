
/**
 * Module dependencies.
 */

var express = require('./node_modules/express/lib/express')
var routes  = require('./routes')
var user    = require('./routes/user')
var http    = require('http')
var path    = require('path')

// var app = express()
// 		,server = require('http').createServer(app)
// 		, io = require('socket.io').listen(server) 

	
var app = express()
	,server = require('http').Server(app)
	,io     = require('socket.io')(server)


server.listen(process.env.PORT || 80)
// all environments

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(express.bodyParser({uploadDir:'./uploads'}))
app.use(express.cookieParser("my secret thing"))
app.use(express.session())
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')))

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler())
}


app.get('/', routes.index)
user(app)
require('./routes/session')(app)
require('./routes/quest')(app)

// mongoose
var mongoose = require('mongoose')
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/litmdatabase')
var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function callback () {
	//yap
})



//socket.io
io.on('connection',function(socket){
	socket.on('clientMessage',function(content){
		socket.emit('serverMessage',1,'You said: '+content)
		socket.get('username',function(err,username){
			if(!username){
				username=socket.id
			}
			socket.broadcast.emit('serverMessage',2,username+' said: '+ content)	
		})
	})

	socket.on('login',function(username){
		console.log(username)
		socket.username=username
		socket.emit('serverMessage',3,'Currently logged in as '+username)
		socket.broadcast.emit('serverMeassage',3,'User '+username+' logged in')
	})
	socket.emit('login')
	console.log('triggered')
})


