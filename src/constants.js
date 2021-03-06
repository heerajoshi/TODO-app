const USER_ACCOUNTS_FILE = "./private/users.json";
const REDIRECT_STATUS = 302;
const FILE_NOT_FOUND_STATUS = 404;
const INDEX_FILE = "./public/index.html";
const URL_PREFIX = "./public";
const TODO_TEMPLATE = "./src/templates/todo.html";
const HOME_PAGE = "./public/index.html";
const DASHBOARD_TEMPLATE = "./public/userDashboard.html";
const UTF8 = "utf-8";
const TODO_ID = "###id###";
const TODO_ITEMS = "###TODO_items###";
const INVALID_PASSWORD = "###invalid_password###";
const TODO_TITLE = "###title###";
const DESCRIPTION = "###description###";
const SIGNUP_PAGE = "./public/signUp.html";
const SESSIONS_PATH = "./private/sessions.json";
const EXISTING_USER_REGEXP = " ###user name  already define###";
const EXISTING_USER_MESSAGE = "username is already exists";

module.exports = {
  USER_ACCOUNTS_FILE,
  REDIRECT_STATUS,
  FILE_NOT_FOUND_STATUS,
  INDEX_FILE,
  URL_PREFIX,
  TODO_TEMPLATE,
  HOME_PAGE,
  DASHBOARD_TEMPLATE,
  UTF8,
  TODO_ID,
  TODO_ITEMS,
  INVALID_PASSWORD,
  TODO_TITLE,
  DESCRIPTION,
  SIGNUP_PAGE,
  SESSIONS_PATH,
  EXISTING_USER_REGEXP,
  EXISTING_USER_MESSAGE
};
