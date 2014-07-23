var User         = require('../data/models/user')
var Quest        = require('../data/models/Quest')
var Information  = require('../data/models/information')
var LoggedIn     = require('./middleware/logger_in')
var fs           = require('fs')
var imageprocess = require('./imageprocess')
var mongoose     = require('mongoose')
module.exports=function(app){
	//newQuest
	app.post('/newQuest',LoggedIn,function(req,res,next){
		var t=new Date()
		var _Quest=new Quest({
			from:req.session.user.username,
			state:"N",
			title:req.body.title,
			content:req.body.file,
			stime:t,
			brief:req.body.brief,
			etime:req.body.deadline
		})		
		Quest.create(_Quest,function(err){
			if (err)throw err
		})
		User.findOne({username:req.session.user.username},function(err,user){
			if (err)throw err
			Quest.findOne(_Quest,function(err,quest){
		 		if (err) throw err
		 		if (user.MyQuest==undefined) user.MyQuest=[];
		 		user.MyQuest.push(quest._id)
				User.update({username:user.username},{MyQuest:user.MyQuest},function(err){
					if (err) next(err)
				})
			})
		})
		res.send('ok',200)
	})


	////////////////////////////////////////information down///////////////////////////////////////////////////

	//write information
	app.get('/information',LoggedIn,function(req,res,next){
		if (req.session.questid ==undefined )
			res.sender('jump',{
	            typeofjump:0,
	            problem:"Access denied",
	            des:"You will Die in 3 seconds,if no jump automatic,press the button next"
	            ,brief:"Some wrong happened~"
			})
		else
			res.render('imforation',{session:req.session,typeInformation:1})
	})
	app.get('/informationed',LoggedIn,function(req,res,next){
		res.render('information',{session:req.session,typeInformation:2})
	})
	app.post('/information',LoggedIn,function(req,res,next){
		var l_information = req.body.information
		if (l_information == undefined){
			User.findOne({username:req.session.user.username},function(user,err){
				if (err)
					res.send('error')
				else{
					l_information = user.email
					if (req.body.type==1)
						Information.create(new Information({QuestId:req.body.id,information:l_information}),
							function(err){
								if (err) res.send('error') 
									else {
										 res.send('ok')
									}
							})
					else
						Information.update({QuestId:req.body.id},{informationed:l_information},
							function(err){
								if (err) res.send('error')
									else
										 res.send('ok')
							})

				}
			})
		}else {
				if (req.type==1)
					Information.create(new Information({QuestId:req.body.id,information:l_information}),
						function(err){
							if (err) res.send('error')
								else
									 res.send('ok')
					})
				else		
					Information.update({QuestId:req.body.id},{informationed:l_information},
						function(err){
							if (err) res.send('error')
								else
									 res.send('ok')
							})
		}
	})
	//got information
	app.post('/getinformation',LoggedIn,function(req,res,next){
		Quest.findOne({QuestId:req.body.id},function(quest,err){
			if (err) res.send('error')
				else{
					var l_questUsername = quest.from
					var l_questedUsername = quest.got[0]
					var state = quest.state
					if (state != 'C')
						res.send('error')
					else{
						if (l_questedUsername == req.body.from)
							Information.findOne({QuestId:quest._id},function(information,err){
								if (err)
									res.send('error')
								else
									res.send(information.informationed)
							})
						else if (l_questUsername == req.body.from){
							Information.findOne({QuestId:quest._id},function(information,err){
								if (err)
									res.send('error')
								else
									res.send(information.information)
							})
						}
					}

				}
		})
	})



	////////////////////////////////////////information up///////////////////////////////////////////////////


	//find quest
	app.get('/find',function(req,res,next){
		res.render('findQuest.jade',{session:req.session})
	})
	app.post('/find',function(req,res,next){
		Quest.find().where('state').in(['N']).exec(function(err,quests){
			res.send(quests)
		})
	})
	//find myquest
	app.get('/findmq',LoggedIn,function(req,res,next){
		Quest.find().where('from').in([req.session.user.username]).exec(function(err,quests){
			res.send(quests)
		})
	})
	//find my mission
	app.get('/findmm',LoggedIn,function(req,res,next){
		Quest.find().where('got').in([req.session.user.username]).exec(function(err,quests){
			res.send(quests)
		})
	})


	//new quest
	app.get('/Quest',LoggedIn,function(req,res,next){
		res.render('newQuest.jade',{session:req.session})
	})
	app.post('/writefile',LoggedIn,function(req,res,next){
		imageprocess.writepic(req.body.picture,req.body.filename,req.session.user.username,req.body.title)
		res.send('ok',200)
	})

	//sign and confirmed quest
	app.post('/signQuest',LoggedIn,function(req,res,next){
		Quest.findById(req.body.id,function(quest,err){
			if (err)
				res.send('error')
			else{
				var l_signed = quest.got
				l_signed.append(req.seesion.user.username)
				Quest.update({_id:quest.id},{got:l_signed},function(err){
					if (err)
						res.send('error')
					else 
						res.send('ok')
				})
			}
		})
	})
	app.post('/confirmQuest',LoggedIn,function(req,res,next){
		Quest.findById(req.body.id,function(quest,err){
			if (quest.form == req.session.user.username){
				var l_signed = [req.body.signed] 
				Quest.update({_id:quest.id},{got:l_signed,state:'C'},function(err){
					if (err)
						res.send('error')
					else
						res.send('ok')
				})
			}
		})
	})
	//give up a question
	app.post('/giveup',LoggedIn,function(req,res,next){
		Quest.findById(req.body.id,function(err,quest){
			console.log(quest)
			if (err || quest.from != req.session.user.username ){
				res.send('error')
			}
			else
				Quest.update({_id:quest._id},{state:'D'},function(err){
					if (err)
						res.send('error123')
					else
						res.send('ok')
				})
		})
	})


}