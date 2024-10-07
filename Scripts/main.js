// JavaScript to control the task modal, task storage, and task management
document.addEventListener('DOMContentLoaded', () => {
    const createTaskBtn = document.getElementById('create-task');
    const showTaskBtn = document.getElementById('show-task');
    const modal = document.getElementById('task-modal');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('task-form');
    const taskDisplay = document.getElementById('task-display');
    const sortSelect = document.getElementById('sort-tasks');
    const filterPrioritySelect = document.getElementById('filter-priority');
    const taskToday = document.getElementById('taskToday');
    let taskStatusChartInstance = null;
    let taskStatusChartInstance1 = null;
    let taskStatusChartInstance2 = null;

    let editIndex = -1; // To track which task is being edited
    // Get stored tasks from localStorage
    const getStoredTasks = () => JSON.parse(localStorage.getItem('tasks')) || [];

    // Save tasks to localStorage
    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Function to validate form inputs
    const isValidForm = (title, description, start, end) => {
        return title.trim() !== '' && description.trim() !== '' && start.trim() !== '' && end.trim() !== '';
    };
    createTaskBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        form.reset();
        editIndex = -1; // Reset edit mode
    });
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const start = document.getElementById('start').value;
        const end = document.getElementById('end').value;
        const priority = document.getElementById('priority').value;
        const status = document.getElementById('status').value;

        // Validate the form to prevent empty tasks
        if (!isValidForm(title, description, start, end, status, priority)) {
            alert("All fields must be filled!");
            return;
        }

        const tasks = getStoredTasks();

        // If editing an existing task
        if (editIndex !== -1) {
            tasks[editIndex] = { title, description, start, end, priority, status };
        } else {
            // Add the new task to the task list and save to localStorage
            tasks.push({ title, description, start, end, priority, status });
        }

        saveTasks(tasks);
        form.reset();
        modal.style.display = 'none';
        showTasks();
    });
    showTaskBtn.addEventListener('click', () => {
        showTasks();
    });

    sortSelect.addEventListener('click', () => {
        showTasks();
    });

    filterPrioritySelect.addEventListener('click', () => {
        showTasks();
    });



    // Function to display tasks
    const showTasks = () => {
        const graphView = document.getElementById('taskStatusChart');
        const graphView1 = document.getElementById('taskStatusChart1');
        const graphView2 = document.getElementById('taskStatusChart2');

        graphView.style.display = 'none';
        graphView1.style.display = 'none';
        graphView2.style.display = 'none';
        taskToday.style.display = 'block';

        const tasks = getStoredTasks();
        console.log("t", tasks);
        let sortedFilteredTasks = [...tasks];

        // Apply sorting
        const sortOption = sortSelect.value;
        sortedFilteredTasks = applySort(sortedFilteredTasks, sortOption);

        // Apply filtering
        const filterPriority = filterPrioritySelect.value;
        if (filterPriority !== 'all') {
            sortedFilteredTasks = sortedFilteredTasks.filter(task => task.priority === filterPriority);
        }

        taskDisplay.innerHTML = ''; // Clear current tasks display

        if (sortedFilteredTasks.length === 0) {
            taskDisplay.innerHTML = '<p>No tasks available.</p>';
            return;
        }

        sortedFilteredTasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-card');
            console.log("task", task.status)
            taskElement.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p><strong>Start:</strong> ${task.start}</p>
                <p><strong>End:</strong> ${task.end}</p>
                <p><strong>Priority:</strong> ${task.priority}</p>
                 <p><strong>Status:</strong> ${task.status}</p>
                <div class="task-actions">
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                    <input type="checkbox" class="complete-checkbox" 
                ${task.status == "completed" ? 'checked' : ''} 
                data-index="${index}" />
            <label>Completed</label>
                </div>
                 
        
               
            `;

            taskElement.querySelector('.complete-checkbox').addEventListener('change', (event) => {
                toggleComplete(event.target.dataset.index);
            });
            taskDisplay.appendChild(taskElement);
        });

        const deleteButtons = document.querySelectorAll('.delete-btn');
        const editButtons = document.querySelectorAll('.edit-btn');

        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteTask(index);
            });
        });

        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                editTask(index);
            });
        });
    };

    const toggleComplete = (index) => {
        let tasks = getStoredTasks();
        if (tasks[index].status == "completed") {
            tasks[index].status = "in-progress"
            saveTasks(tasks);
            showTasks()
        }
        else {
            tasks[index].status = "completed"
            saveTasks(tasks);
            showTasks()
        }
        if (tasks[index].status == "completed") {
            alert(`Task "${tasks[index].title}" has been marked as completed!`);
        } else {
            alert(`Task "${tasks[index].title}" has been marked as not completed!`);
        }
    };
    // Function to delete a task
    const deleteTask = (index) => {
        const tasks = getStoredTasks();
        tasks.splice(index, 1);
        saveTasks(tasks);
        showTasks();
    };

    // Function to edit a task
    const editTask = (index) => {
        const tasks = getStoredTasks();
        const task = tasks[index];
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description;
        document.getElementById('start').value = task.start;
        document.getElementById('end').value = task.end;
        document.getElementById('priority').value = task.priority;
        editIndex = index;
        modal.style.display = 'flex';
    };


    const applySort = (tasks, sortOption) => {
        switch (sortOption) {
            case 'priority':
                return tasks.sort((a, b) => a.priority.localeCompare(b.priority));
            case 'priority1':
                return tasks.sort((a, b) => b.priority.localeCompare(a.priority));

            case 'start':
                return tasks.sort((a, b) => new Date(a.start) - new Date(b.start));
            case 'end':
                return tasks.sort((a, b) => new Date(a.end) - new Date(b.end));
            default:
                return tasks;
        }
    };


    function getTaskCounts() {
        let toDoCount = 0, inProgressCount = 0, doneCount = 0;
        let tasks = getStoredTasks();
        tasks.forEach(task => {
            if (task.status === 'to-do') toDoCount++;
            else if (task.status === 'in-progress') inProgressCount++;
            else if (task.status === 'completed') doneCount++;
        });

        return [toDoCount, inProgressCount, doneCount];
    }

    // Function to render the pie chart
    function renderTaskStatusChart() {
        const ctx = document.getElementById('taskStatusChart').getContext('2d');
        const ctx1 = document.getElementById('taskStatusChart1').getContext('2d');
        const ctx2 = document.getElementById('taskStatusChart2').getContext('2d');

        const [toDoCount, inProgressCount, doneCount] = getTaskCounts();
        if (taskStatusChartInstance !== null) {
            taskStatusChartInstance.destroy();
        }
        if (taskStatusChartInstance1 !== null) {
            taskStatusChartInstance1.destroy();
        }
        if (taskStatusChartInstance2 !== null) {
            taskStatusChartInstance2.destroy();
        }
        taskStatusChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['To Do', 'In Progress', 'Completed'],
                datasets: [{
                    label: "Line Chart",
                    data: [toDoCount, inProgressCount, doneCount],
                    backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0']
                }]
            },
            options: {
                responsive: true
            }
        });
        taskStatusChartInstance1 = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['To Do', 'In Progress', 'Completed'],
                datasets: [{
                    label: "Bar Chart",
                    data: [toDoCount, inProgressCount, doneCount],
                    backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0']
                }]
            },
            options: {
                responsive: true
            }
        });

        taskStatusChartInstance2 = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: ['To Do', 'In Progress', 'Completed'],
                datasets: [{
                    data: [toDoCount, inProgressCount, doneCount],
                    backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Pie Chart',
                        font: {
                            size: 20,
                            weight: 'bold'
                        },
                        color: '#333',
                        padding: {
                            top: 10,
                            bottom: 30
                        }
                    }
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', renderTaskStatusChart);

    document.getElementById('toggleView').addEventListener('click', function () {
        const listView = document.getElementById('listView');
        const graphView = document.getElementById('taskStatusChart');
        const graphView1 = document.getElementById('taskStatusChart1');
        const graphView2 = document.getElementById('taskStatusChart2');

        if (listView.style.display === 'none') {
            listView.style.display = 'block';
            graphView.style.display = 'none';
            graphView1.style.display = 'none';
            graphView2.style.display = 'none';
            taskToday.style.display = 'block';


        } else {
            listView.style.display = 'none';
            graphView.style.display = 'block';
            graphView1.style.display = 'block';
            graphView2.style.display = 'block';
            taskToday.style.display = 'none';



            renderTaskStatusChart();
        }
    });
});
