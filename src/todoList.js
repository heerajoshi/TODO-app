class TodoList {
  constructor(list) {
    this.list = list;
  }

  addTodo(todo) {
    this.list.push(todo);
  }

  deleteTodo(todoId) {
    this.list.splice(todoId, 1);
  }
}

module.exports = { TodoList };
