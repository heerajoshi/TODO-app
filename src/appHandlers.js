const fs = require("fs");
const bodyParser = require("body-parser");
const { Users } = require("./entities/users");
const { TodoList } = require("./entities/todoList");
const { Todo } = require("./entities/todo");
const { readParameters, parseUrl, decrypt } = require("./appUtil");

const {
  USER_ACCOUNTS_FILE,
  FILE_NOT_FOUND_STATUS,
  TODO_TEMPLATE,
  HOME_PAGE,
  DASHBOARD_TEMPLATE,
  UTF8,
  TODO_ID,
  INVALID_PASSWORD,
  TODO_TITLE,
  DESCRIPTION,
  SIGNUP_PAGE,
  SESSIONS_PATH,
  EXISTING_USER_REGEXP,
  EXISTING_USER_MESSAGE
} = require("./constants");

const todoHtml = fs.readFileSync(TODO_TEMPLATE, UTF8);
const homePage = fs.readFileSync(HOME_PAGE, UTF8);
const signupPage = fs.readFileSync(SIGNUP_PAGE, UTF8);
const userDashBoard = fs.readFileSync(DASHBOARD_TEMPLATE, UTF8);

const updateSessionsFile = function() {
  fs.writeFile(SESSIONS_PATH, JSON.stringify(sessions), UTF8, () => {});
};

const readSessions = () => {
  let sessions = fs.readFileSync(SESSIONS_PATH, UTF8);
  if (sessions == "") {
    sessions = JSON.stringify({});
    updateSessionsFile();
  }
  return JSON.parse(sessions);
};

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
  const userId = sessions[req.headers.cookie];
  users.addTodo(userId, todo);
  updateAccountsFile(users.accounts);
  const newTodoId = users.getTodoList(userId).length - 1;
  res.redirect(`/userTodo?todoId=${newTodoId}`);
};

/**
 * add task to tasks of a user's specified todos list.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const addTask = function(req, res) {
  const { task, todoId } = JSON.parse(req.body);
  const userId = sessions[req.headers.cookie];
  users.addTask(userId, todoId, decrypt(task));
  const currentTasks = users.getTodo(userId, todoId).tasks;
  updateAccountsFile(users.accounts);
  res.send(JSON.stringify(currentTasks));
};

/**
 *Serves the dashboard html.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveDashBoard = function(req, res) {
  res.send(userDashBoard);
};

/**
 * Serves the todo list(array) of a user
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveTodoTitles = function(req, res) {
  const userId = sessions[req.headers.cookie];
  const todoList = users.getTodoList(userId);
  res.send(JSON.stringify(todoList));
};

/**
 * Serves the home page html.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveHomePage = function(req, res) {
  const reqCookie = req.headers.cookie;
  if (sessions[reqCookie]) {
    res.redirect("/dashboard");
    return;
  }
  let renderedHomePage = homePage.replace(INVALID_PASSWORD, "");
  res.send(renderedHomePage);
};

/**
 * Serves the todo page by rendering the todo html template.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveTodoPage = function(req, res) {
  const { todoId } = parseUrl(req.url);
  const userId = sessions[req.headers.cookie];
  const todo = users.getTodo(userId, todoId);
  if (!todo) {
    res.status(404).send("Invalid Request");
    return;
  }
  let modifiedTodo = todoHtml.replace(TODO_TITLE, decrypt(todo.title));
  modifiedTodo = modifiedTodo.replace(DESCRIPTION, decrypt(todo.description));
  modifiedTodo = modifiedTodo.replace(TODO_ID, +todoId + 1);
  res.send(modifiedTodo);
};

/**
 * Serves the sign up html.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveSignUpPage = function(req, res) {
  let modifiedSignUpPage = signupPage.replace(EXISTING_USER_REGEXP, "");
  res.send(modifiedSignUpPage);
};

/**
 * Serves the tasks(array) of a user's todo.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const getTasks = function(req, res) {
  const { todoId } = JSON.parse(req.body);
  const userId = sessions[req.headers.cookie];
  const tasks = users.getTodo(userId, todoId).tasks;
  res.send(JSON.stringify(tasks));
};

/**
 * Serves a redirect response to the specified todo page.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const openTodo = function(req, res) {
  const todoId = readParameters(req.body).id;
  res.redirect(`/userTodo?todoId=${todoId}`);
};

/**
 * Deletes the specified todo and serves a redirect response to dashboard.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const deleteTodo = function(req, res) {
  const titleId = readParameters(req.body).id;
  const userId = sessions[req.headers.cookie];
  users.deleteTodo(userId, titleId);
  updateAccountsFile(users.accounts);
  res.redirect("/dashboard");
};

/**
 * Deletes the specified item and serves a redirect response to dashboard.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const deleteItem = function(req, res) {
  const { itemId, todoId } = readParameters(req.body);
  const userId = sessions[req.headers.cookie];
  users.deleteItem(userId, +todoId, +itemId);
  updateAccountsFile(users.accounts);
  res.redirect(`/userTodo?todoId=${todoId}`);
};

/**
 * Toogles and serves the status of specified task.
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const toggleStatus = function(req, res) {
  const { taskId, todoId } = JSON.parse(req.body);
  const userId = sessions[req.headers.cookie];
  users.toggleStatus(userId, todoId, taskId);
  const currentStatus = users.getStatus(userId, todoId, taskId);
  updateAccountsFile(users.accounts);
  res.send(currentStatus.toString());
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

const serveSignUpError = function(req, res) {
  let modifiedSignUpPage = signupPage.replace(
    EXISTING_USER_REGEXP,
    EXISTING_USER_MESSAGE
  );
  res.send(modifiedSignUpPage);
};

const handleSignUp = function(req, res) {
  const todoList = new TodoList([]);
  const newUser = readParameters(req.body);
  userId = newUser.userId;
  if (users.accounts[userId]) {
    serveSignUpError(req, res);
    return;
  }
  users.addUser(newUser, todoList);
  updateAccountsFile(users.accounts);
  res.redirect("/");
};

const editTask = function(req, res) {
  const { task, todoId, taskId } = readParameters(req.body);
  const userId = sessions[req.headers.cookie];
  users.editTask(userId, todoId, decrypt(task), taskId);
  updateAccountsFile(users.accounts);
  res.redirect(`/userTodo?todoId=${todoId}`);
};

const users = new Users(readUserDetails());
const sessions = readSessions();

loadInstances();

module.exports = {
  readBody,
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
  users,
  updateSessionsFile,
  sessions
};
