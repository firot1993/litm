var fs=require('fs')

exports.writepic=function(file,filename,username,type)
{
        var imgData    = file
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "")
        var dataBuffer = new Buffer(base64Data,'base64')

        fs.writeFile(filename,dataBuffer,function(err){
            if(err){
                console.log('hello')
            }else{
                console.log("save success");
            }
            path='./public/pic/'+username
            if (!fs.existsSync(path))
                 fs.mkdirSync(path);
            path=path+'/'+type
            if (!fs.existsSync(path))
                 fs.mkdirSync(path);
            path=path+'/'
            var filename2 = filename 
            if (type==1) filename2='head.png' 
            fs.rename(filename,path+filename2,function(err){
             if (err)
                 throw err
            })
        })

    
}