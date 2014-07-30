var User=require('../data/models/user')
var Quest=require('../data/models/quest')
var Message=require('../data/models/message')
var notLoggedIn=require('./middleware/not_logger_in')
var LoggedIn=require('./middleware/logger_in')
var loadUser=require('./middleware/load_user')
var restrictUserToSelf=require('./middleware/restrict_user_to_self')
var fs=require('fs')
var imageprocess=require('./imageprocess')
var usermanage  =require('./user')

exports.index = function(app) {

    //render messagecenter
    app.get('/messagecenter',LoggedIn,function(req,res,next){
        res.render('messagecenter',{session:req.session})
    })

    //getmessage to render messagecenter
    app.post('/messagecenter',LoggedIn,function(req,res,next){
        User.findOne({username:req.session.user.username},function(err,user){
            if (err)
                res.send('error')
            else{
                 Message.find().where('_id').in(user.Messages).exec(function(err,messages){
                if (err)
                    res.send('error')
                else{
                    messages = sortbyarr(messages , user.Messages)
                    res.send(messages)
                    }
                })
            }
        })      
    })

    //remove message
    app.post('/remove',LoggedIn,function(req,res,next){
        var index = req.body.index
        User.findOne({username:req.session.user.username},function(err,user){
            if (err)
                res.send('error')
            else{
                var arr  = user.Messages
                var flag = remove(arr,index)
                console.log(flag)
                console.log(index)
                if (flag instanceof Array){ 
                    arr = flag
                    User.update({username:req.session.user.username},{Messages:arr},function(err,user){
                        if (err)
                            res.send('error')
                        else
                            res.send('ok')
                    })
                }else{
                    res.send('error')
                }
            }
        })
    })

}

function remove(arr,index){
    if (index>=0 && index<arr.length){
        var tmp = arr[arr.length-1]
        arr[arr.length-1] = arr[index]
        arr[index] = tmp
        arr.pop()
        return arr
    }else
        return false
}


function sortbyarr(arr,accordingarr){
    var result = []
    for (var x = 0; x< accordingarr.length ; x++){
        var index  = accordingarr.indexOf(arr[x]._id)
        console.log(index)
        result[index] = arr[x]        
    }
    console.log(arr)
    console.log(accordingarr)
    return result
}
