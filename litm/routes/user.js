var User=require('../data/models/user');
var notLoggedIn=require('./middleware/not_logger_in');
var LoggedIn=require('./middleware/logger_in');
var loadUser=require('./middleware/load_user')
var restrictUserToSelf=require('./middleware/restrict_user_to_self');
var fs=require('fs')

module.exports=function(app){
	app.get('/users/new',notLoggedIn,function(req,res){
		res.locals.session = req.session;
		res.render('users/new',{title:"New User"});
	});
	app.get('/users/:name',loadUser,function(req,res,next){
			res.render('users/profile',{title:'User profile',session:req.session});
	});
	app.get('/users',function(req,	res,next){
		User.find({}).sort('name').exec(function(err,users){
			if (err)
				return next(err);
		res.render('users/index',{session:req.session,title:'Users',users:users});	
		})
	
	});
	app.post('/users',function(req,res,next){
		console.log(req.body)
		console.log(req.files.pic.name)
		if (req.files.pic) 
			req.body.pic=req.files.pic.name;
		User.create(req.body,function(err){
			if (err){
				if (err.code === 11000){
					res.send('Conflict',409);
				}else{
					next(err);
				}
				return;
			}
		res.redirect('/');
		fs.rename(req.files.pic.path,"./public/pic/"+req.files.pic.name,function(err){
			if (err)
				throw err;
		})
		// fs.unlink(req.files.pic.path);
		})
		console.log(User)
	});

	//addfriend..
	// app.get('/addfriend/:name',LoggedIn,loadUser,function(req,res,next){
	// 	if (req.user.username!=req.session.user.username){
	// 		var Usernow=User.findOne({username:req.session.user.username});
	// 		var f=false;
	// 		if (Usernow.friends==undefined) Usernow.friends=[];
	// 		console.log(Usernow.friends);
	// 		for (var i=0; i<Usernow.friends.length;i++){
	// 			if (Usernow.friends[i]==req.user.username) 
	// 			{
	// 				f=true;
	// 				break;
	// 			}
	// 		}
	// 		if (f==false)
	// 		{
	// 			Usernow.friends.push(req.user.username);
	// 		}
	// 		console.log(Usernow.friends);
	// 		User.update({username:req.session.user.username},{friends:Usernow.friends},function(err){
	// 			console.log(err);
	// 		});
	// 		res.redirect('/');			
	// 	}
	// })

	app.get('/del/:name',loadUser,function(req,res,next){
		
		fs.unlink("./public/images/"+req.user.pic,function(err){
			console.log(err);
		})
		req.user.remove(function(err){
			if (err){return next(err);}
			res.redirect('/');

		});
	});
};