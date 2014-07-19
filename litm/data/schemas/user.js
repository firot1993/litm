var mongoose=require('mongoose');
var UserSchema = new mongoose.Schema({
	username:{type:String,unique:true},
	name:String,
	password:String,
	email:String,
	pic:String,
	friends:[String],
	MyQuest:[mongoose.Schema.Types.ObjectId],
	MyHelp:[mongoose.Schema.Types.ObjectId],
	grade:Number,
	level:Number,
	Questfinish:Number,
	QuestGood:Number
});


module.exports=UserSchema;