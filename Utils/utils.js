const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function readMyFile(filepath){
    return new Promise((resolve, reject)=>{
        fs.readFile(filepath,"utf-8",(err,data)=>{
            if(err){
                reject(err);
            } 
            resolve(data);
        });
    });
}

function sendResponse(res,filepath){
    readMyFile(filepath)
    .then((data)=>{
        if(data!==""){
            const resData = JSON.stringify(data);
            res.end(resData);
        }
    })
    .catch((err)=>{
        console.log("Error while reading from file : ",err);
    })
}

function saveToFile(data,filepath){
    return new Promise((resolve,reject)=>{
        fs.writeFile(filepath,JSON.stringify(data),(err)=>{
            if(err){
                reject(err);
            }
            resolve();
        })
    })
}

function createTodo(data,res,filepath){
    readMyFile(filepath)
    .then((fileData)=>{
        if(fileData==""){
            const t = [{...data,id: uuidv4()}];
            saveToFile(t,filepath)
            .then(()=>{
                sendResponse(res,filepath)
            })
            .catch((Err)=>{
                console.log("Err",Err);
            })
        }
        const arr = JSON.parse(fileData);
        const a = arr.find((t)=>{
            return t.todo===data.todo && t.priority===data.priority && t.mark===data.mark
        }) 
        if(!a){
            console.log("not",a);
            const t = {...data,id: uuidv4()};
            arr.push(t); 
            saveToFile(arr,filepath)
            .then(()=>{
                sendResponse(res,filepath)
            })
            .catch((Err)=>{
                console.log("Err",Err);
            })
        } else {
            sendResponse(res,filepath);
        }
    })
    .catch((err)=>{
        console.log(err);
    })
}

function deleteTodo(id,res,filepath){
    readMyFile(filepath)
    .then((fileData)=>{
        let arr = JSON.parse(fileData);
        arr = arr.filter((todo)=>todo.id!==id);
        // console.log(arr);
        saveToFile(arr,filepath)
        .then(()=>{
            sendResponse(res,filepath);
        })
    })
    .catch((err)=>{
        console.log(err);
    })
}

function markDone(id, res, filepath){
    readMyFile(filepath)
    .then((fileData)=>{
        let arr = JSON.parse(fileData);
        let todo = arr.find((t)=>t.id==id);
        todo.mark = "Done";
        saveToFile(arr, filepath)
        .then(()=>{
            sendResponse(res, filepath);   
        })
    })
    .catch((err)=>{
        console.log(err);
    })
}

function editTodo(id,data,res,filepath){
    readMyFile(filepath)
    .then((fileData)=>{
        let arr = JSON.parse(fileData);
        let todo = arr.find(t=>t.id==id);
        if(data.todo){
            todo.todo = data.todo
        }
        if(data.priority){
            todo.priority = data.priority
        }
        saveToFile(arr,filepath)
        .then(()=>{
            sendResponse(res,filepath);
        })
    })
    .catch((err)=>{
        console.log(err);
    })
}

function getTodo(id,res,filepath){
    readMyFile(filepath)
    .then((fileData)=>{
        const arr  = JSON.parse(fileData);
        let t = arr.find(t=>t.id==id);
        res.end(JSON.stringify(t));
    })
}

module.exports = { createTodo,sendResponse,deleteTodo,markDone,editTodo,getTodo};