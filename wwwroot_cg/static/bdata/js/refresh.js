if (document.images){
    var parselimit=limit
}
function beginrefresh(){
    if (!document.images)
        return
    if (parselimit==1)
        window.location.reload()
    else{
        parselimit-=1
        curmin=Math.floor(parselimit)
        if (curmin!=0)
            curtime=curmin+"秒后自动获取UID!"
        else
            curtime=cursec+"秒后自动获取UID!"
        timeinfo.innerText=curtime
        setTimeout("beginrefresh()",1000)
    }
}

window.onload=beginrefresh