const fs = require("fs");
const { Users } = require("./entities/users");
const { TodoList } = require("./entities/todoList");
const { Todo } = require("./entities/todo");
const {
  send,
  readParameters,
  redirect,
  parseTitleId,
  decrypt
} = require("./appUtil");
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

/**
 * Adds a todo to the particular todos list of a specified user.
 * @param {object} req - http request
 * @param {object} res - http response
 */

const addTodo = function(req, res) {
  const { title, description } = readParameters(req.body);
  const todoDetails = {
    title: decrypt(title),
    description: decrypt(description)
  };
  const todo = new Todo(todoDetails);
  users.addTodo("user1", todo);
  updateAccountsFile(users.accounts);
  const newTodoId = users.getTodoList("user1").length - 1;
  redirect(res, `/userTodo?todoId=${newTodoId}`);
};

/**
 * add task to tasks of a user's specified todos list.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const addTask = function(req, res) {
  const { task, todoId } = JSON.parse(req.body);
  users.addTask("user1", todoId, decrypt(task));
  const currentTasks = users.getTodo("user1", todoId).tasks;
  updateAccountsFile(users.accounts);
  send(res, JSON.stringify(currentTasks));
};

/**
 *Serves the dashboard html.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveDashBoard = function(req, res) {
  send(res, userDashBoard);
};

/**
 * Serves the todo list(array) of a user
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveTodoTitles = function(req, res) {
  const todoList = users.getTodoList("user1");
  send(res, JSON.stringify(todoList));
};

/**
 * Serves the home page html.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveHomePage = function(req, res) {
  let renderedHomePage = homePage.replace(INVALID_PASSWORD, "");
  send(res, renderedHomePage);
};

/**
 * Serves the todo page by rendering the todo html template.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveTodoPage = function(req, res) {
  const todoId = parseTitleId(req.url);
  const todo = users.getTodo("user1", todoId);
  let modifiedTodo = todoHtml.replace(TODO_TITLE, decrypt(todo.title));
  modifiedTodo = modifiedTodo.replace(DESCRIPTION, decrypt(todo.description));
  modifiedTodo = modifiedTodo.replace(TODO_ID, todoId + 1);
  send(res, modifiedTodo);
};

/**
 * Serves the sign up html.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveSignUpPage = function(req, res) {
  send(res, signupPage);
};

/**
 * Serves the tasks(array) of a user's todo.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const getTasks = function(req, res) {
  const { todoId } = JSON.parse(req.body);
  const tasks = users.getTodo("user1", todoId).tasks;
  send(res, JSON.stringify(tasks));
};

/**
 * Serves a redirect response to the specified todo page.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const openTodo = function(req, res) {
  const todoId = readParameters(req.body).id;
  redirect(res, `/userTodo?todoId=${todoId}`);
};

/**
 * Deletes the specified todo and serves a redirect response to dashboard.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const deleteTodo = function(req, res) {
  const titleId = readParameters(req.body).id;
  users.deleteTodo("user1", titleId);
  updateAccountsFile(users.accounts);
  redirect(res, "/dashboard");
};

/**
 * Deletes the specified item and serves a redirect response to dashboard.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const deleteItem = function(req, res) {
  const { itemId, todoId } = readParameters(req.body);
  users.deleteItem("user1", +todoId, +itemId);
  updateAccountsFile(users.accounts);
  redirect(res, `/userTodo?todoId=${todoId}`);
};

/**
 * Toogles and serves the status of specified task.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const toggleStatus = function(req, res) {
  const { taskId, todoId } = JSON.parse(req.body);
  users.toggleStatus("user1", todoId, taskId);
  const currentStatus = users.getStatus("user1", todoId, taskId);
  updateAccountsFile(users.accounts);
  send(res, currentStatus.toString());
};

/**
 * Reads the data send in http request and assign it to req.body.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => (content += chunk));

  req.on("end", () => {
    req.body = content;
    next();
  });
};

/**
 *Provide the file path by appending the directory prefix with url.
 * @param {string} url - url of http request
 */

const getFilePath = function(url) {
  if (url == "/") return INDEX_FILE;
  return URL_PREFIX + url;
};

/**
 * Serves the file as per the http request url.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveFile = function(req, res) {
  const filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      send(res, "File Not found", FILE_NOT_FOUND_STATUS);
      return;
    }
    send(res, content);
  });
};

/**
 * Logs the req's url and method.
 * @param {object} req - http request.
 * @param {object} res - http response.
 * @param {function} next - next function reference to be called after this function execution.
 */

const logRequest = function(req, res, next) {
  console.log(req.url, req.method);
  next();
};

/**
 * Writes the users object to the file.
 * @param {object} users
 */

const updateAccountsFile = function(users) {
  fs.writeFile(USER_ACCOUNTS_FILE, JSON.stringify(users, null, 2), error => {});
};

const handleSignUp = function(req, res) {
  const todoList = new TodoList([]);
  const newUser = readParameters(req.body);
  userId = newUser.userId;
  users.addUser(newUser, todoList);
  updateAccountsFile(users.accounts);
  redirect(res, "/");
};

const editTask = function(req, res) {
  const { task, todoId, taskId } = readParameters(req.body);
  users.editTask("user1", todoId, decrypt(task), taskId);
  updateAccountsFile(users.accounts);
  redirect(res, `/userTodo?todoId=${todoId}`);
};

const users = new Users(readUserDetails());
loadInstances();

module.exports = {
  readBody,
  serveFile,
  logRequest,
  updateAccountsFile,
  handleSignUp,
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
  serveTodoPage,
  editTask,
  users
};
