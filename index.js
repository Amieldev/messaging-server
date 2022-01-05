const express=require('express');
const upload=require('express-fileupload');
const fs=require('fs');
const path=require('path');
const localtunnel=require('localtunnel');
const open=require('open');
const app=express();
const PORT=9000;
const http=require('http').createServer(app);
const io=require('socket.io')(http,{
    cors:{origin:"*"}
});

app.use(express.static('src'));
app.use(express.json());
app.use(upload());

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

app.get('/message',(req,res)=>{
    res.send(JSON.stringify(fs.readFileSync('database.json','utf-8')));
});

app.get('/download',(req,res)=>{
    let filePath = path.join(__dirname, "database.json");

    res.download(filePath);
});

app.post('/message',(req,res)=>{
    const {message}=req.body;
    res.send(message)
    let database=JSON.parse(fs.readFileSync('database.json','utf-8'));
    database.push(message);
    fs.writeFileSync('database.json',JSON.stringify(database));
});

app.post('/file',(req,res)=>{
    if(req.files){
        let file=req.files.file;
        let filename=file.name;
        console.log(`uploaded:${filename}`);
        file.mv('./uploads/'+filename,(err)=>{
            if(err){
                res.send(err);
            }else{
                res.send('File uploaded');
            }
        })
    }
});

app.delete('/message',(req,res)=>{
    const {deletemessage}=req.body;
    console.log(`Deleting the message :${deletemessage}`);
    let database=JSON.parse(fs.readFileSync('database.json','utf-8'));
    let newDatabase=database.filter(text=>text!=deletemessage);
    fs.writeFileSync('database.json',JSON.stringify(newDatabase));
});

app.put('/message',(req,res)=>{
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
});


  open(`http://localhost:${PORT}`);

(async () => {
    const tunnel = await localtunnel({ port: PORT , subdomain:"amidev"});
    console.log(tunnel.url);
    tunnel.on('close', () => {
      console.log("server closed.")
    });
  })();