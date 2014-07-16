var User=require('../data/models/user')
var Quest=require('../data/models/quest')
var notLoggedIn=require('./middleware/not_logger_in')
var LoggedIn=require('./middleware/logger_in')
var loadUser=require('./middleware/load_user')
var restrictUserToSelf=require('./middleware/restrict_user_to_self')
var fs=require('fs')
var imageprocess=require('./imageprocess')

module.exports=function(app){
	app.get('/users/new',notLoggedIn,function(req,res){
		res.locals.session = req.session
		res.render('register',{title:"New User"})
	})
	app.get('/users/:name',loadUser,function(req,res,next){
		var questsid=req.user.MyQuest
		var quests=[]
		Quest.find({}).where('_id').in(questsid).exec(function(err,quests){
			if (err) next(err)
			res.render('users/profile',{title:'User profile',user:req.user,quests:quests,session:req.session})
			req.session.applyfor=0;
		})
	})

	app.get('/users/:name/1',loadUser,function(req,res,next){
		var questsid=req.user.MyHelp
		var quests=[]
		Quest.find({}).where('_id').in(questsid).exec(function(err,quests){
			if (err) next(err)
			res.render('users/profile2',{title:'User profile',user:req.user,quests:quests,session:req.session})
		})

	})
	app.get('/users/:name/2',loadUser,LoggedIn,function(req,res,next){
		if (req.user.username==req.session.user.username){
			res.render('users/profile3',{title:'User profile',user:req.user,session:req.session})
		}else{
			req.session.applyfor=2;
			res.redirect('/users/'+req.user.username)
		}
	})

	app.get('/applyfor/:id',LoggedIn,function(req,res,next){
		req.session.applyfor=2
		Quest.findOne({_id:req.params.id},function(err,quest){
			if (quest.from!=req.session.user.username){
			User.findOne({username:req.session.user.username}).exec(function(err,user){
			if (user.Myhelp==undefined) user.Myhelp=[] 	
			user.Myhelp.push(req.params.id)
			User.update({username:user.username},{MyHelp:user.Myhelp},function(err){
				if (err) next(err)
				req.session.applyfor=1
				Quest.update(quest,{state:'U',got:req.session.user.username},function(err){
						if (err) next(err)
						res.redirect('/')
				})
			
			})
		})}else {
				res.redirect('/')
			}
		})
		
	})

	app.get('/users',function(req,	res,next){
		User.find({}).sort('name').exec(function(err,users){
			if (err)
				return next(err)
		res.render('users/index',{session:req.session,title:'Users',users:users})	
		})
	
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

	app.get('/del/:name',loadUser,function(req,res,next){
		fs.unlink("./public/images/"+req.user.pic,function(err){
			console.log(err)
		})
		req.user.remove(function(err){
			if (err){return next(err)}
			res.redirect('/')

		})
	})

	app.post('/edit/:name',loadUser,restrictUserToSelf,function(req,res,next){
		User.findOne({username:req.user.username}).exec(function(err,user) {
			fs.unlink('./public/pic/'+user.pic,function(err){
				User.update({username:req.user.username},{pic:req.files.pic.name},function(err){
					if (err) next(err)
					fs.rename(req.files.pic.path,"./public/pic/"+req.files.pic.name,function(err){
						if (err)
							throw err
						fs.unlink(req.files.pic.path,function(err){
						res.redirect('/users/'+req.user.username)
					})
					})
				})
			})
		})
	})
}