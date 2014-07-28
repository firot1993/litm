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

function playpage(data,page,perpage){
    console.log(data)
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
        var _id        = nowObject['_id']
        var staticpos_x  = nowObject['staticpos_x']
        var staticpos_y  = nowObject['staticpos_y']
        var fixedpos_x   = nowObject['fixedpos_x']
        var fixedpos_y   = nowObject['fixedpos_y']
        var status       = nowObject['state']
        var got          = f_parsePeople(nowObject['got'])

        content        = f_parseContent(content,title,from)
        contentLimit.push({
            'content':content,
            'title':title,
            'from':from,
            'brief':brief,
            'etime':etime,
            'stime':stime,
            '_id':_id,
            'staticpos':{x:staticpos_x,y:staticpos_y},
            'fixedpos':{x:fixedpos_x,y:fixedpos_y},
            'status':status,
            'got':got
        })
    }
    return contentLimit;
}

function f_parsePeople(data){
    var p=""
    for (var i = 0 ; i < data.length ; i++){
        p+='<a href="#">'+data[i]+'</a>'
    }
    return p
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
    return content
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
            else
                return p
        }
    }
}

function showdes(value,node){
    console.log(value)
    console.log(node)
    var mydate=new Date(value['stime'])
    var startdate=parseDate(mydate)
    mydate=new Date(value['etime'])
    var enddate=parseDate(mydate)
    console.log( node.find('.modal-header.my h2'))
    node.find('.modal-header.my h2').html(value['title'])
    node.find('.modal-body.my .time').html('    <strong>'+startdate+'</strong>   To   <strong>'+enddate+'<strong/> ')
    node.find('.modal-body.my .from').html('    '+value['from'])
    node.find('.modal-body.my .main').html(value['content'])
    node.modal('show')
    //req.body.id signQuest
    node.find('.btn.btn-success').click(function(){
        $.ajax({
            url:'/signQuest',
            type:'post',
            data:{
                id:value._id
            },
            success:function(data){
                alert(data)
            }
        })
    })
}

function showpic(value){
    $('.modal-body.pic').html('<img src="'+value+'"/>')
    $('#pic').modal('show')
}



var Contract = function (data) {
    var data = data || []
    var that = {}
    that.init = function (page,perpage,friendonly,callback) {
        $.ajax({
            url:'/find',
            type:'post',
            data:{
                friendonly:friendonly
            },
            success:function(p){
                data = playpage(p,page,perpage)
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



//add focus event to other element

var hasAttr = function(el, name){
  var attr = el.getAttribute && el.getAttribute(name);
  return attr ? attr.specified : false
}
var addEvent = function(obj,type,callback){
  if ( obj.addEventListener ) {
    obj.addEventListener( type, callback, false );
  } else if ( obj.attachEvent ) {
    obj.attachEvent( "on" + type, callback );
  }
}
var rfocus = function(el,fn){
  if(!hasAttr(el,"tabindex"))
    el.tabIndex = 10;
  addEvent(el,"focus",function(e){
    fn.call(el,(e || window.event));
  });
}

var rblur = function(el,fn){
  if(!hasAttr(el,"tabindex"))
    el.tabIndex = 10;
  addEvent(el,"blur",function(e){
    fn.call(el,(e || window.event));
  });
}

// process repeatWarning
