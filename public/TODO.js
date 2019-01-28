const updateItemsDiv = function(items) {
  const itemsDiv = document.getElementById("TODOItems");
  let jsonContent = JSON.parse(items);
  let list = jsonContent.map(item => `<li>${item}</li>`).join("");
  itemsDiv.innerHTML = list;
};

const updateTODO = function() {
  const item = document.getElementById("item").value;
  const todoId = document.getElementById("todoId").innerHTML;

  fetch(`/addItems?${todoId}`, { method: "POST", body: item })
    .then(response => response.text())
    .then(updateItemsDiv);
};

const initialise = function() {
  const addItemButton = document.getElementById("addItem");
  addItemButton.onclick = updateTODO;
};

window.onload = initialise;
