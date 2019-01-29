class Todo {
  constructor(todoDetails) {
    this.title = todoDetails.title;
    this.tasks = [];
    this.description = todoDetails.description;
  }
  getTaskId() {
    const totalTasks = this.tasks.length;
    let newId = 0;
    if (totalTasks) {
      const latestTask = this.tasks[totalTasks - 1];
      newId = latestTask.id + 1;
    }
    return newId;
  }

  addTask(description) {
    const id = this.getTaskId();
    const taskObject = { description, id, status: true };
    console.log(this.tasks);
    this.tasks.push(taskObject);
    console.log(this.tasks);

  }
}

module.exports = { Todo };
