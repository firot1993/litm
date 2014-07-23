var mongoose=require('mongoose');
var QuestSchema=new mongoose.Schema({
	from:String,
	got:[String],
	state:String,//N=new,S=signed,C=confirmed,D=deliberation,F=finished
	stime:Date,
	etime:Date,
	title:String,
	content:String,
    brief:String
})

module.exports=QuestSchema;
