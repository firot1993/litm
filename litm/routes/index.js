
/*
 * GET home page.
 */

var User=require('../data/models/user')
var Quest=require('../data/models/Quest')

exports.index = function(req, res){
	Quest.find().where('state').in(['N','U']).exec(function(err,quests){
		console.log(quests[1].title);
		res.render('index', { title: 'Litm',session:req.session,quest:quests});		
	})
	
};