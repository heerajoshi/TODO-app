const assert = require("assert");
const { UserDetails, TodoList } = require("../src/userDetail");

describe("UserDetails", function() {
  beforeEach(() => {
    userDetails = new UserDetails({});
  });

  describe("UserDetails.add", function() {
    it("should update the UserDetails with newUser and its todoList", function() {
      const newUser = { userName: "user1", password: "1234" };
      const todoList = {};
      const expectedDetails = {
        user1: {
          password: "1234",
          todoList: {}
        }
      };

      userDetails.addUser(newUser, todoList);

      assert.deepEqual(userDetails.accounts, expectedDetails);
    });
  });

  describe("UserDetails.getTodoList", function() {
    it("should return  todo list of specified user", function() {
      const newUser = { userName: "user1", password: "1234" };
      const todoList = { list: [] };

      userDetails.addUser(newUser, todoList);

      assert.deepEqual(userDetails.getTodoList("user1"), []);
    });
  });

  describe("UserDetails.addTodo", function() {
    it("should update the todotasks with provided todo", function() {
      const newUser = { userName: "user1", password: "1234" };
      const todoList = new TodoList();
      const todo = { title: "work", description: "office", tasks: [] };

      userDetails.addUser(newUser, todoList);
      userDetails.addTodo("user1", todo);

      const expectedTodoList = [
        { title: "work", description: "office", tasks: [] }
      ];

      const actualTodoList = userDetails.getTodoList("user1");

      assert.deepEqual(expectedTodoList, actualTodoList);
    });
  });
});
