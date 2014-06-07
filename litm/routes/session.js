var User=require('../data/models/user');
var notLoggedIn=require('./middleware/not_logger_in');
module.exports=function(app){
		app.use("/",function(req, res, next){
  		res.locals.session = req.session;
  		next();
	});
	app.get('/session/new',notLoggedIn,function(req,res){
		if (req.session.retry==0){
			req.session.retry=0;
			res.render('session/new',{title:"Log in",session:req.session});
		}
		else{
			if (req.session.retry ==1)res.render('session/new',{title:"Try again",session:req.session});
			else {
				var su='';
				for (var i = Math.min(req.session.retry-1,10) - 1; i >= 0; i--) {
					su=su+'  !  ';
				};
				res.render('session/new',{title:"Try again"+su,session:req.session});
			}
		}
	});
	app.post('/session',notLoggedIn,function(req,res){
		User.findOne({username:req.body.username,password:req.body.password},function(err,user){
		if (err){
			return next(err);
		}
		if (user){
			req.session.user=user;
			req.session.retry=0;
			res.redirect('/');
		}else{
			req.session.retry++;
			res.redirect('/session/new');
		}
		});
	});
	app.get('/del',function(req,res,next){
		retry=0;
		req.session.user=null;
		res.redirect('/');
	})
};