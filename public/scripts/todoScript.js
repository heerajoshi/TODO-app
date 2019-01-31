const createDiv = function(className, visibleData) {
  let mainDiv = document.createElement("div");
  mainDiv.className = className;
  mainDiv.innerHTML = visibleData;
  return mainDiv;
};

const createDeleteForm = function() {
  let form = document.createElement("form");
  form.id = "deleteForm";
  form.className = "deleteForm";
  form.action = "/deleteItem";
  form.method = "POST";
  return form;
};

const createHiddenInput = function(name, id) {
  const input = createInput(name, id);
  input.type = "hidden";
  return input;
};

const createInput = function(name, id) {
  const input = document.createElement("input");
  input.value = id;
  input.name = name;
  return input;
};

const createButton = function(value) {
  const button = document.createElement("button");
  button.innerHTML = value;
  button.className = value;
  return button;
};

const showEditForm = function(id) {
  console.log(document.getElementById("edit_" + id));
  document.getElementById("edit_" + id).style.visibility = "visible";
};

const createEditButton = function(value, taskId) {
  const button = createButton(value);
  button.onclick = showEditForm.bind(null, taskId);
  return button;
};

const toggleStatus = function(taskId) {
  const todoId = document.getElementById("todoId").innerHTML;
  const setStatusOnClick = setTaskStatus.bind(null, event.target);
  fetch(`/toggleStatus`, {
    method: "POST",
    body: JSON.stringify({ taskId, todoId })
  })
    .then(response => response.text())
    .then(setStatusOnClick);
};

const createEditForm = function(id) {
  let form = document.createElement("form");
  form.id = "edit_" + id;
  form.action = "/editTask";
  form.method = "POST";
  form.className = "editForm";
  return form;
};

const setTaskStatus = function(element, status) {
  const textDecorations = { true: "line-through", false: "none" };
  element.style.textDecoration = textDecorations[status];
};

const createDescriptionBlock = function(className, task, taskId) {
  const descriptionDiv = document.createElement("p");
  descriptionDiv.innerText = task.description;
  descriptionDiv.id = taskId;
  descriptionDiv.className = className;
  setTaskStatus(descriptionDiv, task.status);
  descriptionDiv.onclick = toggleStatus.bind(null, taskId);
  return descriptionDiv;
};

const appendChildren = function(parent, childs) {
  childs.forEach(child => parent.appendChild(child));
};

const createElements = function(currentId, todoId, task) {
  const mainDiv = createDiv("task", "");
  const descriptionDiv = createDescriptionBlock("description", task, currentId);
  const deleteForm = createDeleteForm();
  const editForm = createEditForm(currentId);
  const hiddenEditBox = createInput("task", currentId);
  const hiddenEditItemId = createHiddenInput("taskId", currentId);
  const hiddenEditTodoId = createHiddenInput("todoId", todoId);
  const hiddenItemId = createHiddenInput("itemId", currentId);
  const hiddenTodoId = createHiddenInput("todoId", todoId);
  const deleteButton = createButton("delete");
  const saveButton = createButton("save");
  const editButton = createEditButton("edit", currentId);
  appendChildren(editForm, [
    hiddenEditBox,
    saveButton,
    hiddenEditItemId,
    hiddenEditTodoId
  ]);
  appendChildren(deleteForm, [hiddenItemId, hiddenTodoId, deleteButton]);
  appendChildren(mainDiv, [descriptionDiv, deleteForm, editButton, editForm]);
  return mainDiv;
};

const updateItemsDiv = function(items) {
  const todoId = document.getElementById("todoId").innerHTML;
  const itemsDiv = document.getElementById("TODOItems");
  itemsDiv.innerHTML = "";
  let jsonContent = JSON.parse(items);
  let id = 0;
  let list = jsonContent.map(task => {
    let currentId = id++;
    return createElements(currentId, todoId, task);
  });
  document.getElementById("item").value = "";
  appendChildren(itemsDiv, list);
};

const updateTODO = function() {
  const task = document.getElementById("item").value;
  const todoId = document.getElementById("todoId").innerHTML;
  fetch(`/addTask`, { method: "POST", body: JSON.stringify({ task, todoId }) })
    .then(response => response.text())
    .then(updateItemsDiv);
};

const getTasks = function() {
  const todoId = document.getElementById("todoId").innerHTML;

  fetch(`/getTasks`, {
    method: "POST",
    body: JSON.stringify({ todoId })
  })
    .then(response => response.text())
    .then(updateItemsDiv);
};

const initialise = function() {
  const addItemButton = document.getElementById("addItem");
  addItemButton.onclick = updateTODO;
  getTasks();
};

window.onload = initialise;
