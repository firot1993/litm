var User=require('../data/models/user')
var Quest=require('../data/models/Quest')
var LoggedIn=require('./middleware/logger_in')

module.exports=function(app){
	app.post('/newQuest',LoggedIn,function(req,res,next){
		var t=new Date()
		var _Quest=new Quest({
			from:req.session.user.username,
			state:"N",
			title:req.body.title,
			content:req.body.content,
			stime:t
		})		
		Quest.create(_Quest,function(err){
			if (err)throw err
		})
		User.findOne({username:req.session.user.username},function(err,user){
			if (err)throw err
			Quest.findOne(_Quest,function(err,quest){
		 		if (err) throw err
		 		console.log(quest._id)
		 		if (user.MyQuest==undefined) user.MyQuest=[];
		 		user.MyQuest.push(quest._id)
				User.update({username:user.username},{MyQuest:user.MyQuest},function(err){
					if (err) next(err)
				})
			})
		})
		res.redirect('/')
	})
	app.get('/Quest',function(req,res,next){
		res.render('newQuest.jade',{session:req.session})
	})
	// app.get('/Quest',function(req,res,next){
	// 	Quest.find({state:"N"}).sort('date').exec(function(err,quests){
	// 		if (err)
	// 			return next(err)
	// 		console.log(quests)
	// 	})
	// })
}