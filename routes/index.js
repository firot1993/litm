
/*
 * GET home page.
 */

var User=require('../data/models/user')
var Quest=require('../data/models/quest')

exports.index = function(req, res){
    res.render('main',{session:req.session})
};