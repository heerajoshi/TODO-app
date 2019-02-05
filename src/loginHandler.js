const fs = require("fs");
const { HOME_PAGE, UTF8, INVALID_PASSWORD } = require("./constants");
const { redirect, readParameters, send, parseTitleId } = require("./appUtil");
const {
  users,
  serveHomePage,
  sessions,
  updateSessionsFile
} = require("./appHandlers");
const homePage = fs.readFileSync(HOME_PAGE, UTF8);

const serveErrorMessage = function(req, res) {
  let error = `Invalid userId or password`;
  let renderedHomePage = homePage.replace(INVALID_PASSWORD, error);
  res.send(renderedHomePage);
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
  res.cookie(`sessionId`, `${cookie}`);
  res.redirect("/dashboard");
};

const handleLogIn = function(req, res) {
  const newUser = readParameters(req.body);
  if (users.isUserValid(newUser)) {
    return renderHomePage(res, newUser.userId);
  }
  serveErrorMessage(req, res);
};

const urls = [
  "/",
  "/styleSheet.css",
  "/favicon.ico",
  "/login",
  "/signUp",
  "/handleSignUp"
];

const isUserLoggedIn = function(reqCookie, url) {
  return sessions[reqCookie] || urls.includes(url);
};

const checkCookies = function(req, res, next) {
  const reqCookie = req.cookies.sessionId;
  if (isUserLoggedIn(reqCookie, req.url)) {
    next();
    return;
  }
  res.redirect("/");
};

const deleteSession = function(sessionId) {
  delete sessions[sessionId];
  updateSessionsFile();
};

const handleLogout = function(req, res) {
  deleteSession(req.cookies.sessionId);
  const expiryDate = new Date().toUTCString();
  res.setHeader("Set-Cookie", `session=;expires=${expiryDate}`);
  res.redirect("/");
};

module.exports = { handleLogIn, checkCookies, handleLogout };
