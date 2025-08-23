
import { customSelect } from "./Utils/custom-select.js";
import * as module from './Utils/module.js'


/**
 * MODAL OVERLAY SHOW AND HIDE
 */

/*
const modalOpenBtn = document.querySelector('[data-modal-open]');
const modalCloseBtn = document.querySelectorAll('[data-modal-close]');
const modalOverlay = document.querySelector('[data-modal-overlay]');

const openModalOverlay = function() {
  modalOverlay.classList.add('show');
}

const closeModalOverlay = function() {
  modalOverlay.classList.remove('show');
}

modalOpenBtn.addEventListener('click', openModalOverlay);
modalCloseBtn.forEach( closeBtn => {
  closeBtn.addEventListener('click', closeModalOverlay);
});

*/

/**
 * FILTER ITEMS INTERACTION
 */

const filterItems = document.querySelectorAll('.filter-item');

filterItems.forEach( filterItem => {
  filterItem.addEventListener('click', function() {
    filterItems.forEach(i => { 
      i.classList.remove('filter-active')
    });
    this.classList.add('filter-active');
  });
});



// const task = {
//   id: uniqueIdentifier,
//   text: description,
//   completed: true,
//   priority: high,
//   dueDate: date,
//   category: x,
//   createdAt: time
// }

const tasks = JSON.parse(localStorage.getItem('ToDoList')) || [];

renderTodo();

function renderTodo() {
  const tasksContainer = document.querySelector('[data-active-tasks]');

  tasksContainer.innerHTML = '';

  if(tasks.length === 0){
    tasksContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fa-solid fa-clipboard-list"></i>
        </div>
        <h4 class="title-4 empty-title">No Active Tasks</h4>
        <span>Add your first task to get started</span>
      </div>
    `
    return;
  }

  tasks.forEach(task => {
    const taskElement = document.createElement('div');

    taskElement.classList.add('task-card');

    
    taskElement.innerHTML = `
      <div class="task-header">
        <input type="checkbox" name="task-checkbox" id="task-checkbox" class="task-checkbox" onclick="toggleTaskComplete(${task.id});" data-completed-checkbox>
        <h4 class="task-title">
          ${task.title}
        </h4>
      </div>

      <div class="task-footer">
        <div class="task-meta">
          <div class="priority-dot priority-${task.priority}"></div>
          <span class="task-category">${task.category}</span>
          <span class="task-date">${task.dueDate}</span>
        </div>
        <div class="task-actions">
          <button class="task-edit-btn" data-task-edit-btn>
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="task-delete-btn" data-task-delete-btn>
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    ` 
    
    const completedBtn = document.querySelector('[data-completed-checkbox]');
    const deleteBtn = document.querySelector('[data-task-delete-btn]');
    const editBtn = document.querySelector('[data-task-edit-btn]');

    // completedBtn.addEventListener('click', toggleTaskComplete(task.id));
    // deleteBtn.addEventListener('click', toggleTaskComplete(task.id));
    // editBtn.addEventListener('click', toggleTaskComplete(task.id));

    tasksContainer.appendChild(taskElement);
    // renderTodo();
    saveToStorage();
  });

}

function addTodo() {
  const inputElement = document.querySelector('[data-task-input-field]');
  const catgorySelectElement = document.querySelector('[data-category]');
  const prioritySelectElement = document.querySelector('[data-priority]');
  const dueDateElement = document.querySelector('[data-due-date-input]');
  const taskTitle = inputElement.value;
  const taskCategory = catgorySelectElement.value;
  const taskPriority = prioritySelectElement.value;
  const dueDate = dueDateElement.value;
  const uniqueId = module.generateUniqueId();

  if (!taskTitle.trim()) return;

  const task = {
    id: uniqueId,
    title: taskTitle,
    completed: false,
    priority: taskPriority,
    dueDate: dueDate,
    category: taskCategory,
    createdAt: Date.now()
  }

  tasks.unshift(task);

  inputElement.value = '';
  renderTodo();
  saveToStorage();
  console.log(dueDate);
  console.log(tasks);
}

function toggleTaskComplete(id) {
  const task = tasks.find(t => t.id === id);

  if(task) {
    task.completed = !task.completed;

    // renderTodo();
    saveToStorage();
  }
}




document.querySelector('.add-task-btn').addEventListener('click', (e) => {
  addTodo();
  e.preventDefault();
  console.log('Reload prevented!');
});

function saveToStorage() {
  localStorage.setItem('ToDoList', JSON.stringify(tasks));
}

console.log(tasks);