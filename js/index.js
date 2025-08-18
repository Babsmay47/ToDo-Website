
import { customSelect } from "./Utils/custom-select.js";


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

// const filterItems = document.querySelectorAll('.filter-item');

// filterItems.forEach( filterItem => {
//   filterItem.addEventListener('click', function() {
//     filterItems.forEach(i => { 
//       i.classList.remove('filter-active')
//     });
//     this.classList.add('filter-active');
//   });
// });

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
  const taskName = inputElement.value;


  console.log(taskName);
}

document.querySelector('.add-task-btn').addEventListener('click', addTodo);
console.log('mayour1');