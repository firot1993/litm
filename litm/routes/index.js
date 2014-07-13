
/*
 * GET home page.
 */

var User=require('../data/models/user')
var Quest=require('../data/models/Quest')

exports.index = function(req, res){
	// Quest.find().where('state').in(['N']).exec(function(err,quests){
	// 	res.render('main', { title: 'Litm',session:req.session,quest:quests});	
	// 	req.session.applyfor=0	
	// })
    req.session.applyfor=0
    res.render('main',{session:req.session})
};