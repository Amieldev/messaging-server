const express=require('express');
const fs=require('fs');
const localtunnel=require('localtunnel');
const open=require('open');
const app=express();
const http=require('http').createServer(app);
const io=require('socket.io')(http,{
    cors:{origin:"*"}
});

app.use(express.static('src'));
app.use(express.json());

io.on('connection',socket=>{
    console.log(`${socket.id.substr(0,2)} is user connected!`);

    socket.on('message',message=>{
        console.log(message);
        io.emit('message',message)
    })

})

http.listen(8000,()=>console.log('Listening on port 8000'));


app.get('/send/',(req,res)=>{

    res.send(JSON.stringify(fs.readFileSync('database.json','utf-8')));

});

app.post('/send/',(req,res)=>{
    const {message}=req.body;
    console.log(message);

    res.send(message)

    let database=JSON.parse(fs.readFileSync('database.json','utf-8'));

    database.push(message);

    fs.writeFileSync('database.json',JSON.stringify(database));
    
});


  open('http://localhost:8000');

(async () => {
    const tunnel = await localtunnel({ port: 8000 , subdomain:"amidev"});
  
    console.log(tunnel.url);
  
    tunnel.on('close', () => {

      console.log("server closed.")

    });
  })();