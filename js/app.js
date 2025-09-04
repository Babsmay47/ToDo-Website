
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
const clearAllCompletedBtn = document.querySelector('[data-clear-completed]');

function renderTasks() {
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const activeContainer = document.querySelector('[data-active-tasks]');
  const completedContainer = document.querySelector('[data-completed-tasks]');

  activeContainer.innerHTML = '';
  completedContainer.innerHTML = '';

  const activeEmpty = `
    <div class="empty-state">
      <div class="empty-icon">
        <i class="fa-solid fa-clipboard-list"></i>
      </div>
      <h4 class="title-4 empty-title">No Active Tasks</h4>
      <span>Add your first task to get started</span>
    </div>
  `;
  const completedEmpty = `
    <div class="empty-state">
      <div class="empty-icon">
        <i class="fa-solid fa-clipboard-check"></i>
      </div>
      <h4 class="title-4 empty-title">No Completed Tasks</h4>
      <span>Complete tasks to see them here</span>
    </div>
  `;

  console.log(`found ${activeTasks.length} active tasks and ${completedTasks.length} completed tasks`);

  // const activeTasksHTML = activeTasks.length === 0 ? activeEmpty : activeTasks.map(task => createTaskHTML(task)).join('');
  // const completedTasksHTML = completedTasks.length === 0 ? completedEmpty : completedTasks.map(task => createTaskHTML(task)).join('');

  if(activeTasks.length === 0){
    activeContainer.innerHTML = activeEmpty;
  } else{
    activeTasks.forEach(task => {
      const activeHTML = createTaskHTML(task);
      activeContainer.appendChild(activeHTML)
    });
  }


  if(completedTasks.length === 0){
    completedContainer.innerHTML = completedEmpty;
  } else{
    completedTasks.forEach(task => {
      const completedHTML = createTaskHTML(task);
      completedContainer.appendChild(completedHTML);
    });
  }

  updateTaskCounter();
  attachEventListeners();
}

