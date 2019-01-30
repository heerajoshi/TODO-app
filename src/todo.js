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

  // markTask(taskId) {
  //   this.tasks[taskId].status =
  //   this.tasks.map(task => {
  //     if (task.id == taskId) {
  //       task.status = true;
  //     }
  //   });
  // }
}

module.exports = { Todo };
