const form = document.querySelector('#form');
const container = document.querySelector('.container');
const settingsBtn = document.querySelector('#settings');
const settingsList = document.querySelector('.settings-list');
const settingsFontFamily = document.querySelector('.font-family');
const help = document.querySelector('.help');
const textHelp = document.querySelector('.text-help');
const taskInput = document.querySelector('.input');
const taskEnter = document.querySelector('.enter');
const tasksList = document.querySelector('.task-list');
const deleteAll = document.querySelector('.delete-all');

let tasks = [];

settingsBtn.addEventListener('click', settingsTodo);
settingsFontFamily.addEventListener('click', fontFamily);
help.addEventListener('click', helpFunction);
deleteAll.addEventListener('click', deleteAllTasks);
form.addEventListener('submit', addTask);


if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
}


if (localStorage.getItem("newFont")) {
  container.classList.add(localStorage.getItem("newFont"));
}


// Settings of todo-list
function settingsTodo(event) {
  if (!event.target.matches('#settings')) {
    for (let i = 0; i < settingsList.length; i++) {
      let openMenu = settingsList[i];
      if (openMenu.classList.contains('show')) {
        openMenu.classList.remove('show');
      }
    }
  }
  settingsList.classList.toggle("show");
}

// Font family selection
function fontFamily() {
  let boxFontsFamily = document.querySelector('.box-fonts-family');
  let fontCourgette = document.querySelector('.font-courgette');
  let fontPeralta = document.querySelector('.font-peralta');
  let fontCaveat = document.querySelector('.font-caveat');
  let fontDefault = document.querySelector('.font-default');


  fontCourgette.onclick = function (event) {
    if (event.target.contains(fontCourgette)) {
      container.className = 'container font-courgette';
    } else {
      return '';
    }
    localStorage.setItem("newFont", "font-courgette");
  }

  fontPeralta.onclick = function (event) {
    if (event.target.contains(fontPeralta)) {
      container.className = "container font-peralta";
    } else {
      return '';
    }
    localStorage.setItem("newFont", "font-peralta");
  }

  fontCaveat.onclick = function (event) {
    if (event.target.contains(fontCaveat)) {
      container.className = "container font-caveat";
    } else {
      return '';
    }

    localStorage.setItem("newFont", "font-caveat");
  }

  fontDefault.onclick = function (event) {
    if (event.target.contains(fontDefault)) {
      container.className = "container font-default";
    } else {
      return '';
    }

    localStorage.setItem("newFont", "font-default");
  }

  boxFontsFamily.classList.toggle("show");

}

function helpFunction() {
  textHelp.classList.toggle('show');
}

function addTask(event) {

  // Cancel form submission
  event.preventDefault();

  // Get the text of the task from the input field We 
  const taskText = taskInput.value;


  // Describing the task as an object
  const newTask = {
    id: Date.now(),
    text: taskText,
    check: false,
  };


  if (taskInput.matches('input') && taskInput.value !== '') {
    setTimeout(() => {
      alertify.success('Task added!');
    }, 100);

    // Add a task to the array with tasks
    tasks.push(newTask);

    // Render task on the page
    renderTask(newTask);

    // Saving the list of tasks in the browser's localStorage
    saveToLocalStorage();

  }
  else {
    alertify.error('Enter a task!');
  }


  // Clearing the input field and returning focus to it
  taskInput.value = '';
  taskInput.focus();
}

function checkTask(event) {

  // Determine the task ID and deleting a task through array filtering
  const parentNode = event.target.closest('li');
  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.check = !task.check;

  saveToLocalStorage();

  parentNode.classList.toggle('todo-task--checked');

  if (task.check) {
    setTimeout(() => {
      alertify.success('Task done!')
    }, 150);
  }
  else {
    setTimeout(() => {
      alertify.warning('Task not done!')
    }, 150);
  }
}

function deleteTask(event) {

  // Determine the task ID and deleting a task through array filtering
  const parentNode = event.target.closest('li');
  const id = Number(parentNode.id);
  tasks = tasks.filter((task) => task.id !== id);

  saveToLocalStorage();

  parentNode.remove();

  setTimeout(() => {
    alertify.success('Task deleted!')
  }, 200);
}

function deleteAllTasks() {
  tasks = [];

  saveToLocalStorage();
  tasksList.innerHTML = JSON.parse(localStorage.getItem('tasks'));

  setTimeout(() => {
    alertify.success('All tasks deleted!')
  }, 200);

}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

