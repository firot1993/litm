var User               = require('../data/models/user')
var Quest              = require('../data/models/quest')
var Message            = require('../data/models/message')
var notLoggedIn        = require('./middleware/not_logger_in')
var LoggedIn           = require('./middleware/logger_in')
var loadUser           = require('./middleware/load_user')
var restrictUserToSelf = require('./middleware/restrict_user_to_self')
var fs                 = require('fs')
var imageprocess       = require('./imageprocess')
var usermanage         = require('./user')

exports.handle = function(app){
	//for rigister
	app.post('/users',function(req,res,next){
		var filename=req.body.pic
		var parse=/(\w+).\w+/
		// var filenameinpng=parse.exec(filename)[1]+".png"
		var filenameinpng = "head.png"
		var _user=new User({
			username:req.body.username,
			password:req.body.password,
			pic:'/pic/'+req.body.username+'/1/'+filenameinpng,
			email:req.body.email
		})
		User.create(_user,function(err){
			if (err){
				if (err.code === 11000){
					res.send('Confilck')
				}else{
					next(err)
				}
			}
			else {
				res.send('ok')
				imageprocess.writepic(req.body.file,filenameinpng,req.body.username,1)
			}
		})
		
	})
	//get user
	app.post('/getUser/:name',loadUser,function(req,res,next){
		//not return password
		req.user['password']=null
		res.send(req.user)
	})
	// get personal profile
	app.get('/myprofile',LoggedIn,function(req,res,next){
		User.findOne({username:req.session.user.username},function(err,user){
			if (err)
				res.send(err)
			else
			{
				user.password = undefined
				res.send(user)
			}
		})
	})
	//get personal quest
	app.get('/myquest',LoggedIn,function(req,res,next){
		res.render('myQuest',{session:req.session})
	})

	//set personal profile
	app.get('/editprofile',LoggedIn,function(req,res,next){
		res.render('profile',{session:req.session})
	})
	app.post('/editprofile',LoggedIn,function(req,res,next){
		if (req.session.user.username!=req.body.username)
			res.send('error')
		else{
			var l_username = req.body.username 
			var l_password = req.body.password 
			var l_email    = req.body.email
			var l_pic      = req.body.pic
			User.find({username:l_username},function(user,err){
				if (l_password == undefined) l_password = user.password
				if (l_email    == undefined) l_email    = user.email
				if (l_pic      == undefined) l_pic      = user.pic
				User.update({username:l_username},{password:l_password,email:l_email,pic:l_pic},function(err){
					if (err) res.send('error')
						else
							res.send('ok')
				})
			})
		}
	})
	
}

exports.removeSignedAndComfirmed = function(quest,next) {
	console.log('removeSignedAndComfirmed begin')
	User.findOne({username:quest.from},function(err,user){
		var l_quest = user.MyQuest
		index = l_quest.indexOf(quest._id)
		if (index > -1)
			release(l_quest,index)
		User.update({username:user.username},{MyQuest:l_quest},function(err){
			if (err)
				next(err)
		})
	})
	if (quest.got.length == 0) 
		next()
	else
	for (var x = 0 ; x < quest.got.length ;  x++ ) {
		var k = (function(x){
			return function(){
					User.findOne({username:quest.got[x]},function(err,user){
					console.log(x)
					var l_sign = user.MySign
					var l_help = user.MyHelp
					var index  = l_sign.indexOf(quest._id)
					if (index > -1) {
						l_sign = release(l_sign,index)
					}
					index = l_help.indexOf(quest._id)
					if (index > -1){
						l_help = release(l_help,index)
					}
					User.update({username:user.username},{MyHelp:l_help,MySign:l_sign},function(err){
						if (!err)
							if (x == quest.got.length - 1){
								usermanage.sendRemoveMessage(user.username,quest,function(err){
									if (err)
										next(err)
									else
										next()
								})
							}
							else
								usermanage.sendRemoveMessage(user.username,quest)
						else
							next(err)
					})
				})
			}
		})(x)
		k()
	}
}

exports.sendRemoveMessage = function (username,quest,next){
	usermanage.sendmessage(username,'system',quest._id,1,function(err){
		if (next)
			next(err)
	})
	// User.findOne({username:username},function(err,user){
	// 	var l_message = user.Messages
	// 	l_message.push(quest.title+'Canceled, if you have any question , please contract'+quest.from)
	// 	User.update({username:username},{Messages:l_message},function(err){})
	// })

}

exports.finish = function(quest){
	console.log(quest)
	var from = quest.from
	var got  = quest.got[0]
	User.findOne({username:from},function(err,user){
		// var l_message = user.Messages
		console.log(user)
		var l_finish  = user.FinishedQuest
		var l_MyQuest = user.MyQuest
		l_finish.push(quest._id)
		var index = l_MyQuest.indexOf(quest._id)
		if (index > -1 )
			l_MyQuest = release(l_MyQuest,index)
		console.log(l_MyQuest)
		console.log(from)
		User.update({username:from},{FinishedQuest:l_finish,MyQuest:l_MyQuest},function(err){
			console.log(err)
		})
	})
	User.findOne({username:got},function(err,user){
		// var l_message = user.Messages
		var l_finish  = user.FinishedQuest
		var l_help    = user.MyHelp
		// l_message.push('Congration,you have finish the '+data.title+'by:'+data.from)
		l_help.push(quest._id)	
		var index = l_help.indexOf(quest._id)
		if (index >-1)
			l_help = release(l_help,index)
		User.update({username:got},{FinishedQuest:l_finish,MyHelp:l_help},function(err){})
		usermanage.sendmessage(got,'system',quest._id,2)
	})
}

exports.sendmessage = function(username , from , data , type ,next){
	//type :  1_  a quest cancel    ..  				data  = quest._id
	// 		  2_  a quest accomplish    				data  = quest._id
	//        3_  a normal message from your friend     data  = message  
	//        4_  a normal message from signedone       data  = message
	//        5_  a sigh                                data  = quests._id
	//        6_  a comfirmed                           data  = quests._id
	User.findOne({username:username},function(err,user){
		if (err)
			next(err)
		
		else{
			var l_message = user.Messages
			_message = new Message({from:from,to:username,type:type})
			if (type <=2 || type ==5 ||type ==6 ) _message.relatedQuest = data 
				else	
					_message.relatedData = data
			Message.create(_message,function(err,message){
				if (!err) {
					l_message.push(message._id)
					User.update({username:username},{Messages:l_message},function(err){
					if (next)
						next(err)
					})
				}else{
					next(err)
					console.log(err)
				}
			})
		}
	})
}
//reset user .. this is only for test
exports.reset = function(app){
	app.get('/admin/reset/:name',function(req,res,err){
		User.findOneAndUpdate({username:req.params.name},{	
			MyQuest:[],MyHelp:[],MySign:[],FinishedQuest:[],FailedQuest:[],Messages:[]},function(err){
				if (err)
					res.send('error',404)
				else
					res.send('ok',200)
			})
	})
}


function release(arr,index){
	var tmp = arr[index]
	arr[index] = arr[arr.length-1]
	arr[arr.length-1] = tmp 
	arr.pop()
	return arr
}