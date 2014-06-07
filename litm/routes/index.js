
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
  // req.session.retry=0
  // res.redirect('/users')
};