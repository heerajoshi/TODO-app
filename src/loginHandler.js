const fs = require("fs");
const {
  SESSIONS_PATH,
  HOME_PAGE,
  UTF8,
  INVALID_PASSWORD
} = require("./constants");
const { redirect, readParameters, send } = require("./appUtil");
const { users, serveHomePage } = require("./appHandlers");
const homePage = fs.readFileSync(HOME_PAGE, UTF8);

const readSessions = () => {
  let sessions = fs.readFileSync(SESSIONS_PATH, UTF8);
  if (sessions == "") {
    sessions = JSON.stringify({});
    fs.writeFileSync(SESSIONS_PATH, sessions);
  }
  return JSON.parse(sessions);
};

const serveErrorMessage = function(req, res) {
  let error = `Invalid userId or password`;
  let renderedHomePage = homePage.replace(INVALID_PASSWORD, error);
  send(res, renderedHomePage);
};

const addSession = function(userId, cookie) {
  sessions[cookie] = userId;
  fs.writeFile(
    "./private/sessions.json",
    JSON.stringify(sessions, null, 2),
    error => {}
  );
};

const renderHomePage = function(res, userId) {
  const cookie = new Date().getTime();
  addSession(userId, cookie);
  res.setHeader("Set-Cookie", `session=${cookie}`);
  redirect(res, "/dashboard", 302);
};

const handleLogIn = function(req, res) {
  const newUser = readParameters(req.body);
  if (users.isUserValid(newUser)) {
    return renderHomePage(res, newUser.userId);
  }
  serveErrorMessage(req, res);
};

const checkCookies = function(req, res, next) {
  const reqCookie = req.headers.cookie;
  console.log(reqCookie, 'mat');
  if (sessions[reqCookie]) {
    next();
    return;
  }
  redirect(res, "/", 302);
};

const sessions = readSessions();

module.exports = { handleLogIn, checkCookies };
