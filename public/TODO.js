const createDiv = function(className, visibleData) {
  let mainDiv = document.createElement("div");
  mainDiv.class = className;
  mainDiv.innerHTML = visibleData;
  return mainDiv;
};

const createDeleteForm = function() {
  let form = document.createElement("form");
  form.id = "deleteForm";
  form.action = "/deleteItem";
  form.method = "POST";
  return form;
};

const createHiddenInput = function(name, id) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = id;
  return input;
};

const createButton = function(value) {
  const button = document.createElement("button");
  button.innerHTML = value;
  return button;
};

const appendChild = function(parent, childs) {
  childs.forEach(child => parent.appendChild(child));
};

const updateItemsDiv = function(items) {
  const todoId = document.getElementById("todoId").innerHTML;
  const itemsDiv = document.getElementById("TODOItems");
  let jsonContent = JSON.parse(items);
  let id = 0;
  let list = jsonContent
    .map(task => {
      let currentId = id++;
      const mainDiv = createDiv("task", "");
      const descriptionDiv = createDiv("description", task.description);
      const deleteForm = createDeleteForm();
      const hiddenItemId = createHiddenInput("itemId", currentId);
      const hiddenTodoId = createHiddenInput("todoId", todoId);
      const button = createButton("delete");
      appendChild(deleteForm, [hiddenItemId, hiddenTodoId, button]);
      appendChild(mainDiv, [descriptionDiv, deleteForm]);
      return mainDiv.innerHTML;
    })
    .join("");
  document.getElementById("item").value = "";
  itemsDiv.innerHTML = list;
};

const updateTODO = function() {
  const item = document.getElementById("item").value;
  const todoId = document.getElementById("todoId").innerHTML;

  fetch(`/addTask?id=${todoId}`, { method: "POST", body: item })
    .then(response => response.text())
    .then(updateItemsDiv);
};

const getTasks = function() {
  const todoId = document.getElementById("todoId").innerHTML;

  fetch(`/getTasks?id=${todoId}`)
    .then(response => response.text())
    .then(updateItemsDiv);
};

const initialise = function() {
  const addItemButton = document.getElementById("addItem");
  addItemButton.onclick = updateTODO;
  getTasks();
};

window.onload = initialise;
