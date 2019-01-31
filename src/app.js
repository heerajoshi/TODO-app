const { ReqSequenceHandler } = require("./express");
const {
  readBody,
  serveFile,
  logRequest,
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
  serveTodoPage,
  editTask
} = require("./appHandlers.js");

const app = new ReqSequenceHandler();

app.use(logRequest);
app.use(readBody);
app.get("/", serveHomePage);
app.get("/todoList", serveTodoTitles);
app.get("/signUp", serveSignUpPage);
app.get("/dashboard", serveDashBoard);
app.get("/todo.html", serveTodoPage);
app.post("/login", handleLogIn);
app.post("/handleSignUp", handleSignUp);
app.post("/addTask", addTask);
app.post("/addTodo", addTodo);
app.post("/openTodo", openTodo);
app.post("/deleteTodo", deleteTodo);
app.post("/deleteItem", deleteItem);
app.post("/toggleStatus", toggleStatus);
app.post("/getTasks", getTasks);
app.post("/editTask", editTask);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
