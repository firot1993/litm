var parseEmail       = /(\w+)@(\w+).com$/
var parseSummerNote  = /<img src="(\S+)"[^\/<>]*>/g
var parseSummerNote2 = /^<img src="(\S+)"[^\/<>]*>$/
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
        var username   = nowObject['from']
        var brief      = nowObject['brief']
        var etime      = nowObject['etime']
        var stime      = nowObject['stime']
        var id         = nowObject['_id']
        content        = f_parseContent(content,title,username)
        contentLimit.push({
            'content':content,
            'title':title,
            'username':username,
            'brief':brief,
            'etime':etime,
            'stime':stime,
            'id':id
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
        images[i] = images[i].replace(image[1],'/pic/'+username+'/'+title+'/'+image[1])
    }
    return {'content':content,'images':images}
}

// function render(value){
//     var length=value.length
//     for (var i = 0;i < value.length;i++){
//             $('.buddle').find('.title').html(value['title'])
//             $('.buddle').find('.deadline').html(value['deadline'])
//             $('.buddle').find('.brief').html(value['brief'])
//         }
// }
