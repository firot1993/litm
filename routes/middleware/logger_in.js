function LoggedIn(req,res,next){
	if (req.session &&req.session.user){
		next();		
	}else{
		res.render('jump',{
            typeofjump:0,
            problem:"You do not log in",
            des:"You will Die in 3 seconds,if no jump automatic,press the button next"
            ,brief:"Some wrong happened~"
        })
	}
}
module.exports=LoggedIn;