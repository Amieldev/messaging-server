const socket=io('ws://amidev.loca.lt');

const btn=document.querySelector(".btn");
const text=document.getElementById("input");
const chat=document.querySelector(".chat");
const menu=document.querySelector(".menu");
const deleteBtn=document.querySelector(".delete-btn");
const editBtn=document.querySelector(".edit-btn");
const closeBtn=document.querySelector(".close-btn");



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
        message.onclick=()=>{showMenu(message.innerHTML)};
    });
  };

  function showMenu(message){
      menu.classList.add('menu-active');

      deleteBtn.onclick=()=>{DeleteMessage(message)};

      editBtn.onclick=()=>{EditMessage(message)};

      closeBtn.onclick=()=>{
        menu.classList.remove('menu-active');
    }

  }

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

    menu.classList.remove('menu-active');

  }

  function EditMessage(message){

    const editBy=window.prompt("Enter message:",message);

    fetch('/send/',
    {
        headers:{
            'Content-Type':'application/json'
        },
        method:'put',
        body:JSON.stringify({
            edit:message,
            by:editBy
        })
    });

    socket.emit('edit',JSON.stringify({edit:message,by:editBy}));

    menu.classList.remove('menu-active');

  }



socket.on('message',text=>{
    const message=document.createElement("button");
    message.innerHTML=text;
    message.classList.add('message')
    chat.appendChild(message);
    message.onclick=()=>{showMenu(message.innerHTML)};
});

socket.on('delete',text=>{
    const messages=Array.from(document.querySelectorAll('.message'));
    messages.forEach(msg=>{
        if(msg.innerHTML==text){
        chat.removeChild(msg);
        }
    }) 

});

socket.on('edit',editmsg=>{
    const messages=Array.from(document.querySelectorAll('.message'));
    messages.forEach(msg=>{
        if(msg.innerHTML==JSON.parse(editmsg).edit){
            msg.innerHTML=JSON.parse(editmsg).by;
        }
    }) 

});