const fs = require("fs");
const { ReqSequenceHandler } = require("./req_sequence_handler");
const { send, parseSignUpDetails } = require("./appUtil");
const { UserDetails, TodoList } = require("./userDetail");
const {
  USER_ACCOUNTS_FILE,
  REDIRECT_STATUS,
  FILE_NOT_FOUND_STATUS,
  INDEX_FILE,
  URL_PREFIX
} = require("./constants");

const todoHtml = fs.readFileSync("./src/templates/todo.html", "utf-8");

const readUserDetails = () => {
  const userDetails = fs.readFileSync(USER_ACCOUNTS_FILE, "utf-8");
  return JSON.parse(userDetails);
};

const loadInstances = function() {
  Object.keys(userDetails.accounts).forEach(userId => {
    console.log(userDetails.accounts[userId]);
    userDetails.accounts[userId].todoList = new TodoList(
      userDetails.accounts[userId].todoList.list
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

const updateAccountsFile = function(userDetails) {
  fs.writeFile(USER_ACCOUNTS_FILE, JSON.stringify(userDetails), error => {});
};

const redirect = function(res, url) {
  res.statusCode = REDIRECT_STATUS;
  res.setHeader("location", url);
  res.end();
};

const handleSignUp = function(req, res) {
  const todoList = new TodoList([]);
  const newUser = parseSignUpDetails(req.body);
  userDetails.addUser(newUser, todoList);
  updateAccountsFile(userDetails.accounts);
  redirect(res, "/loginPage");
};

const addTodo = function(req, res) {
  let todo = parseSignUpDetails(req.body);
  todo.tasks = [];
  userDetails.addTodo("user1", todo);
  updateAccountsFile(userDetails.accounts);
  serveTodoPage(req, res);
};

const addItems = function(req, res) {
  let currentTodoTasks = userDetails.getTodo("user1", 0).tasks;
  currentTodoTasks.push(req.body);
  updateAccountsFile(userDetails.accounts);
  send(res, JSON.stringify(currentTodoTasks));
};

const serveTodoPage = function(req, res) {
  let tasks = userDetails.getTodo("user1", 0).tasks;
  let itemsHtml = tasks.map(item => `<li>${item}</li>`).join("");
  let modifiedTodo = todoHtml.replace("###TODO_items###", itemsHtml);
  send(res, modifiedTodo);
};

const app = new ReqSequenceHandler();
const userDetails = new UserDetails(readUserDetails());
loadInstances();

app.use(logRequest);
app.use(readBody);
app.get("/todo.html", serveTodoPage);
app.post("/signUp", handleSignUp);
app.post("/addItems", addItems);
app.post("/addTodo", addTodo);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
