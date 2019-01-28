const isMatching = (req, route) => {
  if (route.method && req.method != route.method) return false;
  if (route.url instanceof RegExp && route.url.test(req.url)) return true;
  if (route.url && req.url != route.url) return false;
  return true;
};

const send = (res, content, statusCode = 200) => {
  res.write(content);
  res.statusCode = statusCode;
  res.end();
};

const parseSignUpDetails = signUpDetails => {
  let args = {};
  const splitKeyValue = pair => pair.split("=");
  const assignKeyValueToArgs = ([key, value]) => (args[key] = value);
  signUpDetails
    .split("&")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
};

module.exports = { isMatching, send, parseSignUpDetails };
