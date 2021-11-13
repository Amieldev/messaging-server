const express=require('express');
const fs=require('fs');
const path=require('path');
const localtunnel=require('localtunnel');
const open=require('open');
const app=express();
const PORT=3000;



app.use(express.json());
app.use(express.static("src"));


app.listen(PORT,()=>{
    console.log(`Listening on port:${PORT}`);
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'/index.html'));
});

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


  open('http://localhost:3000');

(async () => {
    const tunnel = await localtunnel({ port: 3000 , subdomain:"amidev"});
  
    console.log(tunnel.url);
  
    tunnel.on('close', () => {

      console.log("server closed.")

    });
  })();