function renderTask(task) {

  // Create elements
  let li = document.createElement('li');
  let p = document.createElement('p');

  let boxAllBtn = document.createElement('div');
  let boxCheckBtn = document.createElement('div');
  let boxEditBtn = document.createElement('div');
  let boxDeleteBtn = document.createElement('div');

  let checkBtn = document.createElement('button');
  let editBtn = document.createElement('button');
  let deleteBtn = document.createElement('button');

  let tooltipCheck = document.createElement('span');
  let tooltipEdit = document.createElement('span');
  let tooltipDelete = document.createElement('span');

  let imgCheck = document.createElement('img');
  let imgEdit = document.createElement('img');
  let imgDelete = document.createElement('img');

  
  p.innerHTML = `${task.text}`;
  tooltipCheck.innerHTML = 'Check';
  tooltipEdit.innerHTML = 'Edit';
  tooltipDelete.innerHTML = 'Delete';

  // Forming the relationship of child elements with parent
  tasksList.appendChild(li);
  li.append(p, boxAllBtn);

  boxAllBtn.append(boxCheckBtn, boxEditBtn, boxDeleteBtn);

  boxCheckBtn.appendChild(checkBtn);
  boxEditBtn.appendChild(editBtn);
  boxDeleteBtn.appendChild(deleteBtn);

  checkBtn.append(imgCheck, tooltipCheck);
  editBtn.append(imgEdit, tooltipEdit);
  deleteBtn.append(imgDelete, tooltipDelete);

  // Forming element attributes
  li.setAttribute('id', `${task.id}`);
  imgCheck.setAttribute('src', './img/check.svg');
  imgEdit.setAttribute('src', './img/pencil-svgrepo-com.svg');
  imgDelete.setAttribute('src', './img/delete.svg');

  // Forming CSS Element Classes
  const taskStyle = task.check ? 'task todo-task--checked' : 'todo-task';

  li.className = `${taskStyle}`;
  p.className = 'text-task';
  boxAllBtn.className = 'box-buttons-task';
  checkBtn.className = 'check';
  editBtn.className = 'edit';
  deleteBtn.className = 'delete';
  tooltipCheck.className = 'tooltip-check';
  tooltipEdit.className = 'tooltip-edit';
  tooltipDelete.className = 'tooltip-delete';

  // Attach an event listener on buttons 
  checkBtn.addEventListener('click', checkTask);
  deleteBtn.addEventListener('click', deleteTask);

  editBtn.addEventListener('click', () => {
    li = p.parentNode;
    if ('edit') {
      const inputEdit = document.createElement('textarea');
      li.appendChild(inputEdit);

      inputEdit.type = 'text';
      inputEdit.value = p.textContent;
      inputEdit.className = 'inputEdit';
      li.insertBefore(inputEdit, p);

      // Create a save button
      let saveBtn = document.createElement('button');
      let imgSave = document.createElement('img');

      saveBtn.className = 'save';

      imgSave.setAttribute('src', './img/red-check-mark-icon.svg');

      boxAllBtn.appendChild(saveBtn);
      saveBtn.appendChild(imgSave);

      // Remove unnecessary buttons
      editBtn.classList.add('invisibility');
      checkBtn.classList.add('invisibility');
      deleteBtn.classList.add('invisibility');

      p.style.display = 'none';
      inputEdit.focus();

      // Save of task
      saveBtn.addEventListener('click', (event) => {
        if ('save') {
          const inputEdit = li.firstElementChild;
          li.appendChild(p);

          p.textContent = inputEdit.value;
          li.insertBefore(p, inputEdit);

          const parentNode = event.target.closest('li');
          const id = Number(parentNode.id);
          const task = tasks.find((task) => task.id === id);
          task.text = inputEdit.value;

          saveToLocalStorage();

          li.removeChild(inputEdit);

          saveBtn.classList.add('invisibility');
          editBtn.classList.remove('invisibility');
          deleteBtn.classList.remove('invisibility');
          checkBtn.classList.remove('invisibility');

          p.style.display = '';

          setTimeout(() => {
            alertify.success('Task edited!')
          }, 100);

        }
      });
    }
  });


  return {
    li, p, boxAllBtn, boxCheckBtn,
    boxEditBtn, boxDeleteBtn,
    checkBtn, editBtn, deleteBtn
  }
}
