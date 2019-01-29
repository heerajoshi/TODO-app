class TodoList {
  constructor(list) {
    this.list = list;
  }

  addTodo(todo, id) {
    todo.id = id;
    this.list.push(todo);
  }

  deleteTodo(todoId) {
    this.list = this.list.filter(todo => todoId != todo.id);
    console.log(this.list);
  }
}

module.exports = { TodoList };
