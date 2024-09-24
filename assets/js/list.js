// تحميل المهام المحفوظة من localStorage عند فتح الصفحة
window.onload = function () {
    loadTasks();
};

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        const task = {
            text: taskText,
            completed: false
        };

        const tasks = getTasksFromStorage();
        tasks.push(task);
        saveTasksToStorage(tasks);

        displayTasks();
        taskInput.value = ""; // تفريغ خانة الإدخال
    }
}

// جلب المهام من localStorage
function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// حفظ المهام إلى localStorage
function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// عرض المهام على الشاشة
function displayTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ""; // تفريغ القائمة قبل إعادة العرض

    const tasks = getTasksFromStorage();

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');

        // إنشاء مربع اختيار للتحقق
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.checked = task.completed;
        checkBox.onclick = function () {
            tasks[index].completed = checkBox.checked;
            saveTasksToStorage(tasks);
            if (checkBox.checked) {
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
            }
        };

        // إضافة النص
        const taskTextNode = document.createTextNode(task.text);

        // زر حذف
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "مسح";
        deleteButton.onclick = function () {
            tasks.splice(index, 1);
            saveTasksToStorage(tasks);
            displayTasks(); // تحديث القائمة بعد الحذف
        };

        // إضافة العناصر للمهمة
        taskItem.appendChild(checkBox);
        taskItem.appendChild(taskTextNode);
        taskItem.appendChild(deleteButton);

        // إضافة صنف "مكتملة" إذا كانت المهمة مكتملة
        if (task.completed) {
            taskItem.classList.add('completed');
        }

        // إضافة المهمة إلى القائمة
        taskList.appendChild(taskItem);
    });
}

// تحميل المهام المحفوظة عند تحميل الصفحة
function loadTasks() {
    displayTasks();
}
