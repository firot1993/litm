var parseEmail       = /(\w+)@(\w+).com$/
var parseSummerNote  = /<img src="(\S+)"[^\/<>]*>/g
var parseSummerNote2 = /^<img src="(\S+)"[^\/<>]*>$/
var parseHtml        = /^http:\/\/\S+com$/
// var b               = '<p>asdasdasdasd</p><img src="sad.cas" alt="sad.asd"/>asdsad<img src="sazxccas" alt="sad.asd"/>asdasda<img src="ssdsdf.cas" alt="sad.asd"/>asdasdas'
var emailList       = ["qq","163","gmail","126"]
function validEmail(email){
    var ans = parseEmail.exec(email)
    var re  = false
    if (ans!=undefined){
        for (var i = 0;i < emailList.length;i++)
            if (emailList[i] == ans[2]) re = true
    }
    return re
}

function parsesummernote(value,title){
    var images = value.match(parseSummerNote)
    if (images != null)
    for (var i = 0 ; i < images.length; i++)
    {
        image = parseSummerNote2.exec(images[i]);
        value=value.replace(image[1],i+".png")
        $.ajax({url:"/writefile",
                type:'post',
                data:{
                        filename:i+'.png',
                        title:title,
                        picture:image[1]
                    },
                success:function(data,status,xhr){
                    console.log(data)
                        }
            })
    }
    return value
}
var parsePng=/"[0-9]+.png"/g
var parsePng2=/("[0-9]+.png")/
var parsePng3=/([0-9]+.png)/

function playpage(data,page,perpage,appendwith,styleclass){
    var length       = data.length
    var contentLimit = []
    for (var index = (page - 1) * perpage; index < Math.min(page * perpage,length); index++){
        var nowObject  = data[index]
        var content    = nowObject['content']
        var title      = nowObject['title']
        var from       = nowObject['from']
        var brief      = nowObject['brief']
        var etime      = nowObject['etime']
        var stime      = nowObject['stime']
        var _id         = nowObject['_id']
        content        = f_parseContent(content,title,from)
        contentLimit.push({
            'content':content,
            'title':title,
            'from':from,
            'brief':brief,
            'etime':etime,
            'stime':stime,
            '_id':_id
        })
    }
    return contentLimit;
}
function f_parseContent(content,title,username){
    var images = content.match(parsePng)
    if (images != null)
    for (var i = 0; i < images.length; i++){
        image     = parsePng2.exec(images[i])
        image2    = parsePng3.exec(images[i])
        content   = content.replace(image[1],'"/pic/'+username+'/'+title+'/'+image2[1]+'" '+'class="good"')
        images[i] = images[i].replace(image[1],'/pic/'+username+'/'+title+'/'+image2[1])
    }
    return {'content':content,'images':images}
}

function getUser(username,next){
    $.ajax({url:'/getUser/'+username,
            type:'post',
            success:function(data,status,xhr){
                next(data)
            }
    })
}

function getQuest(id,next){
    $.ajax({url:'/getQuest/'+id,
            type:'post',
            success:function(data,status,xhr){
                next(data)
            }
    })
}
function parseDate(mydate){
    return (mydate.getMonth()+1)+'/'+(mydate.getDate()-1)+'/'+mydate.getFullYear()
}
var Translate = function()
{
    var p_dict={}
    // var p_dict={'N':'info','S':'info','C':'warning','F':'success','D':'danger'}
    var w_dict={'N':'Begining','S':'Signed','C':'Confirmed','F':'Succeed','D':'Failed'}
    return {
        parseState:function(p){
            if (p_dict[p] != undefined)
                return p_dict[p]
            else
                return p
        },
        translateState:function(p){
            if (w_dict[p] != undefined)
                return w_dict[p]
            elseo11
                return p
        }
    }
}

function showdes(value,node){
    var mydate=new Date(value['stime'])
    var startdate=parseDate(mydate)
    mydate=new Date(value['etime'])
    var enddate=parseDate(mydate)
    node.find('.modal-header.my h2').html(value['title'])
    node.find('.modal-body.my .time').html('    <strong>'+startdate+'</strong>   To   <strong>'+enddate+'<strong/> ')
    node.find('.modal-body.my .from').html('    '+value['from'])
    node.find('.modal-body.my .main').html(value['content']['content'])
    node.modal('show')
}

function showpic(value){
    $('.modal-body.pic').html('<img src="'+value+'"/>')
    $('#pic').modal('show')
}


var Contract = function (data) {
    var data = data || []
    var that = {}
    that.init = function (callback) {
        $.ajax({
            url:'/find',
            type:'post',
            success:function(p){
                data = p
                callback()
            }
        })
    }
    that.pop = function(){
        if (data instanceof Array) 
            return data.pop() 
        else 
            return false
    }
    that.length = function(){
        if (data instanceof Array) 
            return data.length
        else
            return false
        
    }
    return that
}
