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
    return this.getTodoList(userId).filter(todo => todo.id == todoId)[0];
  }

  getId(userId) {
    const latestId = this.getTodoList(userId).length;
    let newId = 0;
    if (latestId) {
      let latestTodo = this.getTodo(userId, latestId - 1);
      newId = latestTodo.id + 1;
    }
    return newId;
  }

  addTodo(userId, todo) {
    const id = this.getId(userId);
    this.accounts[userId].todoList.addTodo(todo, id);
  }

  deleteTodo(userId, todoId) {
    this.accounts[userId].todoList.deleteTodo(todoId);
  }

  deleteItem(userId, todoId, itemId) {
    this.getTodo(userId, todoId).tasks.splice(itemId, 1);
  }

  getTitles(userId) {
    return this.getTodoList(userId).map(todo => todo.title);
  }
}

// class todo {
//   constructor(title, discription) {
//     this.title = title;
//     this.discription = discription;
//   }
//   addTodo() {}
// }

module.exports = { Users };
