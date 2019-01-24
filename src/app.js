const fs = require("fs");
const { ReqSequenceHandler } = require("./req_sequence_handler");
const { send, parseSignUpDetails } = require("./appUtil");
const UserDetails = require("./userDetail");
const { userAccountsFile } = require("./constants");

const readUserDetails = () => {
  const userDetails = fs.readFileSync(userAccountsFile, "utf-8");
  return JSON.parse(userDetails);
};

const app = new ReqSequenceHandler();
const userDetails = new UserDetails(readUserDetails());

const logRequest = function(req, res, next) {
  console.log(req.url, req.method);
  next();
};

const getFilePath = function(url) {
  if (url == "/") return "./public/index.html";
  return "./public" + url;
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
      send(res, "", 404);
      return;
    }
    send(res, content);
  });
};

const updateAccountsFile = function(userDetails) {
  fs.writeFile(userAccountsFile, JSON.stringify(userDetails), error => {});
};

const redirect = function(res, url) {
  res.statusCode = 302;
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
