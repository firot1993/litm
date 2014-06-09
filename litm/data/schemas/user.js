var mongoose=require('mongoose');
var UserSchema = new mongoose.Schema({
	username:{type:String,unique:true},
	name:String,
	password:String,
	pic:String,
	friends:[String],
	Message:[{Message:String,form:String,time:Date,readed:Boolean}],
	MyQuest:[mongoose.Schema.Types.ObjectId],
	MyHelp:[mongoose.Schema.Types.ObjectId],
	grade:Number,
	level:Number,
	Questfinish:Number,
	QuestGood:Number
});


module.exports=UserSchema;