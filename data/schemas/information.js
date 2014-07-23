var mongoose=require('mongoose')
var InformationSchema = new mongoose.Schema({
    QuestId:{type:mongoose.Schema.Types.ObjectId,unique:true},
    informationed:String,
    information:String
})

module.exports=InformationSchema