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
            path=path+'/'+type.toString()
            if (!fs.existsSync(path))
                 fs.mkdirSync(path);
            path=path+'/'
            console.log(path)
            fs.rename(filename,path+filename,function(err){
             if (err)
                 throw err
            })
        })

    
}