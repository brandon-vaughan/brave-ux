/**
 * BRAVE UX APP
 * @author  Brandon Vaughan
 *
 */

(function() {

  'use strict';

  /**
   * Helpers
   */

  // Toggle classList polyfill for IE9 lameness
  const Classes = {
    toggle: function toggleClass(el, className) {
      if (el.classList) {
        return el.classList.toggle(className);
      }
      // For IE9 we need to update class string
      let classes = el.className.split(' ');
      let index = classes.indexOf(className);
      if (index === -1) {
        classes.push(className);
      }
      else {
        classes.splice(index, 1);
      }
      // put humpty dumpty back together
      el.className = classes.join(' ');
    },

    add: function addClass(el, className) {
      if (el.classList) {
        return el.classList.add(className);
      }
      el.className += ' ' + className;
    },

    remove: function removeClass(el, className) {
      if (el.classList) {
        return el.classList.remove(className);
      }
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }


  /**
   * Menu Class
   * Manage the expand and collapse of a hidden menu.
   */

  class Menu {
    constructor(options) {

      // First lets extend our default options with any overrides
      this.options = {
        container: '.menu',
        itemSelector: '.menu__item',
        toggleSelector: '.menu--toggle',
        toggleClass: 'menu--is-expanded',
        ...options
      };

      // Cache all menu elements
      this.container = document.querySelector(this.options.container);
      this.items = document.querySelectorAll(this.options.itemSelector);
      this.toggleItem = document.querySelector(this.options.toggleSelector);

      // Setup our inital event bindings
      this.toggleMenu = this.toggleMenu.bind(this);

      this._create();
    }

    // Clean-up and unbind all event handlers
    destroy() {
      this.toggleItem.removeEventListener('click', this.toggleMenu);
    }

    // Create event handlers
    _create() {
      this.toggleItem.addEventListener('click', this.toggleMenu);
    }

    // Toggle the menu expanded class
    toggleMenu() {
      Classes.toggle(this.container, this.options.toggleClass);
      Classes.toggle(this.toggleItem, this.options.toggleClass);
    }

  }

  /*********************************/

  /**
   * Form
   */

  class SignIn {
    constructor() {

      // get our elements
      this._form = document.getElementById('signin-form');
      if (!this._form) { return false; }

      this._formFields = this._form.querySelectorAll('input');
      this._formFieldPassword = this._form.querySelector('[name=password]');

      this._handleSubmit = this._handleSubmit.bind(this);
      this._validate = this._validate.bind(this);
      this._displayError = this._displayError.bind(this);
      this._togglePasswordVisibility = this._togglePasswordVisibility.bind(this);

      this._errorMessages = {
        required: "Your username or password wasn't recognized",
        password: "Your password must be at least 6 characters and contain at least one capital letter and non-alphanumeric character"
      }
      this._errorMessage = document.querySelector('.message--error');

      this._create();
    }

    // unbind our handlers
    destroy() {
      this._form.removeEventListener('submit', this._handleSubmit, false);
    }

    // bind submit handlers
    _create() {
      this._form.addEventListener('submit', this._handleSubmit, false);
      // add focus events to all fields
      [].map.call(this._formFields, function(field) {
        field.addEventListener('focus', this._removeFieldError, false);
      }.bind(this));
      this._form.querySelector('.form__password__toggle-visibility').addEventListener('click', this._togglePasswordVisibility, false);
    }

    // Handle submit and validate form before sending
    _handleSubmit(e) {
      e.preventDefault();
      let isValid = this._validate();
      if (!isValid) {
        return false;
      }
    }

    // Validate form
    _validate() {

      this._error = false;
      this._errorFields = [];

      // Let's first make sure all required fields are filled out
      let required = this._form.querySelectorAll('[required]');
      let verifyRequired = [].reduce.call(required, function(accum, field) {
                              if (!field.value.trim()) {
                                this._errorFields.push(field);
                                accum = false;
                              }
                              return accum;
                            }.bind(this), true);
      if (!verifyRequired) {
        this._error = 'required';
        this._displayError();
        return false;
      }

      // Next lets confirm that our password is valid
      let verifyPassword = this._form.querySelector('[name=password]').value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{6,}/);
      if (!verifyPassword) {
        this._errorFields.push(this._form.querySelector('[name=password]'));
        this._error = 'password';
        this._displayError();
        return false;
      }

      return true;
    }

    // Display error message
    _displayError() {
      this._errorMessage.textContent = this._errorMessages[this._error];
      this._errorFields.map(function(field) {
        Classes.add(field.parentElement, 'form__label--error');
      })

      // Show our error message
      let visibleClass = 'message--is-visible';
      Classes.add(this._errorMessage, visibleClass);

      // Remove the error message after a few second
      setTimeout(function hideMessage() {
        Classes.remove(this._errorMessage, visibleClass);
      }.bind(this), 5 * 1000);
    }

    // Clear error classes on field focus
    _removeFieldError(e) {
      Classes.remove(e.target.parentElement, 'form__label--error');
    }

    // Toggle password field from hidden to visible
    _togglePasswordVisibility() {
      let type = this._formFieldPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      this._formFieldPassword.setAttribute('type', type)
    }

  }


  /**
   * Application
   *
   * This is our main application class and load our required components
   */

  class App {
    constructor() {
      this.menu = new Menu();
      this.signIn = new SignIn();
    }
  }

  // Initialize our App
  var app = new App();

}())
