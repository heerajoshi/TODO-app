const fs = require("fs");
const { ReqSequenceHandler } = require("./req_sequence_handler");
const { send } = require("./appUtil");
const app = new ReqSequenceHandler();

const logRequest = function(req, res, next) {
  console.log(req.url, req.method);
  next();
};

const getFilePath = function(url) {
  if (url == "/") return "./public/index.html";
  return "./public" + url;
};

const serveFile = function(req, res) {
  const filePath = getFilePath(req.url);
  console.log(filePath);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      send(res, "", 404);
      return;
    }
    send(res, content);
  });
};

app.use(logRequest);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
