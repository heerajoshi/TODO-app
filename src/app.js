const fs = require("fs");
const { ReqSequenceHandler } = require("./req_sequence_handler");
const { send, parseSignUpDetails } = require("./appUtil");
const UserDetails = require("./userDetail");
const {
  USER_ACCOUNTS_FILE,
  REDIRECT_STATUS,
  FILE_NOT_FOUND_STATUS,
  INDEX_FILE,
  URL_PREFIX
} = require("./constants");

const readUserDetails = () => {
  const userDetails = fs.readFileSync(USER_ACCOUNTS_FILE, "utf-8");
  return JSON.parse(userDetails);
};

const app = new ReqSequenceHandler();
const userDetails = new UserDetails(readUserDetails());

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
  let newUser = parseSignUpDetails(req.body);
  userDetails.addUser(newUser);
  updateAccountsFile(userDetails.accounts);
  redirect(res, "/loginPage");
};

app.use(logRequest);
app.use(readBody);
app.post("/signUp", handleSignUp);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
