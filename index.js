const express=require('express');
const fs=require('fs');
const localtunnel=require('localtunnel');
const open=require('open');
const app=express();
const PORT=8000;
const http=require('http').createServer(app);
const io=require('socket.io')(http,{
    cors:{origin:"*"}
});

app.use(express.static('src'));
app.use(express.json());

io.on('connection',socket=>{
    console.log(`${socket.id.substr(0,2)} is user connected!`);

    socket.on('message',message=>{
        console.log(`${socket.id.substr(0,2)}:${message}`);
        io.emit('message',message)
    });

    socket.on('delete',message=>{
        console.log(`${socket.id.substr(0,2)} deleted:${message}`);
        io.emit('delete',message)
    });

    socket.on('edit',message=>{
        console.log(`${socket.id.substr(0,2)} edited:${JSON.parse(message).edit} by:${JSON.parse(message).by}`);
        io.emit('edit',message)
    });

})

http.listen(PORT,()=>console.log(`Listening on port ${PORT}`));


app.get('/send/',(req,res)=>{

    res.send(JSON.stringify(fs.readFileSync('database.json','utf-8')));

});

app.post('/send/',(req,res)=>{
    const {message}=req.body;

    res.send(message)

    let database=JSON.parse(fs.readFileSync('database.json','utf-8'));

    database.push(message);

    fs.writeFileSync('database.json',JSON.stringify(database));
    
});

app.delete('/send/',(req,res)=>{
    const {deletemessage}=req.body;
    console.log(`Deleting the message :${deletemessage}`);

    let database=JSON.parse(fs.readFileSync('database.json','utf-8'));

    let newDatabase=database.filter(text=>text!=deletemessage);

    fs.writeFileSync('database.json',JSON.stringify(newDatabase));

});

app.put('/send/',(req,res)=>{
    const {edit}=req.body;
    const {by}=req.body;

    let database=JSON.parse(fs.readFileSync('database.json','utf-8'));

    res.send(`Editing ${edit}`);

    database.forEach(message => {
        if(message==edit){
            database[database.indexOf(message)]=by;
        }
    });


    fs.writeFileSync('database.json',JSON.stringify(database));

})


  open(`http://localhost:${PORT}`);

// (async () => {
//     const tunnel = await localtunnel({ port: PORT , subdomain:"amidev"});
  
//     console.log(tunnel.url);
  
//     tunnel.on('close', () => {

//       console.log("server closed.")

//     });
//   })();