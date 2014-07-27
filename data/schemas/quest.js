var mongoose=require('mongoose');
var QuestSchema=new mongoose.Schema({
	from:String,
	got:[String],
	state:String,//N=new,S=signed,C=confirmed,D=deliberation,F=finished
	stime:Date,
	etime:Date,
	title:String,
	content:String,
    brief:String,
    staticpos_x:Number,
    staticpos_y:Number,
    fixedpos_x:Number,
    fixedpos_y:Number
})

module.exports=QuestSchema;
