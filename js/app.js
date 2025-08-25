
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


const tasks = JSON.parse(localStorage.getItem('ToDoList')) || [];

const taskInputElement = document.querySelector('[data-task-input-field]');
const addTaskBtn = document.querySelector('.add-task-btn');
const catgorySelectElement = document.querySelector('[data-category]');
const prioritySelectElement = document.querySelector('[data-priority]');
const dueDateElement = document.querySelector('[data-due-date-input]');

function renderTasks() {
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

  const tasksHTML = tasks.map(task => createTaskHTML(task)).join('');

  tasksContainer.innerHTML = tasksHTML;

  attachEventListeners();
}

function createTaskHTML(task) {
  // Format due date for display
  const dueDateDisplay = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';

  // Check if task is overdue
  const isOverdue = task.dueDate && task.dueDate < new Date() && !task.completed;

  return `
    <div class="task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" data-task-id="${task.id}">
      <div class="task-header">
        <input type="checkbox" name="task-checkbox" id="task-checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-task-id="${task.id}">
        <h4 class="task-title ${task.completed ? 'crossed-out' : ''}">
          ${task.title}
        </h4>
      </div>

      <div class="task-footer">
        <div class="task-meta">
          <div class="priority-dot priority-${task.priority}"></div>
          <span class="task-category">${task.category}</span>
          <span class="task-date">${dueDateDisplay}</span>
        </div>
        <div class="task-actions">
          <button class="task-edit-btn" data-task-id="${task.id}">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="task-delete-btn" data-task-id="${task.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `
}

function attachEventListeners() {
  // Checkbox
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const taskId = this.getAttribute('data-task-id');
      toggleTaskComplete(taskId);
    });
  });

  // Delete Button
  document.querySelectorAll('.task-delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const taskId = this.getAttribute('data-task-id');
      deleteTask(taskId);
    });
  });
}

function addTask() {
  const taskTitle = taskInputElement.value.trim();
  const taskCategory = catgorySelectElement?.value || 'Personal';
  const taskPriority = prioritySelectElement?.value || 'medium';
  const dueDateValue = dueDateElement?.value;
  const uniqueId = module.generateUniqueId();

  const dueDate = dueDateValue ? new Date(dueDateValue) : null;

  if (!taskTitle.trim()) {
    alert('Please enter a text');
    return;
  };

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

  taskInputElement.value = '';


  renderTasks();
  // updateTaskCounter();
  saveToStorage();
  console.log('task added sucessfully', task);
  console.log('All tasks:',tasks);
}

function toggleTaskComplete(taskId) {
  const task = tasks.find(task => task.id === taskId);

  if(task) {
    task.completed = !task.completed;

    renderTasks();
    // updateTaskCounter();
    saveToStorage();
  }
}

function deleteTask(taskId) {
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if(taskIndex !== -1){
    tasks.splice(taskIndex, 1);
  }

  renderTasks();
  // updateTaskCounter();
  saveToStorage();
}

function updateTaskCounter() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const remaining = total - completed;

  if(taskCounter) {
    taskCounter.textContent = `${remaining} of ${total} tasks remaining`;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  addTaskBtn.addEventListener('click', (e) => {
    addTask();
    e.preventDefault();
  });

  taskInputElement.addEventListener('keypress', function(e) {
    if(e.key === 'Enter'){
      addTask();
      e.preventDefault();
    }
  });
  
  // Initial render (will show empty state)
  renderTasks();
  // updateTaskCounter();
  
  console.log('Todo app initialized!');
});

/*
document.querySelector('.add-task-btn').addEventListener('click', (e) => {
  addTask();
  e.preventDefault();
  console.log('Reload prevented!');
});
*/

function saveToStorage() {
  localStorage.setItem('ToDoList', JSON.stringify(tasks));
}

console.log(tasks);