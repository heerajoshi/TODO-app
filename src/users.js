class Users {
  constructor(userAccounts) {
    this.accounts = userAccounts;
  }

  addUser(newUser, todoList) {
    this.accounts[newUser.userName] = {
      password: newUser.password,
      todoList: todoList
    };
  }

  addTodoList(userId, todoList) {
    this.accounts[userId].todoList = todoList;
  }

  isUserValid(newUser) {
    if (this.accounts[newUser.userName]) {
      return this.accounts[newUser.userName].password === newUser.password;
    }
    return false;
  }

  getTodoList(userId) {
    return this.accounts[userId].todoList.list;
  }

  getTodo(userId, todoId) {
    return this.getTodoList(userId)[todoId];
  }

  addTodo(userId, todo) {
    this.accounts[userId].todoList.addTodo(todo);
  }

  addTask(userId, todoId, task) {
    this.getTodo(userId, todoId).addTask(task);
  }

  deleteTodo(userId, todoId) {
    this.accounts[userId].todoList.deleteTodo(todoId);
  }

  deleteItem(userId, todoId, itemId) {
    this.getTodo(userId, todoId).deleteTask(itemId);
  }

  toggleStatus(userId, todoId, taskId) {
    this.getTodo(userId, todoId).toggleStatus(taskId);
  }

  getStatus(userId, todoId, taskId) {
    return this.getTodo(userId, todoId).getStatus(taskId);
  }

  getTitles(userId) {
    return this.getTodoList(userId).map(todo => todo.title);
  }
}

module.exports = { Users };
