const assert = require("assert");
const { send, parseSignUpDetails } = require("../src/appUtil");

describe("send", function() {
  beforeEach(() => {
    res = {
      write: content => {
        res.body = content;
      },
      body: "",
      statusCode: "",
      end: () => {}
    };
  });

  it("should return statusCode as 200", function() {
    send(res, "");
    assert.equal(res.statusCode, 200);
  });

  it("should change body of res object with the provided content", function() {
    send(res, "userId: Joshi");
    assert.equal(res.body, "userId: Joshi");
  });
});

describe("parseSignUpDetails", function() {
  it("it should return a object of parse input data", function() {
    const userDetail = "userId=kannu&password=hello";
    const expected = { userId: "kannu", password: "hello" };
    assert.deepEqual(parseSignUpDetails(userDetail), expected);
  });
});



