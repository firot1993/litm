var User=require('../data/models/user')
var notLoggedIn=require('./middleware/not_logger_in')
module.exports=function(app){
		app.use("/",function(req, res, next){
  		res.locals.session = req.session
  		next()
	})
	app.get('/session/new',notLoggedIn,function(req,res){
		res.render('user_login',{title:"Log in",session:req.session})
	})
	app.post('/session',notLoggedIn,function(req,res){
		console.log(req.body)
		User.findOne({username:req.body.username,password:req.body.password},function(err,user){
		if (err){
			return next(err)
		}
		if (user){
			req.session.user=user
			res.send('ok',200)
		}else{
			res.send('wrong',200)
		}
		})
	})
	app.get('/session/del',function(req,res,next){
		req.session.user=null
		res.redirect('/')
	})
}