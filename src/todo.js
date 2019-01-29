class Todo {
  constructor(todoDetails) {
    this.title = todoDetails.title;
    this.tasks = [];
    this.description = todoDetails.description;
  }
  getTaskId() {
    const totalTasks = this.tasks.length;
    let newId = 0;
    if (latestId) {
      const latestTask = this.tasks[totalTasks - 1];
      newId = latestTask.id + 1;
    }
    return newId;
  }

  addTask(task) {
    const id = this.getTaskId();
    const task = { task, id, status: true };
    this.tasks.push(task);
  }
}

module.exports = { Todo };
