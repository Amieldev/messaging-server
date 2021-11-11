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

    fetch('/send/')
    .then(response => response.json())
    .then(data => renderMessages(data));

  function renderMessages(data){
    JSON.parse(data).forEach(msg=> {
        const message=document.createElement("button");
        message.innerHTML=msg;
        message.classList.add('message')
        document.body.appendChild(message);
    });
  }
