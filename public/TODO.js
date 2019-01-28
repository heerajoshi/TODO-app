const updateItemsDiv = function(items) {
  const todoId = document.getElementById("todoId").innerHTML;
  const itemsDiv = document.getElementById("TODOItems");
  let jsonContent = JSON.parse(items);
  let id = 0;
  let list = jsonContent
    .map(
      item =>
        `<li>${item}</li><form action = '/deleteItem' method = 'POST'>
        <input type = hidden name = "itemId" value =${id++} ></input>
        <input type = hidden name = "todoId" value = ${todoId}></input>
        <button>delete</button></form>`
    )
    .join("");
  itemsDiv.innerHTML = list;
};

const updateTODO = function() {
  const item = document.getElementById("item").value;
  const todoId = document.getElementById("todoId").innerHTML;

  fetch(`/addItems?id=${todoId}`, { method: "POST", body: item })
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
