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
	// app.get('/users/new',notLoggedIn,function(req,res){
	// 	res.locals.session = req.session
	// 	res.render('register',{title:"New User"})
	// })

	app.post('/users',function(req,res,next){
		var filename=req.body.pic
		var parse=/(\w+).\w+/
		var filenameinpng=parse.exec(filename)[1]+".png"
		var _user=new User({
			username:req.body.username,
			password:req.body.password,
			pic:'/public/pic/'+req.body.username+'/1/'+filenameinpng,
			email:req.body.email
		})
		User.create(_user,function(err){
			if (err){
				if (err.code === 11000){
					res.send('Confilck')
				}else{
					next(err)
				}
			}
			else {
				res.send('ok')
				imageprocess.writepic(req.body.file,filenameinpng,req.body.username,1)
			}
		})
		
	})
	//get user
	app.post('/getUser/:name',loadUser,function(req,res,next){
		//not return password
		req.user['password']=null
		res.send(req.user)
	})
	//get personal profile
	app.get('/myprofile',LoggedIn,function(req,res,next){
		User.findOne({username:req.session.user.username},function(user,err){
			if (err)
				res.send(err)
			else
			{
				user.password=null
				res.send(user)
			}
		})
	})
	//get personal quest
	app.get('/myquest',LoggedIn,function(req,res,next){
		res.render('myQuest',{session:req.session})
	})

	//set personal profile
	app.get('/editprofile',LoggedIn,function(req,res,next){
		res.render('profile',{session:req.session})
	})
	app.post('/editprofile',LoggedIn,function(req,res,next){
		if (req.session.user.username!=req.body.username)
			res.send('error')
		else{
			var l_username = req.body.username 
			var l_password = req.body.password 
			var l_email    = req.body.email
			var l_pic      = req.body.pic
			User.find({username:l_username},function(user,err){
				if (l_password == undefined) l_password = user.password
				if (l_email    == undefined) l_email    = user.email
				if (l_pic      == undefined) l_pic      = user.pic
				User.update({username:l_username},{password:l_password,email:l_email,pic:l_pic},function(err){
					if (err) res.send('error')
						else
							res.send('ok')
				})
			})
		}
	})
	
	
}