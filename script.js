document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
    const taskTitle = document.getElementById("taskTitle");
    const taskDesc = document.getElementById("taskDesc");
    const taskDate = document.getElementById("taskDate");
    const taskPriority = document.getElementById("taskPriority");
    const taskStatus = document.getElementById("taskStatus");
    const clearFormButton = document.getElementById("clearFormBtn");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const toggleText = document.getElementById("toggle-text");
    const moonIcon = document.getElementById("moon-icon");
    const sunIcon = document.getElementById("sun-icon");
   
    const todoList = document.getElementById("todoList");
    const inProgressList = document.getElementById("inProgressList");
    const completedList = document.getElementById("completedList");


    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let editTaskId = null;


    // Set the date field to today's date by default
    const today = new Date().toISOString().split('T')[0];
    taskDate.value = today;


    // Initialize dark mode from localStorage
    initializeDarkMode();
    renderTasks();


    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!taskTitle.value.trim() || !taskDesc.value.trim() || !taskDate.value) {
            showToast("All fields are required!", "#EF4444");
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
            showToast("Task updated successfully!", "#3B82F6");
            editTaskId = null;
        }
        else {
            const newTask = {
                id: Date.now(),
                title: taskTitle.value,
                desc: taskDesc.value,
                date: taskDate.value,
                priority: taskPriority.value,
                status: taskStatus.value,
                createdAt: new Date().toISOString()
            };
           
            tasks.push(newTask);
            showToast("Task added successfully!", "#10B981");
        }


        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        resetForm();
    });


    // Function to reset form to default values
    function resetForm() {
        taskForm.reset();
        taskDate.value = today; // Reset to today's date
        taskPriority.value = "Low"; // Reset to default priority
        taskStatus.value = "To-Do"; // Reset to default status
        editTaskId = null; // Clear edit mode
        showToast("Form cleared!", "#6B7280");
    }


    // Clear form button event handler
    clearFormButton.addEventListener("click", () => {
        if (editTaskId) {
            if (confirm("Are you sure you want to discard your edits?")) {
                resetForm();
            }
        } else {
            resetForm();
        }
    });


    function renderTasks() {
        todoList.innerHTML = "";
        inProgressList.innerHTML = "";
        completedList.innerHTML = "";


        // Sort tasks by priority and due date
       const sortedTasks = [...tasks].sort((a, b) => {
            // First by status priority (to maintain columns)
            if (a.status !== b.status) return 0;
           
            // Then by priority
            const priorityValue = { "High": 0, "Medium": 1, "Low": 2 };
            if (priorityValue[a.priority] !== priorityValue[b.priority]) {
                return priorityValue[a.priority] - priorityValue[b.priority];
            }
           
            // Then by due date
            return new Date(a.date) - new Date(b.date);
        });


        // Create empty state message
        const createEmptyState = (list, message) => {
            if (list.children.length === 0) {
                const emptyState = document.createElement("div");
                emptyState.className = "text-center py-8 text-gray-500 dark:text-gray-400 italic text-sm";
                emptyState.textContent = message;
                list.appendChild(emptyState);
            }
        };
       
        sortedTasks.forEach((task) => {
            const taskItem = document.createElement("div");
            taskItem.className = "task-card";
           
            // Add different border colors based on priority
            if (task.priority === "High") {
                taskItem.classList.add("border-l-4", "border-red-500");
            } else if (task.priority === "Medium") {
                taskItem.classList.add("border-l-4", "border-yellow-500");
            } else {
                taskItem.classList.add("border-l-4", "border-green-500");
            }
           
            // Check if task is overdue
            const isOverdue = new Date(task.date) < new Date().setHours(0, 0, 0, 0) && task.status !== "Completed";
           
            taskItem.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg">${task.title}</h3>
                    ${isOverdue ? '<span class="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full">Overdue</span>' : ''}
                </div>
                <p class="mb-3 text-sm text-gray-600 dark:text-gray-300">${task.desc}</p>
                <div class="flex flex-wrap gap-2 text-xs mb-3">
                    <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">Due: ${formatDate(task.date)}</span>
                    <span class="px-2 py-1 ${getPriorityClass(task.priority)} rounded-full">${task.priority}</span>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button onclick="editTask(${task.id})" class="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>
                    <button onclick="deleteTask(${task.id})" class="text-xs px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>
                </div>
            `;


            if (task.status === "To-Do") todoList.appendChild(taskItem);
            else if (task.status === "In Progress") inProgressList.appendChild(taskItem);
            else completedList.appendChild(taskItem);
        });
       
        // Add empty states if needed
        createEmptyState(todoList, "No todo tasks yet");
        createEmptyState(inProgressList, "No tasks in progress");
        createEmptyState(completedList, "No completed tasks");
    }


    function getPriorityClass(priority) {
        switch(priority) {
            case "High":
                return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
            case "Medium":
                return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
            default:
                return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100";
        }
    }


    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }


    window.deleteTask = (id) => {
        if (confirm("Are you sure you want to delete this task?")) {
            tasks = tasks.filter((t) => t.id !== id);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
            showToast("Task deleted!", "#F97316");
        }
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
        showToast("Editing task...", "#3B82F6");
       
        // Scroll to form
        document.querySelector('section').scrollIntoView({ behavior: 'smooth' });
    };


    darkModeToggle.addEventListener("click", toggleDarkMode);


    function toggleDarkMode() {
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "disabled");
            toggleText.textContent = "Light Mode";
            moonIcon.classList.add("hidden");
            sunIcon.classList.remove("hidden");
            showToast("Light Mode Enabled", "#60A5FA");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "enabled");
            toggleText.textContent = "Dark Mode";
            moonIcon.classList.remove("hidden");
            sunIcon.classList.add("hidden");
            showToast("Dark Mode Enabled", "#1F2937");
        }
    }


    function initializeDarkMode() {
        // Check for user preference
        const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedMode = localStorage.getItem("darkMode");
       
        // Apply dark mode if saved or if user prefers dark
        if (savedMode === "enabled" || (savedMode === null && userPrefersDark)) {
            document.documentElement.classList.add("dark");
            toggleText.textContent = "Dark Mode";
            moonIcon.classList.remove("hidden");
            sunIcon.classList.add("hidden");
        }
    }


    function showToast(message, bgColor) {
        Toastify({
            text: message,
            backgroundColor: bgColor,
            duration: 3000,
            position: "center",
            gravity: "top",
            close: true,
            className: "rounded-md shadow-md",
            stopOnFocus: true
        }).showToast();
    }
   
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        const newColorScheme = event.matches ? "dark" : "light";
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem("darkMode")) {
            if (newColorScheme === "dark") {
                document.documentElement.classList.add("dark");
                toggleText.textContent = "Dark Mode";
                moonIcon.classList.remove("hidden");
                sunIcon.classList.add("hidden");
            } else {
                document.documentElement.classList.remove("dark");
                toggleText.textContent = "Light Mode";
                moonIcon.classList.add("hidden");
                sunIcon.classList.remove("hidden");
            }
        }
    });
});
