var User=require('../data/models/user')
var Quest=require('../data/models/quest')
var notLoggedIn=require('./middleware/not_logger_in')
var LoggedIn=require('./middleware/logger_in')
var loadUser=require('./middleware/load_user')
var restrictUserToSelf=require('./middleware/restrict_user_to_self')
var fs=require('fs')
var imageprocess=require('./imageprocess')

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
		User.update({username:user.username},{MyQuest:l_quest},function(err){})
	})
	for (var x = 0 ; x < quest.got.length ;  x++ ) {
		User.findOne({username:quest.got[x]},function(err,user){
			var l_sign = user.MySign
			var l_help = user.MyHelp
			var index  = l_sign.indexOf(quest._id)
			if (index > -1) {
				release(l_sign,index)
				// var tmp = l_sign[l_sign.length-1]
				// l_sign[l_sign.length-1] = l_sign[index]
				// l_sign[index] = tmp
				// l_sign.pop()
			}
			index = l_help.indexOf(quest._id)
			if (index > -1){
				release(l_help,index)
				// var tmp = l_help[l_help.length-1]
				// l_help[l_help.length-1] = l_help[index]
				// l_help[index] = tmp
				// l_help.pop()
			}
			User.update({username:user.username},{MyHelp:l_help,MySign:l_sign},function(err){
				if (x == quest.got.length-1)
					console.log('removeSignedAndComfirmed end')
				if (!err)
					sendRemoveMessage(user.username,quest)
			})
		})
	}
}

exports.sendRemoveMessage = function (username,quest){
	User.findOne({username:username},function(err,user){
		var l_message = user.Messages
		l_message.push(quest.title+'Canceled, if you have any question , please contract'+quest.from)
		User.update({username:username},{Messages:l_message},function(err){})
	})
}

exports.finish = function(quest){
	var from = quest.from
	var got  = quest.got[0]
	User.findOne({username:from},function(err,user){
		// var l_message = user.Messages
		var l_finish  = user.FinishedQuest
		var l_MyQuest = user.MyQuest
		l_finish.push(quest._id)
		var index = l_MyQuest.indexOf(quest._id)
		if (index > -1 )
			release(l_MyQuest,index)
	})
	User.findOne({username:got},function(err,user)){
		var l_message = user.Messages
		var l_finish  = user.FinishedQuest
		var l_help    = user.MyHelp
		l_message.push('Congration,you have finish the '+data.title+'by:'+data.from)
		l_help.push(quest._id)	
		var index = l_help.indexOf(quest._id)
		if (index >-1)
			release(l_help,index)
	}
}

//reset user .. this is only for test
exports.reset = function(app){
	app.get('/admin/reset/:name',function(req,res,err){
		User.findOneAndUpdate({username:req.params.name},{	
			MyQuest:[],MyHelp:[],MySign:[],FinishedQuest:[],FailedQuest:[],essages:[]},function(err){
				if (err)
					res.send('error',404)
				else
					res.send('ok',200)
			})
	})
}

function release(array,index){
	var tmp = array[index]
	array[index = array[array.length-1]
	array[array.length-1] = tmp 
	array.pop()
}