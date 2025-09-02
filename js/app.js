
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
  const dueDateDisplay = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';

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
  // updateTaskCounter();
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

function calculateTaskStats(){
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = tasks.filter(task => !task.completed).length;
  const overdue = 0;
  const today = 0;
  const work = 0;
  const personal = 0;
  const shopping = 0;
  const high = 0;
  const mid = 0;
  const low = 0;

  console.log('Task Stats:', total, completed, active, overdue);
  return { total, completed, active, overdue, today, work, personal, shopping, high, mid, low };
}

function updateTaskCounter() {
  const stats = calculateTaskStats();

  const totalElements = document.querySelectorAll('[data-total-tasks-count]');
  const completedElements = document.querySelectorAll('[data-completed-tasks-count]');
  const activeElements = document.querySelectorAll('[data-active-tasks-count]');
  const overdueElements = document.querySelectorAll('[data-overdue-tasks-count]');
  const highPriorityElement = document.querySelector('[data-high-prior-count]');
  const midPriorityElement = document.querySelector('[data-mid-prior-count]');
  const lowPriorityElement = document.querySelector('[data-low-prior-count]');
  const todayElement = document.querySelector('[data-today-count]');
  const workElement = document.querySelector('[data-work-count]');
  const personalElement = document.querySelector('[data-personal-count]');
  const shoppingElement = document.querySelector('[data-shopping-count]');

  if(totalElements) {
    totalElements.forEach(totalElement => {
      totalElement.textContent = stats.total;
    });
  }

  if(completedElements) {
    completedElements.forEach(completedElement => {
      completedElement.textContent = stats.completed;
      if(stats.completed > 0){
        completedElement.classList.add('success');
      }
    });
  }

  if(activeElements) {
    activeElements.forEach(activeElement => {
      activeElement.textContent = stats.active;
    });
    
  }

  if(overdueElements) {
    overdueElements.forEach(overdueElement => {
      overdueElement.textContent = stats.overdue;
      if(stats.overdue > 0){
        overdueElement.classList.add('danger');
      }
    });
  }

  todayElement.textContent = stats.today;
  highPriorityElement.textContent = stats.high;
  midPriorityElement.textContent = stats.mid;
  lowPriorityElement.textContent = stats.low;
  workElement.textContent = stats.work;
  personalElement.textContent = stats.personal;
  shoppingElement.textContent = stats.shopping;

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