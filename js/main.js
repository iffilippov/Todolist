document.getElementById("year").innerHTML = new Date().getFullYear();

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

getFromLocalStorage()
checkEmptyList();
checkAllTaskCompleted();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', completedTask);

function addTask(event) {
	event.preventDefault();

	const taskText = taskInput.value;
	const newTask = {
		id: Date.now(),
		text: taskText,
		completed: false,
	};

	tasks.push(newTask);
	saveToLocalStorage();
	renderTask(newTask);
	taskInput.value = '';
	taskInput.focus();
	checkEmptyList();
	checkAllTaskCompleted();
}

function deleteTask(event) {
	if (event.target.dataset.action !== 'delete') return;

	const parentNode = event.target.closest('.list-group-item');
	const id = Number(parentNode.id);
	const taskCompletedHTML = document.getElementById('completedTask');

	tasks = tasks.filter((task) => task.id !== id);
	saveToLocalStorage();
	parentNode.remove();
	
	if (taskCompletedHTML == null || tasks.length === 0) {
		checkAllTaskCompleted();
	}

	checkEmptyList();
}

function completedTask(event) {
	if (event.target.dataset.action !== 'completed') return;

	const parentNode = event.target.closest('.list-group-item');
	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	const taskTitle = parentNode.querySelector('.task-title');

	task.completed = !task.completed;

	saveToLocalStorage();
	
	taskTitle.classList.toggle('task-title--completed');

	checkAllTaskCompleted();
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./static/img/task_list.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Любимый список задач - пустой список задач.</div>
				</li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListElement = document.querySelector('#emptyList');
		emptyListElement ? emptyListElement.remove() : null;
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function getFromLocalStorage() {
	if (localStorage.getItem('tasks')) {
		tasks = JSON.parse(localStorage.getItem('tasks'));
		tasks.forEach((task) => renderTask(task));
	}
}

function renderTask(task) {
	const cssClass = task.completed ? 'task-title task-title--completed' : 'task-title';
	const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="completed" class="btn-action">
							<img src="./static/img/tick.svg" alt="Completed" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./static/img/cross.svg" alt="Completed" width="18" height="18">
						</button>
					</div>
				</li>`;

	tasksList.insertAdjacentHTML('beforeend', taskHTML);	
}

function checkAllTaskCompleted() {
	const taskCompletedHTML = document.getElementById('completedTask');

	let everythingCompletedCounter = 0;
	
	tasks.forEach(function(task) {
		if (task.completed == true) {
 			everythingCompletedCounter++;
		}
	})
	
	if (taskCompletedHTML == null && everythingCompletedCounter === tasks.length && everythingCompletedCounter !== 0) {
		const allTasksCompletedHTML = `<li id="completedTask" class="list-group-item empty-list">
						<img src="./static/img/completed.svg" alt="Empty" width="48" class="mt-3">
						<div class="empty-list__title">Все задачи выполнены!</div>
					</li>`;
		tasksList.insertAdjacentHTML('beforeend', allTasksCompletedHTML);
	} else {
		if (taskCompletedHTML != null) {
			taskCompletedHTML.remove();
		}		
	}
}
