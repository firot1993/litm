function LoggedIn(req,res,next){
	if (req.session &&req.session.user){
		next();		
	}else{
		res.render('jump',{problem:"You do not log in"})
	}
}
module.exports=LoggedIn;