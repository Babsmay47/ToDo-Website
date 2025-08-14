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



/** 
 * CUTOM SELECT 
 */

class CustomSelect {
  constructor() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    } else {
        this.init();
    }
  }

  init() {
    this.initializeCustomSelects();
    this.setupGlobalClickHandler();
  }

  initializeCustomSelects() {
    const customSelectContainers = document.querySelectorAll('.select-input');
    customSelectContainers.forEach(container => {
        this.createCustomSelect(container);
    });
  }

  createCustomSelect(container) {
    const nativeSelect = container.querySelector('select');
    if (!nativeSelect) return;

    // Check if already initialized
    if (container.querySelector('.select-selected')) return;

    const selectedDisplay = this.createSelectedDisplay(nativeSelect);
    container.appendChild(selectedDisplay);

    const optionsContainer = this.createOptionsContainer(nativeSelect, selectedDisplay);
    container.appendChild(optionsContainer);

    this.setupDisplayClickHandler(selectedDisplay, optionsContainer);
  }

  createSelectedDisplay(nativeSelect) {
    const display = document.createElement('div');
    display.className = 'select-selected';
    
    const selectedOption = nativeSelect.options[nativeSelect.selectedIndex];
    display.textContent = selectedOption.textContent;
    
    return display;
  }

  createOptionsContainer(nativeSelect, selectedDisplay) {
    const container = document.createElement('div');
    container.className = 'select-items select-hide';
    
    const options = Array.from(nativeSelect.options);
    options.forEach((option, index) => {
        if (index === 0) return; // Skip placeholder
        
        const optionElement = this.createOptionElement(option, index, nativeSelect, selectedDisplay, container);
        container.appendChild(optionElement);
    });
    
    return container;
  }

  createOptionElement(option, optionIndex, nativeSelect, selectedDisplay, optionsContainer) {
    const optionDiv = document.createElement('div');
    optionDiv.textContent = option.textContent;
    optionDiv.dataset.value = option.value;
    optionDiv.dataset.index = optionIndex;
    
    optionDiv.addEventListener('click', (event) => {
        this.handleOptionClick(event, nativeSelect, selectedDisplay, optionsContainer);
    });
    
    return optionDiv;
  }

  handleOptionClick(event, nativeSelect, selectedDisplay, optionsContainer) {
    event.stopPropagation();
    
    const clickedOption = event.target;
    const optionIndex = parseInt(clickedOption.dataset.index);
    
    // Update the native select
    nativeSelect.selectedIndex = optionIndex;
    
    // Update the display
    selectedDisplay.textContent = clickedOption.textContent;
    
    // Update selected styling
    optionsContainer.querySelectorAll('.same-as-selected')
        .forEach(element => element.classList.remove('same-as-selected'));
    
    clickedOption.classList.add('same-as-selected');
    
    // Trigger change event
    const changeEvent = new Event('change', { bubbles: true });
    nativeSelect.dispatchEvent(changeEvent);
    
    // Close the dropdown
    this.closeAllSelects();
  }

  setupDisplayClickHandler(selectedDisplay, optionsContainer) {
    selectedDisplay.addEventListener('click', (event) => {
        event.stopPropagation();
        
        // Close other selects first
        this.closeAllSelects(selectedDisplay);
        
        // Toggle this select
        optionsContainer.classList.toggle('select-hide');
        selectedDisplay.classList.toggle('select-arrow-active');
    });
  }

  closeAllSelects(excludeElement = null) {
    const allDisplays = document.querySelectorAll('.select-selected');
    const allContainers = document.querySelectorAll('.select-items');
    
    allDisplays.forEach(display => {
        if (display !== excludeElement) {
            display.classList.remove('select-arrow-active');
        }
    });
    
    allContainers.forEach(container => {
        const correspondingDisplay = container.previousElementSibling;
        
        if (excludeElement && correspondingDisplay === excludeElement) {
            return;
        }
        container.classList.add('select-hide');
    });
  }

  setupGlobalClickHandler() {
    document.addEventListener('click', () => {
      this.closeAllSelects();
    });
  }
}

// Initialize the custom select system
const customSelect = new CustomSelect();