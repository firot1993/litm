function LoggedIn(req,res,next){
	if (req.session &&req.session.user){
		if (req.session.retry==undefined) req.session.retry=0;
		next();		
	}else{
		res.send('You have not logged',401);

	}
}
module.exports=LoggedIn;