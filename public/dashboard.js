const createDashboard = function(content) {
  const titles = document.getElementById("titles");
  const todoTitles = content.map(createTodoListHtml).join("");
  titles.innerHTML = todoTitles;
};

const createTodoListHtml = function(todo) {
  return `<div class="todo"><form action = '/openTodo' method = 'POST'>
    <input type='hidden' name= "id" value = ${todo.id}></input>
      <p>${todo.title}<button>Open</button></p></form>
      <form action = '/deleteTodo' method = 'POST'>
    <input type='hidden' name= "id" value =${todo.id} ></input>
      <p><button>Delete</button></p>
      </form></div>`;
};

const renderDashboard = function() {
  fetch("/dashboard")
    .then(response => response.json())
    .then(createDashboard);
};

const initialise = function() {
  renderDashboard();
};

window.onload = initialise;
