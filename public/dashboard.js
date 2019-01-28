const createDashboard = function(content) {
  const titles = document.getElementById("titles");
  let id = 0;
  const todoTitles = content
    .map(
      title =>
        `<form action = '/openTodo?${id++}' method = 'POST'>
        <p>${title}<button>Open todo</button></p></form>`
    )
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
