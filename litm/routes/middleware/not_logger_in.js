function notLoggedIn(req,res,next){
	if (req.session &&req.session.user){
		res.redirect('/')
	}else{
		if (req.session.retry==undefined) req.session.retry=0;
		next();
	}
}
module.exports=notLoggedIn;