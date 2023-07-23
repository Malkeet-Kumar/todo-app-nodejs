const fs = require('fs');
const path = require('path');

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
            saveToFile(arr,filepath)
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
            arr.push(data); 
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
        const arr = JSON.parse(fileData);
        arr.slice
    })
}

module.exports = { createTodo,sendResponse,updateTodo,checkAndDelete,markTodoAsDone,findAndSend};