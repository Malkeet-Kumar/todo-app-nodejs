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

app.get("/",(req, res)=>{
    res.sendFile(htmlFile);
});

app.get("/fetch-todo",(req,res)=>{
    utils.sendResponse(res,dbFile);
})

app.get("/todo/:id",(req,res)=>{
    utils.findAndSend(req.params.id,res,dbFile);
});

app.get("/style.css",(req,res)=>{
    res.sendFile(styleSheetFile);
});

app.get("/script.js",(req,res)=>{
    res.sendFile(scriptFile);    
});

app.patch("/edit-todo/:id",(req,res)=>{
    utils.updateTodo(req.params.id,req.body,res,dbFile);
});

app.post("/post-todo",(req,res)=>{
    utils.checkDuplicateAndSave(req,res,dbFile);
});

app.delete("/delete-todo/:id",(req,res)=>{
    utils.checkAndDelete(req.params.id,res,dbFile);
});

app.patch("/todo-done/:id",(req,res)=>{
    utils.markTodoAsDone(req.params.id,res,dbFile);
});

app.listen(8000, ()=>{
    console.log("server running on port 8000");
});
