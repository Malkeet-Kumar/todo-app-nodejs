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

function todoIsPresent(data,filepath){
    return new Promise((resolve,reject)=>{
        readMyFile(filepath)
        .then((fileData)=>{
            try{
                if(fileData==""){
                    resolve('empty');
                }
                const a = fileData.toString().slice("\n").trim();
                const arr = a.split("\n");
                for(const line of arr){
                    const obj = JSON.parse(line);
                    if(obj.name == data.name && obj.todo == data.todo && obj.priority==data.priority && obj.mark == data.mark){
                        resolve(true);
                    }
                }
                resolve(false);
            } catch (err){
                reject(err);
            }
        })
        .catch((err)=>{
            console.log("Error while reading from file and checking data if exists : ",err);
        })
    });
}

function saveTodoToFile(data,res,filepath,callback){
    try{
        fs.appendFile(filepath,JSON.stringify(data)+"\n",(err)=>{
            if(err){
                console.log("Error while appending : ",err);
            }
            callback(res,filepath);
        });
    } catch (err){
        console.log("Error while appending : ",err);
    }
}

function checkDuplicateAndSave(req,res,filepath){
    todoIsPresent(req.body,filepath)
    .then((isPresent)=>{
        if(isPresent=="empty"){
            saveTodoToFile(req.body,res,filepath,sendResponse);
        } else if(isPresent){
            sendResponse(res,filepath);
        } else {
            saveTodoToFile(req.body,res,filepath,sendResponse);
        }
    })
    .catch((err)=>{
        console.log("Error while checking for data if exist : ",err);
    })
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

function writeBackToFile(data, filepath){
    fs.truncate(filepath,()=>{});
    return new Promise((resolve,reject)=>{
        
        (async () => {
            for (let i = 0; i < data.length; i++) {
              try { 
                await appendLineToFile(data[i].toString(),filepath);
              } catch (err) {
                reject(err);
                return;
              }
            }
            resolve(true);
          })();
    });
}

function appendLineToFile(line,filepath){
    return new Promise((resolve,reject)=>{
        fs.appendFile(filepath,line+"\n",(err)=>{
            if(err){
                reject(err);
            }
            resolve();
        })
    })
}

function checkAndDelete(id,res,filepath){
    readMyFile(filepath)
    .then((fileData)=>{
        const a = fileData.toString().slice("\n").trim();
        const arr = a.split("\n");
        arr.splice(id,1);
        return writeBackToFile(arr,filepath);
    })
    .then((isDone)=>{
        if(isDone){
            sendResponse(res,filepath);
        }
    })
    .catch((err)=>{
        console.log("Error while reading and writing back to file : ",err);
    });
}

function markTodoAsDone(id,res,filepath){
    readMyFile(filepath)
    .then((fileData)=>{
        const a = fileData.toString().slice("\n").trim();
        const arr = a.split("\n");
        const t = JSON.parse(arr[id]);
        t.mark = "Done";
        arr[id] = JSON.stringify(t);
        return writeBackToFile(arr,filepath);
    })
    .then((isDone)=>{
        if(isDone){
            sendResponse(res,filepath);
        }
    })
    .catch((err)=>{
        console.log("Error while reading and writing back to file : ",err);
    });
}

function findAndSend(id,res,filepath){
    readMyFile(filepath)
    .then((fileData)=>{
        const a = fileData.toString().slice("\n").trim();
        const arr = a.split("\n");
        res.end(arr[id]);
    })
}

function updateTodo(id,data,res,filepath){
    readMyFile(filepath)
    .then((fileData)=>{
        const a = fileData.toString().slice("\n").trim();
        const arr = a.split("\n");
        const t = JSON.parse(arr[id]);
        t.todo = data.todo;
        t.priority = data.priority;
        arr[id] = JSON.stringify(t);
        return writeBackToFile(arr,filepath);
    }) 
    .then((isDone)=>{
        if(isDone){
            sendResponse(res, filepath);
        }
    })
    .catch((err)=>{
        console.log("Error while reading and writing back to file : ",err);
    })
}

module.exports = { checkDuplicateAndSave,sendResponse,updateTodo,checkAndDelete,markTodoAsDone,findAndSend};