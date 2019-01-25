const assert = require("assert");
const { ReqSequenceHandler } = require("../src/req_sequence_handler");

const mockHandler = (req, res, next) => {
  next();
};

describe("reqSequenceHandler", function() {
  beforeEach(() => {
    reqSequenceHandler = new ReqSequenceHandler();
  });

  describe("reqSequenceHandler.use", function() {
    it("should update the routes with a single key object ie handler", function() {
      reqSequenceHandler.use(mockHandler);

      assert.deepEqual(reqSequenceHandler.routes, [{ handler: mockHandler }]);
    });
  });

  describe("reqSequenceHandler.get", function() {
    it("should update routes with an object of  method (get) and  a handler", function() {
      reqSequenceHandler.get("/", mockHandler);
      let expectedRoutes = [{ method: "GET", url: "/", handler: mockHandler }];

      assert.deepEqual(reqSequenceHandler.routes, expectedRoutes);
    });
  });

  describe("reqSequenceHandler.post", function() {
    it("should update routes with an object of  method (post) and  a handler", function() {
      reqSequenceHandler.post("/", mockHandler);
      let expectedRoutes = [{ method: "POST", url: "/", handler: mockHandler }];

      assert.deepEqual(reqSequenceHandler.routes, expectedRoutes);
    });
  });

  describe("reqSequenceHandler.error", function() {
    it("should update the error route as mockHandler", function() {
      reqSequenceHandler.error(mockHandler);

      assert.deepEqual(reqSequenceHandler.errorRoute, mockHandler);
    });
  });
});
