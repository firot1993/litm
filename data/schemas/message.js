var mongoose=require('mongoose')
var MessageSchema = new mongoose.Schema({
    from:String,
    to  :String,
    type:Number,
    relatedQuest:mongoose.Schema.Types.ObjectId,
    relatedData:String
})
module.exports=MessageSchema