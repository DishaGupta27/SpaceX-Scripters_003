let tasks=[];
function addTask(){
    let task=document.getElementById("taskInput").value;
    if (task){
        tasks.push({text:task, completed:false});
        displayTask();
        document.getElementById("taskInput").value='';
    } else{
        alert("Please Enter a task");
    }
}
function displayTask(){
    let taskList=document.getElementById("taskList");
    taskList.innerHTML='';
    for(let i=0;i<tasks.length;i++){
        let li=document.createElement("li");
        // checkbox
        let checkbox=document.createElement("input");
        checkbox.type="checkbox";
        checkbox.checked=tasks[i].completed;
        checkbox.onclick=function(){
            toggleTaskCompletion(i);
        };
        let taskText=document.createElement("span");
        taskText.textContent=tasks[i].text;
        li.textContent=tasks[i];
        taskText.style.textDecoration=tasks[i].completed? "line-through":"none";
        // remove button
        let removeButton=document.createElement("button");
        removeButton.textContent="Remove";
        removeButton.onclick=function(){
            removeTask(i);
        };
        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(removeButton);
        taskList.appendChild(li);
    }
}
function toggleTaskCompletion(index){
    tasks[index].completed=!tasks[index].completed;
    displayTask();
}
function removeTask(index){
    tasks.splice(index,1);
    displayTask();
}