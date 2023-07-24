const addToDo = document.getElementById('add-todo');
const todo = document.getElementById('todo');
const priority = document.getElementById('priority');
const todoListContainer = document.getElementById("todo-list");
var editBtn;
const editData = {
    todo : "",
    priority : ""
};

addToDo.addEventListener('click',()=>{
    if(addToDo.innerText=="Add Todo"){
        var user = document.getElementById('username').value;
        var task = todo.value.toString().trim();
        var prio = priority.value;
        if(task !== ""){
            const data = {
                name: user,
                todo: task,
                priority: prio,
                mark: "Pending"
            };
            todo.value = "";
            createTodo(data);
        } else{
            alert("Enter Todo to continue...");
        }
    } else if(addToDo.innerText == "Update Todo"){
            if(todo.value!==""){
                editData.todo = todo.value.toString().trim();
                editData.priority = priority.value;
                editTodo(editBtn.id,editData);   
            } else {
                prompt("Enter new data to edit todo...");
            }            
    }
}); 

function extractDataFromResponseAndShow(todolist,callback){
    refreshTodos()
    .then(()=>{
        const arr = JSON.parse(todolist)
        arr.map((todo)=>showTodos(todo,todo.id));
    })
    .catch();        
}

function showTodos(data,id){
    const todoContainer = document.createElement("div");
    todoContainer.className = "todo-item";
    todoContainer.id = id;

    const todoText = document.createElement("div");
    todoText.className = "todo-item-text-div";
    todoText.innerText = data.todo;

    const todoPriority = document.createElement('div');
    todoPriority.className = "todo-item-priority-div";
    todoPriority.innerText = data.priority;
    todoPriority.setAttribute("title","Priority.");

    const todoEditBtn = document.createElement("img");
    todoEditBtn.className = "todo-action-btn-edit";
    todoEditBtn.src = "/ic_edit_white_100.png"
    todoEditBtn.setAttribute("alt","Edit")
    todoEditBtn.setAttribute("title","Click to Edit this todo.");
    todoEditBtn.id = id;

    const todoDeleteButton = document.createElement("img");
    todoDeleteButton.src = "ic_delete_white_100.png"
    todoDeleteButton.className = "todo-action-btn-delete";
    todoDeleteButton.setAttribute("alt","Delete");
    todoDeleteButton.setAttribute("title","Click to delete this todo.");
    todoDeleteButton.id = id;

    const todoMark = document.createElement("img");
    todoMark.className = "todo-action-btn-mark";
    todoMark.id = id;
    if(data.mark=="Pending"){
        todoMark.src = "/ic_pending_50.png";
        todoMark.setAttribute("alt","Pending");
        todoMark.setAttribute("title","Click to mark todo as done.")
    } else {
        todoMark.setAttribute("alt","Done");
        todoMark.src = "/ic_done_50.png";
    }
    todoContainer.appendChild(todoText);
    todoContainer.appendChild(todoPriority);
    todoContainer.appendChild(todoMark);
    todoContainer.appendChild(todoEditBtn);
    todoContainer.appendChild(todoDeleteButton); 
    todoListContainer.appendChild(todoContainer);
}

const a = ()=>{
    todo.value = "";
    fetch('/todo',{
        method: "GET",
        headers:{
            'Content-Type' : 'application/json'
        }
    })
    .then((response)=>{
        return response.json();
    })
    .then((todos)=>{
        extractDataFromResponseAndShow(todos,showTodos);
    })
    .catch();
}

a();

document.body.addEventListener('click',(event)=>{
    if(event.target.alt == "Delete"){
        console.log("delete id - >",event.target.id);
        deleteTodo(event.target.id);
    } else if(event.target.alt == "Edit"){
        editBtn = event.target;
        changeBtnsState(editBtn);
    } else if(event.target.alt=="Cancel"){
        const btn = event.target;
        btn.style.backgroundColor = "transparent";
        btn.setAttribute("alt","Edit")
        addToDo.innerText = "Add Todo";
        todo.value = "";
        priority.value = "High";
    } else if(event.target.alt =="Pending"){
        todoMarkDone(event.target.id);
    } 
})

function changeBtnsState(btn){
        const btns = document.getElementsByClassName("todo-action-btn-edit");
        for(b of btns){
            b.setAttribute("alt","Edit")
            b.style.backgroundColor = "transparent";
        }
        btn.style.backgroundColor = "#00abff";
        btn.setAttribute("alt","Cancel")
        fetch("/todo/"+btn.id,{
            method: "GET",
            headers: {
                'Content-Type' : 'application/json'
            },
        })
        .then((response)=>{
            return response.json();
        })
        .then((data)=>{
            todo.value = data.todo;
            priority.value = data.priority;
        })
        .catch();   
        addToDo.innerText = "Update Todo";
}

function createTodo(data){
    fetch("/todo",{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response)=>{
        return response.json();
    })
    .then((todos)=>{
        extractDataFromResponseAndShow(todos,showTodos);    
    })
    .catch();
}

function deleteTodo(id){
    fetch("/todo/"+id,{
            method: 'DELETE',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({id: id}),
        })
        .then((response)=>{
            return response.json();
        })
        .then((todos)=>{
            extractDataFromResponseAndShow(todos,showTodos);
        })
        .catch();
    const item = document.getElementById(id);
    todoListContainer.removeChild(item);
}

function editTodo(id,data){
    fetch("/todo/"+id,{
        method : "PUT",
        headers: {
                'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response)=>{
        addToDo.innerText = "Add Todo";
        return response.json();
    })
    .then((todos)=>{
        extractDataFromResponseAndShow(todos,showTodos);
    })
    .catch();
}

function todoMarkDone(id){
    const item = document.getElementById(id);
    fetch("/todo/"+id,{
        method: "PATCH",
        headers: {
                'Content-Type' : 'application/json'
            },
        body: JSON.stringify({id: id})
    })
    .then((response)=>{
        return response.json();
    })
    .then((todos)=>{
        extractDataFromResponseAndShow(todos, showTodos);
    })
    .catch();
}

function refreshTodos(){
    return new Promise((resolve,reject)=>{
        if(!todoListContainer.hasChildNodes){
            resolve("hasNoChild");
        } else{
            while(todoListContainer.firstChild){
            todoListContainer.removeChild(todoListContainer.lastChild);
            }
            resolve();
        }          
    }) 
}
