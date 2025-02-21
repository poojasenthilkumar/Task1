document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
    const taskTitle = document.getElementById("taskTitle");
    const taskDesc = document.getElementById("taskDesc");
    const taskDate = document.getElementById("taskDate");
    const taskPriority = document.getElementById("taskPriority");
    const taskStatus = document.getElementById("taskStatus");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const rootElement = document.documentElement;

    const todoList = document.getElementById("todoList");
    const inProgressList = document.getElementById("inProgressList");
    const completedList = document.getElementById("completedList");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let editTaskId = null;

    applyDarkModePreference();
    renderTasks();

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!taskTitle.value.trim() || !taskDesc.value.trim() || !taskDate.value) {
            showToast("All fields are required!", "red");
            return;
        }

        if (editTaskId) {
            tasks = tasks.map(task => task.id === editTaskId ? {
                ...task,
                title: taskTitle.value,
                desc: taskDesc.value,
                date: taskDate.value,
                priority: taskPriority.value,
                status: taskStatus.value
            } : task);
            showToast("Task updated successfully!", "blue");
            editTaskId = null;
        } else {
            const newTask = {
                id: Date.now(),
                title: taskTitle.value,
                desc: taskDesc.value,
                date: taskDate.value,
                priority: taskPriority.value,
                status: taskStatus.value,
            };
            tasks.push(newTask);
            showToast("Task added successfully!", "green");
        }

        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        taskForm.reset();
    });

    darkModeToggle.addEventListener("click", () => {
        rootElement.classList.toggle("dark");
        localStorage.setItem("darkMode", rootElement.classList.contains("dark") ? "enabled" : "disabled");
    });

    function renderTasks() {
        todoList.innerHTML = "";
        inProgressList.innerHTML = "";
        completedList.innerHTML = "";

        tasks.forEach((task) => {
            const taskItem = document.createElement("div");
            taskItem.className = "task-card";
            taskItem.innerHTML = `
                <h3 class="font-bold">${task.title}</h3>
                <p>${task.desc}</p>
                <p class="text-sm">Due: ${task.date} | Priority: ${task.priority} | Status: ${task.status}</p>
                <button onclick="editTask(${task.id})" class="text-blue-500">Edit</button>
                <button onclick="viewTask(${task.id})" class="text-green-500">View</button>
                <button onclick="deleteTask(${task.id})" class="text-red-500">Delete</button>
            `;

            if (task.status === "To-Do") todoList.appendChild(taskItem);
            else if (task.status === "In Progress") inProgressList.appendChild(taskItem);
            else completedList.appendChild(taskItem);
        });
    }

    window.deleteTask = (id) => {
        tasks = tasks.filter((t) => t.id !== id);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        showToast("Task deleted!", "orange");
    };

    window.editTask = (id) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;
        taskTitle.value = task.title;
        taskDesc.value = task.desc;
        taskDate.value = task.date;
        taskPriority.value = task.priority;
        taskStatus.value = task.status;
        editTaskId = id;
        showToast("Editing task...", "blue");
    };

    window.viewTask = (id) => {
        const task = tasks.find((t) => t.id === id);
        if (task) {
            alert(`Title: ${task.title}\nDescription: ${task.desc}\nDue: ${task.date}\nPriority: ${task.priority}\nStatus: ${task.status}`);
        }
    };

    function showToast(message, bgColor) {
        Toastify({
            text: message,
            backgroundColor: bgColor,
            duration: 3000,
        }).showToast();
    }

    function applyDarkModePreference() {
        if (localStorage.getItem("darkMode") === "enabled") {
            rootElement.classList.add("dark");
        }
    }
});
