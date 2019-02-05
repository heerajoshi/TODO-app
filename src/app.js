const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const {
  readBody,
  logRequest,
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
  readSessions
} = require("./appHandlers.js");

const { handleLogIn, checkCookies, handleLogout } = require("./loginHandler");
app.sessions = readSessions();

app.use(logRequest);
app.use(readBody);
app.use(cookieParser());
app.use(checkCookies);
app.get("/", serveHomePage);
app.post("/handleSignUp", handleSignUp);
app.get("/todoList", serveTodoTitles);
app.get("/signUp", serveSignUpPage);
app.get("/dashboard", serveDashBoard);
app.get("/userTodo?/", serveTodoPage);
app.post("/logout", handleLogout);
app.post("/login", handleLogIn);
app.post("/addTask", addTask);
app.post("/addTodo", addTodo);
app.post("/openTodo", openTodo);
app.post("/deleteTodo", deleteTodo);
app.post("/deleteItem", deleteItem);
app.post("/toggleStatus", toggleStatus);
app.post("/getTasks", getTasks);
app.post("/editTask", editTask);
app.use(express.static("./public"));

module.exports = app;
