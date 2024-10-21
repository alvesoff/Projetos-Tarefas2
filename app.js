let tasks = [];

const saveTasksToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        updateTasksList();
        updateStats();
    }
};

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput');
    const text = taskInput.value.trim();
    const category = categoryInput.value;

    if (text) {
        tasks.push({ text: text, category: category, completed: false });
        updateTasksList();
        updateStats();
        saveTasksToLocalStorage();
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasksToLocalStorage();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasksToLocalStorage();
};

const editTask = (index) => {
    const taskItem = document.querySelectorAll(".taskItem")[index];
    const task = tasks[index];

    // Cria um campo de entrada para editar o texto da tarefa
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;
    input.className = "edit-input";

    // Adiciona a limitação de caracteres
    input.addEventListener("input", () => {
        if (input.value.length > 20) {
            alert("O máximo de caracteres permitido é 20.");
            input.value = input.value.slice(0, 20);
        }
    });

    // Cria um ícone de salvar
    const saveIcon = document.createElement("img");
    saveIcon.src = "./img/save.png"; // Certifique-se de ter um ícone de salvar na pasta img
    saveIcon.className = "save-icon";

    // Substitui o texto da tarefa pelo campo de entrada e ícone de salvar
    const taskText = taskItem.querySelector("p");
    taskText.replaceWith(input);
    taskItem.querySelector(".icons").appendChild(saveIcon);

    // Adiciona evento de clique ao ícone de salvar
    saveIcon.addEventListener("click", () => {
        task.text = input.value.trim();
        updateTasksList();
        updateStats();
        saveTasksToLocalStorage();
    });
};

const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = (completeTasks / totalTasks) * 100;
    const progressBar = document.getElementById('progress');

    progressBar.style.width = `${progress}%`;

    document.getElementById('numbers').innerText = `${completeTasks} / ${totalTasks}`;
};

const updateTasksList = (tasksToDisplay = tasks) => {
    const taskList = document.querySelector(".task-list");
    taskList.innerHTML = "";

    tasksToDisplay.forEach((task, index) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
        <div class="taskItem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}/>
                <p>${task.text}</p>
                <span class="category">${task.category}</span>
            </div>
            <div class="icons">
                <img src="./img/edit.png" class="edit-btn" data-index="${index}" />
                <img src="./img/bin.png" class="delete-btn" data-index="${index}" />
            </div>
        </div>
        `;
        listItem.querySelector(".checkbox").addEventListener("change", () => toggleTaskComplete(index));
        listItem.querySelector(".edit-btn").addEventListener("click", () => editTask(index));
        listItem.querySelector(".delete-btn").addEventListener("click", () => deleteTask(index));
        taskList.append(listItem);
    });
};

const showAllTasks = () => {
    updateTasksList(tasks);
};

const showPendingTasks = () => {
    const pendingTasks = tasks.filter(task => !task.completed);
    updateTasksList(pendingTasks);
};

const showCompletedTasks = () => {
    const completedTasks = tasks.filter(task => task.completed);
    updateTasksList(completedTasks);
};

document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();
});

document.getElementById("newTask").addEventListener("click", function (e) {
    e.preventDefault();
    addTask();
});

document.getElementById('allTasks').addEventListener('click', showAllTasks);
document.getElementById('pendingTasks').addEventListener('click', showPendingTasks);
document.getElementById('completedTasks').addEventListener('click', showCompletedTasks);

// Alterna entre os temas
document.getElementById('theme').addEventListener('change', function() {
    document.body.className = this.value;
});
