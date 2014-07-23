var User=require('../../data/models/user');
function loadUser(req,res,next){
	User.findOne({username:req.params.name},function(err,user){
		if(err){
			return next(err);
		}
		req.user=user;
		next();
	});
}

module.exports=loadUser;