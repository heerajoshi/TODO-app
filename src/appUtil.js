const isMatching = (req, route) => {
  if (route.method && req.method != route.method) return false;
  if (route.url instanceof RegExp && route.url.test(req.url)) return true;
  if (route.url && req.url != route.url) return false;
  return true;
};

const readParameters = parameters => {
  let args = {};
  const splitKeyValue = pair => pair.split("=");
  const assignKeyValueToArgs = ([key, value]) => (args[key] = value);
  parameters
    .split("&")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
};

const parseUrl = function(url) {
  const args = url.split("?")[1];
  return readParameters(args);
};

const decrypt = data => {
  const decryptedData = unescape(data).replace(/\+/g, " ");
  return decryptedData.trim();
};

module.exports = {
  isMatching,
  readParameters,
  parseUrl,
  parseUrl,
  decrypt
};
