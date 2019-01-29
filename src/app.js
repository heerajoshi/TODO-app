const fs = require("fs");
const { ReqSequenceHandler } = require("./express");
const { send, readParameters, parseTitleId, redirect } = require("./appUtil");
const { Users } = require("./users");
const { TodoList } = require("./todoList");
const { Todo } = require("./todo");
const {
  USER_ACCOUNTS_FILE,
  FILE_NOT_FOUND_STATUS,
  INDEX_FILE,
  URL_PREFIX,
  TODO_TEMPLATE,
  HOME_PAGE,
  DASHBOARD_TEMPLATE,
  UTF8,
  TODO_ID,
  INVALID_PASSWORD,
  TODO_TITLE,
  DESCRIPTION
} = require("./constants");

const todoHtml = fs.readFileSync(TODO_TEMPLATE, UTF8);
const homePage = fs.readFileSync(HOME_PAGE, UTF8);
const userDashBoard = fs.readFileSync(DASHBOARD_TEMPLATE, UTF8);

const readUserDetails = () => {
  const users = fs.readFileSync(USER_ACCOUNTS_FILE, UTF8);
  return JSON.parse(users);
};

const loadInstances = function() {
  Object.keys(users.accounts).forEach(userId => {
    let newTodoList = new TodoList([]);
    users.accounts[userId].todoList.list.forEach(todo => {
      const newTodo = new Todo(todo);
      todo.tasks.forEach(task => newTodo.addTask(task.description));
      newTodoList.addTodo(newTodo, todo.id);
    });
    users.addTodoList(userId, newTodoList);
  });
};

const logRequest = function(req, res, next) {
  console.log(req.url, req.method);
  next();
};

const getFilePath = function(url) {
  if (url == "/") return INDEX_FILE;
  return URL_PREFIX + url;
};

const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => (content += chunk));

  req.on("end", () => {
    req.body = content;
    next();
  });
};

const serveFile = function(req, res) {
  const filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      send(res, "", FILE_NOT_FOUND_STATUS);
      return;
    }
    send(res, content);
  });
};

const updateAccountsFile = function(users) {
  fs.writeFile(USER_ACCOUNTS_FILE, JSON.stringify(users, null, 2), error => {});
};

const handleSignUp = function(req, res) {
  const todoList = new TodoList([]);
  const newUser = readParameters(req.body);
  userName = newUser.userName;
  users.addUser(newUser, todoList);
  updateAccountsFile(users.accounts);
  serveHomePage(req, res);
};

const addTodo = function(req, res) {
  const todo = readParameters(req.body);
  todo.tasks = [];
  users.addTodo("user1", todo);
  updateAccountsFile(users.accounts);
  const newTodoId = users.getTodoList("user1").length - 1;
  serveTodoPage(req, res, newTodoId);
};

/**
 * add items to tasks
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const addTask = function(req, res) {
  const todoId = parseTitleId(req.url);
  users.addTask("user1", todoId, req.body);
  const currentTasks = users.getTodo("user1", todoId).tasks;
  // console.log(currentTasks);
  updateAccountsFile(users.accounts);
  send(res, JSON.stringify(currentTasks));
};

/**
 *Serves the todo page at 'todo.html' as request's url
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveErrorMassage = function(req, res) {
  let error = `Invalid username or password`;
  let renderedHomePage = homePage.replace(INVALID_PASSWORD, error);
  send(res, renderedHomePage);
};

const serveDashBoard = function(req, res) {
  send(res, userDashBoard);
};

const serveTodoTitles = function(req, res) {
  const todoList = users.getTodoList("user1");
  send(res, JSON.stringify(todoList));
};

const handleLogIn = function(req, res) {
  const newUser = readParameters(req.body);
  if (users.isUserValid(newUser)) {
    redirect(res, "/userDashboard.html", 302);
    return;
  }
  serveErrorMassage(req, res);
};

const serveHomePage = function(req, res) {
  let renderedHomePage = homePage.replace(INVALID_PASSWORD, "");
  send(res, renderedHomePage);
};

const serveTodoPage = function(req, res, todoId) {
  const todo = users.getTodo("user1", todoId);
  let modifiedTodo = todoHtml.replace(TODO_TITLE, todo.title);
  modifiedTodo = modifiedTodo.replace(DESCRIPTION, todo.description);
  modifiedTodo = modifiedTodo.replace(TODO_ID, todoId);
  send(res, modifiedTodo);
};

const getTasks = function(req, res) {
  const todoId = parseTitleId(req.url);
  const tasks = users.getTodo("user1", todoId).tasks;
  send(res, JSON.stringify(tasks));
};

const openTodo = function(req, res) {
  const titleId = readParameters(req.body).id;
  console.log(titleId);

  serveTodoPage(req, res, titleId);
};

const deleteTodo = function(req, res) {
  const titleId = readParameters(req.body).id;
  users.deleteTodo("user1", titleId);
  redirect(res, "/userDashboard.html", 302);
  updateAccountsFile(users.accounts);
};

const deleteItem = function(req, res) {
  const { itemId, todoId } = readParameters(req.body);
  users.deleteItem("user1", todoId, itemId);
  serveTodoPage(req, res, todoId);
  // updateAccountsFile(users.accounts);
};

const app = new ReqSequenceHandler();
const users = new Users(readUserDetails());
loadInstances();

app.use(logRequest);
app.use(readBody);
app.get("/", serveHomePage);
app.get("/todo.html", serveTodoPage);
app.post("/dashboard", handleLogIn);
app.post("/signUp", handleSignUp);
app.post(/\/addTask/, addTask);
app.post("/addTodo", addTodo);
app.post("/openTodo", openTodo);
app.post("/deleteTodo", deleteTodo);
app.post("/deleteItem", deleteItem);
app.get("/todoList", serveTodoTitles);
app.get(/\/getTasks/, getTasks);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
