var mongoose=require('mongoose');
var UserSchema = new mongoose.Schema({
	username:{type:String,unique:true},
	name:String,
	password:String,
	pic:String

});

module.exports=UserSchema;