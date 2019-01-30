class Todo {
  constructor(todoDetails) {
    this.title = todoDetails.title;
    this.tasks = [];
    this.description = todoDetails.description;
  }

  deleteTask(taskId) {
    this.tasks.splice(taskId, 1);
  }

  addTask(description) {
    const taskObject = { description, status: false };
    this.tasks.push(taskObject);
  }

  toggleStatus(taskId) {
    this.tasks[taskId].status = !this.getStatus(taskId);
  }

  getStatus(taskId) {
    return this.tasks[taskId].status;
  }
}

module.exports = { Todo };
