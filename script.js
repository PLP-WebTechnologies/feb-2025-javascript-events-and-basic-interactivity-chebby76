// Initialize state
const state = {
  activeTab: 'form',
  theme: 'purple',
  currentImageIndex: 0,
  events: []
};

// Image gallery data
const images = [
  {
    url: "pic3.jpeg",
    caption: "walter white and jesse after work"
  },
  {
    url:"pic1.jpeg",
    caption: "Jesse and jane hallowene pictures"
  },
  {
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    caption: "Mountain Range"
  }
];

// Initialize after DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const themeButton = document.getElementById('themeButton');
  const form = document.getElementById('simpleForm');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const formSuccess = document.getElementById('form-success');
  const resetFormButton = document.getElementById('resetForm');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const currentImage = document.getElementById('currentImage');
  const imageCaption = document.getElementById('imageCaption');
  const logEntries = document.getElementById('logEntries');

  // Setup event listeners
  
  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Theme switching
  themeButton.addEventListener('click', changeTheme);
  
  // Form handling
  form.addEventListener('submit', handleFormSubmit);
  usernameInput.addEventListener('input', validateInput);
  emailInput.addEventListener('input', validateInput);
  resetFormButton.addEventListener('click', resetForm);

  // Gallery navigation
  prevButton.addEventListener('click', showPreviousImage);
  nextButton.addEventListener('click', showNextImage);

  // Secret feature - double click on theme button
  themeButton.addEventListener('dblclick', () => {
    logEvent('secret', 'Secret feature activated!');
    alert('🎉 You found a secret feature!');
  });

  // Log initial event
  logEvent('system', 'Application initialized');

  // Functions
  
  // Switch between tabs
  function switchTab(tabId) {
    // Update active tab button
    tabButtons.forEach(button => {
      if (button.getAttribute('data-tab') === tabId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });

    // Update active tab panel
    tabPanels.forEach(panel => {
      if (panel.id === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    state.activeTab = tabId;
    logEvent('navigation', `Switched to ${tabId} tab`);
  }

  // Change color theme
  function changeTheme() {
    const themes = ['purple', 'blue', 'orange'];
    const currentIndex = themes.indexOf(state.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    state.theme = themes[nextIndex];

    document.body.classList.remove('blue-theme', 'orange-theme');
    if (state.theme !== 'purple') {
      document.body.classList.add(`${state.theme}-theme`);
    }

    logEvent('theme', `Changed theme to ${state.theme}`);
  }

  // Form validation and submission
  function validateInput(e) {
    const input = e.target;
    const field = input.id;
    const value = input.value;
    const errorElement = document.getElementById(`${field}-error`);
    
    let isValid = true;
    let errorMessage = '';

    if (field === 'username') {
      if (value.trim() === '') {
        isValid = false;
        errorMessage = 'Username is required';
      } else if (value.length < 3) {
        isValid = false;
        errorMessage = 'Username must be at least 3 characters';
      }
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.trim() === '') {
        isValid = false;
        errorMessage = 'Email is required';
      } else if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email';
      }
    } else if(field === 'password') {
      if (value.trim() === '') {
        isValid = false;
        errorMessage = 'password is required';
      } else if (value.length < 6) {
        isValid = false;
        errorMessage = 'Username must be at least 6 characters';
      }  
    }

    errorElement.textContent = errorMessage;
    
    if (value) {
      if (isValid) {
        input.style.borderColor = '#22c55e';
      } else {
        input.style.borderColor = '#e11d48';
      }
    } else {
      input.style.borderColor = '#ddd';
    }

    return isValid;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    
    const usernameValid = validateInput({ target: usernameInput });
    const emailValid = validateInput({ target: emailInput });
    
    if (usernameValid && emailValid && password) {
      form.style.display = 'none';
      formSuccess.style.display = 'block';
      logEvent('form', 'Form submitted successfully');
    } else {
      logEvent('form', 'Form submission failed - validation errors');
    }
  }

  function resetForm() {
    usernameInput.value = '';
    emailInput.value = '';
    document.getElementById('username-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    usernameInput.style.borderColor = '#ddd';
    emailInput.style.borderColor = '#ddd';
    passwordInput.style.borderColor = '#ddd';

    form.style.display = 'block';
    formSuccess.style.display = 'none';
    logEvent('form', 'Form reset');
  }

  // Gallery navigation
  function updateGalleryImage() {
    const image = images[state.currentImageIndex];
    currentImage.src = image.url;
    imageCaption.textContent = image.caption;
  }

  function showNextImage() {
    state.currentImageIndex = (state.currentImageIndex + 1) % images.length;
    updateGalleryImage();
    logEvent('gallery', `Showing image ${state.currentImageIndex + 1}`);
  }

  function showPreviousImage() {
    state.currentImageIndex = (state.currentImageIndex - 1 + images.length) % images.length;
    updateGalleryImage();
    logEvent('gallery', `Showing image ${state.currentImageIndex + 1}`);
  }

  // Event logging
  function logEvent(type, message) {
    const event = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    };
    
    state.events.unshift(event);
    if (state.events.length > 20) state.events.pop();
    
    updateEventLog();
  }

  function updateEventLog() {
    logEntries.innerHTML = state.events.map(event => `
      <div class="log-entry">
        <strong>${event.type}:</strong> ${event.message}
        <small>(${formatTime(event.timestamp)})</small>
      </div>
    `).join('');
  }  function formatTime(date) {
    return date.toLocaleTimeString();
  }
});


