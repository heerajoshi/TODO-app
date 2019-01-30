const createDashboard = function(content) {
  const titles = document.getElementById("titles");
  let id = 0;
  const todoTitles = content
    .map(todo => {
      currentId = id++;
      return `<div class="todo"><form action = '/openTodo' method = 'POST'>
  <input type='hidden' name= "id" value = ${currentId}></input>
    <p>${todo.title}<button>Open</button></p></form>
    <form action = '/deleteTodo' method = 'POST'>
  <input type='hidden' name= "id" value =${currentId} ></input>
    <p><button>Delete</button></p>
    </form></div>`;
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
