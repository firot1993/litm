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