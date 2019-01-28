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

  getTodoList(userId) {
    return this.accounts[userId].todoList.list;
  }

  getTodo(userId, todoIndex) {
    return this.getTodoList(userId)[todoIndex];
  }

  addTodo(userId, todo) {
    this.accounts[userId].todoList.addTodo(todo);
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

// class todo {
//   constructor(title, discription) {
//     this.title = title;
//     this.discription = discription;
//   }
//   addTodo() {}
// }

module.exports = { Users, TodoList };
