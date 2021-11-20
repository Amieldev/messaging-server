const btn=document.querySelector(".btn");
const text=document.getElementById("input");
const chat=document.querySelector(".chat");
const socket=io('ws://localhost:8000');



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
        });

        socket.emit('message',text.value)

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
        message.classList.add('message');
        chat.appendChild(message);
        message.onclick=()=>{DeleteMessage(message.innerHTML)};
    });
  };

  function DeleteMessage(message){

    fetch('/send/',
    {
        headers:{
            'Content-Type':'application/json'
        },
        method:'delete',
        body:JSON.stringify({
            deletemessage:message
        })
    });

    socket.emit('delete',message);

  }



socket.on('message',text=>{
    const message=document.createElement("button");
    message.innerHTML=text;
    message.classList.add('message')
    chat.appendChild(message);
    message.onclick=()=>{DeleteMessage(message.innerHTML)};
});

socket.on('delete',text=>{
    const messages=Array.from(document.querySelectorAll('.message'));
    messages.forEach(msg=>{
        if(msg.innerHTML==text){
        chat.removeChild(msg);
        }
    }) 

})

