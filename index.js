const express=require('express');
const fs=require('fs');
const path=require('path');
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

    res.json(JSON.stringify({message:fs.readFileSync('database.json','utf-8')}));

    console.log("ok")

});

app.post('/send/',(req,res)=>{
    const {message}=req.body;
    console.log(message);

    res.send(message)

    let database=JSON.parse(fs.readFileSync('database.json','utf-8'));

    database.push(message);

    fs.writeFileSync('database.json',JSON.stringify(database));
    
});
