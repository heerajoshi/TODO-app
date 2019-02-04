const { isMatching } = require("./appUtil.js");

class ReqSequenceHandler {
  constructor() {
    this.routes = [];
  }

  use(handler) {
    this.routes.push({ handler });
  }

  get(url, handler) {
    this.routes.push({ method: "GET", url, handler });
  }

  post(url, handler) {
    this.routes.push({ method: "POST", url, handler });
  }

  error(handler) {
    this.errorRoute = handler;
  }

  handleRequest(req, res) {
    let matchingRoutes = this.routes.filter(route => isMatching(req, route));
    let remaining = [...matchingRoutes];

    let next = () => {
      let current = remaining[0];
      if (!current) return;
      remaining = remaining.slice(1);
      current.handler(req, res, next);
    };
    next();
  }
}

// module.exports = { ReqSequenceHandler };
