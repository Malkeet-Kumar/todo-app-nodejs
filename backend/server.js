const express = require('express');
const path  = require('path');
const app = express();
const utils = require('../Utils/utils');

const dbFile = path.join(__dirname,'..','database','todolist.json');
const htmlFile = path.join(__dirname,'..','frontend','index.html');
const styleSheetFile = path.join(__dirname,'..','frontend','style.css');
const scriptFile = path.join(__dirname,'..','frontend','script.js');

app.use(express.json());
app.use(express.static(path.join(__dirname,'..','/icons')));

//homepage html,css, javascript
app.get("/",(req, res)=>{
    res.sendFile(htmlFile);
});

app.get("/style.css",(req,res)=>{
    res.sendFile(styleSheetFile);
});

app.get("/script.js",(req,res)=>{
    res.sendFile(scriptFile);    
});

//for fetching all the todos
app.get("/todo",(req,res)=>{
    utils.sendResponse(res,dbFile);
})
//for fetching a todo with id
app.get("/todo/:id",(req,res)=>{
    utils.getTodo(req.params.id,res,dbFile);
});
//for editing todo
app.put("/todo/:id",(req,res)=>{
    utils.editTodo(req.params.id,req.body,res,dbFile);
});
//for creating new todo
app.post("/todo",(req,res)=>{
    utils.createTodo(req.body,res,dbFile);
});
//for deleting a todo with id
app.delete("/todo/:id",(req,res)=>{
    utils.deleteTodo(req.params.id,res,dbFile);
});
//for marking todo as done with id
app.patch("/todo/:id",(req,res)=>{
    utils.markDone(req.params.id,res,dbFile);
});

app.listen(8000, ()=>{
    console.log("server running on port 8000");
});
