const createDiv = function(className, visibleData) {
  let mainDiv = document.createElement("div");
  mainDiv.class = className;
  mainDiv.innerHTML = visibleData;
  return mainDiv;
};

const createOpenForm = function() {
  let form = document.createElement("form");
  form.action = "/openTodo";
  form.method = "POST";
  return form;
};
const createDeleteForm = function() {
  let form = document.createElement("form");
  form.action = "/deleteTodo";
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
  childs.forEach(child => {
    console.log(child);
    parent.appendChild(child);
  });
  console.log(parent.innerHTML);
};

const createDashboard = function(content) {
  const titles = document.getElementById("titles");
  let id = 0;
  const todoTitles = content
    .map(todo => {
      currentId = id++;
      const mainDiv = createDiv("todo", "");
      const titleDiv = createDiv("title", todo.title);
      const openForm = createOpenForm();
      const deleteForm = createDeleteForm();
      const openFormInput = createHiddenInput("id", currentId);
      const deleteFormInput = createHiddenInput("id", currentId);
      const openButton = createButton("Open");
      const deleteButton = createButton("Delete");

      appendChild(openForm, [titleDiv, openButton, openFormInput]);
      appendChild(deleteForm, [deleteFormInput, deleteButton]);
      appendChild(mainDiv, [openForm, deleteForm]);
      return mainDiv.innerHTML;
    })
    .join("");
  titles.innerHTML = todoTitles;
};

const renderDashboard = function() {
  fetch("/todoList")
    .then(response => response.json())
    .then(createDashboard);
};

const initialise = function() {
  renderDashboard();
};

window.onload = initialise;
