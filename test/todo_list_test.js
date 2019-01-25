const assert = require("assert");
const { TodoList } = require("../src/userDetail");

describe("todoList", function() {
  beforeEach(() => {
    todoList = new TodoList();
  });

  describe("todoList.add", function() {
    it("should update the todoList with provided todo", function() {
      todoList.addTodo({ title: "work", description: "MY todo", tasks: [] });

      assert.deepEqual(todoList.list, [
        { title: "work", description: "MY todo", tasks: [] }
      ]);
    });
  });
});
