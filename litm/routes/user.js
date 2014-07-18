var User=require('../data/models/user')
var Quest=require('../data/models/quest')
var notLoggedIn=require('./middleware/not_logger_in')
var LoggedIn=require('./middleware/logger_in')
var loadUser=require('./middleware/load_user')
var restrictUserToSelf=require('./middleware/restrict_user_to_self')
var fs=require('fs')
var imageprocess=require('./imageprocess')

module.exports=function(app){
	//for rigister
	app.get('/users/new',notLoggedIn,function(req,res){
		res.locals.session = req.session
		res.render('register',{title:"New User"})
	})
	app.post('/users',function(req,res,next){
		var filename=req.body.pic
		var parse=/(\w+).\w+/
		var filenameinpng=parse.exec(filename)[1]+".png"
		console.log(filenameinpng)
		var _user=new User({
			username:req.body.username,
			password:req.body.password,
			pic:'./public/pic/'+req.body.username+'/1/'+filenameinpng
		})
		User.create(_user,function(err){
			if (err){
				if (err.code === 11000){
					res.send('Confilct',409)
				}else{
					next(err)
				}
			}
			return
		})
		res.send('ok',200)
		imageprocess.writepic(req.body.file,filenameinpng,req.body.username,1)
	})
}