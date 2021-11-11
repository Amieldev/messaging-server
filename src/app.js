const btn=document.querySelector(".btn");
const text=document.getElementById("input");


    btn.onclick=()=>{SendMessage()};
    document.body.onkeypress=(e)=>{
        if(e.keyCode==13){
            SendMessage();
        }
    }

function SendMessage(){
    if(text.value!==""){
        fetch('/send/',
        {
            headers:{
                'Content-Type':'application/json'
            },
            method:'post',
            body:JSON.stringify({
                message:text.value
            })
        }).then(res=>console.log(res))
    }else{
        alert("No message to send.")
    }

    text.value="";
}


