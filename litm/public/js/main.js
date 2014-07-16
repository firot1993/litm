var parseEmail=/(\w+)@(\w+).com/
var emailList=["qq","163","gmail","126"]
function validEmail(email){
    var ans=parseEmail.exec(email)
    var re=false
    if (ans!=NULL){
        for (int i=0;i<emailList.length;i++)
            if (emailList[i]==ans[2]) re=true
    }
}