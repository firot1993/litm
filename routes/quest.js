var User         = require('../data/models/user')
var Quest        = require('../data/models/quest')
var LoggedIn     = require('./middleware/logger_in')
var fs           = require('fs')
var imageprocess = require('./imageprocess')
var mongoose     = require('mongoose')

var usermanage   = require('./user')
module.exports=function(app){
	//newQuest
	app.post('/newQuest',LoggedIn,function(req,res,next){
		var t=new Date()
		console.log(req.body)
		var _Quest=new Quest({
			from:req.session.user.username,
			state:"N",
			title:req.body.title,
			content:req.body.file,
			stime:t,
			brief:req.body.brief,
			etime:req.body.deadline,
			fixedpos_x:req.body.fixedpos.x,
			fixedpos_y:req.body.fixedpos.y,
			staticpos_x:req.body.staticpos.x,
			staticpos_y:req.body.staticpos.y,
		})
		console.log(_Quest)		
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

	//                     Useless

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	//write information
	// app.get('/information',LoggedIn,function(req,res,next){
	// 	if (req.session.questid ==undefined )
	// 		res.sender('jump',{
	//             typeofjump:0,
	//             problem:"Access denied",
	//             des:"You will Die in 3 seconds,if no jump automatic,press the button next"
	//             ,brief:"Some wrong happened~"
	// 		})
	// 	else
	// 		res.render('imforation',{session:req.session,typeInformation:1})
	// })
	// app.get('/informationed',LoggedIn,function(req,res,next){
	// 	res.render('information',{session:req.session,typeInformation:2})
	// })
	// app.post('/information',LoggedIn,function(req,res,next){
	// 	var l_information = req.body.information
	// 	if (l_information == undefined){
	// 		User.findOne({username:req.session.user.username},function(user,err){
	// 			if (err)
	// 				res.send('error')
	// 			else{
	// 				l_information = user.email
	// 				if (req.body.type==1)
	// 					Information.create(new Information({QuestId:req.body.id,information:l_information}),
	// 						function(err){
	// 							if (err) res.send('error') 
	// 								else {
	// 									 res.send('ok')
	// 								}
	// 						})
	// 				else
	// 					Information.update({QuestId:req.body.id},{informationed:l_information},
	// 						function(err){
	// 							if (err) res.send('error')
	// 								else
	// 									 res.send('ok')
	// 						})

	// 			}
	// 		})
	// 	}else {
	// 			if (req.type==1)
	// 				Information.create(new Information({QuestId:req.body.id,information:l_information}),
	// 					function(err){
	// 						if (err) res.send('error')
	// 							else
	// 								 res.send('ok')
	// 				})
	// 			else		
	// 				Information.update({QuestId:req.body.id},{informationed:l_information},
	// 					function(err){
	// 						if (err) res.send('error')
	// 							else
	// 								 res.send('ok')
	// 						})
	// 	}
	// })
	// //got information
	// app.post('/getinformation',LoggedIn,function(req,res,next){
	// 	Quest.findOne({QuestId:req.body.id},function(quest,err){
	// 		if (err) res.send('error')
	// 			else{
	// 				var l_questUsername = quest.from
	// 				var l_questedUsername = quest.got[0]
	// 				var state = quest.state
	// 				if (state != 'C')
	// 					res.send('error')
	// 				else{
	// 					if (l_questedUsername == req.body.from)
	// 						Information.findOne({QuestId:quest._id},function(information,err){
	// 							if (err)
	// 								res.send('error')
	// 							else
	// 								res.send(information.informationed)
	// 						})
	// 					else if (l_questUsername == req.body.from){
	// 						Information.findOne({QuestId:quest._id},function(information,err){
	// 							if (err)
	// 								res.send('error')
	// 							else
	// 								res.send(information.information)
	// 						})
	// 					}
	// 				}

	// 			}
	// 	})
	// })



	////////////////////////////////////////information up///////////////////////////////////////////////////


	//find quest
	// app.get('/find',function(req,res,next){
	// 	res.render('findQuest.jade',{session:req.session})
	// })

	app.post('/find',function(req,res,next){
		Quest.find().where('state').in(['N','S']).exec(function(err,quests){
			var flag = req.body.friendonly == 'true'
			if (req.session) flag=((req.session.user!=undefined)&& flag)
			console.log(quests)
			if (req.session && req.session.user) {
				var nosignbyme = []
				for (var x = 0 ; x < quests.length; x++){
					if (quests[x].got.toString().indexOf(req.session.user.username) <0 ) 
						nosignbyme.push(quests[x])
				}	
				console.log(req.session.user.username)
				quests = nosignbyme
			}
			if (flag==true){
					User.findOne({username:req.session.user.username},function(err,user){
					var friends = user.friends
					var friendsquest = (function(quests){
								var ans = []
								for (var x = 0 ; x < quests.length ; x++)
									if (quests[x].from in friends)
										ans.push(quests[x])
								return ans
						}(quests))
					console.log(friendsquest)
					res.send(friendsquest)
				})
			}
			else res.send(quests)
		})
	})

	//find myquest
	app.get('/findmq',LoggedIn,function(req,res,next){
		Quest.find().where('from').in([req.session.user.username])
			.where('state').in(['N','S','C','F'])
			.exec(function(err,quests){
			res.send(quests)
		})
	})
	//find my mission
	app.get('/findmm/:value',LoggedIn,function(req,res,next){
		Quest.find().where('got').in([req.session.user.username]).exec(function(err,quests){
			var nquests = []
			if (req.params.value == 1){
				for (var x = 0 ; x < quests.length ; x++)
					if (quests[x].got.length ==1 && quests[x].state == 'C' ) 
						nquests.push(quests[x])
			}else{ 
				for (var x = 0 ; x < quests.length ; x++)
					if (quests[x].got.length >=1 && quests[x].state == 'S' ) 
						nquests.push(quests[x])
			}
			res.send(nquests)
		})
	})


	//new quest
	// app.get('/Quest',LoggedIn,function(req,res,next){
	// 	res.render('newQuest.jade',{session:req.session})
	// })
	app.post('/writefile',LoggedIn,function(req,res,next){
		imageprocess.writepic(req.body.picture,req.body.filename,req.session.user.username,req.body.title,function(err){
			if (err)
				res.send('error')
			else
				res.send('ok')
		})
	})

	//sign and confirmed quest
	app.post('/signQuest',LoggedIn,function(req,res,next){
		Quest.findById(req.body.id,function(err,quest){
			if (req.session.user.username == quest.from){
				res.send("You can't sign your own quest")
			}
			else
			if (err)
				res.send('error')
			else{
				var l_signed = quest.got
				if (l_signed.toString().indexOf(req.session.user.username) >-1){
					res.ser('you can not sign one mission many time')
				}else{
				l_signed.push(req.session.user.username)
				Quest.update({_id:quest.id},{got:l_signed,state:'S'},function(err){
					if (err)
						res.send('error')
					else 
						User.findOne({username:req.session.user.username},function(err,user){
							if (err)
								res.send('error')
							else
								var got = user.MySign
								got.push(quest._id)
								User.update({username:req.session.user.username},{MySign:got},function(err){
									if (err)
										res.send('error')
									else{ 
										usermanage.sendmessage(quest.from,req.session.user.username,quest.id,5,
										function(err){
												if (err) 
													res.send('error')
												else
													res.send('ok')
											})
										}
							})
						})	
					})
				}
			}
		})
	})
	
	app.post('/confirmQuest',LoggedIn,function(req,res,next){
		Quest.findById(req.body.id,function(err,quest){
			if (quest.form == req.session.user.username){
				var l_signed = [req.body.signed] 
				User.find().where('username').in(l_signed).exec(function(err,users){
					for (var i = 0 ; i < users.length ; i++){
						var username = users[i].username
						var MySign   = users[i].MySign
						for (var j = 0; j < MySign.length ; j++ ){
							if (MySign[j] == quest._id){
								var tmp = MySign[j]
								MySign[MySign.length-1] = tmp
								MySign[j] =MySign[MySign.length-1]
								MySign[MySign.length-1] =tmp
							}
						}
						User.update({username:username},{Mysign:MySign},function(err){
							console.log('edit Mysign of '+username)
						})
					}
				})
				Quest.update({_id:quest._id},{got:l_signed,state:'C'},function(err){
					if (err)
						res.send('error')
					else
						User.findOne({username:req.session.user.username},function(err,user){
							if (err)
								res.send('error')
							else{
								var MyHelp = user.MyHelp
								MyHelp.push(quest._id)
								User.update({username:req.session.user.username},{MyHelp:MyHelp},function(err,user){
									if (err)
										res.send('error')
									else
										res.send('ok')
								})
							}

						})

				})
			}
		})
	})
	//give up a question
	app.post('/giveup',LoggedIn,function(req,res,next){
		Quest.findById(req.body.id,function(err,quest){
			if (err || quest.from != req.session.user.username ){
				res.send('error')
			}
			else
				Quest.update({_id:quest._id},{state:'D'},function(err){
					if (err)
						res.send('error')
					else{ 
							usermanage.removeSignedAndComfirmed(quest,function(err){
								if (err)
									res.send('error')
								else
									res.send('ok')
							})
						}
				})
		})
	})
	//finish a question
	app.post('/finish',LoggedIn,function(req,res,next){
		Quest.findById(req.body.id,function(err,quest){
			if (quest.from != req.session.user.username){
				console.log('access denied')
			}else{
				Quest.update({_id:quest._id},{state:'F'},function(err){
					if (err)
						res.send('error')
					else{
						usermanage.finish(quest)
						res.send('ok')
					}
				})
			}
		})
	})

	//send message
	app.post('/sendmessage',LoggedIn,function(req,res,next){
		var quest    = req.body.quest
		var username = req.session.user.username
		if (username == quest.from)
			res.send("you can not send message yourself")
		else
		if (quest.got.toString().indexOf(username) <0 )
			res.send('access denied')
		// User.findOne({username:quest.from},function(err,user){
		// 	var l_message = user.Messages
		// 	l_message.push('<p>'+username+'said:'+req.body.message+'</p>')
		// 	User.update({username:quest.from},{Messages:l_message},function(err){})
		// })
		else
			{
				usermanage.sendmessage(quest.from,username,req.body.message,4,
					function(err){
							if (err) 
								res.send('error')
							else
								res.send('ok')
						})
			}
	})

	//got quest by Id
	app.post('/getquestbyid',LoggedIn,function(req,res,next){
		Quest.findById(req.body._id,function(err,quest){
			if (err)
				res.send('error')
			else
				res.send(quest)
		})
	})

}