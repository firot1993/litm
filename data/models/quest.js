var mongoose=require('mongoose');
var QuestSchema=require('../schemas/quest');
var Quest=mongoose.model('Quest',QuestSchema);
module.exports=Quest;
