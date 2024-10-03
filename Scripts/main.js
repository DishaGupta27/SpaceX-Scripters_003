let tasks = [];
let searchQuery = '';
let filterCriteria = '';

function addTask() {
    let task = document.getElementById("taskInput").value;
    let assignedTo = document.getElementById("assignedUserInput").value;
    let dueDate = document.getElementById("dueDateInput").value;
    let priority = document.getElementById("priorityInput").value;
    let creationDate = new Date();  
    
    if (task) {
        const due = new Date(dueDate);
        if (due < creationDate) {
            alert("Due date must be in the future.");
            return;
        }
        
        tasks.push({
            text: task,
            completed: false,
            assignedTo: assignedTo,
            dueDate: due,
            priority: priority,
            creationDate: creationDate  
        });
        displayTask();
        resetInputFields(); 
        checkDueDates();
    } else {
        alert("Please enter a task");
    }
}

function displayTask() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = '';

    let tasksToDisplay = tasks.filter(task => {
        return (
            (filterCriteria === '' || 
            (filterCriteria === 'completed' && task.completed) || 
            (filterCriteria === 'incomplete' && !task.completed)) &&
            (searchQuery === '' || task.text.toLowerCase().includes(searchQuery))
        );
    });

    for (let i = 0; i < tasksToDisplay.length; i++) { 
        let li = document.createElement("li");
        appendTaskElements(li, tasksToDisplay[i], i);
        taskList.appendChild(li);
    }
}

function appendTaskElements(li, task, index) {
    // Checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed; 
    checkbox.onclick = function () {
        toggleTaskCompletion(index);
    };

    // Task Text
    let taskText = document.createElement("span");
    taskText.textContent = task.text; 
    taskText.style.textDecoration = task.completed ? "line-through" : "none"; 

    // Assigned User
    let assignedUserText = document.createElement("span");
    assignedUserText.textContent = " (Assigned To: " + task.assignedTo + ")"; 

    // Edit Button
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () {
        editTask(index);
    };

    // Priority
    let priorityText = document.createElement("span");
    priorityText.textContent = " (Priority: " + task.priority + ")"; 

    // Due Date
    let dueDateText = document.createElement("span");
    dueDateText.textContent = " (Due: " + task.dueDate.toLocaleDateString() + ")"; 

    // Remove Button
    let removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = function () {
        removeTask(index);
    };

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(priorityText);
    li.appendChild(dueDateText);
    li.appendChild(assignedUserText);
    li.appendChild(editButton);
    li.appendChild(removeButton);
}

function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    displayTask();
}

function removeTask(index) {
    tasks.splice(index, 1);
    displayTask();
}

function editTask(index) {
    let newTask = prompt("Edit your task:", tasks[index].text);
    if (newTask != null && newTask.trim() !== "") {
        tasks[index].text = newTask;
        displayTask();
    }
}

function sortTasks() {
    let criteria = document.getElementById("sortCriteria").value;
    tasks.sort((a, b) => {
        switch (criteria) {
            case 'priority':
                const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'dueDate':
                return new Date(a.dueDate) - new Date(b.dueDate);
            case "alphabetical":
                return a.text.localeCompare(b.text);
            case 'creationDate':
                return new Date(a.creationDate) - new Date(b.creationDate);
            default:
                return 0;
        }
    });
    displayTask();
}

function filterTasks() {
    filterCriteria = document.getElementById('filterCriteria').value; 
    displayTask(); 
}

function searchTasks() {
    searchQuery = document.getElementById('searchInput').value.toLowerCase();
    displayTask(); 
}

function resetInputFields() { 
    document.getElementById('taskInput').value = '';
    document.getElementById('assignedUserInput').value = '';
    document.getElementById('dueDateInput').value = '';
    document.getElementById('priorityInput').value = 'Low';
}

function checkDueDates(){
    const now = new Date();
    tasks.forEach(task => {
        const timeDifference = task.dueDate - now;
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        if (daysDifference === 0) {
            alert(`Task "${task.text}" is due today!`);
        } else if (daysDifference < 0) {
            alert(`Task "${task.text}" is Overdue!`);
        }
    });
}
