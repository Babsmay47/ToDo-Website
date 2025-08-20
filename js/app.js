
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

let tasks = [];


const addTodo = function() {
  const inputElement = document.querySelector('[data-task-input-field]');
  const catgorySelectElement = document.querySelector('[data-category]');
  const prioritySelectElement = document.querySelector('[data-priority]');
  const dueDateElement = document.querySelector('[data-due-date-input]');
  const taskName = inputElement.value;
  const taskCategory = catgorySelectElement.value;
  const taskPriority = prioritySelectElement.value;
  const dueDate = dueDateElement.value;

  const uniqueId = module.generateUniqueId();

  if(taskName === ''){
    alert('please fill out...');
  }

  const task = {
    id: uniqueId,
    text: taskName,
    completed: false,
    priority: taskPriority,
    dueDate: dueDate,
    category: taskCategory,
    createdAt: Date.now()
  }

  tasks.unshift(task);

  inputElement.value = '';
  renderTodo();
  console.log(dueDate);
  console.log(tasks);
}

function renderTodo() {
  const activeTasksContainer = document.querySelector('[data-active-tasks] .task-list');

  activeTasksContainer.innerHTML = '';

  tasks.forEach(task => {
    const taskElement = document.createElement('div');

    taskElement.classList.add('task-card')

    taskElement.innerHTML = `
      <div class="task-header">
        <input type="checkbox" name="task-checkbox" id="task-checkbox" class="task-checkbox" data-completed-checkbox>
        <h4 class="task-title">
          ${task.text}
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

    completedBtn.addEventListener('click', toggleTaskCompleted(task.id));
    deleteBtn.addEventListener('click', toggleTaskCompleted(task.id));
    editBtn.addEventListener('click', toggleTaskCompleted(task.id));

    activeTasksContainer.appendChild(taskElement);
  });

}

document.querySelector('.add-task-btn').addEventListener('click', (e) => {
  addTodo();
  e.preventDefault();
  console.log('Reload prevented!');
});
