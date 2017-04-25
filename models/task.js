var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define schema for a task object.
var taskSchema = new Schema({
    text: String,
    completed: Boolean
});

// Sets the schema for task object.
var Task = mongoose.model('Task', taskSchema);

module.exports = Task;