const createDashboard = function(content) {
  const titles = document.getElementById("titles");
  let id = 0;
  const todoTitles = content
    .map(title => {
      id = id++;
      return `<form action = '/openTodo?${id}' method = 'POST'>
        <p>${title}<button>Open</button></p></form>
        <form action = '/deleteTodo?${id}' method = 'POST'>
        <button>Delete</button>
        </form>`;
    })
    .join("");
  titles.innerHTML = todoTitles;
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
