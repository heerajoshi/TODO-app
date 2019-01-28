const fs = require("fs");
const { ReqSequenceHandler } = require("./req_sequence_handler");
const { send, parseSignUpDetails } = require("./appUtil");
const { Users, TodoList } = require("./users");
const {
  USER_ACCOUNTS_FILE,
  FILE_NOT_FOUND_STATUS,
  INDEX_FILE,
  URL_PREFIX,
  TODO_TEMPLATE,
  HOME_PAGE,
  DASHBOARD_TEMPLATE,
  UTF8
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
    users.accounts[userId].todoList = new TodoList(
      users.accounts[userId].todoList.list
    );
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
  fs.writeFile(USER_ACCOUNTS_FILE, JSON.stringify(users), error => {});
};

const handleSignUp = function(req, res) {
  const todoList = new TodoList([]);
  const newUser = parseSignUpDetails(req.body);
  userName = newUser.userName;
  users.addUser(newUser, todoList);
  updateAccountsFile(users.accounts);
  serveHomePage(req, res);
};

const addTodo = function(req, res) {
  let todo = parseSignUpDetails(req.body);
  todo.tasks = [];
  users.addTodo("user1", todo);
  updateAccountsFile(users.accounts);
  serveTodoPage(req, res);
};

/**
 * add items to tasks
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const addItems = function(req, res) {
  let currentTodoTasks = users.getTodo("user1", 0).tasks;
  currentTodoTasks.push(req.body);
  updateAccountsFile(users.accounts);
  send(res, JSON.stringify(currentTodoTasks));
};

/**
 *Serves the todo page at 'todo.html' as request's url
 * @param {object} req - http request.
 * @param {object} res - http response.
 */

const serveTodoPage = function(req, res) {
  let tasks = users.getTodo("user1", 0).tasks;
  let itemsHtml = tasks.map(item => `<li>${item}</li>`).join("");
  let modifiedTodo = todoHtml.replace("###TODO_items###", itemsHtml);
  send(res, modifiedTodo);
};

const isValidUser = function(newUser) {
  if (users.accounts[newUser.userName]) {
    return users.accounts[newUser.userName].password === newUser.password;
  }
  return false;
};

const serveErrorMassage = function(req, res) {
  let error = `Invalid username or password`;
  let renderedHomePage = homePage.replace("###invalid_password###", error);
  send(res, renderedHomePage);
};

const handleLogIn = function(req, res) {
  const newUser = parseSignUpDetails(req.body);
  if (isValidUser(newUser)) {
    send(res, userDashBoard);
    return;
  }
  serveErrorMassage(req, res);
};

const serveHomePage = function(req, res) {
  let renderedHomePage = homePage.replace("###invalid_password###", "");
  send(res, renderedHomePage);
};

const app = new ReqSequenceHandler();
const users = new Users(readUserDetails());
loadInstances();

app.use(logRequest);
app.use(readBody);
app.get("/", serveHomePage);
app.get("/todo.html", serveTodoPage);
app.post("/login", handleLogIn);
app.post("/signUp", handleSignUp);
app.post("/addItems", addItems);
app.post("/addTodo", addTodo);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
