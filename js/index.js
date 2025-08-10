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
    this.setupDemoEventListeners();
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

  setupDemoEventListeners() {
    // Demo functionality - show selected values
    const selects = document.querySelectorAll('.custom-select select');
    const resultDiv = document.getElementById('result');
    
    selects.forEach(select => {
        select.addEventListener('change', () => {
            this.updateResult();
        });
    });
  }

  updateResult() {
    const countrySelect = document.getElementById('country-select');
    const colorSelect = document.getElementById('color-select');
    const sizeSelect = document.getElementById('size-select');
    const resultDiv = document.getElementById('result');
    
    const results = [];
    if (countrySelect.value) results.push(`Country: ${countrySelect.options[countrySelect.selectedIndex].text}`);
    if (colorSelect.value) results.push(`Color: ${colorSelect.options[colorSelect.selectedIndex].text}`);
    if (sizeSelect.value) results.push(`Size: ${sizeSelect.options[sizeSelect.selectedIndex].text}`);
    
    resultDiv.innerHTML = results.length ? results.join('<br>') : 'Selected values will appear here...';
  }
}

// Initialize the custom select system
const customSelect = new CustomSelect();