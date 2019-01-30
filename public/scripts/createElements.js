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
    parent.appendChild(child);
  });
};
const createDeleteForm = function() {
  let form = document.createElement("form");
  form.id = "deleteForm";
  form.action = "/deleteItem";
  form.method = "POST";
  return form;
};
