var mongoose=require('mongoose');
var QuestSchema=require('../schemas/Quest');
var Quest=mongoose.model('Quest',QuestSchema);
module.exports=Quest;