function createTaskHTML(task) {
  // Format due date for display
  const options = { year: 'numeric', month: 'Short', day: 'numeric'};
  const dueDateDisplay = task.dueDate ? formatDate(task.dueDate) : '';

  // Check if task is overdue
  const isOverdue = task.dueDate && task.dueDate < new Date() && !task.completed;

  const taskDiv = document.createElement('div');
  taskDiv.className = `task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
  taskDiv.setAttribute('data-task-id', task.id);
  

  taskDiv.innerHTML = `
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
  `;

  return taskDiv;
}

function attachEventListeners() {
  
  //the simple approach of addding event listeners
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
      console.log('Delete button clicked!');
      const taskId = this.getAttribute('data-task-id');
      deleteTask(taskId);
    });
  });
  // console.log('Attaching listeners to', document.querySelectorAll('.task-delete-btn').length, 'delete buttons');
}

function addTask() {
  const taskTitle = taskInputElement.value.trim();
  const taskCategory = catgorySelectElement?.value || 'personal';
  const taskPriority = prioritySelectElement?.value || 'medium';
  const dueDateValue = dueDateElement?.value;
  const uniqueId = module.generateUniqueId();

  const dueDate = dueDateValue ? dueDateValue : null;

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
  updateTaskCounter();
  saveToStorage();
  showToast('Task added sucessfully', 'success');
  console.log('All tasks:',tasks);
}

function toggleTaskComplete(taskId) {
  const task = tasks.find(task => task.id === taskId);

  if(!task) {
    console.log('error Task not found');
    return;
  }

  task.completed = !task.completed;

  /*
  if(task.completed) {
    task.completedAt = Date.now();
    console.log(`task completed at ${completedAt.toLocaleString()}`);
  }else{
    task.completedAt = null;
    console.log('task marked as active again');
  }
  */

  renderTasks();
  updateTaskCounter();
  saveToStorage();

  showToast(task.completed ? 
    `✅ "${task.title}" completed!` : 
    `🔄 "${task.title}" Task reopened`, 'success'
  );
}

function deleteTask(taskId) {
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if(taskIndex !== -1){
    tasks.splice(taskIndex, 1);
  }

  renderTasks();
  // updateTaskCounter();
  showToast('Task deleted', 'info');
  saveToStorage();
}

function isOverdue(task){
  if(task.dueDate){
    const today = new Date().toDateString();
    const due = new Date(task.dueDate).toDateString();

    if (due < today && !task.completed) return true;
  }
}

function isDueToday(task){
  const today = new Date().toDateString();
  const date = new Date(task.dueDate).toDateString();

  if(date === today) return true;
}

function formatDate(dateString){
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if(diffDays === 1) return 'Tomorrow';
  if(diffDays === -1) return 'Yesterday';
  if(diffDays > 1 && diffDays <= 7) return `${diffDays} days`;
  if(diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
}

function calculateTaskStats(){
  let total = tasks.length;
  let completed = 0, active = 0, overdue = 0, today = 0;
  let work = 0, personal = 0, shopping = 0, health = 0;
  let high = 0, mid = 0, low = 0;
  
  const now = new Date().toDateString();

  for (const task of tasks){
    if(task.completed) completed++;
    else active++;

    // Without using function
    // if(task.dueDate) {
    //   const due = new Date(task.dueDate).toDateString();
    //   if(due < now && !task.completed) overdue++;
    //   if(due === now) today++;
    // }
    if(isOverdue(task)) overdue++;
    if(isDueToday(task)) today++; 

    switch (task.category) {
      case 'work': work++; break;
      case 'personal': personal++; break;
      case 'shopping' : shopping++; break;
      case 'health': health++; break;
    }

    switch(task.priority) {
      case 'high': high++; break;
      case 'medium': mid++; break;
      case 'low': low++; break;
    }
  }

  console.log('Task Stats:', total, completed, active, overdue);
  return { total, completed, active, overdue, today, work, personal, shopping,health, high, mid, low };
}

function updateTaskCounter() {
  const stats = calculateTaskStats();

  const mappings = {
    total: '[data-total-tasks-count]',
    completed: '[data-completed-tasks-count]',
    active: '[data-active-tasks-count]',
    overdue: '[data-overdue-tasks-count]',
    today: '[data-today-count]',
    work: '[data-work-count]',
    personal: '[data-personal-count]',
    shopping: '[data-shopping-count]',
    health: '[data-health-count]',
    high: '[data-high-prior-count]',
    mid: '[data-mid-prior-count]',
    low: '[data-low-prior-count]'
  }

  Object.entries(mappings).forEach(([key, selector]) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.textContent = stats[key];
    });
  });

  const overdueElements = document.querySelectorAll(mappings.overdue);
  if(overdueElements) {
    overdueElements.forEach(overdueElement => {
      if(stats.overdue > 0){
        overdueElement.classList.add('danger');
      } else {
        overdueElement.classList.remove('danger');
      }
    });
  }

  console.log('Counters updated successfully');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 2rem;
    right: 2rem;
    max-width: 30rem;
    background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : type === 'warning' ? 'var(--warning-color)' : 'var(--info-color)'};
    color: var(--text-white);
    padding: 1.2rem 2rem;
    font-size: 2rem;
    font-weight: 500;
    border-radius: 8px;
    transform: translateX(100%);
    z-index: 100;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    word-wrap: break-word;
    transition: all 300ms ease;
    opacity: 0;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function clearAllCompletedTasks(){
  console.log("Function called!");  
  const completedCount = tasks.filter(task => task.completed).length;
  if (completedCount === 0) {
      alert("No completed tasks to clear!");
      return;
  }

  const confirmMessage = `Are you sure you want to clear ${completedCount} completed task${completedCount === 1 ? '' : 's'}?`;

  if(confirm(confirmMessage)){ 
    for(let i = tasks.length - 1; i >= 0; i--){
      if(tasks[i].completed) {
        tasks.splice(i, 1);
      }
    }
    
    showToast(`Successfully cleared ${completedCount} completed tasks!`, 'success');

    renderTasks();
    updateTaskCounter();
    saveToStorage();
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

  // Clear All Completed
  clearAllCompletedBtn.addEventListener('click', clearAllCompletedTasks);
  
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
calculateTaskStats();