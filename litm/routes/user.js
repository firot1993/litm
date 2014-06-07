var users=require('../data/users');
var notLoggedIn=require('./middleware/not_logger_in');
var loadUser=require('./middleware/load_user')
var restrictUserToSelf=require('./middleware/restrict_user_to_self');
module.exports=function(app){
	app.get('/users/new',notLoggedIn,function(req,res){
		res.locals.session = req.session;
		res.render('users/new',{title:"New User"});
	});
	app.get('/users/:name',loadUser,function(req,res,next){
			res.render('users/profile',{title:'User profile',user:req.user});
	});
	app.get('/users',function(req,res){
		console.log(req.session);
		res.render('users/index',{session:req.session,title:'Users',users:users});
	});
	app.post('/users',function(req,res){
		if (users[req.body.username]){
			res.send('Conflict',409);
		}else{
			users[req.body.username]=req.body;
			res.redirect('/users');
		}
	});
	app.del('/users/:name',loadUser,restrictUserToSelf,function(req,res,next){
		delete users[req.user.username];
		res.redirect('/users')
	});
};