var User=require('../../data/models/user');
function loadUser(req,res,next){
// 	var user=req.user=users[req.params.name];
// 	if (!user){
// 		res.send('Not found',404);
// 	}else{
// 		next();
// 	}
	User.findOne({username:req.params.name},function(err,user){
		if(err){
			return next(err);
		}
		if (!user){
			return res.send('Not found',404);
		}
		req.user=user;
		next();
	});
}

module.exports=loadUser;