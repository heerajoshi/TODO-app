const fs = require("fs");
const { Users } = require("./entities/users");
const { TodoList } = require("./entities/todoList");
const { Todo } = require("./entities/todo");
const { send, readParameters, redirect } = require("./appUtil");
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
  DESCRIPTION,
  SIGNUP_PAGE
} = require("./constants");

const todoHtml = fs.readFileSync(TODO_TEMPLATE, UTF8);
const homePage = fs.readFileSync(HOME_PAGE, UTF8);
const signupPage = fs.readFileSync(SIGNUP_PAGE, UTF8);
const userDashBoard = fs.readFileSync(DASHBOARD_TEMPLATE, UTF8);

const readUserDetails = () => {
  let users = fs.readFileSync(USER_ACCOUNTS_FILE, UTF8);
  if (users == "") {
    users = JSON.stringify({});
    fs.writeFileSync(USER_ACCOUNTS_FILE, users);
  }
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

const addTodo = function(req, res) {
  const todoDetails = readParameters(req.body);
  const todo = new Todo(todoDetails);
  users.addTodo("user1", todo);
  updateAccountsFile(users.accounts);
  const newTodoId = users.getTodoList("user1").length - 1;
  serveTodoPage(req, res, newTodoId);
};

const decrypt = data => {
  return unescape(data).replace(/\+/g, " ");
};

/**
 * add items to tasks
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const addTask = function(req, res) {
  const { task, todoId } = JSON.parse(req.body);
  users.addTask("user1", todoId, task);
  const currentTasks = users.getTodo("user1", todoId).tasks;
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
    redirect(res, "/dashboard", 302);
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
  let modifiedTodo = todoHtml.replace(TODO_TITLE, decrypt(todo.title));
  modifiedTodo = modifiedTodo.replace(DESCRIPTION, decrypt(todo.description));
  modifiedTodo = modifiedTodo.replace(TODO_ID, todoId);
  send(res, modifiedTodo);
};

const serveSignUpPage = function(req, res) {
  send(res, signupPage);
};

const getTasks = function(req, res) {
  const { todoId } = JSON.parse(req.body);
  const tasks = users.getTodo("user1", todoId).tasks;
  send(res, JSON.stringify(tasks));
};

const openTodo = function(req, res) {
  const titleId = readParameters(req.body).id;
  serveTodoPage(req, res, titleId);
};

const deleteTodo = function(req, res) {
  const titleId = readParameters(req.body).id;
  users.deleteTodo("user1", titleId);
  updateAccountsFile(users.accounts);
  redirect(res, "/dashboard", 302);
};

const deleteItem = function(req, res) {
  const { itemId, todoId } = readParameters(req.body);
  users.deleteItem("user1", +todoId, +itemId);
  updateAccountsFile(users.accounts);
  serveTodoPage(req, res, +todoId);
};

const toggleStatus = function(req, res) {
  const { taskId, todoId } = JSON.parse(req.body);
  console.log(taskId, todoId);
  users.toggleStatus("user1", todoId, taskId);
  const currentStatus = users.getStatus("user1", todoId, taskId);
  updateAccountsFile(users.accounts);
  send(res, currentStatus.toString());
};

const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => (content += chunk));

  req.on("end", () => {
    req.body = content;
    next();
  });
};

const getFilePath = function(url) {
  if (url == "/") return INDEX_FILE;
  return URL_PREFIX + url;
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

const logRequest = function(req, res, next) {
  console.log(req.url, req.method);
  next();
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
  redirect(res, "/", 302);
};

const users = new Users(readUserDetails());
loadInstances();

module.exports = {
  readBody,
  serveFile,
  logRequest,
  updateAccountsFile,
  handleSignUp,
  handleLogIn,
  serveDashBoard,
  toggleStatus,
  deleteItem,
  deleteTodo,
  openTodo,
  addTask,
  addTodo,
  serveTodoTitles,
  serveHomePage,
  serveSignUpPage,
  getTasks,
  serveTodoPage
};
