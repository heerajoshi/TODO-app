class UserDetails {
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
    this.accounts[userId].todoList.list.push(todo);
  }
}

class TodoList {
  constructor() {
    this.list = [];
  }

  addTodo(todo) {
    this.list.push(todo);
  }
}

// class todo {
//   constructor(title, discription) {
//     this.title = title;
//     this.discription = discription;
//   }
//   addTodo() {}
// }

module.exports = { UserDetails, TodoList };
